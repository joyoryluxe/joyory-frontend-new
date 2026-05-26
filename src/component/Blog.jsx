// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import { Spinner, Container, Row, Col } from 'react-bootstrap';

// const API_BASE = 'https://beauty.joyory.com/api';

// const Blog = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState({
//     trendingBlog: null,
//     categoryNav: [],
//     blogs: { items: [], nextCursor: null, hasMore: false },
//     trendingProducts: [],
//     categoryTrending: [],
//   });
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [cursor, setCursor] = useState(null);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Fetch initial landing data
//   const fetchLandingData = async (category = 'all', nextCursor = null) => {
//     try {
//       const url = new URL(`${API_BASE}/blogs/landing`);
//       if (category !== 'all') url.searchParams.append('category', category);
//       if (nextCursor) url.searchParams.append('cursor', nextCursor);

//       const res = await fetch(url);
//       if (!res.ok) throw new Error('Failed to fetch blog data');
//       const json = await res.json();
//       return json;
//     } catch (err) {
//       throw err;
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     const loadInitial = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const result = await fetchLandingData(selectedCategory);
//         setData({
//           trendingBlog: result.trendingBlog,
//           categoryNav: result.categoryNav,
//           blogs: result.blogs,
//           trendingProducts: result.trendingProducts,
//           categoryTrending: result.categoryTrending,
//         });
//         setCursor(result.blogs.nextCursor);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadInitial();
//   }, [selectedCategory]);

//   // Load more blogs (pagination)
//   const loadMore = async () => {
//     if (!data.blogs.hasMore || loadingMore) return;
//     setLoadingMore(true);
//     try {
//       const result = await fetchLandingData(selectedCategory, cursor);
//       setData(prev => ({
//         ...prev,
//         blogs: {
//           items: [...prev.blogs.items, ...result.blogs.items],
//           nextCursor: result.blogs.nextCursor,
//           hasMore: result.blogs.hasMore,
//         },
//       }));
//       setCursor(result.blogs.nextCursor);
//     } catch (err) {
//       console.error('Load more error:', err);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   // Category change handler
//   const handleCategoryChange = (categoryId) => {
//     setSelectedCategory(categoryId);
//     setCursor(null);
//   };

//   if (loading) {
//     return (
//       <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3 text-muted">Loading your beauty feed...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="py-5 text-center">
//         <div className="alert alert-danger shadow-sm">
//           <h4 className="alert-heading">Oops! Something went wrong</h4>
//           <p>{error}</p>
//           <hr />
//           <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>Try Again</button>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <div className="blog-landing-container">
//       {/* Trending Hero Section */}
//       {data.trendingBlog && (
//         <section className="trending-hero">
//           <Container>
//             <Row className="align-items-center g-5">
//               <Col lg={7} className="text-start">
//                 <div className="mb-3 opacity-75 text-uppercase small tracking-widest">
//                   Skincare · Trending
//                 </div>
//                 <h1 className="display-5 fw-bold mb-4">
//                   {data.trendingBlog.title}
//                 </h1>
//                 <p className="lead mb-5 opacity-90" style={{ maxWidth: '500px' }}>
//                   {data.trendingBlog.excerpt}
//                 </p>
//                 <Link 
//                   to={`/blog/${data.trendingBlog.slug}`} 
//                   className="text-white text-decoration-none border-bottom border-white pb-1 fw-medium"
//                 >
//                   Read the full story
//                 </Link>
//               </Col>
//               <Col lg={5} className="hero-image-container">
//                 <img
//                   src={data.trendingBlog.coverImage}
//                   alt={data.trendingBlog.title}
//                   className="hero-image"
//                   referrerPolicy="no-referrer"
//                 />
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Category Navigation */}
//       <nav className="border-bottom py-2 sticky-top bg-white shadow-sm" style={{ zIndex: 1000 }}>
//         <Container>
//           <div className="d-flex justify-content-center overflow-auto no-scrollbar">
//             <button
//               className={`category-nav-link border-0 bg-transparent ${selectedCategory === 'all' ? 'active' : ''}`}
//               onClick={() => handleCategoryChange('all')}
//             >
//               All Blogs
//             </button>
//             {data.categoryNav.map(cat => (
//               <button
//                 key={cat._id}
//                 className={`category-nav-link border-0 bg-transparent ${selectedCategory === cat._id ? 'active' : ''}`}
//                 onClick={() => handleCategoryChange(cat._id)}
//               >
//                 {cat.name}
//               </button>
//             ))}
//           </div>
//         </Container>
//       </nav>

//       {/* Blog Grid */}
//       <section className="py-5">
//         <Container>
//           <Row className="g-4">
//             {data.blogs.items.map(blog => (
//               <Col key={blog._id} md={6} lg={4}>
//                 <Link to={`/blog/${blog.slug}`} className="text-decoration-none">
//                   <div className="blog-card">
//                     <img
//                       src={blog.coverImage}
//                       className="blog-card-img w-100"
//                       alt={blog.title}
//                       referrerPolicy="no-referrer"
//                     />
//                     <h3 className="blog-card-title">{blog.title}</h3>
//                   </div>
//                 </Link>
//               </Col>
//             ))}
//           </Row>

//           {/* Load More Button */}
//           {data.blogs.hasMore && (
//             <div className="text-center mt-5 pt-4">
//               <button
//                 className="btn-read-more"
//                 onClick={loadMore}
//                 disabled={loadingMore}
//               >
//                 {loadingMore ? (
//                   <Spinner animation="border" size="sm" />
//                 ) : (
//                   'Read More'
//                 )}
//               </button>
//             </div>
//           )}
//         </Container>
//       </section>

//       {/* Trending Products Section */}
//       {data.trendingProducts.length > 0 && (
//         <section className="py-5 bg-white border-top">
//           <Container>
//             <h4 className="mb-5 text-muted small text-uppercase tracking-widest">Trending Products</h4>
//             <Row className="g-4">
//               {data.trendingProducts.map(product => (
//                 <Col key={product._id} xs={6} md={4} lg={4}>
//                   <div className="product-card">
//                     <Link to={`/product/${product.slugs[0]}`} className="text-decoration-none">
//                       <img
//                         src={product.selectedVariant?.image}
//                         alt={product.name}
//                         referrerPolicy="no-referrer"
//                       />
//                       <div className="product-brand">{product.brand || 'Derma Co'}</div>
//                       <h5 className="product-name text-dark">{product.name}</h5>
//                     </Link>
//                   </div>
//                 </Col>
//               ))}
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* More Reads Section */}
//       {data.categoryTrending.length > 0 && (
//         <section className="py-5 border-top">
//           <Container>
//             <h4 className="mb-5 text-muted small text-uppercase tracking-widest">More Reads</h4>
//             <Row>
//               <Col lg={8} className="mx-auto">
//                 {data.categoryTrending.map(item => (
//                   <div key={item.category._id} className="more-reads-item">
//                     <img
//                       src={item.blog.coverImage}
//                       className="more-reads-img d-none d-sm-block"
//                       alt={item.blog.title}
//                       referrerPolicy="no-referrer"
//                     />
//                     <div className="flex-grow-1">
//                       <div className="more-reads-category text-dark">{item.category.name}</div>
//                       <Link to={`/blog/${item.blog.slug}`} className="text-decoration-none">
//                         <h3 className="more-reads-title text-dark">{item.blog.title}</h3>
//                       </Link>
//                       <div className="more-reads-meta">
//                         <span>12-12-2026</span>
//                         <span>· 7 min ago</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}
//     </div>
//   );
// };

