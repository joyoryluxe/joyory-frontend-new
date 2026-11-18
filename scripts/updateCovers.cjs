async function updateCovers() {
  const { default: mongoose } = await import('../../backend/node_modules/mongoose/index.js');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/joyory';
  await mongoose.connect(uri);
  const defaultMakeupImage = 'https://res.cloudinary.com/dekngswix/image/upload/v1774588062/blogs/vkj1ajgikmjqi03na3t5.png';
  const res = await mongoose.connection.db.collection('blogs').updateMany(
    { $or: [{ coverImage: '' }, { coverImage: null }, { coverImage: { $exists: false } }] },
    { $set: { coverImage: defaultMakeupImage, 'seo.ogImage': defaultMakeupImage } }
  );
  console.log('Updated cover images for empty blogs count:', res.modifiedCount);
  await mongoose.disconnect();
}

updateCovers().catch(err => {
  console.error(err);
  process.exit(1);
});
