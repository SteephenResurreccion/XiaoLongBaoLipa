import axios from "axios";
import crypto from "crypto";

interface DeliveryFeeResult {
  fee: number;
  available: boolean;
}

export async function getDeliveryFee(
  dropLat: number,
  dropLng: number,
  dropAddress: string
): Promise<DeliveryFeeResult> {
  const environment = process.env.LALAMOVE_ENVIRONMENT;

  if (environment === "sandbox") {
    return { fee: 150, available: true };
  }

  const apiKey = process.env.LALAMOVE_API_KEY;
  const secret = process.env.LALAMOVE_SECRET;

  if (!apiKey || !secret) {
    console.warn("LALAMOVE_API_KEY or LALAMOVE_SECRET is not set.");
    return { fee: 0, available: false };
  }

  try {
    const pickupLat = 13.9411;
    const pickupLng = 121.1631;

    const timestamp = Date.now().toString();
    const body = {
      data: {
        serviceType: "MOTORCYCLE",
        language: "en_PH",
        stops: [
          {
            coordinates: {
              lat: pickupLat.toString(),
              lng: pickupLng.toString(),
            },
            address: "Lipa City, Batangas",
          },
          {
            coordinates: {
              lat: dropLat.toString(),
              lng: dropLng.toString(),
            },
            address: dropAddress,
          },
        ],
        item: {
          quantity: "1",
          weight: "LESS_THAN_3KG",
          categories: ["FOOD_DELIVERY"],
          handlingInstructions: [],
        },
        isRouteOptimized: true,
      },
    };

    const rawSignature = `${timestamp}\r\nGET\r\n/v3/quotation\r\n\r\n${JSON.stringify(body)}`;
    const signature = crypto
      .createHmac("sha256", secret)
      .update(rawSignature)
      .digest("hex");

    const response = await axios.post(
      "https://rest.lalamove.com/v3/quotation",
      body,
      {
        headers: {
          Authorization: `hmac id="${apiKey}", nonce="${timestamp}", signature="${signature}"`,
          "Content-Type": "application/json",
          Market: "PH",
        },
      }
    );

    const fee = parseFloat(response.data?.data?.priceBreakdown?.total ?? "0");
    return { fee, available: true };
  } catch (error) {
    console.error("Lalamove delivery fee error:", error);
    return { fee: 0, available: false };
  }
}
