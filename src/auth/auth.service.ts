import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

  constructor(

    private usersService: UsersService,

    private jwtService: JwtService,
  ) {}

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

        // AGREGAR ROLE
        role: user.role,
      },
    };
  }
}