// export default Blog;













// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import { Spinner, Container, Row, Col } from 'react-bootstrap';
// import Header from './Header';
// import "../css/common/bootstrap.min.css";
// import "../css/blog.css";

// const API_BASE = 'https://beauty.joyory.com/api';

// // Default placeholder image
// const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

// const Blog = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState({
//     trendingBlog: null,
//     categoryNav: [],
//     blogs: { items: [], nextCursor: null, hasMore: false },
//     trendingProducts: [],
//     categoryTrending: [],
//   });
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [cursor, setCursor] = useState(null);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Fetch initial landing data
//   const fetchLandingData = async (category = 'all', nextCursor = null) => {
//     try {
//       const url = new URL(`${API_BASE}/blogs/landing`);
//       if (category !== 'all') url.searchParams.append('category', category);
//       if (nextCursor) url.searchParams.append('cursor', nextCursor);

//       const res = await fetch(url);
//       if (!res.ok) throw new Error('Failed to fetch blog data');
//       const json = await res.json();
//       return json;
//     } catch (err) {
//       throw err;
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     const loadInitial = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const result = await fetchLandingData(selectedCategory);
//         setData({
//           trendingBlog: result.trendingBlog,
//           categoryNav: result.categoryNav,
//           blogs: result.blogs,
//           trendingProducts: result.trendingProducts,
//           categoryTrending: result.categoryTrending,
//         });
//         setCursor(result.blogs.nextCursor);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadInitial();
//   }, [selectedCategory]);

//   // Load more blogs (pagination)
//   const loadMore = async () => {
//     if (!data.blogs.hasMore || loadingMore) return;
//     setLoadingMore(true);
//     try {
//       const result = await fetchLandingData(selectedCategory, cursor);
//       setData(prev => ({
//         ...prev,
//         blogs: {
//           items: [...prev.blogs.items, ...result.blogs.items],
//           nextCursor: result.blogs.nextCursor,
//           hasMore: result.blogs.hasMore,
//         },
//       }));
//       setCursor(result.blogs.nextCursor);
//     } catch (err) {
//       console.error('Load more error:', err);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   // Category change handler
//   const handleCategoryChange = (categoryId) => {
//     setSelectedCategory(categoryId);
//     setCursor(null);
//   };

//   // Helper function to safely get image URL
//   const getImageUrl = (imageUrl) => {
//     if (!imageUrl || imageUrl === '' || typeof imageUrl !== 'string') {
//       return DEFAULT_IMAGE;
//     }
//     return imageUrl;
//   };

//   // Helper function to safely get brand name (handles object or string)
//   const getBrandName = (brand) => {
//     if (!brand) return 'Derma Co';
//     if (typeof brand === 'string') return brand;
//     if (typeof brand === 'object' && brand.name) return brand.name;
//     return 'Derma Co';
//   };

//   if (loading) {
//     return (
//       <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3 text-muted">Loading your beauty feed...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="py-5 text-center">
//         <div className="alert alert-danger shadow-sm">
//           <h4 className="alert-heading">Oops! Something went wrong</h4>
//           <p>{error}</p>
//           <hr />
//           <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>Try Again</button>
//         </div>
//       </Container>
//     );
//   }

//   return (

//     <>

//       <Header />
//       <div className="blog-landing-container margin-topss">
//         {/* Trending Hero Section */}
//         {data.trendingBlog && (
//           <section className="trending-hero">
//             <div className='container-fluid-lg padding-left-rightss-blog'>
//               <Row className="align-items-center g-5 background-colorsss">

//                 <Col lg={7} className="ps-lg-5 ps-3">
//                   <Link
//                     to={`/blog/${data.trendingBlog.slug}`}
//                     className="text-white text-decoration-none border-bottom border-white pb-1 fw-medium"
//                   >
//                     <div className="mb-3 hero-section-main-name page-title-main-name fw-normal small tracking-widest">
//                       {data.trendingBlog.categoryName} · {data.trendingBlog.label}
//                     </div>
//                     <h1 className="display-5 fw-bold mb-4 playfair-font-bold blog-title-main-file">
//                       {data.trendingBlog.title}
//                     </h1>
//                     <p className="lead mb-5 opacity-90 blog-excerpt-main-file" style={{ maxWidth: '500px' }}>
//                       {data.trendingBlog.excerpt}
//                     </p>

//                     <div className='d-flex justify-content-between'>
//                       <p className="lead mb-5  opacity-90 blog-excerpt-main-file" style={{ maxWidth: '500px' }}>
//                         {data.trendingBlog.publishedAtFormatted}
//                       </p>


//                       <p className="lead mb-5 opacity-90 blog-excerpt-main-file" style={{ maxWidth: '500px' }}>
//                         {data.trendingBlog.postedAgo}
//                       </p>

//                     </div>


//                     {/* <Link
//                     to={`/blog/${data.trendingBlog.slug}`}
//                     className="text-white text-decoration-none border-bottom border-white pb-1 fw-medium"
//                   >
//                     Read the full story
//                   </Link> */}
//                   </Link>
//                 </Col>
//                 <Col lg={5} className="hero-image-div p-3 margin-topss-hero-image">
//                   <div className='Blog-Hero-image-main'>

//                     <img
//                       src={getImageUrl(data.trendingBlog.coverImage)}
//                       alt={data.trendingBlog.title || 'Trending Blog'}
//                       // className="hero-image img-fluid"
//                       className="img-fluid hero-image"
//                       referrerPolicy="no-referrer"
//                     />
//                   </div>
//                 </Col>
//               </Row>
//             </div>
//           </section>
//         )}

//         {/* Category Navigation */}
//         {/* <nav className="backgorund-category-names py-2" style={{ zIndex: 1000 }}>
//           <Container>
//             <div className="d-flex justify-content-center overflow-auto no-scrollbar">
//               {/* <button
//                 className={`category-nav-link border-0 bg-transparent ${selectedCategory === 'all' ? 'active' : ''}`}
//                 onClick={() => handleCategoryChange('all')}
//               >
//                 All Blogs
//               </button>}
//               {data.categoryNav.map(cat => (
//                 <button
//                   key={cat._id}
//                   className={`category-nav-link border-0 bg-transparent ${selectedCategory === cat._id ? 'active' : ''}`}
//                   onClick={() => handleCategoryChange(cat._id)}
//                 >
//                   {cat.name}
//                 </button>
//               ))}
//             </div>
//           </Container>
//         </nav> */}


//         <nav className="backgorund-category-names py-2" style={{ zIndex: 1000 }}>
//           <Container>
//             {/* Horizontal scrollable container */}
//             <div
//               className="d-flex flex-nowrap overflow-auto no-scrollbar justify-content-center"
//               style={{
//                 gap: '0.5rem',        // spacing between buttons
//                 scrollBehavior: 'smooth',
//                 WebkitOverflowScrolling: 'touch',
//               }}
//             >
//               {data.categoryNav.map(cat => (
//                 <button
//                   key={cat._id}
//                   className={`category-nav-link border-0 bg-transparent ${selectedCategory === cat._id ? 'active' : ''}`}
//                   onClick={() => handleCategoryChange(cat._id)}
//                   style={{
//                     whiteSpace: 'nowrap',   // prevent button text from wrapping
//                   }}
//                 >
//                   {cat.name}
//                 </button>
//               ))}
//             </div>
//           </Container>
//         </nav>

