import { Test, TestingModule } from '@nestjs/testing';
import { MerchandiseController } from './merchandise.controller';
import { MerchandiseService } from './merchandise.service';

describe('MerchandiseController', () => {
  let merchandiseController: MerchandiseController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MerchandiseController],
      providers: [MerchandiseService],
    }).compile();

    merchandiseController = app.get<MerchandiseController>(
      MerchandiseController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(merchandiseController.getHello()).toBe('Hello World!');
    });
  });
});
