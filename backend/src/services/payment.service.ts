import { BaseService } from "../contracts/base.contract.js";
import type { FetchPaymentDto } from "../dto/dto.js";
import { ErrorType, PaymentStatus, SocketTypes } from "../enums/enums.js";
import { EmitToSigleUser } from "../events/socket.events.js";
import { OrderStatus, type Payment } from "../generated/prisma/client.js";
import type { CallbackUrlData, Cart, StkPushResponse, User } from "../interfaces/interfaces.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { Logger } from "../logs/logger.js";
import { io } from "../server.js";
import { SendSTKPush } from "../utils/send.stk.push.data.js";

export class PaymentService extends BaseService{

  async InitiatePayment(UserId: string): Promise<ServiceResult<FetchPaymentDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", UserId);

    if (!UserExists.Data) {
      return ServiceResponse.Failure(
        ErrorType.NOTFOUND,
        "You are not authorized to access this service.",
      );
    }

    if (UserExists.Data.LocationDescription === "") {
      return ServiceResponse.Failure(
        ErrorType.CLIENT,
        "Kindly update the location description on your profile to make an order.",
      );
    }

    let cartExists = await prisma.cart.findFirst({
      where: {
        UserId,
      },
      include: {
        Items: {
          include: {
            Product: true,
          },
        },
      },
    });

    if (!cartExists) {
      return ServiceResponse.Failure(
        ErrorType.VALIDATION,
        "Order can only be completed when items are in cart.",
      );
    }

    if (cartExists.Items.length === 0) {
      return ServiceResponse.Failure(
        ErrorType.VALIDATION,
        "Your cart contains no cart items, kindly add items to make an order.",
      );
    }

    let totalAmount = cartExists.Items.reduce((sum, item) => {
      if (!item.Product) return sum;

      const price = item.Product.OfferPrice
        ? item.Product.OfferPrice.toNumber()
        : item.Product.Price.toNumber();

      return sum + item.Quantity * price;
    }, 0);

    let createOrder = await prisma.order.create({
      data: {
        UserId,
        TotalAmount: totalAmount,
      },
    });

    if (!createOrder) {
      return ServiceResponse.Failure(
        ErrorType.SERVER,
        "Unable to create order at the moment",
      );
    }

    EmitToSigleUser(io, UserId, SocketTypes.orc);

    cartExists.Items.forEach(async (i) => {
      let createOrderItem = await prisma.orderItem.create({
        data: {
          OrderId: createOrder.OrderId,
          ProductId: i.Product.ProductId,
          Quantity: i.Quantity,
          PriceAtPurchase: i.Product.Price,
        },
      });

      if (createOrderItem) {
        await prisma.cartItem.delete({
          where: {
            CartItemId: i.CartItemId,
          },
        });

        if (cartExists.Items.length === 0) {
          await prisma.cart.delete({
            where: {
              CartId: cartExists.CartId,
            },
          });
        }
      }
    });

    EmitToSigleUser(io, UserId, SocketTypes.oru);
    EmitToSigleUser(io, UserId, SocketTypes.cau);
    EmitToSigleUser(io, UserId, SocketTypes.usu);

    // let createPayment = await prisma.payment.create({
    //   data: {
    //     UserId,
    //     OrderId: createOrder.OrderId,
    //     Amount: createOrder.TotalAmount
    //   }
    // });

    // if(!createPayment) {
    //   return ServiceResponse.Failure<FetchPaymentDto>(
    //     ErrorType.SERVER,
    //     "Unable to complete payment at the moment.",
    //   );
    // }

    // EmitToSigleUser(io, UserId, SocketTypes.pac);

    // let initiateStk: StkPushResponse | undefined = await SendSTKPush({PhoneNumber: UserExists.Data.Phone, Amount: createPayment.Amount.toNumber()});

    // if(!initiateStk) {
    //   return ServiceResponse.Failure<FetchPaymentDto>(
    //     ErrorType.SERVER,
    //     "Unable to complete payment at the moment.",
    //   );
    // }

    // if(initiateStk.ResponseCode != "0") {
    //   return ServiceResponse.Failure<FetchPaymentDto>(
    //     ErrorType.VALIDATION,
    //     initiateStk.ResponseDescription,
    //   );
    // }

    // let createStkData = await prisma.stkRequest.create({
    //   data: {
    //     PaymentId: createPayment.PaymentId,
    //     UserId,
    //     MerchantRequestID: initiateStk.MerchantRequestID,
    //     CheckoutRequestID: initiateStk.CheckoutRequestID,
    //     Amount: createPayment.Amount.toNumber(),
    //     ResponseCode: initiateStk.ResponseCode,
    //     ResultDesc: initiateStk.ResponseDescription
    //   }
    // });

    // if(!createStkData) {
    //   return ServiceResponse.Failure<FetchPaymentDto>(
    //     ErrorType.SERVER,
    //     "Unable to complete payment at the moment.",
    //   );
    // }

