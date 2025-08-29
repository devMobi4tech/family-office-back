import { Module } from '@nestjs/common';
import { InvestorProfileService } from './investor-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorProfile } from './entities/investor-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestorProfile])],
  providers: [InvestorProfileService],
  exports: [InvestorProfileService],
})
export class InvestorProfileModule {}
