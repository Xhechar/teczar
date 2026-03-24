import winston from "winston";

export const Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [new winston.transports.Console()]
});

(Logger as any).stream = {
  write: (message: string) => Logger.info(message.trim())
}