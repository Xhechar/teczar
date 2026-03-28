import { SendMail } from "../emails/config/email.config.js";
import type { MessageOptions } from "../interfaces/interfaces.js";
import { prisma } from "../lib/prisma.js";
import { Logger } from "../logs/logger.js";
import ejs from "ejs";
import path from "path";

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
      try {
        const templatePath = path.resolve("templates/welcome_mail.ejs");

        const data = await ejs.renderFile(templatePath, {
          user,
        });

        const messageOptions: MessageOptions = {
          from: process.env.EMAIL as string,
          to: user.Email,
          subject: "Raz Technologies | Welcome",
          html: data,
        };

        await SendMail(messageOptions);

        await prisma.user.update({
          where: { UserId: user.UserId },
          data: { IsWelcomed: true },
        });
      } catch (error) {
        Logger.error(error instanceof Error ? error.message : String(error));
      }
    }
  }
}