    // return ServiceResponse.Success<FetchPaymentDto>("Payment initiated successfully. Await confirmation.");
    return ServiceResponse.Success<FetchPaymentDto>(
      "Order placed successfully! Please monitor your order status. Our team will contact you shortly to confirm payment details and get you sorted."
    );
  }

  async RetryPayment(UserId: string, OrderId: string) {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", UserId);

    if(!UserExists.Success) {
      return ServiceResponse.Failure<FetchPaymentDto>(
        ErrorType.NOTFOUND,
        "You are not authorized to access this service.",
      );
    }

    let orderExists = await prisma.order.findUnique({
      where: {
        OrderId,
        UserId
      }
    });

    if(!orderExists) {
      return ServiceResponse.Failure<FetchPaymentDto>(
        ErrorType.NOTFOUND,
        "Order specified not found.",
      );
    }

    let createPayment = await prisma.payment.create({
      data: {
        UserId,
        OrderId,
        Amount: orderExists.TotalAmount,
      },
    });

    if (!createPayment) {
      return ServiceResponse.Failure<FetchPaymentDto>(
        ErrorType.SERVER,
        "Unable to complete payment at the moment.",
      );
    }

    EmitToSigleUser(io, UserId, SocketTypes.pac);

    let initiateStk: StkPushResponse | undefined = await SendSTKPush({
      PhoneNumber: UserExists.Data?.Phone as string,
      Amount: createPayment.Amount.toNumber(),
    });

    if (!initiateStk) {
      return ServiceResponse.Failure<FetchPaymentDto>(
        ErrorType.SERVER,
        "Unable to complete payment at the moment.",
      );
    }

    if (initiateStk.ResponseCode != "0") {
      return ServiceResponse.Failure<FetchPaymentDto>(
        ErrorType.VALIDATION,
        initiateStk.ResponseDescription,
      );
    }

    let createStkData = await prisma.stkRequest.create({
      data: {
        PaymentId: createPayment.PaymentId,
        UserId,
        MerchantRequestID: initiateStk.MerchantRequestID,
        CheckoutRequestID: initiateStk.CheckoutRequestID,
        Amount: createPayment.Amount.toNumber(),
        ResponseCode: initiateStk.ResponseCode,
        ResultDesc: initiateStk.ResponseDescription,
      },
    });

    if (!createStkData) {
      return ServiceResponse.Failure<FetchPaymentDto>(
        ErrorType.SERVER,
        "Unable to complete payment at the moment.",
      );
    }

    return ServiceResponse.Success<FetchPaymentDto>(
      "Payment initiated successfully. Await confirmation.",
    );
  }

  async StkCallBackReceiver(Data: CallbackUrlData) {
    if(!Data) {
      Logger.error("there is no data to work with at the moment");
      return;
    }

    let callBack = Data.Body.stkCallback;

    if(callBack.ResultCode !== 0) {
      Logger.error(Data.Body.stkCallback.ResultDesc);
      return;
    }

    let stkExists = await prisma.stkRequest.findUnique({
      where: {
        MerchantRequestID: callBack.MerchantRequestID,
        CheckoutRequestID: callBack.CheckoutRequestID
      }
    });

    if(!stkExists) {
      Logger.error("stk does not exist for the received callback");
      return;
    }

    let paymentExist = await prisma.payment.findUnique({
      where: {
        PaymentId: stkExists.PaymentId
      },
      include: {
        Order: {
          include: {
            Items: true
          }
        }
      }
    });

    if(!paymentExist) {
      Logger.error("there is no payment for the data received.");
      return;
    }

    let updateOrder = await prisma.order.update({
      data: {
        Status: OrderStatus.Paid
      },
      where: {
        OrderId: paymentExist.Order.OrderId
      }
    });

    if(!updateOrder) {
      Logger.error("Order not updated!!");
    }

    EmitToSigleUser(io, stkExists.UserId, SocketTypes.oru);
    EmitToSigleUser(io, stkExists.UserId, SocketTypes.usu);

    let updatePayment = await prisma.payment.update({
      where: {
        PaymentId: paymentExist.PaymentId
      },
      data: {
        Status: PaymentStatus.Completed
      }
    });

    if (!updatePayment) {
      Logger.error("Payment not updated!!");
    }

    io.emit(SocketTypes.pau);
    
    paymentExist.Order.Items.forEach(async(i) => {
      let product = await prisma.product.findUnique({
        where: {
          ProductId: i.ProductId
        }
      });

      if(product) {
        if (product.Quantity - i.Quantity > 0) {
          await prisma.product.update({
            where: {
              ProductId: i.ProductId,
            },
            data: {
              Quantity: {
                decrement: i.Quantity,
              },
            },
          });
        }

        await prisma.product.update({
          where: {
            ProductId: i.ProductId,
          },
          data: {
            Quantity: 0
          },
        });

        io.emit(SocketTypes.pru);
      }
    });

    io.emit(SocketTypes.pau);
  }

  async GetAllPayments(): Promise<ServiceResult<FetchPaymentDto>> {
    let payments = await prisma.payment.findMany({
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        User: true,
        Order: true
      }
    });

    if(!payments) {
      return ServiceResponse.Failure<FetchPaymentDto>(ErrorType.NOTFOUND, "Unable to fetch payments.");
    }

    return ServiceResponse.Success<FetchPaymentDto>(
      "Payments fetched successfully.",
      undefined,
      payments.map((p) => ({
        UserId: p.UserId,
        PaymentId: p.PaymentId,
        OrderId: p.OrderId,
        Amount: p.Amount.toNumber(),
        MpesaReferenceCode: p.MpesaReferenceCode as string,
        Status: p.Status,
        CreatedAt: p.CreatedAt,
        User: {
          UserId: p.UserId,
          FirstName: p.User.FirstName,
          SecondName: p.User.SecondName,
        },
      })),
    );
  }
}