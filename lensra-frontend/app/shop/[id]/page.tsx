// app/shop/[slug]/page.tsx
// Note: This is the server component for the product detail page

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClientProductDetail from './ClientProductDetail';
import ProductSchema from '@/components/ProductSchema'; // Assuming this is in components; update to support image array and offers

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
  category_slug: string;
  image_url: string | null;
  gallery: ProductImage[];
  variants: ProductVariant[];
  min_order_quantity: number;
  is_customizable: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_trending: boolean;
  stock_quantity?: number;
  sku?: string;
  // Add if API provides: ratings?: { average: number; count: number };
}

const getFullImageUrl = (imagePath: string | null | undefined, baseUrl: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${baseUrl.replace(/\/$/, '')}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${BaseUrl}api/products/${params.slug}/`, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Product not found');
    const product: ProductDetail = await response.json();

    const images = [
      product.image_url,
      ...product.gallery.map((g) => g.image_url),
    ].filter(Boolean).map((img) => getFullImageUrl(img, BaseUrl)) as string[];

    return {
      title: `${product.name} | Personalized ${product.category_name} Gifts in Nigeria - Lensra`,
      description: product.description.slice(0, 160) + '...',
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
        url: `https://www.lensra.com/shop/${params.slug}`,
        images: images.map((img) => ({
          url: img,
          width: 800, // Adjust based on actual image dimensions if known
          height: 600,
          alt: `${product.name} Image`,
        })),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Lensra Gifts`,
        description: 'Personalized with secret messages and emotions. Shop now!',
        images,
      },
      alternates: {
        canonical: `/shop/${params.slug}`,
      },
    };
  } catch {
    return {
      title: 'Product Not Found | Lensra Gifts',
      description: 'Browse our collection of premium personalized gifts.',
    };
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product: ProductDetail | null = null;
  let relatedProducts: ProductDetail[] = [];

  try {
    const response = await fetch(`${BaseUrl}api/products/${params.slug}/`, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Product not found');
    product = await response.json();

    if (product) {
      // Preprocess images for product
      if (product.image_url) {
        product.image_url = getFullImageUrl(product.image_url, BaseUrl);
      }
      product.gallery = product.gallery.map((g) => ({
        ...g,
        image_url: getFullImageUrl(g.image_url, BaseUrl),
      }));

      const relatedRes = await fetch(`${BaseUrl}api/related/${product.slug}/`, { next: { revalidate: 3600 } });
      if (relatedRes.ok) {
        const relatedData = await relatedRes.json();
        const productsArray = Array.isArray(relatedData) ? relatedData : (relatedData.results || []);
        relatedProducts = productsArray
          .filter((p: ProductDetail) => p.id !== product?.id)
          .slice(0, 4)
          .map((p: ProductDetail) => ({
            ...p,
            image_url: getFullImageUrl(p.image_url, BaseUrl),
            // Preprocess gallery if needed for cards, but since cards use image_url, fine
          }));
      }
    }
  } catch (err) {
    console.error('Error fetching product:', err);
  }

  if (!product) {
    notFound(); // Throws to Next.js 404 page
  }

  return (
    <>
      <ProductSchema
        id={product.id.toString()}
        name={product.name}
        description={product.description}
        image={product.image_url || product.gallery[0]?.image_url || ''}
        price={parseFloat(product.base_price)}
        currency="NGN"
        availability={product.variants.some((v) => v.stock_quantity > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}
        url={`https://www.lensra.com/shop/${params.slug}`}
        category={product.category_name}
        // Add rating if available: reviewCount, aggregateRating
        breadcrumbs={{
          itemListElement: [
            { position: 1, name: 'Home', item: 'https://www.lensra.com' },
            { position: 2, name: product.category_name, item: `https://www.lensra.com/shop?category=${encodeURIComponent(product.category_name)}` },
            { position: 3, name: product.name, item: `https://www.lensra.com/shop/${params.slug}` },
          ],
        }}
      />
      <ClientProductDetail
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}