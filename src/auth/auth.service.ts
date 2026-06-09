import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(
    email: string,
    password: string,
  ) {

    const user =
      await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const validPassword =
      await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

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

  async forgotPassword(email: string) {
    try {

      console.log('===== FORGOT PASSWORD =====');
      console.log('Email recibido:', email);

      const user =
        await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Generar contraseña aleatoria
      const newPassword = Math.random().toString(36).slice(-8);

      // Guardar en la base de datos
      await this.usersService.updatePassword(user.id, newPassword);

      // Configurar transporter de Gmail
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env['GMAIL_USER'],
          pass: process.env['GMAIL_PASS'],
        },
      });

      // Enviar correo
      await transporter.sendMail({
        from: `"Arca de Vida" <${process.env['GMAIL_USER']}>`,
        to: email,
        subject: 'Recuperación de contraseña',
        html: `
          <div style="font-family: Arial; padding:20px;">
            <h2>🌿 Arca de Vida</h2>
            <p>Hemos recibido una solicitud para recuperar tu contraseña.</p>
            <p>Tu nueva contraseña es:</p>
            <h3 style="background:#f4f4f4; padding:10px; border-radius:5px;">${newPassword}</h3>
            <p>Te recomendamos cambiarla después de iniciar sesión.</p>
            <p>Si no solicitaste este cambio, ignora este mensaje.</p>
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

  async resetPassword(token: string, password: string) {

    const user =
      await this.usersService.findByResetToken(token);

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