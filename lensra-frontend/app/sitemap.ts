import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lensra.com'
  
  // 1. Fetch Dynamic Content (Blog Posts & Products)
  let dynamicPages: MetadataRoute.Sitemap = []
  
  try {
    const [blogRes, prodRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`) // Assuming this endpoint exists
    ])

    const posts = await blogRes.json()
    const products = await prodRes.json()

    const blogEntries = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    const productEntries = products.map((prod: any) => ({
      url: `${baseUrl}/shop/${prod.slug}`,
      lastModified: new Date(prod.updated_at || prod.created_at),
      changeFrequency: 'daily',
      priority: 0.9,
    }))

    dynamicPages = [...blogEntries, ...productEntries]
  } catch (error) {
    console.error("Dynamic sitemap fetch failed", error)
  }

  // 2. Your Specific Public Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/digital-gifts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/reseller-program`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/delivery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/business`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/design-ideas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/gift-ideas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  return [...staticPages, ...dynamicPages]
}