//         {/* Blog Grid */}
//         <section className="py-5">
//           <Container>
//             <Row className="g-4">
//               {data.blogs.items.map(blog => (
//                 <Col key={blog._id} md={6} lg={4}>
//                   <Link to={`/blog/${blog.slug}`} className="text-decoration-none">
//                     <div className="blog-card">
//                       <img
//                         src={getImageUrl(blog.coverImage)}
//                         className="blog-card-img w-100"
//                         alt={blog.title || 'Blog Image'}
//                         referrerPolicy="no-referrer"
//                       />
//                       <h3 className="blog-card-title">{blog.title}</h3>
//                     </div>
//                   </Link>
//                 </Col>
//               ))}
//             </Row>

//             {/* Load More Button */}
//             {data.blogs.hasMore && (
//               <div className="text-center mt-5 pt-4">
//                 <button
//                   className="btn-read-more"
//                   onClick={loadMore}
//                   disabled={loadingMore}
//                 >
//                   {loadingMore ? (
//                     <Spinner animation="border" size="sm" />
//                   ) : (
//                     'Read More'
//                   )}
//                 </button>
//               </div>
//             )}
//           </Container>
//         </section>

//         {/* Trending Products Section */}
//         {data.trendingProducts.length > 0 && (
//           <section className="py-5 bg-white border-top">
//             <Container>
//               <h4 className="mb-5 text-muted small text-uppercase tracking-widest">Trending Products</h4>
//               <Row className="g-4">
//                 {data.trendingProducts.map(product => (
//                   <Col key={product._id} xs={6} md={4} lg={4}>
//                     <div className="product-card">
//                       <Link to={`/product/${product.slugs?.[0] || product._id}`} className="text-decoration-none">
//                         <img
//                           src={getImageUrl(product.selectedVariant?.image || product.images?.[0])}
//                           alt={product.name || 'Product'}
//                           referrerPolicy="no-referrer"
//                         />
//                         {/* FIXED: Use getBrandName helper to handle object/string */}
//                         <div className="product-brand">{getBrandName(product.brand)}</div>
//                         <h5 className="product-name text-dark">{product.name}</h5>
//                       </Link>
//                     </div>
//                   </Col>
//                 ))}
//               </Row>
//             </Container>
//           </section>
//         )}

//         {/* More Reads Section */}
//         {data.categoryTrending.length > 0 && (
//           <section className="py-5 border-top">
//             <Container>
//               <h4 className="mb-5 text-muted small text-uppercase tracking-widest">More Reads</h4>
//               <Row>
//                 <Col lg={8} className="mx-auto">
//                   {data.categoryTrending.map(item => (
//                     <div key={item.category._id} className="more-reads-item">
//                       <img
//                         src={getImageUrl(item.blog?.coverImage)}
//                         className="more-reads-img d-none d-sm-block"
//                         alt={item.blog?.title || 'Blog'}
//                         referrerPolicy="no-referrer"
//                       />
//                       <div className="flex-grow-1">
//                         <div className="more-reads-category text-dark">{item.category?.name}</div>
//                         <Link to={`/blog/${item.blog?.slug}`} className="text-decoration-none">
//                           <h3 className="more-reads-title text-dark">{item.blog?.title}</h3>
//                         </Link>
//                         <div className="more-reads-meta">
//                           <span>12-12-2026</span>
//                           <span>· 7 min ago</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </Col>
//               </Row>
//             </Container>
//           </section>
//         )}
//       </div>

//     </>
//   );
// };

// export default Blog;
























// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import { Spinner, Container, Row, Col } from 'react-bootstrap';
// import Slider from 'react-slick';                    // ← added
// import "slick-carousel/slick/slick.css";             // ← added
// import "slick-carousel/slick/slick-theme.css";       // ← added
// import Header from './Header';
// import "../css/common/bootstrap.min.css";
// import "../css/blog.css";

// const API_BASE = 'https://beauty.joyory.com/api';

// // Default placeholder image
// const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

// // Custom hook to detect window width
// const useWindowWidth = () => {
//   const [width, setWidth] = useState(window.innerWidth);
//   useEffect(() => {
//     const handleResize = () => setWidth(window.innerWidth);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
//   return width;
// };

// const Blog = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState({
//     trendingBlog: null,
//     categoryNav: [],
//     blogs: { items: [], nextCursor: null, hasMore: false },
//     trendingProducts: [],
//     categoryTrending: [],
//   });
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [cursor, setCursor] = useState(null);
//   const [loadingMore, setLoadingMore] = useState(false);

//   const width = useWindowWidth();                     // ← added
//   const isMobileOrTablet = width < 992;               // ← added: show slider below 992px

//   // Fetch initial landing data
//   const fetchLandingData = async (category = 'all', nextCursor = null) => {
//     try {
//       const url = new URL(`${API_BASE}/blogs/landing`);
//       url.searchParams.append('limit', '6');    // 👈 add this line
//       if (category !== 'all') url.searchParams.append('category', category);
//       if (nextCursor) url.searchParams.append('cursor', nextCursor);

//       const res = await fetch(url);
//       if (!res.ok) throw new Error('Failed to fetch blog data');
//       const json = await res.json();
//       return json;
//     } catch (err) {
//       throw err;
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     const loadInitial = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const result = await fetchLandingData(selectedCategory);
//         setData({
//           trendingBlog: result.trendingBlog,
//           categoryNav: result.categoryNav,
//           blogs: result.blogs,
//           trendingProducts: result.trendingProducts,
//           categoryTrending: result.categoryTrending,
//         });
//         setCursor(result.blogs.nextCursor);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadInitial();
//   }, [selectedCategory]);

//   // Load more blogs (pagination)
//   const loadMore = async () => {
//     if (!data.blogs.hasMore || loadingMore) return;
//     setLoadingMore(true);
//     try {
//       const result = await fetchLandingData(selectedCategory, cursor);
//       setData(prev => ({
//         ...prev,
//         blogs: {
//           items: [...prev.blogs.items, ...result.blogs.items],
//           nextCursor: result.blogs.nextCursor,
//           hasMore: result.blogs.hasMore,
//         },
//       }));
//       setCursor(result.blogs.nextCursor);
//     } catch (err) {
//       console.error('Load more error:', err);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   // Category change handler
//   const handleCategoryChange = (categoryId) => {
//     setSelectedCategory(categoryId);
//     setCursor(null);
//   };

//   // Helper function to safely get image URL
//   const getImageUrl = (imageUrl) => {
//     if (!imageUrl || imageUrl === '' || typeof imageUrl !== 'string') {
//       return DEFAULT_IMAGE;
//     }
//     return imageUrl;
//   };

//   // Helper function to safely get brand name (handles object or string)
//   const getBrandName = (brand) => {
//     if (!brand) return 'Derma Co';
//     if (typeof brand === 'string') return brand;
//     if (typeof brand === 'object' && brand.name) return brand.name;
//     return 'Derma Co';
//   };

