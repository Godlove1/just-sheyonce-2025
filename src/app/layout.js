import localFont from "next/font/local";
import "./globals.css";
import { AuthContextProvider } from "@/lib/Authcontext";
import { Toaster } from "react-hot-toast";

// Define the local font with the `variable` property
const graphik = localFont({
  src: [
    {
      path: "./fonts/regular.otf",
      weight: "400", // Regular
      style: "normal", // Normal style
    },
    {
      path: "./fonts/medium.otf",
      weight: "500", // Medium
      style: "normal", // Normal style
    },
    {
      path: "./fonts/semibold.otf",
      weight: "600", // Semibold
      style: "normal", // Normal style
    },
  ],
  variable: "--font-graphik", // Define a CSS variable for the font family
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
        className={`${graphik.variable} font-sans antialiased`} 
      >
        <Toaster />
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
