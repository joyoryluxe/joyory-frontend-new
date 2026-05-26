// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/blog.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const BlogDetails = () => {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const res = await fetch(
//           `https://beauty.joyory.com/api/blogs/slug/${slug}`
//         );
//         const data = await res.json();
//         setBlog(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching blog details:", error);
//         setLoading(false);
//       }
//     };
//     fetchBlog();
//   }, [slug]);

//   return (
//     <>
//       <Header />
//       <div className="container py-5">
//         {loading ? (
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status"></div>
//             <p className="mt-2">Loading blog...</p>
//           </div>
//         ) : blog ? (
//           <div className="blog-detail">
//             <h2 className="fw-bold text-primary mb-3">{blog.title}</h2>
//             <p className="text-muted small mb-3">
//               {new Date(blog.createdAt).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "long",
//                 year: "numeric",
//               })}
//             </p>
//             <img
//               src={blog.image || "/images/default.jpg"}
//               alt={blog.title}
//               className="img-fluid rounded mb-4"
//               style={{ maxHeight: "400px", objectFit: "cover" }}
//             />
//             <div
//               className="blog-content"
//               dangerouslySetInnerHTML={{ __html: blog.content }}
//             />
//           </div>
//         ) : (
//           <p className="text-danger">Blog not found</p>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default BlogDetails;




// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/blog.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const BlogDetails = () => {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Comment states
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   // Related blogs
//   const [relatedBlogs, setRelatedBlogs] = useState([]);

//   // Fetch blog + comments + related blogs
//   useEffect(() => {
//     const fetchBlogData = async () => {
//       try {
//         // Fetch current blog
//         const res = await fetch(
//           `https://beauty.joyory.com/api/blogs/slug/${slug}`
//         );
//         const data = await res.json();
//         setBlog(data);

//         if (data?._id) {
//           // Fetch comments for this blog
//           const commentsRes = await fetch(
//             `https://beauty.joyory.com/api/blogs/${data._id}/comments`
//           );
//           const commentsData = await commentsRes.json();
//           setComments(commentsData || []);

//           // Fetch related blogs (filter same category if available)
//           const relatedRes = await fetch(
//             "https://beauty.joyory.com/api/blogs"
//           );
//           const allBlogs = await relatedRes.json();

//           const related = allBlogs
//             .filter(
//               (b) =>
//                 b.slug !== slug &&
//                 (b.category === data.category || !data.category) // match category if exists
//             )
//             .slice(0, 3); // show 3 only

//           setRelatedBlogs(related);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching blog details:", error);
//         setLoading(false);
//       }
//     };

//     fetchBlogData();
//   }, [slug]);

//   // Handle comment submit
//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim() || !blog?._id) return;

//     try {
//       const res = await fetch(
//         `https://beauty.joyory.com/api/blogs/${blog._id}/comments`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             text: newComment,
//             name: "Guest User", // Replace with logged-in user name if available
//           }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to post comment");

//       const savedComment = await res.json();
//       setComments([savedComment, ...comments]); // prepend new comment
//       setNewComment("");
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container py-5">
//         {loading ? (
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status"></div>
//             <p className="mt-2">Loading blog...</p>
//           </div>
//         ) : blog ? (
//           <div className="blog-detail">
//             {/* Blog details */}
//             <h2 className="fw-bold text-primary mb-3">{blog.title}</h2>
//             <p className="text-muted small mb-3">
//               {new Date(blog.createdAt).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "long",
//                 year: "numeric",
//               })}
//             </p>
//             <img
//               src={blog.image || "/images/default.jpg"}
//               alt={blog.title}
//               className="img-fluid rounded mb-4"
//               style={{ maxHeight: "400px", objectFit: "cover" }}
//             />
//             <div
//               className="blog-content mb-5"
//               dangerouslySetInnerHTML={{ __html: blog.content }}
//             />

//             {/* Comment Section */}
//             <div className="comments-section mt-5">
//               <h5 className="fw-bold mb-3">Comments</h5>

//               {/* Comment form */}
//               <form
//                 onSubmit={handleCommentSubmit}
//                 className="mb-4 p-3 border rounded shadow-sm"
//               >
//                 <div className="mb-3">
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     placeholder="Write your comment..."
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                   ></textarea>
//                 </div>
//                 <button type="submit" className="btn btn-primary">
//                   Post Comment
//                 </button>
//               </form>

//               {/* Comment list */}
//               {comments.length > 0 ? (
//                 <ul className="list-unstyled">
//                   {comments.map((c) => (
//                     <li
//                       key={c._id || c.id}
//                       className="p-3 mb-3 bg-light rounded shadow-sm"
//                     >
//                       <h6 className="fw-bold mb-1">
//                         {c.name || "Anonymous"}
//                       </h6>
//                       <p className="mb-0">{c.text}</p>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-muted">No comments yet. Be the first!</p>
//               )}
//             </div>

//             {/* Related Blogs Section */}
//             <div className="related-blogs mt-5">
//               <h5 className="fw-bold mb-3">Related Posts</h5>
//               <div className="row g-4">
//                 {relatedBlogs.length > 0 ? (
//                   relatedBlogs.map((rb) => (
//                     <div key={rb._id} className="col-12 col-sm-6 col-md-4">
//                       <Link
//                         to={`/blog/${rb.slug}`}
//                         className="text-decoration-none text-dark"
//                       >
//                         <div className="card h-100 border-0 shadow-sm">
//                           <img
//                             src={rb.image || "/images/default.jpg"}
//                             alt={rb.title}
//                             className="card-img-top"
//                             style={{ height: "200px", objectFit: "cover" }}
//                           />
//                           <div className="card-body">
//                             <h6 className="card-title fw-bold text-primary">
//                               {rb.title.length > 60
//                                 ? rb.title.slice(0, 60) + "..."
//                                 : rb.title}
//                             </h6>
//                             <p className="text-muted small mb-0">
//                               {new Date(rb.createdAt).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "long",
//                                   year: "numeric",
//                                 }
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </Link>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-muted">No related posts found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-danger">Blog not found</p>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default BlogDetails;



















// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/blog.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const BlogDetails = () => {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Comment states
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   // Related blogs
//   const [relatedBlogs, setRelatedBlogs] = useState([]);

//   // Fetch blog + comments + related blogs
//   useEffect(() => {
//     const fetchBlogData = async () => {
//       try {
//         // Fetch current blog
//         const res = await fetch(
//           `https://beauty.joyory.com/api/blogs/slug/${slug}`
//         );
//         const data = await res.json();
//         setBlog(data);

//         if (data?._id) {
//           // Fetch comments for this blog
//           const commentsRes = await fetch(
//             `https://beauty.joyory.com/api/blogs/${data._id}/comments`
//           );
//           const commentsData = await commentsRes.json();
//           setComments(commentsData || []);

//           // Fetch related blogs
//           const relatedRes = await fetch(
//             "https://beauty.joyory.com/api/blogs"
//           );
//           const allBlogs = await relatedRes.json();

//           const related = allBlogs
//             .filter(
//               (b) =>
//                 b.slug !== slug &&
//                 (b.category === data.category || !data.category)
//             )
//             .slice(0, 3);

//           setRelatedBlogs(related);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching blog details:", error);
//         setLoading(false);
//       }
//     };

//     fetchBlogData();
//   }, [slug]);

//   // Handle comment submit
//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim() || !blog?._id) return;

//     try {
//       const res = await fetch(
//         `https://beauty.joyory.com/api/blogs/${blog._id}/comments`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             text: newComment,
//             name: "Guest User", // Replace with logged-in user name if available
//           }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to post comment");

//       const savedComment = await res.json();
//       setComments([savedComment, ...comments]);
//       setNewComment("");
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container py-5">
//         {loading ? (
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status"></div>
//             <p className="mt-2">Loading blog...</p>
//           </div>
//         ) : blog ? (
//           <div className="blog-detail">
//             {/* Blog details */}
//             <h2 className="fw-bold text-primary mb-3">{blog.title}</h2>
//             <p className="text-muted small mb-3">
//               {new Date(blog.createdAt).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "long",
//                 year: "numeric",
//               })}
//               {blog.category && (
//                 <span className="badge bg-info text-dark ms-2">
//                   {blog.category}
//                 </span>
//               )}
//             </p>
//             <img
//               src={blog.image || "/images/default.jpg"}
//               alt={blog.title}
//               className="img-fluid rounded mb-4"
//               style={{ maxHeight: "400px", objectFit: "cover" }}
//             />
//             <div
//               className="blog-content mb-5"
//               dangerouslySetInnerHTML={{ __html: blog.description }}
//             />

//             {/* Comment Section */}
//             <div className="comments-section mt-5">
//               <h5 className="fw-bold mb-3">Comments</h5>

//               {/* Comment form */}
//               <form
//                 onSubmit={handleCommentSubmit}
//                 className="mb-4 p-3 border rounded shadow-sm"
//               >
//                 <div className="mb-3">
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     placeholder="Write your comment..."
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                   ></textarea>
//                 </div>
//                 <button type="submit" className="btn btn-primary">
//                   Post Comment
//                 </button>
//               </form>

//               {/* Comment list */}
//               {comments.length > 0 ? (
//                 <ul className="list-unstyled">
//                   {comments.map((c) => (
//                     <li
//                       key={c._id || c.id}
//                       className="p-3 mb-3 bg-light rounded shadow-sm"
//                     >
//                       <h6 className="fw-bold mb-1">
//                         {c.name || "Anonymous"}
//                       </h6>
//                       <p className="mb-0">{c.text}</p>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-muted">No comments yet. Be the first!</p>
//               )}
//             </div>

