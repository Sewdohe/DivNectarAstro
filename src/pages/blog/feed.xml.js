import rss from '@astrojs/rss';
import { getAllPosts } from "../../lib/wordpress";
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
  try {
    // Fetch all blog posts from WordPress
    const articles = await getAllPosts();

    const rssItems = articles.map((article) => {
      return {
        title: article.title,
        description: article.description,
        link: `https://divnectar.com/blog/${article.slug}`,
        pubDate: new Date(article.publishedAt),
        content: parser.render(article.content),
        categories: [article.category.name],
        author: 'Sewdohe',
      };
    });

    return rss({
      // `<title>` field in output xml
      title: 'DivNectar - Blog',
      // `<description>` field in output xml
      description: 'Sewdohe\'s useless ramblings about the web, tech, Minecraft and life.',
      // Base site URL
      site: 'https://divnectar.com',
      // Array of `<item>`s in output xml
      items: rssItems,
      // (optional) inject custom xml
      customData: `<language>en-us</language>`,
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
