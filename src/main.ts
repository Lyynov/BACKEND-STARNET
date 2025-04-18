// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  const configService = app.get(ConfigService);
  
  // Global pipes - validate incoming requests
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  // Global filters - handle exceptions
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
  );
  
  // Middlewares
  app.use(helmet());
  app.use(compression());
  
  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGINS', '*').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Star Access ISP Management API')
    .setDescription('API for PPPoE ISP Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'Admin users management')
    .addTag('customers', 'ISP customers management')
    .addTag('pppoe', 'PPPoE profiles and users')
    .addTag('radius', 'RADIUS server integration')
    .addTag('mikrotik', 'Mikrotik router integration')
    .addTag('vouchers', 'Voucher system management')
    .addTag('packages', 'Service packages management')
    .addTag('billing', 'Billing and payment system')
    .addTag('monitoring', 'System monitoring')
    .addTag('reports', 'Reports generation')
    .addTag('dashboard', 'Dashboard statistics')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Start the server
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();