//   // React‑slick settings for mobile/tablet
//   const sliderSettings = {
//     // dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: width < 768 ? 1 : 2,   // 1 on mobile, 2 on tablet
//     slidesToScroll: 1,
//     arrows: true,
//     swipeToSlide: true,
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: { slidesToShow: 1, slidesToScroll: 1 }
//       },
//       {
//         breakpoint: 992,
//         settings: { slidesToShow: 2, slidesToScroll: 1 }
//       }
//     ]
//   };

//   if (loading) {
//     return (
//       <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3 text-muted">Loading your beauty feed...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="py-5 text-center">
//         <div className="alert alert-danger shadow-sm">
//           <h4 className="alert-heading">Oops! Something went wrong</h4>
//           <p>{error}</p>
//           <hr />
//           <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>Try Again</button>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <div className="blog-landing-container margin-topss">
//         {/* Trending Hero Section */}
//         {data.trendingBlog && (
//           <section className="trending-hero">
//             <div className='container-fluid-lg padding-left-rightss-blog'>
//               <Row className="align-items-center g-5 background-colorsss">
//                 <Col lg={7} className="ps-lg-5 ps-3">
//                   <Link
//                     to={`/blog/${data.trendingBlog.slug}`}
//                     className="text-white text-decoration-none border-bottom border-white pb-1 fw-medium"
//                   >
//                     <div className="mb-3 hero-section-main-name page-title-main-name fw-normal small tracking-widest">
//                       {data.trendingBlog.categoryName} · {data.trendingBlog.label}
//                     </div>
//                     <h1 className="display-5 fw-bold mb-4 playfair-font-bold blog-title-main-file">
//                       {data.trendingBlog.title}
//                     </h1>
//                     <p className="lead mb-5 opacity-90 blog-excerpt-main-file" style={{ maxWidth: '500px' }}>
//                       {data.trendingBlog.excerpt}
//                     </p>
//                     <div className='d-flex justify-content-between'>
//                       <p className="lead mb-5 opacity-90 blog-excerpt-main-file" style={{ maxWidth: '500px' }}>
//                         {data.trendingBlog.publishedAtFormatted}
//                       </p>
//                       <p className="lead mb-5 opacity-90 blog-excerpt-main-file" style={{ maxWidth: '500px' }}>
//                         {data.trendingBlog.postedAgo}
//                       </p>
//                     </div>
//                   </Link>
//                 </Col>
//                 <Col lg={5} className="hero-image-div p-3 margin-topss-hero-image">
//                   <div className='Blog-Hero-image-main'>
//                     <img
//                       src={getImageUrl(data.trendingBlog.coverImage)}
//                       alt={data.trendingBlog.title || 'Trending Blog'}
//                       className="img-fluid hero-image"
//                       referrerPolicy="no-referrer"
//                     />
//                   </div>
//                 </Col>
//               </Row>
//             </div>
//           </section>
//         )}

//         {/* Category Navigation (scrollable pills) */}
//         <nav className="backgorund-category-names py-2" style={{ zIndex: 1000 }}>
//           <Container>
//             <div
//               className="d-flex flex-nowrap overflow-auto no-scrollbar justify-content-center"
//               style={{
//                 gap: '0.5rem',
//                 scrollBehavior: 'smooth',
//                 WebkitOverflowScrolling: 'touch',
//               }}
//             >
//               {data.categoryNav.map(cat => (
//                 <button
//                   key={cat._id}
//                   className={`category-nav-link border-0 bg-transparent ${selectedCategory === cat._id ? 'active' : ''}`}
//                   onClick={() => handleCategoryChange(cat._id)}
//                   style={{ whiteSpace: 'nowrap' }}
//                 >
//                   {cat.name}
//                 </button>
//               ))}
//             </div>
//           </Container>
//         </nav>

//         {/* Blog Grid / Slider */}
//         <section className="py-5">
//           <Container>
//             {!isMobileOrTablet ? (
//               // Desktop: original grid layout
//               <Row className="g-4">
//                 {data.blogs.items.map(blog => (
//                   <Col key={blog._id} md={6} lg={4}>
//                     <Link to={`/blog/${blog.slug}`} className="text-decoration-none">
//                       <div className="blog-card">
//                         <img
//                           src={getImageUrl(blog.coverImage)}
//                           className="blog-card-img w-100"
//                           alt={blog.title || 'Blog Image'}
//                           referrerPolicy="no-referrer"
//                         />
//                         <h3 className="blog-card-title">{blog.title}</h3>
//                       </div>
//                     </Link>
//                   </Col>
//                 ))}
//               </Row>
//             ) : (
//               // Mobile/Tablet: slider (carousel)
//               <Slider {...sliderSettings}>
//                 {data.blogs.items.map(blog => (
//                   <div key={blog._id} className="px-2"> {/* padding for spacing */}
//                     <Link to={`/blog/${blog.slug}`} className="text-decoration-none">
//                       <div className="blog-card">
//                         <img
//                           src={getImageUrl(blog.coverImage)}
//                           className="blog-card-img w-100"
//                           alt={blog.title || 'Blog Image'}
//                           referrerPolicy="no-referrer"
//                         />
//                         <h3 className="blog-card-title">{blog.title}</h3>
//                       </div>
//                     </Link>
//                   </div>
//                 ))}
//               </Slider>
//             )}

//             {/* Load More Button */}
//             {data.blogs.hasMore && (
//               <div className="text-center mt-5 pt-4">
//                 <button
//                   className="btn-read-more"
//                   onClick={loadMore}
//                   disabled={loadingMore}
//                 >
//                   {loadingMore ? (
//                     <Spinner animation="border" size="sm" />
//                   ) : (
//                     'Read More'
//                   )}
//                 </button>
//               </div>
//             )}
//           </Container>
//         </section>

//         {/* Trending Products Section */}
//         {data.trendingProducts.length > 0 && (
//           <section className="py-5 bg-white border-top">
//             <Container>
//               <h4 className="mb-5 text-muted small text-uppercase tracking-widest">Trending Products</h4>
//               <Row className="g-4">
//                 {data.trendingProducts.map(product => (
//                   <Col key={product._id} xs={6} md={4} lg={4}>
//                     <div className="product-card">
//                       <Link to={`/product/${product.slugs?.[0] || product._id}`} className="text-decoration-none">
//                         <img
//                           src={getImageUrl(product.selectedVariant?.image || product.images?.[0])}
//                           alt={product.name || 'Product'}
//                           referrerPolicy="no-referrer"
//                         />
//                         <div className="product-brand">{getBrandName(product.brand)}</div>
//                         <h5 className="product-name text-dark">{product.name}</h5>
//                       </Link>
//                     </div>
//                   </Col>
//                 ))}
//               </Row>
//             </Container>
//           </section>
//         )}

//         {/* More Reads Section */}
//         {data.categoryTrending.length > 0 && (
//           <section className="py-5 border-top">
//             <Container>
//               <h4 className="mb-5 text-muted small text-uppercase tracking-widest">More Reads</h4>
//               <Row>
//                 <Col lg={8} className="mx-auto">
//                   {data.categoryTrending.map(item => (
//                     <div key={item.category._id} className="more-reads-item">
//                       <img
//                         src={getImageUrl(item.blog?.coverImage)}
//                         className="more-reads-img d-none d-sm-block"
//                         alt={item.blog?.title || 'Blog'}
//                         referrerPolicy="no-referrer"
//                       />
//                       <div className="flex-grow-1">
//                         <div className="more-reads-category text-dark">{item.category?.name}</div>
//                         <Link to={`/blog/${item.blog?.slug}`} className="text-decoration-none">
//                           <h3 className="more-reads-title text-dark">{item.blog?.title}</h3>
//                         </Link>
//                         <div className="more-reads-meta">
//                           <span>12-12-2026</span>
//                           <span>· 7 min ago</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </Col>
//               </Row>
//             </Container>
//           </section>
//         )}
//       </div>
//     </>
//   );
// };

