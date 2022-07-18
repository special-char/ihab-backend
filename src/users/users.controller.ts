import { Body, Controller, Get, Header, Post, Query, Response, StreamableFile, UseGuards } from '@nestjs/common';
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
    getAllAdmin(@Query() query): Promise<User[]> {
        console.log(query.name);

        return this.usersService.findAllAdmin(query);
    }

    @Post('create-admin')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create({ ...createUserDto, roles: [Role.Admin] });
    }

    @Get('download-admin')
    @Header("Content-Disposition", 'attachment; filename="adminList.csv')
    async getFileCustomizedResponse(@Response({ passthrough: true }) res) {
        const path = await this.usersService.generateAdminExcel();
        const file = createReadStream(path)
        res.type('text/csv').send(file);
    }

}
