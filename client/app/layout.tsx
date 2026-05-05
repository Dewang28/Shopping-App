import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/layout/Header";
import { Toaster } from "react-hot-toast";
import AuthCartBootstrap from "./components/AuthCartBootstrap";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <AuthCartBootstrap />
        <Header />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
