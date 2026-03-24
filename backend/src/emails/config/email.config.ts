import nodemailer from "nodemailer";
import type { MailConfiguration, MessageOptions } from "../../interfaces/interfaces.js";
import { Logger } from "../../logs/logger.js";
import dotenv from "dotenv";

dotenv.config();

const mailConfigurations: MailConfiguration = {
  service: "gmail",
  host: process.env.EMAIL_HOST as string,
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
};

const createTransporter = (config: MailConfiguration) => {
  return nodemailer.createTransport(config);
}

export const SendMail = async (messageOptions: MessageOptions) => {
  const transporter = createTransporter(mailConfigurations);

  await transporter.verify();

  transporter.sendMail(messageOptions, (err, info) => {
    if (err) {
      Logger.error(
        err instanceof Error
          ? err.message
          : "an error occured while sending mail.",
      );
    }

    Logger.info(info.response);
  });
};
