
import Footer from "@/components/footer";
import Header from "@/components/header";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function UsersLayout({ children }) {
 
  return (
    <>
      <GoogleAnalytics
        gaId="G-LYZW8JRNBL"
      />
      {/* <CartProviderContext> */}
      <div className="mx-auto max-w-md ">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
      {/* </CartProviderContext> */}
    </>
  );
}
