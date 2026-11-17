const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve('./src/data/blogSeoData.json');
const jsPath = path.resolve('./src/data/blogSeoData.js');

let raw = fs.readFileSync(jsonPath, 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) {
  raw = raw.slice(1);
}
const blogs = JSON.parse(raw);

const unescape = (str = '') => {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
};

blogs.forEach(b => {
  b.title = unescape(b.title);
  b.metaTitle = unescape(b.metaTitle);
  b.metaDescription = unescape(b.metaDescription);
  b.excerpt = unescape(b.excerpt);

  if (b.slug === '10-eye-makeup-tips-to-make-your-eyes-look-bigger-and-brighter') {
    b.metaTitle = '10 Eye Makeup Tips to Make Your Eyes Look Bigger';
    b.metaDescription = 'Discover 10 easy eye makeup tips to make your eyes look bigger and brighter, from eyeliner and eyeshadow techniques to mascara and highlighting tricks.';
  }

  if (b.slug === 'party-makeup-look-how-to-achieve-a-glamorous-finish') {
    b.title = 'How to Achieve a Glamorous Finish: A Step-by-Step Makeup Guide';
    b.metaTitle = 'How to Achieve a Glamorous Makeup Look';
    b.metaDescription = 'Learn how to achieve a glamorous makeup look with easy steps for a flawless base, glowing skin, defined eyes, beautiful lips and long-lasting wear.';
    b.excerpt = 'If you want to know how to achieve a glamorous makeup look, prepare your skin, build a smooth base in thin layers, add soft dimension, define your eyes, pick a lip colour that balances them, and set everything so it lasts.';
  }

  if (b.slug === 'makeup-mistakes-to-avoid-for-a-perfect-looks') {
    b.title = 'Makeup Mistakes to Avoid for a Perfect Look: 15 Common Errors and How to Fix Them';
    b.metaTitle = 'Makeup Mistakes to Avoid for a Flawless Look';
    b.metaDescription = 'Discover 15 common makeup mistakes to avoid and learn how to fix foundation, concealer, eyeliner, and blending errors for a flawless, natural-looking finish.';
    b.excerpt = 'The makeup mistakes to avoid are mostly small ones: the wrong shade, too much product, skipped blending, or rushed skin prep. Fix these few habits and your makeup looks smoother, lasts longer, and feels more like skin.';
  }

  if (b.slug === 'how-to-find-your-perfect-foundation-shade') {
    b.title = 'How to Find Your Perfect Foundation Shade: A Complete Guide';
    b.metaTitle = 'How to Choose the Right Foundation Shade for Your Skin';
    b.metaDescription = 'Discover how to find your foundation shade by identifying your skin tone, undertone, and ideal match, with tips for testing and shopping online.';
    b.excerpt = 'Find your perfect foundation shade step by step by identifying your skin depth and undertone, choosing 2-3 close shades, testing them along your jawline, and comparing in daylight.';
  }

  // Refine FAQs
  b.faqs = b.faqs.map(f => ({
    question: unescape(f.question).replace(/^Q\d*[:.]\s*/i, '').trim(),
    answer: unescape(f.answer).replace(/^A\d*[:.]\s*/i, '').trim()
  })).filter(f => f.question && f.question.endsWith('?') && f.answer.length > 10);
});

fs.writeFileSync(jsonPath, JSON.stringify(blogs, null, 2), 'utf8');

// Generate JS module as well
const jsContent = `// Generated Blog SEO and Full Content Data
export const blogSeoData = ${JSON.stringify(blogs, null, 2)};

export const getBlogBySlug = (slug) => {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  return blogSeoData.find(b => b.slug === cleanSlug || (b.alternateSlugs && b.alternateSlugs.includes(cleanSlug))) || null;
};

export const getBlogSeoMeta = (slug) => {
  const blog = getBlogBySlug(slug);
  if (!blog) return null;
  return {
    title: blog.metaTitle,
    description: blog.metaDescription,
    canonical: \`https://joyory.com/blog/\${blog.slug}\`,
    image: blog.coverImage,
    faqs: blog.faqs
  };
};

export default blogSeoData;
`;

fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log('Successfully refined and saved blogSeoData.json and blogSeoData.js!');
