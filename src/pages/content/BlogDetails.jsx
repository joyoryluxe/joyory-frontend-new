import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from "../../components/common/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getBlogBySlug } from "../../api/seoBlogApi";
import { getErrorMessage } from "../../utils/errorHandler";
import { UserContext } from "../../context/UserContext";
import Header from "../../components/common/Header";
import SEOMeta from "../../components/common/SEOMeta";
import "../../styles/ForYou.css";
import Footer from "../../components/common/Footer";

import ProductCard from "../../components/common/ProductCard";
import useWishlist from "../../hooks/useWishlist";
import { getProductDisplayData } from "../../utils/productHelpers";
import BlogContentSections from "../../components/sections/blog/BlogContentSections";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { wishlistData, wishlistLoading, toggleWishlist } = useWishlist(user);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl === '') {
      return 'https://placehold.co/400x300/ffffff/cccccc?text=Product';
    }
    return imageUrl;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogBySlug(slug);
        const data = res.data;
        setBlog(data);
      } catch (err) {
        setError(getErrorMessage(err, 'Blog not found'));
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const relatedProducts = useMemo(() => {
    if (!blog?.relatedProducts) return [];
    return blog.relatedProducts
      .map(p => getProductDisplayData(p, selectedVariants))
      .filter(Boolean);
  }, [blog, selectedVariants]);

  if (loading) {
    return (
      <div className="text-center py-5" style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader text="Loading article..." height={150} />
      </div>
    );
  }

  if (error || !blog) {
    return <div className="alert alert-danger text-center py-5">{error || 'Blog not found'}</div>;
  }

  return (
    <>
      <SEOMeta type="blog" slug={slug} />
      <Header />

      {/* Hero Section */}
      <section className="trending-hero margin-top-responsive-design">
        <div className='container-fluid-lg padding-left-rightss-blog'>
          <div className="row g-5 background-colorsss">
            <div className="col-lg-7 ps-lg-5 ps-3 d-flex flex-column justify-content-center">
              <div className="mb-3 hero-section-main-name page-title-main-name fw-normal small tracking-widest">
                {blog.categoryName || blog.category?.name} · {blog.label || "Article"}
              </div>
              <h1 className="display-5 fw-bold mb-4 playfair-font-bold blog-title-main-file">{blog.title}</h1>
              {blog.excerpt && <p className="lead mb-5 opacity-90 blog-excerpt-main-file">{blog.excerpt}</p>}
              <div className='d-flex justify-content-between'>
                <p className="lead mb-5 opacity-90 blog-excerpt-main-file">{blog.publishedAtFormatted || blog.publishedAt}</p>
                <p className="lead mb-5 opacity-90 blog-excerpt-main-file">{blog.readingTime ? `${blog.readingTime} min read` : ''}</p>
              </div>
            </div>
            <div className="col-lg-5 hero-image-div p-3 margin-topss-hero-image position-relative">
              <div className='Blog-Hero-image-main'>
                {blog.coverImage && <img src={getImageUrl(blog.coverImage)} alt={blog.title} className="img-fluid hero-image" />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="blog-detail container-fluid-lg py-5 padding-left-rightss-blog-innersection pt-0">
        <div className="row">
          <div className="col-lg-12">
            {/* Alternating Content Sections */}
            <BlogContentSections
              sections={blog.contentSections}
              getImageUrl={getImageUrl}
            />

            <div className="meta text-muted mb-4 mt-5 pt-1">
              By {blog.author?.name || "Admin"} | {blog.publishedAtFormatted || blog.publishedAt}
              {blog.readingTime && ` | ${blog.readingTime} min read`}
            </div>

            <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />

            {/* Related Products Slider */}
            {relatedProducts.length > 0 && (
              <div className="related-products mt-5">
                <h3 className="mb-4">Related Products</h3>
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation
                  breakpoints={{
                    300: { slidesPerView: 2, spaceBetween: 10 },
                    576: { slidesPerView: 2, spaceBetween: 15 },
                    768: { slidesPerView: 3, spaceBetween: 15 },
                    992: { slidesPerView: 4, spaceBetween: 20 },
                  }}
                  className="foryou-swiper"
                >
                  {relatedProducts.map((item) => (
                    <SwiperSlide key={item._id}>
                      <ProductCard
                        item={item}
                        wishlistData={wishlistData}
                        wishlistLoading={wishlistLoading}
                        toggleWishlist={toggleWishlist}
                        onVariantSelect={(productId, v) => {
                          setSelectedVariants((prev) => ({ ...prev, [productId]: v }));
                        }}
                        onProductClick={(p) => {
                          const productSlug = p.slug || p._id;
                          if (productSlug) navigate(`/product/${productSlug}`);
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogDetail;
