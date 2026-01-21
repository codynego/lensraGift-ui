import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lensra.com' // Update with your actual domain

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/business',
          '/category',
          '/contact',
          '/design-ideas',
          '/designer',
          '/digital-gifts',
          '/editor',
          '/gift-ideas',
          '/products',
          '/reseller-program',
          '/support',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/cart',
          '/checkout',
          '/payment',
          '/payment/*',
          '/order-success',
          '/reveal/*',
          '/secret-message/*',
          '/track',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
