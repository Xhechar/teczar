import axios from "axios";

export const GetAuthToken = async () => {
  try {
    const url =
      process.env.MPESA_ENV === "sandbox"
        ? "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        : "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
    ).toString("base64");

    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch Safaricom access token");
    }

    return (response.data as { access_token: string }).access_token;
  } catch (error) {
    console.error("Error fetching Safaricom access token:", error);
  }
}