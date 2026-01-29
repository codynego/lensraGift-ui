import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lensra.com'

  return {
    rules: [
      {
        userAgent: '*',
        // 1. We allow the root, which automatically covers all sub-pages 
        // unless they are explicitly disallowed below.
        allow: '/',
        
        // 2. Protect private user data and non-content pages
        disallow: [
          '/dashboard/',      // Private user area
          '/cart/',           // Shopping cart
          '/checkout/',       // Checkout flow
          '/payment/',       // Payment processing
          '/order-success/',   // Post-purchase page
          '/reveal/',        // Gift reveal logic (protects the surprise!)
          '/secret-message/', // Confidential gift messages
          '/track/',          // Order tracking (requires specific ID)
          '/api/',           // Backend endpoints
          '/login/',          // No need to index the login page
          '/signup/',         // No need to index the signup page
        ],
      },
    ],
    // 3. Point bots directly to your dynamic sitemap
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}