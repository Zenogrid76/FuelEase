import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { Operator } from './operator.entity';
import { CreateOperatorDto } from './createoperator.dto';
@Injectable()
export class OperatorService {
    sendTwoFactorCodeEmail(arg0: any, otpCode: string) {
        throw new Error('Method not implemented.');
    }
  constructor(
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    private readonly mailerService: MailerService,
  ) {}

  async createOperator(dto: CreateOperatorDto): Promise<Operator> {
    console.log("service pass"+dto.password);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const newOperator = this.operatorRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.operatorRepository.save(newOperator);
  }

  async updateOperator(id: number, data: Partial<Operator>, operator: Operator): Promise<Operator> {
    if (operator.password) {
      const saltRounds = 10;
      operator.password = await bcrypt.hash(operator.password, saltRounds);
    }
    return this.operatorRepository.save(operator);
  }

  async updateStatus(
    id: number,
    status: 'active' | 'inactive' | 'on_leave',
  ): Promise<Operator> {
    if (!['active', 'inactive', 'on_leave'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    const operator = await this.operatorRepository.findOneBy({ id });
    if (!operator) throw new NotFoundException('Operator not found');

    operator.status = status;
    return this.operatorRepository.save(operator);
  }

  async findInactiveOperators(): Promise<Operator[]> {
    return this.operatorRepository.find({ where: { status: 'inactive' } });
  }

  async findOperatorsOlderThan(age: number): Promise<Operator[]> {
    return this.operatorRepository.find({
      where: { age: MoreThan(age) },
    });
  }
async updateOperatorData(id: number, data: Partial<Operator>): Promise<Operator> {
  const operator = await this.findById(id);
  Object.assign(operator, data);

  if (data.password) {
    const saltRounds = 10;
    operator.password = await bcrypt.hash(data.password, saltRounds);
  }

  return this.operatorRepository.save(operator);
}

  async updateProfileImage(id: number, filePath: string): Promise<Operator> {
    const operator = await this.operatorRepository.findOneBy({ id });
    if (!operator) throw new NotFoundException('Operator not found');
    operator.profileImage = filePath;
    return this.operatorRepository.save(operator);
  }

  async deleteOperator(id: number): Promise<{ deleted: boolean }> {
    const result = await this.operatorRepository.delete(id);
    return { deleted: !!result.affected };
  }

  async findByEmail(email: string): Promise<Operator> {
    const operator = await this.operatorRepository.findOne({
      where: { email },
      select: ['id', 'email', 'gender', 'password','age','address','joiningDate','name','lastLogin','role','profileImage','phoneNo','status'],
    });
    if (!operator) throw new NotFoundException('Operator not found');
    return operator;
  }

 async findById(id: number | string): Promise<Operator> {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) {
    throw new BadRequestException('Invalid operator ID');
  }

  const operator = await this.operatorRepository.findOneBy({ id: numericId });
  if (!operator) throw new NotFoundException('Operator not found');
  return operator;
}

async findAllOperators(): Promise<Operator[]> {
  return this.operatorRepository.find();
}
  // operator.service.ts
async findByEmailname(email: string): Promise<Partial<Operator>> {
  const operator = await this.operatorRepository.findOne({
    where: { email },
  });

  if (!operator) throw new NotFoundException(`Operator with email ${email} not found`);

  // Exclude password before returning
  const { password, ...safeOperator } = operator;
  return safeOperator;
}

}
