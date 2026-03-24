import { Server, Socket } from "socket.io";
import { Logger } from "../logs/logger.js";
import cookie from "cookie";
import type { TokenDetails } from "../interfaces/interfaces.js";
import jwt from "jsonwebtoken";

const UserSockets: Map<string, string> = new Map<string, string>();

export const SetUpSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        Logger.warn(
          `No cookies found for socket: ${socket.id}. Disconnecting.`,
        );
        socket.disconnect();
        return;
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.accessToken;

      if (!token) {
        Logger.warn(
          `No access token found in cookies for socket: ${socket.id}. Disconnecting.`,
        );
        socket.disconnect();
        return;
      }

      let rawToken = token.startsWith("s:") ? token.slice(2) : token;

      if (rawToken.includes(".")) {
        const parts = rawToken.split(".");
        if (parts.length > 3) {
          rawToken = parts.slice(0, 3).join(".");
        }
      }

      const decorded: TokenDetails = jwt.verify(
        rawToken,
        process.env.JWT_SECRET as string,
      ) as TokenDetails;

      UserSockets.set(decorded.UserId, socket.id);
    } catch (error) {
      Logger.error("Error handling socket connection:", error);
      socket.disconnect();
    }
  });
};

export const EmitToSigleUser = (
  io: Server,
  UserId: string,
  Event: string,
  Data?: object,
) => {
  const socketId = UserSockets.get(UserId);

  if (socketId) {
    io.to(socketId).emit(Event, Data);
  } else {
    Logger.warn(
      `No active socket found for UserId: ${UserId}. Event: ${Event} not emitted.`,
    );
  }
};