import Providers from "@/providers";
import Header from "@/components/Header";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
