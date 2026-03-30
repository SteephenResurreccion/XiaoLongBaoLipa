export interface CartItem {
  id: string;
  size: string;
  pieces: number;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  orderRef: string;
  customerName: string;
  mobileNumber: string;
  items: CartItem[];
  subtotal: number;
  promoCode?: string;
  discount: number;
  reservationFee: number;
  deliveryMethod: string;
  deliveryAddress?: string;
  deliveryFee: number;
  total: number;
  remainingBalance: number;
  paymentMethod: string;
  orderNotes?: string;
  scheduledDate: string;
  timeSlot: string;
  status: string;
}

export interface PromoCode {
  id: string;
  code: string;
  partnerName: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  isActive: boolean;
}

export interface SiteSettings {
  id: string;
  isOpen: boolean;
  closedMessage: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
}
