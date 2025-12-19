import type Article from "../interfaces/article";
import fetchApi from "./strapi";

interface StrapiPost {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
  };
  category?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

interface StrapiResponse<T> {
  data: Array<{
    id: number;
    documentId: string;
    attributes: T;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: {
    id: number;
    documentId: string;
    attributes: T;
  };
}

const STRAPI_URL = import.meta.env.STRAPI_URL;

if (!STRAPI_URL) {
  throw new Error("STRAPI_URL environment variable is not set");
}

/**
 * Fetches all blog posts from Strapi
 * @returns Array of Article objects
 */
export async function getAllPosts(): Promise<Article[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles?populate[cover][fields][0]=url&populate[cover][fields][1]=alternativeText&populate[category][populate]=*`,
      {
        headers: {
          Authorization: `bearer ${import.meta.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API returned ${response.status}`);
    }

    const result = await response.json();

    // Map Strapi posts to Article interface
    const articles: Article[] = result.data.map((item: any) => {
      const post = item;

      // Default category if none exists
      const category = post.category || {
        id: 0,
        documentId: "0",
        name: "Uncategorized",
        slug: "uncategorized",
        description: "",
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
      };

      // Default cover if none exists
      const cover = post.cover || {
        url: "",
        alternativeText: post.title,
      };

      // Make cover URL absolute if it's relative
      let coverUrl = cover.url || "";
      if (coverUrl && !coverUrl.startsWith('http')) {
        coverUrl = `${STRAPI_URL}${coverUrl}`;
      }

      const article: Article = {
        id: item.id,
        title: post.title,
        description: post.description,
        content: post.content,
        slug: post.slug,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
        cover: {
          url: coverUrl,
          alternativeText: cover.alternativeText || post.title,
        },
        category: {
          id: category.id,
          documentId: category.documentId,
          name: category.name,
          slug: category.slug,
          description: category.description,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          publishedAt: category.publishedAt,
        },
      };

      return article;
    });

    return articles;
  } catch (error) {
    console.error("Error fetching Strapi posts:", error);
    throw error;
  }
}

/**
 * Fetches all categories with their post counts
 * @returns Array of category objects with post counts
 */
export async function getAllCategories(): Promise<Array<{ id: number; name: string; slug: string; count: number }>> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/categories?populate[articles][fields][0]=id`,
      {
        headers: {
          Authorization: `bearer ${import.meta.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API returned ${response.status}`);
    }

    const result = await response.json();

    // Map categories and calculate post counts
    const categories = result.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      count: item.articles?.length || 0,
    }));

    // Filter out categories with no posts
    return categories.filter((cat: any) => cat.count > 0);
  } catch (error) {
    console.error("Error fetching Strapi categories:", error);
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
    const response = await fetch(
      `${STRAPI_URL}/api/articles?filters[category][slug][$eq]=${categorySlug}&populate[cover][fields][0]=url&populate[cover][fields][1]=alternativeText&populate[category][populate]=*`,
      {
        headers: {
          Authorization: `bearer ${import.meta.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API returned ${response.status}`);
    }

    const result = await response.json();

    // Map Strapi posts to Article interface
    const articles: Article[] = result.data.map((item: any) => {
      const post = item;

      // Default category if none exists
      const category = post.category || {
        id: 0,
        documentId: "0",
        name: "Uncategorized",
        slug: "uncategorized",
        description: "",
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
      };

      // Default cover if none exists
      const cover = post.cover || {
        url: "",
        alternativeText: post.title,
      };

      // Make cover URL absolute if it's relative
      let coverUrl = cover.url || "";
      if (coverUrl && !coverUrl.startsWith('http')) {
        coverUrl = `${STRAPI_URL}${coverUrl}`;
      }

      const article: Article = {
        id: item.id,
        title: post.title,
        description: post.description,
        content: post.content,
        slug: post.slug,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
        cover: {
          url: coverUrl,
          alternativeText: cover.alternativeText || post.title,
        },
        category: {
          id: category.id,
          documentId: category.documentId,
          name: category.name,
          slug: category.slug,
          description: category.description,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          publishedAt: category.publishedAt,
        },
      };

      return article;
    });

    return articles;
  } catch (error) {
    console.error("Error fetching Strapi posts by category:", error);
    return [];
  }
}

/**
 * Fetches a single blog post by slug from Strapi
 * @param slug - The post slug
 * @returns Article object or null if not found
 */
export async function getPostBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate[cover][fields][0]=url&populate[cover][fields][1]=alternativeText&populate[category][populate]=*`,
      {
        headers: {
          Authorization: `bearer ${import.meta.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API returned ${response.status}`);
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      return null;
    }

    const item = result.data[0];
    const post = item;

    // Default category if none exists
    const category = post.category || {
      id: 0,
      documentId: "0",
      name: "Uncategorized",
      slug: "uncategorized",
      description: "",
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
    };

    // Default cover if none exists
    const cover = post.cover || {
      url: "",
      alternativeText: post.title,
    };

    // Make cover URL absolute if it's relative
    let coverUrl = cover.url || "";
    if (coverUrl && !coverUrl.startsWith('http')) {
      coverUrl = `${STRAPI_URL}${coverUrl}`;
    }

    const article: Article = {
      id: item.id,
      title: post.title,
      description: post.description,
      content: post.content,
      slug: post.slug,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      cover: {
        url: coverUrl,
        alternativeText: cover.alternativeText || post.title,
      },
      category: {
        id: category.id,
        documentId: category.documentId,
        name: category.name,
        slug: category.slug,
        description: category.description,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        publishedAt: category.publishedAt,
      },
    };

    return article;
  } catch (error) {
    console.error("Error fetching Strapi post:", error);
    return null;
  }
}
