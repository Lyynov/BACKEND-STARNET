// src/app.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './core/decorators/public.decorator';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is running' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Application health status' })
  @ApiResponse({ status: 200, description: 'Health information returned' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Public()
  @Get('info')
  @ApiOperation({ summary: 'Application information' })
  @ApiResponse({ status: 200, description: 'Application information returned' })
  getInfo() {
    return this.appService.getInfo();
  }
}