//             {/* Related Blogs Section */}
//             <div className="related-blogs mt-5">
//               <h5 className="fw-bold mb-3">Related Posts</h5>
//               <div className="row g-4">
//                 {relatedBlogs.length > 0 ? (
//                   relatedBlogs.map((rb) => (
//                     <div key={rb._id} className="col-12 col-sm-6 col-md-4">
//                       <Link
//                         to={`/blog/${rb.slug}`}
//                         className="text-decoration-none text-dark"
//                       >
//                         <div className="card h-100 border-0 shadow-sm">
//                           <img
//                             src={rb.image || "/images/default.jpg"}
//                             alt={rb.title}
//                             className="card-img-top"
//                             style={{ height: "200px", objectFit: "cover" }}
//                           />
//                           <div className="card-body">
//                             <h6 className="card-title fw-bold text-primary">
//                               {rb.title.length > 60
//                                 ? rb.title.slice(0, 60) + "..."
//                                 : rb.title}
//                             </h6>
//                             <p className="text-muted small mb-0">
//                               {new Date(rb.createdAt).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "long",
//                                   year: "numeric",
//                                 }
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </Link>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-muted">No related posts found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-danger">Blog not found</p>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default BlogDetails;






















// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/blog.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const BlogDetails = () => {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Comment states
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   // Related blogs
//   const [relatedBlogs, setRelatedBlogs] = useState([]);

//   // Fetch blog + comments + related blogs
//   useEffect(() => {
//     const fetchBlogData = async () => {
//       try {
//         // Fetch current blog by slug
//         const res = await fetch(
//           `https://beauty.joyory.com/api/blogs/slug/${slug}`
//         );
//         const data = await res.json();
//         setBlog(data);

//         if (data?._id) {
//           // Fetch comments using the correct API
//           const commentsRes = await fetch(
//             `https://beauty.joyory.com/api/comments/${data._id}`
//           );
//           const commentsData = await commentsRes.json();
//           setComments(commentsData || []);

//           // Fetch related blogs
//           const relatedRes = await fetch(
//             "https://beauty.joyory.com/api/blogs"
//           );
//           const allBlogs = await relatedRes.json();

//           const related = allBlogs
//             .filter(
//               (b) =>
//                 b.slug !== slug &&
//                 (b.category === data.category || !data.category)
//             )
//             .slice(0, 3);

//           setRelatedBlogs(related);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching blog details:", error);
//         setLoading(false);
//       }
//     };

//     fetchBlogData();
//   }, [slug]);

//   // Handle comment submit
//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim() || !blog?._id) return;

//     try {
//       const res = await fetch(
//         `https://beauty.joyory.com/api/comments/${blog._id}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             text: newComment,
//             name: "Guest User", // Replace with logged-in user if available
//           }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to post comment");

//       const savedComment = await res.json();
//       setComments([savedComment, ...comments]);
//       setNewComment("");
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container py-5">
//         {loading ? (
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status"></div>
//             <p className="mt-2">Loading blog...</p>
//           </div>
//         ) : blog ? (
//           <div className="blog-detail">
//             {/* Blog details */}
//             <h2 className="fw-bold text-primary mb-3">{blog.title}</h2>
//             <p className="text-muted small mb-3">
//               {new Date(blog.createdAt).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "long",
//                 year: "numeric",
//               })}
//               {blog.category && (
//                 <span className="badge bg-info text-dark ms-2">
//                   {blog.category}
//                 </span>
//               )}
//             </p>
//             <img
//               src={blog.image || "/images/default.jpg"}
//               alt={blog.title}
//               className="img-fluid rounded mb-4"
//               style={{ maxHeight: "400px", objectFit: "cover" }}
//             />
//             <div
//               className="blog-content mb-5"
//               dangerouslySetInnerHTML={{ __html: blog.description }}
//             />

//             {/* Comment Section */}
//             <div className="comments-section mt-5">
//               <h5 className="fw-bold mb-3">Comments</h5>

//               {/* Comment form */}
//               <form
//                 onSubmit={handleCommentSubmit}
//                 className="mb-4 p-3 border rounded shadow-sm"
//               >
//                 <div className="mb-3">
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     placeholder="Write your comment..."
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                   ></textarea>
//                 </div>
//                 <button type="submit" className="btn btn-primary">
//                   Post Comment
//                 </button>
//               </form>

//               {/* Comment list */}
//               {comments.length > 0 ? (
//                 <ul className="list-unstyled">
//                   {comments.map((c, index) => (
//                     <li
//                       key={c._id || index}
//                       className="p-3 mb-3 bg-light rounded shadow-sm"
//                     >
//                       <h6 className="fw-bold mb-1">
//                         {c.name || "Anonymous"}
//                       </h6>
//                       <p className="mb-0">{c.text}</p>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-muted">No comments yet. Be the first!</p>
//               )}
//             </div>

//             {/* Related Blogs Section */}
//             <div className="related-blogs mt-5">
//               <h5 className="fw-bold mb-3">Related Posts</h5>
//               <div className="row g-4">
//                 {relatedBlogs.length > 0 ? (
//                   relatedBlogs.map((rb) => (
//                     <div key={rb._id} className="col-12 col-sm-6 col-md-4">
//                       <Link
//                         to={`/blog/${rb.slug}`}
//                         className="text-decoration-none text-dark"
//                       >
//                         <div className="card h-100 border-0 shadow-sm">
//                           <img
//                             src={rb.image || "/images/default.jpg"}
//                             alt={rb.title}
//                             className="card-img-top"
//                             style={{ height: "200px", objectFit: "cover" }}
//                           />
//                           <div className="card-body">
//                             <h6 className="card-title fw-bold text-primary">
//                               {rb.title.length > 60
//                                 ? rb.title.slice(0, 60) + "..."
//                                 : rb.title}
//                             </h6>
//                             <p className="text-muted small mb-0">
//                               {new Date(rb.createdAt).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "long",
//                                   year: "numeric",
//                                 }
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </Link>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-muted">No related posts found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-danger">Blog not found</p>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default BlogDetails;





















// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/blog.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const BlogDetails = () => {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Comment states
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   // Related blogs
//   const [relatedBlogs, setRelatedBlogs] = useState([]);

//   // Fetch blog + comments + related blogs
//   useEffect(() => {
//     const fetchBlogData = async () => {
//       try {
//         // Fetch current blog by slug
//         const res = await fetch(
//           `https://beauty.joyory.com/api/blogs/slug/${slug}`
//         );
//         const data = await res.json();
//         setBlog(data);

//         if (data?._id) {
//           // Fetch comments
//           const commentsRes = await fetch(
//             `https://beauty.joyory.com/api/comments/${data._id}`
//           );
//           const commentsData = await commentsRes.json();
//           setComments(commentsData || []);

//           // Fetch related blogs
//           const relatedRes = await fetch(
//             "https://beauty.joyory.com/api/blogs"
//           );
//           const allBlogs = await relatedRes.json();

//           const related = allBlogs
//             .filter(
//               (b) =>
//                 b.slug !== slug &&
//                 (b.category === data.category || !data.category)
//             )
//             .slice(0, 3);

//           setRelatedBlogs(related);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching blog details:", error);
//         setLoading(false);
//       }
//     };

//     fetchBlogData();
//   }, [slug]);

//   // Handle comment submit
//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim() || !blog?._id) return;

//     try {
//       const res = await fetch(
//         `https://beauty.joyory.com/api/comments/${blog._id}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             text: newComment,
//             name: "Guest User", // TODO: Replace with logged-in user if available
//           }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to post comment");

//       const savedComment = await res.json();
//       setComments([savedComment, ...comments]);
//       setNewComment("");
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container py-5">
//         {loading ? (
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status"></div>
//             <p className="mt-2">Loading blog...</p>
//           </div>
//         ) : blog ? (
//           <div className="blog-detail">
//             {/* Blog details */}
//             <h2 className="fw-bold text-primary mb-3">{blog.title}</h2>
//             <p className="text-muted small mb-3">
//               {new Date(blog.createdAt).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "long",
//                 year: "numeric",
//               })}
//               {blog.category && (
//                 <span className="badge bg-info text-dark ms-2">
//                   {blog.category}
//                 </span>
//               )}
//             </p>
//             <img
//               src={blog.image || "/images/default.jpg"}
//               alt={blog.title}
//               className="img-fluid rounded mb-4"
//               style={{ maxHeight: "400px", objectFit: "cover" }}
//             />
//             <div
//               className="blog-content mb-5"
//               dangerouslySetInnerHTML={{ __html: blog.description }}
//             />

//             {/* Comment Section */}
//             <div className="comments-section mt-5">
//               <h5 className="fw-bold mb-3">Comments</h5>

//               {/* Comment form */}
//               <form
//                 onSubmit={handleCommentSubmit}
//                 className="mb-4 p-3 border rounded shadow-sm"
//               >
//                 <div className="mb-3">
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     placeholder="Write your comment..."
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                   ></textarea>
//                 </div>
//                 <button type="submit" className="btn btn-primary">
//                   Post Comment
//                 </button>
//               </form>

//               {/* Comment list */}
//               {comments.length > 0 ? (
//                 <ul className="list-unstyled">
//                   {comments.map((c, index) => (
//                     <li
//                       key={c._id || index}
//                       className="p-3 mb-3 bg-light rounded shadow-sm"
//                     >
//                       {/* Username from backend */}
//                       <h6 className="fw-bold mb-1">
//                         {c.userId?.name || "Anonymous"}
//                       </h6>

//                       {/* Comment text */}
//                       <p className="mb-1">{c.text}</p>

//                       {/* Comment image */}
//                       {c.image && (
//                         <img
//                           src={c.image}
//                           alt="comment"
//                           className="img-fluid rounded mt-2"
//                           style={{ maxHeight: "150px" }}
//                         />
//                       )}

//                       {/* Comment date */}
//                       <small className="text-muted d-block mt-1">
//                         {new Date(c.createdAt).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "long",
//                           year: "numeric",
//                         })}
//                       </small>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-muted">No comments yet. Be the first!</p>
//               )}
//             </div>

