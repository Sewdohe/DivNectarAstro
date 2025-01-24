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
  }
}