import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppService } from '../src/app.service';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    new AppService().readRoutesInput();
    await app.init();
  });

  it('/bestRoute GRU-BRC (GET)', () => {
    return request(app.getHttpServer())
      .get('/bestRoute/gru/brc')
      .expect(200)
      .expect('GRU - BRC > $10');
  });

  it('/bestRoute GRU-CDG (GET)', () => {
    return request(app.getHttpServer())
      .get('/bestRoute/gru/cdg')
      .expect(200)
      .expect('GRU - BRC - SCL - ORL - CDG > $40');
  });

  it('/bestRoute GRU-POA (GET)', () => {
    return request(app.getHttpServer())
      .get('/bestRoute/gru/poa')
      .expect(200)
      .expect('Route not found');
  });

  // it('/updateRoute (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/updateRoute')
  //     .send({
  //       from: 'GRU',
  //       to: 'CGH',
  //       price: '5',
  //     })
  //     .expect(201)
  //     .expect('Updated.');
  // });
});
