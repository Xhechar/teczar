import nodemailer from "nodemailer";
import type { MailConfiguration, MessageOptions } from "../../interfaces/interfaces.js";
import { Logger } from "../../logs/logger.js";
import dotenv from "dotenv";

dotenv.config();

const mailConfigurations: MailConfiguration = {
  host: process.env.EMAIL_HOST as string,
  port: 465,
  secure: true,
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

  try {
    await transporter.verify();

    const info = await transporter.sendMail(messageOptions);
    Logger.info(info.response);
    
    return info;
  } catch (error) {
    Logger.error(error instanceof Error ? error.message : "an error occured while sending mail.", error);
  }
};