//             {/* Related Blogs Section */}
//             <div className="related-blogs mt-5">
//               <h5 className="fw-bold mb-3">Related Posts</h5>
//               <div className="row g-4">
//                 {relatedBlogs.length > 0 ? (
//                   relatedBlogs.map((rb) => (
//                     <div key={rb._id} className="col-12 col-sm-6 col-md-4">
//                       <Link
//                         to={`/blog/${rb.slug}`}
//                         className="text-decoration-none text-dark"
//                       >
//                         <div className="card h-100 border-0 shadow-sm">
//                           <img
//                             src={rb.image || "/images/default.jpg"}
//                             alt={rb.title}
//                             className="card-img-top"
//                             style={{ height: "200px", objectFit: "cover" }}
//                           />
//                           <div className="card-body">
//                             <h6 className="card-title fw-bold text-primary">
//                               {rb.title.length > 60
//                                 ? rb.title.slice(0, 60) + "..."
//                                 : rb.title}
//                             </h6>
//                             <p className="text-muted small mb-0">
//                               {new Date(rb.createdAt).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "long",
//                                   year: "numeric",
//                                 }
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </Link>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-muted">No related posts found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-danger">Blog not found</p>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default BlogDetails;















// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/blog.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const BlogDetails = () => {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Comment states
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   // Related blogs
//   const [relatedBlogs, setRelatedBlogs] = useState([]);

//   // Fetch blog + comments + related blogs
//   useEffect(() => {
//     const fetchBlogData = async () => {
//       try {
//         const res = await fetch(
//           `https://beauty.joyory.com/api/blogs/slug/${slug}`
//         );
//         const data = await res.json();
//         setBlog(data);

//         if (data?._id) {
//           // Fetch comments
//           const commentsRes = await fetch(
//             `https://beauty.joyory.com/api/comments/${data._id}`
//           );
//           const commentsData = await commentsRes.json();
//           setComments(commentsData || []);

//           // Fetch related blogs
//           const relatedRes = await fetch(
//             "https://beauty.joyory.com/api/blogs"
//           );
//           const allBlogs = await relatedRes.json();

//           const related = allBlogs
//             .filter(
//               (b) =>
//                 b.slug !== slug &&
//                 (b.category === data.category || !data.category)
//             )
//             .slice(0, 3);

//           setRelatedBlogs(related);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching blog details:", error);
//         setLoading(false);
//       }
//     };

//     fetchBlogData();
//   }, [slug]);

//   // Handle comment submit
//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim() || !blog?._id) return;

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         `https://beauty.joyory.com/api/comments/${blog._id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token ? `Bearer ${token}` : "",
//           },
//           body: JSON.stringify({ text: newComment }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to post comment");

//       const savedComment = await res.json();

//       // ✅ Ensure new comment has user + createdAt info
//       const enrichedComment = {
//         ...savedComment,
//         userId: savedComment.userId || {
//           name: "You",
//           email: "your@email.com", // fallback until API returns
//         },
//         createdAt: savedComment.createdAt || new Date().toISOString(),
//       };

//       setComments([enrichedComment, ...comments]);
//       setNewComment("");
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container py-5">
//         {loading ? (
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status"></div>
//             <p className="mt-2">Loading blog...</p>
//           </div>
//         ) : blog ? (
//           <div className="blog-detail">
//             {/* Blog details */}
//             <h2 className="fw-bold text-primary mb-3">{blog.title}</h2>
//             <p className="text-muted small mb-3">
//               {new Date(blog.createdAt).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "long",
//                 year: "numeric",
//               })}
//               {blog.category && (
//                 <span className="badge bg-info text-dark ms-2">
//                   {blog.category}
//                 </span>
//               )}
//             </p>
//             <img
//               src={blog.image || "/images/default.jpg"}
//               alt={blog.title}
//               className="img-fluid rounded mb-4"
//               style={{ maxHeight: "400px", objectFit: "cover" }}
//             />
//             <div
//               className="blog-content mb-5"
//               dangerouslySetInnerHTML={{ __html: blog.description }}
//             />

//             {/* Comment Section */}
//             <div className="comments-section mt-5">
//               <h5 className="fw-bold mb-3">Comments</h5>

//               {/* Comment form */}
//               <form
//                 onSubmit={handleCommentSubmit}
//                 className="mb-4 p-3 border rounded shadow-sm"
//               >
//                 <div className="mb-3">
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     placeholder="Write your comment..."
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                   ></textarea>
//                 </div>
//                 <button type="submit" className="btn btn-primary">
//                   Post Comment
//                 </button>
//               </form>

//               {/* Comment list */}
//               {comments.length > 0 ? (
//                 <ul className="list-unstyled">
//                   {comments.map((c, index) => (
//                     <li
//                       key={c._id || index}
//                       className="p-3 mb-3 bg-light rounded shadow-sm"
//                     >
//                       {/* User Name */}
//                       <h6 className="fw-bold mb-1">
//                         {c.userId?.name ||
//                           c.userId?.username ||
//                           c.userId?.firstName ||
//                           c.userId?.email?.split("@")[0] ||
//                           "Anonymous"}
//                       </h6>

//                       {/* Comment Text */}
//                       <p className="mb-1">{c.text}</p>

//                       {/* Comment Image */}
//                       {c.image && (
//                         <img
//                           src={c.image}
//                           alt="comment"
//                           className="img-fluid rounded mt-2"
//                           style={{ maxHeight: "150px" }}
//                         />
//                       )}

//                       {/* Date */}
//                       <small className="text-muted d-block mt-1">
//                         {c.createdAt
//                           ? new Date(c.createdAt).toLocaleDateString("en-GB", {
//                               day: "2-digit",
//                               month: "long",
//                               year: "numeric",
//                             })
//                           : "Just now"}
//                       </small>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-muted">No comments yet. Be the first!</p>
//               )}
//             </div>

//             {/* Related Blogs Section */}
//             <div className="related-blogs mt-5">
//               <h5 className="fw-bold mb-3">Related Posts</h5>
//               <div className="row g-4">
//                 {relatedBlogs.length > 0 ? (
//                   relatedBlogs.map((rb) => (
//                     <div key={rb._id} className="col-12 col-sm-6 col-md-4">
//                       <Link
//                         to={`/blog/${rb.slug}`}
//                         className="text-decoration-none text-dark"
//                       >
//                         <div className="card h-100 border-0 shadow-sm">
//                           <img
//                             src={rb.image || "/images/default.jpg"}
//                             alt={rb.title}
//                             className="card-img-top"
//                             style={{ height: "200px", objectFit: "cover" }}
//                           />
//                           <div className="card-body">
//                             <h6 className="card-title fw-bold text-primary">
//                               {rb.title.length > 60
//                                 ? rb.title.slice(0, 60) + "..."
//                                 : rb.title}
//                             </h6>
//                             <p className="text-muted small mb-0">
//                               {new Date(rb.createdAt).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "long",
//                                   year: "numeric",
//                                 }
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </Link>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-muted">No related posts found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-danger">Blog not found</p>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default BlogDetails;












// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/blog.css";
// import Footer from "./Footer";
// import Header from "./Header";

// const BlogDetails = () => {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Comment states
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   // Related blogs
//   const [relatedBlogs, setRelatedBlogs] = useState([]);

//   // Fetch blog + comments + related blogs
//   useEffect(() => {
//     const fetchBlogData = async () => {
//       try {
//         const res = await fetch(
//           `https://beauty.joyory.com/api/blogs/slug/${slug}`
//         );
//         const data = await res.json();
//         setBlog(data);

//         if (data?._id) {
//           // Fetch comments
//           await fetchComments(data._id);

//           // Fetch related blogs
//           const relatedRes = await fetch(
//             "https://beauty.joyory.com/api/blogs"
//           );
//           const allBlogs = await relatedRes.json();

//           const related = allBlogs
//             .filter(
//               (b) =>
//                 b.slug !== slug &&
//                 (b.category === data.category || !data.category)
//             )
//             .slice(0, 3);

//           setRelatedBlogs(related);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching blog details:", error);
//         setLoading(false);
//       }
//     };

//     fetchBlogData();
//   }, [slug]);

//   // Fetch comments separately
//   const fetchComments = async (blogId) => {
//     try {
//       const commentsRes = await fetch(
//         `https://beauty.joyory.com/api/comments/${blogId}`
//       );
//       const commentsData = await commentsRes.json();
//       setComments(commentsData || []);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     }
//   };

//   // Handle comment submit
//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim() || !blog?._id) return;

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         `https://beauty.joyory.com/api/comments/${blog._id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token ? `Bearer ${token}` : "",
//           },
//           body: JSON.stringify({
//             text: newComment,
//           }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to post comment");

//       // ✅ Re-fetch updated comments after posting
//       await fetchComments(blog._id);

//       setNewComment("");
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container py-5">
//         {loading ? (
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status"></div>
//             <p className="mt-2">Loading blog...</p>
//           </div>
//         ) : blog ? (
//           <div className="blog-detail">
//             {/* Blog details */}
//             <h2 className="fw-bold text-primary mb-3">{blog.title}</h2>
//             <p className="text-muted small mb-3">
//               {new Date(blog.createdAt).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "long",
//                 year: "numeric",
//               })}
//               {blog.category && (
//                 <span className="badge bg-info text-dark ms-2">
//                   {blog.category}
//                 </span>
//               )}
//             </p>
//             <img
//               src={blog.image || "/images/default.jpg"}
//               alt={blog.title}
//               className="img-fluid rounded mb-4"
//               style={{ maxHeight: "400px", objectFit: "cover" }}
//             />
//             <div
//               className="blog-content mb-5"
//               dangerouslySetInnerHTML={{ __html: blog.description }}
//             />

//             {/* Comment Section */}
//             <div className="comments-section mt-5">
//               <h5 className="fw-bold mb-3">Comments</h5>

//               {/* Comment form */}
//               <form
//                 onSubmit={handleCommentSubmit}
//                 className="mb-4 p-3 border rounded shadow-sm"
//               >
//                 <div className="mb-3">
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     placeholder="Write your comment..."
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                   ></textarea>
//                 </div>
//                 <button type="submit" className="btn btn-primary">
//                   Post Comment
//                 </button>
//               </form>

//               {/* Comment list */}
//               {comments.length > 0 ? (
//                 <ul className="list-unstyled">
//                   {comments.map((c, index) => (
//                     <li
//                       key={c._id || index}
//                       className="p-3 mb-3 bg-light rounded shadow-sm"
//                     >
//                       {/* User Name */}
//                       <h6 className="fw-bold mb-1">
//                         {c.userId?.name ||
//                           c.userId?.username ||
//                           c.userId?.firstName ||
//                           c.userId?.email?.split("@")[0] ||
//                           "Anonymous"}
//                       </h6>

//                       {/* Comment Text */}
//                       <p className="mb-1">{c.text}</p>

//                       {/* Comment Image */}
//                       {c.image && (
//                         <img
//                           src={c.image}
//                           alt="comment"
//                           className="img-fluid rounded mt-2"
//                           style={{ maxHeight: "150px" }}
//                         />
//                       )}

//                       {/* Date */}
//                       <small className="text-muted d-block mt-1">
//                         {new Date(c.createdAt).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "long",
//                           year: "numeric",
//                         })}
//                       </small>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-muted">No comments yet. Be the first!</p>
//               )}
//             </div>

//             {/* Related Blogs Section */}
//             <div className="related-blogs mt-5">
//               <h5 className="fw-bold mb-3">Related Posts</h5>
//               <div className="row g-4">
//                 {relatedBlogs.length > 0 ? (
//                   relatedBlogs.map((rb) => (
//                     <div key={rb._id} className="col-12 col-sm-6 col-md-4">
//                       <Link
//                         to={`/blog/${rb.slug}`}
//                         className="text-decoration-none text-dark"
//                       >
//                         <div className="card h-100 border-0 shadow-sm">
//                           <img
//                             src={rb.image || "/images/default.jpg"}
//                             alt={rb.title}
//                             className="card-img-top"
//                             style={{ height: "200px", objectFit: "cover" }}
//                           />
//                           <div className="card-body">
//                             <h6 className="card-title fw-bold text-primary">
//                               {rb.title.length > 60
//                                 ? rb.title.slice(0, 60) + "..."
//                                 : rb.title}
//                             </h6>
//                             <p className="text-muted small mb-0">
//                               {new Date(rb.createdAt).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "long",
//                                   year: "numeric",
//                                 }
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </Link>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-muted">No related posts found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-danger">Blog not found</p>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default BlogDetails;












// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Spinner } from 'react-bootstrap';

// const API_BASE = 'https://beauty.joyory.com/api';

// const BlogDetail = () => {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/blogs/slug/${slug}`);
//         if (!res.ok) throw new Error('Blog not found');
//         const data = await res.json();
//         setBlog(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBlog();
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" />
//         <p>Loading article...</p>
//       </div>
//     );
//   }

