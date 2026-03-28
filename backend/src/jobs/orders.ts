import ejs from "ejs";
import type { MessageOptions } from "../interfaces/interfaces.js";
import { Logger } from "../logs/logger.js";
import { prisma } from "../lib/prisma.js";
import { SendMail } from "../emails/config/email.config.js";
import path from "path";

export class OrdersService {
  static async SendOrderNotification(): Promise<void> {
    let orders = await prisma.order.findMany({
      where: {
        IsSent: false,
      },
      include: {
        User: true,
        Items: {
          include: {
            Product: {
              include: {
                Images: { take: 1 },
                Category: true,
              },
            },
          },
        },
        Payments: true,
      },
    });

    if (!orders) {
      Logger.error("Unable to find users to send order mails to.");
      return;
    }

    if (orders.length === 0) {
      Logger.info("Mails sent to all users who made orders.");
      return;
    }

    for (let order of orders) {
      try {
        const templatePath = path.resolve(
          "templates/order_confirmation.mail.ejs",
        );

        const data = await ejs.renderFile(templatePath, { order });

        const messageOptions: MessageOptions = {
          from: process.env.EMAIL as string,
          to: order.User.Email,
          subject: "Raz Technologies | Order Confirmation.",
          html: data,
        };

        await SendMail(messageOptions);

        await prisma.order.update({
          where: { OrderId: order.OrderId },
          data: { IsSent: true },
        });

        Logger.info(`Order confirmation sent to ${order.User.Email}`);
      } catch (error) {
        Logger.error(error instanceof Error ? error.message : String(error));
      }
    }
  }
}