// export default Blog;




















import React, { useState, useEffect, useCallback, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Spinner, Container, Row, Col } from 'react-bootstrap';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Header from './Header';
import "../css/common/bootstrap.min.css";
import "../css/blog.css";
import "../css/BestSellers.css";
import "../App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import bagIcon from "../assets/bag.svg";
import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import { UserContext } from "./UserContext";

const API_BASE = 'https://beauty.joyory.com/api';
const CART_API_BASE = 'https://beauty.joyory.com/api/user/cart';

// Default placeholder image
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

// Helper functions (same as BestSellers)
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  const normalized = hex.trim().toLowerCase();
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
};

const getVariantDisplayText = (variant) => {
  return (
    variant.shadeName ||
    variant.name ||
    variant.size ||
    variant.ml ||
    variant.weight ||
    "Default"
  ).toUpperCase();
};

const groupVariantsByType = (variants) => {
  const grouped = { color: [], text: [], default: [] };
  variants.forEach((v) => {
    if (!v) return;
    if (v.hex && isValidHexColor(v.hex)) {
      grouped.color.push(v);
    } else {
      grouped.text.push(v);
    }
  });
  return grouped;
};

// Custom hook to detect window width
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    trendingBlog: null,
    categoryNav: [],
    blogs: { items: [], nextCursor: null, hasMore: false },
    trendingProducts: [],
    categoryTrending: [],
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cursor, setCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Trending Products states (same as BestSellers)
  const [selectedVariants, setSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  const width = useWindowWidth();
  const isMobileOrTablet = width < 992;
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  // Toast Utility
  const showToastMsg = (message, type = "error", duration = 3000) => {
    if (type === "success") {
      toast.success(message, { autoClose: duration });
    } else if (type === "error") {
      toast.error(message, { autoClose: duration });
    } else {
      toast.info(message, { autoClose: duration });
    }
  };

  // ===================== WISHLIST FUNCTIONS (Same as BestSellers) =====================
  const isInWishlist = (productId, sku) => {
    if (!productId || !sku) return false;
    return wishlistData.some(item =>
      (item.productId === productId || item._id === productId) &&
      item.sku === sku
    );
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const response = await axios.get(
          "https://beauty.joyory.com/api/user/wishlist",
          { withCredentials: true }
        );
        if (response.data.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
        const formattedWishlist = localWishlist.map(item => ({
          productId: item._id,
          _id: item._id,
          sku: item.sku,
          name: item.name,
          variant: item.variantName,
          image: item.image,
          displayPrice: item.displayPrice,
          originalPrice: item.originalPrice,
          discountPercent: item.discountPercent,
          status: item.status,
          avgRating: item.avgRating,
          totalRatings: item.totalRatings
        }));
        setWishlistData(formattedWishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setWishlistData([]);
    }
  };

  const toggleWishlist = async (prod, variant) => {
    if (!prod || !variant) {
      showToastMsg("Please select a variant first", "error");
      return;
    }

    const productId = prod._id;
    const sku = getSku(variant);

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const currentlyInWishlist = isInWishlist(productId, sku);

      if (user && !user.guest) {
        if (currentlyInWishlist) {
          await axios.delete(
            `https://beauty.joyory.com/api/user/wishlist/${productId}`,
            {
              withCredentials: true,
              data: { sku: sku }
            }
          );
          showToastMsg("Removed from wishlist!", "success");
        } else {
          await axios.post(
            `https://beauty.joyory.com/api/user/wishlist/${productId}`,
            { sku: sku },
            { withCredentials: true }
          );
          showToastMsg("Added to wishlist!", "success");
        }
        await fetchWishlistData();
      } else {
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

        if (currentlyInWishlist) {
          const updatedWishlist = guestWishlist.filter(item =>
            !(item._id === productId && item.sku === sku)
          );
          localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
          showToastMsg("Removed from wishlist!", "success");
        } else {
          const productData = {
            _id: productId,
            name: prod.name,
            brand: getBrandName(prod),
            price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
            originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
            mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
            displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
            images: variant.images || prod.images || ["/placeholder.png"],
            image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
            slug: prod.slugs?.[0] || prod.slug || prod._id,
            sku: sku,
            variantSku: sku,
            variantId: sku,
            variantName: variant.shadeName || variant.name || "Default",
            shadeName: variant.shadeName || variant.name || "Default",
            variant: variant.shadeName || variant.name || "Default",
            hex: variant.hex || "#cccccc",
            stock: variant.stock || 0,
            status: variant.stock > 0 ? "inStock" : "outOfStock",
            avgRating: prod.avgRating || 0,
            totalRatings: prod.totalRatings || 0,
            commentsCount: prod.totalRatings || 0,
            discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
              ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
              : 0
          };

          guestWishlist.push(productData);
          localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
          showToastMsg("Added to wishlist!", "success");
        }
        await fetchWishlistData();
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      if (error.response?.status === 401) {
        showToastMsg("Please login to use wishlist", "error");
        navigate("/login");
      } else {
        showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
      }
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  // ===================== HELPER FUNCTIONS (Same as BestSellers) =====================
  const getProductSlug = useCallback((product) => {
    if (!product) return null;
    if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
      return product.slugs[0];
    }
    if (product.slug) return product.slug;
    return product._id;
  }, []);

  const getBrandName = useCallback((product) => {
    if (!product?.brand) return "Unknown Brand";
    if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
    if (typeof product.brand === "string") return product.brand;
    return "Unknown Brand";
  }, []);

  const getVariantName = useCallback((variant) => {
    if (!variant) return "Default";
    const nameSources = [
      variant.shadeName,
      variant.name,
      variant.variantName,
      variant.size,
      variant.ml,
      variant.weight
    ];
    for (const source of nameSources) {
      if (source && typeof source === 'string') {
        return source;
      }
    }
    return "Default";
  }, []);

  const getVariantType = useCallback((variant) => {
    if (!variant) return 'default';
    if (variant.hex && isValidHexColor(variant.hex)) return 'color';
    if (variant.shadeName) return 'shade';
    if (variant.size) return 'size';
    if (variant.ml) return 'ml';
    if (variant.weight) return 'weight';
    return 'default';
  }, []);

  const getProductDisplayData = useCallback((product) => {
    if (!product) return null;

    const allVariants = Array.isArray(product.variants) ? product.variants :
      Array.isArray(product.shadeOptions) ? product.shadeOptions : [];

    const availableVariants = allVariants.filter(v => v && (parseInt(v.stock || 0) > 0));
    const defaultVariant = allVariants[0] || {};

    const storedVariant = selectedVariants[product._id];

    let selectedVariant = storedVariant ||
      (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

    if (storedVariant) {
      const storedStock = parseInt(storedVariant.stock || 0);
      if (storedStock <= 0 && availableVariants.length > 0) {
        selectedVariant = availableVariants[0];
      }
    }

    let image = "";
    const getVariantImage = (variant) => {
      return variant?.images?.[0] || variant?.image;
    };

    image = getVariantImage(selectedVariant) ||
      getVariantImage(availableVariants[0]) ||
      getVariantImage(defaultVariant) ||
      product.image ||
      product.displayImage ||
      "";

    const displayPrice = parseFloat(
      selectedVariant.displayPrice ||
      selectedVariant.discountedPrice ||
      selectedVariant.price ||
      product.price ||
      0
    );

    const originalPrice = parseFloat(
      selectedVariant.originalPrice ||
      selectedVariant.mrp ||
      product.mrp ||
      displayPrice
    );

    const discountAmount = parseFloat(
      selectedVariant.discountAmount ||
      product.discountAmount ||
      0
    );

    let discountPercent = parseFloat(
      selectedVariant.discountPercent ||
      product.discountPercent ||
      0
    );

    if (!discountPercent && originalPrice > displayPrice) {
      discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
    }

    const variantName = getVariantName(selectedVariant);
    const variantType = getVariantType(selectedVariant);
    const variantDisplayText = getVariantDisplayText(selectedVariant);

    const stock = parseInt(selectedVariant.stock || product.stock || 0);
    const status = stock > 0 ? "inStock" : "outOfStock";
    const sku = selectedVariant.sku || product.sku || "";
    const sales = parseInt(selectedVariant.sales || product.sales || 0);

    const promoApplied = selectedVariant.promoApplied || product.promoApplied || false;
    const promoMessage = selectedVariant.promoMessage || product.promoMessage || "";

    const brandName = getBrandName(product);
    const hexColor = selectedVariant.hex || product.hex || "#000000";
    const productSlug = getProductSlug(product);

    return {
      ...product,
      _id: product._id || "",
      name: product.name || "Unnamed Product",
      brandName: typeof brandName === 'string' ? brandName : "Unknown Brand",
      slug: productSlug,
      variant: {
        ...selectedVariant,
        variantName,
        variantDisplayText,
        displayPrice,
        originalPrice,
        discountPercent,
        discountAmount,
        stock,
        status,
        sku,
        sales,
        promoApplied,
        promoMessage,
        hex: hexColor,
        variantType,
        _id: selectedVariant._id || ""
      },
      image,
      brandId: product.brand,
      description: product.description || "",
      avgRating: parseFloat(product.avgRating || 0),
      totalRatings: parseInt(product.totalRatings || 0),
      allVariants: [...allVariants].filter(v => v),
      variants: allVariants 
    };
  }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug]);

  // ===================== VARIANT HANDLING (Same as BestSellers) =====================
  const handleVariantSelect = useCallback((productId, variant) => {
    if (!productId || !variant) return;

    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }));

    setData(prevData => ({
      ...prevData,
      trendingProducts: prevData.trendingProducts.map(product => {
        if (product._id === productId) {
          const stock = parseInt(variant.stock || 0);
          const displayPrice = parseFloat(
            variant.displayPrice ||
            variant.discountedPrice ||
            variant.price ||
            product.price ||
            0
          );

          const originalPrice = parseFloat(
            variant.originalPrice ||
            variant.mrp ||
            product.mrp ||
            displayPrice
          );

          let discountPercent = parseFloat(variant.discountPercent || product.discountPercent || 0);
          if (!discountPercent && originalPrice > displayPrice) {
            discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
          }

          const variantName = getVariantName(variant);
          const variantType = getVariantType(variant);
          const variantDisplayText = getVariantDisplayText(variant);
          const hexColor = variant.hex || product.hex || "#000000";

          return {
            ...product,
            variant: {
              ...variant,
              variantName,
              variantDisplayText,
              displayPrice,
              originalPrice,
              discountPercent,
              stock,
              status: stock > 0 ? "inStock" : "outOfStock",
              sku: variant.sku || "",
              hex: hexColor,
              variantType,
              _id: variant._id || variant.sku || `variant-${Date.now()}`
            },
            image: variant.images?.[0] || variant.image || product.image
          };
        }
        return product;
      })
    }));
  }, [getVariantName, getVariantType]);

  const openVariantOverlay = (productId, variantType = "all", e) => {
    if (e) e.stopPropagation();
    setSelectedVariantType(variantType);
    setShowVariantOverlay(productId);
  };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
  };

  const handleProductClick = useCallback((product) => {
    if (!product) return;
    const slug = product.slug || product._id;
    if (slug) {
      navigate(`/product/${slug}`);
    }
  }, [navigate]);

  // ===================== ADD TO CART (Same as BestSellers) =====================
  const handleAddToCart = async (prod) => {
    setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
    try {
      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVariants = variants.length > 0;
      let payload;

      if (hasVariants) {
        const selectedVariant = selectedVariants[prod._id] || prod.variant;
        if (!selectedVariant || selectedVariant.stock <= 0) {
          showToastMsg("Please select an in-stock variant.", "error");
          return;
        }

        payload = {
          productId: prod._id,
          variants: [
            {
              variantSku: getSku(selectedVariant),
              quantity: 1,
            },
          ],
        };

        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = selectedVariant;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        if (prod.stock <= 0) {
          showToastMsg("Product is out of stock.", "error");
          return;
        }

        payload = {
          productId: prod._id,
          quantity: 1,
        };

        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        delete cache[prod._id];
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      }

      const response = await axios.post(
        `${CART_API_BASE}/add`,
        payload,
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add to cart");
      }

      showToastMsg("Product added to cart!", "success");
      navigate("/cartpage");
    } catch (err) {
      console.error("Add to Cart error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
      showToastMsg(msg, "error");

      if (err.response?.status === 401) {
        navigate("/login", { state: { from: location.pathname } });
      }
    } finally {
      setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
    }
  };

  const formatPrice = useCallback((price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  }, []);

  // ===================== BLOG DATA FETCHING (Unchanged) =====================
  const fetchLandingData = async (category = 'all', nextCursor = null) => {
    try {
      const url = new URL(`${API_BASE}/blogs/landing`);
      url.searchParams.append('limit', '6');
      if (category !== 'all') url.searchParams.append('category', category);
      if (nextCursor) url.searchParams.append('cursor', nextCursor);

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch blog data');
      const json = await res.json();
      return json;
    } catch (err) {
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchLandingData(selectedCategory);
        setData({
          trendingBlog: result.trendingBlog,
          categoryNav: result.categoryNav,
          blogs: result.blogs,
          trendingProducts: result.trendingProducts || [],
          categoryTrending: result.categoryTrending,
        });
        setCursor(result.blogs.nextCursor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, [selectedCategory]);

  // Load more blogs (pagination)
  const loadMore = async () => {
    if (!data.blogs.hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await fetchLandingData(selectedCategory, cursor);
      setData(prev => ({
        ...prev,
        blogs: {
          items: [...prev.blogs.items, ...result.blogs.items],
          nextCursor: result.blogs.nextCursor,
          hasMore: result.blogs.hasMore,
        },
      }));
      setCursor(result.blogs.nextCursor);
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Category change handler
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCursor(null);
  };

  // Helper function to safely get image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '' || typeof imageUrl !== 'string') {
      return DEFAULT_IMAGE;
    }
    return imageUrl;
  };

  // React‑slick settings for mobile/tablet
  const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: width < 768 ? 1 : 2,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 2, slidesToScroll: 1 }
      }
    ]
  };

  // Prepare trending products with display data
  const processedTrendingProducts = data.trendingProducts.map(product => 
    getProductDisplayData(product)
  ).filter(Boolean);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading your beauty feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-danger shadow-sm">
          <h4 className="alert-heading">Oops! Something went wrong</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="blog-landing-container margin-topss page-title-main-name overflow-hidden">
        {/* Trending Hero Section - UNCHANGED */}
        {data.trendingBlog && (
          <section className="trending-hero">
            <div className='container-fluid-lg padding-left-rightss-blog'>
              <Row className="align-items-center g-5 background-colorsss">
                <Col lg={7} className="ps-lg-5 ps-3">
                  <Link
                    to={`/blog/${data.trendingBlog.slug}`}
                    className="text-white text-decoration-none border-bottom border-white pb-1 fw-medium"
                  >
                    <div className="mb-3 hero-section-main-name page-title-main-name fw-normal small tracking-widest">
                      {data.trendingBlog.categoryName} · {data.trendingBlog.label}
                    </div>
                    <h1 className="display-5 fw-bold mb-4 playfair-font-bold blog-title-main-file">
                      {data.trendingBlog.title}
                    </h1>
                    <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
                      {data.trendingBlog.excerpt}
                    </p>
                    <div className='d-flex justify-content-between'>
                      <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
                        {data.trendingBlog.publishedAtFormatted}
                      </p>
                      <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
                        {data.trendingBlog.postedAgo}
                      </p>
                    </div>
                  </Link>
                </Col>
                <Col lg={5} className="hero-image-div p-3 margin-topss-hero-image">
                  <div className='Blog-Hero-image-main'>
                    <img
                      src={getImageUrl(data.trendingBlog.coverImage)}
                      alt={data.trendingBlog.title || 'Trending Blog'}
                      className="img-fluid hero-image"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </section>
        )}

        {/* Category Navigation - UNCHANGED */}
        <nav className="backgorund-category-names py-2" style={{ zIndex: 1000 }}>
          <Container>
            <div
              className="d-flex flex-nowrap overflow-auto no-scrollbar justify-content-center"
              style={{
                gap: '0.5rem',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {data.categoryNav.map(cat => (
                <button
                  key={cat._id}
                  className={`category-nav-link border-0 bg-transparent ${selectedCategory === cat._id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat._id)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </Container>
        </nav>

        {/* Blog Grid / Slider - UNCHANGED */}
        <section className="py-5">
          <div className='container-fluid-lg padding-left-rightss-Blog-grid'>
            {!isMobileOrTablet ? (
              <Row className="g-4">
                {data.blogs.items.map(blog => (
                  <Col key={blog._id} md={6} lg={4}>
                    <Link to={`/blog/${blog.slug}`} className="text-decoration-none">
                      <div className="blog-card">
                        <img
                          src={getImageUrl(blog.coverImage)}
                          className="blog-card-img w-100"
                          alt={blog.title || 'Blog Image'}
                          referrerPolicy="no-referrer"
                        />
                        <h3 className="blog-card-title">{blog.title}</h3>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            ) : (
              <Slider {...sliderSettings}>
                {data.blogs.items.map(blog => (
                  <div key={blog._id} className="px-2">
                    <Link to={`/blog/${blog.slug}`} className="text-decoration-none">
                      <div className="blog-card">
                        <img
                          src={getImageUrl(blog.coverImage)}
                          className="blog-card-img w-100"
                          alt={blog.title || 'Blog Image'}
                          referrerPolicy="no-referrer"
                        />
                        <h3 className="blog-card-title">{blog.title}</h3>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider>
            )}

            {data.blogs.hasMore && (
              <div className="text-center mt-5 pt-4">
                <button
                  className="btn-read-more"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Read More'
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ===================== TRENDING PRODUCTS - UPDATED WITH BESTSELLERS DESIGN ===================== */}
        {processedTrendingProducts.length > 0 && (
          <section className="py-5 bg-white border-top">
            <div className='container-fluid-lg padding-left-rightss-Blog-grid'>
              <h4 className="mb-5 text-muted small text-uppercase tracking-widest fs-3">Trending Products</h4>
              
              <div className="position-relative">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  }}
                  breakpoints={{
                    300: { slidesPerView: 2, spaceBetween: 10 },
                    576: { slidesPerView: 2, spaceBetween: 15 },
                    768: { slidesPerView: 3, spaceBetween: 15 },
                    992: { slidesPerView: 4, spaceBetween: 20 },
                    1200: { slidesPerView: 4, spaceBetween: 25 },
                  }}
                  className="foryou-swiper pb-0 mb-0"
                >
                  {processedTrendingProducts.map((item) => {
                    if (!item) return null;

                    const variant = item.variant || {};
                    const allVariants = item.allVariants || [];

                    let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

                    if (item.image) {
                      imageUrl = item.image.startsWith("http")
                        ? item.image
                        : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
                    }

                    const hasVariants = allVariants.length > 0;
                    const selectedSku = getSku(variant);
                    const isProductInWishlist = isInWishlist(item._id, selectedSku);
                    const groupedVariants = groupVariantsByType(allVariants);
                    const totalVariants = allVariants.length;
                    const isVariantSelected = !!selectedVariants[item._id];
                    const isAdding = addingToCart[item._id];
                    const outOfStock = hasVariants
                      ? (variant?.stock <= 0)
                      : (item.stock <= 0);
                      
                    const showSelectVariantButton = hasVariants && !isVariantSelected;
                    const buttonDisabled = isAdding || outOfStock;
                    
                    let buttonText = "Add to Bag";
                    if (isAdding) {
                      buttonText = "Adding...";
                    } else if (showSelectVariantButton) {
                      buttonText = "Select Variant";
                    } else if (outOfStock) {
                      buttonText = "Out of Stock";
                    }

                    return (
                      <SwiperSlide key={`trending-${item._id}`}>
                        <div className="foryou-card-wrapper">
                          <div className="foryou-card">
                            {/* Product Image with Overlays */}
                            <div
                              className="foryou-img-wrapper"
                              onClick={() => handleProductClick(item)}
                              style={{ cursor: 'pointer' }}
                            >
                              <img
                                src={imageUrl}
                                alt={item.name || "Product"}
                                className="foryou-img img-fluid"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
                                }}
                              />

                              {/* Wishlist Icon */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (variant) {
                                    toggleWishlist(item, variant);
                                  }
                                }}
                                disabled={wishlistLoading[item._id]}
                                style={{
                                  position: 'absolute',
                                  top: '10px',
                                  right: '10px',
                                  cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
                                  color: isProductInWishlist ? '#dc3545' : '#000000',
                                  fontSize: '22px',
                                  zIndex: 2,
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                  borderRadius: '50%',
                                  width: '34px',
                                  height: '34px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  transition: 'all 0.3s ease',
                                  border: 'none',
                                  outline: 'none'
                                }}
                                title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                              >
                                {wishlistLoading[item._id] ? (
                                  <div className="spinner-border spinner-border-sm" role="status"></div>
                                ) : isProductInWishlist ? (
                                  <FaHeart />
                                ) : (
                                  <FaRegHeart />
                                )}
                              </button>

                              {/* Promo Badge */}
                              {variant.promoApplied && (
                                <div className="promo-badge">
                                  <i className="bi bi-tag-fill me-1"></i>
                                  Promo
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
                              <div className="justify-content-between d-flex flex-column" style={{ height: '250px' }}>

                                {/* Brand Name */}
                                <div className="brand-name small text-muted text-start mb-1 mt-2">
                                  {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
                                </div>

                                {/* Product Name */}
                                <h6
                                  className="foryou-name font-family-Poppins m-0 p-0"
                                  onClick={() => handleProductClick(item)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {item.name || "Unnamed Product"}
                                </h6>

                                {/* Minimal Variant Display */}
                                {hasVariants && (
                                  <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
                                    {isVariantSelected ? (
                                      <div 
                                        className="selected-variant-display text-muted small" 
                                        style={{ cursor: 'pointer', display: 'inline-block' }}
                                        onClick={(e) => openVariantOverlay(item._id, "all", e)}
                                        title="Click to change variant"
                                      >
                                        Variant: <span className="fw-bold text-dark">{getVariantDisplayText(variant)}</span>
                                        <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
                                      </div>
                                    ) : (
                                      <div className="small text-muted" style={{ height: '20px' }}>
                                        {allVariants.length} Variants Available
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Price Section */}
                                <div className="price-section mb-3 mt-auto">
                                  <div className="d-flex align-items-baseline flex-wrap">
                                    <span className="current-price fw-400 fs-5">
                                      {formatPrice(variant.displayPrice)}
                                    </span>

                                    {variant.originalPrice > variant.displayPrice && (
                                      <>
                                        <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                          {formatPrice(variant.originalPrice)}
                                        </span>
                                        <span className="discount-percent text-danger fw-bold ms-2">
                                          ({variant.discountPercent || 0}% OFF)
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Add to Cart / Select Variant Button */}
                                <div className="cart-section">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <button
                                      className={`w-100 btn-add-cart`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (showSelectVariantButton) {
                                          openVariantOverlay(item._id, "all", e);
                                        } else {
                                          handleAddToCart(item);
                                        }
                                      }}
                                      disabled={buttonDisabled}
                                      style={{
                                        transition: "background-color 0.3s ease, color 0.3s ease",
                                      }}
                                    >
                                      {isAdding ? (
                                        <>
                                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                          Adding...
                                        </>
                                      ) : (
                                        <>
                                          {buttonText}
                                          {!buttonDisabled && !isAdding && !showSelectVariantButton && (
                                            <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
                                          )}
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Variant Overlay */}
                          {showVariantOverlay === item._id && (
                            <div className="variant-overlay" onClick={closeVariantOverlay}>
                              <div
                                className="variant-overlay-content m-0 p-0 w-100"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  width: '90%',
                                  maxWidth: '500px',
                                  maxHeight: '100%',
                                  background: '#fff',
                                  borderRadius: '0px',
                                  overflow: 'hidden',
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                              >
                                <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                                  <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
                                  <button
                                    onClick={closeVariantOverlay}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      fontSize: '24px',
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>

                                {/* Tabs */}
                                <div className="variant-tabs d-flex">
                                  <button
                                    className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
                                    onClick={() => setSelectedVariantType("all")}
                                  >
                                    All ({totalVariants})
                                  </button>
                                  {groupedVariants.color.length > 0 && (
                                    <button
                                      className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
                                      onClick={() => setSelectedVariantType("color")}
                                    >
                                      Colors ({groupedVariants.color.length})
                                    </button>
                                  )}
                                  {groupedVariants.text.length > 0 && (
                                    <button
                                      className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
                                      onClick={() => setSelectedVariantType("text")}
                                    >
                                      Sizes ({groupedVariants.text.length})
                                    </button>
                                  )}
                                </div>

                                {/* Content */}
                                <div className="p-3 overflow-auto flex-grow-1">
                                  {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
                                    <div className="row row-col-4">
                                      {groupedVariants.color.map((v) => {
                                        const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
                                        const isOutOfStock = (v.stock ?? 0) <= 0;

                                        return (
                                          <div className="col-lg-4 mt-2 col-5" key={getSku(v) || v._id}>
                                            <div
                                              className="text-center"
                                              style={{
                                                cursor: isOutOfStock ? "not-allowed" : "pointer",
                                              }}
                                              onClick={() =>
                                                !isOutOfStock &&
                                                (handleVariantSelect(item._id, v),
                                                  closeVariantOverlay())
                                              }
                                            >
                                              <div
                                                style={{
                                                  width: "28px",
                                                  height: "28px",
                                                  borderRadius: "20%",
                                                  backgroundColor: v.hex || "#ccc",
                                                  margin: "0 auto 8px",
                                                  border: isSelected ? "3px solid #000" : "1px solid #ddd",
                                                  opacity: isOutOfStock ? 0.5 : 1,
                                                  position: "relative",
                                                }}
                                              >
                                                {isSelected && (
                                                  <span
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform: "translate(-50%, -50%)",
                                                      color: "#fff",
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    ✓
                                                  </span>
                                                )}
                                              </div>
                                              <div className="small page-title-main-name" style={{fontSize: '12px'}}>
                                                {getVariantDisplayText(v)}
                                              </div>
                                              {isOutOfStock && (
                                                <div className="text-danger small">
                                                  Out of Stock
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
                                    <div className="row row-cols-3 g-3">
                                      {groupedVariants.text.map((v) => {
                                        const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
                                        const isOutOfStock = (v.stock ?? 0) <= 0;

                                        return (
                                          <div className="col" key={getSku(v) || v._id}>
                                            <div
                                              className="text-center"
                                              style={{
                                                cursor: isOutOfStock ? "not-allowed" : "pointer",
                                              }}
                                              onClick={() =>
                                                !isOutOfStock &&
                                                (handleVariantSelect(item._id, v),
                                                  closeVariantOverlay())
                                              }
                                            >
                                              <div
                                                style={{
                                                  padding: "10px",
                                                  borderRadius: "8px",
                                                  border: isSelected ? "3px solid #000" : "1px solid #ddd",
                                                  background: isSelected ? "#f8f9fa" : "#fff",
                                                  minHeight: "50px",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  opacity: isOutOfStock ? 0.5 : 1,
                                                }}
                                              >
                                                {getVariantDisplayText(v)}
                                              </div>
                                              {isOutOfStock && (
                                                <div className="text-danger small mt-1">
                                                  Out of Stock
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </section>
        )}

        {/* More Reads Section - UNCHANGED */}
        {data.categoryTrending.length > 0 && (
          <section className="py-5 border-top">
            <div className='container-fluid-lg padding-left-rightss-Blog-grid'>
              <h4 className="mb-5 text-muted small text-uppercase tracking-widest fs-3">More Reads</h4>
              <Row>
                <Col lg={12} className="mx-auto">
                  {data.categoryTrending.map(item => (
                    <div key={item.category._id} className="more-reads-item">
                      <img
                        src={getImageUrl(item.blog?.coverImage)}
                        className="more-reads-img d-sm-block" 
                        alt={item.blog?.title || 'Blog'}
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-grow-1">
                        <div className="more-reads-category text-dark">{item.category?.name}</div>
                        <Link to={`/blog/${item.blog?.slug}`} className="text-decoration-none">
                          <h3 className="more-reads-title text-dark">{item.blog?.title}</h3>
                        </Link>
                        <div className="more-reads-meta desktop-mobile-width">
                          <span>12-12-2026</span> &nbsp;&nbsp;&nbsp;
                          <span>7 min ago</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Col>
              </Row>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Blog;