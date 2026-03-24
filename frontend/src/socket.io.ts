import { io, Socket } from "socket.io-client";
import { SocketURL } from "./shared/url";

export const socket: Socket = io(SocketURL, {
  withCredentials: true,
  transports: ["websocket"],
});
