

// src/core/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    let message: string | string[] = exception.message;
    
    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      message = exceptionResponse['message'];
    }
    
    // Log 4xx client errors at warn level
    if (status >= 400 && status < 500) {
      this.logger.warn(`[${request.method}] ${request.url} - ${status}: ${message}`);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}