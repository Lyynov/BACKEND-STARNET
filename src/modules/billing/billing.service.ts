// src/modules/billing/billing.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Payment } from './entities/payment.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private customersService: CustomersService,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<any> {
    // Verify customer exists
    await this.customersService.findById(createInvoiceDto.customerId);
    
    // Generate invoice number
    const date = new Date();
    const yearMonth = date.getFullYear().toString() + 
                     (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Find the highest invoice number for this month
    const latestInvoice = await this.invoiceRepository.findOne({
      where: {
        invoiceNumber: Between(`INV-${yearMonth}-0001`, `INV-${yearMonth}-9999`),
      },
      order: { invoiceNumber: 'DESC' },
    });
    
    let invoiceNumber: string;
    
    if (latestInvoice) {
      // Extract sequence number and increment
      const currentSequence = parseInt(latestInvoice.invoiceNumber.split('-')[2]);
      invoiceNumber = `INV-${yearMonth}-${(currentSequence + 1).toString().padStart(4, '0')}`;
    } else {
      // First invoice of the month
      invoiceNumber = `INV-${yearMonth}-0001`;
    }
    
    // Calculate due date (default: 14 days)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    
    // Create invoice
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      invoiceNumber,
      status: 'unpaid',
      dueDate: createInvoiceDto.dueDate || dueDate,
      total: createInvoiceDto.items.reduce((sum, item) => sum + item.amount, 0),
    });
    
    const savedInvoice = await this.invoiceRepository.save(invoice);
    
    // Create invoice items
    const items = createInvoiceDto.items.map(item => 
      this.invoiceItemRepository.create({
        ...item,
        invoiceId: savedInvoice.id,
      })
    );
    
    await this.invoiceItemRepository.save(items);
    
    // Get full invoice with items
    const fullInvoice = await this.invoiceRepository.findOne({
      where: { id: savedInvoice.id },
      relations: ['items'],
    });
    
    this.logger.log(`Created invoice: ${invoiceNumber} for customer ID: ${createInvoiceDto.customerId}`);
    return fullInvoice;
  }

  async findAllInvoices(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<any> {
    const where = status ? { status } : {};
    
    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where,
      relations: ['items'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: invoices,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findInvoiceById(id: string): Promise<any> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['items', 'payments'],
    });
    
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    
    return invoice;
  }

  async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<any> {
    const invoice = await this.findInvoiceById(id);
    
    // Don't allow updating paid or canceled invoices
    if (invoice.status === 'paid' || invoice.status === 'canceled') {
      throw new BadRequestException(`Cannot update invoice with status: ${invoice.status}`);
    }
    
    // Update basic invoice properties
    if (updateInvoiceDto.dueDate) invoice.dueDate = updateInvoiceDto.dueDate;
    if (updateInvoiceDto.note) invoice.note = updateInvoiceDto.note;
    
    // Update items if provided
    if (updateInvoiceDto.items && updateInvoiceDto.items.length > 0) {
      // Remove existing items
      await this.invoiceItemRepository.delete({ invoiceId: id });
      
      // Add new items
      const items = updateInvoiceDto.items.map(item => 
        this.invoiceItemRepository.create({
          ...item,
          invoiceId: id,
        })
      );
      
      await this.invoiceItemRepository.save(items);
      
      // Recalculate total
      invoice.total = updateInvoiceDto.items.reduce((sum, item) => sum + item.amount, 0);
    }
    
    const updatedInvoice = await this.invoiceRepository.save(invoice);
    
    // Get full invoice with items
    const fullInvoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['items', 'payments'],
    });
    
    this.logger.log(`Updated invoice: ${invoice.invoiceNumber}`);
    return fullInvoice;
  }

  async cancelInvoice(id: string): Promise<any> {
    const invoice = await this.findInvoiceById(id);
    
    // Don't allow canceling paid invoices
    if (invoice.status === 'paid') {
      throw new BadRequestException('Cannot cancel paid invoice');
    }
    
    invoice.status = 'canceled';
    await this.invoiceRepository.save(invoice);
    
    this.logger.log(`Canceled invoice: ${invoice.invoiceNumber}`);
    return invoice;
  }

  async recordPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    const invoice = await this.findInvoiceById(createPaymentDto.invoiceId);
    
    // Don't allow payments on canceled invoices
    if (invoice.status === 'canceled') {
      throw new BadRequestException('Cannot pay canceled invoice');
    }
    
    // Calculate amount paid so far
    const amountPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Check if payment amount is valid
    if (createPaymentDto.amount > (invoice.total - amountPaid)) {
      throw new BadRequestException('Payment amount exceeds remaining balance');
    }
    
    // Create payment record
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      paidAt: new Date(),
    });
    
    const savedPayment = await this.paymentRepository.save(payment);
    
    // Update invoice status if fully paid
    if (amountPaid + createPaymentDto.amount >= invoice.total) {
      invoice.status = 'paid';
      await this.invoiceRepository.save(invoice);
    }
    
    this.logger.log(`Recorded payment of ${createPaymentDto.amount} for invoice: ${invoice.invoiceNumber}`);
    return {
      payment: savedPayment,
      invoiceStatus: invoice.status,
    };
  }

  async findInvoicesByCustomerId(
    customerId: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<any> {
    const where: any = { customerId };
    if (status) where.status = status;
    
    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where,
      relations: ['items', 'payments'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: invoices,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOverdueInvoices(): Promise<number> {
    const today = new Date();
    
    const result = await this.invoiceRepository.update(
      {
        status: 'unpaid',
        dueDate: LessThan(today),
      },
      {
        status: 'overdue',
      }
    );
    
    this.logger.log(`Marked ${result.affected} invoices as overdue`);
    return result.affected || 0;
  }

  async getBillingStats(): Promise<any> {
    const totalInvoices = await this.invoiceRepository.count();
    const unpaidInvoices = await this.invoiceRepository.count({ where: { status: 'unpaid' } });
    const paidInvoices = await this.invoiceRepository.count({ where: { status: 'paid' } });
    const overdueInvoices = await this.invoiceRepository.count({ where: { status: 'overdue' } });
    const canceledInvoices = await this.invoiceRepository.count({ where: { status: 'canceled' } });
    
    // Calculate total revenue from paid invoices
    const paidInvoicesList = await this.invoiceRepository.find({ where: { status: 'paid' } });
    const totalRevenue = paidInvoicesList.reduce((sum, invoice) => sum + invoice.total, 0);
    
    // Calculate outstanding amount
    const unpaidInvoicesList = await this.invoiceRepository.find({ 
      where: [{ status: 'unpaid' }, { status: 'overdue' }] 
    });
    const outstandingAmount = unpaidInvoicesList.reduce((sum, invoice) => sum + invoice.total, 0);
    
    return {
      totalInvoices,
      unpaidInvoices,
      paidInvoices,
      overdueInvoices,
      canceledInvoices,
      totalRevenue,
      outstandingAmount,
    };
  }
}