//   if (error || !blog) {
//     return (
//       <div className="alert alert-danger text-center py-5">
//         {error || 'Blog not found'}
//       </div>
//     );
//   }

//   return (
//     <div className="blog-detail container py-5">
//       <div className="row justify-content-center">
//         <div className="col-lg-8">
//           <h1 className="display-4 fw-bold mb-3">{blog.title}</h1>
//           <div className="meta text-muted mb-4">
//             By {blog.author?.name} | {blog.publishedAtFormatted} | {blog.readingTime} min read
//           </div>
//           {blog.coverImage && (
//             <img src={blog.coverImage} className="img-fluid rounded mb-4" alt={blog.title} />
//           )}
//           <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />

//           {/* Content Sections */}
//           {blog.contentSections && blog.contentSections.length > 0 && (
//             <div className="sections mt-5">
//               {blog.contentSections.map(section => (
//                 <div key={section._id} className="section mb-4">
//                   <h4>{section.categoryName}</h4>
//                   <h4>{section.subtitle}</h4>

//                   {section.image && (
//                     <img src={section.image} className="img-fluid mb-2" alt={section.subtitle} />
//                   )}
//                   <div dangerouslySetInnerHTML={{ __html: section.description }} />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Tags */}
//           {blog.tags && blog.tags.length > 0 && (
//             <div className="tags mt-4">
//               <strong>Tags:</strong> {blog.tags.map(tag => (
//                 <span key={tag} className="badge bg-secondary me-1">{tag}</span>
//               ))}
//             </div>
//           )}

//           {/* Related Products */}
//           {blog.relatedProducts && blog.relatedProducts.length > 0 && (
//             <div className="related-products mt-5">
//               <h3>Related Products</h3>
//               <div className="row g-3">
//                 {blog.relatedProducts.map(product => (
//                   <div key={product._id} className="col-md-4">
//                     <div className="card h-100">
//                       <img
//                         src={product.selectedVariant?.image}
//                         className="card-img-top"
//                         alt={product.name}
//                         style={{ height: '150px', objectFit: 'contain' }}
//                       />
//                       <div className="card-body">
//                         <h6 className="card-title">{product.name}</h6>
//                         <div className="price">
//                           ₹{product.selectedVariant?.displayPrice}
//                           {product.selectedVariant?.originalPrice && (
//                             <span className="text-muted text-decoration-line-through ms-2">
//                               ₹{product.selectedVariant?.originalPrice}
//                             </span>
//                           )}
//                         </div>
//                         <Link to={`/product/${product.slugs[0]}`} className="btn btn-sm btn-primary mt-2">
//                           View
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Related Articles */}
//           {blog.relatedArticles && blog.relatedArticles.length > 0 && (
//             <div className="related-articles mt-5">
//               <h3>Related Articles</h3>
//               <div className="row g-3">
//                 {blog.relatedArticles.map(article => (
//                   <div key={article._id} className="col-md-4">
//                     <div className="card h-100">
//                       {article.coverImage && (
//                         <img src={article.coverImage} className="card-img-top" alt={article.title} />
//                       )}
//                       <div className="card-body">
//                         <h6 className="card-title">{article.title}</h6>
//                         <Link to={`/blog/${article.slug}`} className="btn btn-sm btn-outline-primary">
//                           Read
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDetail;


















// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Spinner, Container, Row, Col } from 'react-bootstrap';

// const API_BASE = 'https://beauty.joyory.com/api';

// const BlogDetail = () => {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/blogs/slug/${slug}`);
//         if (!res.ok) throw new Error('Blog not found');
//         const data = await res.json();
//         setBlog(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBlog();
//   }, [slug]);

//   // Helper to safely get image URL
//   const getImageUrl = (imageUrl) => {
//     if (!imageUrl || typeof imageUrl !== 'string' || imageUrl === '') {
//       return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
//     }
//     return imageUrl;
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" />
//         <p className="mt-3">Loading article...</p>
//       </div>
//     );
//   }

//   if (error || !blog) {
//     return (
//       <div className="alert alert-danger text-center py-5">
//         {error || 'Blog not found'}
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* ===================== HERO SECTION - SAME DESIGN AS BLOG LANDING ===================== */}
//       <section className="trending-hero overflow-hidden">
//         <div className='container-fluid-lg padding-left-rightss-blog'>
//           <Row className="align-items-center g-5 background-colorsss">
//             <Col lg={7} className="ps-lg-5 ps-3">
//               <div className="mb-3 hero-section-main-name page-title-main-name fw-normal small tracking-widest">
//                 {blog.categoryName || blog.category?.name} · {blog.label || "Article"}
//               </div>

//               <h1 className="display-5 fw-bold mb-4 playfair-font-bold blog-title-main-file">
//                 {blog.title}
//               </h1>

//               {blog.excerpt && (
//                 <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
//                   {blog.excerpt}
//                 </p>
//               )}

//               <div className='d-flex justify-content-between'>
//                 <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
//                   {blog.publishedAtFormatted || blog.publishedAt}
//                 </p>
//                 <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
//                   {blog.readingTime ? `${blog.readingTime} min read` : ''}
//                 </p>
//               </div>
//             </Col>

//             <Col lg={5} className="hero-image-div p-3 margin-topss-hero-image">
//               <div className='Blog-Hero-image-main'>
//                 {blog.coverImage && (
//                   <img
//                     src={getImageUrl(blog.coverImage)}
//                     alt={blog.title}
//                     className="img-fluid hero-image"
//                     referrerPolicy="no-referrer"
//                   />
//                 )}
//               </div>
//             </Col>
//           </Row>
//         </div>
//       </section>

//       {/* ===================== MAIN CONTENT ===================== */}
//       <div className="blog-detail container-fluid-lg py-5 padding-left-rightss-blog-innersection pt-0">
//         <div className="row">
//           <div className="col-lg-12">

//             {/* Author & Meta Info */}


//             {/* Content Sections */}
//             {/* {blog.contentSections && blog.contentSections.length > 0 && (
//               <div className="sections mt-5">
//                 {blog.contentSections.map(section => (
//                   <div key={section._id} className="section mb-4">
//                     {section.categoryName && <h4>{section.categoryName}</h4>}
//                     {section.subtitle && <h4>{section.subtitle}</h4>}

//                     {section.image && (
//                       <img
//                         src={getImageUrl(section.image)}
//                         className="img-fluid mb-3 rounded"
//                         alt={section.subtitle || "Section Image"}
//                       />
//                     )}
//                     <div dangerouslySetInnerHTML={{ __html: section.description }} />
//                   </div>
//                 ))}
//               </div>
//             )} */}


//             {blog.contentSections && blog.contentSections.length > 0 && (
//               <div className="sections mt-5">
//                 {blog.contentSections.map((section, index) => {
//                   const isEven = index % 2 === 0;

//                   return (
//                     <div key={section._id} className="section mb-5">
//                       <div className="row align-items-center g-4">

//                         {/* 📝 TEXT CONTENT */}
//                         <div className={`col-lg-6 ${isEven ? 'order-lg-1' : 'order-lg-2'}`}>
//                           {section.categoryName && (
//                             <h5 className="text-muted mb-2">{section.categoryName}</h5>
//                           )}

//                           {section.subtitle && (
//                             <h3 className="fw-bold mb-3">{section.subtitle}</h3>
//                           )}

//                           <div
//                             className="section-description"
//                             dangerouslySetInnerHTML={{ __html: section.description }}
//                           />
//                         </div>

//                         {/* 🖼️ IMAGE */}
//                         {section.image && (
//                           <div className={`col-lg-6 ${isEven ? 'order-lg-2' : 'order-lg-1'}`}>
//                             <img
//                               src={getImageUrl(section.image)}
//                               alt={section.subtitle || "Section Image"}
//                               className="img-fluid rounded w-100"
//                               style={{
//                                 objectFit: "cover",
//                                 maxHeight: "400px"
//                               }}
//                             />
//                           </div>
//                         )}

