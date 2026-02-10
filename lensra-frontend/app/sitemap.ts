import { MetadataRoute } from 'next'



// Tell Next.js to revalidate this sitemap every 1 hour (3600 seconds)

export const revalidate = 3600 



export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const baseUrl = 'https://lensra.com'

  

  let dynamicPages: MetadataRoute.Sitemap = []

  

  try {

    // IMPORTANT: Ensure these endpoints return ALL items, not just page 1

    const [blogRes, prodRes] = await Promise.all([

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/`, { next: { revalidate: 3600 } }),

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`, { next: { revalidate: 3600 } })

    ])



    // Safety check for non-200 responses

    if (blogRes.ok && prodRes.ok) {

      const posts = await blogRes.json()

      const products = await prodRes.json()



      // Use optional chaining and fallbacks for dates

      const blogEntries = posts.map((post: any) => ({

        url: `${baseUrl}/blog/${post.slug}`,

        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.created_at),

        changeFrequency: 'weekly' as const,

        priority: 0.7,

      }))



      const productEntries = products.map((prod: any) => ({

        url: `${baseUrl}/shop/${prod.slug}`,

        lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(prod.created_at),

        changeFrequency: 'daily' as const,

        priority: 0.9,

      }))



      dynamicPages = [...blogEntries, ...productEntries]

    }

  } catch (error) {

    console.error("Sitemap dynamic fetch failed:", error)

    // Fallback: dynamicPages remains empty, sitemap still serves static pages

  }



  const staticPages: MetadataRoute.Sitemap = [

    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/digital-gifts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/reseller-program`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/delivery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 }
    { url: `${baseUrl}/business`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/design-ideas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/gift-ideas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },

  ].map(page => ({

    ...page,

    changeFrequency: page.changeFrequency as "daily" | "weekly" | "monthly" | "always" | "hourly" | "yearly" | "never"

  }))



  return [...staticPages, ...dynamicPages]

}