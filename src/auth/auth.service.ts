import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

import { randomUUID } from 'crypto';

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
      await this.usersService.findByEmail(
        email,
      );

    if (!user) {

      throw new UnauthorizedException(
        'Usuario no encontrado',
      );
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!validPassword) {

      throw new UnauthorizedException(
        'Contraseña incorrecta',
      );
    }

    const payload = {

      sub: user.id,

      email: user.email,
    };

    return {

      access_token:
        this.jwtService.sign(payload),

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,
      },
    };
  }

  async forgotPassword(
  email: string,
) {
  try {

    console.log('===== FORGOT PASSWORD =====');
    console.log('Email recibido:', email);

    const user =
      await this.usersService.findByEmail(
        email,
      );

    console.log('Usuario encontrado:', user);

    if (!user) {
      throw new UnauthorizedException(
        'Usuario no encontrado',
      );
    }

    const token = randomUUID();

    const expires = new Date(
      Date.now() + 1000 * 60 * 30,
    );

    console.log('Token generado:', token);

    await this.usersService.saveResetToken(
      user.id,
      token,
      expires,
    );

    console.log('Token guardado correctamente');

    const transporter =
      nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'arcadevida431@gmail.com',
          pass: 'rlep fcyv sqlf ngsq',
        },
      });

    console.log('Transporter creado');

    await transporter.verify();

    console.log('SMTP verificado correctamente');

    console.log(
      'FRONTEND_URL:',
      process.env.FRONTEND_URL,
    );

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${token}`;

    console.log(
      'Reset Link:',
      resetLink,
    );

    await transporter.sendMail({
      from: '"Arca de Vida" <arcadevida431@gmail.com>',
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>🌿 Arca de Vida</h2>

          <p>
            Hemos recibido una solicitud para recuperar tu contraseña.
          </p>

          <p>
            Haz clic en el siguiente botón:
          </p>

          <a
            href="${resetLink}"
            style="
              background:#28a745;
              color:white;
              padding:12px 20px;
              text-decoration:none;
              border-radius:5px;
              display:inline-block;
            "
          >
            Restablecer contraseña
          </a>

          <p style="margin-top:20px;">
            Este enlace expirará en 30 minutos.
          </p>

          <p>
            Si no solicitaste este cambio,
            ignora este mensaje.
          </p>
        </div>
      `,
    });

    console.log(
      'Correo enviado correctamente',
    );

    return {
      message:
        'Correo enviado correctamente',
    };

  } catch (error) {

    console.error(
      'ERROR EN forgotPassword:',
      error,
    );

    throw new UnauthorizedException(
      error ||
      'Error al procesar la recuperación de contraseña',
    );
  }
}
  
  
  async resetPassword(
    token: string,
    password: string,
  ) {

    const user =
      await this.usersService.findByResetToken(
        token,
      );

    if (!user) {

      throw new UnauthorizedException(
        'Token inválido',
      );
    }

    if (
      !user.resetTokenExpires ||
      new Date() >
      user.resetTokenExpires
    ) {

      throw new UnauthorizedException(
        'El enlace ha expirado',
      );
    }

    await this.usersService.updatePassword(
      user.id,
      password,
    );

    await this.usersService.saveResetToken(
      user.id,
      null,
      null,
    );

    return {
      message:
        'Contraseña actualizada correctamente',
    };
  }
}