import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

export default function BlogCard({
    blog,
}) {
    if (!blog) return null;

    const coverUrl = blog.coverImage || DEFAULT_IMAGE;

    return (
        <div className="blog-card-item">
            <Link to={`/blog/${blog.slug}`} className="text-decoration-none text-dark">
                <div className="blog-card-img-wrap">
                    <img
                        src={coverUrl}
                        alt={blog.title || "Blog cover"}
                        className="blog-card-img img-fluid"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = DEFAULT_IMAGE;
                        }}
                    />
                    {blog.category?.name && (
                        <span className="blog-card-category-badge">
                            {blog.category.name}
                        </span>
                    )}
                </div>
                <div className="blog-card-content mt-3">
                    <h4 className="blog-card-title">{blog.title}</h4>
                    {blog.metaDescription && (
                        <p className="blog-card-excerpt text-muted">{blog.metaDescription}</p>
                    )}
                    <div className="blog-card-meta text-muted small mt-2">
                        <span>{blog.readTime || "5 min read"}</span>
                        {blog.publishedAt && (
                            <span className="ms-3">
                                {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
