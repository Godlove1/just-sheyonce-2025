import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/lib/Authcontext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

// Define Poppins font with selected weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata = {
  title:
    "Sheyonce | Fashion Online For Women | Affordable Women&#39;s Clothing & Accessories",
  description:
    "Sheyonce  is the top online fashion store for women. Shop sexy club dresses, jeans, shoes, bodysuits, skirts and more. Cheap &amp;amp; affordable fashion online.",
  keyword:
    "Sheyonce Fashion Boutique,,top online fashion store, for women, Shop, sexy club dresses, jeans, shoes, bodysuits, skirts, affordable fashion online, , sheyonce, beyonce, sheyonceKiss, sheyonce fashion , sheyonce fashion center, sheyonce kiss",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="mobsted-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,o,b,s,t,e,d){
                m[t]=m[t]||{},e=o.createElement(b),d=o.getElementsByTagName(b)[0],
                e.async=1,e.src=s,d.parentNode.insertBefore(e,d)
              })(window,document,"script","https://cdn.mobsted.com/pwaless.js","pwaless");
              pwaless.config = {
                accountId: "f5162958",
                server: "mobsted.com",
                projectId: 15
              }
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Toaster />
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
