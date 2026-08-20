import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function BlogHeroCard({
    trendingBlog,
    getImageUrl,
}) {
    if (!trendingBlog) return null;

    return (
        <section className="trending-hero">
            <div className="container-fluid-lg padding-left-rightss-blog">
                <Row className="g-5 background-colorsss">
                    <Col lg={7} className="ps-lg-5 ps-3 d-flex flex-column justify-content-center">
                        <Link
                            to={`/blog/${trendingBlog.slug}`}
                            className="text-white text-decoration-none border-bottom border-white pb-1 fw-medium"
                        >
                            <div className="mb-3 hero-section-main-name page-title-main-name fw-normal small tracking-widest">
                                {trendingBlog.categoryName} · {trendingBlog.label}
                            </div>
                            <h1 className="display-5 fw-bold mb-4 playfair-font-bold blog-title-main-file">
                                {trendingBlog.title}
                            </h1>
                            <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
                                {trendingBlog.excerpt}
                            </p>
                            <div className="d-flex justify-content-between">
                                <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
                                    {trendingBlog.publishedAtFormatted}
                                </p>
                                <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
                                    {trendingBlog.postedAgo}
                                </p>
                            </div>
                        </Link>
                    </Col>
                    <Col lg={5} className="hero-image-div p-3 margin-topss-hero-image position-relative">
                        <div className="Blog-Hero-image-main">
                            <img
                                src={getImageUrl(trendingBlog.coverImage)}
                                alt={trendingBlog.title || 'Trending Blog'}
                                className="img-fluid hero-image"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    );
}
