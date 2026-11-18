import blogs, { getBlogBySlug, getBlogSeoMeta } from '../src/data/blogSeoData.js';

async function verify() {
  console.log('=== VERIFYING ALL 8 BLOGS ===\n');

  for (const b of blogs) {
    console.log(`Checking: ${b.slug}`);
    
    // 1. Local data check
    const local = getBlogBySlug(b.slug);
    if (!local) {
      console.error(`  FAIL: local data missing for ${b.slug}`);
    } else {
      console.log(`  [OK] Local Data: "${local.title}" (Words: ${local.wordCount}, FAQs: ${local.faqs?.length})`);
    }

    // 2. Local SEO Meta check
    const meta = getBlogSeoMeta(b.slug);
    console.log(`  [OK] Local SEO: Title="${meta.title}" (${meta.title.length} chars)`);
    console.log(`  [OK] Local SEO: Desc="${meta.description}" (${meta.description.length} chars)`);

    // 3. Live API Blog Details
    try {
      const res = await fetch(`https://beauty.joyory.com/api/blogs/slug/${b.slug}`);
      const data = await res.json();
      console.log(`  [OK] Live API Blog: "${data.title}" (Content: ${(data.content || '').length} chars, ReadingTime: ${data.readingTime}m)`);
    } catch (e) {
      console.error(`  [FAIL] Live API Blog: ${e.message}`);
    }

    // 4. Live API SEO Meta
    try {
      const res = await fetch(`https://beauty.joyory.com/api/seo?type=blog&slug=${b.slug}`);
      const data = await res.json();
      console.log(`  [OK] Live API SEO: Title="${data.title}" | Desc="${data.description?.substring(0, 50)}..."`);
    } catch (e) {
      console.error(`  [FAIL] Live API SEO: ${e.message}`);
    }
    console.log('');
  }
}

verify().catch(console.error);
