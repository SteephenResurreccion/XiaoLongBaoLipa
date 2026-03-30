import axios from "axios";

export async function sendSMS(to: string, message: string): Promise<void> {
  const apiKey = process.env.SEMAPHORE_API_KEY;

  if (!apiKey) {
    console.warn("SEMAPHORE_API_KEY is not set. SMS not sent.");
    return;
  }

  try {
    await axios.post("https://api.semaphore.co/api/v4/messages", {
      apikey: apiKey,
      number: to,
      message,
      sendername: "XiaoLongBow",
    });
  } catch (error) {
    console.error("Failed to send SMS via Semaphore:", error);
  }
}
