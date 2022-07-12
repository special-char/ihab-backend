import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Order } from 'src/schemas/order.schema';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) { }

    @Get()
    getOrders(): Promise<Order[]> {
        return this.orderService.findAll();
    }

    @Get(':id')
    getOrder(@Param() params): Promise<Order> {
        return this.orderService.findOne(params?.id);
    }

    @Post()
    @Roles(Role.User)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    createOrder(@Req() req: Request & { user: any }, @Body() dto: Order): Promise<Order> {
        const { userId } = req.user;
        return this.orderService.create({ ...dto, user: userId });
    }
}
