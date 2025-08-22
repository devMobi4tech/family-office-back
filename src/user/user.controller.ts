import {
  Body,
  Controller,
  Get,
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
import { UpdateInvestorProfileRequestDto } from './dto/request-user.dto';
import { UserResponseDto } from './dto/response-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userSerivce: UserService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('/address')
  @ApiOperation({
    summary: 'Adiciona/Atualiza o endereço do usuário autenticado',
  })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ status: 204, description: 'Endereço atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Não autorizado / token inválido' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @HttpCode(204)
  async updateAddress(
    @Body() dto: CreateAddressDto,
    @Req() req,
  ): Promise<void> {
    await this.userSerivce.updateAddress(dto, req.user.id);
  }

  @Put('/investor-profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza o perfil de investidor do usuário autenticado',
  })
  @ApiResponse({ status: 204, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({
    status: 401,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @HttpCode(204)
  async updateInvestorProfile(
    @Body() updateInvestorProfileRequestDto: UpdateInvestorProfileRequestDto,
    @Req() req,
  ): Promise<void> {
    await this.userSerivce.updateInvestorProfile(
      req.user.id,
      updateInvestorProfileRequestDto,
    );
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtém o perfil do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário retornado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  async getUserProfile(@Req() req): Promise<UserResponseDto> {
    return await this.userSerivce.getUserProfile(req.user.id);
  }
}
