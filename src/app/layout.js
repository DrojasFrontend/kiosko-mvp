import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import siteData from "@/content/site.json";

const anton = Anton({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-small",
  subsets: ["latin"],
});

export const metadata = {
  title: siteData.marca.nombre,
  description: siteData.marca.descripcion,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${anton.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
