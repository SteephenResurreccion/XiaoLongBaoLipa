export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateOrderRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "XLB-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatPrice(amount: number): string {
  if (amount >= 1000) {
    return `₱${amount.toLocaleString("en-PH")}`;
  }
  return `₱${amount}`;
}

export const MENU_ITEMS = [
  {
    id: "small",
    name: "Chocolate Xiao Long Bao",
    size: "Small",
    pieces: 5,
    price: 99,
  },
  {
    id: "medium",
    name: "Chocolate Xiao Long Bao",
    size: "Medium",
    pieces: 10,
    price: 169,
  },
  {
    id: "large",
    name: "Chocolate Xiao Long Bao",
    size: "Large",
    pieces: 15,
    price: 219,
  },
];

export const TIME_SLOTS = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "1:00 PM - 3:00 PM",
  "3:00 PM - 5:00 PM",
];
