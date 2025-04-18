import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Username atau password tidak valid');
    }

    const tokens = this.generateTokens(user);
    
    // Simpan refresh token (dalam kasus implementasi sebenarnya, bisa simpan ke database)
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
    
    this.logger.log(`User ${user.username} berhasil login`);
    
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      }
    };
  }
  
  async refreshToken(refreshToken: string) {
    try {
      // Verifikasi refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      // Cek apakah user ada dan refresh token cocok
      const user = await this.usersService.findById(payload.sub);
      
      if (!user || !(await this.usersService.validateRefreshToken(user.id, refreshToken))) {
        throw new UnauthorizedException('Refresh token tidak valid');
      }
      
      // Generate token baru
      const tokens = this.generateTokens(user);
      
      // Update refresh token di database
      await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
      
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token tidak valid atau kedaluwarsa');
    }
  }
  
  async logout(userId: string) {
    // Hapus refresh token dari database
    await this.usersService.removeRefreshToken(userId);
    
    this.logger.log(`User dengan ID ${userId} berhasil logout`);
    
    return { message: 'Logout berhasil' };
  }
  
  private generateTokens(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    };
  }
}