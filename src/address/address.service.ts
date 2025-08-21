import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddressDto } from './dto/request-address.dto';
import { User } from 'src/user/entities/user.entity';
import { AddressResponseDto } from './dto/response-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    user: User,
  ): Promise<Address> {
    let address = await this.addressRepository.findOneBy({
      usuario: { id: user.id },
    });

    if (address) {
      this.addressRepository.merge(address, createAddressDto);
    } else {
      address = this.addressRepository.create({
        ...createAddressDto,
        usuario: user,
      });
    }

    return await this.addressRepository.save(address);
  }

  async findByUserId(userId: string): Promise<AddressResponseDto | undefined> {
    const endereco = await this.addressRepository.findOne({
      where: { usuario: { id: userId } },
    });

    if (!endereco) {
      return undefined;
    }

    return {
      endereco: endereco.endereco,
      complemento: endereco.complemento ?? '',
      cidade: endereco.cidade,
      estado: endereco.estado,
      cep: endereco.cep,
      bairro: endereco.bairro,
      numero: endereco.numero,
    };
  }
}