//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {/* Tags */}
//             {/* {blog.tags && blog.tags.length > 0 && (
//               <div className="tags mt-4">
//                 <strong>Tags:</strong>{' '}
//                 {blog.tags.map(tag => (
//                   <span key={tag} className="badge bg-secondary me-1">{tag}</span>
//                 ))}
//               </div>
//             )} */}

//             {/* Related Products */}
//             {blog.relatedProducts && blog.relatedProducts.length > 0 && (
//               <div className="related-products mt-5">
//                 <h3>Related Products</h3>
//                 <div className="row g-3">
//                   {blog.relatedProducts.map(product => (
//                     <div key={product._id} className="col-md-4">
//                       <div className="card h-100">
//                         <img
//                           src={product.selectedVariant?.image || product.image}
//                           className="card-img-top"
//                           alt={product.name}
//                           style={{ height: '150px', objectFit: 'contain' }}
//                         />
//                         <div className="card-body">
//                           <h6 className="card-title">{product.name}</h6>
//                           <div className="price">
//                             ₹{product.selectedVariant?.displayPrice || product.price}
//                             {product.selectedVariant?.originalPrice && (
//                               <span className="text-muted text-decoration-line-through ms-2">
//                                 ₹{product.selectedVariant?.originalPrice}
//                               </span>
//                             )}
//                           </div>
//                           <Link
//                             to={`/product/${product.slugs?.[0] || product._id}`}
//                             className="btn btn-sm btn-primary mt-2"
//                           >
//                             View Product
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}






//             <div className="meta text-muted mb-4 mt-5 pt-1">
//               By {blog.author?.name || "Admin"} | {blog.publishedAtFormatted || blog.publishedAt}
//               {blog.readingTime && ` | ${blog.readingTime} min read`}
//             </div>


//             <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />

//             {/* Related Articles */}
//             {blog.relatedArticles && blog.relatedArticles.length > 0 && (
//               <div className="related-articles mt-5">
//                 <h3>Related Articles</h3>
//                 <div className="row g-3">
//                   {blog.relatedArticles.map(article => (
//                     <div key={article._id} className="col-md-4">
//                       <div className="card h-100">
//                         {article.coverImage && (
//                           <img
//                             src={getImageUrl(article.coverImage)}
//                             className="card-img-top"
//                             alt={article.title}
//                           />
//                         )}
//                         <div className="card-body">
//                           <h6 className="card-title">{article.title}</h6>
//                           <Link
//                             to={`/blog/${article.slug}`}
//                             className="btn btn-sm btn-outline-primary"
//                           >
//                             Read Article
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BlogDetail;





















// import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
// import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
// import { Spinner } from 'react-bootstrap';
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { UserContext } from "./UserContext";
// import { CartContext } from "../context/CartContext";
// import bagIcon from "../assets/bag.svg";
// import "../css/Foryou.css"; // if needed for styling

// const API_BASE = 'https://beauty.joyory.com/api';
// const CART_API_BASE = 'https://beauty.joyory.com/api/user/cart';
// const WISHLIST_CACHE_KEY = "guestWishlist";

// // ===================== HELPER FUNCTIONS (copied from Foryou) =====================
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   const normalized = hex.trim().toLowerCase();
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
// };

// const getVariantDisplayText = (variant) => {
//   return (
//     variant.shadeName ||
//     variant.name ||
//     variant.size ||
//     variant.ml ||
//     variant.weight ||
//     "Default"
//   ).toUpperCase();
// };

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [], default: [] };
//   variants.forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) {
//       grouped.color.push(v);
//     } else {
//       grouped.text.push(v);
//     }
//   });
//   return grouped;
// };

// const getVariantName = (variant) => {
//   if (!variant) return "Default";
//   const nameSources = [
//     variant.shadeName,
//     variant.name,
//     variant.variantName,
//     variant.size,
//     variant.ml,
//     variant.weight
//   ];
//   for (const source of nameSources) {
//     if (source && typeof source === 'string') return source;
//   }
//   return "Default";
// };

// const getVariantType = (variant) => {
//   if (!variant) return 'default';
//   if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//   if (variant.shadeName) return 'shade';
//   if (variant.size) return 'size';
//   if (variant.ml) return 'ml';
//   if (variant.weight) return 'weight';
//   return 'default';
// };

// const getProductSlug = (product) => {
//   if (!product) return null;
//   if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
//     return product.slugs[0];
//   }
//   if (product.slug) return product.slug;
//   return product._id;
// };

// const getBrandName = (product) => {
//   if (!product?.brand) return "Unknown Brand";
//   if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//   if (typeof product.brand === "string") return product.brand;
//   return "Unknown Brand";
// };

// // Format price in Indian Rupees
// const formatPrice = (price) => {
//   const numPrice = parseFloat(price || 0);
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0
//   }).format(numPrice);
// };

// // ===================== BLOG DETAIL COMPONENT =====================
// const BlogDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(UserContext);
//   const { addToCart } = useContext(CartContext);

//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Product states (copied from Foryou)
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Helper to get complete product data for display (copied from Foryou)
//   const getProductDisplayData = useCallback((product) => {
//     if (!product) return null;

//     const allVariants = Array.isArray(product.variants) ? product.variants :
//       Array.isArray(product.shadeOptions) ? product.shadeOptions : [];

//     const availableVariants = allVariants.filter(v => v && (parseInt(v.stock || 0) > 0));
//     const defaultVariant = allVariants[0] || {};

//     const storedVariant = selectedVariants[product._id];

//     let selectedVariant = storedVariant ||
//       product.selectedVariant ||
//       (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

//     if (storedVariant) {
//       const storedStock = parseInt(storedVariant.stock || 0);
//       if (storedStock <= 0 && availableVariants.length > 0) {
//         selectedVariant = availableVariants[0];
//       }
//     }

//     let image = "";
//     const getVariantImage = (variant) => variant?.images?.[0] || variant?.image;
//     image = getVariantImage(selectedVariant) ||
//       getVariantImage(availableVariants[0]) ||
//       getVariantImage(defaultVariant) ||
//       product.image ||
//       "";

//     const displayPrice = parseFloat(
//       selectedVariant.displayPrice ||
//       selectedVariant.discountedPrice ||
//       selectedVariant.price ||
//       product.price ||
//       0
//     );

//     const originalPrice = parseFloat(
//       selectedVariant.originalPrice ||
//       selectedVariant.mrp ||
//       product.mrp ||
//       displayPrice
//     );

//     let discountPercent = parseFloat(
//       selectedVariant.discountPercent ||
//       product.discountPercent ||
//       0
//     );

//     if (!discountPercent && originalPrice > displayPrice) {
//       discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//     }

//     const variantName = getVariantName(selectedVariant);
//     const variantType = getVariantType(selectedVariant);
//     const variantDisplayText = getVariantDisplayText(selectedVariant);
//     const stock = parseInt(selectedVariant.stock || product.stock || 0);
//     const status = stock > 0 ? "inStock" : "outOfStock";
//     const sku = selectedVariant.sku || product.sku || "";
//     const productSlug = getProductSlug(product);
//     const brandName = getBrandName(product);

//     return {
//       ...product,
//       _id: product._id || "",
//       name: product.name || "Unnamed Product",
//       brandName: typeof brandName === 'string' ? brandName : "Unknown Brand",
//       slug: productSlug,
//       variant: {
//         ...selectedVariant,
//         variantName,
//         variantDisplayText,
//         displayPrice,
//         originalPrice,
//         discountPercent,
//         stock,
//         status,
//         sku,
//         variantType,
//         _id: selectedVariant._id || ""
//       },
//       image,
//       brandId: product.brand,
//       avgRating: parseFloat(product.avgRating || 0),
//       totalRatings: parseInt(product.totalRatings || 0),
//       allVariants: [...allVariants].filter(v => v),
//       variants: allVariants
//     };
//   }, [selectedVariants]);

//   // Wishlist functions (copied from Foryou)
//   const isInWishlist = (productId, sku) => {
//     if (!productId || !sku) return false;
//     return wishlistData.some(item =>
//       (item.productId === productId || item._id === productId) &&
//       item.sku === sku
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const response = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         const formattedWishlist = localWishlist.map(item => ({
//           productId: item._id,
//           _id: item._id,
//           sku: item.sku,
//           name: item.name,
//           variant: item.variantName,
//           image: item.image,
//           displayPrice: item.displayPrice,
//           originalPrice: item.originalPrice,
//           discountPercent: item.discountPercent,
//           status: item.status,
//           avgRating: item.avgRating,
//           totalRatings: item.totalRatings
//         }));
//         setWishlistData(formattedWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   };

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) {
//       toast.warn("Please select a variant first");
//       return;
//     }

//     const productId = prod._id;
//     const sku = getSku(variant);

//     setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//     try {
//       const currentlyInWishlist = isInWishlist(productId, sku);

//       if (user && !user.guest) {
//         if (currentlyInWishlist) {
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { withCredentials: true, data: { sku: sku } }
//           );
//           toast.success("Removed from wishlist!");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { sku: sku },
//             { withCredentials: true }
//           );
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];

//         if (currentlyInWishlist) {
//           const updated = guestWishlist.filter(item =>
//             !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(updated));
//           toast.success("Removed from wishlist!");
//         } else {
//           const productData = {
//             _id: productId,
//             name: prod.name,
//             brand: getBrandName(prod),
//             price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             images: variant.images || prod.images || ["/placeholder.png"],
//             image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
//             slug: prod.slugs?.[0] || prod.slug || prod._id,
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: variant.shadeName || variant.name || "Default",
//             shadeName: variant.shadeName || variant.name || "Default",
//             variant: variant.shadeName || variant.name || "Default",
//             hex: variant.hex || "#cccccc",
//             stock: variant.stock || 0,
//             status: variant.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: prod.avgRating || 0,
//             totalRatings: prod.totalRatings || 0,
//             commentsCount: prod.totalRatings || 0,
//             discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
//               ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
//               : 0
//           };
//           guestWishlist.push(productData);
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       }
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else {
//         toast.error(error.response?.data?.message || "Failed to update wishlist");
//       }
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // Handle variant selection
//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;
//     setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
//   }, []);

//   const openVariantOverlay = (productId, variantType = "all", e) => {
//     if (e) e.stopPropagation();
//     setSelectedVariantType(variantType);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   // Add to cart (same as Foryou)
//   const handleAddToCart = async (prod) => {
//     setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id] || prod.variant;
//         if (!selectedVariant || selectedVariant.stock <= 0) {
//           toast.warn("Please select an in-stock variant.");
//           return;
//         }
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }],
//         };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           toast.warn("Product is out of stock.");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       const response = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!response.data.success) throw new Error(response.data.message || "Failed to add to cart");
//       toast.success("Product added to cart!");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
//       toast.error(msg);
//       if (err.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // Helper to get image URL
//   const getImageUrl = (imageUrl) => {
//     if (!imageUrl || typeof imageUrl !== 'string' || imageUrl === '') {
//       return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
//     }
//     return imageUrl;
//   };

