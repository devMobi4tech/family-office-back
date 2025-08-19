import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/request-user.dto';
import * as bcrypt from 'bcrypt';
import { Address } from 'src/address/entities/address.entity';
import { AddressService } from 'src/address/address.service';
import { CreateAddressDto } from 'src/address/dto/request-address.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private addressService: AddressService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    await this.validateNewUserData(createUserDto);

    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      senhaHash: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async updateAddress(
    userId: number,
    createAddressDto: CreateAddressDto,
    tokenUserId: number,
  ): Promise<Address> {
    if (userId !== tokenUserId) {
      throw new ForbiddenException();
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException();
    }

    return await this.addressService.create(createAddressDto, user);
  }

  private async validateNewUserData(dto: CreateUserDto): Promise<void> {
    const emailExists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (emailExists) {
      throw new BadRequestException('Email já cadastrado.');
    }

    const cpfExists = await this.userRepository.findOne({
      where: { cpf: dto.cpf },
    });
    if (cpfExists) {
      throw new BadRequestException('CPF já cadastrado.');
    }

    if (dto.senha !== dto.confirmacaoSenha) {
      throw new BadRequestException('As senhas não conferem.');
    }
  }
}
