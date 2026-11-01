import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteClosedBanner from "@/components/SiteClosedBanner";
import DemoBanner from "@/components/DemoBanner";
import { CartProvider } from "@/context/CartContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <DemoBanner />
      <SiteClosedBanner />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
