import { Product, BreadcrumbList, WithContext, AggregateRating } from 'schema-dts';

interface ProductSchemaProps {
  id: string;
  name: string;
  description: string;
  image: string | string[]; // Support multiple images
  price: number;
  currency?: string;
  availability?: string;
  url: string;
  category?: string; // New: For product category
  rating?: { // New: For reviews if available
    ratingValue: number;
    reviewCount: number;
  };
  breadcrumbs?: { // New: For breadcrumb schema
    itemListElement: Array<{
      position: number;
      name: string;
      item: string;
    }>;
  };
}

export default function ProductSchema({
  id,
  name,
  description,
  image,
  price,
  currency = "NGN",
  availability = "https://schema.org/InStock",
  url,
  category,
  rating,
  breadcrumbs,
}: ProductSchemaProps) {
  
  const productJsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "image": image,
    "description": description,
    "sku": `LNS-${id}`,
    "brand": {
      "@type": "Brand",
      "name": "Lensra"
    },
    "category": category, // Added
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": currency,
      "price": price,
      "availability": availability as any,
      "itemCondition": "https://schema.org/NewCondition",
    },
    ...(rating && { // Conditionally add ratings
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.ratingValue,
        "reviewCount": rating.reviewCount,
      } as AggregateRating,
    }),
  };

  const schemas: Array<WithContext<Product | BreadcrumbList>> = [productJsonLd];

  if (breadcrumbs) {
    const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.itemListElement.map((crumb) => ({
        "@type": "ListItem",
        "position": crumb.position,
        "name": crumb.name,
        "item": crumb.item,
      })),
    };
    schemas.push(breadcrumbJsonLd);
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}