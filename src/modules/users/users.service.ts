// src/modules/users/users.service.ts
import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    // Cek username sudah ada
    const existingUsername = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    
    if (existingUsername) {
      throw new ConflictException(`Username ${createUserDto.username} sudah digunakan`);
    }
    
    // Cek email sudah ada
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    
    if (existingEmail) {
      throw new ConflictException(`Email ${createUserDto.email} sudah digunakan`);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Buat user baru
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    const savedUser = await this.usersRepository.save(user);
    
    // Hilangkan password dari response
    const { password, ...result } = savedUser;
    
    this.logger.log(`User baru dibuat: ${result.username} (${result.id})`);
    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<any> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    
    if (search) {
      queryBuilder.where(
        '(user.username LIKE :search OR user.email LIKE :search OR user.fullName LIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const [users, total] = await queryBuilder.getManyAndCount();
    
    // Hilangkan password dari response
    const safeUsers = users.map(user => {
      const { password, refreshToken, ...result } = user;
      return result;
    });
    
    return {
      data: safeUsers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }
    
    // Hilangkan password dari response
    const { password, refreshToken, ...result } = user;
    
    return result;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }
    
    // Jika email diubah, cek sudah dipakai belum
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      
      if (existingEmail) {
        throw new ConflictException(`Email ${updateUserDto.email} sudah digunakan`);
      }
    }
    
    // Jika password diubah, hash password baru
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    // Update properti user
    Object.assign(user, updateUserDto);
    
    const updatedUser = await this.usersRepository.save(user);
    
    // Hilangkan password dari response
    const { password, refreshToken, ...result } = updatedUser;
    
    this.logger.log(`User diperbarui: ${result.username} (${result.id})`);
    return result;
  }

  async remove(id: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }
    
    // Jangan izinkan menghapus admin terakhir
    if (user.role === 'admin') {
      const adminCount = await this.usersRepository.count({
        where: { role: 'admin' },
      });
      
      if (adminCount <= 1) {
        throw new BadRequestException('Tidak dapat menghapus admin terakhir');
      }
    }
    
    await this.usersRepository.remove(user);
    
    // Hilangkan password dari response
    const { password, refreshToken, ...result } = user;
    
    this.logger.log(`User dihapus: ${result.username} (${result.id})`);
    return result;
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.usersRepository.update(userId, {
      refreshToken,
      lastLogin: new Date(),
    });
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user || !user.refreshToken) {
      return false;
    }
    
    return user.refreshToken === refreshToken;
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      refreshToken: null,
    });
  }
}