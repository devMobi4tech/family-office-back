import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAddressDto } from 'src/address/dto/request-address.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateAddressResponseDto } from 'src/address/dto/response-address.dto';
import { UpdateInvestorProfileRequestDto } from './dto/request-user.dto';

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

  @Put(':id/investor-profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // Indica que precisa de token JWT
  @ApiOperation({ summary: 'Atualiza o perfil de investidor do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário', type: Number })
  @ApiResponse({ status: 204, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({
    status: 403,
    description: 'Usuário não autorizado a alterar outro perfil',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @HttpCode(204)
  async updateInvestorProfile(
    @Param('id') id: number,
    @Body() updateInvestorProfileRequestDto: UpdateInvestorProfileRequestDto,
    @Req() req,
  ): Promise<void> {
    await this.userSerivce.updateInvestorProfile(
      id,
      updateInvestorProfileRequestDto,
      req.user.id,
    );
  }
}
