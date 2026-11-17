const fs = require('fs');
const path = require('path');

async function updateBlogs() {
  const { default: mongoose } = await import('../../backend/node_modules/mongoose/index.js');
  const uri = 'mongodb+srv://joyoryluxe:Joyory123@joyoryluxe.4rnfwin.mongodb.net/joyory';
  
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB successfully!');

  const blogsCollection = mongoose.connection.db.collection('blogs');
  
  const rawData = fs.readFileSync(path.resolve(__dirname, '../src/data/blogSeoData.json'), 'utf8');
  const blogsData = JSON.parse(rawData);

  console.log(`Loaded ${blogsData.length} blogs from blogSeoData.json`);

  for (const item of blogsData) {
    console.log(`\nUpdating blog: "${item.title}" (slug: ${item.slug})`);

    // Find the blog by slug or by regex matching title
    let existing = await blogsCollection.findOne({ slug: item.slug });
    if (!existing && item.alternateSlugs && item.alternateSlugs.length > 0) {
      existing = await blogsCollection.findOne({ slug: { $in: item.alternateSlugs } });
    }
    if (!existing) {
      // Try finding by prefix or keyword in title
      const titleKeyword = item.title.split(' ')[0];
      existing = await blogsCollection.findOne({ title: new RegExp(titleKeyword, 'i') });
    }

    if (!existing) {
      console.warn(`Could not find blog in DB for slug: ${item.slug}`);
      continue;
    }

    console.log(`Found DB record ID: ${existing._id} | Current Title: ${existing.title}`);

    // Determine focusKeyword
    let focusKeyword = '';
    if (item.slug.includes('skincare-tips')) focusKeyword = 'skincare tips for glowing skin';
    else if (item.slug.includes('eye-makeup')) focusKeyword = 'eye makeup tips make eyes look bigger';
    else if (item.slug.includes('foundation-shade')) focusKeyword = 'find your foundation shade';
    else if (item.slug.includes('makeup-mistakes')) focusKeyword = 'makeup mistakes to avoid';
    else if (item.slug.includes('lip-care')) focusKeyword = 'lip care and lipstick tips';
    else if (item.slug.includes('everyday-makeup')) focusKeyword = 'flawless everyday makeup look';
    else if (item.slug.includes('glamorous-finish') || item.slug.includes('party-makeup')) focusKeyword = 'glamorous makeup look';
    else focusKeyword = 'everyday makeup guide';

    const updateFields = {
      title: item.title,
      description: item.excerpt,
      excerpt: item.excerpt,
      content: item.content,
      contentSections: [],
      readingTime: item.readingTime,
      status: 'published',
      updatedAt: new Date(),
      seo: {
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
        focusKeyword: focusKeyword,
        ogImage: item.coverImage || existing.coverImage || existing.image || 'https://joyory.com/logo.png'
      }
    };

    const result = await blogsCollection.updateOne(
      { _id: existing._id },
      { $set: updateFields }
    );

    console.log(`Update result for ${existing._id}: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
  }

  console.log('\nAll blogs updated successfully in MongoDB!');
  await mongoose.disconnect();
}

updateBlogs().catch(err => {
  console.error('Error updating blogs:', err);
  process.exit(1);
});
