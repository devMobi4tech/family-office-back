import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Address } from 'src/address/entities/address.entity';
import { AddressService } from 'src/address/address.service';
import { CreateAddressDto } from 'src/address/dto/request-address.dto';
import { RegisterRequestDto } from 'src/auth/dto/request-auth.dto';
import { UpdateInvestorProfileRequestDto } from './dto/request-user.dto';
import { UserResponseDto } from './dto/response-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private addressService: AddressService,
  ) {}

  async createUser(createUserDto: RegisterRequestDto): Promise<User> {
    await this.validateNewUserData(createUserDto);

    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      senhaHash: hashedPassword,
      dataNascimento: this.parseData(createUserDto.dataNascimento),
    });
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async updateAddress(
    createAddressDto: CreateAddressDto,
    tokenUserId: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: tokenUserId },
    });
    if (!user) {
      console.log(user);
      throw new NotFoundException();
    }

    this.addressService.create(createAddressDto, user);
  }

  async updatePassword(user: User, password: string): Promise<void> {
    const isSame = await bcrypt.compare(password, user.senhaHash);
    if (isSame) return;

    const hashedPassword = await bcrypt.hash(password, 10);
    user.senhaHash = hashedPassword;
    await this.userRepository.save(user);
  }

  async updateInvestorProfile(
    userId: string,
    updateInvestorProfileDto: UpdateInvestorProfileRequestDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException();
    }

    user.perfilInvestidor = updateInvestorProfileDto.perfilInvestidor;
    user.perfilInvestidorDefinidoEm = new Date();

    await this.userRepository.save(user);
  }

  async getUserProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const endereco = await this.addressService.findByUserId(user.id);

    return {
      id: user.id,
      nomeCompleto: user.nomeCompleto,
      email: user.email,
      fotoPerfilUrl: user.fotoPerfilUrl,
      rendaMensal: user.rendaMensal,
      perfilInvestidor: user.perfilInvestidor,
      perfilInvestidorDefinidoEm: user.perfilInvestidorDefinidoEm,
      criadoEm: user.criadoEm,
      endereco,
    };
  }

  private async validateNewUserData(dto: RegisterRequestDto): Promise<void> {
    const emailExists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (emailExists) {
      throw new ConflictException('Email já cadastrado.');
    }

    const cpfExists = await this.userRepository.findOne({
      where: { cpf: dto.cpf },
    });
    if (cpfExists) {
      throw new ConflictException('CPF já cadastrado.');
    }

    if (dto.senha !== dto.confirmacaoSenha) {
      throw new BadRequestException('As senhas não conferem.');
    }
  }

  private parseData(data: string): Date {
    if (!data || typeof data !== 'string') {
      throw new BadRequestException('Data de nascimento inválida');
    }

    // aceita / ou -
    const parts = data.split(/[\/-]/);
    if (parts.length !== 3) {
      throw new BadRequestException('Data de nascimento inválida');
    }

    const [dia, mes, ano] = parts.map(Number);

    // validações básicas
    if (
      isNaN(dia) ||
      isNaN(mes) ||
      isNaN(ano) ||
      dia < 1 ||
      dia > 31 ||
      mes < 1 ||
      mes > 12
    ) {
      throw new BadRequestException('Data de nascimento inválida');
    }

    // criar Date no formato ISO (YYYY-MM-DD)
    const date = new Date(
      `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
    );

    return date;
  }
}
