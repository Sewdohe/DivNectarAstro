import type Article from "../interfaces/article";

interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
}

interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

const WORDPRESS_URL = import.meta.env.WORDPRESS_URL;

if (!WORDPRESS_URL) {
  throw new Error("WORDPRESS_URL environment variable is not set");
}

/**
 * Fetches all blog posts from WordPress
 * @returns Array of Article objects
 */
export async function getAllPosts(): Promise<Article[]> {
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?_embed`);

    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();

    // Map WordPress posts to Article interface
    const articles = await Promise.all(
      posts.map(async (post) => {
        // Get featured image
        let coverUrl = "";
        let coverAlt = "";

        if (post.featured_media && (post as any)._embedded?.["wp:featuredmedia"]) {
          const media = (post as any)._embedded["wp:featuredmedia"][0];
          coverUrl = media.source_url || "";
          coverAlt = media.alt_text || post.title.rendered;
        }

        // Get category
        let category = {
          id: 0,
          documentId: "0",
          name: "Uncategorized",
          slug: "uncategorized",
          description: "",
          createdAt: post.date,
          updatedAt: post.modified,
          publishedAt: post.date,
        };

        if (post.categories && post.categories.length > 0 && (post as any)._embedded?.["wp:term"]) {
          const wpCategory = (post as any)._embedded["wp:term"][0][0];
          if (wpCategory) {
            category = {
              id: wpCategory.id,
              documentId: wpCategory.id.toString(),
              name: wpCategory.name,
              slug: wpCategory.slug,
              description: wpCategory.description || "",
              createdAt: post.date,
              updatedAt: post.modified,
              publishedAt: post.date,
            };
          }
        }

        // Strip HTML tags from excerpt to get plain text description
        const description = post.excerpt.rendered
          .replace(/<[^>]*>/g, "")
          .trim();

        const article: Article = {
          id: post.id,
          title: post.title.rendered,
          description: description,
          content: post.content.rendered,
          slug: post.slug,
          createdAt: post.date,
          updatedAt: post.modified,
          publishedAt: post.date,
          cover: {
            url: coverUrl,
            alternativeText: coverAlt,
          },
          category: category,
        };

        return article;
      })
    );

    return articles;
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    throw error;
  }
}

/**
 * Fetches all categories with their post counts
 * @returns Array of category objects with post counts
 */
export async function getAllCategories(): Promise<Array<{ id: number; name: string; slug: string; count: number }>> {
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/categories`);

    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}`);
    }

    const categories: Array<{ id: number; name: string; slug: string; count: number }> = await response.json();

    // Filter out categories with no posts
    return categories.filter(cat => cat.count > 0);
  } catch (error) {
    console.error("Error fetching WordPress categories:", error);
    return [];
  }
}

/**
 * Fetches blog posts filtered by category slug
 * @param categorySlug - The category slug to filter by
 * @returns Array of Article objects in that category
 */
export async function getPostsByCategory(categorySlug: string): Promise<Article[]> {
  try {
    // First get the category ID from slug
    const categoriesResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/categories?slug=${categorySlug}`);

    if (!categoriesResponse.ok) {
      throw new Error(`WordPress API returned ${categoriesResponse.status}`);
    }

    const categories: WordPressCategory[] = await categoriesResponse.json();

    if (!categories || categories.length === 0) {
      return [];
    }

    const categoryId = categories[0].id;

    // Now fetch posts with that category
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?categories=${categoryId}&_embed`);

    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();

    // Map WordPress posts to Article interface (reuse logic from getAllPosts)
    const articles = await Promise.all(
      posts.map(async (post) => {
        // Get featured image
        let coverUrl = "";
        let coverAlt = "";

        if (post.featured_media && (post as any)._embedded?.["wp:featuredmedia"]) {
          const media = (post as any)._embedded["wp:featuredmedia"][0];
          coverUrl = media.source_url || "";
          coverAlt = media.alt_text || post.title.rendered;
        }

        // Get category
        let category = {
          id: categories[0].id,
          documentId: categories[0].id.toString(),
          name: categories[0].name,
          slug: categories[0].slug,
          description: categories[0].description || "",
          createdAt: post.date,
          updatedAt: post.modified,
          publishedAt: post.date,
        };

        // Strip HTML tags from excerpt to get plain text description
        const description = post.excerpt.rendered
          .replace(/<[^>]*>/g, "")
          .trim();

        const article: Article = {
          id: post.id,
          title: post.title.rendered,
          description: description,
          content: post.content.rendered,
          slug: post.slug,
          createdAt: post.date,
          updatedAt: post.modified,
          publishedAt: post.date,
          cover: {
            url: coverUrl,
            alternativeText: coverAlt,
          },
          category: category,
        };

        return article;
      })
    );

    return articles;
  } catch (error) {
    console.error("Error fetching WordPress posts by category:", error);
    return [];
  }
}

/**
 * Fetches a single blog post by slug from WordPress
 * @param slug - The post slug
 * @returns Article object or null if not found
 */
export async function getPostBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`
    );

    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();

    if (!posts || posts.length === 0) {
      return null;
    }

    const post = posts[0];

    // Get featured image
    let coverUrl = "";
    let coverAlt = "";

    if (post.featured_media && (post as any)._embedded?.["wp:featuredmedia"]) {
      const media = (post as any)._embedded["wp:featuredmedia"][0];
      coverUrl = media.source_url || "";
      coverAlt = media.alt_text || post.title.rendered;
    }

    // Get category
    let category = {
      id: 0,
      documentId: "0",
      name: "Uncategorized",
      slug: "uncategorized",
      description: "",
      createdAt: post.date,
      updatedAt: post.modified,
      publishedAt: post.date,
    };

    if (post.categories && post.categories.length > 0 && (post as any)._embedded?.["wp:term"]) {
      const wpCategory = (post as any)._embedded["wp:term"][0][0];
      if (wpCategory) {
        category = {
          id: wpCategory.id,
          documentId: wpCategory.id.toString(),
          name: wpCategory.name,
          slug: wpCategory.slug,
          description: wpCategory.description || "",
          createdAt: post.date,
          updatedAt: post.modified,
          publishedAt: post.date,
        };
      }
    }

    // Strip HTML tags from excerpt to get plain text description
    const description = post.excerpt.rendered
      .replace(/<[^>]*>/g, "")
      .trim();

    const article: Article = {
      id: post.id,
      title: post.title.rendered,
      description: description,
      content: post.content.rendered,
      slug: post.slug,
      createdAt: post.date,
      updatedAt: post.modified,
      publishedAt: post.date,
      cover: {
        url: coverUrl,
        alternativeText: coverAlt,
      },
      category: category,
    };

    return article;
  } catch (error) {
    console.error("Error fetching WordPress post:", error);
    return null;
  }
}
