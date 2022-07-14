import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {

    const user = await this.usersService.findOne(email);

    if (!user) return null;

    const isAuthenticated = await user.validatePassword(pass);

    if (isAuthenticated) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, userId: user._id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
