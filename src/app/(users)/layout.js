
import Footer from "@/components/footer";
import Header from "@/components/header";


export default function UsersLayout({ children }) {
 
  return (
    <>
      {/* <CartProviderContext> */}
      <div className="mx-auto max-w-md bg-white min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
      {/* </CartProviderContext> */}
    </>
  );
}
