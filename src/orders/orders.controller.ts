import { Body, Controller, Get, Header, Param, Post, Put, Req, Response, UseGuards } from '@nestjs/common';
import { createReadStream } from 'fs';
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

    @Get('download')
    @Header("Content-Disposition", 'attachment; filename="orderList.xlsx')
    async downloadOrders(@Response({ passthrough: true }) res) {
        const path = await this.orderService.downlaodOrders();
        const file = createReadStream(path)
        res.type('text/xlsx').send(file);
    }

    @Get(':id')
    getOrder(@Param() params): Promise<Order> {
        return this.orderService.findOne(params?.id);
    }

    @Put(":id")
    updateOrder(@Param() params, @Body() dto): Promise<Order> {
        return this.orderService.update(params?.id, dto)
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
