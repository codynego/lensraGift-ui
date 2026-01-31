"use client";
import MarketplacePage from './MarketplacePage'; 

async function getProducts() {
  try {
    const res = await fetch('https://api.lensra.com/api/products/', {
      cache: 'no-store', // Always get fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Marketplace() {
  const products = await getProducts();

  return <MarketplacePage initialProducts={products} />;
}

export const metadata = {
  title: 'Marketplace - Ready-Made Personalized Gifts | LensraGift',
  description: 'Browse our curated marketplace of ready-made personalized gifts. Find the perfect gift for birthdays, anniversaries, friendships, and more. Fast delivery across Nigeria.',
  keywords: 'personalized gifts marketplace, ready-made gifts Nigeria, custom gifts, birthday gifts, anniversary gifts',
};