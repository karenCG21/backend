import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Resend } from 'resend';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(email: string, password: string) {

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async forgotPassword(email: string) {
    try {

      console.log('===== FORGOT PASSWORD =====');
      console.log('Email recibido:', email);

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const newPassword = this.generateRandomPassword();

      await this.usersService.updatePassword(user.id, newPassword);

      console.log('Contraseña actualizada correctamente');

      const resend = new Resend(process.env.arca_de_vida);

      await resend.emails.send({
        from: 'Arca de Vida <onboarding@resend.dev>',
        to: email,
        subject: 'Tu nueva contraseña - Arca de Vida',
        html: `
          <div style="font-family: Arial; padding:20px;">
            <h2>🌿 Arca de Vida</h2>
            <p>Hemos generado una nueva contraseña para tu cuenta.</p>
            <p>Tu nueva contraseña es:</p>
            <div style="
              background:#f4f4f4;
              padding:15px;
              border-radius:5px;
              font-size:24px;
              font-weight:bold;
              letter-spacing:3px;
              text-align:center;
              margin:20px 0;
            ">
              ${newPassword}
            </div>
            <p>Inicia sesión con esta contraseña y cámbiala desde tu perfil.</p>
            <p style="color:#999; font-size:12px;">
              Si no solicitaste este cambio, contacta al administrador.
            </p>
          </div>
        `,
      });

      console.log('Correo enviado correctamente');

      return { message: 'Correo enviado correctamente' };

    } catch (error: any) {

      console.error('ERROR EN forgotPassword:', error);

      throw new UnauthorizedException(
        error?.message || 'Error al procesar la recuperación de contraseña',
      );
    }
  }

  async resetPasswordDirect(email: string, password: string) {

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Correo no encontrado');
    }

    await this.usersService.updatePassword(user.id, password);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async resetPassword(token: string, password: string) {

    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    if (!user.resetTokenExpires || new Date() > user.resetTokenExpires) {
      throw new UnauthorizedException('El enlace ha expirado');
    }

    await this.usersService.updatePassword(user.id, password);

    await this.usersService.saveResetToken(user.id, null, null);

    return { message: 'Contraseña actualizada correctamente' };
  }
}