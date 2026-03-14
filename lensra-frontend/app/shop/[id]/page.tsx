// app/shop/[id]/page.tsx
// Adire — Product detail server component

import { Metadata } from "next";
import ClientProductDetail from "./ClientProductDetail";
import ProductSchema from "@/components/ProductSchema";

const BaseUrl  = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";
const SiteUrl  = "https://www.lensra.com";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AttributeValue { id: number; attribute_name: string; value: string; }
interface ProductVariant  { id: number; attributes: AttributeValue[]; price_override: string | null; stock_quantity: number; }
interface ProductImage    { id: number; image_url: string; alt_text: string; }

interface ProductDetail {
  id: number; name: string; slug: string; description: string;
  base_price: string; display_price: string;
  is_on_sale: boolean; original_price: string | null;
  category_name: string; image_url: string | null;
  gallery: ProductImage[]; variants: ProductVariant[];
  min_order_quantity: number; is_customizable: boolean; message: string | null;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(`${BaseUrl}api/products/${params.id}/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Not found");
    const product: ProductDetail = await res.json();

    const images = [product.image_url, ...product.gallery.map(g => g.image_url)].filter(Boolean) as string[];

    return {
      title: `${product.name} | Personalised Ankara Gift — Adire Nigeria`,
      description: product.description.slice(0, 160) + "…",
      keywords: [
        product.name.toLowerCase(),
        `personalised ${product.category_name.toLowerCase()} Nigeria`,
        "custom Ankara gift Nigeria",
        "embroidered Ankara bag Nigeria",
        "personalised gifts Benin City",
        "Adire gifts",
      ],
      openGraph: {
        title: `${product.name} — Adire Personalised Ankara Gifts`,
        description: "Handmade, embroidered with your name. Made in Benin City. Delivered across Nigeria.",
        url: `${SiteUrl}/shop/${params.id}`,
        images: images.map(img => ({ url: img, width: 800, height: 1067, alt: product.name })),
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | Adire`,
        description: "Personalised Ankara gift. Made in Nigeria, delivered nationwide.",
        images,
      },
      alternates: { canonical: `/shop/${params.id}` },
    };
  } catch {
    return {
      title: "Product Not Found | Adire",
      description: "Browse our collection of personalised Ankara gifts.",
    };
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let product: ProductDetail | null = null;
  let related: ProductDetail[] = [];

  try {
    const res = await fetch(`${BaseUrl}api/products/${params.id}/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Product not found");
    product = await res.json();

    if (product) {
      const relRes = await fetch(
        `${BaseUrl}api/products/?category__name=${product.category_name}`,
        { next: { revalidate: 3600 } }
      );
      if (relRes.ok) {
        const relData = await relRes.json();
        const arr: ProductDetail[] = Array.isArray(relData) ? relData : (relData.results ?? []);
        related = arr.filter(p => product && p.id !== product.id).slice(0, 4);
      }
    }
  } catch (err) {
    console.error("[Adire] Product fetch error:", err);
  }

  if (!product) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(28px, 5vw, 52px)",
        fontWeight: 900, fontStyle: "italic",
        color: "#1B2A4A", background: "#F5F0E8",
      }}>
        Item not found.
      </div>
    );
  }

  return (
    <>
      <ProductSchema
        id={product.id.toString()}
        name={product.name}
        description={product.description}
        image={product.image_url || product.gallery[0]?.image_url || ""}
        price={parseFloat(product.base_price)}
        currency="NGN"
        availability={
          product.variants.some(v => v.stock_quantity > 0)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock"
        }
        url={`${SiteUrl}/shop/${params.id}`}
        category={product.category_name}
        breadcrumbs={{
          itemListElement: [
            { position: 1, name: "Home",              item: SiteUrl },
            { position: 2, name: product.category_name, item: `${SiteUrl}/shop?category=${product.category_name}` },
            { position: 3, name: product.name,          item: `${SiteUrl}/shop/${params.id}` },
          ],
        }}
      />
      <ClientProductDetail
        initialProduct={product}
        initialRelatedProducts={related}
        baseUrl={BaseUrl}
      />
    </>
  );
}