//   // Fetch blog data
//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/blogs/slug/${slug}`);
//         if (!res.ok) throw new Error('Blog not found');
//         const data = await res.json();
//         setBlog(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBlog();
//   }, [slug]);

//   // Prepare related products with display data
//   const relatedProducts = useMemo(() => {
//     if (!blog?.relatedProducts) return [];
//     return blog.relatedProducts.map(p => getProductDisplayData(p)).filter(Boolean);
//   }, [blog, getProductDisplayData]);

//   if (loading) {
//     return (
//       <div className="fullscreen-loader page-title-main-name">
//         <div className="spinner" />
//         <p className="text-black">Loading article...</p>
//       </div>
//     );
//   }

//   if (error || !blog) {
//     return (
//       <div className="container py-5 text-center">
//         <div className="alert alert-danger">{error || 'Blog not found'}</div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* ===================== HERO SECTION - SAME DESIGN AS BLOG LANDING ===================== */}
//       <section className="trending-hero overflow-hidden">
//         <div className='container-fluid-lg padding-left-rightss-blog'>
//           <div className="row align-items-center g-5 background-colorsss">
//             <div className="col-lg-7 ps-lg-5 ps-3">
//               <div className="mb-3 hero-section-main-name page-title-main-name fw-normal small tracking-widest">
//                 {blog.categoryName || blog.category?.name} · {blog.label || "Article"}
//               </div>

//               <h1 className="display-5 fw-bold mb-4 playfair-font-bold blog-title-main-file">
//                 {blog.title}
//               </h1>

//               {blog.excerpt && (
//                 <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
//                   {blog.excerpt}
//                 </p>
//               )}

//               <div className='d-flex justify-content-between'>
//                 <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
//                   {blog.publishedAtFormatted || blog.publishedAt}
//                 </p>
//                 <p className="lead mb-5 opacity-90 blog-excerpt-main-file w-100">
//                   {blog.readingTime ? `${blog.readingTime} min read` : ''}
//                 </p>
//               </div>
//             </div>

//             <div className="col-lg-5 hero-image-div p-3 margin-topss-hero-image">
//               <div className='Blog-Hero-image-main'>
//                 {blog.coverImage && (
//                   <img
//                     src={getImageUrl(blog.coverImage)}
//                     alt={blog.title}
//                     className="img-fluid hero-image"
//                     referrerPolicy="no-referrer"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===================== MAIN CONTENT ===================== */}
//       <div className="blog-detail container-fluid-lg py-5 padding-left-rightss-blog-innersection pt-0">
//         <div className="row">
//           <div className="col-lg-12">

//             {/* Content Sections with alternating layout */}
//             {blog.contentSections && blog.contentSections.length > 0 && (
//               <div className="sections mt-5">
//                 {blog.contentSections.map((section, index) => {
//                   const isEven = index % 2 === 0;
//                   return (
//                     <div key={section._id} className="section mb-5">
//                       <div className="row align-items-center g-4">
//                         {/* Text Content */}
//                         <div className={`col-lg-6 ${isEven ? 'order-lg-1' : 'order-lg-2'}`}>
//                           {section.categoryName && (
//                             <h5 className="text-muted mb-2">{section.categoryName}</h5>
//                           )}
//                           {section.subtitle && (
//                             <h3 className="fw-bold mb-3">{section.subtitle}</h3>
//                           )}
//                           <div
//                             className="section-description"
//                             dangerouslySetInnerHTML={{ __html: section.description }}
//                           />
//                         </div>

//                         {/* Image */}
//                         {section.image && (
//                           <div className={`col-lg-6 ${isEven ? 'order-lg-2' : 'order-lg-1'}`}>
//                             <img
//                               src={getImageUrl(section.image)}
//                               alt={section.subtitle || "Section Image"}
//                               className="img-fluid rounded w-100"
//                               style={{ objectFit: "cover", maxHeight: "400px" }}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {/* Main Content */}
//             <div className="meta text-muted mb-4 mt-5 pt-1">
//               By {blog.author?.name || "Admin"} | {blog.publishedAtFormatted || blog.publishedAt}
//               {blog.readingTime && ` | ${blog.readingTime} min read`}
//             </div>

//             <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />

//             {/* ===================== RELATED PRODUCTS SLIDER ===================== */}
//             {relatedProducts.length > 0 && (
//               <div className="related-products mt-5">
//                 <h3 className="mb-4">Related Products</h3>
//                 <div className="position-relative">
//                   <Swiper
//                     modules={[Autoplay, Pagination, Navigation]}
//                     pagination={{ clickable: true, dynamicBullets: true }}
//                     navigation={{
//                       nextEl: '.swiper-button-next',
//                       prevEl: '.swiper-button-prev',
//                     }}
//                     breakpoints={{
//                       300: { slidesPerView: 2, spaceBetween: 10 },
//                       576: { slidesPerView: 2, spaceBetween: 15 },
//                       768: { slidesPerView: 3, spaceBetween: 15 },
//                       992: { slidesPerView: 4, spaceBetween: 20 },
//                       1200: { slidesPerView: 4, spaceBetween: 25 },
//                     }}
//                     className="foryou-swiper"
//                   >
//                     {relatedProducts.map((item) => {
//                       if (!item) return null;

//                       const variant = item.variant || {};
//                       const allVariants = item.allVariants || [];
//                       const groupedVariants = groupVariantsByType(allVariants);
//                       const totalVariants = allVariants.length;
//                       const isVariantSelected = !!selectedVariants[item._id];
//                       const isAdding = addingToCart[item._id];
//                       const hasVariants = allVariants.length > 0;
//                       const outOfStock = hasVariants
//                         ? (variant?.stock <= 0)
//                         : (item.stock <= 0);
//                       const showSelectVariantButton = hasVariants && !isVariantSelected;
//                       // const buttonDisabled = isAdding || outOfStock;
//                       const buttonText = isAdding
//                         ? "Adding..."
//                         : showSelectVariantButton
//                           ? "Select Variant"
//                           : outOfStock
//                             ? "Out of Stock"
//                             : "Add to Bag";

//                       let imageUrl = item.image;
//                       if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
//                         imageUrl = `https://res.cloudinary.com/dekngswix/image/upload/${imageUrl}`;
//                       }
//                       if (!imageUrl) imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

//                       const selectedSku = getSku(variant);
//                       const isProductInWishlist = isInWishlist(item._id, selectedSku);

//                       return (
//                         <SwiperSlide key={item._id}>
//                           <div className="foryou-card-wrapper">
//                             <div className="foryou-card">
//                               {/* Product Image with Overlays */}
//                               <div
//                                 className="foryou-img-wrapper"
//                                 onClick={() => navigate(`/product/${item.slug || item._id}`)}
//                                 style={{ cursor: 'pointer' }}
//                               >
//                                 <img
//                                   src={imageUrl}
//                                   alt={item.name}
//                                   className="foryou-img img-fluid"
//                                   loading="lazy"
//                                   onError={(e) => {
//                                     e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//                                   }}
//                                 />

//                                 {/* Wishlist Icon */}
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     if (variant) toggleWishlist(item, variant);
//                                   }}
//                                   disabled={wishlistLoading[item._id]}
//                                   style={{
//                                     position: 'absolute',
//                                     top: '10px',
//                                     right: '10px',
//                                     cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
//                                     color: isProductInWishlist ? '#dc3545' : '#000000',
//                                     fontSize: '22px',
//                                     zIndex: 2,
//                                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                                     borderRadius: '50%',
//                                     width: '34px',
//                                     height: '34px',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                                     transition: 'all 0.3s ease',
//                                     border: 'none',
//                                     outline: 'none'
//                                   }}
//                                   title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                                 >
//                                   {wishlistLoading[item._id] ? (
//                                     <div className="spinner-border spinner-border-sm" role="status"></div>
//                                   ) : isProductInWishlist ? (
//                                     <FaHeart />
//                                   ) : (
//                                     <FaRegHeart />
//                                   )}
//                                 </button>

//                                 {/* Promo Badge */}
//                                 {variant.promoApplied && (
//                                   <div className="promo-badge">
//                                     <i className="bi bi-tag-fill me-1"></i>
//                                     Promo
//                                   </div>
//                                 )}
//                               </div>

//                               {/* Product Info */}
//                               <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//                                 <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>
//                                   <div className="brand-name small text-muted mb-1 mt-2 text-start">
//                                     {item.brandName}
//                                   </div>
//                                   <h6
//                                     className="foryou-name font-family-Poppins m-0 p-0"
//                                     onClick={() => navigate(`/product/${item.slug || item._id}`)}
//                                     style={{ cursor: 'pointer' }}
//                                   >
//                                     {item.name}
//                                   </h6>

//                                   {/* Minimal Variant Display */}
//                                   {hasVariants && (
//                                     <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                                       {isVariantSelected ? (
//                                         <div
//                                           className="selected-variant-display text-muted small"
//                                           style={{ cursor: 'pointer', display: 'inline-block' }}
//                                           onClick={(e) => openVariantOverlay(item._id, "all", e)}
//                                           title="Click to change variant"
//                                         >
//                                           Variant: <span className="fw-bold text-dark">{getVariantDisplayText(variant)}</span>
//                                           <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                                         </div>
//                                       ) : (
//                                         <div className="small text-muted" style={{ height: '20px' }}>
//                                           {allVariants.length} Variants Available
//                                         </div>
//                                       )}
//                                     </div>
//                                   )}

