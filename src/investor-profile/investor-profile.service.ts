import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InvestorProfile } from './entities/investor-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateInvestorProfileRequestDto } from 'src/user/dto/request-user.dto';

@Injectable()
export class InvestorProfileService {
  constructor(
    @InjectRepository(InvestorProfile)
    private investorProfileRepository: Repository<InvestorProfile>,
  ) {}

  async update(
    request: UpdateInvestorProfileRequestDto,
    user: User,
  ): Promise<void> {
    const history = await this.findHistoryByUser(user);

    const currentRecord = history.find((h) => h.fimEm === null);
    if (currentRecord) {
      if (currentRecord.perfilInvestidor === request.perfilInvestidor) {
        throw new UnprocessableEntityException(
          'Perfil de investidor enviado é igual ao atual',
        );
      }
      currentRecord.fimEm = new Date();
      await this.investorProfileRepository.save(currentRecord);
    }

    const newRecord = this.investorProfileRepository.create({
      perfilInvestidor: request.perfilInvestidor,
      user: user,
    });

    await this.investorProfileRepository.save(newRecord);
  }

  async findHistoryByUser(user: User): Promise<InvestorProfile[]> {
    const investorProfile = await this.investorProfileRepository.find({
      where: { user: { id: user.id } },
    });
    return investorProfile;
  }
}
