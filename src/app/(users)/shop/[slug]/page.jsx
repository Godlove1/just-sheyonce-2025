import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Script from "next/script";
import ProductDetailPage from "../details";

// Fetch product data from Firestore by slug
async function getProductDataBySlug(slug) {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("slug", "==", slug)); // Query by slug
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Product not found");
  }

  const productDoc = querySnapshot.docs[0];
  return { id: productDoc.id, ...productDoc.data() };
}

// Generate metadata dynamically
export async function generateMetadata({ params }) {
  const { slug } = await params; // Destructure slug from params
  const product = await getProductDataBySlug(slug); // Fetch product by slug

  const productImage = product.images[0];

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [productImage],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params; // Destructure slug from params

  try {
    const product = await getProductDataBySlug(slug); // Fetch product by slug

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product?.name,
      description: product?.description,
      image: product?.images[0],
      offers: {
        "@type": "Offer",
        price: product?.price,
        priceCurrency: "XAF",
      },
    };

    return (
      <>
        <Script
          key="product-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <ProductDetailPage id={product?.id} />{" "}
      </>
    );
  } catch (error) {
    console.error("Error fetching product data:", error);
    return <div>Error loading product details.</div>;
  }
}