//                                   {/* Price Section */}
//                                   <div className="price-section mb-3">
//                                     <div className="d-flex align-items-baseline flex-wrap">
//                                       <span className="current-price fw-400 fs-5">
//                                         {formatPrice(variant.displayPrice)}
//                                       </span>
//                                       {variant.originalPrice > variant.displayPrice && (
//                                         <>
//                                           <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                                             {formatPrice(variant.originalPrice)}
//                                           </span>
//                                           <span className="discount-percent text-danger fw-bold ms-2">
//                                             ({variant.discountPercent || 0}% OFF)
//                                           </span>
//                                         </>
//                                       )}
//                                     </div>
//                                   </div>

//                                   {/* Add to Cart Button */}
//                                   <div className="cart-section">
//                                     <div className="d-flex align-items-center justify-content-between">
//                                       <button
//                                         className={`w-100 btn-add-cart`}
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           if (showSelectVariantButton) {
//                                             openVariantOverlay(item._id, "all", e);
//                                           } else {
//                                             handleAddToCart(item);
//                                           }
//                                         }}
//                                         // disabled={buttonDisabled}
//                                         style={{
//                                           transition: "background-color 0.3s ease, color 0.3s ease",
//                                         }}
//                                       >
//                                         {isAdding ? (
//                                           <>
//                                             <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                             Adding...
//                                           </>
//                                         ) : (
//                                           <>
//                                             {buttonText}
//                                             {!isAdding && !showSelectVariantButton && (
//                                               <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
//                                             )}
//                                           </>
//                                         )}
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Variant Overlay */}
//                             {showVariantOverlay === item._id && (
//                               <div className="variant-overlay" onClick={closeVariantOverlay}>
//                                 <div
//                                   className="variant-overlay-content m-0 p-0 w-100"
//                                   onClick={(e) => e.stopPropagation()}
//                                   style={{
//                                     width: '90%',
//                                     maxWidth: '500px',
//                                     maxHeight: '100%',
//                                     background: '#fff',
//                                     borderRadius: '0px',
//                                     overflow: 'hidden',
//                                     display: 'flex',
//                                     flexDirection: 'column'
//                                   }}
//                                 >
//                                   <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                                     <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
//                                     <button onClick={closeVariantOverlay} style={{ background: 'none', border: 'none', fontSize: '24px' }}>×</button>
//                                   </div>

//                                   <div className="variant-tabs d-flex">
//                                     <button
//                                       className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                                       onClick={() => setSelectedVariantType("all")}
//                                     >
//                                       All ({totalVariants})
//                                     </button>
//                                     {groupedVariants.color.length > 0 && (
//                                       <button
//                                         className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                                         onClick={() => setSelectedVariantType("color")}
//                                       >
//                                         Colors ({groupedVariants.color.length})
//                                       </button>
//                                     )}
//                                     {groupedVariants.text.length > 0 && (
//                                       <button
//                                         className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
//                                         onClick={() => setSelectedVariantType("text")}
//                                       >
//                                         Sizes ({groupedVariants.text.length})
//                                       </button>
//                                     )}
//                                   </div>

//                                   <div className="p-3 overflow-auto flex-grow-1">
//                                     {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
//                                       <div className="row row-col-4 g-3">
//                                         {groupedVariants.color.map((v) => {
//                                           const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                           const isOutOfStock = (v.stock ?? 0) <= 0;
//                                           return (
//                                             <div className="col-lg-4 mt-2 col-5" key={getSku(v) || v._id}>
//                                               <div
//                                                 className="text-center"
//                                                 style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
//                                                 onClick={() => !isOutOfStock && (handleVariantSelect(item._id, v), closeVariantOverlay())}
//                                               >
//                                                 <div
//                                                   style={{
//                                                     width: "28px",
//                                                     height: "28px",
//                                                     borderRadius: "20%",
//                                                     backgroundColor: v.hex || "#ccc",
//                                                     margin: "0 auto 8px",
//                                                     border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                                     opacity: isOutOfStock ? 0.5 : 1,
//                                                     position: "relative",
//                                                   }}
//                                                 >
//                                                   {isSelected && (
//                                                     <span
//                                                       style={{
//                                                         position: "absolute",
//                                                         top: "50%",
//                                                         left: "50%",
//                                                         transform: "translate(-50%, -50%)",
//                                                         color: "#fff",
//                                                         fontWeight: "bold",
//                                                       }}
//                                                     >
//                                                       ✓
//                                                     </span>
//                                                   )}
//                                                 </div>
//                                                 <div className="small page-title-main-name" style={{fontSize: '12px'}}>
//                                                   {getVariantDisplayText(v)}
//                                                 </div>
//                                                 {isOutOfStock && <div className="text-danger small">Out of Stock</div>}
//                                               </div>
//                                             </div>
//                                           );
//                                         })}
//                                       </div>
//                                     )}

//                                     {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
//                                       <div className="row row-cols-3 g-3">
//                                         {groupedVariants.text.map((v) => {
//                                           const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                           const isOutOfStock = (v.stock ?? 0) <= 0;
//                                           return (
//                                             <div className="col" key={getSku(v) || v._id}>
//                                               <div
//                                                 className="text-center"
//                                                 style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
//                                                 onClick={() => !isOutOfStock && (handleVariantSelect(item._id, v), closeVariantOverlay())}
//                                               >
//                                                 <div
//                                                   style={{
//                                                     padding: "10px",
//                                                     borderRadius: "8px",
//                                                     border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                                     background: isSelected ? "#f8f9fa" : "#fff",
//                                                     minHeight: "50px",
//                                                     display: "flex",
//                                                     alignItems: "center",
//                                                     justifyContent: "center",
//                                                     opacity: isOutOfStock ? 0.5 : 1,
//                                                   }}
//                                                 >
//                                                   {getVariantDisplayText(v)}
//                                                 </div>
//                                                 {isOutOfStock && <div className="text-danger small mt-1">Out of Stock</div>}
//                                               </div>
//                                             </div>
//                                           );
//                                         })}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </SwiperSlide>
//                       );
//                     })}
//                   </Swiper>
//                 </div>
//               </div>
//             )}

//             {/* Related Articles */}
//             {blog.relatedArticles && blog.relatedArticles.length > 0 && (
//               <div className="related-articles mt-5">
//                 <h3 className="mb-4">Related Articles</h3>
//                 <div className="row g-4">
//                   {blog.relatedArticles.map(article => (
//                     <div key={article._id} className="col-md-3  col-6">
//                       <Link to={`/blog/${article.slug}`} className="text-decoration-none">
//                         <div className="blog-card">
//                           <img
//                             src={getImageUrl(article.coverImage)}
//                             className="blog-card-img w-100"
//                             alt={article.title}
//                             referrerPolicy="no-referrer"
//                           />
//                           <h3 className="blog-card-title">{article.title}</h3>
//                         </div>
//                       </Link>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BlogDetail;




















import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./UserContext";
import { CartContext } from "../context/CartContext";
import bagIcon from "../assets/bag.svg";
import Header from "./Header";
import "../css/Foryou.css";
import Footer from './Footer';

const API_BASE = 'https://beauty.joyory.com/api';
const CART_API_BASE = 'https://beauty.joyory.com/api/user/cart';
const WISHLIST_CACHE_KEY = "guestWishlist";

// ===================== HELPER FUNCTIONS =====================
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

const getVariantName = (variant) => {
  if (!variant) return "Default";
  const nameSources = [variant.shadeName, variant.name, variant.variantName, variant.size, variant.ml, variant.weight];
  for (const source of nameSources) {
    if (source && typeof source === 'string') return source;
  }
  return "Default";
};

const getVariantType = (variant) => {
  if (!variant) return 'default';
  if (variant.hex && isValidHexColor(variant.hex)) return 'color';
  if (variant.shadeName) return 'shade';
  if (variant.size) return 'size';
  if (variant.ml) return 'ml';
  if (variant.weight) return 'weight';
  return 'default';
};

const getProductSlug = (product) => {
  if (!product) return null;
  if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) return product.slugs[0];
  if (product.slug) return product.slug;
  return product._id;
};

const getBrandName = (product) => {
  if (!product?.brand) return "Unknown Brand";
  if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
  if (typeof product.brand === "string") return product.brand;
  return "Unknown Brand";
};

const formatPrice = (price) => {
  const numPrice = parseFloat(price || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numPrice);
};

