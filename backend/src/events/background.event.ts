import cron from 'node-cron';
import { WelcomeService } from '../jobs/welcome.js';
import { OrdersService } from '../jobs/orders.js';
import { Logger } from '../logs/logger.js';

export const RunBGServices = async() => {
  cron.schedule('*/30 * * * * *', async() => {
    try {
      await WelcomeService.WelcomeUsers();
      await OrdersService.SendOrderNotification();
    } catch (error) {
      Logger.error(error instanceof Error ? error.message : error);
    }
  })
}