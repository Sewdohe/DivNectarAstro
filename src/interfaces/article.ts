export default interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover: {
    url: string;
    alternativeText?: string;
  },
  category: {
    id: number,
    documentId: string,
    name: string,
    slug: string,
    description: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string
  }
}