import { Body, Controller, Get, Header, Post, Response, StreamableFile, UseGuards } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get("admin-list")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    getAllAdmin(): Promise<User[]> {
        return this.usersService.findAllAdmin();
    }

    @Post('create-admin')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create({ ...createUserDto, roles: [Role.Admin] });
    }

    @Get('download-admin')
    @Header("Content-Type", 'text/xlsx')
    @Header("Content-Disposition", 'attachment; filename="adminList.xlsx')
    async getFileCustomizedResponse(@Response({ passthrough: true }) res) {
        return await this.usersService.generateAdminExcel();
    }

}
