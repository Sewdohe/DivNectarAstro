import rss from '@astrojs/rss';

import fetchApi from "../../lib/strapi";
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

const articles = await fetchApi({
  endpoint: "articles?populate=cover", // the content type to fetch
  wrappedByKey: "data", // the key to unwrap the response
});

const rssItems = articles.map((article) => {
  return {
    title: article.title,
    description: article.description,
    link: `https://sewdohe.com/blog/${article.slug}`,
    pubDate: new Date(article.published_at).toUTCString(),
    content: parser.render(article.body),
  };
});

export function GET(context) {
  return rss({
    // `<title>` field in output xml
    title: 'Sewdohe’s Blog',
    // `<description>` field in output xml
    description: 'A dirty mechanic\'s ramblings about software development, cars, and life.',
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: rssItems,
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}