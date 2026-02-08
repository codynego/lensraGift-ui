// app/shop/[id]/page.tsx
// Note: This is the server component for the product detail page

import { Metadata } from 'next';
import ClientProductDetail from './ClientProductDetail'; // We'll define this below
import ProductSchema from '@/components/ProductSchema'; // Assuming this is in components

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

interface AttributeValue {
  id: number;
  attribute_name: string;
  value: string;
}

interface ProductVariant {
  id: number;
  attributes: AttributeValue[];
  price_override: string | null;
  stock_quantity: number;
}

interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string;
}

interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  base_price: string;
  category_name: string;
  display_price: string;
  is_on_sale: boolean;
  original_price: string | null;
  image_url: string | null;
  gallery: ProductImage[];
  variants: ProductVariant[];
  min_order_quantity: number;
  is_customizable: boolean;
  message: string | null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${BaseUrl}api/products/${params.id}/`, { next: { revalidate: 3600 } }); // ISR every hour
    if (!response.ok) throw new Error('Product not found');
    const product: ProductDetail = await response.json();

    const images = [product.image_url, ...product.gallery.map((g) => g.image_url)].filter(Boolean) as string[];

    return {
      title: `${product.name} | Personalized ${product.category_name} Gifts in Nigeria - Lensra`,
      description: product.description.slice(0, 160) + '...', // Truncate for meta
      keywords: [
        product.name.toLowerCase(),
        `${product.category_name.toLowerCase()} gifts Nigeria`,
        'personalized gifts Lagos',
        'custom print on demand',
        'digital surprise gifts',
        'Lensra products',
      ],
      openGraph: {
        title: `${product.name} - Premium Custom Gift by Lensra`,
        description: 'Discover this unique personalized gift with instant digital reveal. Perfect for special occasions.',
        url: `https://www.lensra.com/shop/${params.id}`,
        images: images.map((img) => ({
          url: img,
          width: 800, // Adjust based on actual sizes
          height: 600,
          alt: `${product.name} Image`,
        })),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Lensra Gifts`,
        description: 'Personalized with secret messages and emotions. Shop now!',
        images: images,
      },
      alternates: {
        canonical: `/shop/${params.id}`,
      },
    };
  } catch (err) {
    return {
      title: 'Product Not Found | Lensra Gifts',
      description: 'Browse our collection of premium personalized gifts.',
    };
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  let product: ProductDetail | null = null;
  let relatedProducts: ProductDetail[] = [];

  try {
    const response = await fetch(`${BaseUrl}api/products/${params.id}/`, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Product not found');
    product = await response.json();

    if (product) {
      const relatedRes = await fetch(`${BaseUrl}api/products/?category__name=${product.category_name}`, { next: { revalidate: 3600 } });
      if (relatedRes.ok) {
        const relatedData = await relatedRes.json();
        const productsArray = Array.isArray(relatedData) ? relatedData : (relatedData.results || []);
        relatedProducts = productsArray.filter((p: ProductDetail) => product && p.id !== product.id).slice(0, 4);
      }
    }
  } catch (err) {
    console.error(err);
    // Optionally render error UI
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center font-black uppercase text-4xl italic">Item not found.</div>;
  }

  return (
    <>
      <ProductSchema
        id={product.id.toString()}
        name={product.name}
        description={product.description}
        image={product.image_url || product.gallery[0]?.image_url || ''} // Or array if multiple
        price={parseFloat(product.base_price)}
        currency="NGN"
        availability={product.variants.some((v) => v.stock_quantity > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}
        url={`https://www.lensra.com/shop/${params.id}`}
        category={product.category_name}
        // Add rating if available from product data
        // breadcrumbs as before
        breadcrumbs={{
          itemListElement: [
            { position: 1, name: 'Home', item: 'https://www.lensra.com' },
            { position: 2, name: product.category_name, item: `https://www.lensra.com/shop?category=${product.category_name}` },
            { position: 3, name: product.name, item: `https://www.lensra.com/shop/${params.id}` },
          ]
        }}
      />
      <ClientProductDetail 
        initialProduct={product} 
        initialRelatedProducts={relatedProducts} 
        baseUrl={BaseUrl} 
      />
    </>
  );
}