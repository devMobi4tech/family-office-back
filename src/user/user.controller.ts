import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAddressDto } from 'src/address/dto/request-address.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateAddressResponseDto } from 'src/address/dto/response-address.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userSerivce: UserService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth() // indica que precisa de token JWT
  @Put(':id/address')
  @ApiOperation({ summary: 'Adiciona/Atualiza o endereço de um usuário' })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Não autorizado / token inválido' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async updateAddress(
    @Param('id') id: number,
    @Body() dto: CreateAddressDto,
    @Req() req,
  ): Promise<UpdateAddressResponseDto> {
    await this.userSerivce.updateAddress(id, dto, req.user.id);
    return new UpdateAddressResponseDto(
      true,
      'Endereço atualizado com sucesso',
    );
  }
}
