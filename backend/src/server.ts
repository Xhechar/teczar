import Express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from 'http';
import morgan from 'morgan';
import { Logger } from "./logs/logger.js";
import type { Request, Response, NextFunction } from "express";
import { ServiceResponse } from "./interfaces/repository/service.response.js";
import { Server } from "socket.io";
import { SetUpSockets } from "./events/socket.events.js";
import { AdvertRouter } from "./routers/advert.route.js";
import { AuthRouter } from "./routers/auth.route.js";
import { CartItemRouter } from "./routers/cart.item.route.js";
import { CartRouter } from "./routers/cart.route.js";
import { CategoryRouter } from "./routers/category.route.js";
import { JobApplicationRouter } from "./routers/job.application.route.js";
import { JobRouter } from "./routers/job.route.js";
import { OrderItemRouter } from "./routers/order.item.route.js";
import { OrderRouter } from "./routers/order.route.js";
import { PaymentRouter } from "./routers/payment.route.js";
import { ProductImageRouter } from "./routers/product.image.route.js";
import { ProductRouter } from "./routers/product.route.js";
import { ReviewRouter } from "./routers/review.route.js";
import { ServiceRequestRouter } from "./routers/service.request.route.js";
import { ServiceRouter } from "./routers/service.route.js";
import { UserRouter } from "./routers/user.route.js";
import { ErrorType } from "./enums/enums.js";
import { ContactRouter } from "./routers/contact.route.js";
import { HeroSliderRouter } from "./routers/hero.slider.route.js";
import { RunBGServices } from "./events/background.event.js";

dotenv.config();

const app = Express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: "https://raztechnologies.co.ke",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(cookieParser(process.env.JWT_COOKIE_SECRET));

app.use("/advert", AdvertRouter);
app.use("/auth", AuthRouter);
app.use("/cart-item", CartItemRouter);
app.use("/cart", CartRouter);
app.use("/category", CategoryRouter);
app.use("/job-application", JobApplicationRouter);
app.use("/job", JobRouter);
app.use("/order-item", OrderItemRouter);
app.use("/order", OrderRouter);
app.use("/payment", PaymentRouter);
app.use("/product-image", ProductImageRouter);
app.use("/product", ProductRouter);
app.use("/review", ReviewRouter);
app.use("/service-request", ServiceRequestRouter);
app.use("/service", ServiceRouter);
app.use("/user", UserRouter);
app.use("/contact", ContactRouter);
app.use("/hero-slider", HeroSliderRouter);

app.use(morgan("combined", {stream: {write: message => Logger.info(message.trim())}}));

app.use((err: Error, Req: Request, Res: Response, next: NextFunction) => {
  return Res.status(500).json(ServiceResponse.Failure<object>(ErrorType.SERVER, err.message));
});

const server = http.createServer(app);

const PORT = process.env.PORT ?? 3001;

export const io: Server = new Server(server, {
  cors: {
    origin: "https://raztechnologies.co.ke",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

SetUpSockets(io);

await RunBGServices();

server.listen(PORT, () => {
  Logger.info(`Server is running on port: ${PORT}.`)
});