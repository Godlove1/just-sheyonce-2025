import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/lib/Authcontext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sheyonce - Trendy Fashion for Everyone",
  description:
    "Discover the latest fashion trends at Sheyonce. Shop our collection of stylish clothing and accessories for men and women.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
