import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoAutenticacao, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AddressService } from 'src/address/address.service';
import { CreateAddressDto } from 'src/address/dto/request-address.dto';
import { RegisterRequestDto } from 'src/auth/dto/request-auth.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { InvestorProfileService } from 'src/investor-profile/investor-profile.service';
import { UpdateInvestorProfileRequestDto } from './dto/request-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private addressService: AddressService,
    private investorProfileService: InvestorProfileService,
  ) {}

  async createUser(createUserDto: RegisterRequestDto): Promise<User> {
    await this.validateNewUserData(createUserDto);

    const user = this.userRepository.create({
      ...createUserDto,
    });
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async updateAddress(
    createAddressDto: CreateAddressDto,
    tokenUserId: string,
  ): Promise<void> {
    const user = await this.findById(tokenUserId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    this.addressService.create(createAddressDto, user);
  }

  async updatePassword(user: User, password: string): Promise<void> {
    const isSame = await bcrypt.compare(password, user.senha);
    if (isSame) return;

    user.senha = password;
    await this.userRepository.save(user);
  }

  async updateInvestorProfile(
    updateInvestorProfileRequestDto: UpdateInvestorProfileRequestDto,
    userTokenId: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userTokenId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return await this.investorProfileService.update(
      updateInvestorProfileRequestDto,
      user,
    );
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
      criadoEm: user.criadoEm,
      endereco,
    };
  }

  async loginWithGoogle(userData: any): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);

    if (!existingUser) {
      const user = this.userRepository.create({
        nomeCompleto: userData.name,
        fotoPerfilUrl: userData.picture,
        email: userData.email,
        tipoAutenticacao: TipoAutenticacao.GOOGLE,
      });
      return await this.userRepository.save(user);
    }

    if (existingUser.tipoAutenticacao !== TipoAutenticacao.GOOGLE) {
      throw new BadRequestException(
        'Este email já está cadastrado com senha. Use login tradicional.',
      );
    }

    return existingUser;
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
}
