import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner, Container, Row, Col } from 'react-bootstrap';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Loader from "../../components/common/Loader";
import "../../styles/common/bootstrap.min.css";
import "../../styles/Blog.css";
import "../../styles/BestSellers.css";
import "../../App.css";
import { getBlogLanding } from "../../api/seoBlogApi";
import { UserContext } from "../../context/UserContext";
import SEOMeta from "../../components/common/SEOMeta";
import ProductCard from "../../components/common/ProductCard";
import { useWishlist } from "../../hooks/useWishlist";
import { getProductDisplayData } from "../../utils/productHelpers";
import BlogHeroCard from "../../components/sections/blog/BlogHeroCard";

// Default placeholder image
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

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

  // Trending Products variant selection state
  const [selectedVariants, setSelectedVariants] = useState({});

  const width = useWindowWidth();
  const isMobileOrTablet = width < 992;
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { wishlistData, wishlistLoading, toggleWishlist } = useWishlist(user);

  const fetchLandingData = async (category = 'all', nextCursor = null) => {
    try {
      const res = await getBlogLanding({
        limit: 6,
        ...(category !== 'all' ? { category } : {}),
        ...(nextCursor ? { cursor: nextCursor } : {})
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  };

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
          categoryTrending: result.categoryTrending || [],
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

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCursor(null);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '' || typeof imageUrl !== 'string') {
      return DEFAULT_IMAGE;
    }
    return imageUrl;
  };

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
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="blog-loader-container">
        <Loader />
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
      <SEOMeta type="bloglist" />
      <Header />

      <div className="blog-landing-container margin-topss page-title-main-name">
        {/* Trending Hero Section */}
        <BlogHeroCard
          trendingBlog={data.trendingBlog}
          getImageUrl={getImageUrl}
        />

        {/* Category Navigation */}
        <nav className="backgorund-category-names py-2 mt-lg-3" style={{ zIndex: 1000 }}>
          <Container>
            <div
              className="d-flex flex-nowrap overflow-auto no-scrollbar category-nav-container"
              style={{
                gap: '1rem',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {data.categoryNav.map(cat => (
                <button
                  key={cat._id}
                  className={`category-nav-link bg-transparent ${selectedCategory === cat._id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat._id)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </Container>
        </nav>

        {/* Blog Grid / Slider */}
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

            {/* Load More Button */}
            {data.blogs.hasMore && (
              <div className="text-center mt-5">
                <button
                  className="btn btn-outline-dark px-5 py-2"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Trending Products Slider */}
        {data.trendingProducts?.length > 0 && (
          <section className="py-5 bg-white mb-lg-5">
            <div className="container-fluid-lg padding-left-rightss-Blog-grid">
              <h4 className="mb-4 small fs-3 title-main-file">Trending Products</h4>

              <div className="position-relative">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  spaceBetween={10}
                  slidesPerView={2}
                  breakpoints={{
                    320: { slidesPerView: 2, spaceBetween: 10 },
                    480: { slidesPerView: 2, spaceBetween: 10 },
                    768: { slidesPerView: 3, spaceBetween: 15 },
                    992: { slidesPerView: 4, spaceBetween: 15 },
                    1200: { slidesPerView: 5, spaceBetween: 20 },
                  }}
                  navigation={true}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  className="product-swiper"
                >
                  {data.trendingProducts.map((prod) => {
                    const item = getProductDisplayData(prod, selectedVariants);
                    if (!item) return null;

                    return (
                      <SwiperSlide key={`trending-${prod._id}`}>
                        <ProductCard
                          item={item}
                          wishlistData={wishlistData}
                          wishlistLoading={wishlistLoading}
                          toggleWishlist={toggleWishlist}
                          onVariantSelect={(productId, v) => {
                            setSelectedVariants((prev) => ({ ...prev, [productId]: v }));
                          }}
                          onProductClick={(p) => {
                            const slug = p.slug || p._id;
                            if (slug) navigate(`/product/${slug}`);
                          }}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </section>
        )}

        {/* More Reads Section */}
        {data.categoryTrending?.length > 0 && (
          <section className="py-5 border-top">
            <div className='container-fluid-lg padding-left-rightss-Blog-grid'>
              <h4 className="mb-5 text-muted small text-uppercase tracking-widest fs-3">More Reads</h4>
              <Row>
                <Col lg={12} className="mx-auto">
                  {data.categoryTrending.map(item => (
                    <div key={item.category?._id || item.category} className="more-reads-item">
                      <img
                        src={getImageUrl(item.blog?.coverImage)}
                        className="more-reads-img d-sm-block"
                        alt={item.blog?.title || 'Blog'}
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-grow-1">
                        <div className="more-reads-category text-dark">{item.category?.name || item.category}</div>
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

      <Footer />
    </>
  );
};

export default Blog;
