import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAddressDto } from 'src/address/dto/request-address.dto';

@Controller('users')
export class UserController {
  constructor(private userSerivce: UserService) {}

  @UseGuards(AuthGuard)
  @Put(':id/address')
  async updateAddress(
    @Param('id') id: number,
    @Body() dto: CreateAddressDto,
    @Req() req,
  ) {
    return await this.userSerivce.updateAddress(id, dto, req.user.id);
  }
}
