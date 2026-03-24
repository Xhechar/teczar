
import axios from "axios";
import dotenv from "dotenv";
import moment from "moment";
import type { StkPayloadData, StkPushData, StkPushResponse } from "../interfaces/interfaces.js";
import { GetAuthToken } from "./safaricom.auth.js";
import { Logger } from "../logs/logger.js";

dotenv.config();

export const SendSTKPush = async (StkData: StkPushData) => {
  StkData.PhoneNumber.startsWith("0")
    ? (StkData.PhoneNumber = StkData.PhoneNumber.replace(
        StkData.PhoneNumber[0] as string,
        "254",
      ))
    : (StkData.PhoneNumber = StkData.PhoneNumber);

  const URL =
    process.env.MPESA_ENV === "sandbox"
      ? "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
      : "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const Timestamp = moment().format("YYYYMMDDHHmmss");
  const Password = Buffer.from(
    `${process.env.MPESA_SHORTCODE as string}${process.env.MPESA_CONSUMER_PASSKEY as string}${Timestamp}`,
  ).toString("base64");
  const Token = await GetAuthToken();

  const Headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Token}`,
  };

  const Payload: StkPayloadData = {
    BusinessShortCode: process.env.MPESA_SHORTCODE as string,
    Password,
    Timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: StkData.Amount,
    PartyA: StkData.PhoneNumber,
    PartyB: process.env.MPESA_SHORTCODE as string,
    PhoneNumber: StkData.PhoneNumber,
    CallBackURL: process.env.CALLBACK_URL as string,
    AccountReference: "RAZ TECH",
    TransactionDesc: "Payment for order",
  };

  try {
    let Response = await axios.post(URL, Payload, { headers: Headers });

    if(Response.status !== 201) {
      Logger.error(Response.statusText);
      return;
    }

    return Response.data as StkPushResponse;
  } catch (error) {
    Logger.error(error instanceof Error ? error.message : "Stk push error occured.")
  }
};
