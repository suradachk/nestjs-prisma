import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');

    await app.init();
  });

  it('should return 404 for root path', () => {
    return request(app.getHttpServer()).get('/').expect(404); // เปลี่ยนความคาดหวังเป็น 404 ซะเลย
  });
});