// ===================== BLOG DETAIL COMPONENT =====================
const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Product states
  const [selectedVariants, setSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  // New state for Related Articles "Read More"
  const [showAllArticles, setShowAllArticles] = useState(false);

  // ===================== PRODUCT HELPERS =====================
  const getProductDisplayData = useCallback((product) => {
    if (!product) return null;
    // ... (your existing getProductDisplayData logic remains the same)
    const allVariants = Array.isArray(product.variants) ? product.variants : Array.isArray(product.shadeOptions) ? product.shadeOptions : [];
    const availableVariants = allVariants.filter(v => v && parseInt(v.stock || 0) > 0);
    const defaultVariant = allVariants[0] || {};
    const storedVariant = selectedVariants[product._id];
    let selectedVariant = storedVariant || product.selectedVariant || (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

    if (storedVariant) {
      const storedStock = parseInt(storedVariant.stock || 0);
      if (storedStock <= 0 && availableVariants.length > 0) selectedVariant = availableVariants[0];
    }

    let image = "";
    const getVariantImage = (variant) => variant?.images?.[0] || variant?.image;
    image = getVariantImage(selectedVariant) || getVariantImage(availableVariants[0]) || getVariantImage(defaultVariant) || product.image || "";

    const displayPrice = parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || product.price || 0);
    const originalPrice = parseFloat(selectedVariant.originalPrice || selectedVariant.mrp || product.mrp || displayPrice);
    let discountPercent = parseFloat(selectedVariant.discountPercent || product.discountPercent || 0);
    if (!discountPercent && originalPrice > displayPrice) {
      discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
    }

    return {
      ...product,
      _id: product._id || "",
      name: product.name || "Unnamed Product",
      brandName: getBrandName(product),
      slug: getProductSlug(product),
      variant: { ...selectedVariant, variantName: getVariantName(selectedVariant), variantDisplayText: getVariantDisplayText(selectedVariant), displayPrice, originalPrice, discountPercent, stock: parseInt(selectedVariant.stock || product.stock || 0), status: parseInt(selectedVariant.stock || product.stock || 0) > 0 ? "inStock" : "outOfStock", sku: selectedVariant.sku || product.sku || "" },
      image,
      allVariants: allVariants.filter(v => v),
      variants: allVariants
    };
  }, [selectedVariants]);

  // Wishlist functions (kept as is)
  const isInWishlist = (productId, sku) => {
    if (!productId || !sku) return false;
    return wishlistData.some(item => (item.productId === productId || item._id === productId) && item.sku === sku);
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const response = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
        if (response.data.success) setWishlistData(response.data.wishlist || []);
      } else {
        const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        setWishlistData(localWishlist.map(item => ({ productId: item._id, _id: item._id, sku: item.sku, ...item })));
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
  };

  const toggleWishlist = async (prod, variant) => {
    if (!prod || !variant) return toast.warn("Please select a variant first");
    // Your full toggleWishlist logic (kept from your code)
    const productId = prod._id;
    const sku = getSku(variant);
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    try {
      const currentlyInWishlist = isInWishlist(productId, sku);
      if (user && !user.guest) {
        if (currentlyInWishlist) {
          await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${productId}`, { withCredentials: true, data: { sku } });
          toast.success("Removed from wishlist!");
        } else {
          await axios.post(`https://beauty.joyory.com/api/user/wishlist/${productId}`, { sku }, { withCredentials: true });
          toast.success("Added to wishlist!");
        }
        await fetchWishlistData();
      } else {
        // Guest logic (same as before)
        let guestWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        if (currentlyInWishlist) {
          guestWishlist = guestWishlist.filter(item => !(item._id === productId && item.sku === sku));
          toast.success("Removed from wishlist!");
        } else {
          guestWishlist.push({ _id: productId, ...prod, sku, variantName: variant.shadeName || "Default" });
          toast.success("Added to wishlist!");
        }
        localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
        await fetchWishlistData();
      }
    } catch (error) {
      toast.error("Wishlist update failed");
    } finally {
      setWishlistLoading(prev => ({ ...prev, [prod._id]: false }));
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  const handleVariantSelect = useCallback((productId, variant) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
  }, []);

  const openVariantOverlay = (productId) => {
    setSelectedVariantType("all");
    setShowVariantOverlay(productId);
  };

  const closeVariantOverlay = () => setShowVariantOverlay(null);

  const handleAddToCart = async (prod) => {
    // Your existing handleAddToCart logic
    setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
    try {
      const payload = { productId: prod._id, quantity: 1 };
      const response = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
      if (response.data.success) {
        toast.success("Product added to cart!");
        navigate("/cartpage");
      }
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl === '') {
      return 'https://placehold.co/400x300/ffffff/cccccc?text=Product';
    }
    return imageUrl;
  };

  // Fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/blogs/slug/${slug}`);
        if (!res.ok) throw new Error('Blog not found');
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const relatedProducts = useMemo(() => {
    if (!blog?.relatedProducts) return [];
    return blog.relatedProducts.map(p => getProductDisplayData(p)).filter(Boolean);
  }, [blog, getProductDisplayData]);

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" /><p>Loading article...</p></div>;
  }

  if (error || !blog) {
    return <div className="alert alert-danger text-center py-5">{error || 'Blog not found'}</div>;
  }

  return (
    <>

    <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero Section */}
      <section className="trending-hero overflow-hidden margin-top-responsive-design">
        <div className='container-fluid-lg padding-left-rightss-blog'>
          <div className="row align-items-center g-5 background-colorsss">
            <div className="col-lg-7 ps-lg-5 ps-3">
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
            <div className="col-lg-5 hero-image-div p-3 margin-topss-hero-image">
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
            {blog.contentSections && blog.contentSections.length > 0 && (
              <div className="sections mt-5">
                {blog.contentSections.map((section, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div key={section._id} className="section mb-5">
                      <div className="row align-items-center g-4">
                        <div className={`col-lg-6 ${isEven ? 'order-lg-1' : 'order-lg-2'}`}>
                          {section.categoryName && <h5 className="text-muted mb-2">{section.categoryName}</h5>}
                          {section.subtitle && <h3 className="fw-bold mb-3">{section.subtitle}</h3>}
                          <div className="section-description" dangerouslySetInnerHTML={{ __html: section.description }} />
                        </div>
                        {section.image && (
                          <div className={`col-lg-6 ${isEven ? 'order-lg-2' : 'order-lg-1'}`}>
                            <img src={getImageUrl(section.image)} alt={section.subtitle} className="img-fluid rounded w-100" style={{ objectFit: "cover", maxHeight: "400px" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="meta text-muted mb-4 mt-5 pt-1">
              By {blog.author?.name || "Admin"} | {blog.publishedAtFormatted || blog.publishedAt}
              {blog.readingTime && ` | ${blog.readingTime} min read`}
            </div>

            <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />

            {/* Related Products Slider - Already Good */}
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
                   {relatedProducts.map((item) => {
                      if (!item) return null;

                      const variant = item.variant || {};
                      const allVariants = item.allVariants || [];
                      const groupedVariants = groupVariantsByType(allVariants);
                      const totalVariants = allVariants.length;
                      const isVariantSelected = !!selectedVariants[item._id];
                      const isAdding = addingToCart[item._id];
                      const hasVariants = allVariants.length > 0;
                      const outOfStock = hasVariants
                        ? (variant?.stock <= 0)
                        : (item.stock <= 0);
                      const showSelectVariantButton = hasVariants && !isVariantSelected;
                      // const buttonDisabled = isAdding || outOfStock;
                      const buttonText = isAdding
                        ? "Adding..."
                        : showSelectVariantButton
                          ? "Select Variant"
                          : outOfStock
                            ? "Out of Stock"
                            : "Add to Bag";

                      let imageUrl = item.image;
                      if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
                        imageUrl = `https://res.cloudinary.com/dekngswix/image/upload/${imageUrl}`;
                      }
                      if (!imageUrl) imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

                      const selectedSku = getSku(variant);
                      const isProductInWishlist = isInWishlist(item._id, selectedSku);

                      return (
                        <SwiperSlide key={item._id}>
                          <div className="foryou-card-wrapper">
                            <div className="foryou-card">
                              {/* Product Image with Overlays */}
                              <div
                                className="foryou-img-wrapper"
                                onClick={() => navigate(`/product/${item.slug || item._id}`)}
                                style={{ cursor: 'pointer' }}
                              >
                                <img
                                  src={imageUrl}
                                  alt={item.name}
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
                                    if (variant) toggleWishlist(item, variant);
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
                              <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
                                <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>
                                  <div className="brand-name small text-muted mb-1 mt-2 text-start">
                                    {item.brandName}
                                  </div>
                                  <h6
                                    className="foryou-name font-family-Poppins m-0 p-0"
                                    onClick={() => navigate(`/product/${item.slug || item._id}`)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {item.name}
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
                                  <div className="price-section mb-3">
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

                                  {/* Add to Cart Button */}
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
                                        // disabled={buttonDisabled}
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
                                            {!isAdding && !showSelectVariantButton && (
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
                                    <button onClick={closeVariantOverlay} style={{ background: 'none', border: 'none', fontSize: '24px' }}>×</button>
                                  </div>

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

                                  <div className="p-3 overflow-auto flex-grow-1">
                                    {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
                                      <div className="row row-col-4 g-3">
                                        {groupedVariants.color.map((v) => {
                                          const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
                                          const isOutOfStock = (v.stock ?? 0) <= 0;
                                          return (
                                            <div className="col-lg-4 mt-2 col-5" key={getSku(v) || v._id}>
                                              <div
                                                className="text-center"
                                                style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                                                onClick={() => !isOutOfStock && (handleVariantSelect(item._id, v), closeVariantOverlay())}
                                              >
                                                <div
                                                  style={{
                                                    width: "28px",
                                                    height: "28px",
                                                    borderRadius: "20%",
                                                    backgroundColor: v.hex || "#ccc",
                                                    margin: "0 auto 8px",
                                                    border: isSelected ? "2px solid #000" : "1px solid #ddd",
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
                                                {isOutOfStock && <div className="text-danger small">Out of Stock</div>}
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
                                                style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                                                onClick={() => !isOutOfStock && (handleVariantSelect(item._id, v), closeVariantOverlay())}
                                              >
                                                <div
                                                  style={{
                                                    padding: "10px",
                                                    borderRadius: "8px",
                                                    border: isSelected ? "2px solid #000" : "1px solid #ddd",
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
                                                {isOutOfStock && <div className="text-danger small mt-1">Out of Stock</div>}
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
            )}

            {/* ===================== RELATED ARTICLES WITH READ MORE ===================== */}
            {blog.relatedArticles && blog.relatedArticles.length > 0 && (
              <div className="related-articles mt-5">
                <h3 className="mb-4">Related Articles</h3>
                <div className="row g-4">
                  {blog.relatedArticles
                    .slice(0, showAllArticles ? blog.relatedArticles.length : 4)
                    .map(article => (
                      <div key={article._id} className="col-md-3 col-6">
                        <Link to={`/blog/${article.slug}`} className="text-decoration-none">
                          <div className="blog-card">
                            <img
                              src={getImageUrl(article.coverImage)}
                              className="blog-card-img w-100"
                              alt={article.title}
                              referrerPolicy="no-referrer"
                            />
                            <h3 className="blog-card-title">{article.title}</h3>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>

                {/* Read More Button */}
                {blog.relatedArticles.length > 4 && !showAllArticles && (
                  <div className="text-center mt-4">
                    <button 
                      className="btn-read-more"
                      onClick={() => setShowAllArticles(true)}
                    >
                      Read More Articles
                    </button>
                  </div>
                )}
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