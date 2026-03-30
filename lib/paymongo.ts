import axios from "axios";

interface PaymentLinkResult {
  checkoutUrl: string;
  paymentIntentId: string;
}

export async function createPaymentLink(
  amount: number,
  description: string,
  orderId: string
): Promise<PaymentLinkResult> {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;

  if (!secretKey) {
    throw new Error("PAYMONGO_SECRET_KEY is not set.");
  }

  const encoded = Buffer.from(`${secretKey}:`).toString("base64");

  const response = await axios.post(
    "https://api.paymongo.com/v1/links",
    {
      data: {
        attributes: {
          amount: Math.round(amount * 100),
          description,
          remarks: orderId,
        },
      },
    },
    {
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = response.data?.data;
  const checkoutUrl = data?.attributes?.checkout_url;
  const paymentIntentId = data?.id;

  return { checkoutUrl, paymentIntentId };
}
