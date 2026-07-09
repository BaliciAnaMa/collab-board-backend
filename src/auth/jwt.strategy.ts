import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY_SECRET', // Pe viitor, o vom muta în .env
    });
  }

  /**
   * Această funcție este apelată după ce JWT-ul este decodat.
   * Returnăm un obiect care va fi disponibil în controller prin 'req.user'
   */
  async validate(payload: { sub: string; email: string }) {
    return { 
      userId: payload.sub, 
      email: payload.email 
    };
  }
}