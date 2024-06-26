import { Test, TestingModule } from '@nestjs/testing';
import { OrderingController } from './ordering.controller';
import { OrderingService } from './ordering.service';

describe('OrderingController', () => {
  let orderingController: OrderingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderingController],
      providers: [OrderingService],
    }).compile();

    orderingController = app.get<OrderingController>(OrderingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(orderingController.getHello()).toBe('Hello World!');
    });
  });
});
