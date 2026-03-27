import { SendMail } from "../emails/config/email.config.js";
import type { MessageOptions } from "../interfaces/interfaces.js";
import { prisma } from "../lib/prisma.js";
import { Logger } from "../logs/logger.js";
import ejs from "ejs";

export class WelcomeService {
  static async WelcomeUsers(): Promise<void> {

    let users = await prisma.user.findMany({
      where: {
        IsWelcomed: false
      }
    });

    if(!users) {
      Logger.error("Unable to find users to send mails to.");
      return;
    }

    if(users.length === 0) {
      Logger.info("Mails sent to all users.");
      return;
    }

    for(let user of users) {
      ejs.renderFile(
        "./templates/welcome_mail.ejs",
        { user },
        async (error, data) => {
          if (error) {
            Logger.error(error.message);
          } else {
            let messageOptions: MessageOptions = {
              from: process.env.EMAIL as string,
              to: user.Email,
              subject: "Raz Technologies | Welcome",
              html: data,
            };

            try {
              await SendMail(messageOptions);

              await prisma.user.update({
                where: {
                  UserId: user.UserId,
                },
                data: {
                  IsWelcomed: true,
                },
              });
            } catch (error) {
              Logger.error(error instanceof Error ? error.message : error);
            }
          }
        },
      );
    }
  }
}