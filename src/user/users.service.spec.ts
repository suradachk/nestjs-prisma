// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockContext, MockContext } from '../prisma/prisma.mock';

describe('UsersService', () => {
  let service: UserService;
  let mockCtx: MockContext;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockCtx.prisma, // 👈 พระเอกของเรา: ใช้ Mock แทนของจริง
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should find all users', async () => {
    // Arrange: เตรียมข้อมูลหลอกๆ
    const mockUsers = [{ id: 1, email: 'test@test.com' }];
    mockCtx.prisma.user.findMany.mockResolvedValue(mockUsers as any);

    // Act: เรียกฟังก์ชัน
    const result = await service.findAll();

    // Assert: ตรวจสอบผลลัพธ์
    expect(result).toHaveLength(1);
    expect(mockCtx.prisma.user.findMany).toHaveBeenCalled();
  });
});
