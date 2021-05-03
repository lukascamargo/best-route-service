import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    service = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return path to CDG from GRU', async () => {
      const route = await service.cheaperRoute('GRU', 'CDG');
      expect(route).toStrictEqual('GRU - BRC - SCL - ORL - CDG > $40');
    });

    it('should return path to ORL from GRU', async () => {
      const route = await service.cheaperRoute('GRU', 'ORL');
      expect(route).toStrictEqual('GRU - BRC - SCL - ORL > $35');
    });

    it('should return path to CDG from SCL', async () => {
      const route = await service.cheaperRoute('SCL', 'CDG');
      expect(route).toStrictEqual('SCL - ORL - CDG > $25');
    });

    it('should return path to ORL from SCL', async () => {
      const route = await service.cheaperRoute('SCL', 'ORL');
      expect(route).toStrictEqual('SCL - ORL > $20');
    });

    it('should not return path to SCL from ORL since it hasnt a route', async () => {
      const route = await service.cheaperRoute('ORL', 'SCL');
      expect(route).toStrictEqual('Route not found');
    });
  });
});
