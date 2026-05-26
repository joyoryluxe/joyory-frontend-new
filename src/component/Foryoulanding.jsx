// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
// import { Container, Row, Col } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/Foryoulanding.css';
// import Header from './Header';
// import Footer from './Footer';
// import Foyoulanding from "../assets/Foyoulanding.jpg";

// /* ─────────────────────────────────────────────
//    RECOMMENDATIONS PAGE (with clickable banner)
// ───────────────────────────────────────────── */
// function RecommendationsPage({ onBack, onBannerClick }) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/recommendations/personal-summary', {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include'
//         });
//         const json = await res.json();
//         if (json.success) {
//           setData(json);
//         }
//       } catch (error) {
//         console.error('Error fetching recommendations:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRecommendations();
//   }, []);

//   if (loading) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
//         <Header />
//         <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
//           <div className="spinner-border text-dark mb-3" role="status"></div>
//           <p className="text-muted">Loading your personalized catalog...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff' }}>
//         <Header />
//         <Container className="py-5 text-center">
//           <h3>No recommendations found right now.</h3>
//           <button className="j-back-link mt-4" onClick={onBack}>Back to Home</button>
//         </Container>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--j-font-sans)' }}>
//       <Header />
//       <Container className="py-5">

//         {/* 🆕 NEW: Banner is now clickable – opens profile panel */}
//         {data.banner?.image?.[0]?.url && (
//           <div className="mb-5 text-center mt-5 pt-3" style={{ cursor: 'pointer' }} onClick={onBannerClick}>
//             <img 
//                   src={Foyoulanding} 
//                   alt="image-Not-Find" 
//                   className="img-fluid mt-5"
//                   style={{ maxHeight: 'auto', width: '100%'}}
//                 />

//           </div>
//         )}


//         {/* Dynamic Sections & Products */}
//         {data.sections?.map((section) => {
//           if (!section.products || section.products.length === 0) return null;

//           return (
//             <div key={section.key} className="mb-5">
//               <h4 className="fw-bold mb-4" style={{ color: '#1f2937' }}>{section.title}</h4>
//               <Row className="g-4">
//                 {section.products.map((product) => {
//                   const imgUrl = product.selectedVariant?.images?.[0] || product.images?.[0] || 'https://via.placeholder.com/600x800';
//                   const price = product.selectedVariant?.displayPrice || product.price;
//                   const brandName = product.brand?.name || 'Joyory';

//                   return (
//                     <Col key={product._id} xs={12} sm={6} lg={3}>
//                       <div className="j-product-card">
//                         <div className="j-product-img-wrap">
//                           <img
//                             src={imgUrl}
//                             alt={product.name}
//                             referrerPolicy="no-referrer"
//                           />
//                         </div>
//                         <p className="j-product-brand">{brandName}</p>
//                         <h3 className="j-product-name">{product.name}</h3>
//                         <p className="j-product-price">Rs {price}</p>
//                       </div>
//                     </Col>
//                   );
//                 })}
//               </Row>
//             </div>
//           );
//         })}

//         <div className="mt-5 text-center">
//           <button className="j-back-link" onClick={onBack}>Back to Home</button>
//         </div>
//       </Container>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    THANK YOU PAGE (Shows briefly before redirecting)
// ───────────────────────────────────────────── */
// function ThankYouPage() {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)', display: 'flex', flexDirection: 'column' }}>
//       <Header />
//       <main className="flex-grow-1 d-flex justify-content-center align-items-center">
//         <div className="text-center j-reveal">
//           <h2 className="j-hero-title-main mb-3">Thank You!</h2>
//           <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
//             We are curating your personalized beauty recommendations...
//           </p>
//           <div className="spinner-border mt-4" style={{ color: '#1f2937', width: '3rem', height: '3rem' }} />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    PROFILE RESULT VIEW (with Edit buttons)
// ───────────────────────────────────────────── */
// function ProfileResult({ profileData, onNextFromProfile, onEditQuestion }) {
//   if (!profileData) return null;

//   const { answers, skinType, concern, ingredient, productType, budget, formulation } = profileData;

//   const tagStyle = {
//     display: 'inline-block', padding: '4px 12px', borderRadius: 20,
//     background: '#f3f4f6', color: '#374151', fontSize: 12, fontWeight: 600,
//     marginRight: 6, marginBottom: 6, border: '1px solid #e5e7eb',
//   };

//   const sectionLabel = {
//     fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em',
//     textTransform: 'uppercase', marginBottom: 8, marginTop: 16,
//   };

//   // Helper to find the questionId that produced a given mapping field
//   const findQuestionIdByMappingField = (field) => {
//     const answer = answers.find(a => a.mappingField === field);
//     return answer?.questionId;
//   };

//   return (
//     <>
//       <div className="j-panel-body page-title-main-name">
//         <p className="j-panel-eyebrow">YOUR PROFILE</p>
//         <h3 className="j-panel-heading page-title-main-name fs-6" style={{ marginBottom: 4 }}>
//           Here's What We Know About You
//         </h3>
//         <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>
//           Based on your answers, we've built your personalised skincare profile.
//         </p>

//         {skinType && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Skin Type</p>
//               {/* 🆕 NEW: Edit button for skin type */}
//               <button 
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('skinType'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <span style={{ ...tagStyle, background: '#1f2937', color: 'white', border: 'none' }}>
//               {skinType.charAt(0).toUpperCase() + skinType.slice(1)}
//             </span>
//           </>
//         )}

//         {concern?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Skin Concern</p>
//               {/* 🆕 NEW: Edit button for concern (uses first concern's mapping field) */}
//               <button 
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('concern'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <div>
//               {concern.map((c, i) => (
//                 <span key={i} style={tagStyle}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
//               ))}
//             </div>
//           </>
//         )}

//         {productType?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Looking For</p>
//               <button 
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('productType'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <div>
//               {productType.map((p, i) => (
//                 <span key={i} style={tagStyle}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
//               ))}
//             </div>
//           </>
//         )}

//         {formulation && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Formulation</p>
//               <button 
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('formulation'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <span style={tagStyle}>{formulation.charAt(0).toUpperCase() + formulation.slice(1)}</span>
//           </>
//         )}

//         {ingredient?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Key Ingredient</p>
//               <button 
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('ingredient'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <div>
//               {ingredient.map((ing, i) => (
//                 <span key={i} style={tagStyle}>{ing.charAt(0).toUpperCase() + ing.slice(1)}</span>
//               ))}
//             </div>
//           </>
//         )}

//         {budget && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Budget</p>
//               <button 
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('budget'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <span style={tagStyle}>
//               {budget === 'under500'    ? 'Under Rs 500'      :
//                budget === '500to1000'  ? 'Rs 500 – Rs 1000'  :
//                budget === '1000to2000' ? 'Rs 1000 – Rs 2000' :
//                budget === 'above2000'  ? 'Rs 2000+'           : budget}
//             </span>
//           </>
//         )}

//         {answers?.length > 0 && (
//           <>
//             <p style={{ ...sectionLabel, marginTop: 24 }}>Your Answers</p>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {answers.map((ans, i) => (
//                 <div
//                   key={ans._id || i}
//                   style={{
//                     display: 'flex', flexDirection: 'column',
//                     justifyContent: 'space-between', alignItems: 'start',
//                     padding: '8px 12px', background: '#f9fafb',
//                     borderRadius: 8, border: '1px solid #e5e7eb',
//                   }}
//                 >
//                   <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     <span style={{ fontSize: 12, color: '#6b7280' }}>
//                       {ans.questionText || ans.mappingField}
//                     </span>
//                     {/* 🆕 NEW: Edit button for each individual answer */}
//                     <button 
//                       onClick={() => onEditQuestion(ans.questionId)}
//                       style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//                     >
//                       <Edit2 size={14} />
//                     </button>
//                   </div>
//                   <div className="mt-2 mb-2">
//                     <span style={{
//                       fontSize: 12, fontWeight: 700, color: '#1f2937',
//                       background: '#e5e7eb', padding: '2px 10px 5px 10px', borderRadius: 12,
//                     }}>
//                       {ans.value}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       <div className="j-panel-cta-area">
//         <button className="j-quiz-btn page-title-main-name" onClick={onNextFromProfile}>
//           Next
//         </button>
//       </div>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    SIDE PANEL (updated to pass onEditQuestion)
// ───────────────────────────────────────────── */
// function SidePanel({
//   isOpen, isClosing, onClose,
//   showQuizContent, quizData, loading, error,
//   currentQuestionIndex, selectedAnswers, expandedOption,
//   onOptionSelect, onToggleExpand,
//   onPrevQuestion, onSubmitQuiz,
//   onStartQuiz,
//   profileData, profileLoading, showProfile,
//   onNextFromProfile,
//   onEditQuestion  // 🆕 NEW: callback for editing
// }) {
//   if (!isOpen) return null;

//   const currentQuestion = quizData?.[currentQuestionIndex];

//   return (
//     <>
//       <div className="j-backdrop" onClick={onClose} />

//       <div className={`j-panel${isClosing ? ' closing' : ''}`}>
//         <div className="j-panel-header">
//           <h2 className="j-panel-title page-title-main-name">For You</h2>
//           <button className="j-panel-close page-title-main-name" onClick={onClose}>
//             <X size={22} />
//           </button>
//         </div>

//         {/* ── PROFILE RESULT MODE (with edit) ── */}
//         {showProfile ? (
//           profileLoading ? (
//             <div className="j-panel-body page-title-main-name">
//               <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                 <p style={{ fontSize: 14, color: '#6b7280' }}>Building your profile...</p>
//               </div>
//             </div>
//           ) : (
//             <ProfileResult 
//               profileData={profileData} 
//               onNextFromProfile={onNextFromProfile}
//               onEditQuestion={onEditQuestion}  // 🆕 NEW
//             />
//           )
//         ) : (
//           /* ── QUIZ / INTRO MODE (unchanged) ── */
//           <>
//             <div className="j-panel-body page-title-main-name">
//               {loading ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                   <p style={{ fontSize: 14, color: '#6b7280' }}>Loading...</p>
//                 </div>
//               ) : error ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                   <p style={{ fontSize: 14, color: '#ef4444' }}>{error}</p>
//                 </div>
//               ) : showQuizContent && quizData ? (
//                 <>
//                   <div style={{ marginBottom: 20 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>
//                         Question {currentQuestionIndex + 1} of {quizData.length}
//                       </span>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>
//                         {Math.round(((currentQuestionIndex + 1) / quizData.length) * 100)}%
//                       </span>
//                     </div>
//                     <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2 }}>
//                       <div style={{
//                         height: '100%', width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`,
//                         background: '#1f2937', borderRadius: 2, transition: 'width 0.4s ease',
//                       }} />
//                     </div>
//                   </div>

//                   <p className="j-panel-eyebrow" style={{ marginBottom: 8 }}>SKINCARE QUIZ</p>
//                   <h3 className="j-panel-heading fs-6" style={{ marginBottom: 12 }}>
//                     {currentQuestion?.questionText}
//                   </h3>

//                   {currentQuestion?.description && (
//                     <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
//                       {currentQuestion.description}
//                     </p>
//                   )}

//                   <div style={{ marginBottom: 24 }}>
//                     {currentQuestion?.options.map((option) => {
//                       const isSelected = selectedAnswers[currentQuestion._id] === option.value;
//                       const isExpanded = expandedOption === option._id;

//                       return (
//                         <div
//                           key={option._id}
//                           style={{
//                             marginBottom: 12, border: `2px solid ${isSelected ? '#1f2937' : '#e5e7eb'}`,
//                             borderRadius: 8, background: isSelected ? '#f9fafb' : 'white', overflow: 'hidden',
//                           }}
//                         >
//                           <div
//                             onClick={() => onToggleExpand(option._id)}
//                             style={{
//                               padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center',
//                               justifyContent: 'space-between', background: isExpanded ? '#f3f4f6' : 'transparent',
//                             }}
//                           >
//                             <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
//                               <div
//                                 onClick={(e) => { e.stopPropagation(); onOptionSelect(currentQuestion._id, option.value); }}
//                                 style={{
//                                   width: 20, height: 20, borderRadius: '50%',
//                                   border: `2px solid ${isSelected ? '#1f2937' : '#d1d5db'}`, background: isSelected ? '#1f2937' : 'white',
//                                   display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
//                                 }}
//                               >
//                                 {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
//                               </div>
//                               <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#374151' }}>
//                                 {option.label}
//                               </h5>
//                             </div>
//                             {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                           </div>

//                           {isExpanded && (
//                             <div style={{ padding: '0 16px 16px 48px' }}>
//                               <p style={{ fontSize: 13, color: '#6b7280', margin: '12px 0 0 0', lineHeight: 1.5 }}>{option.subtext}</p>
//                               {!isSelected ? (
//                                 <button
//                                   onClick={() => onOptionSelect(currentQuestion._id, option.value)}
//                                   style={{
//                                     marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#1f2937',
//                                     background: 'transparent', border: '1px solid #1f2937', borderRadius: 6, cursor: 'pointer',
//                                   }}
//                                 >
//                                   Select This Option
//                                 </button>
//                               ) : (
//                                 <div style={{
//                                   marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: 'white',
//                                   background: '#1f2937', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 8,
//                                 }}>
//                                   <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
//                                   Selected
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
//                     <button
//                       onClick={onPrevQuestion}
//                       disabled={currentQuestionIndex === 0}
//                       style={{
//                         display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'transparent',
//                         border: 'none', color: currentQuestionIndex === 0 ? '#9ca3af' : '#374151',
//                         cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQuestionIndex === 0 ? 0.5 : 1,
//                       }}
//                     >
//                       <ChevronLeft size={18} /> Previous
//                     </button>
//                     <button
//                       onClick={() => onSubmitQuiz(currentQuestionIndex === quizData.length - 1)}
//                       disabled={!selectedAnswers[currentQuestion?._id]}
//                       style={{
//                         padding: '10px 24px', background: selectedAnswers[currentQuestion?._id] ? '#1f2937' : '#9ca3af',
//                         color: 'white', border: 'none', borderRadius: 6, fontWeight: 600,
//                         cursor: selectedAnswers[currentQuestion?._id] ? 'pointer' : 'not-allowed',
//                       }}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <p className="j-panel-eyebrow">FOR YOU</p>
//                   <h3 className="j-panel-heading page-title-main-name fs-6">Your Tailored Shopping Experience</h3>
//                   <div className="j-collage">
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face1/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face2/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face3/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face4/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face5/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face6/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face7/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                   </div>
//                   <h4 className="page-title-main-name" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>Let's Get Personal</h4>
//                   <p className="page-title-main-name" style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Answer these questions to unlock a customised Joyory Experience, Just For You</p>
//                 </>
//               )}
//             </div>

//             {!showQuizContent && (
//               <div className="j-panel-cta-area">
//                 <button className="j-quiz-btn page-title-main-name" onClick={onStartQuiz}>Take The Quiz</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       <style>{`
//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-10px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    HOME PAGE
// ───────────────────────────────────────────── */
// function HomePage({
//   onOpenPanel, isPanelOpen, isClosing, onClosePanel,
//   showQuizContent, quizData, loading, error,
//   currentQuestionIndex, selectedAnswers, expandedOption,
//   onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz,
//   introData, introLoading, onCategoryClick, onStartQuiz,
//   profileData, profileLoading, showProfile, onNextFromProfile,
//   onEditQuestion  // 🆕 NEW
// }) {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)' }}>
//       <Header />
//       <main style={{ position: 'relative' }}>
//         <div className="py-5 text-center container-lg">
//           <div className="mb-5 j-reveal">
//             <h2 className="j-hero-title-pre"><em>Not Sure</em>,</h2>
//             <h3 className="j-hero-title-main">
//               Where to Start? <span className="j-hero-title-light">Let's Help</span>
//             </h3>
//           </div>

//           <Row className="justify-content-center g-5">
//             {introLoading ? (
//               <Col xs={12} className="text-center">
//                 <p style={{ color: '#6b7280', fontSize: 14 }}>Loading categories...</p>
//               </Col>
//             ) : introData?.length > 0 ? (
//               introData.map((item) => (
//                 <Col key={item._id} md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick(item.title)}>
//                     <div className="j-cat-img-wrap">
//                       <img src={item.image} alt={item.title} referrerPolicy="no-referrer" />
//                     </div>
//                     <h4 className="j-cat-label">{item.title}</h4>
//                   </div>
//                 </Col>
//               ))
//             ) : (
//               <>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Makeup')}>
//                     <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/makeup-main/800/1000" alt="Makeup" referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">Makeup</h4>
//                   </div>
//                 </Col>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Skincare')}>
//                     <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/skincare-main/800/1000" alt="Skincare" referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">Skincare</h4>
//                   </div>
//                 </Col>
//               </>
//             )}
//           </Row>
//         </div>

//         <SidePanel
//           isOpen={isPanelOpen} isClosing={isClosing} onClose={onClosePanel}
//           showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
//           currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
//           onOptionSelect={onOptionSelect} onToggleExpand={onToggleExpand} onPrevQuestion={onPrevQuestion}
//           onSubmitQuiz={onSubmitQuiz} onStartQuiz={onStartQuiz} profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
//           onNextFromProfile={onNextFromProfile}
//           onEditQuestion={onEditQuestion}  // 🆕 NEW
//         />

//         {!isPanelOpen && <button className="j-float-btn" onClick={onOpenPanel}>Personalize</button>}
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    ROOT COMPONENT
// ───────────────────────────────────────────── */
// export default function Foryoulanding() {
//   const navigate = useNavigate();

//   // 🔥 Flow States: 'home' -> 'thankyou' -> 'recommendations'
//   const [view, setView]                                 = useState('home');
//   const [isPanelOpen, setIsPanelOpen]                   = useState(false);
//   const [isClosing, setIsClosing]                       = useState(false);
//   const [showQuizContent, setShowQuizContent]           = useState(false);
//   const [quizData, setQuizData]                         = useState(null);
//   const [loading, setLoading]                           = useState(false);
//   const [error, setError]                               = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers]           = useState({});
//   const [expandedOption, setExpandedOption]             = useState(null);
//   const [introData, setIntroData]                       = useState([]);
//   const [introLoading, setIntroLoading]                 = useState(true);

//   const [profileData, setProfileData]     = useState(null);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [showProfile, setShowProfile]     = useState(false);

//   // 🆕 NEW: State to track initial loading while checking quiz status
//   const [initialLoading, setInitialLoading] = useState(true);

//   /* 🆕 NEW: On mount, check if user already has a skincare profile (i.e., took the quiz) */
//   useEffect(() => {
//     const checkQuizCompletion = async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', {
//           credentials: 'include',
//         });
//         const json = await res.json();
//         if (json.success && json.data) {
//           // User has already taken the quiz → go directly to recommendations
//           setView('recommendations');
//         }
//         // If no profile, stay on 'home' (already default)
//       } catch (error) {
//         console.error('Error checking quiz status:', error);
//         // On error, just stay on home (fallback)
//       } finally {
//         setInitialLoading(false);
//       }
//     };
//     checkQuizCompletion();
//   }, []);

//   /* Fetch intro categories on mount */
//   useEffect(() => {
//     (async () => {
//       try {
//         const res  = await fetch('https://beauty.joyory.com/api/user/for-you/intro');
//         const json = await res.json();
//         if (json.success && Array.isArray(json.data)) {
//           setIntroData(json.data.sort((a, b) => a.displayOrder - b.displayOrder));
//         }
//       } catch (e) {
//         console.error('Failed to load intro data', e);
//       } finally {
//         setIntroLoading(false);
//       }
//     })();
//   }, []);

//   /* 🔥 Handle Thank You Screen Redirect 🔥 */
//   useEffect(() => {
//     if (view === 'thankyou') {
//       // 3 seconds timer before transitioning to recommendations page
//       const timer = setTimeout(() => {
//         setView('recommendations');
//       }, 3000); 
//       return () => clearTimeout(timer);
//     }
//   }, [view]);

//   /* Fetch skincare quiz questions */
//   const fetchQuizData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res  = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/questions');
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const sorted = json.data.sort((a, b) => a.displayOrder - b.displayOrder);
//         setQuizData(sorted);
//         setCurrentQuestionIndex(0);
//         if (sorted.length > 0 && sorted[0].options?.length > 0) {
//           const q = sorted[0]; const opt = q.options[0];
//           setSelectedAnswers({ [q._id]: opt.value });
//           setExpandedOption(opt._id);
//         }
//       } else {
//         setError('Failed to load questions');
//       }
//     } catch (e) {
//       setError('Error loading quiz'); console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── Submit: POST answers → then GET profile to display ── */
//   const handleSubmitQuiz = async (isFinalStep = true) => {
//     if (!quizData) return;

//     const answersPayload = quizData.map((question) => {
//       const selectedValue  = selectedAnswers[question._id];
//       const selectedOption = question.options.find((o) => o.value === selectedValue);
//       return {
//         questionId:   question._id,
//         questionText: question.questionText || '',
//         mappingField: selectedOption?.mappingField || '',
//         value:        selectedValue || '',
//         label:        selectedOption?.label   || '',
//         subtext:      selectedOption?.subtext || '',
//       };
//     }).filter((a) => a.value);

//     if (!isFinalStep) {
//       fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', {
//         method:      'POST',
//         headers:     { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body:        JSON.stringify({ answers: answersPayload }),
//       }).catch((e) => console.error('Background save error:', e));

//       const next = currentQuestionIndex + 1;
//       setCurrentQuestionIndex(next);
//       const q = quizData[next];
//       if (q && !selectedAnswers[q._id] && q.options?.length > 0) {
//         const first = q.options[0];
//         setSelectedAnswers((prev) => ({ ...prev, [q._id]: first.value }));
//         setExpandedOption(first._id);
//       }
//       return;
//     }

//     setShowQuizContent(false);
//     setShowProfile(true);
//     setProfileLoading(true);

//     try {
//       const submitRes  = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', {
//         method:      'POST',
//         headers:     { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body:        JSON.stringify({ answers: answersPayload }),
//       });
//       const submitJson = await submitRes.json();

//       if (!submitJson.success) throw new Error("Submit failed");

//       const profileRes = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', {
//         credentials: 'include',
//       });
//       const profileJson = await profileRes.json();

//       if (profileJson.success && profileJson.data) {
//         setProfileData(profileJson.data);
//       } else {
//         throw new Error("Profile fetch failed");
//       }
//     } catch (e) {
//       console.error('Submit/Profile Error:', e);
//       // No fallbacks based on your instructions
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handleCategoryClick = (category) => {
//     const lower = category.toLowerCase();
//     if (lower.includes('makeup')) {
//       navigate('/makeupquiz');
//     } else {
//       setIsPanelOpen(true);
//       setShowQuizContent(false);
//       setShowProfile(false);
//     }
//   };

//   const handleStartQuiz = () => {
//     setShowQuizContent(true);
//     setShowProfile(false);
//     fetchQuizData();
//   };

//   const handleOptionSelect = (qId, value) => {
//     setSelectedAnswers((prev) => ({ ...prev, [qId]: value }));
//   };

//   const handleToggleExpand = (optId) => {
//     setExpandedOption((prev) => (prev === optId ? null : optId));
//   };

//   const handlePrevQuestion = () => {
//     if (currentQuestionIndex <= 0) return;
//     setCurrentQuestionIndex(currentQuestionIndex - 1);
//   };

//   const closePanel = () => {
//     setIsClosing(true);
//     setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); }, 280);
//   };

//   const openPanel = () => {
//     setIsPanelOpen(true);
//     setShowQuizContent(false);
//     setShowProfile(false);
//   };

//   const handleClosePanel = () => {
//     closePanel();
//     setTimeout(() => {
//       // 🆕 MODIFIED: Do not clear quizData and profileData when closing panel
//       // so they are available for editing later.
//       setShowQuizContent(false);
//       setShowProfile(false);
//       // We keep quizData and profileData intact.
//     }, 350);
//   };

//   /* 🔥 Handle Click "Next" on the Profile Result Panel 🔥 */
//   const handleNextFromProfile = () => {
//     // 1. Trigger panel close animation
//     setIsClosing(true);
//     setTimeout(() => {
//       // 2. Hide panel and move to 'thankyou' view
//       setIsPanelOpen(false);
//       setIsClosing(false);
//       setView('thankyou');

//       // Cleanup only UI states, keep quizData and profileData
//       setShowQuizContent(false);
//       setShowProfile(false);
//       // Do NOT clear quizData or profileData
//     }, 280);
//   };

//   // 🆕 NEW: Handle editing a specific question from the profile view
//   const handleEditQuestion = async (questionId) => {
//     // If quizData is not loaded, fetch it first
//     if (!quizData) {
//       await fetchQuizData();
//     }
//     // Find the index of the question with the given ID
//     const index = quizData.findIndex(q => q._id === questionId);
//     if (index !== -1) {
//       // If we are not already on home view, switch to home
//       if (view !== 'home') {
//         setView('home');
//       }
//       // Ensure panel is open in quiz mode
//       setIsPanelOpen(true);
//       setShowQuizContent(true);
//       setShowProfile(false);
//       setCurrentQuestionIndex(index);
//       // Pre-select the answer from profileData
//       if (profileData && profileData.answers) {
//         const answer = profileData.answers.find(a => a.questionId === questionId);
//         if (answer) {
//           setSelectedAnswers(prev => ({ ...prev, [questionId]: answer.value }));
//         }
//       }
//     }
//   };

//   // 🆕 NEW: Handle banner click on recommendations page
//   const handleBannerClick = async () => {
//     // Switch to home view
//     setView('home');
//     // Fetch latest profile data if not already present
//     if (!profileData) {
//       setProfileLoading(true);
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', {
//           credentials: 'include',
//         });
//         const json = await res.json();
//         if (json.success && json.data) {
//           setProfileData(json.data);
//         }
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       } finally {
//         setProfileLoading(false);
//       }
//     }
//     // Open panel in profile mode
//     setIsPanelOpen(true);
//     setShowProfile(true);
//     setShowQuizContent(false);
//   };

//   // 🆕 NEW: Show a loading spinner while checking initial quiz status
//   if (initialLoading) {
//     return (
//       <div style={{ minHeight: '100vh', background: 'var(--j-cream)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         <div className="text-center">
//           <div className="spinner-border text-dark mb-3" role="status"></div>
//           <p className="text-muted">Checking your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {view === 'thankyou' ? (
//         <ThankYouPage />
//       ) : view === 'recommendations' ? (
//         <RecommendationsPage 
//           onBack={() => setView('home')} 
//           onBannerClick={handleBannerClick}   // 🆕 NEW
//         />
//       ) : view === 'products' ? (
//         <ProductsPage onBack={() => setView('home')} />
//       ) : (
//         <HomePage
//           onOpenPanel={openPanel}
//           isPanelOpen={isPanelOpen}
//           isClosing={isClosing}
//           onClosePanel={handleClosePanel}
//           showQuizContent={showQuizContent}
//           quizData={quizData}
//           loading={loading}
//           error={error}
//           currentQuestionIndex={currentQuestionIndex}
//           selectedAnswers={selectedAnswers}
//           expandedOption={expandedOption}
//           onOptionSelect={handleOptionSelect}
//           onToggleExpand={handleToggleExpand}
//           onPrevQuestion={handlePrevQuestion}
//           onSubmitQuiz={handleSubmitQuiz}
//           introData={introData}
//           introLoading={introLoading}
//           onCategoryClick={handleCategoryClick}
//           onStartQuiz={handleStartQuiz}
//           profileData={profileData}
//           profileLoading={profileLoading}
//           showProfile={showProfile}
//           onNextFromProfile={handleNextFromProfile}
//           onEditQuestion={handleEditQuestion}  // 🆕 NEW
//         />
//       )}
//     </>
//   );
// }






























// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
// import { Container, Row, Col } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/Foryoulanding.css';
// import Header from './Header';
// import Footer from './Footer';
// import Foyoulanding from "../assets/Foyoulanding.jpg";

// /* ─────────────────────────────────────────────
//    RECOMMENDATIONS PAGE (with clickable banner)
// ───────────────────────────────────────────── */
// function RecommendationsPage({ onBack, onBannerClick }) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/recommendations/personal-summary', {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include'
//         });
//         const json = await res.json();
//         if (json.success) {
//           setData(json);
//         }
//       } catch (error) {
//         console.error('Error fetching recommendations:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRecommendations();
//   }, []);

//   if (loading) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
//         <Header />
//         <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
//           <div className="spinner-border text-dark mb-3" role="status"></div>
//           <p className="text-muted">Loading your personalized catalog...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff' }}>
//         <Header />
//         <Container className="py-5 text-center">
//           <h3>No recommendations found right now.</h3>
//           <button className="j-back-link mt-4" onClick={onBack}>Back to Home</button>
//         </Container>
//         <Footer />
//       </div>
//     );
//   }

//   // Extract banner from sections array (key === 'banner')
//   const bannerSection = data.sections?.find(s => s.key === 'banner');

//   // Filter out the banner section from product sections
//   const productSections = data.sections?.filter(s => s.key !== 'banner') || [];

//   return (
//     <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--j-font-sans)' }}>
//       <Header />
//       <Container className="py-5">

//         {/* 
//           BANNER FIX: Always show the local banner image.
//           Previously this was conditional on data.banner?.image?.[0]?.url
//           which was undefined because banner lives inside data.sections[], not data.banner.
//           Now we always render it (and also check bannerSection as a fallback).
//         */}
//         <div
//           className="mb-5 text-center mt-5 pt-3"
//           style={{ cursor: 'pointer' }}
//           onClick={onBannerClick}
//         >
//           <img
//             src={Foyoulanding}
//             alt="Personalize Your Experience"
//             className="img-fluid mt-5"
//             style={{ maxHeight: 'auto', width: '100%' }}
//           />
//         </div>

//         {/* Dynamic Sections & Products */}
//         {productSections.map((section) => {
//           if (!section.products || section.products.length === 0) return null;

//           return (
//             <div key={section.key} className="mb-5">
//               <h4 className="fw-bold mb-4" style={{ color: '#1f2937' }}>{section.title}</h4>
//               <Row className="g-4">
//                 {section.products.map((product) => {
//                   const imgUrl =
//                     product.selectedVariant?.images?.[0] ||
//                     product.images?.[0] ||
//                     'https://via.placeholder.com/600x800';
//                   const price = product.selectedVariant?.displayPrice || product.price;
//                   const brandName = product.brand?.name || 'Joyory';

//                   return (
//                     <Col key={product._id} xs={12} sm={6} lg={3}>
//                       <div className="j-product-card">
//                         <div className="j-product-img-wrap">
//                           <img
//                             src={imgUrl}
//                             alt={product.name}
//                             referrerPolicy="no-referrer"
//                           />
//                         </div>
//                         <p className="j-product-brand">{brandName}</p>
//                         <h3 className="j-product-name">{product.name}</h3>
//                         <p className="j-product-price">Rs {price}</p>
//                       </div>
//                     </Col>
//                   );
//                 })}
//               </Row>
//             </div>
//           );
//         })}

//         <div className="mt-5 text-center">
//           <button className="j-back-link" onClick={onBack}>Back to Home</button>
//         </div>
//       </Container>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    THANK YOU PAGE
// ───────────────────────────────────────────── */
// function ThankYouPage() {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)', display: 'flex', flexDirection: 'column' }}>
//       <Header />
//       <main className="flex-grow-1 d-flex justify-content-center align-items-center">
//         <div className="text-center j-reveal">
//           <h2 className="j-hero-title-main mb-3">Thank You!</h2>
//           <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
//             We are curating your personalized beauty recommendations...
//           </p>
//           <div className="spinner-border mt-4" style={{ color: '#1f2937', width: '3rem', height: '3rem' }} />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    PROFILE RESULT VIEW
// ───────────────────────────────────────────── */
// function ProfileResult({ profileData, onNextFromProfile, onEditQuestion }) {
//   if (!profileData) return null;

//   const { answers, skinType, concern, ingredient, productType, budget, formulation } = profileData;

//   const tagStyle = {
//     display: 'inline-block', padding: '4px 12px', borderRadius: 20,
//     background: '#f3f4f6', color: '#374151', fontSize: 12, fontWeight: 600,
//     marginRight: 6, marginBottom: 6, border: '1px solid #e5e7eb',
//   };

//   const sectionLabel = {
//     fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em',
//     textTransform: 'uppercase', marginBottom: 8, marginTop: 16,
//   };

//   const findQuestionIdByMappingField = (field) => {
//     const answer = answers.find(a => a.mappingField === field);
//     return answer?.questionId;
//   };

//   return (
//     <>
//       <div className="j-panel-body page-title-main-name">
//         <p className="j-panel-eyebrow">YOUR PROFILE</p>
//         <h3 className="j-panel-heading page-title-main-name fs-6" style={{ marginBottom: 4 }}>
//           Here's What We Know About You
//         </h3>
//         <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>
//           Based on your answers, we've built your personalised skincare profile.
//         </p>

//         {skinType && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Skin Type</p>
//               <button
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('skinType'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <span style={{ ...tagStyle, background: '#1f2937', color: 'white', border: 'none' }}>
//               {skinType.charAt(0).toUpperCase() + skinType.slice(1)}
//             </span>
//           </>
//         )}

//         {concern?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Skin Concern</p>
//               <button
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('concern'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <div>
//               {concern.map((c, i) => (
//                 <span key={i} style={tagStyle}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
//               ))}
//             </div>
//           </>
//         )}

//         {productType?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Looking For</p>
//               <button
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('productType'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <div>
//               {productType.map((p, i) => (
//                 <span key={i} style={tagStyle}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
//               ))}
//             </div>
//           </>
//         )}

//         {formulation && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Formulation</p>
//               <button
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('formulation'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <span style={tagStyle}>{formulation.charAt(0).toUpperCase() + formulation.slice(1)}</span>
//           </>
//         )}

//         {ingredient?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Key Ingredient</p>
//               <button
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('ingredient'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <div>
//               {ingredient.map((ing, i) => (
//                 <span key={i} style={tagStyle}>{ing.charAt(0).toUpperCase() + ing.slice(1)}</span>
//               ))}
//             </div>
//           </>
//         )}

//         {budget && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <p style={sectionLabel}>Budget</p>
//               <button
//                 onClick={() => onEditQuestion(findQuestionIdByMappingField('budget'))}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//               >
//                 <Edit2 size={14} />
//               </button>
//             </div>
//             <span style={tagStyle}>
//               {budget === 'under500'    ? 'Under Rs 500'      :
//                budget === '500to1000'  ? 'Rs 500 – Rs 1000'  :
//                budget === '1000to2000' ? 'Rs 1000 – Rs 2000' :
//                budget === 'above2000'  ? 'Rs 2000+'           : budget}
//             </span>
//           </>
//         )}

//         {answers?.length > 0 && (
//           <>
//             <p style={{ ...sectionLabel, marginTop: 24 }}>Your Answers</p>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {answers.map((ans, i) => (
//                 <div
//                   key={ans._id || i}
//                   style={{
//                     display: 'flex', flexDirection: 'column',
//                     justifyContent: 'space-between', alignItems: 'start',
//                     padding: '8px 12px', background: '#f9fafb',
//                     borderRadius: 8, border: '1px solid #e5e7eb',
//                   }}
//                 >
//                   <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     <span style={{ fontSize: 12, color: '#6b7280' }}>
//                       {ans.questionText || ans.mappingField}
//                     </span>
//                     <button
//                       onClick={() => onEditQuestion(ans.questionId)}
//                       style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}
//                     >
//                       <Edit2 size={14} />
//                     </button>
//                   </div>
//                   <div className="mt-2 mb-2">
//                     <span style={{
//                       fontSize: 12, fontWeight: 700, color: '#1f2937',
//                       background: '#e5e7eb', padding: '2px 10px 5px 10px', borderRadius: 12,
//                     }}>
//                       {ans.value}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       <div className="j-panel-cta-area">
//         <button className="j-quiz-btn page-title-main-name" onClick={onNextFromProfile}>
//           Next
//         </button>
//       </div>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    SIDE PANEL
// ───────────────────────────────────────────── */
// function SidePanel({
//   isOpen, isClosing, onClose,
//   showQuizContent, quizData, loading, error,
//   currentQuestionIndex, selectedAnswers, expandedOption,
//   onOptionSelect, onToggleExpand,
//   onPrevQuestion, onSubmitQuiz,
//   onStartQuiz,
//   profileData, profileLoading, showProfile,
//   onNextFromProfile,
//   onEditQuestion
// }) {
//   if (!isOpen) return null;

//   const currentQuestion = quizData?.[currentQuestionIndex];

//   return (
//     <>
//       <div className="j-backdrop" onClick={onClose} />

//       <div className={`j-panel${isClosing ? ' closing' : ''}`}>
//         <div className="j-panel-header">
//           <h2 className="j-panel-title page-title-main-name">For You</h2>
//           <button className="j-panel-close page-title-main-name" onClick={onClose}>
//             <X size={22} />
//           </button>
//         </div>

//         {showProfile ? (
//           profileLoading ? (
//             <div className="j-panel-body page-title-main-name">
//               <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                 <p style={{ fontSize: 14, color: '#6b7280' }}>Building your profile...</p>
//               </div>
//             </div>
//           ) : (
//             <ProfileResult
//               profileData={profileData}
//               onNextFromProfile={onNextFromProfile}
//               onEditQuestion={onEditQuestion}
//             />
//           )
//         ) : (
//           <>
//             <div className="j-panel-body page-title-main-name">
//               {loading ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                   <p style={{ fontSize: 14, color: '#6b7280' }}>Loading...</p>
//                 </div>
//               ) : error ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                   <p style={{ fontSize: 14, color: '#ef4444' }}>{error}</p>
//                 </div>
//               ) : showQuizContent && quizData ? (
//                 <>
//                   <div style={{ marginBottom: 20 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>
//                         Question {currentQuestionIndex + 1} of {quizData.length}
//                       </span>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>
//                         {Math.round(((currentQuestionIndex + 1) / quizData.length) * 100)}%
//                       </span>
//                     </div>
//                     <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2 }}>
//                       <div style={{
//                         height: '100%', width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`,
//                         background: '#1f2937', borderRadius: 2, transition: 'width 0.4s ease',
//                       }} />
//                     </div>
//                   </div>

//                   <p className="j-panel-eyebrow" style={{ marginBottom: 8 }}>SKINCARE QUIZ</p>
//                   <h3 className="j-panel-heading fs-6" style={{ marginBottom: 12 }}>
//                     {currentQuestion?.questionText}
//                   </h3>

//                   {currentQuestion?.description && (
//                     <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
//                       {currentQuestion.description}
//                     </p>
//                   )}

//                   <div style={{ marginBottom: 24 }}>
//                     {currentQuestion?.options.map((option) => {
//                       const isSelected = selectedAnswers[currentQuestion._id] === option.value;
//                       const isExpanded = expandedOption === option._id;

//                       return (
//                         <div
//                           key={option._id}
//                           style={{
//                             marginBottom: 12, border: `2px solid ${isSelected ? '#1f2937' : '#e5e7eb'}`,
//                             borderRadius: 8, background: isSelected ? '#f9fafb' : 'white', overflow: 'hidden',
//                           }}
//                         >
//                           <div
//                             onClick={() => onToggleExpand(option._id)}
//                             style={{
//                               padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center',
//                               justifyContent: 'space-between', background: isExpanded ? '#f3f4f6' : 'transparent',
//                             }}
//                           >
//                             <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
//                               <div
//                                 onClick={(e) => { e.stopPropagation(); onOptionSelect(currentQuestion._id, option.value); }}
//                                 style={{
//                                   width: 20, height: 20, borderRadius: '50%',
//                                   border: `2px solid ${isSelected ? '#1f2937' : '#d1d5db'}`,
//                                   background: isSelected ? '#1f2937' : 'white',
//                                   display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
//                                 }}
//                               >
//                                 {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
//                               </div>
//                               <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#374151' }}>
//                                 {option.label}
//                               </h5>
//                             </div>
//                             {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                           </div>

//                           {isExpanded && (
//                             <div style={{ padding: '0 16px 16px 48px' }}>
//                               <p style={{ fontSize: 13, color: '#6b7280', margin: '12px 0 0 0', lineHeight: 1.5 }}>
//                                 {option.subtext}
//                               </p>
//                               {!isSelected ? (
//                                 <button
//                                   onClick={() => onOptionSelect(currentQuestion._id, option.value)}
//                                   style={{
//                                     marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600,
//                                     color: '#1f2937', background: 'transparent', border: '1px solid #1f2937',
//                                     borderRadius: 6, cursor: 'pointer',
//                                   }}
//                                 >
//                                   Select This Option
//                                 </button>
//                               ) : (
//                                 <div style={{
//                                   marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600,
//                                   color: 'white', background: '#1f2937', borderRadius: 6,
//                                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                                 }}>
//                                   <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
//                                   Selected
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
//                     <button
//                       onClick={onPrevQuestion}
//                       disabled={currentQuestionIndex === 0}
//                       style={{
//                         display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
//                         background: 'transparent', border: 'none',
//                         color: currentQuestionIndex === 0 ? '#9ca3af' : '#374151',
//                         cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
//                         opacity: currentQuestionIndex === 0 ? 0.5 : 1,
//                       }}
//                     >
//                       <ChevronLeft size={18} /> Previous
//                     </button>
//                     <button
//                       onClick={() => onSubmitQuiz(currentQuestionIndex === quizData.length - 1)}
//                       disabled={!selectedAnswers[currentQuestion?._id]}
//                       style={{
//                         padding: '10px 24px',
//                         background: selectedAnswers[currentQuestion?._id] ? '#1f2937' : '#9ca3af',
//                         color: 'white', border: 'none', borderRadius: 6, fontWeight: 600,
//                         cursor: selectedAnswers[currentQuestion?._id] ? 'pointer' : 'not-allowed',
//                       }}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <p className="j-panel-eyebrow">FOR YOU</p>
//                   <h3 className="j-panel-heading page-title-main-name fs-6">Your Tailored Shopping Experience</h3>
//                   <div className="j-collage">
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face1/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face2/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face3/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face4/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face5/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face6/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face7/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                   </div>
//                   <h4 className="page-title-main-name" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>
//                     Let's Get Personal
//                   </h4>
//                   <p className="page-title-main-name" style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>
//                     Answer these questions to unlock a customised Joyory Experience, Just For You
//                   </p>
//                 </>
//               )}
//             </div>

//             {!showQuizContent && (
//               <div className="j-panel-cta-area">
//                 <button className="j-quiz-btn page-title-main-name" onClick={onStartQuiz}>Take The Quiz</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       <style>{`
//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-10px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    HOME PAGE
// ───────────────────────────────────────────── */
// function HomePage({
//   onOpenPanel, isPanelOpen, isClosing, onClosePanel,
//   showQuizContent, quizData, loading, error,
//   currentQuestionIndex, selectedAnswers, expandedOption,
//   onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz,
//   introData, introLoading, onCategoryClick, onStartQuiz,
//   profileData, profileLoading, showProfile, onNextFromProfile,
//   onEditQuestion
// }) {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)' }}>
//       <Header />
//       <main style={{ position: 'relative' }}>
//         <div className="py-5 text-center container-lg">
//           <div className="mb-5 j-reveal">
//             <h2 className="j-hero-title-pre"><em>Not Sure</em>,</h2>
//             <h3 className="j-hero-title-main">
//               Where to Start? <span className="j-hero-title-light">Let's Help</span>
//             </h3>
//           </div>

//           <Row className="justify-content-center g-5">
//             {introLoading ? (
//               <Col xs={12} className="text-center">
//                 <p style={{ color: '#6b7280', fontSize: 14 }}>Loading categories...</p>
//               </Col>
//             ) : introData?.length > 0 ? (
//               introData.map((item) => (
//                 <Col key={item._id} md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick(item.title)}>
//                     <div className="j-cat-img-wrap">
//                       <img src={item.image} alt={item.title} referrerPolicy="no-referrer" />
//                     </div>
//                     <h4 className="j-cat-label">{item.title}</h4>
//                   </div>
//                 </Col>
//               ))
//             ) : (
//               <>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Makeup')}>
//                     <div className="j-cat-img-wrap">
//                       <img src="https://picsum.photos/seed/makeup-main/800/1000" alt="Makeup" referrerPolicy="no-referrer" />
//                     </div>
//                     <h4 className="j-cat-label">Makeup</h4>
//                   </div>
//                 </Col>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Skincare')}>
//                     <div className="j-cat-img-wrap">
//                       <img src="https://picsum.photos/seed/skincare-main/800/1000" alt="Skincare" referrerPolicy="no-referrer" />
//                     </div>
//                     <h4 className="j-cat-label">Skincare</h4>
//                   </div>
//                 </Col>
//               </>
//             )}
//           </Row>
//         </div>

//         <SidePanel
//           isOpen={isPanelOpen} isClosing={isClosing} onClose={onClosePanel}
//           showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
//           currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
//           onOptionSelect={onOptionSelect} onToggleExpand={onToggleExpand} onPrevQuestion={onPrevQuestion}
//           onSubmitQuiz={onSubmitQuiz} onStartQuiz={onStartQuiz}
//           profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
//           onNextFromProfile={onNextFromProfile}
//           onEditQuestion={onEditQuestion}
//         />

//         {!isPanelOpen && <button className="j-float-btn" onClick={onOpenPanel}>Personalize</button>}
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    ROOT COMPONENT
// ───────────────────────────────────────────── */
// export default function Foryoulanding() {
//   const navigate = useNavigate();

//   const [view, setView]                                 = useState('home');
//   const [isPanelOpen, setIsPanelOpen]                   = useState(false);
//   const [isClosing, setIsClosing]                       = useState(false);
//   const [showQuizContent, setShowQuizContent]           = useState(false);
//   const [quizData, setQuizData]                         = useState(null);
//   const [loading, setLoading]                           = useState(false);
//   const [error, setError]                               = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers]           = useState({});
//   const [expandedOption, setExpandedOption]             = useState(null);
//   const [introData, setIntroData]                       = useState([]);
//   const [introLoading, setIntroLoading]                 = useState(true);
//   const [profileData, setProfileData]                   = useState(null);
//   const [profileLoading, setProfileLoading]             = useState(false);
//   const [showProfile, setShowProfile]                   = useState(false);
//   const [initialLoading, setInitialLoading]             = useState(true);

//   /* On mount: check if user already has a profile → skip to recommendations */
//   useEffect(() => {
//     const checkQuizCompletion = async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', {
//           credentials: 'include',
//         });
//         const json = await res.json();
//         if (json.success && json.data) {
//           setView('recommendations');
//         }
//       } catch (error) {
//         console.error('Error checking quiz status:', error);
//       } finally {
//         setInitialLoading(false);
//       }
//     };
//     checkQuizCompletion();
//   }, []);

//   /* Fetch intro categories */
//   useEffect(() => {
//     (async () => {
//       try {
//         const res  = await fetch('https://beauty.joyory.com/api/user/for-you/intro');
//         const json = await res.json();
//         if (json.success && Array.isArray(json.data)) {
//           setIntroData(json.data.sort((a, b) => a.displayOrder - b.displayOrder));
//         }
//       } catch (e) {
//         console.error('Failed to load intro data', e);
//       } finally {
//         setIntroLoading(false);
//       }
//     })();
//   }, []);

//   /* Thank you screen auto-redirect */
//   useEffect(() => {
//     if (view === 'thankyou') {
//       const timer = setTimeout(() => {
//         setView('recommendations');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [view]);

//   /* Fetch quiz questions */
//   const fetchQuizData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res  = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/questions');
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const sorted = json.data.sort((a, b) => a.displayOrder - b.displayOrder);
//         setQuizData(sorted);
//         setCurrentQuestionIndex(0);
//         if (sorted.length > 0 && sorted[0].options?.length > 0) {
//           const q = sorted[0]; const opt = q.options[0];
//           setSelectedAnswers({ [q._id]: opt.value });
//           setExpandedOption(opt._id);
//         }
//       } else {
//         setError('Failed to load questions');
//       }
//     } catch (e) {
//       setError('Error loading quiz'); console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* Submit quiz */
//   const handleSubmitQuiz = async (isFinalStep = true) => {
//     if (!quizData) return;

//     const answersPayload = quizData.map((question) => {
//       const selectedValue  = selectedAnswers[question._id];
//       const selectedOption = question.options.find((o) => o.value === selectedValue);
//       return {
//         questionId:   question._id,
//         questionText: question.questionText || '',
//         mappingField: selectedOption?.mappingField || '',
//         value:        selectedValue || '',
//         label:        selectedOption?.label   || '',
//         subtext:      selectedOption?.subtext || '',
//       };
//     }).filter((a) => a.value);

//     if (!isFinalStep) {
//       fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', {
//         method:      'POST',
//         headers:     { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body:        JSON.stringify({ answers: answersPayload }),
//       }).catch((e) => console.error('Background save error:', e));

//       const next = currentQuestionIndex + 1;
//       setCurrentQuestionIndex(next);
//       const q = quizData[next];
//       if (q && !selectedAnswers[q._id] && q.options?.length > 0) {
//         const first = q.options[0];
//         setSelectedAnswers((prev) => ({ ...prev, [q._id]: first.value }));
//         setExpandedOption(first._id);
//       }
//       return;
//     }

//     setShowQuizContent(false);
//     setShowProfile(true);
//     setProfileLoading(true);

//     try {
//       const submitRes  = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', {
//         method:      'POST',
//         headers:     { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body:        JSON.stringify({ answers: answersPayload }),
//       });
//       const submitJson = await submitRes.json();
//       if (!submitJson.success) throw new Error('Submit failed');

//       const profileRes  = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', {
//         credentials: 'include',
//       });
//       const profileJson = await profileRes.json();
//       if (profileJson.success && profileJson.data) {
//         setProfileData(profileJson.data);
//       } else {
//         throw new Error('Profile fetch failed');
//       }
//     } catch (e) {
//       console.error('Submit/Profile Error:', e);
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handleCategoryClick = (category) => {
//     const lower = category.toLowerCase();
//     if (lower.includes('makeup')) {
//       navigate('/makeupquiz');
//     } else {
//       setIsPanelOpen(true);
//       setShowQuizContent(false);
//       setShowProfile(false);
//     }
//   };

//   const handleStartQuiz = () => {
//     setShowQuizContent(true);
//     setShowProfile(false);
//     fetchQuizData();
//   };

//   const handleOptionSelect = (qId, value) => {
//     setSelectedAnswers((prev) => ({ ...prev, [qId]: value }));
//   };

//   const handleToggleExpand = (optId) => {
//     setExpandedOption((prev) => (prev === optId ? null : optId));
//   };

//   const handlePrevQuestion = () => {
//     if (currentQuestionIndex <= 0) return;
//     setCurrentQuestionIndex(currentQuestionIndex - 1);
//   };

//   const closePanel = () => {
//     setIsClosing(true);
//     setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); }, 280);
//   };

//   const openPanel = () => {
//     setIsPanelOpen(true);
//     setShowQuizContent(false);
//     setShowProfile(false);
//   };

//   const handleClosePanel = () => {
//     closePanel();
//     setTimeout(() => {
//       setShowQuizContent(false);
//       setShowProfile(false);
//     }, 350);
//   };

//   const handleNextFromProfile = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setIsPanelOpen(false);
//       setIsClosing(false);
//       setView('thankyou');
//       setShowQuizContent(false);
//       setShowProfile(false);
//     }, 280);
//   };

//   const handleEditQuestion = async (questionId) => {
//     if (!quizData) {
//       await fetchQuizData();
//     }
//     const index = quizData?.findIndex(q => q._id === questionId);
//     if (index !== -1 && index !== undefined) {
//       if (view !== 'home') {
//         setView('home');
//       }
//       setIsPanelOpen(true);
//       setShowQuizContent(true);
//       setShowProfile(false);
//       setCurrentQuestionIndex(index);
//       if (profileData?.answers) {
//         const answer = profileData.answers.find(a => a.questionId === questionId);
//         if (answer) {
//           setSelectedAnswers(prev => ({ ...prev, [questionId]: answer.value }));
//         }
//       }
//     }
//   };

//   const handleBannerClick = async () => {
//     setView('home');
//     if (!profileData) {
//       setProfileLoading(true);
//       try {
//         const res  = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', {
//           credentials: 'include',
//         });
//         const json = await res.json();
//         if (json.success && json.data) {
//           setProfileData(json.data);
//         }
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       } finally {
//         setProfileLoading(false);
//       }
//     }
//     setIsPanelOpen(true);
//     setShowProfile(true);
//     setShowQuizContent(false);
//   };

//   if (initialLoading) {
//     return (
//       <div style={{ minHeight: '100vh', background: 'var(--j-cream)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         <div className="text-center">
//           <div className="spinner-border text-dark mb-3" role="status"></div>
//           <p className="text-muted">Checking your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {view === 'thankyou' ? (
//         <ThankYouPage />
//       ) : view === 'recommendations' ? (
//         <RecommendationsPage
//           onBack={() => setView('home')}
//           onBannerClick={handleBannerClick}
//         />
//       ) : (
//         <HomePage
//           onOpenPanel={openPanel}
//           isPanelOpen={isPanelOpen}
//           isClosing={isClosing}
//           onClosePanel={handleClosePanel}
//           showQuizContent={showQuizContent}
//           quizData={quizData}
//           loading={loading}
//           error={error}
//           currentQuestionIndex={currentQuestionIndex}
//           selectedAnswers={selectedAnswers}
//           expandedOption={expandedOption}
//           onOptionSelect={handleOptionSelect}
//           onToggleExpand={handleToggleExpand}
//           onPrevQuestion={handlePrevQuestion}
//           onSubmitQuiz={handleSubmitQuiz}
//           introData={introData}
//           introLoading={introLoading}
//           onCategoryClick={handleCategoryClick}
//           onStartQuiz={handleStartQuiz}
//           profileData={profileData}
//           profileLoading={profileLoading}
//           showProfile={showProfile}
//           onNextFromProfile={handleNextFromProfile}
//           onEditQuestion={handleEditQuestion}
//         />
//       )}
//     </>
//   );
// }


















// import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { X, ChevronLeft, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
// import { Container, Row, Col } from 'react-bootstrap';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/Foryoulanding.css';
// import '../css/Foryou.css';
// import Header from './Header';
// import Footer from './Footer';
// import FoyoulandingImg from '../assets/Foyoulanding.jpg';
// import axios from 'axios';
// import { CartContext } from '../context/CartContext';
// import { UserContext } from './UserContext.jsx';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import bagIcon from '../assets/bag.svg';
// import { FaChevronDown } from 'react-icons/fa';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';

// /* ─────────────────────────────────────────────
//    SHARED CONSTANTS & HELPERS
// ───────────────────────────────────────────── */
// const WISHLIST_CACHE_KEY = 'guestWishlist';
// const CART_API_BASE = 'https://beauty.joyory.com/api/user/cart';

// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== 'string') return false;
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
// };

// const getVariantDisplayText = (variant) =>
//   (variant?.shadeName || variant?.name || variant?.size || variant?.ml || variant?.weight || 'Default').toUpperCase();

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [] };
//   (variants || []).forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) grouped.color.push(v);
//     else grouped.text.push(v);
//   });
//   return grouped;
// };

// const formatPrice = (price) =>
//   new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(price || 0));

// /* ─────────────────────────────────────────────
//    PRODUCT CARD  (identical design to Foryou.jsx)
// ───────────────────────────────────────────── */
// function ProductCard({ product, navigate, location }) {
//   const { user } = useContext(UserContext);

//   const allVariants = useMemo(
//     () => product?.variants || product?.shadeOptions || [],
//     [product]
//   );

//   const [selectedVariant, setSelectedVariant] = useState(
//     () => product?.selectedVariant || allVariants[0] || {}
//   );
//   const [variantSelected, setVariantSelected]   = useState(false);
//   const [addingToCart, setAddingToCart]         = useState(false);
//   const [wishlistLoading, setWishlistLoading]   = useState(false);
//   const [wishlistData, setWishlistData]         = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState('all');

//   /* wishlist helpers */
//   const isInWishlist = useCallback(
//     (productId, sku) =>
//       wishlistData.some((i) => (i.productId === productId || i._id === productId) && i.sku === sku),
//     [wishlistData]
//   );

//   const fetchWishlistData = useCallback(async () => {
//     try {
//       if (user && !user.guest) {
//         const res = await axios.get('https://beauty.joyory.com/api/user/wishlist', { withCredentials: true });
//         if (res.data.success) setWishlistData(res.data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         setWishlistData(local.map((i) => ({ productId: i._id, _id: i._id, sku: i.sku })));
//       }
//     } catch { setWishlistData([]); }
//   }, [user]);

//   useEffect(() => { fetchWishlistData(); }, [fetchWishlistData]);

//   /* computed */
//   const displayPrice = parseFloat(
//     selectedVariant?.displayPrice || selectedVariant?.discountedPrice || selectedVariant?.price || product?.price || 0
//   );
//   const originalPrice = parseFloat(
//     selectedVariant?.originalPrice || selectedVariant?.mrp || product?.mrp || displayPrice
//   );
//   let discountPercent = parseFloat(selectedVariant?.discountPercent || product?.discountPercent || 0);
//   if (!discountPercent && originalPrice > displayPrice)
//     discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

//   const stock     = parseInt(selectedVariant?.stock || product?.stock || 0);
//   const outOfStock = stock <= 0;
//   const hasVariants = allVariants.length > 0;
//   const showSelectVariantBtn = hasVariants && !variantSelected;

//   const imageUrl =
//     selectedVariant?.images?.[0] || selectedVariant?.image ||
//     product?.selectedVariant?.images?.[0] || product?.images?.[0] ||
//     'https://placehold.co/400x300/ffffff/cccccc?text=Product';

//   const sku               = getSku(selectedVariant);
//   const productInWishlist = isInWishlist(product?._id, sku);
//   const groupedVariants   = groupVariantsByType(allVariants);

//   const getBrandName = () => {
//     if (!product?.brand) return 'Unknown Brand';
//     if (typeof product.brand === 'object' && product.brand.name) return product.brand.name;
//     return typeof product.brand === 'string' ? product.brand : 'Unknown Brand';
//   };

//   const getProductSlug = () =>
//     product?.slugs?.[0] || product?.slug || product?._id;

//   const showToast = (msg, type = 'error') =>
//     type === 'success' ? toast.success(msg, { autoClose: 3000 }) : toast.error(msg, { autoClose: 3000 });

//   /* actions */
//   const handleVariantSelect = (v) => { setSelectedVariant(v); setVariantSelected(true); setShowVariantOverlay(false); };

//   const handleAddToCart = async () => {
//     setAddingToCart(true);
//     try {
//       let payload;
//       if (hasVariants) {
//         if (!selectedVariant || outOfStock) { showToast('Please select an in-stock variant.'); return; }
//         payload = { productId: product._id, variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }] };
//       } else {
//         if (outOfStock) { showToast('Product is out of stock.'); return; }
//         payload = { productId: product._id, quantity: 1 };
//       }
//       const res = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!res.data.success) throw new Error(res.data.message || 'Failed');
//       showToast('Product added to cart!', 'success');
//       navigate('/cartpage');
//     } catch (err) {
//       showToast(err.response?.data?.message || err.message || 'Failed to add product');
//       if (err.response?.status === 401) navigate('/login', { state: { from: location?.pathname } });
//     } finally { setAddingToCart(false); }
//   };

//   const handleToggleWishlist = async (e) => {
//     e.stopPropagation();
//     if (!selectedVariant) { showToast('Please select a variant first'); return; }
//     setWishlistLoading(true);
//     try {
//       const inWl = isInWishlist(product._id, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${product._id}`, { withCredentials: true, data: { sku } });
//           showToast('Removed from wishlist!', 'success');
//         } else {
//           await axios.post(`https://beauty.joyory.com/api/user/wishlist/${product._id}`, { sku }, { withCredentials: true });
//           showToast('Added to wishlist!', 'success');
//         }
//         await fetchWishlistData();
//       } else {
//         const local = JSON.parse(localStorage.getItem('guestWishlist')) || [];
//         if (inWl) {
//           localStorage.setItem('guestWishlist', JSON.stringify(local.filter((i) => !(i._id === product._id && i.sku === sku))));
//           showToast('Removed from wishlist!', 'success');
//         } else {
//           local.push({ _id: product._id, name: product.name, sku, image: imageUrl, displayPrice, originalPrice });
//           localStorage.setItem('guestWishlist', JSON.stringify(local));
//           showToast('Added to wishlist!', 'success');
//         }
//         await fetchWishlistData();
//       }
//     } catch (err) {
//       if (err.response?.status === 401) { showToast('Please login to use wishlist'); navigate('/login'); }
//       else showToast('Failed to update wishlist');
//     } finally { setWishlistLoading(false); }
//   };

//   const buttonText = addingToCart ? 'Adding...' : showSelectVariantBtn ? 'Select Variant' : outOfStock ? 'Out of Stock' : 'Add to Bag';
//   const buttonDisabled = addingToCart || outOfStock;

//   return (
//     <div className="foryou-card-wrapper">
//       <div className="foryou-card">
//         {/* Image */}
//         <div
//           className="foryou-img-wrapper"
//           onClick={() => navigate(`/product/${getProductSlug()}`)}
//           style={{ cursor: 'pointer' }}
//         >
//           <img
//             src={imageUrl}
//             alt={product?.name || 'Product'}
//             className="foryou-img img-fluid"
//             loading="lazy"
//             onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/ffffff/cccccc?text=Product'; }}
//           />

//           {/* Wishlist */}
//           <button
//             onClick={handleToggleWishlist}
//             disabled={wishlistLoading}
//             style={{
//               position: 'absolute', top: '10px', right: '10px',
//               cursor: wishlistLoading ? 'not-allowed' : 'pointer',
//               color: productInWishlist ? '#dc3545' : '#000',
//               fontSize: '22px', zIndex: 2,
//               backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%',
//               width: '34px', height: '34px', display: 'flex',
//               alignItems: 'center', justifyContent: 'center',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//               transition: 'all 0.3s ease', border: 'none', outline: 'none',
//             }}
//           >
//             {wishlistLoading
//               ? <div className="spinner-border spinner-border-sm" role="status" />
//               : productInWishlist ? <FaHeart /> : <FaRegHeart />}
//           </button>

//           {selectedVariant?.promoApplied && (
//             <div className="promo-badge"><i className="bi bi-tag-fill me-1" />Promo</div>
//           )}
//         </div>

//         {/* Info */}
//         <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//           <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>
//             <div className="brand-name small text-muted mb-1 mt-2 text-start">{getBrandName()}</div>

//             <h6
//               className="foryou-name font-family-Poppins m-0 p-0"
//               onClick={() => navigate(`/product/${getProductSlug()}`)}
//               style={{ cursor: 'pointer' }}
//             >
//               {product?.name || 'Unnamed Product'}
//             </h6>

//             {hasVariants && (
//               <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                 {variantSelected ? (
//                   <div
//                     className="selected-variant-display text-muted small"
//                     style={{ cursor: 'pointer', display: 'inline-block' }}
//                     onClick={(e) => { e.stopPropagation(); setShowVariantOverlay(true); }}
//                   >
//                     Variant: <span className="fw-bold text-dark">{getVariantDisplayText(selectedVariant)}</span>
//                     <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                   </div>
//                 ) : (
//                   <div className="small text-muted" style={{ height: '20px' }}>{allVariants.length} Variants Available</div>
//                 )}
//               </div>
//             )}

//             <div className="price-section mb-3 mt-auto">
//               <div className="d-flex align-items-baseline flex-wrap">
//                 <span className="current-price fw-400 fs-5">{formatPrice(displayPrice)}</span>
//                 {originalPrice > displayPrice && (
//                   <>
//                     <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">{formatPrice(originalPrice)}</span>
//                     <span className="discount-percent text-danger fw-bold ms-2">({discountPercent}% OFF)</span>
//                   </>
//                 )}
//               </div>
//             </div>

//             <div className="cart-section">
//               <button
//                 className="w-100 btn-add-cart"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showSelectVariantBtn) setShowVariantOverlay(true);
//                   else handleAddToCart();
//                 }}
//                 disabled={buttonDisabled}
//                 style={{ transition: 'background-color 0.3s ease, color 0.3s ease' }}
//               >
//                 {addingToCart ? (
//                   <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
//                 ) : (
//                   <>
//                     {buttonText}
//                     {!buttonDisabled && !addingToCart && !showSelectVariantBtn && (
//                       <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: '20px' }} alt="bag" />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Variant Overlay */}
//       {showVariantOverlay && (
//         <div className="variant-overlay" onClick={() => setShowVariantOverlay(false)}>
//           <div
//             className="variant-overlay-content p-0"
//             onClick={(e) => e.stopPropagation()}
//             style={{ width: '100%', maxWidth: '500px', maxHeight: '100vh', background: '#fff', borderRadius: '0px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
//           >
//             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//               <h5 className="m-0 page-title-main-name">Select Variant ({allVariants.length})</h5>
//               <button onClick={() => setShowVariantOverlay(false)} style={{ background: 'none', border: 'none', fontSize: '24px' }}>×</button>
//             </div>

//             <div className="variant-tabs d-flex">
//               <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === 'all' ? 'active' : ''}`} onClick={() => setSelectedVariantType('all')}>All ({allVariants.length})</button>
//               {groupedVariants.color.length > 0 && (
//                 <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === 'color' ? 'active' : ''}`} onClick={() => setSelectedVariantType('color')}>Colors ({groupedVariants.color.length})</button>
//               )}
//               {groupedVariants.text.length > 0 && (
//                 <button className={`variant-tab flex-fill py-3 ${selectedVariantType === 'text' ? 'active' : ''}`} onClick={() => setSelectedVariantType('text')}>Sizes ({groupedVariants.text.length})</button>
//               )}
//             </div>

//             <div className="p-3 overflow-auto flex-grow-1">
//               {(selectedVariantType === 'all' || selectedVariantType === 'color') && groupedVariants.color.length > 0 && (
//                 <div className="row row-col-4 mt-3 p-2">
//                   {groupedVariants.color.map((v) => {
//                     const isSel = sku === getSku(v);
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     return (
//                       <div className="col-lg-4 col-5" key={getSku(v)}>
//                         <div className="text-center" style={{ cursor: isOOS ? 'not-allowed' : 'pointer' }} onClick={() => !isOOS && handleVariantSelect(v)}>
//                           <div style={{ width: '28px', height: '28px', borderRadius: '20%', backgroundColor: v.hex || '#ccc', margin: '0 auto 8px', border: isSel ? '2px solid #000' : '1px solid #ddd', opacity: isOOS ? 0.5 : 1, position: 'relative' }}>
//                             {isSel && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 'bold' }}>✓</span>}
//                           </div>
//                           <div className="small page-title-main-name" style={{ fontSize: '12px' }}>{getVariantDisplayText(v)}</div>
//                           {isOOS && <div className="text-danger small">Out of Stock</div>}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//               {(selectedVariantType === 'all' || selectedVariantType === 'text') && groupedVariants.text.length > 0 && (
//                 <div className="row row-cols-3 g-0">
//                   {groupedVariants.text.map((v) => {
//                     const isSel = sku === getSku(v);
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     return (
//                       <div className="col-lg-3 col-5" key={getSku(v)}>
//                         <div className="text-center" style={{ cursor: isOOS ? 'not-allowed' : 'pointer' }} onClick={() => !isOOS && handleVariantSelect(v)}>
//                           <div style={{ padding: '10px', borderRadius: '8px', border: isSel ? '2px solid #000' : '1px solid #ddd', background: isSel ? '#f8f9fa' : '#fff', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isOOS ? 0.5 : 1 }}>
//                             {getVariantDisplayText(v)}
//                           </div>
//                           {isOOS && <div className="text-danger small mt-1">Out of Stock</div>}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    RECOMMENDATIONS PAGE
// ───────────────────────────────────────────── */
// function RecommendationsPage({ onBack, onBannerClick }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [data, setData]       = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res  = await fetch('https://beauty.joyory.com/api/user/recommendations/personal-summary', { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
//         const json = await res.json();
//         if (json.success) setData(json);
//       } catch (err) { console.error('Error fetching recommendations:', err); }
//       finally { setLoading(false); }
//     })();
//   }, []);

//   if (loading) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
//         <Header />
//         <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
//           <div className="spinner-border text-dark mb-3" role="status" />
//           <p className="text-muted">Loading your personalized catalog...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff' }}>
//         <Header />
//         <Container className="py-5 text-center">
//           <h3>No recommendations found right now.</h3>
//           <button className="j-back-link mt-4" onClick={onBack}>Back to Home</button>
//         </Container>
//         <Footer />
//       </div>
//     );
//   }

//   const productSections = (data.sections || []).filter((s) => s.key !== 'banner' && s.products?.length > 0);

//   return (
//     <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--j-font-sans)' }}>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Header />

//       <Container fluid className="py-5">
//         {/* Banner */}
//         <div className="mb-5 text-center mt-5 pt-3" style={{ cursor: 'pointer' }} onClick={onBannerClick}>
//           <img src={FoyoulandingImg} alt="Personalize Your Experience" className="img-fluid mt-5" style={{ maxHeight: 'auto', width: '100%' }} />
//         </div>

//         {/* Sections with Swiper + Foryou-style cards */}
//         {productSections.map((section) => (
//           <div key={section.key} className="mb-5">
//             <h2 className="font-familys text-start foryou-heading ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-3 fw-normal">
//               {section.title}
//             </h2>

//             <div className="mobile-responsive-code position-relative">
//               <Swiper
//                 modules={[Autoplay, Pagination, Navigation]}
//                 pagination={{ clickable: true, dynamicBullets: true }}
//                 navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
//                 breakpoints={{
//                   300:  { slidesPerView: 2,   spaceBetween: 10 },
//                   576:  { slidesPerView: 2.5, spaceBetween: 15 },
//                   768:  { slidesPerView: 3,   spaceBetween: 15 },
//                   992:  { slidesPerView: 4,   spaceBetween: 20 },
//                   1200: { slidesPerView: 4,   spaceBetween: 25 },
//                 }}
//                 className="foryou-swiper"
//               >
//                 {section.products.map((product) => (
//                   <SwiperSlide key={product._id}>
//                     <ProductCard product={product} navigate={navigate} location={location} />
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             </div>
//           </div>
//         ))}

//         <div className="mt-5 text-center">
//           <button className="j-back-link" onClick={onBack}>Back to Home</button>
//         </div>
//       </Container>

//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    THANK YOU PAGE
// ───────────────────────────────────────────── */
// function ThankYouPage() {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)', display: 'flex', flexDirection: 'column' }}>
//       <Header />
//       <main className="flex-grow-1 d-flex justify-content-center align-items-center">
//         <div className="text-center j-reveal">
//           <h2 className="j-hero-title-main mb-3">Thank You!</h2>
//           <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>We are curating your personalized beauty recommendations...</p>
//           <div className="spinner-border mt-4" style={{ color: '#1f2937', width: '3rem', height: '3rem' }} />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    PROFILE RESULT VIEW
// ───────────────────────────────────────────── */
// function ProfileResult({ profileData, onNextFromProfile, onEditQuestion }) {
//   if (!profileData) return null;
//   const { answers, skinType, concern, ingredient, productType, budget, formulation } = profileData;

//   const tagStyle = { display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: '#f3f4f6', color: '#374151', fontSize: 12, fontWeight: 600, marginRight: 6, marginBottom: 6, border: '1px solid #e5e7eb' };
//   const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, marginTop: 16 };
//   const findQId = (field) => answers?.find((a) => a.mappingField === field)?.questionId;

//   const EditBtn = ({ field }) => (
//     <button onClick={() => onEditQuestion(findQId(field))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}>
//       <Edit2 size={14} />
//     </button>
//   );

//   return (
//     <>
//       <div className="j-panel-body page-title-main-name">
//         <p className="j-panel-eyebrow">YOUR PROFILE</p>
//         <h3 className="j-panel-heading page-title-main-name fs-6" style={{ marginBottom: 4 }}>Here's What We Know About You</h3>
//         <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>Based on your answers, we've built your personalised skincare profile.</p>

//         {skinType && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Skin Type</p><EditBtn field="skinType" /></div>
//             <span style={{ ...tagStyle, background: '#1f2937', color: 'white', border: 'none' }}>{skinType.charAt(0).toUpperCase() + skinType.slice(1)}</span>
//           </>
//         )}
//         {concern?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Skin Concern</p><EditBtn field="concern" /></div>
//             <div>{concern.map((c, i) => <span key={i} style={tagStyle}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>)}</div>
//           </>
//         )}
//         {productType?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Looking For</p><EditBtn field="productType" /></div>
//             <div>{productType.map((p, i) => <span key={i} style={tagStyle}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>)}</div>
//           </>
//         )}
//         {formulation && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Formulation</p><EditBtn field="formulation" /></div>
//             <span style={tagStyle}>{formulation.charAt(0).toUpperCase() + formulation.slice(1)}</span>
//           </>
//         )}
//         {ingredient?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Key Ingredient</p><EditBtn field="ingredient" /></div>
//             <div>{ingredient.map((ing, i) => <span key={i} style={tagStyle}>{ing.charAt(0).toUpperCase() + ing.slice(1)}</span>)}</div>
//           </>
//         )}
//         {budget && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Budget</p><EditBtn field="budget" /></div>
//             <span style={tagStyle}>
//               {budget === 'under500' ? 'Under Rs 500' : budget === '500to1000' ? 'Rs 500 – Rs 1000' : budget === '1000to2000' ? 'Rs 1000 – Rs 2000' : budget === 'above2000' ? 'Rs 2000+' : budget}
//             </span>
//           </>
//         )}
//         {answers?.length > 0 && (
//           <>
//             <p style={{ ...sectionLabel, marginTop: 24 }}>Your Answers</p>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {answers.map((ans, i) => (
//                 <div key={ans._id || i} style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     <span style={{ fontSize: 12, color: '#6b7280' }}>{ans.questionText || ans.mappingField}</span>
//                     <button onClick={() => onEditQuestion(ans.questionId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}><Edit2 size={14} /></button>
//                   </div>
//                   <div className="mt-2 mb-2">
//                     <span style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', background: '#e5e7eb', padding: '2px 10px 5px 10px', borderRadius: 12 }}>{ans.value}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//       <div className="j-panel-cta-area">
//         <button className="j-quiz-btn page-title-main-name" onClick={onNextFromProfile}>Next</button>
//       </div>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    SIDE PANEL
// ───────────────────────────────────────────── */
// function SidePanel({ isOpen, isClosing, onClose, showQuizContent, quizData, loading, error, currentQuestionIndex, selectedAnswers, expandedOption, onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz, onStartQuiz, profileData, profileLoading, showProfile, onNextFromProfile, onEditQuestion }) {
//   if (!isOpen) return null;
//   const currentQuestion = quizData?.[currentQuestionIndex];

//   return (
//     <>
//       <div className="j-backdrop" onClick={onClose} />
//       <div className={`j-panel${isClosing ? ' closing' : ''}`}>
//         <div className="j-panel-header">
//           <h2 className="j-panel-title page-title-main-name">For You</h2>
//           <button className="j-panel-close page-title-main-name" onClick={onClose}><X size={22} /></button>
//         </div>

//         {showProfile ? (
//           profileLoading
//             ? <div className="j-panel-body page-title-main-name"><div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#6b7280' }}>Building your profile...</p></div></div>
//             : <ProfileResult profileData={profileData} onNextFromProfile={onNextFromProfile} onEditQuestion={onEditQuestion} />
//         ) : (
//           <>
//             <div className="j-panel-body page-title-main-name">
//               {loading ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#6b7280' }}>Loading...</p></div>
//               ) : error ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#ef4444' }}>{error}</p></div>
//               ) : showQuizContent && quizData ? (
//                 <>
//                   <div style={{ marginBottom: 20 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>Question {currentQuestionIndex + 1} of {quizData.length}</span>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>{Math.round(((currentQuestionIndex + 1) / quizData.length) * 100)}%</span>
//                     </div>
//                     <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2 }}>
//                       <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`, background: '#1f2937', borderRadius: 2, transition: 'width 0.4s ease' }} />
//                     </div>
//                   </div>

//                   <p className="j-panel-eyebrow" style={{ marginBottom: 8 }}>SKINCARE QUIZ</p>
//                   <h3 className="j-panel-heading fs-6" style={{ marginBottom: 12 }}>{currentQuestion?.questionText}</h3>
//                   {currentQuestion?.description && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>{currentQuestion.description}</p>}

//                   <div style={{ marginBottom: 24 }}>
//                     {currentQuestion?.options.map((option) => {
//                       const isSelected = selectedAnswers[currentQuestion._id] === option.value;
//                       const isExpanded = expandedOption === option._id;
//                       return (
//                         <div key={option._id} style={{ marginBottom: 12, border: `2px solid ${isSelected ? '#1f2937' : '#e5e7eb'}`, borderRadius: 8, background: isSelected ? '#f9fafb' : 'white', overflow: 'hidden' }}>
//                           <div onClick={() => onToggleExpand(option._id)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isExpanded ? '#f3f4f6' : 'transparent' }}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
//                               <div onClick={(e) => { e.stopPropagation(); onOptionSelect(currentQuestion._id, option.value); }} style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSelected ? '#1f2937' : '#d1d5db'}`, background: isSelected ? '#1f2937' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                                 {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
//                               </div>
//                               <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#374151' }}>{option.label}</h5>
//                             </div>
//                             {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                           </div>
//                           {isExpanded && (
//                             <div style={{ padding: '0 16px 16px 48px' }}>
//                               <p style={{ fontSize: 13, color: '#6b7280', margin: '12px 0 0 0', lineHeight: 1.5 }}>{option.subtext}</p>
//                               {!isSelected
//                                 ? <button onClick={() => onOptionSelect(currentQuestion._id, option.value)} style={{ marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#1f2937', background: 'transparent', border: '1px solid #1f2937', borderRadius: 6, cursor: 'pointer' }}>Select This Option</button>
//                                 : <div style={{ marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: 'white', background: '#1f2937', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />Selected</div>}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
//                     <button onClick={onPrevQuestion} disabled={currentQuestionIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'transparent', border: 'none', color: currentQuestionIndex === 0 ? '#9ca3af' : '#374151', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}>
//                       <ChevronLeft size={18} /> Previous
//                     </button>
//                     <button onClick={() => onSubmitQuiz(currentQuestionIndex === quizData.length - 1)} disabled={!selectedAnswers[currentQuestion?._id]} style={{ padding: '10px 24px', background: selectedAnswers[currentQuestion?._id] ? '#1f2937' : '#9ca3af', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: selectedAnswers[currentQuestion?._id] ? 'pointer' : 'not-allowed' }}>
//                       Submit
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <p className="j-panel-eyebrow">FOR YOU</p>
//                   <h3 className="j-panel-heading page-title-main-name fs-6">Your Tailored Shopping Experience</h3>
//                   <div className="j-collage">
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face1/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face2/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face3/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face4/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face5/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face6/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face7/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                   </div>
//                   <h4 className="page-title-main-name" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>Let's Get Personal</h4>
//                   <p className="page-title-main-name" style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Answer these questions to unlock a customised Joyory Experience, Just For You</p>
//                 </>
//               )}
//             </div>
//             {!showQuizContent && (
//               <div className="j-panel-cta-area">
//                 <button className="j-quiz-btn page-title-main-name" onClick={onStartQuiz}>Take The Quiz</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    HOME PAGE
// ───────────────────────────────────────────── */
// function HomePage({ onOpenPanel, isPanelOpen, isClosing, onClosePanel, showQuizContent, quizData, loading, error, currentQuestionIndex, selectedAnswers, expandedOption, onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz, introData, introLoading, onCategoryClick, onStartQuiz, profileData, profileLoading, showProfile, onNextFromProfile, onEditQuestion }) {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)' }}>
//       <Header />
//       <main style={{ position: 'relative' }}>
//         <div className="py-5 text-center container-lg">
//           <div className="mb-5 j-reveal">
//             <h2 className="j-hero-title-pre"><em>Not Sure</em>,</h2>
//             <h3 className="j-hero-title-main">Where to Start? <span className="j-hero-title-light">Let's Help</span></h3>
//           </div>
//           <Row className="justify-content-center g-5">
//             {introLoading ? (
//               <Col xs={12} className="text-center"><p style={{ color: '#6b7280', fontSize: 14 }}>Loading categories...</p></Col>
//             ) : introData?.length > 0 ? (
//               introData.map((item) => (
//                 <Col key={item._id} md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick(item.title)}>
//                     <div className="j-cat-img-wrap"><img src={item.image} alt={item.title} referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">{item.title}</h4>
//                   </div>
//                 </Col>
//               ))
//             ) : (
//               <>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Makeup')}>
//                     <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/makeup-main/800/1000" alt="Makeup" referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">Makeup</h4>
//                   </div>
//                 </Col>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Skincare')}>
//                     <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/skincare-main/800/1000" alt="Skincare" referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">Skincare</h4>
//                   </div>
//                 </Col>
//               </>
//             )}
//           </Row>
//         </div>
//         <SidePanel
//           isOpen={isPanelOpen} isClosing={isClosing} onClose={onClosePanel}
//           showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
//           currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
//           onOptionSelect={onOptionSelect} onToggleExpand={onToggleExpand} onPrevQuestion={onPrevQuestion}
//           onSubmitQuiz={onSubmitQuiz} onStartQuiz={onStartQuiz}
//           profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
//           onNextFromProfile={onNextFromProfile} onEditQuestion={onEditQuestion}
//         />
//         {!isPanelOpen && <button className="j-float-btn" onClick={onOpenPanel}>Personalize</button>}
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    ROOT COMPONENT
// ───────────────────────────────────────────── */
// export default function Foryoulanding() {
//   const navigate = useNavigate();

//   const [view, setView]                                 = useState('home');
//   const [isPanelOpen, setIsPanelOpen]                   = useState(false);
//   const [isClosing, setIsClosing]                       = useState(false);
//   const [showQuizContent, setShowQuizContent]           = useState(false);
//   const [quizData, setQuizData]                         = useState(null);
//   const [loading, setLoading]                           = useState(false);
//   const [error, setError]                               = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers]           = useState({});
//   const [expandedOption, setExpandedOption]             = useState(null);
//   const [introData, setIntroData]                       = useState([]);
//   const [introLoading, setIntroLoading]                 = useState(true);
//   const [profileData, setProfileData]                   = useState(null);
//   const [profileLoading, setProfileLoading]             = useState(false);
//   const [showProfile, setShowProfile]                   = useState(false);
//   const [initialLoading, setInitialLoading]             = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res  = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//         const json = await res.json();
//         if (json.success && json.data) setView('recommendations');
//       } catch (e) { console.error(e); }
//       finally { setInitialLoading(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res  = await fetch('https://beauty.joyory.com/api/user/for-you/intro');
//         const json = await res.json();
//         if (json.success && Array.isArray(json.data)) setIntroData(json.data.sort((a, b) => a.displayOrder - b.displayOrder));
//       } catch (e) { console.error(e); }
//       finally { setIntroLoading(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     if (view === 'thankyou') {
//       const t = setTimeout(() => setView('recommendations'), 3000);
//       return () => clearTimeout(t);
//     }
//   }, [view]);

//   const fetchQuizData = async () => {
//     setLoading(true); setError(null);
//     try {
//       const res  = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/questions');
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const sorted = json.data.sort((a, b) => a.displayOrder - b.displayOrder);
//         setQuizData(sorted); setCurrentQuestionIndex(0);
//         if (sorted[0]?.options?.length > 0) {
//           setSelectedAnswers({ [sorted[0]._id]: sorted[0].options[0].value });
//           setExpandedOption(sorted[0].options[0]._id);
//         }
//       } else setError('Failed to load questions');
//     } catch (e) { setError('Error loading quiz'); console.error(e); }
//     finally { setLoading(false); }
//   };

//   const handleSubmitQuiz = async (isFinalStep = true) => {
//     if (!quizData) return;
//     const answersPayload = quizData.map((q) => {
//       const val = selectedAnswers[q._id];
//       const opt = q.options.find((o) => o.value === val);
//       return { questionId: q._id, questionText: q.questionText || '', mappingField: opt?.mappingField || '', value: val || '', label: opt?.label || '', subtext: opt?.subtext || '' };
//     }).filter((a) => a.value);

//     if (!isFinalStep) {
//       fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answers: answersPayload }) }).catch(console.error);
//       const next = currentQuestionIndex + 1; setCurrentQuestionIndex(next);
//       const q = quizData[next];
//       if (q && !selectedAnswers[q._id] && q.options?.length > 0) {
//         setSelectedAnswers((prev) => ({ ...prev, [q._id]: q.options[0].value }));
//         setExpandedOption(q.options[0]._id);
//       }
//       return;
//     }

//     setShowQuizContent(false); setShowProfile(true); setProfileLoading(true);
//     try {
//       const sr = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answers: answersPayload }) });
//       if (!(await sr.json()).success) throw new Error('Submit failed');
//       const pr   = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//       const pj   = await pr.json();
//       if (pj.success && pj.data) setProfileData(pj.data); else throw new Error('Profile fetch failed');
//     } catch (e) { console.error(e); }
//     finally { setProfileLoading(false); }
//   };

//   const handleCategoryClick = (category) => {
//     if (category.toLowerCase().includes('makeup')) navigate('/makeupquiz');
//     else { setIsPanelOpen(true); setShowQuizContent(false); setShowProfile(false); }
//   };

//   const closePanel = () => { setIsClosing(true); setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); }, 280); };

//   const handleClosePanel = () => { closePanel(); setTimeout(() => { setShowQuizContent(false); setShowProfile(false); }, 350); };

//   const handleNextFromProfile = () => {
//     setIsClosing(true);
//     setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); setView('thankyou'); setShowQuizContent(false); setShowProfile(false); }, 280);
//   };

//   const handleEditQuestion = async (questionId) => {
//     if (!quizData) await fetchQuizData();
//     const index = quizData?.findIndex((q) => q._id === questionId);
//     if (index !== undefined && index !== -1) {
//       if (view !== 'home') setView('home');
//       setIsPanelOpen(true); setShowQuizContent(true); setShowProfile(false); setCurrentQuestionIndex(index);
//       const answer = profileData?.answers?.find((a) => a.questionId === questionId);
//       if (answer) setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer.value }));
//     }
//   };

//   const handleBannerClick = async () => {
//     setView('home');
//     if (!profileData) {
//       setProfileLoading(true);
//       try {
//         const res  = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//         const json = await res.json();
//         if (json.success && json.data) setProfileData(json.data);
//       } catch (e) { console.error(e); }
//       finally { setProfileLoading(false); }
//     }
//     setIsPanelOpen(true); setShowProfile(true); setShowQuizContent(false);
//   };

//   if (initialLoading) {
//     return (
//       <div style={{ minHeight: '100vh', background: 'var(--j-cream)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         <div className="text-center">
//           <div className="spinner-border text-dark mb-3" role="status" />
//           <p className="text-muted">Checking your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {view === 'thankyou' ? (
//         <ThankYouPage />
//       ) : view === 'recommendations' ? (
//         <RecommendationsPage onBack={() => setView('home')} onBannerClick={handleBannerClick} />
//       ) : (
//         <HomePage
//           onOpenPanel={() => { setIsPanelOpen(true); setShowQuizContent(false); setShowProfile(false); }}
//           isPanelOpen={isPanelOpen} isClosing={isClosing} onClosePanel={handleClosePanel}
//           showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
//           currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
//           onOptionSelect={(qId, val) => setSelectedAnswers((prev) => ({ ...prev, [qId]: val }))}
//           onToggleExpand={(optId) => setExpandedOption((prev) => (prev === optId ? null : optId))}
//           onPrevQuestion={() => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1); }}
//           onSubmitQuiz={handleSubmitQuiz}
//           introData={introData} introLoading={introLoading} onCategoryClick={handleCategoryClick}
//           onStartQuiz={() => { setShowQuizContent(true); setShowProfile(false); fetchQuizData(); }}
//           profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
//           onNextFromProfile={handleNextFromProfile} onEditQuestion={handleEditQuestion}
//         />
//       )}
//     </>
//   );
// }















// import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { X, ChevronLeft, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
// import { Container, Row, Col } from 'react-bootstrap';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/Foryoulanding.css';
// import '../css/Foryou.css';
// import Header from './Header';
// import Footer from './Footer';
// import FoyoulandingImg from '../assets/Foyoulanding.jpg';
// import axios from 'axios';
// import { CartContext } from '../context/CartContext';
// import { UserContext } from './UserContext.jsx';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import bagIcon from '../assets/bag.svg';
// import { FaChevronDown } from 'react-icons/fa';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';

// /* ─────────────────────────────────────────────
//    SHARED CONSTANTS & HELPERS
// ───────────────────────────────────────────── */
// const WISHLIST_CACHE_KEY = 'guestWishlist';
// const CART_API_BASE = 'https://beauty.joyory.com/api/user/cart';

// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== 'string') return false;
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
// };

// const getVariantDisplayText = (variant) =>
//   (variant?.shadeName || variant?.name || variant?.size || variant?.ml || variant?.weight || 'Default').toUpperCase();

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [] };
//   (variants || []).forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) grouped.color.push(v);
//     else grouped.text.push(v);
//   });
//   return grouped;
// };

// const formatPrice = (price) =>
//   new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(price || 0));

// /* ─────────────────────────────────────────────
//    PRODUCT CARD  (identical design to Foryou.jsx)
// ───────────────────────────────────────────── */
// function ProductCard({ product, navigate, location }) {
//   const { user } = useContext(UserContext);

//   const allVariants = useMemo(
//     () => product?.variants || product?.shadeOptions || [],
//     [product]
//   );

//   const [selectedVariant, setSelectedVariant] = useState(
//     () => product?.selectedVariant || allVariants[0] || {}
//   );
//   const [variantSelected, setVariantSelected] = useState(false);
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState('all');

//   /* wishlist helpers */
//   const isInWishlist = useCallback(
//     (productId, sku) =>
//       wishlistData.some((i) => (i.productId === productId || i._id === productId) && i.sku === sku),
//     [wishlistData]
//   );

//   const fetchWishlistData = useCallback(async () => {
//     try {
//       if (user && !user.guest) {
//         const res = await axios.get('https://beauty.joyory.com/api/user/wishlist', { withCredentials: true });
//         if (res.data.success) setWishlistData(res.data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         setWishlistData(local.map((i) => ({ productId: i._id, _id: i._id, sku: i.sku })));
//       }
//     } catch { setWishlistData([]); }
//   }, [user]);

//   useEffect(() => { fetchWishlistData(); }, [fetchWishlistData]);

//   /* computed */
//   const displayPrice = parseFloat(
//     selectedVariant?.displayPrice || selectedVariant?.discountedPrice || selectedVariant?.price || product?.price || 0
//   );
//   const originalPrice = parseFloat(
//     selectedVariant?.originalPrice || selectedVariant?.mrp || product?.mrp || displayPrice
//   );
//   let discountPercent = parseFloat(selectedVariant?.discountPercent || product?.discountPercent || 0);
//   if (!discountPercent && originalPrice > displayPrice)
//     discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

//   const stock = parseInt(selectedVariant?.stock || product?.stock || 0);
//   const outOfStock = stock <= 0;
//   const hasVariants = allVariants.length > 0;
//   const showSelectVariantBtn = hasVariants && !variantSelected;

//   const imageUrl =
//     selectedVariant?.images?.[0] || selectedVariant?.image ||
//     product?.selectedVariant?.images?.[0] || product?.images?.[0] ||
//     'https://placehold.co/400x300/ffffff/cccccc?text=Product';

//   const sku = getSku(selectedVariant);
//   const productInWishlist = isInWishlist(product?._id, sku);
//   const groupedVariants = groupVariantsByType(allVariants);

//   const getBrandName = () => {
//     if (!product?.brand) return 'Unknown Brand';
//     if (typeof product.brand === 'object' && product.brand.name) return product.brand.name;
//     return typeof product.brand === 'string' ? product.brand : 'Unknown Brand';
//   };

//   const getProductSlug = () =>
//     product?.slugs?.[0] || product?.slug || product?._id;

//   const showToast = (msg, type = 'error') =>
//     type === 'success' ? toast.success(msg, { autoClose: 3000 }) : toast.error(msg, { autoClose: 3000 });

//   /* actions */
//   const handleVariantSelect = (v) => { setSelectedVariant(v); setVariantSelected(true); setShowVariantOverlay(false); };

//   const handleAddToCart = async () => {
//     setAddingToCart(true);
//     try {
//       let payload;
//       if (hasVariants) {
//         if (!selectedVariant || outOfStock) { showToast('Please select an in-stock variant.'); return; }
//         payload = { productId: product._id, variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }] };
//       } else {
//         if (outOfStock) { showToast('Product is out of stock.'); return; }
//         payload = { productId: product._id, quantity: 1 };
//       }
//       const res = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!res.data.success) throw new Error(res.data.message || 'Failed');
//       showToast('Product added to cart!', 'success');
//       navigate('/cartpage');
//     } catch (err) {
//       showToast(err.response?.data?.message || err.message || 'Failed to add product');
//       if (err.response?.status === 401) navigate('/login', { state: { from: location?.pathname } });
//     } finally { setAddingToCart(false); }
//   };

//   const handleToggleWishlist = async (e) => {
//     e.stopPropagation();
//     if (!selectedVariant) { showToast('Please select a variant first'); return; }
//     setWishlistLoading(true);
//     try {
//       const inWl = isInWishlist(product._id, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${product._id}`, { withCredentials: true, data: { sku } });
//           showToast('Removed from wishlist!', 'success');
//         } else {
//           await axios.post(`https://beauty.joyory.com/api/user/wishlist/${product._id}`, { sku }, { withCredentials: true });
//           showToast('Added to wishlist!', 'success');
//         }
//         await fetchWishlistData();
//       } else {
//         const local = JSON.parse(localStorage.getItem('guestWishlist')) || [];
//         if (inWl) {
//           localStorage.setItem('guestWishlist', JSON.stringify(local.filter((i) => !(i._id === product._id && i.sku === sku))));
//           showToast('Removed from wishlist!', 'success');
//         } else {
//           local.push({ _id: product._id, name: product.name, sku, image: imageUrl, displayPrice, originalPrice });
//           localStorage.setItem('guestWishlist', JSON.stringify(local));
//           showToast('Added to wishlist!', 'success');
//         }
//         await fetchWishlistData();
//       }
//     } catch (err) {
//       if (err.response?.status === 401) { showToast('Please login to use wishlist'); navigate('/login'); }
//       else showToast('Failed to update wishlist');
//     } finally { setWishlistLoading(false); }
//   };

//   const buttonText = addingToCart ? 'Adding...' : showSelectVariantBtn ? 'Select Variant' : outOfStock ? 'Out of Stock' : 'Add to Bag';
//   const buttonDisabled = addingToCart || outOfStock;

//   return (
//     <div className="foryou-card-wrapper">
//       <div className="foryou-card">
//         {/* Image */}
//         <div
//           className="foryou-img-wrapper"
//           onClick={() => navigate(`/product/${getProductSlug()}`)}
//           style={{ cursor: 'pointer' }}
//         >
//           <img
//             src={imageUrl}
//             alt={product?.name || 'Product'}
//             className="foryou-img img-fluid"
//             loading="lazy"
//             onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/ffffff/cccccc?text=Product'; }}
//           />

//           {/* Wishlist */}
//           <button
//             onClick={handleToggleWishlist}
//             disabled={wishlistLoading}
//             style={{
//               position: 'absolute', top: '10px', right: '10px',
//               cursor: wishlistLoading ? 'not-allowed' : 'pointer',
//               color: productInWishlist ? '#dc3545' : '#000',
//               fontSize: '22px', zIndex: 2,
//               backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%',
//               width: '34px', height: '34px', display: 'flex',
//               alignItems: 'center', justifyContent: 'center',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//               transition: 'all 0.3s ease', border: 'none', outline: 'none',
//             }}
//           >
//             {wishlistLoading
//               ? <div className="spinner-border spinner-border-sm" role="status" />
//               : productInWishlist ? <FaHeart /> : <FaRegHeart />}
//           </button>

//           {selectedVariant?.promoApplied && (
//             <div className="promo-badge"><i className="bi bi-tag-fill me-1" />Promo</div>
//           )}
//         </div>

//         {/* Info */}
//         <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//           <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>
//             <div className="brand-name small text-muted mb-1 mt-2 text-start">{getBrandName()}</div>

//             <h6
//               className="foryou-name font-family-Poppins m-0 p-0"
//               onClick={() => navigate(`/product/${getProductSlug()}`)}
//               style={{ cursor: 'pointer' }}
//             >
//               {product?.name || 'Unnamed Product'}
//             </h6>

//             {hasVariants && (
//               <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                 {variantSelected ? (
//                   <div
//                     className="selected-variant-display text-muted small"
//                     style={{ cursor: 'pointer', display: 'inline-block' }}
//                     onClick={(e) => { e.stopPropagation(); setShowVariantOverlay(true); }}
//                   >
//                     Variant: <span className="fw-bold text-dark">{getVariantDisplayText(selectedVariant)}</span>
//                     <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                   </div>
//                 ) : (
//                   <div className="small text-muted" style={{ height: '20px' }}>{allVariants.length} Variants Available</div>
//                 )}
//               </div>
//             )}

//             <div className="price-section mb-3 mt-auto">
//               <div className="d-flex align-items-baseline flex-wrap">
//                 <span className="current-price fw-400 fs-5">{formatPrice(displayPrice)}</span>
//                 {originalPrice > displayPrice && (
//                   <>
//                     <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">{formatPrice(originalPrice)}</span>
//                     <span className="discount-percent text-danger fw-bold ms-2">({discountPercent}% OFF)</span>
//                   </>
//                 )}
//               </div>
//             </div>

//             <div className="cart-section">
//               <button
//                 className="w-100 btn-add-cart"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showSelectVariantBtn) setShowVariantOverlay(true);
//                   else handleAddToCart();
//                 }}
//                 disabled={buttonDisabled}
//                 style={{ transition: 'background-color 0.3s ease, color 0.3s ease' }}
//               >
//                 {addingToCart ? (
//                   <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
//                 ) : (
//                   <>
//                     {buttonText}
//                     {!buttonDisabled && !addingToCart && !showSelectVariantBtn && (
//                       <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: '20px' }} alt="bag" />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Variant Overlay */}
//       {showVariantOverlay && (
//         <div className="variant-overlay" onClick={() => setShowVariantOverlay(false)}>
//           <div
//             className="variant-overlay-content p-0"
//             onClick={(e) => e.stopPropagation()}
//             style={{ width: '100%', maxWidth: '500px', maxHeight: '100vh', background: '#fff', borderRadius: '0px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
//           >
//             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//               <h5 className="m-0 page-title-main-name">Select Variant ({allVariants.length})</h5>
//               <button onClick={() => setShowVariantOverlay(false)} style={{ background: 'none', border: 'none', fontSize: '24px' }}>×</button>
//             </div>

//             <div className="variant-tabs d-flex">
//               <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === 'all' ? 'active' : ''}`} onClick={() => setSelectedVariantType('all')}>All ({allVariants.length})</button>
//               {groupedVariants.color.length > 0 && (
//                 <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === 'color' ? 'active' : ''}`} onClick={() => setSelectedVariantType('color')}>Colors ({groupedVariants.color.length})</button>
//               )}
//               {groupedVariants.text.length > 0 && (
//                 <button className={`variant-tab flex-fill py-3 ${selectedVariantType === 'text' ? 'active' : ''}`} onClick={() => setSelectedVariantType('text')}>Sizes ({groupedVariants.text.length})</button>
//               )}
//             </div>

//             <div className="p-3 overflow-auto flex-grow-1">
//               {(selectedVariantType === 'all' || selectedVariantType === 'color') && groupedVariants.color.length > 0 && (
//                 <div className="row row-col-4 mt-3 p-2">
//                   {groupedVariants.color.map((v) => {
//                     const isSel = sku === getSku(v);
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     return (
//                       <div className="col-lg-4 col-5" key={getSku(v)}>
//                         <div className="text-center" style={{ cursor: isOOS ? 'not-allowed' : 'pointer' }} onClick={() => !isOOS && handleVariantSelect(v)}>
//                           <div style={{ width: '28px', height: '28px', borderRadius: '20%', backgroundColor: v.hex || '#ccc', margin: '0 auto 8px', border: isSel ? '2px solid #000' : '1px solid #ddd', opacity: isOOS ? 0.5 : 1, position: 'relative' }}>
//                             {isSel && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 'bold' }}>✓</span>}
//                           </div>
//                           <div className="small page-title-main-name" style={{ fontSize: '12px' }}>{getVariantDisplayText(v)}</div>
//                           {isOOS && <div className="text-danger small">Out of Stock</div>}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//               {(selectedVariantType === 'all' || selectedVariantType === 'text') && groupedVariants.text.length > 0 && (
//                 <div className="row row-cols-3 g-0">
//                   {groupedVariants.text.map((v) => {
//                     const isSel = sku === getSku(v);
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     return (
//                       <div className="col-lg-3 col-5" key={getSku(v)}>
//                         <div className="text-center" style={{ cursor: isOOS ? 'not-allowed' : 'pointer' }} onClick={() => !isOOS && handleVariantSelect(v)}>
//                           <div style={{ padding: '10px', borderRadius: '8px', border: isSel ? '2px solid #000' : '1px solid #ddd', background: isSel ? '#f8f9fa' : '#fff', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isOOS ? 0.5 : 1 }}>
//                             {getVariantDisplayText(v)}
//                           </div>
//                           {isOOS && <div className="text-danger small mt-1">Out of Stock</div>}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    RECOMMENDATIONS PAGE – UPDATED BANNER
// ───────────────────────────────────────────── */
// function RecommendationsPage({ onBack, onBannerClick }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/recommendations/personal-summary', { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
//         const json = await res.json();
//         if (json.success) setData(json);
//       } catch (err) { console.error('Error fetching recommendations:', err); }
//       finally { setLoading(false); }
//     })();
//   }, []);

//   if (loading) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
//         <Header />
//         <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
//           <div className="spinner-border text-dark mb-3" role="status" />
//           <p className="text-muted">Loading your personalized catalog...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff' }}>
//         <Header />
//         <Container className="py-5 text-center">
//           <h3>No recommendations found right now.</h3>
//           <button className="j-back-link mt-4" onClick={onBack}>Back to Home</button>
//         </Container>
//         <Footer />
//       </div>
//     );
//   }

//   // ✅ Extract banner URL from sections
//   const bannerSection = data.sections?.find(s => s.key === 'banner');
//   const bannerUrl = bannerSection?.banner?.image?.[0]?.url;

//   const productSections = (data.sections || []).filter((s) => s.key !== 'banner' && s.products?.length > 0);

//   return (
//     <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--j-font-sans)' }}>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Header />

//       <Container fluid className="py-5">
//         {/* Banner – use dynamic URL if available, fallback to static image */}




//         <div className="mb-5 text-center mt-lg-5 pt-lg-3 padding-left-rightss" style={{ cursor: 'pointer' }} onClick={onBannerClick}>
//           <img src={FoyoulandingImg} alt="Personalize Your Experience" className="img-fluid mt-5" style={{ maxHeight: 'auto', width: '100%' }} />
//         </div>





//         {/* <div className="mb-5 text-center mt-5 pt-3" style={{ cursor: 'pointer' }} onClick={onBannerClick}> */}
//         {/* <img
//           src={bannerUrl || FoyoulandingImg}
//           alt="Personalize Your Experience"
//           className="img-fluid mt-5"
//           style={{ maxHeight: 'auto', width: '100%' }}
//         /> */}
//         {/* </div> */}

//         {/* Sections with Swiper + Foryou-style cards */}
//         {productSections.map((section) => (
//           <div key={section.key} className="mb-5">
//             <h2 className="font-familys text-start foryou-heading ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-3 fw-normal">
//               {section.title}
//             </h2>

//             <div className="mobile-responsive-code position-relative">
//               <Swiper
//                 modules={[Autoplay, Pagination, Navigation]}
//                 pagination={{ clickable: true, dynamicBullets: true }}
//                 navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
//                 breakpoints={{
//                   300: { slidesPerView: 2, spaceBetween: 10 },
//                   576: { slidesPerView: 2.5, spaceBetween: 15 },
//                   768: { slidesPerView: 3, spaceBetween: 15 },
//                   992: { slidesPerView: 4, spaceBetween: 20 },
//                   1200: { slidesPerView: 4, spaceBetween: 25 },
//                 }}
//                 className="foryou-swiper"
//               >
//                 {section.products.map((product) => (
//                   <SwiperSlide key={product._id}>
//                     <ProductCard product={product} navigate={navigate} location={location} />
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             </div>
//           </div>
//         ))}

//         <div className="mt-5 text-center">
//           <button className="j-back-link" onClick={onBack}>Back to Home</button>
//         </div>
//       </Container>

//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    THANK YOU PAGE
// ───────────────────────────────────────────── */
// function ThankYouPage() {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)', display: 'flex', flexDirection: 'column' }}>
//       <Header />
//       <main className="flex-grow-1 d-flex justify-content-center align-items-center">
//         <div className="text-center j-reveal">
//           <h2 className="j-hero-title-main mb-3">Thank You!</h2>
//           <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>We are curating your personalized beauty recommendations...</p>
//           <div className="spinner-border mt-4" style={{ color: '#1f2937', width: '3rem', height: '3rem' }} />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    PROFILE RESULT VIEW
// ───────────────────────────────────────────── */
// function ProfileResult({ profileData, onNextFromProfile, onEditQuestion }) {
//   if (!profileData) return null;
//   const { answers, skinType, concern, ingredient, productType, budget, formulation } = profileData;

//   const tagStyle = { display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: '#f3f4f6', color: '#374151', fontSize: 12, fontWeight: 600, marginRight: 6, marginBottom: 6, border: '1px solid #e5e7eb' };
//   const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, marginTop: 16 };
//   const findQId = (field) => answers?.find((a) => a.mappingField === field)?.questionId;

//   const EditBtn = ({ field }) => (
//     <button onClick={() => onEditQuestion(findQId(field))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}>
//       <Edit2 size={14} />
//     </button>
//   );

//   return (
//     <>
//       <div className="j-panel-body page-title-main-name">
//         <p className="j-panel-eyebrow">YOUR PROFILE</p>
//         <h3 className="j-panel-heading page-title-main-name fs-6" style={{ marginBottom: 4 }}>Here's What We Know About You</h3>
//         <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>Based on your answers, we've built your personalised skincare profile.</p>

//         {skinType && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Skin Type</p><EditBtn field="skinType" /></div>
//             <span style={{ ...tagStyle, background: '#1f2937', color: 'white', border: 'none' }}>{skinType.charAt(0).toUpperCase() + skinType.slice(1)}</span>
//           </>
//         )}
//         {concern?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Skin Concern</p><EditBtn field="concern" /></div>
//             <div>{concern.map((c, i) => <span key={i} style={tagStyle}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>)}</div>
//           </>
//         )}
//         {productType?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Looking For</p><EditBtn field="productType" /></div>
//             <div>{productType.map((p, i) => <span key={i} style={tagStyle}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>)}</div>
//           </>
//         )}
//         {formulation && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Formulation</p><EditBtn field="formulation" /></div>
//             <span style={tagStyle}>{formulation.charAt(0).toUpperCase() + formulation.slice(1)}</span>
//           </>
//         )}
//         {ingredient?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Key Ingredient</p><EditBtn field="ingredient" /></div>
//             <div>{ingredient.map((ing, i) => <span key={i} style={tagStyle}>{ing.charAt(0).toUpperCase() + ing.slice(1)}</span>)}</div>
//           </>
//         )}
//         {budget && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Budget</p><EditBtn field="budget" /></div>
//             <span style={tagStyle}>
//               {budget === 'under500' ? 'Under Rs 500' : budget === '500to1000' ? 'Rs 500 – Rs 1000' : budget === '1000to2000' ? 'Rs 1000 – Rs 2000' : budget === 'above2000' ? 'Rs 2000+' : budget}
//             </span>
//           </>
//         )}
//         {answers?.length > 0 && (
//           <>
//             <p style={{ ...sectionLabel, marginTop: 24 }}>Your Answers</p>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {answers.map((ans, i) => (
//                 <div key={ans._id || i} style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     <span style={{ fontSize: 12, color: '#6b7280' }}>{ans.questionText || ans.mappingField}</span>
//                     <button onClick={() => onEditQuestion(ans.questionId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}><Edit2 size={14} /></button>
//                   </div>
//                   <div className="mt-2 mb-2">
//                     <span style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', background: '#e5e7eb', padding: '2px 10px 5px 10px', borderRadius: 12 }}>{ans.value}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//       <div className="j-panel-cta-area">
//         <button className="j-quiz-btn page-title-main-name" onClick={onNextFromProfile}>Next</button>
//       </div>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    SIDE PANEL
// ───────────────────────────────────────────── */
// function SidePanel({ isOpen, isClosing, onClose, showQuizContent, quizData, loading, error, currentQuestionIndex, selectedAnswers, expandedOption, onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz, onStartQuiz, profileData, profileLoading, showProfile, onNextFromProfile, onEditQuestion }) {
//   if (!isOpen) return null;
//   const currentQuestion = quizData?.[currentQuestionIndex];

//   return (
//     <>
//       <div className="j-backdrop" onClick={onClose} />
//       <div className={`j-panel${isClosing ? ' closing' : ''}`}>
//         <div className="j-panel-header">
//           <h2 className="j-panel-title page-title-main-name">For You</h2>
//           <button className="j-panel-close page-title-main-name" onClick={onClose}><X size={22} /></button>
//         </div>

//         {showProfile ? (
//           profileLoading
//             ? <div className="j-panel-body page-title-main-name"><div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#6b7280' }}>Building your profile...</p></div></div>
//             : <ProfileResult profileData={profileData} onNextFromProfile={onNextFromProfile} onEditQuestion={onEditQuestion} />
//         ) : (
//           <>
//             <div className="j-panel-body page-title-main-name">
//               {loading ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#6b7280' }}>Loading...</p></div>
//               ) : error ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#ef4444' }}>{error}</p></div>
//               ) : showQuizContent && quizData ? (
//                 <>
//                   <div style={{ marginBottom: 20 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>Question {currentQuestionIndex + 1} of {quizData.length}</span>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>{Math.round(((currentQuestionIndex + 1) / quizData.length) * 100)}%</span>
//                     </div>
//                     <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2 }}>
//                       <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`, background: '#1f2937', borderRadius: 2, transition: 'width 0.4s ease' }} />
//                     </div>
//                   </div>

//                   <p className="j-panel-eyebrow" style={{ marginBottom: 8 }}>SKINCARE QUIZ</p>
//                   <h3 className="j-panel-heading fs-6" style={{ marginBottom: 12 }}>{currentQuestion?.questionText}</h3>
//                   {currentQuestion?.description && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>{currentQuestion.description}</p>}

//                   <div style={{ marginBottom: 24 }}>
//                     {currentQuestion?.options.map((option) => {
//                       const isSelected = selectedAnswers[currentQuestion._id] === option.value;
//                       const isExpanded = expandedOption === option._id;
//                       return (
//                         <div key={option._id} style={{ marginBottom: 12, border: `2px solid ${isSelected ? '#1f2937' : '#e5e7eb'}`, borderRadius: 8, background: isSelected ? '#f9fafb' : 'white', overflow: 'hidden' }}>
//                           <div onClick={() => onToggleExpand(option._id)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isExpanded ? '#f3f4f6' : 'transparent' }}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
//                               <div onClick={(e) => { e.stopPropagation(); onOptionSelect(currentQuestion._id, option.value); }} style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSelected ? '#1f2937' : '#d1d5db'}`, background: isSelected ? '#1f2937' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                                 {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
//                               </div>
//                               <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#374151' }}>{option.label}</h5>
//                             </div>
//                             {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                           </div>
//                           {isExpanded && (
//                             <div style={{ padding: '0 16px 16px 48px' }}>
//                               <p style={{ fontSize: 13, color: '#6b7280', margin: '12px 0 0 0', lineHeight: 1.5 }}>{option.subtext}</p>
//                               {!isSelected
//                                 ? <button onClick={() => onOptionSelect(currentQuestion._id, option.value)} style={{ marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#1f2937', background: 'transparent', border: '1px solid #1f2937', borderRadius: 6, cursor: 'pointer' }}>Select This Option</button>
//                                 : <div style={{ marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: 'white', background: '#1f2937', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />Selected</div>}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
//                     <button onClick={onPrevQuestion} disabled={currentQuestionIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'transparent', border: 'none', color: currentQuestionIndex === 0 ? '#9ca3af' : '#374151', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}>
//                       <ChevronLeft size={18} /> Previous
//                     </button>
//                     <button onClick={() => onSubmitQuiz(currentQuestionIndex === quizData.length - 1)} disabled={!selectedAnswers[currentQuestion?._id]} style={{ padding: '10px 24px', background: selectedAnswers[currentQuestion?._id] ? '#1f2937' : '#9ca3af', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: selectedAnswers[currentQuestion?._id] ? 'pointer' : 'not-allowed' }}>
//                       Submit
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <p className="j-panel-eyebrow">FOR YOU</p>
//                   <h3 className="j-panel-heading page-title-main-name fs-6">Your Tailored Shopping Experience</h3>
//                   <div className="j-collage">
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face1/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face2/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face3/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face4/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face5/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face6/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face7/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                   </div>
//                   <h4 className="page-title-main-name" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>Let's Get Personal</h4>
//                   <p className="page-title-main-name" style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Answer these questions to unlock a customised Joyory Experience, Just For You</p>
//                 </>
//               )}
//             </div>
//             {!showQuizContent && (
//               <div className="j-panel-cta-area">
//                 <button className="j-quiz-btn page-title-main-name" onClick={onStartQuiz}>Take The Quiz</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    HOME PAGE
// ───────────────────────────────────────────── */
// function HomePage({ onOpenPanel, isPanelOpen, isClosing, onClosePanel, showQuizContent, quizData, loading, error, currentQuestionIndex, selectedAnswers, expandedOption, onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz, introData, introLoading, onCategoryClick, onStartQuiz, profileData, profileLoading, showProfile, onNextFromProfile, onEditQuestion }) {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)' }}>
//       <Header />
//       <main style={{ position: 'relative' }}>
//         <div className="py-5 text-center container-lg">
//           <div className="mb-5 j-reveal">
//             <h2 className="j-hero-title-pre"><em>Not Sure</em>,</h2>
//             <h3 className="j-hero-title-main">Where to Start? <span className="j-hero-title-light">Let's Help</span></h3>
//           </div>
//           <Row className="justify-content-center g-5">
//             {introLoading ? (
//               <Col xs={12} className="text-center"><p style={{ color: '#6b7280', fontSize: 14 }}>Loading categories...</p></Col>
//             ) : introData?.length > 0 ? (
//               introData.map((item) => (
//                 <Col key={item._id} md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick(item.title)}>
//                     <div className="j-cat-img-wrap"><img src={item.image} alt={item.title} referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">{item.title}</h4>
//                   </div>
//                 </Col>
//               ))
//             ) : (
//               <>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Makeup')}>
//                     <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/makeup-main/800/1000" alt="Makeup" referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">Makeup</h4>
//                   </div>
//                 </Col>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Skincare')}>
//                     <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/skincare-main/800/1000" alt="Skincare" referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">Skincare</h4>
//                   </div>
//                 </Col>
//               </>
//             )}
//           </Row>
//         </div>
//         <SidePanel
//           isOpen={isPanelOpen} isClosing={isClosing} onClose={onClosePanel}
//           showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
//           currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
//           onOptionSelect={onOptionSelect} onToggleExpand={onToggleExpand} onPrevQuestion={onPrevQuestion}
//           onSubmitQuiz={onSubmitQuiz} onStartQuiz={onStartQuiz}
//           profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
//           onNextFromProfile={onNextFromProfile} onEditQuestion={onEditQuestion}
//         />
//         {!isPanelOpen && <button className="j-float-btn" onClick={onOpenPanel}>Personalize</button>}
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    ROOT COMPONENT
// ───────────────────────────────────────────── */
// export default function Foryoulanding() {
//   const navigate = useNavigate();

//   const [view, setView] = useState('home');
//   const [isPanelOpen, setIsPanelOpen] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);
//   const [showQuizContent, setShowQuizContent] = useState(false);
//   const [quizData, setQuizData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [expandedOption, setExpandedOption] = useState(null);
//   const [introData, setIntroData] = useState([]);
//   const [introLoading, setIntroLoading] = useState(true);
//   const [profileData, setProfileData] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//         const json = await res.json();
//         if (json.success && json.data) setView('recommendations');
//       } catch (e) { console.error(e); }
//       finally { setInitialLoading(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/intro');
//         const json = await res.json();
//         if (json.success && Array.isArray(json.data)) setIntroData(json.data.sort((a, b) => a.displayOrder - b.displayOrder));
//       } catch (e) { console.error(e); }
//       finally { setIntroLoading(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     if (view === 'thankyou') {
//       const t = setTimeout(() => setView('recommendations'), 3000);
//       return () => clearTimeout(t);
//     }
//   }, [view]);

//   const fetchQuizData = async () => {
//     setLoading(true); setError(null);
//     try {
//       const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/questions');
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const sorted = json.data.sort((a, b) => a.displayOrder - b.displayOrder);
//         setQuizData(sorted); setCurrentQuestionIndex(0);
//         if (sorted[0]?.options?.length > 0) {
//           setSelectedAnswers({ [sorted[0]._id]: sorted[0].options[0].value });
//           setExpandedOption(sorted[0].options[0]._id);
//         }
//       } else setError('Failed to load questions');
//     } catch (e) { setError('Error loading quiz'); console.error(e); }
//     finally { setLoading(false); }
//   };

//   const handleSubmitQuiz = async (isFinalStep = true) => {
//     if (!quizData) return;
//     const answersPayload = quizData.map((q) => {
//       const val = selectedAnswers[q._id];
//       const opt = q.options.find((o) => o.value === val);
//       return { questionId: q._id, questionText: q.questionText || '', mappingField: opt?.mappingField || '', value: val || '', label: opt?.label || '', subtext: opt?.subtext || '' };
//     }).filter((a) => a.value);

//     if (!isFinalStep) {
//       fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answers: answersPayload }) }).catch(console.error);
//       const next = currentQuestionIndex + 1; setCurrentQuestionIndex(next);
//       const q = quizData[next];
//       if (q && !selectedAnswers[q._id] && q.options?.length > 0) {
//         setSelectedAnswers((prev) => ({ ...prev, [q._id]: q.options[0].value }));
//         setExpandedOption(q.options[0]._id);
//       }
//       return;
//     }

//     setShowQuizContent(false); setShowProfile(true); setProfileLoading(true);
//     try {
//       const sr = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answers: answersPayload }) });
//       if (!(await sr.json()).success) throw new Error('Submit failed');
//       const pr = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//       const pj = await pr.json();
//       if (pj.success && pj.data) setProfileData(pj.data); else throw new Error('Profile fetch failed');
//     } catch (e) { console.error(e); }
//     finally { setProfileLoading(false); }
//   };

//   const handleCategoryClick = (category) => {
//     if (category.toLowerCase().includes('makeup')) navigate('/makeupquiz');
//     else { setIsPanelOpen(true); setShowQuizContent(false); setShowProfile(false); }
//   };

//   const closePanel = () => { setIsClosing(true); setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); }, 280); };

//   const handleClosePanel = () => { closePanel(); setTimeout(() => { setShowQuizContent(false); setShowProfile(false); }, 350); };

//   const handleNextFromProfile = () => {
//     setIsClosing(true);
//     setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); setView('thankyou'); setShowQuizContent(false); setShowProfile(false); }, 280);
//   };

//   const handleEditQuestion = async (questionId) => {
//     if (!quizData) await fetchQuizData();
//     const index = quizData?.findIndex((q) => q._id === questionId);
//     if (index !== undefined && index !== -1) {
//       if (view !== 'home') setView('home');
//       setIsPanelOpen(true); setShowQuizContent(true); setShowProfile(false); setCurrentQuestionIndex(index);
//       const answer = profileData?.answers?.find((a) => a.questionId === questionId);
//       if (answer) setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer.value }));
//     }
//   };

//   const handleBannerClick = async () => {
//     setView('home');
//     if (!profileData) {
//       setProfileLoading(true);
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//         const json = await res.json();
//         if (json.success && json.data) setProfileData(json.data);
//       } catch (e) { console.error(e); }
//       finally { setProfileLoading(false); }
//     }
//     setIsPanelOpen(true); setShowProfile(true); setShowQuizContent(false);
//   };

//   if (initialLoading) {
//     return (
//       <div style={{ minHeight: '100vh', background: 'var(--j-cream)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         <div className="text-center">
//           <div className="spinner-border text-dark mb-3" role="status" />
//           <p className="text-muted">Checking your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {view === 'thankyou' ? (
//         <ThankYouPage />
//       ) : view === 'recommendations' ? (
//         <RecommendationsPage onBack={() => setView('home')} onBannerClick={handleBannerClick} />
//       ) : (
//         <HomePage
//           onOpenPanel={() => { setIsPanelOpen(true); setShowQuizContent(false); setShowProfile(false); }}
//           isPanelOpen={isPanelOpen} isClosing={isClosing} onClosePanel={handleClosePanel}
//           showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
//           currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
//           onOptionSelect={(qId, val) => setSelectedAnswers((prev) => ({ ...prev, [qId]: val }))}
//           onToggleExpand={(optId) => setExpandedOption((prev) => (prev === optId ? null : optId))}
//           onPrevQuestion={() => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1); }}
//           onSubmitQuiz={handleSubmitQuiz}
//           introData={introData} introLoading={introLoading} onCategoryClick={handleCategoryClick}
//           onStartQuiz={() => { setShowQuizContent(true); setShowProfile(false); fetchQuizData(); }}
//           profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
//           onNextFromProfile={handleNextFromProfile} onEditQuestion={handleEditQuestion}
//         />
//       )}
//     </>
//   );
// }














// import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { X, ChevronLeft, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
// import { Container, Row, Col } from 'react-bootstrap';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/Foryoulanding.css';
// import '../css/Foryou.css';
// import Header from './Header';
// import Footer from './Footer';
// import FoyoulandingImg from '../assets/Foyoulanding.jpg';
// import axios from 'axios';
// import { CartContext } from '../context/CartContext';
// import { UserContext } from './UserContext.jsx';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import bagIcon from '../assets/bag.svg';
// import { FaChevronDown } from 'react-icons/fa';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';

// /* ─────────────────────────────────────────────
//    SHARED CONSTANTS & HELPERS
// ───────────────────────────────────────────── */
// const WISHLIST_CACHE_KEY = 'guestWishlist';
// const CART_API_BASE = 'https://beauty.joyory.com/api/user/cart';

// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== 'string') return false;
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
// };

// const getVariantDisplayText = (variant) =>
//   (variant?.shadeName || variant?.name || variant?.size || variant?.ml || variant?.weight || 'Default').toUpperCase();

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [] };
//   (variants || []).forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) grouped.color.push(v);
//     else grouped.text.push(v);
//   });
//   return grouped;
// };

// const formatPrice = (price) =>
//   new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(price || 0));

// /* ─────────────────────────────────────────────
//    PRODUCT CARD  (identical design to Foryou.jsx)
// ───────────────────────────────────────────── */
// function ProductCard({ product, navigate, location }) {
//   const { user } = useContext(UserContext);

//   const allVariants = useMemo(
//     () => product?.variants || product?.shadeOptions || [],
//     [product]
//   );

//   const [selectedVariant, setSelectedVariant] = useState(
//     () => product?.selectedVariant || allVariants[0] || {}
//   );
//   const [variantSelected, setVariantSelected] = useState(false);
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState('all');

//   /* wishlist helpers */
//   const isInWishlist = useCallback(
//     (productId, sku) =>
//       wishlistData.some((i) => (i.productId === productId || i._id === productId) && i.sku === sku),
//     [wishlistData]
//   );

//   const fetchWishlistData = useCallback(async () => {
//     try {
//       if (user && !user.guest) {
//         const res = await axios.get('https://beauty.joyory.com/api/user/wishlist', { withCredentials: true });
//         if (res.data.success) setWishlistData(res.data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         setWishlistData(local.map((i) => ({ productId: i._id, _id: i._id, sku: i.sku })));
//       }
//     } catch { setWishlistData([]); }
//   }, [user]);

//   useEffect(() => { fetchWishlistData(); }, [fetchWishlistData]);

//   /* computed */
//   const displayPrice = parseFloat(
//     selectedVariant?.displayPrice || selectedVariant?.discountedPrice || selectedVariant?.price || product?.price || 0
//   );
//   const originalPrice = parseFloat(
//     selectedVariant?.originalPrice || selectedVariant?.mrp || product?.mrp || displayPrice
//   );
//   let discountPercent = parseFloat(selectedVariant?.discountPercent || product?.discountPercent || 0);
//   if (!discountPercent && originalPrice > displayPrice)
//     discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

//   const stock = parseInt(selectedVariant?.stock || product?.stock || 0);
//   const outOfStock = stock <= 0;
//   const hasVariants = allVariants.length > 0;
//   const showSelectVariantBtn = hasVariants && !variantSelected;

//   const imageUrl =
//     selectedVariant?.images?.[0] || selectedVariant?.image ||
//     product?.selectedVariant?.images?.[0] || product?.images?.[0] ||
//     'https://placehold.co/400x300/ffffff/cccccc?text=Product';

//   const sku = getSku(selectedVariant);
//   const productInWishlist = isInWishlist(product?._id, sku);
//   const groupedVariants = groupVariantsByType(allVariants);

//   const getBrandName = () => {
//     if (!product?.brand) return 'Unknown Brand';
//     if (typeof product.brand === 'object' && product.brand.name) return product.brand.name;
//     return typeof product.brand === 'string' ? product.brand : 'Unknown Brand';
//   };

//   const getProductSlug = () =>
//     product?.slugs?.[0] || product?.slug || product?._id;

//   const showToast = (msg, type = 'error') =>
//     type === 'success' ? toast.success(msg, { autoClose: 3000 }) : toast.error(msg, { autoClose: 3000 });

//   /* actions */
//   const handleVariantSelect = (v) => { setSelectedVariant(v); setVariantSelected(true); setShowVariantOverlay(false); };

//   const handleAddToCart = async () => {
//     setAddingToCart(true);
//     try {
//       let payload;
//       if (hasVariants) {
//         if (!selectedVariant || outOfStock) { showToast('Please select an in-stock variant.'); return; }
//         payload = { productId: product._id, variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }] };
//       } else {
//         if (outOfStock) { showToast('Product is out of stock.'); return; }
//         payload = { productId: product._id, quantity: 1 };
//       }
//       const res = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!res.data.success) throw new Error(res.data.message || 'Failed');
//       showToast('Product added to cart!', 'success');
//       navigate('/cartpage');
//     } catch (err) {
//       showToast(err.response?.data?.message || err.message || 'Failed to add product');
//       if (err.response?.status === 401) navigate('/login', { state: { from: location?.pathname } });
//     } finally { setAddingToCart(false); }
//   };

//   const handleToggleWishlist = async (e) => {
//     e.stopPropagation();
//     if (!selectedVariant) { showToast('Please select a variant first'); return; }
//     setWishlistLoading(true);
//     try {
//       const inWl = isInWishlist(product._id, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${product._id}`, { withCredentials: true, data: { sku } });
//           showToast('Removed from wishlist!', 'success');
//         } else {
//           await axios.post(`https://beauty.joyory.com/api/user/wishlist/${product._id}`, { sku }, { withCredentials: true });
//           showToast('Added to wishlist!', 'success');
//         }
//         await fetchWishlistData();
//       } else {
//         const local = JSON.parse(localStorage.getItem('guestWishlist')) || [];
//         if (inWl) {
//           localStorage.setItem('guestWishlist', JSON.stringify(local.filter((i) => !(i._id === product._id && i.sku === sku))));
//           showToast('Removed from wishlist!', 'success');
//         } else {
//           local.push({ _id: product._id, name: product.name, sku, image: imageUrl, displayPrice, originalPrice });
//           localStorage.setItem('guestWishlist', JSON.stringify(local));
//           showToast('Added to wishlist!', 'success');
//         }
//         await fetchWishlistData();
//       }
//     } catch (err) {
//       if (err.response?.status === 401) { showToast('Please login to use wishlist'); navigate('/login'); }
//       else showToast('Failed to update wishlist');
//     } finally { setWishlistLoading(false); }
//   };

//   const buttonText = addingToCart ? 'Adding...' : showSelectVariantBtn ? 'Select Variant' : outOfStock ? 'Out of Stock' : 'Add to Bag';
//   const buttonDisabled = addingToCart || outOfStock;

//   return (
//     <div className="foryou-card-wrapper">
//       <div className="foryou-card">
//         {/* Image */}
//         <div
//           className="foryou-img-wrapper"
//           onClick={() => navigate(`/product/${getProductSlug()}`)}
//           style={{ cursor: 'pointer' }}
//         >
//           <img
//             src={imageUrl}
//             alt={product?.name || 'Product'}
//             className="foryou-img img-fluid"
//             loading="lazy"
//             onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/ffffff/cccccc?text=Product'; }}
//           />

//           {/* Wishlist */}
//           <button
//             onClick={handleToggleWishlist}
//             disabled={wishlistLoading}
//             style={{
//               position: 'absolute', top: '10px', right: '10px',
//               cursor: wishlistLoading ? 'not-allowed' : 'pointer',
//               color: productInWishlist ? '#dc3545' : '#000',
//               fontSize: '22px', zIndex: 2,
//               backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%',
//               width: '34px', height: '34px', display: 'flex',
//               alignItems: 'center', justifyContent: 'center',
//               transition: 'all 0.3s ease', border: 'none', outline: 'none',
//             }}
//           >
//             {wishlistLoading
//               ? <div className="spinner-border spinner-border-sm" role="status" />
//               : productInWishlist ? <FaHeart /> : <FaRegHeart />}
//           </button>

//           {selectedVariant?.promoApplied && (
//             <div className="promo-badge"><i className="bi bi-tag-fill me-1" />Promo</div>
//           )}
//         </div>

//         {/* Info */}
//         <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//           <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>
//             <div className="brand-name small text-muted mb-1 mt-2 text-start">{getBrandName()}</div>

//             <h6
//               className="foryou-name font-family-Poppins m-0 p-0"
//               onClick={() => navigate(`/product/${getProductSlug()}`)}
//               style={{ cursor: 'pointer' }}
//             >
//               {product?.name || 'Unnamed Product'}
//             </h6>

//             {hasVariants && (
//               <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                 {variantSelected ? (
//                   <div
//                     className="selected-variant-display text-muted small"
//                     style={{ cursor: 'pointer', display: 'inline-block' }}
//                     onClick={(e) => { e.stopPropagation(); setShowVariantOverlay(true); }}
//                   >
//                     Variant: <span className="fw-bold text-dark">{getVariantDisplayText(selectedVariant)}</span>
//                     <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                   </div>
//                 ) : (
//                   <div className="small text-muted" style={{ height: '20px' }}>{allVariants.length} Variants Available</div>
//                 )}
//               </div>
//             )}

//             <div className="price-section mb-3 mt-auto">
//               <div className="d-flex align-items-baseline flex-wrap">
//                 <span className="current-price fw-400 fs-5">{formatPrice(displayPrice)}</span>
//                 {originalPrice > displayPrice && (
//                   <>
//                     <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">{formatPrice(originalPrice)}</span>
//                     <span className="discount-percent text-danger fw-bold ms-2">({discountPercent}% OFF)</span>
//                   </>
//                 )}
//               </div>
//             </div>

//             <div className="cart-section">
//               {/* <button
//                 className="w-100 btn-add-cart"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showSelectVariantBtn) setShowVariantOverlay(true);
//                   else handleAddToCart();
//                 }}
//                 disabled={buttonDisabled}
//                 style={{ transition: 'background-color 0.3s ease, color 0.3s ease' }}
//               >
//                 {addingToCart ? (
//                   <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
//                 ) : (
//                   <>
//                     {buttonText}
//                     {!buttonDisabled && !addingToCart && !showSelectVariantBtn && (
//                       <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: '20px' }} alt="bag" />
//                     )}
//                   </>
//                 )}
//               </button> */}


//               <button
//                 className={`btn w-100 d-flex align-items-center justify-content-center gap-2 addtocartbuttton page-title-main-name ${addingToCart ? "btn-dark" : "btn-outline-dark"
//                   }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showSelectVariantBtn) setShowVariantOverlay(true);
//                   else handleAddToCart();
//                 }}
//                 disabled={buttonDisabled}
//               >
//                 {addingToCart ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     {buttonText}
//                     {!buttonDisabled && !addingToCart && !showSelectVariantBtn && (
//                       <img src={bagIcon} className="img-fluid ms-1 bag-icon" style={{ height: 20 }} />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Variant Overlay */}
//       {showVariantOverlay && (
//         <div className="variant-overlay" onClick={() => setShowVariantOverlay(false)}>
//           <div
//             className="variant-overlay-content p-0"
//             onClick={(e) => e.stopPropagation()}
//             style={{ width: '100%', maxWidth: '500px', maxHeight: '100vh', background: '#fff', borderRadius: '0px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
//           >
//             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//               <h5 className="m-0 page-title-main-name">Select Variant ({allVariants.length})</h5>
//               <button onClick={() => setShowVariantOverlay(false)} style={{ background: 'none', border: 'none', fontSize: '24px' }}>×</button>
//             </div>

//             <div className="variant-tabs d-flex">
//               <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === 'all' ? 'active' : ''}`} onClick={() => setSelectedVariantType('all')}>All ({allVariants.length})</button>
//               {groupedVariants.color.length > 0 && (
//                 <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === 'color' ? 'active' : ''}`} onClick={() => setSelectedVariantType('color')}>Colors ({groupedVariants.color.length})</button>
//               )}
//               {groupedVariants.text.length > 0 && (
//                 <button className={`variant-tab flex-fill py-3 ${selectedVariantType === 'text' ? 'active' : ''}`} onClick={() => setSelectedVariantType('text')}>Sizes ({groupedVariants.text.length})</button>
//               )}
//             </div>

//             <div className="p-3 overflow-auto flex-grow-1">
//               {(selectedVariantType === 'all' || selectedVariantType === 'color') && groupedVariants.color.length > 0 && (
//                 <div className="row row-col-4 mt-3 p-2">
//                   {groupedVariants.color.map((v) => {
//                     const isSel = sku === getSku(v);
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     return (
//                       <div className="col-lg-4 col-5" key={getSku(v)}>
//                         <div className="text-center" style={{ cursor: isOOS ? 'not-allowed' : 'pointer' }} onClick={() => !isOOS && handleVariantSelect(v)}>
//                           <div style={{ width: '28px', height: '28px', borderRadius: '20%', backgroundColor: v.hex || '#ccc', margin: '0 auto 8px', border: isSel ? '2px solid #000' : '1px solid #ddd', opacity: isOOS ? 0.5 : 1, position: 'relative' }}>
//                             {isSel && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 'bold' }}>✓</span>}
//                           </div>
//                           <div className="small page-title-main-name" style={{ fontSize: '12px' }}>{getVariantDisplayText(v)}</div>
//                           {isOOS && <div className="text-danger small">Out of Stock</div>}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//               {(selectedVariantType === 'all' || selectedVariantType === 'text') && groupedVariants.text.length > 0 && (
//                 <div className="row row-cols-3 g-0">
//                   {groupedVariants.text.map((v) => {
//                     const isSel = sku === getSku(v);
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     return (
//                       <div className="col-lg-3 col-5" key={getSku(v)}>
//                         <div className="text-center" style={{ cursor: isOOS ? 'not-allowed' : 'pointer' }} onClick={() => !isOOS && handleVariantSelect(v)}>
//                           <div style={{ padding: '10px', borderRadius: '8px', border: isSel ? '2px solid #000' : '1px solid #ddd', background: isSel ? '#f8f9fa' : '#fff', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isOOS ? 0.5 : 1 }}>
//                             {getVariantDisplayText(v)}
//                           </div>
//                           {isOOS && <div className="text-danger small mt-1">Out of Stock</div>}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    RECOMMENDATIONS PAGE – UPDATED BANNER
// ───────────────────────────────────────────── */
// function RecommendationsPage({ onBack, onBannerClick }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(UserContext);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user is logged in, redirect to login if not
//   useEffect(() => {
//     if (!user || user.guest) {
//       navigate('/login', { state: { from: location.pathname } });
//     }
//   }, [user, navigate, location]);

//   useEffect(() => {
//     // Only fetch data if user is logged in
//     if (!user || user.guest) return;

//     (async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/recommendations/personal-summary', { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
//         const json = await res.json();
//         if (json.success) setData(json);
//       } catch (err) { console.error('Error fetching recommendations:', err); }
//       finally { setLoading(false); }
//     })();
//   }, [user]);

//   if (!user || user.guest) {
//     return null; // Will redirect via useEffect
//   }

//   if (loading) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
//         <Header />
//         <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
//           <div className="spinner-border text-dark mb-3" role="status" />
//           <p className="text-muted">Loading your personalized catalog...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff' }}>
//         <Header />
//         <Container className="py-5 text-center">
//           <h3>No recommendations found right now.</h3>
//           <button className="j-back-link mt-4" onClick={onBack}>Back to Home</button>
//         </Container>
//         <Footer />
//       </div>
//     );
//   }

//   // ✅ Extract banner URL from sections
//   const bannerSection = data.sections?.find(s => s.key === 'banner');
//   const bannerUrl = bannerSection?.banner?.image?.[0]?.url;

//   const productSections = (data.sections || []).filter((s) => s.key !== 'banner' && s.products?.length > 0);

//   return (
//     <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--j-font-sans)' }}>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Header />

//       <Container fluid className="py-5">
//         {/* Banner – use dynamic URL if available, fallback to static image */}




//         <div className="mb-5 text-center mt-lg-5 pt-lg-3 padding-left-rightss" style={{ cursor: 'pointer' }} onClick={onBannerClick}>
//           <img src={FoyoulandingImg} alt="Personalize Your Experience" className="img-fluid mt-5" style={{ maxHeight: 'auto', width: '100%' }} />
//         </div>





//         {/* <div className="mb-5 text-center mt-5 pt-3" style={{ cursor: 'pointer' }} onClick={onBannerClick}> */}
//         {/* <img
//           src={bannerUrl || FoyoulandingImg}
//           alt="Personalize Your Experience"
//           className="img-fluid mt-5"
//           style={{ maxHeight: 'auto', width: '100%' }}
//         /> */}
//         {/* </div> */}

//         {/* Sections with Swiper + Foryou-style cards */}
//         {productSections.map((section) => (
//           <div key={section.key} className="mb-5">
//             <h2 className="font-familys text-start foryou-heading ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-3 fw-normal">
//               {section.title}
//             </h2>

//             <div className="mobile-responsive-code position-relative">
//               <Swiper
//                 modules={[Autoplay, Pagination, Navigation]}
//                 pagination={{ clickable: true, dynamicBullets: true }}
//                 navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
//                 breakpoints={{
//                   300: { slidesPerView: 2, spaceBetween: 10 },
//                   576: { slidesPerView: 2.5, spaceBetween: 15 },
//                   768: { slidesPerView: 3, spaceBetween: 15 },
//                   992: { slidesPerView: 4, spaceBetween: 20 },
//                   1200: { slidesPerView: 4, spaceBetween: 25 },
//                 }}
//                 className="foryou-swiper"
//               >
//                 {section.products.map((product) => (
//                   <SwiperSlide key={product._id}>
//                     <ProductCard product={product} navigate={navigate} location={location} />
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             </div>
//           </div>
//         ))}

//         <div className="mt-5 text-center">
//           <button className="j-back-link" onClick={onBack}>Back to Home</button>
//         </div>
//       </Container>

//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    THANK YOU PAGE
// ───────────────────────────────────────────── */
// function ThankYouPage() {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)', display: 'flex', flexDirection: 'column' }}>
//       <Header />
//       <main className="flex-grow-1 d-flex justify-content-center align-items-center">
//         <div className="text-center j-reveal">
//           <h2 className="j-hero-title-main mb-3">Thank You!</h2>
//           <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>We are curating your personalized beauty recommendations...</p>
//           <div className="spinner-border mt-4" style={{ color: '#1f2937', width: '3rem', height: '3rem' }} />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    PROFILE RESULT VIEW
// ───────────────────────────────────────────── */
// function ProfileResult({ profileData, onNextFromProfile, onEditQuestion }) {
//   if (!profileData) return null;
//   const { answers, skinType, concern, ingredient, productType, budget, formulation } = profileData;

//   const tagStyle = { display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: '#f3f4f6', color: '#374151', fontSize: 12, fontWeight: 600, marginRight: 6, marginBottom: 6, border: '1px solid #e5e7eb' };
//   const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, marginTop: 16 };
//   const findQId = (field) => answers?.find((a) => a.mappingField === field)?.questionId;

//   const EditBtn = ({ field }) => (
//     <button onClick={() => onEditQuestion(findQId(field))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}>
//       <Edit2 size={14} />
//     </button>
//   );

//   return (
//     <>
//       <div className="j-panel-body page-title-main-name">
//         <p className="j-panel-eyebrow">YOUR PROFILE</p>
//         <h3 className="j-panel-heading page-title-main-name fs-6" style={{ marginBottom: 4 }}>Here's What We Know About You</h3>
//         <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>Based on your answers, we've built your personalised skincare profile.</p>

//         {skinType && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Skin Type</p><EditBtn field="skinType" /></div>
//             <span style={{ ...tagStyle, background: '#1f2937', color: 'white', border: 'none' }}>{skinType.charAt(0).toUpperCase() + skinType.slice(1)}</span>
//           </>
//         )}
//         {concern?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Skin Concern</p><EditBtn field="concern" /></div>
//             <div>{concern.map((c, i) => <span key={i} style={tagStyle}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>)}</div>
//           </>
//         )}
//         {productType?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Looking For</p><EditBtn field="productType" /></div>
//             <div>{productType.map((p, i) => <span key={i} style={tagStyle}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>)}</div>
//           </>
//         )}
//         {formulation && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Formulation</p><EditBtn field="formulation" /></div>
//             <span style={tagStyle}>{formulation.charAt(0).toUpperCase() + formulation.slice(1)}</span>
//           </>
//         )}
//         {ingredient?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Key Ingredient</p><EditBtn field="ingredient" /></div>
//             <div>{ingredient.map((ing, i) => <span key={i} style={tagStyle}>{ing.charAt(0).toUpperCase() + ing.slice(1)}</span>)}</div>
//           </>
//         )}
//         {budget && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Budget</p><EditBtn field="budget" /></div>
//             <span style={tagStyle}>
//               {budget === 'under500' ? 'Under Rs 500' : budget === '500to1000' ? 'Rs 500 – Rs 1000' : budget === '1000to2000' ? 'Rs 1000 – Rs 2000' : budget === 'above2000' ? 'Rs 2000+' : budget}
//             </span>
//           </>
//         )}
//         {answers?.length > 0 && (
//           <>
//             <p style={{ ...sectionLabel, marginTop: 24 }}>Your Answers</p>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {answers.map((ans, i) => (
//                 <div key={ans._id || i} style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     <span style={{ fontSize: 12, color: '#6b7280' }}>{ans.questionText || ans.mappingField}</span>
//                     <button onClick={() => onEditQuestion(ans.questionId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}><Edit2 size={14} /></button>
//                   </div>
//                   <div className="mt-2 mb-2">
//                     <span style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', background: '#e5e7eb', padding: '2px 10px 5px 10px', borderRadius: 12 }}>{ans.value}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//       <div className="j-panel-cta-area">
//         <button className="j-quiz-btn page-title-main-name" onClick={onNextFromProfile}>Next</button>
//       </div>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    SIDE PANEL
// ───────────────────────────────────────────── */
// function SidePanel({ isOpen, isClosing, onClose, showQuizContent, quizData, loading, error, currentQuestionIndex, selectedAnswers, expandedOption, onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz, onStartQuiz, profileData, profileLoading, showProfile, onNextFromProfile, onEditQuestion }) {
//   if (!isOpen) return null;
//   const currentQuestion = quizData?.[currentQuestionIndex];

//   return (
//     <>
//       <div className="j-backdrop" onClick={onClose} />
//       <div className={`j-panel${isClosing ? ' closing' : ''}`}>
//         <div className="j-panel-header">
//           <h2 className="j-panel-title page-title-main-name">For You</h2>
//           <button className="j-panel-close page-title-main-name" onClick={onClose}><X size={22} /></button>
//         </div>

//         {showProfile ? (
//           profileLoading
//             ? <div className="j-panel-body page-title-main-name"><div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#6b7280' }}>Building your profile...</p></div></div>
//             : <ProfileResult profileData={profileData} onNextFromProfile={onNextFromProfile} onEditQuestion={onEditQuestion} />
//         ) : (
//           <>
//             <div className="j-panel-body page-title-main-name">
//               {loading ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#6b7280' }}>Loading...</p></div>
//               ) : error ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#ef4444' }}>{error}</p></div>
//               ) : showQuizContent && quizData ? (
//                 <>
//                   <div style={{ marginBottom: 20 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>Question {currentQuestionIndex + 1} of {quizData.length}</span>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>{Math.round(((currentQuestionIndex + 1) / quizData.length) * 100)}%</span>
//                     </div>
//                     <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2 }}>
//                       <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`, background: '#1f2937', borderRadius: 2, transition: 'width 0.4s ease' }} />
//                     </div>
//                   </div>

//                   <p className="j-panel-eyebrow" style={{ marginBottom: 8 }}>SKINCARE QUIZ</p>
//                   <h3 className="j-panel-heading fs-6" style={{ marginBottom: 12 }}>{currentQuestion?.questionText}</h3>
//                   {currentQuestion?.description && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>{currentQuestion.description}</p>}

//                   <div style={{ marginBottom: 24 }}>
//                     {currentQuestion?.options.map((option) => {
//                       const isSelected = selectedAnswers[currentQuestion._id] === option.value;
//                       const isExpanded = expandedOption === option._id;
//                       return (
//                         <div key={option._id} style={{ marginBottom: 12, border: `2px solid ${isSelected ? '#1f2937' : '#e5e7eb'}`, borderRadius: 8, background: isSelected ? '#f9fafb' : 'white', overflow: 'hidden' }}>
//                           <div onClick={() => onToggleExpand(option._id)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isExpanded ? '#f3f4f6' : 'transparent' }}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
//                               <div onClick={(e) => { e.stopPropagation(); onOptionSelect(currentQuestion._id, option.value); }} style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSelected ? '#1f2937' : '#d1d5db'}`, background: isSelected ? '#1f2937' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                                 {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
//                               </div>
//                               <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#374151' }}>{option.label}</h5>
//                             </div>
//                             {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                           </div>
//                           {isExpanded && (
//                             <div style={{ padding: '0 16px 16px 48px' }}>
//                               <p style={{ fontSize: 13, color: '#6b7280', margin: '12px 0 0 0', lineHeight: 1.5 }}>{option.subtext}</p>
//                               {!isSelected
//                                 ? <button onClick={() => onOptionSelect(currentQuestion._id, option.value)} style={{ marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#1f2937', background: 'transparent', border: '1px solid #1f2937', borderRadius: 6, cursor: 'pointer' }}>Select This Option</button>
//                                 : <div style={{ marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: 'white', background: '#1f2937', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />Selected</div>}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
//                     <button onClick={onPrevQuestion} disabled={currentQuestionIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'transparent', border: 'none', color: currentQuestionIndex === 0 ? '#9ca3af' : '#374151', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}>
//                       <ChevronLeft size={18} /> Previous
//                     </button>
//                     <button onClick={() => onSubmitQuiz(currentQuestionIndex === quizData.length - 1)} disabled={!selectedAnswers[currentQuestion?._id]} style={{ padding: '10px 24px', background: selectedAnswers[currentQuestion?._id] ? '#1f2937' : '#9ca3af', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: selectedAnswers[currentQuestion?._id] ? 'pointer' : 'not-allowed' }}>
//                       Submit
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <p className="j-panel-eyebrow">FOR YOU</p>
//                   <h3 className="j-panel-heading page-title-main-name fs-6">Your Tailored Shopping Experience</h3>
//                   <div className="j-collage">
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face1/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face2/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face3/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face4/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face5/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face6/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face7/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                   </div>
//                   <h4 className="page-title-main-name" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>Let's Get Personal</h4>
//                   <p className="page-title-main-name" style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Answer these questions to unlock a customised Joyory Experience, Just For You</p>
//                 </>
//               )}
//             </div>
//             {!showQuizContent && (
//               <div className="j-panel-cta-area">
//                 <button className="j-quiz-btn page-title-main-name" onClick={onStartQuiz}>Take The Quiz</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    HOME PAGE
// ───────────────────────────────────────────── */
// function HomePage({ onOpenPanel, isPanelOpen, isClosing, onClosePanel, showQuizContent, quizData, loading, error, currentQuestionIndex, selectedAnswers, expandedOption, onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz, introData, introLoading, onCategoryClick, onStartQuiz, profileData, profileLoading, showProfile, onNextFromProfile, onEditQuestion }) {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)' }}>
//       <Header />
//       <main style={{ position: 'relative' }}>
//         <div className="py-5 text-center container-lg">
//           <div className="mb-5 j-reveal">
//             <h2 className="j-hero-title-pre"><em>Not Sure</em>,</h2>
//             <h3 className="j-hero-title-main">Where to Start? <span className="j-hero-title-light">Let's Help</span></h3>
//           </div>
//           <Row className="justify-content-center g-5">
//             {introLoading ? (
//               <Col xs={12} className="text-center"><p style={{ color: '#6b7280', fontSize: 14 }}>Loading categories...</p></Col>
//             ) : introData?.length > 0 ? (
//               introData.map((item) => (
//                 <Col key={item._id} md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick(item.title)}>
//                     <div className="j-cat-img-wrap"><img src={item.image} alt={item.title} referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">{item.title}</h4>
//                   </div>
//                 </Col>
//               ))
//             ) : (
//               <>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Makeup')}>
//                     <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/makeup-main/800/1000" alt="Makeup" referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">Makeup</h4>
//                   </div>
//                 </Col>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Skincare')}>
//                     <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/skincare-main/800/1000" alt="Skincare" referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">Skincare</h4>
//                   </div>
//                 </Col>
//               </>
//             )}
//           </Row>
//         </div>
//         <SidePanel
//           isOpen={isPanelOpen} isClosing={isClosing} onClose={onClosePanel}
//           showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
//           currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
//           onOptionSelect={onOptionSelect} onToggleExpand={onToggleExpand} onPrevQuestion={onPrevQuestion}
//           onSubmitQuiz={onSubmitQuiz} onStartQuiz={onStartQuiz}
//           profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
//           onNextFromProfile={onNextFromProfile} onEditQuestion={onEditQuestion}
//         />
//         {!isPanelOpen && <button className="j-float-btn" onClick={onOpenPanel}>Personalize</button>}
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    ROOT COMPONENT
// ───────────────────────────────────────────── */
// export default function Foryoulanding() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(UserContext);

//   const [view, setView] = useState('home');
//   const [isPanelOpen, setIsPanelOpen] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);
//   const [showQuizContent, setShowQuizContent] = useState(false);
//   const [quizData, setQuizData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [expandedOption, setExpandedOption] = useState(null);
//   const [introData, setIntroData] = useState([]);
//   const [introLoading, setIntroLoading] = useState(true);
//   const [profileData, setProfileData] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);

//   // Check if user is logged in when view changes to recommendations
//   useEffect(() => {
//     if (view === 'recommendations' && (!user || user.guest)) {
//       navigate('/login', { state: { from: location.pathname } });
//     }
//   }, [view, user, navigate, location]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//         const json = await res.json();
//         if (json.success && json.data) setView('recommendations');
//       } catch (e) { console.error(e); }
//       finally { setInitialLoading(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/intro');
//         const json = await res.json();
//         if (json.success && Array.isArray(json.data)) setIntroData(json.data.sort((a, b) => a.displayOrder - b.displayOrder));
//       } catch (e) { console.error(e); }
//       finally { setIntroLoading(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     if (view === 'thankyou') {
//       const t = setTimeout(() => setView('recommendations'), 3000);
//       return () => clearTimeout(t);
//     }
//   }, [view]);

//   const fetchQuizData = async () => {
//     setLoading(true); setError(null);
//     try {
//       const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/questions');
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const sorted = json.data.sort((a, b) => a.displayOrder - b.displayOrder);
//         setQuizData(sorted); setCurrentQuestionIndex(0);
//         if (sorted[0]?.options?.length > 0) {
//           setSelectedAnswers({ [sorted[0]._id]: sorted[0].options[0].value });
//           setExpandedOption(sorted[0].options[0]._id);
//         }
//       } else setError('Failed to load questions');
//     } catch (e) { setError('Error loading quiz'); console.error(e); }
//     finally { setLoading(false); }
//   };

//   const handleSubmitQuiz = async (isFinalStep = true) => {
//     if (!quizData) return;
//     const answersPayload = quizData.map((q) => {
//       const val = selectedAnswers[q._id];
//       const opt = q.options.find((o) => o.value === val);
//       return { questionId: q._id, questionText: q.questionText || '', mappingField: opt?.mappingField || '', value: val || '', label: opt?.label || '', subtext: opt?.subtext || '' };
//     }).filter((a) => a.value);

//     if (!isFinalStep) {
//       fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answers: answersPayload }) }).catch(console.error);
//       const next = currentQuestionIndex + 1; setCurrentQuestionIndex(next);
//       const q = quizData[next];
//       if (q && !selectedAnswers[q._id] && q.options?.length > 0) {
//         setSelectedAnswers((prev) => ({ ...prev, [q._id]: q.options[0].value }));
//         setExpandedOption(q.options[0]._id);
//       }
//       return;
//     }

//     setShowQuizContent(false); setShowProfile(true); setProfileLoading(true);
//     try {
//       const sr = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answers: answersPayload }) });
//       if (!(await sr.json()).success) throw new Error('Submit failed');
//       const pr = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//       const pj = await pr.json();
//       if (pj.success && pj.data) setProfileData(pj.data); else throw new Error('Profile fetch failed');
//     } catch (e) { console.error(e); }
//     finally { setProfileLoading(false); }
//   };

//   const handleCategoryClick = (category) => {
//     if (category.toLowerCase().includes('makeup')) navigate('/makeupquiz');
//     else { setIsPanelOpen(true); setShowQuizContent(false); setShowProfile(false); }
//   };

//   const closePanel = () => { setIsClosing(true); setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); }, 280); };

//   const handleClosePanel = () => { closePanel(); setTimeout(() => { setShowQuizContent(false); setShowProfile(false); }, 350); };

//   const handleNextFromProfile = () => {
//     setIsClosing(true);
//     setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); setView('thankyou'); setShowQuizContent(false); setShowProfile(false); }, 280);
//   };

//   const handleEditQuestion = async (questionId) => {
//     if (!quizData) await fetchQuizData();
//     const index = quizData?.findIndex((q) => q._id === questionId);
//     if (index !== undefined && index !== -1) {
//       if (view !== 'home') setView('home');
//       setIsPanelOpen(true); setShowQuizContent(true); setShowProfile(false); setCurrentQuestionIndex(index);
//       const answer = profileData?.answers?.find((a) => a.questionId === questionId);
//       if (answer) setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer.value }));
//     }
//   };

//   const handleBannerClick = async () => {
//     // Check if user is logged in before opening profile
//     if (!user || user.guest) {
//       navigate('/login', { state: { from: location.pathname } });
//       return;
//     }

//     setView('home');
//     if (!profileData) {
//       setProfileLoading(true);
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//         const json = await res.json();
//         if (json.success && json.data) setProfileData(json.data);
//       } catch (e) { console.error(e); }
//       finally { setProfileLoading(false); }
//     }
//     setIsPanelOpen(true); setShowProfile(true); setShowQuizContent(false);
//   };

//   if (initialLoading) {
//     return (
//       <div style={{ minHeight: '100vh', background: 'var(--j-cream)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         <div className="text-center">
//           <div className="spinner-border text-dark mb-3" role="status" />
//           <p className="text-muted">Checking your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {view === 'thankyou' ? (
//         <ThankYouPage />
//       ) : view === 'recommendations' ? (
//         <RecommendationsPage onBack={() => setView('home')} onBannerClick={handleBannerClick} />
//       ) : (
//         <HomePage
//           onOpenPanel={() => { setIsPanelOpen(true); setShowQuizContent(false); setShowProfile(false); }}
//           isPanelOpen={isPanelOpen} isClosing={isClosing} onClosePanel={handleClosePanel}
//           showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
//           currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
//           onOptionSelect={(qId, val) => setSelectedAnswers((prev) => ({ ...prev, [qId]: val }))}
//           onToggleExpand={(optId) => setExpandedOption((prev) => (prev === optId ? null : optId))}
//           onPrevQuestion={() => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1); }}
//           onSubmitQuiz={handleSubmitQuiz}
//           introData={introData} introLoading={introLoading} onCategoryClick={handleCategoryClick}
//           onStartQuiz={() => { setShowQuizContent(true); setShowProfile(false); fetchQuizData(); }}
//           profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
//           onNextFromProfile={handleNextFromProfile} onEditQuestion={handleEditQuestion}
//         />
//       )}
//     </>
//   );
// }















// import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { X, ChevronLeft, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
// import { Container, Row, Col } from 'react-bootstrap';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/Foryoulanding.css';
// import '../css/Foryou.css';
// import Header from './Header';
// import Footer from './Footer';
// import FoyoulandingImg from '../assets/Foyoulanding.jpg';
// import axios from 'axios';
// import { CartContext } from '../context/CartContext';
// import { UserContext } from './UserContext.jsx';
// import { ToastContainer, toast } from 'react-toastify';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import 'react-toastify/dist/ReactToastify.css';
// import bagIcon from '../assets/bag.svg';
// import { FaChevronDown } from 'react-icons/fa';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';

// /* ─────────────────────────────────────────────
//    SHARED CONSTANTS & HELPERS
// ───────────────────────────────────────────── */
// const WISHLIST_CACHE_KEY = 'guestWishlist';
// const CART_API_BASE = 'https://beauty.joyory.com/api/user/cart';

// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== 'string') return false;
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
// };

// const getVariantDisplayText = (variant) =>
//   (variant?.shadeName || variant?.name || variant?.size || variant?.ml || variant?.weight || 'Default').toUpperCase();

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [] };
//   (variants || []).forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) grouped.color.push(v);
//     else grouped.text.push(v);
//   });
//   return grouped;
// };

// const formatPrice = (price) =>
//   new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(price || 0));

// /* ─────────────────────────────────────────────
//    PRODUCT CARD  (identical design to Foryou.jsx)
// ───────────────────────────────────────────── */
// function ProductCard({ product, navigate, location }) {
//   const { user } = useContext(UserContext);

//   const allVariants = useMemo(
//     () => product?.variants || product?.shadeOptions || [],
//     [product]
//   );

//   const [selectedVariant, setSelectedVariant] = useState(
//     () => product?.selectedVariant || allVariants[0] || {}
//   );
//   const [variantSelected, setVariantSelected] = useState(false);
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState('all');

//   /* wishlist helpers */
//   const isInWishlist = useCallback(
//     (productId, sku) =>
//       wishlistData.some((i) => (i.productId === productId || i._id === productId) && i.sku === sku),
//     [wishlistData]
//   );

//   const fetchWishlistData = useCallback(async () => {
//     try {
//       if (user && !user.guest) {
//         const res = await axios.get('https://beauty.joyory.com/api/user/wishlist', { withCredentials: true });
//         if (res.data.success) setWishlistData(res.data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         setWishlistData(local.map((i) => ({ productId: i._id, _id: i._id, sku: i.sku })));
//       }
//     } catch { setWishlistData([]); }
//   }, [user]);

//   useEffect(() => { fetchWishlistData(); }, [fetchWishlistData]);

//   /* computed */
//   const displayPrice = parseFloat(
//     selectedVariant?.displayPrice || selectedVariant?.discountedPrice || selectedVariant?.price || product?.price || 0
//   );
//   const originalPrice = parseFloat(
//     selectedVariant?.originalPrice || selectedVariant?.mrp || product?.mrp || displayPrice
//   );
//   let discountPercent = parseFloat(selectedVariant?.discountPercent || product?.discountPercent || 0);
//   if (!discountPercent && originalPrice > displayPrice)
//     discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

//   const stock = parseInt(selectedVariant?.stock || product?.stock || 0);
//   const outOfStock = stock <= 0;
//   const hasVariants = allVariants.length > 0;
//   const showSelectVariantBtn = hasVariants && !variantSelected;

//   const imageUrl =
//     selectedVariant?.images?.[0] || selectedVariant?.image ||
//     product?.selectedVariant?.images?.[0] || product?.images?.[0] ||
//     'https://placehold.co/400x300/ffffff/cccccc?text=Product';

//   const sku = getSku(selectedVariant);
//   const productInWishlist = isInWishlist(product?._id, sku);
//   const groupedVariants = groupVariantsByType(allVariants);

//   const getBrandName = () => {
//     if (!product?.brand) return 'Unknown Brand';
//     if (typeof product.brand === 'object' && product.brand.name) return product.brand.name;
//     return typeof product.brand === 'string' ? product.brand : 'Unknown Brand';
//   };

//   const getProductSlug = () =>
//     product?.slugs?.[0] || product?.slug || product?._id;

//   const showToast = (msg, type = 'error') =>
//     type === 'success' ? toast.success(msg, { autoClose: 3000 }) : toast.error(msg, { autoClose: 3000 });

//   /* actions */
//   const handleVariantSelect = (v) => { setSelectedVariant(v); setVariantSelected(true); setShowVariantOverlay(false); };

//   const handleAddToCart = async () => {
//     setAddingToCart(true);
//     try {
//       let payload;
//       if (hasVariants) {
//         if (!selectedVariant || outOfStock) { showToast('Please select an in-stock variant.'); return; }
//         payload = { productId: product._id, variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }] };
//       } else {
//         if (outOfStock) { showToast('Product is out of stock.'); return; }
//         payload = { productId: product._id, quantity: 1 };
//       }
//       const res = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!res.data.success) throw new Error(res.data.message || 'Failed');
//       showToast('Product added to cart!', 'success');
//       navigate('/cartpage');
//     } catch (err) {
//       showToast(err.response?.data?.message || err.message || 'Failed to add product');
//       if (err.response?.status === 401) navigate('/login', { state: { from: location?.pathname } });
//     } finally { setAddingToCart(false); }
//   };

//   const handleToggleWishlist = async (e) => {
//     e.stopPropagation();
//     if (!selectedVariant) { showToast('Please select a variant first'); return; }
//     setWishlistLoading(true);
//     try {
//       const inWl = isInWishlist(product._id, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${product._id}`, { withCredentials: true, data: { sku } });
//           showToast('Removed from wishlist!', 'success');
//         } else {
//           await axios.post(`https://beauty.joyory.com/api/user/wishlist/${product._id}`, { sku }, { withCredentials: true });
//           showToast('Added to wishlist!', 'success');
//         }
//         await fetchWishlistData();
//       } else {
//         const local = JSON.parse(localStorage.getItem('guestWishlist')) || [];
//         if (inWl) {
//           localStorage.setItem('guestWishlist', JSON.stringify(local.filter((i) => !(i._id === product._id && i.sku === sku))));
//           showToast('Removed from wishlist!', 'success');
//         } else {
//           local.push({ _id: product._id, name: product.name, sku, image: imageUrl, displayPrice, originalPrice });
//           localStorage.setItem('guestWishlist', JSON.stringify(local));
//           showToast('Added to wishlist!', 'success');
//         }
//         await fetchWishlistData();
//       }
//     } catch (err) {
//       if (err.response?.status === 401) { showToast('Please login to use wishlist'); navigate('/login'); }
//       else showToast('Failed to update wishlist');
//     } finally { setWishlistLoading(false); }
//   };

//   const buttonText = addingToCart ? 'Adding...' : showSelectVariantBtn ? 'Select Variant' : outOfStock ? 'Out of Stock' : 'Add to Bag';
//   const buttonDisabled = addingToCart || outOfStock;

//   return (
//     <div className="foryou-card-wrapper">
//       <div className="foryou-card">
//         {/* Image */}
//         <div
//           className="foryou-img-wrapper"
//           onClick={() => navigate(`/product/${getProductSlug()}`)}
//           style={{ cursor: 'pointer' }}
//         >
//           <img
//             src={imageUrl}
//             alt={product?.name || 'Product'}
//             className="foryou-img img-fluid"
//             loading="lazy"
//             onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/ffffff/cccccc?text=Product'; }}
//           />

//           {/* Wishlist */}
//           <button
//             onClick={handleToggleWishlist}
//             disabled={wishlistLoading}
//             style={{
//               position: 'absolute', top: '10px', right: '10px',
//               cursor: wishlistLoading ? 'not-allowed' : 'pointer',
//               color: productInWishlist ? '#dc3545' : '#000',
//               fontSize: '22px', zIndex: 2,
//               backgroundColor: 'none !important', borderRadius: '50%',
//               width: '45px', height: '45px', display: 'flex',
//               alignItems: 'center', justifyContent: 'center',
//               transition: 'all 0.3s ease', border: 'none', outline: 'none',
//             }}
//           >
//             {wishlistLoading
//               ? <div className="spinner-border spinner-border-sm" role="status" />
//               : productInWishlist ? <FaHeart /> : <FaRegHeart />}
//           </button>

//           {selectedVariant?.promoApplied && (
//             <div className="promo-badge"><i className="bi bi-tag-fill me-1" />Promo</div>
//           )}
//         </div>

//         {/* Info */}
//         <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//           {/* <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}> */}
//           <div className="justify-content-between d-flex flex-column" style={{ height: '220px' }}>
//             <div className="brand-name small text-muted mb-1 mt-2 text-start">{getBrandName()}</div>

//             <h6
//               className="foryou-name font-family-Poppins m-0 p-0"
//               onClick={() => navigate(`/product/${getProductSlug()}`)}
//               style={{ cursor: 'pointer' }}
//             >
//               {product?.name || 'Unnamed Product'}
//             </h6>

//             {hasVariants && (
//               <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                 {variantSelected ? (
//                   <div
//                     className="selected-variant-display text-muted small"
//                     style={{ cursor: 'pointer', display: 'inline-block' }}
//                     onClick={(e) => { e.stopPropagation(); setShowVariantOverlay(true); }}
//                   >
//                     Variant: <span className="fw-bold text-dark">{getVariantDisplayText(selectedVariant)}</span>
//                     <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                   </div>
//                 ) : (
//                   <div className="small text-muted" style={{ height: '20px' }}>{allVariants.length} Variants Available</div>
//                 )}
//               </div>
//             )}

//             <div className="price-section mb-3 mt-auto">
//               <div className="d-flex align-items-baseline flex-wrap">
//                 <span className="current-price fw-400 fs-5">{formatPrice(displayPrice)}</span>
//                 {originalPrice > displayPrice && (
//                   <>
//                     <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">{formatPrice(originalPrice)}</span>
//                     <span className="discount-percent text-danger fw-bold ms-2">({discountPercent}% OFF)</span>
//                   </>
//                 )}
//               </div>
//             </div>

//             <div className="cart-section">
//               <button
//                 className={`btn w-100 d-flex align-items-center justify-content-center gap-2 addtocartbuttton page-title-main-name ${addingToCart ? "btn-dark" : "btn-outline-dark"
//                   }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showSelectVariantBtn) setShowVariantOverlay(true);
//                   else handleAddToCart();
//                 }}
//                 disabled={buttonDisabled}
//               >
//                 {addingToCart ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     {buttonText}
//                     {!buttonDisabled && !addingToCart && !showSelectVariantBtn && (
//                       <img src={bagIcon} className="img-fluid ms-1 bag-icon" style={{ height: 20 }} />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Variant Overlay */}
//       {showVariantOverlay && (
//         <div className="variant-overlay" onClick={() => setShowVariantOverlay(false)}>
//           <div
//             className="variant-overlay-content p-0"
//             onClick={(e) => e.stopPropagation()}
//             style={{ width: '100%', maxWidth: '500px', maxHeight: '100vh', background: '#fff', borderRadius: '0px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
//           >
//             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//               <h5 className="m-0 page-title-main-name">Select Variant ({allVariants.length})</h5>
//               <button onClick={() => setShowVariantOverlay(false)} style={{ background: 'none', border: 'none', fontSize: '24px' }}>×</button>
//             </div>

//             <div className="variant-tabs d-flex">
//               <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === 'all' ? 'active' : ''}`} onClick={() => setSelectedVariantType('all')}>All ({allVariants.length})</button>
//               {groupedVariants.color.length > 0 && (
//                 <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === 'color' ? 'active' : ''}`} onClick={() => setSelectedVariantType('color')}>Colors ({groupedVariants.color.length})</button>
//               )}
//               {groupedVariants.text.length > 0 && (
//                 <button className={`variant-tab flex-fill py-3 ${selectedVariantType === 'text' ? 'active' : ''}`} onClick={() => setSelectedVariantType('text')}>Sizes ({groupedVariants.text.length})</button>
//               )}
//             </div>

//             <div className="p-3 overflow-auto flex-grow-1">
//               {(selectedVariantType === 'all' || selectedVariantType === 'color') && groupedVariants.color.length > 0 && (
//                 <div className="row row-col-4 mt-3 p-2">
//                   {groupedVariants.color.map((v) => {
//                     const isSel = sku === getSku(v);
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     return (
//                       <div className="col-lg-4 col-5" key={getSku(v)}>
//                         <div className="text-center" style={{ cursor: isOOS ? 'not-allowed' : 'pointer' }} onClick={() => !isOOS && handleVariantSelect(v)}>
//                           <div style={{ width: '28px', height: '28px', borderRadius: '20%', backgroundColor: v.hex || '#ccc', margin: '0 auto 8px', border: isSel ? '2px solid #000' : '1px solid #ddd', opacity: isOOS ? 0.5 : 1, position: 'relative' }}>
//                             {isSel && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 'bold' }}>✓</span>}
//                           </div>
//                           <div className="small page-title-main-name" style={{ fontSize: '12px' }}>{getVariantDisplayText(v)}</div>
//                           {isOOS && <div className="text-danger small">Out of Stock</div>}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//               {(selectedVariantType === 'all' || selectedVariantType === 'text') && groupedVariants.text.length > 0 && (
//                 <div className="row row-cols-3 g-0">
//                   {groupedVariants.text.map((v) => {
//                     const isSel = sku === getSku(v);
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     return (
//                       <div className="col-lg-3 col-5" key={getSku(v)}>
//                         <div className="text-center" style={{ cursor: isOOS ? 'not-allowed' : 'pointer' }} onClick={() => !isOOS && handleVariantSelect(v)}>
//                           <div style={{ padding: '10px', borderRadius: '8px', border: isSel ? '2px solid #000' : '1px solid #ddd', background: isSel ? '#f8f9fa' : '#fff', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isOOS ? 0.5 : 1 }}>
//                             {getVariantDisplayText(v)}
//                           </div>
//                           {isOOS && <div className="text-danger small mt-1">Out of Stock</div>}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    RECOMMENDATIONS PAGE
// ───────────────────────────────────────────── */
// function RecommendationsPage({ onBack, onBannerClick }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(UserContext);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user || user.guest) {
//       navigate('/login', { state: { from: location.pathname } });
//     }
//   }, [user, navigate, location]);

//   useEffect(() => {
//     if (!user || user.guest) return;

//     (async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/recommendations/personal-summary', {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include'
//         });
//         const json = await res.json();
//         if (json.success) setData(json);
//       } catch (err) {
//         console.error('Error fetching recommendations:', err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [user]);

//   if (!user || user.guest) {
//     return null;
//   }

//   // if (loading) {
//   //   return (
//   //     <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
//   //       <Header />
//   //       <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
//   //         <div className="spinner-border text-dark mb-3" role="status" />
//   //         <p className="text-muted">Loading your personalized catalog...</p>
//   //       </div>
//   //       <Footer />
//   //     </div>
//   //   );
//   // }




//   if (loading)
//     return (
//       <div
//         className="fullscreen-loader page-title-main-name"
//         style={{
//           minHeight: "100vh",
//           width: "100%",
//         }}
//       >
//         <div className="text-center">
//           <DotLottieReact className='foryoulanding-css'
//             src="https:lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//             loop
//             autoplay
//           />


//           <p className="text-muted mb-0">
//             Please wait while we prepare the best products for you...
//           </p>
//         </div>
//       </div>
//     )

//   if (!data) {
//     return (
//       <div style={{ minHeight: '100vh', background: '#fff' }}>
//         <Header />
//         <Container className="py-5 text-center">
//           <h3>No recommendations found right now.</h3>
//           <button className="j-back-link mt-4" onClick={onBack}>Back to Home</button>
//         </Container>
//         <Footer />
//       </div>
//     );
//   }

//   const productSections = (data.sections || []).filter((s) => s.key !== 'banner' && s.products?.length > 0);

//   return (
//     <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--j-font-sans)' }}>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Header />

//       <Container fluid className="py-5">
//         <div className="mb-lg-5 mb-4 text-center mt-lg-5 pt-lg-3 padding-left-rightss" style={{ cursor: 'pointer' }} onClick={onBannerClick}>
//           <img src={FoyoulandingImg} alt="Personalize Your Experience" className="img-fluid mt-5" style={{ maxHeight: 'auto', width: '100%' }} />
//         </div>

//         {productSections.map((section) => (
//           <div key={section.key} className="mb-lg-5">
//             <h2 className="font-familys text-start foryou-heading ms-lg-3 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-3 fw-normal">
//               {section.title}
//             </h2>

//             <div className="mobile-responsive-code position-relative">
//               <Swiper
//                 modules={[Autoplay, Pagination, Navigation]}
//                 pagination={{ clickable: true, dynamicBullets: true }}
//                 navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
//                 breakpoints={{
//                   300: { slidesPerView: 2, spaceBetween: 10 },
//                   576: { slidesPerView: 2.5, spaceBetween: 15 },
//                   768: { slidesPerView: 3, spaceBetween: 15 },
//                   992: { slidesPerView: 4, spaceBetween: 20 },
//                   1200: { slidesPerView: 4, spaceBetween: 25 },
//                 }}
//                 className="foryou-swipers mt-lg-0 mt-3"
//               >
//                 {section.products.map((product) => (
//                   <SwiperSlide key={product._id}>
//                     <ProductCard product={product} navigate={navigate} location={location} />
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             </div>
//           </div>
//         ))}

//         <div className="mt-5 text-center">
//           <button className="j-back-link" onClick={onBack}>Back to Home</button>
//         </div>
//       </Container>

//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    THANK YOU PAGE
// ───────────────────────────────────────────── */
// function ThankYouPage() {
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)', display: 'flex', flexDirection: 'column' }}>
//       <Header />
//       <main className="flex-grow-1 d-flex justify-content-center align-items-center">
//         <div className="text-center j-reveal">
//           <h2 className="j-hero-title-main mb-3">Thank You!</h2>
//           <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>We are curating your personalized beauty recommendations...</p>
//           <div className="spinner-border mt-4" style={{ color: '#1f2937', width: '3rem', height: '3rem' }} />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    PROFILE RESULT VIEW
// ───────────────────────────────────────────── */
// function ProfileResult({ profileData, onNextFromProfile, onEditQuestion }) {
//   if (!profileData) return null;
//   const { answers, skinType, concern, ingredient, productType, budget, formulation } = profileData;

//   const tagStyle = { display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: '#f3f4f6', color: '#374151', fontSize: 12, fontWeight: 600, marginRight: 6, marginBottom: 6, border: '1px solid #e5e7eb' };
//   const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, marginTop: 16 };
//   const findQId = (field) => answers?.find((a) => a.mappingField === field)?.questionId;

//   const EditBtn = ({ field }) => (
//     <button onClick={() => onEditQuestion(findQId(field))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}>
//       <Edit2 size={14} />
//     </button>
//   );

//   return (
//     <>
//       <div className="j-panel-body page-title-main-name">
//         <p className="j-panel-eyebrow">YOUR PROFILE</p>
//         <h3 className="j-panel-heading page-title-main-name fs-6" style={{ marginBottom: 4 }}>Here's What We Know About You</h3>
//         <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>Based on your answers, we've built your personalised skincare profile.</p>

//         {skinType && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Skin Type</p><EditBtn field="skinType" /></div>
//             <span style={{ ...tagStyle, background: '#1f2937', color: 'white', border: 'none' }}>{skinType.charAt(0).toUpperCase() + skinType.slice(1)}</span>
//           </>
//         )}
//         {concern?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Skin Concern</p><EditBtn field="concern" /></div>
//             <div>{concern.map((c, i) => <span key={i} style={tagStyle}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>)}</div>
//           </>
//         )}
//         {productType?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Looking For</p><EditBtn field="productType" /></div>
//             <div>{productType.map((p, i) => <span key={i} style={tagStyle}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>)}</div>
//           </>
//         )}
//         {formulation && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Formulation</p><EditBtn field="formulation" /></div>
//             <span style={tagStyle}>{formulation.charAt(0).toUpperCase() + formulation.slice(1)}</span>
//           </>
//         )}
//         {ingredient?.length > 0 && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Key Ingredient</p><EditBtn field="ingredient" /></div>
//             <div>{ingredient.map((ing, i) => <span key={i} style={tagStyle}>{ing.charAt(0).toUpperCase() + ing.slice(1)}</span>)}</div>
//           </>
//         )}
//         {budget && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Budget</p><EditBtn field="budget" /></div>
//             <span style={tagStyle}>
//               {budget === 'under500' ? 'Under Rs 500' : budget === '500to1000' ? 'Rs 500 – Rs 1000' : budget === '1000to2000' ? 'Rs 1000 – Rs 2000' : budget === 'above2000' ? 'Rs 2000+' : budget}
//             </span>
//           </>
//         )}
//         {answers?.length > 0 && (
//           <>
//             <p style={{ ...sectionLabel, marginTop: 24 }}>Your Answers</p>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {answers.map((ans, i) => (
//                 <div key={ans._id || i} style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     <span style={{ fontSize: 12, color: '#6b7280' }}>{ans.questionText || ans.mappingField}</span>
//                     <button onClick={() => onEditQuestion(ans.questionId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}><Edit2 size={14} /></button>
//                   </div>
//                   <div className="mt-2 mb-2">
//                     <span style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', background: '#e5e7eb', padding: '2px 10px 5px 10px', borderRadius: 12 }}>{ans.value}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//       <div className="j-panel-cta-area">
//         <button className="j-quiz-btn page-title-main-name" onClick={onNextFromProfile}>Next</button>
//       </div>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    SIDE PANEL
// ───────────────────────────────────────────── */
// function SidePanel({ isOpen, isClosing, onClose, showQuizContent, quizData, loading, error, currentQuestionIndex, selectedAnswers, expandedOption, onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz, onStartQuiz, profileData, profileLoading, showProfile, onNextFromProfile, onEditQuestion }) {
//   if (!isOpen) return null;
//   const currentQuestion = quizData?.[currentQuestionIndex];

//   return (
//     <>
//       <div className="j-backdrop" onClick={onClose} />
//       <div className={`j-panel${isClosing ? ' closing' : ''}`}>
//         <div className="j-panel-header">
//           <h2 className="j-panel-title page-title-main-name">For You</h2>
//           <button className="j-panel-close page-title-main-name" onClick={onClose}><X size={22} /></button>
//         </div>

//         {showProfile ? (
//           profileLoading
//             ? <div className="j-panel-body page-title-main-name"><div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#6b7280' }}>Building your profile...</p></div></div>
//             : <ProfileResult profileData={profileData} onNextFromProfile={onNextFromProfile} onEditQuestion={onEditQuestion} />
//         ) : (
//           <>
//             <div className="j-panel-body page-title-main-name">
//               {loading ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#6b7280' }}>Loading...</p></div>
//               ) : error ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#ef4444' }}>{error}</p></div>
//               ) : showQuizContent && quizData ? (
//                 <>
//                   <div style={{ marginBottom: 20 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>Question {currentQuestionIndex + 1} of {quizData.length}</span>
//                       <span style={{ fontSize: 12, color: '#6b7280' }}>{Math.round(((currentQuestionIndex + 1) / quizData.length) * 100)}%</span>
//                     </div>
//                     <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2 }}>
//                       <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`, background: '#1f2937', borderRadius: 2, transition: 'width 0.4s ease' }} />
//                     </div>
//                   </div>

//                   <p className="j-panel-eyebrow" style={{ marginBottom: 8 }}>SKINCARE QUIZ</p>
//                   <h3 className="j-panel-heading fs-6" style={{ marginBottom: 12 }}>{currentQuestion?.questionText}</h3>
//                   {currentQuestion?.description && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>{currentQuestion.description}</p>}

//                   <div style={{ marginBottom: 24 }}>
//                     {currentQuestion?.options.map((option) => {
//                       const isSelected = selectedAnswers[currentQuestion._id] === option.value;
//                       const isExpanded = expandedOption === option._id;
//                       return (
//                         <div key={option._id} style={{ marginBottom: 12, border: `2px solid ${isSelected ? '#1f2937' : '#e5e7eb'}`, borderRadius: 8, background: isSelected ? '#f9fafb' : 'white', overflow: 'hidden' }}>
//                           <div onClick={() => onToggleExpand(option._id)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isExpanded ? '#f3f4f6' : 'transparent' }}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
//                               <div onClick={(e) => { e.stopPropagation(); onOptionSelect(currentQuestion._id, option.value); }} style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSelected ? '#1f2937' : '#d1d5db'}`, background: isSelected ? '#1f2937' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                                 {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
//                               </div>
//                               <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#374151' }}>{option.label}</h5>
//                             </div>
//                             {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                           </div>
//                           {isExpanded && (
//                             <div style={{ padding: '0 16px 16px 48px' }}>
//                               <p style={{ fontSize: 13, color: '#6b7280', margin: '12px 0 0 0', lineHeight: 1.5 }}>{option.subtext}</p>
//                               {!isSelected
//                                 ? <button onClick={() => onOptionSelect(currentQuestion._id, option.value)} style={{ marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#1f2937', background: 'transparent', border: '1px solid #1f2937', borderRadius: 6, cursor: 'pointer' }}>Select This Option</button>
//                                 : <div style={{ marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: 'white', background: '#1f2937', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />Selected</div>}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
//                     <button onClick={onPrevQuestion} disabled={currentQuestionIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'transparent', border: 'none', color: currentQuestionIndex === 0 ? '#9ca3af' : '#374151', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}>
//                       <ChevronLeft size={18} /> Previous
//                     </button>
//                     <button onClick={() => onSubmitQuiz(currentQuestionIndex === quizData.length - 1)} disabled={!selectedAnswers[currentQuestion?._id]} style={{ padding: '10px 24px', background: selectedAnswers[currentQuestion?._id] ? '#1f2937' : '#9ca3af', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: selectedAnswers[currentQuestion?._id] ? 'pointer' : 'not-allowed' }}>
//                       Submit
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <p className="j-panel-eyebrow">FOR YOU</p>
//                   <h3 className="j-panel-heading page-title-main-name fs-6">Your Tailored Shopping Experience</h3>
//                   <div className="j-collage">
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face1/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face2/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face3/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face4/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face5/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                     <div className="j-collage-col">
//                       <img src="https://picsum.photos/seed/face6/200/200" alt="" referrerPolicy="no-referrer" />
//                       <img src="https://picsum.photos/seed/face7/200/200" alt="" referrerPolicy="no-referrer" />
//                     </div>
//                   </div>
//                   <h4 className="page-title-main-name" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>Let's Get Personal</h4>
//                   <p className="page-title-main-name" style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Answer these questions to unlock a customised Joyory Experience, Just For You</p>
//                 </>
//               )}
//             </div>
//             {!showQuizContent && (
//               <div className="j-panel-cta-area">
//                 <button className="j-quiz-btn page-title-main-name" onClick={onStartQuiz}>Take The Quiz</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    HOME PAGE
// ───────────────────────────────────────────── */
// function HomePage({ onOpenPanel, isPanelOpen, isClosing, onClosePanel, showQuizContent, quizData, loading, error, currentQuestionIndex, selectedAnswers, expandedOption, onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz, introData, introLoading, onCategoryClick, onStartQuiz, profileData, profileLoading, showProfile, onNextFromProfile, onEditQuestion, hasCompletedQuiz, quizCheckLoading }) {

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)' }}>
//       <Header />
//       <main style={{ position: 'relative' }}>
//         <div className="py-5 text-center container-lg">
//           <div className="mb-5 j-reveal">
//             <h2 className="j-hero-title-pre"><em>Not Sure</em>,</h2>
//             <h3 className="j-hero-title-main">Where to Start? <span className="j-hero-title-light">Let's Help</span></h3>
//           </div>
//           <Row className="justify-content-center g-5">
//             {introLoading || quizCheckLoading ? (
//               <Col xs={12} className="text-center">
//                 <div className="spinner-border text-dark mb-3" role="status" />
//                 <p style={{ color: '#6b7280', fontSize: 14 }}>Loading categories...</p>
//               </Col>
//             ) : introData?.length > 0 ? (
//               introData.map((item) => (
//                 <Col key={item._id} md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick(item.title)}>
//                     <div className="j-cat-img-wrap"><img src={item.image} alt={item.title} referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">{item.title}</h4>
//                     {item.title.toLowerCase().includes('skincare') && hasCompletedQuiz && (
//                       <div style={{
//                         marginTop: '8px',
//                         padding: '4px 12px',
//                         background: '#10b981',
//                         color: 'white',
//                         borderRadius: '20px',
//                         fontSize: '12px',
//                         display: 'inline-block',
//                         fontWeight: '600'
//                       }}>
//                         ✓ Quiz Completed - View Recommendations
//                       </div>
//                     )}
//                   </div>
//                 </Col>
//               ))
//             ) : (
//               <>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Makeup')}>
//                     <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/makeup-main/800/1000" alt="Makeup" referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">Makeup</h4>
//                   </div>
//                 </Col>
//                 <Col md={5} className="j-reveal">
//                   <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Skincare')}>
//                     <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/skincare-main/800/1000" alt="Skincare" referrerPolicy="no-referrer" /></div>
//                     <h4 className="j-cat-label">Skincare</h4>
//                     {hasCompletedQuiz && (
//                       <div style={{
//                         marginTop: '8px',
//                         padding: '4px 12px',
//                         background: '#10b981',
//                         color: 'white',
//                         borderRadius: '20px',
//                         fontSize: '12px',
//                         display: 'inline-block',
//                         fontWeight: '600'
//                       }}>
//                         ✓ Quiz Completed - View Recommendations
//                       </div>
//                     )}
//                   </div>
//                 </Col>
//               </>
//             )}
//           </Row>
//         </div>
//         <SidePanel
//           isOpen={isPanelOpen} isClosing={isClosing} onClose={onClosePanel}
//           showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
//           currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
//           onOptionSelect={onOptionSelect} onToggleExpand={onToggleExpand} onPrevQuestion={onPrevQuestion}
//           onSubmitQuiz={onSubmitQuiz} onStartQuiz={onStartQuiz}
//           profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
//           onNextFromProfile={onNextFromProfile} onEditQuestion={onEditQuestion}
//         />
//         {!isPanelOpen && <button className="j-float-btn" onClick={onOpenPanel}>Personalize</button>}
//       </main>
//       <Footer />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    ROOT COMPONENT
// ───────────────────────────────────────────── */
// export default function Foryoulanding() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(UserContext);

//   const [view, setView] = useState('home');
//   const [isPanelOpen, setIsPanelOpen] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);
//   const [showQuizContent, setShowQuizContent] = useState(false);
//   const [quizData, setQuizData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [expandedOption, setExpandedOption] = useState(null);
//   const [introData, setIntroData] = useState([]);
//   const [introLoading, setIntroLoading] = useState(true);
//   const [profileData, setProfileData] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);

//   // State to track if user has completed the quiz
//   const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
//   const [quizCheckLoading, setQuizCheckLoading] = useState(true);

//   // Check if user has completed the skincare quiz - AUTO REDIRECT IF COMPLETED
//   // useEffect(() => {
//   //   const checkQuizCompletion = async () => {
//   //     if (!user || user.guest) {
//   //       setHasCompletedQuiz(false);
//   //       setQuizCheckLoading(false);
//   //       return;
//   //     }

//   //     try {
//   //       const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { 
//   //         credentials: 'include',
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //         }
//   //       });
//   //       const json = await res.json();

//   //       // Check if json.data is NOT empty (meaning quiz is completed)
//   //       const isDataNotEmpty = json.success && json.data && (
//   //         json.data.skinType || 
//   //         (json.data.answers && json.data.answers.length > 0) ||
//   //         (json.data.concern && json.data.concern.length > 0)
//   //       );

//   //       setHasCompletedQuiz(isDataNotEmpty);

//   //       if (isDataNotEmpty) {
//   //         setProfileData(json.data);
//   //         // AUTO REDIRECT TO RECOMMENDATIONS PAGE IF QUIZ IS COMPLETED
//   //         setView('recommendations');
//   //       }
//   //     } catch (e) {
//   //       console.error('Error checking quiz completion:', e);
//   //       setHasCompletedQuiz(false);
//   //     } finally {
//   //       setQuizCheckLoading(false);
//   //     }
//   //   };

//   //   checkQuizCompletion();
//   // }, [user]);


//   useEffect(() => {
//     const checkQuizCompletion = async () => {
//       // ✅ 1. LOGIN CHECK (FIRST PRIORITY)
//       if (!user || user.guest) {
//         setHasCompletedQuiz(false);
//         setQuizCheckLoading(false);

//         // 🔥 Redirect to login
//         navigate('/login', { state: { from: location.pathname } });
//         return;
//       }

//       try {
//         const res = await fetch(
//           'https://beauty.joyory.com/api/user/for-you/skincare/profile',
//           {
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         const json = await res.json();

//         // ✅ 2. CHECK IF DATA IS EMPTY
//         const isDataEmpty =
//           !json?.data ||
//           Object.keys(json.data).length === 0 ||
//           (!json.data.skinType &&
//             (!json.data.answers || json.data.answers.length === 0) &&
//             (!json.data.concern || json.data.concern.length === 0));

//         // ✅ 3. IF EMPTY → SHOW QUIZ (HOME PAGE)
//         if (isDataEmpty) {
//           setHasCompletedQuiz(false);
//           setView('home'); // stay on landing (quiz first)
//         } else {
//           // ✅ 4. IF DATA EXISTS → GO TO RECOMMENDATIONS
//           setHasCompletedQuiz(true);
//           setProfileData(json.data);
//           setView('recommendations');
//         }
//       } catch (e) {
//         console.error('Error checking quiz completion:', e);
//         setHasCompletedQuiz(false);
//       } finally {
//         setQuizCheckLoading(false);
//       }
//     };

//     checkQuizCompletion();
//   }, [user, navigate, location.pathname]);

//   // Check if user is logged in when view changes to recommendations
//   useEffect(() => {
//     if (view === 'recommendations' && (!user || user.guest)) {
//       navigate('/login', { state: { from: location.pathname } });
//     }
//   }, [view, user, navigate, location]);

//   useEffect(() => {
//     (async () => {
//       try {
//         setInitialLoading(false);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setInitialLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/intro');
//         const json = await res.json();
//         if (json.success && Array.isArray(json.data)) setIntroData(json.data.sort((a, b) => a.displayOrder - b.displayOrder));
//       } catch (e) { console.error(e); }
//       finally { setIntroLoading(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     if (view === 'thankyou') {
//       const t = setTimeout(() => setView('recommendations'), 3000);
//       return () => clearTimeout(t);
//     }
//   }, [view]);

//   const fetchQuizData = async () => {
//     setLoading(true); setError(null);
//     try {
//       const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/questions');
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const sorted = json.data.sort((a, b) => a.displayOrder - b.displayOrder);
//         setQuizData(sorted); setCurrentQuestionIndex(0);
//         if (sorted[0]?.options?.length > 0) {
//           setSelectedAnswers({ [sorted[0]._id]: sorted[0].options[0].value });
//           setExpandedOption(sorted[0].options[0]._id);
//         }
//       } else setError('Failed to load questions');
//     } catch (e) { setError('Error loading quiz'); console.error(e); }
//     finally { setLoading(false); }
//   };

//   const handleSubmitQuiz = async (isFinalStep = true) => {
//     if (!quizData) return;
//     const answersPayload = quizData.map((q) => {
//       const val = selectedAnswers[q._id];
//       const opt = q.options.find((o) => o.value === val);
//       return { questionId: q._id, questionText: q.questionText || '', mappingField: opt?.mappingField || '', value: val || '', label: opt?.label || '', subtext: opt?.subtext || '' };
//     }).filter((a) => a.value);

//     if (!isFinalStep) {
//       fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answers: answersPayload }) }).catch(console.error);
//       const next = currentQuestionIndex + 1; setCurrentQuestionIndex(next);
//       const q = quizData[next];
//       if (q && !selectedAnswers[q._id] && q.options?.length > 0) {
//         setSelectedAnswers((prev) => ({ ...prev, [q._id]: q.options[0].value }));
//         setExpandedOption(q.options[0]._id);
//       }
//       return;
//     }

//     setShowQuizContent(false); setShowProfile(true); setProfileLoading(true);
//     try {
//       const sr = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answers: answersPayload }) });
//       const submitResult = await sr.json();
//       if (!submitResult.success) throw new Error('Submit failed');

//       const pr = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//       const pj = await pr.json();
//       if (pj.success && pj.data) {
//         setProfileData(pj.data);
//         setHasCompletedQuiz(true);
//       } else throw new Error('Profile fetch failed');
//     } catch (e) { console.error(e); }
//     finally { setProfileLoading(false); }
//   };

//   const handleCategoryClick = (category) => {
//     if (category.toLowerCase().includes('makeup')) {
//       navigate('/makeupquiz');
//     } else {
//       // For Skincare category
//       if ((!user || user.guest) && view === 'recommendations') {
//         navigate('/login', { state: { from: location.pathname } });
//         return;
//       }

//       if (hasCompletedQuiz) {
//         // If user has already completed the quiz, go directly to recommendations
//         setView('recommendations');
//       } else {
//         // If user hasn't completed the quiz, open the quiz panel
//         setIsPanelOpen(true);
//         setShowQuizContent(false);
//         setShowProfile(false);
//       }
//     }
//   };

//   const closePanel = () => { setIsClosing(true); setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); }, 280); };

//   const handleClosePanel = () => { closePanel(); setTimeout(() => { setShowQuizContent(false); setShowProfile(false); }, 350); };

//   const handleNextFromProfile = () => {
//     setIsClosing(true);
//     setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); setView('thankyou'); setShowQuizContent(false); setShowProfile(false); }, 280);
//   };

//   const handleEditQuestion = async (questionId) => {
//     if (!quizData) await fetchQuizData();
//     const index = quizData?.findIndex((q) => q._id === questionId);
//     if (index !== undefined && index !== -1) {
//       if (view !== 'home') setView('home');
//       setIsPanelOpen(true); setShowQuizContent(true); setShowProfile(false); setCurrentQuestionIndex(index);
//       const answer = profileData?.answers?.find((a) => a.questionId === questionId);
//       if (answer) setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer.value }));
//     }
//   };

//   const handleBannerClick = async () => {
//     if (!user || user.guest) {
//       navigate('/login', { state: { from: location.pathname } });
//       return;
//     }

//     setView('home');
//     if (!profileData) {
//       setProfileLoading(true);
//       try {
//         const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
//         const json = await res.json();
//         if (json.success && json.data) {
//           setProfileData(json.data);
//           setHasCompletedQuiz(true);
//         }
//       } catch (e) { console.error(e); }
//       finally { setProfileLoading(false); }
//     }
//     setIsPanelOpen(true); setShowProfile(true); setShowQuizContent(false);
//   };

//   const handleOpenPanel = () => {
//     if (!user || user.guest) {
//       navigate('/login', { state: { from: location.pathname } });
//       return;
//     }
//     setIsPanelOpen(true);
//     setShowQuizContent(false);
//     setShowProfile(false);
//   };

//   if (initialLoading) {
//     return (
//       <div style={{ minHeight: '100vh', background: 'var(--j-cream)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         <div className="text-center">
//           <div className="spinner-border text-dark mb-3" role="status" />
//           <p className="text-muted">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {view === 'thankyou' ? (
//         <ThankYouPage />
//       ) : view === 'recommendations' ? (
//         <RecommendationsPage onBack={() => setView('home')} onBannerClick={handleBannerClick} />
//       ) : (
//         <HomePage
//           onOpenPanel={handleOpenPanel}
//           isPanelOpen={isPanelOpen} isClosing={isClosing} onClosePanel={handleClosePanel}
//           showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
//           currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
//           onOptionSelect={(qId, val) => setSelectedAnswers((prev) => ({ ...prev, [qId]: val }))}
//           onToggleExpand={(optId) => setExpandedOption((prev) => (prev === optId ? null : optId))}
//           onPrevQuestion={() => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1); }}
//           onSubmitQuiz={handleSubmitQuiz}
//           introData={introData} introLoading={introLoading} onCategoryClick={handleCategoryClick}
//           onStartQuiz={() => { setShowQuizContent(true); setShowProfile(false); fetchQuizData(); }}
//           profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
//           onNextFromProfile={handleNextFromProfile} onEditQuestion={handleEditQuestion}
//           hasCompletedQuiz={hasCompletedQuiz}
//           quizCheckLoading={quizCheckLoading}
//         />
//       )}
//     </>
//   );
// }



















import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ChevronLeft, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { Container, Row, Col } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Foryoulanding.css';
import '../css/Foryou.css';
import Header from './Header';
import Footer from './Footer';
import FoyoulandingImg from '../assets/Foyoulanding.jpg';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { UserContext } from './UserContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import 'react-toastify/dist/ReactToastify.css';
import bagIcon from '../assets/bag.svg';
import { FaChevronDown } from 'react-icons/fa';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

/* ─────────────────────────────────────────────
   SHARED CONSTANTS & HELPERS
───────────────────────────────────────────── */
const WISHLIST_CACHE_KEY = 'guestWishlist';
const CART_API_BASE = 'https://beauty.joyory.com/api/user/cart';

const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

const isValidHexColor = (hex) => {
    if (!hex || typeof hex !== 'string') return false;
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
};

const getVariantDisplayText = (variant) =>
    (variant?.shadeName || variant?.name || variant?.size || variant?.ml || variant?.weight || 'Default').toUpperCase();

const groupVariantsByType = (variants) => {
    const grouped = { color: [], text: [] };
    (variants || []).forEach((v) => {
        if (!v) return;
        if (v.hex && isValidHexColor(v.hex)) grouped.color.push(v);
        else grouped.text.push(v);
    });
    return grouped;
};

const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(price || 0));

/* ─────────────────────────────────────────────
   PRODUCT CARD  (identical design to Foryou.jsx)
───────────────────────────────────────────── */
function ProductCard({ product, navigate, location }) {
    const { user } = useContext(UserContext);

    const allVariants = useMemo(
        () => product?.variants || product?.shadeOptions || [],
        [product]
    );

    const [selectedVariant, setSelectedVariant] = useState(
        () => product?.selectedVariant || allVariants[0] || {}
    );
    const [variantSelected, setVariantSelected] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [wishlistData, setWishlistData] = useState([]);
    const [showVariantOverlay, setShowVariantOverlay] = useState(false);
    const [selectedVariantType, setSelectedVariantType] = useState('all');

    /* wishlist helpers */
    const isInWishlist = useCallback(
        (productId, sku) =>
            wishlistData.some((i) => (i.productId === productId || i._id === productId) && i.sku === sku),
        [wishlistData]
    );

    const fetchWishlistData = useCallback(async () => {
        try {
            if (user && !user.guest) {
                const res = await axios.get('https://beauty.joyory.com/api/user/wishlist', { withCredentials: true });
                if (res.data.success) setWishlistData(res.data.wishlist || []);
            } else {
                const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
                setWishlistData(local.map((i) => ({ productId: i._id, _id: i._id, sku: i.sku })));
            }
        } catch { setWishlistData([]); }
    }, [user]);

    useEffect(() => { fetchWishlistData(); }, [fetchWishlistData]);

    /* computed */
    const displayPrice = parseFloat(
        selectedVariant?.displayPrice || selectedVariant?.discountedPrice || selectedVariant?.price || product?.price || 0
    );
    const originalPrice = parseFloat(
        selectedVariant?.originalPrice || selectedVariant?.mrp || product?.mrp || displayPrice
    );
    let discountPercent = parseFloat(selectedVariant?.discountPercent || product?.discountPercent || 0);
    if (!discountPercent && originalPrice > displayPrice)
        discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

    const stock = parseInt(selectedVariant?.stock || product?.stock || 0);
    const outOfStock = stock <= 0;
    const hasVariants = allVariants.length > 0;
    const showSelectVariantBtn = hasVariants && !variantSelected;

    const imageUrl =
        selectedVariant?.images?.[0] || selectedVariant?.image ||
        product?.selectedVariant?.images?.[0] || product?.images?.[0] ||
        'https://placehold.co/400x300/ffffff/cccccc?text=Product';

    const sku = getSku(selectedVariant);
    const productInWishlist = isInWishlist(product?._id, sku);
    const groupedVariants = groupVariantsByType(allVariants);

    const getBrandName = () => {
        if (!product?.brand) return 'Unknown Brand';
        if (typeof product.brand === 'object' && product.brand.name) return product.brand.name;
        return typeof product.brand === 'string' ? product.brand : 'Unknown Brand';
    };

    const getProductSlug = () =>
        product?.slugs?.[0] || product?.slug || product?._id;

    const showToast = (msg, type = 'error') =>
        type === 'success' ? toast.success(msg, { autoClose: 3000 }) : toast.error(msg, { autoClose: 3000 });

    /* actions */
    const handleVariantSelect = (v) => { setSelectedVariant(v); setVariantSelected(true); setShowVariantOverlay(false); };

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            let payload;
            if (hasVariants) {
                if (!selectedVariant || outOfStock) { showToast('Please select an in-stock variant.'); return; }
                payload = { productId: product._id, variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }] };
            } else {
                if (outOfStock) { showToast('Product is out of stock.'); return; }
                payload = { productId: product._id, quantity: 1 };
            }
            const res = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
            if (!res.data.success) throw new Error(res.data.message || 'Failed');
            showToast('Product added to cart!', 'success');
            navigate('/cartpage');
        } catch (err) {
            showToast(err.response?.data?.message || err.message || 'Failed to add product');
            if (err.response?.status === 401) navigate('/login', { state: { from: location?.pathname } });
        } finally { setAddingToCart(false); }
    };

    const handleToggleWishlist = async (e) => {
        e.stopPropagation();
        if (!selectedVariant) { showToast('Please select a variant first'); return; }
        setWishlistLoading(true);
        try {
            const inWl = isInWishlist(product._id, sku);
            if (user && !user.guest) {
                if (inWl) {
                    await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${product._id}`, { withCredentials: true, data: { sku } });
                    showToast('Removed from wishlist!', 'success');
                } else {
                    await axios.post(`https://beauty.joyory.com/api/user/wishlist/${product._id}`, { sku }, { withCredentials: true });
                    showToast('Added to wishlist!', 'success');
                }
                await fetchWishlistData();
            } else {
                const local = JSON.parse(localStorage.getItem('guestWishlist')) || [];
                if (inWl) {
                    localStorage.setItem('guestWishlist', JSON.stringify(local.filter((i) => !(i._id === product._id && i.sku === sku))));
                    showToast('Removed from wishlist!', 'success');
                } else {
                    local.push({ _id: product._id, name: product.name, sku, image: imageUrl, displayPrice, originalPrice });
                    localStorage.setItem('guestWishlist', JSON.stringify(local));
                    showToast('Added to wishlist!', 'success');
                }
                await fetchWishlistData();
            }
        } catch (err) {
            if (err.response?.status === 401) { showToast('Please login to use wishlist'); navigate('/login'); }
            else showToast('Failed to update wishlist');
        } finally { setWishlistLoading(false); }
    };

    const buttonText = addingToCart ? 'Adding...' : showSelectVariantBtn ? 'Select Variant' : outOfStock ? 'Out of Stock' : 'Add to Bag';
    const buttonDisabled = addingToCart || outOfStock;

    return (
        <div className="foryou-card-wrapper">
            <div className="foryou-card">
                {/* Image */}
                <div
                    className="foryou-img-wrapper"
                    onClick={() => navigate(`/product/${getProductSlug()}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src={imageUrl}
                        alt={product?.name || 'Product'}
                        className="foryou-img img-fluid"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/ffffff/cccccc?text=Product'; }}
                    />

                    {/* Wishlist */}
                    <button className='bg-transparent'
                        onClick={handleToggleWishlist}
                        disabled={wishlistLoading}
                        style={{
                            position: 'absolute', top: '10px', right: '10px',
                            cursor: wishlistLoading ? 'not-allowed' : 'pointer',
                            color: productInWishlist ? '#dc3545' : '#ccc',
                            fontSize: '22px', zIndex: 2,
                            backgroundColor: 'none !important', borderRadius: '50%',
                            width: '45px', height: '45px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.3s ease', border: 'none', outline: 'none',
                        }}
                    >
                        {wishlistLoading
                            ? <div className="spinner-border spinner-border-sm" role="status" />
                            : productInWishlist ? <FaHeart /> : <FaRegHeart />}
                    </button>

                    {selectedVariant?.promoApplied && (
                        <div className="promo-badge"><i className="bi bi-tag-fill me-1" />Promo</div>
                    )}
                </div>

                {/* Info */}
                <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
                    <div className="justify-content-between d-flex flex-column" style={{ height: '220px' }}>
                        <div className="brand-name small text-muted mb-1 mt-2 text-start">{getBrandName()}</div>

                        <h6
                            className="foryou-name font-family-Poppins m-0 p-0"
                            onClick={() => navigate(`/product/${getProductSlug()}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            {product?.name || 'Unnamed Product'}
                        </h6>

                        {hasVariants && (
                            <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
                                {variantSelected ? (
                                    <div
                                        className="selected-variant-display text-muted small"
                                        style={{ cursor: 'pointer', display: 'inline-block' }}
                                        onClick={(e) => { e.stopPropagation(); setShowVariantOverlay(true); }}
                                    >
                                        Variant: <span className="fw-bold text-dark">{getVariantDisplayText(selectedVariant)}</span>
                                        <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
                                    </div>
                                ) : (
                                    <div className="small text-muted" style={{ height: '20px' }}>{allVariants.length} Variants Available</div>
                                )}
                            </div>
                        )}

                        <div className="price-section mb-3 mt-auto">
                            <div className="d-flex align-items-baseline flex-wrap">
                                <span className="current-price fw-400 fs-5">{formatPrice(displayPrice)}</span>
                                {originalPrice > displayPrice && (
                                    <>
                                        <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">{formatPrice(originalPrice)}</span>
                                        <span className="discount-percent text-danger fw-bold ms-2">({discountPercent}% OFF)</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="cart-section">
                            <button
                                className={`btn w-100 d-flex align-items-center justify-content-center gap-2 addtocartbuttton page-title-main-name ${addingToCart ? "btn-dark" : "btn-outline-dark"
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (showSelectVariantBtn) setShowVariantOverlay(true);
                                    else handleAddToCart();
                                }}
                                disabled={buttonDisabled}
                            >
                                {addingToCart ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        {buttonText}
                                        {!buttonDisabled && !addingToCart && !showSelectVariantBtn && (
                                            <img src={bagIcon} className="img-fluid ms-1 bag-icon" style={{ height: 20 }} />
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Variant Overlay */}
            {showVariantOverlay && (
                <div className="variant-overlay" onClick={() => setShowVariantOverlay(false)}>
                    <div
                        className="variant-overlay-content p-0"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '100%', maxWidth: '500px', maxHeight: '100vh', background: '#fff', borderRadius: '0px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                    >
                        <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                            <h5 className="m-0 page-title-main-name">Select Variant ({allVariants.length})</h5>
                            <button onClick={() => setShowVariantOverlay(false)} style={{ background: 'none', border: 'none', fontSize: '24px' }}>×</button>
                        </div>

                        <div className="variant-tabs d-flex">
                            <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === 'all' ? 'active' : ''}`} onClick={() => setSelectedVariantType('all')}>All ({allVariants.length})</button>
                            {groupedVariants.color.length > 0 && (
                                <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === 'color' ? 'active' : ''}`} onClick={() => setSelectedVariantType('color')}>Colors ({groupedVariants.color.length})</button>
                            )}
                            {groupedVariants.text.length > 0 && (
                                <button className={`variant-tab flex-fill py-3 ${selectedVariantType === 'text' ? 'active' : ''}`} onClick={() => setSelectedVariantType('text')}>Sizes ({groupedVariants.text.length})</button>
                            )}
                        </div>

                        <div className="p-3 overflow-auto flex-grow-1 p-0 m-0">
                            {(selectedVariantType === 'all' || selectedVariantType === 'color') && groupedVariants.color.length > 0 && (
                                <div className="row row-col-4 mt-3">
                                    {groupedVariants.color.map((v) => {
                                        const isSel = sku === getSku(v);
                                        const isOOS = (v.stock ?? 0) <= 0;
                                        return (
                                            <div className="col-lg-4 col-6" key={getSku(v)}>
                                                <div className="text-center" style={{ cursor: isOOS ? 'not-allowed' : 'pointer' }} onClick={() => !isOOS && handleVariantSelect(v)}>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '20%', backgroundColor: v.hex || '#ccc', margin: '0 auto 8px', border: isSel ? '2px solid #000' : '1px solid #ddd', opacity: isOOS ? 0.5 : 1, position: 'relative' }}>
                                                        {isSel && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 'bold' }}>✓</span>}
                                                    </div>
                                                    <div className="small page-title-main-name" style={{ fontSize: '12px' }}>{getVariantDisplayText(v)}</div>
                                                    {isOOS && <div className="text-danger small">Out of Stock</div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {(selectedVariantType === 'all' || selectedVariantType === 'text') && groupedVariants.text.length > 0 && (
                                <div className="row row-cols-3 g-0">
                                    {groupedVariants.text.map((v) => {
                                        const isSel = sku === getSku(v);
                                        const isOOS = (v.stock ?? 0) <= 0;
                                        return (
                                            <div className="col-lg-3 col-5" key={getSku(v)}>
                                                <div className="text-center" style={{ cursor: isOOS ? 'not-allowed' : 'pointer' }} onClick={() => !isOOS && handleVariantSelect(v)}>
                                                    <div style={{ padding: '10px', borderRadius: '8px', border: isSel ? '2px solid #000' : '1px solid #ddd', background: isSel ? '#f8f9fa' : '#fff', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isOOS ? 0.5 : 1 }}>
                                                        {getVariantDisplayText(v)}
                                                    </div>
                                                    {isOOS && <div className="text-danger small mt-1">Out of Stock</div>}
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
    );
}

/* ─────────────────────────────────────────────
   RECOMMENDATIONS PAGE
───────────────────────────────────────────── */
function RecommendationsPage({ onBack, onBannerClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.guest) {
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [user, navigate, location]);

    useEffect(() => {
        if (!user || user.guest) return;

        (async () => {
            try {
                const res = await fetch('https://beauty.joyory.com/api/user/recommendations/personal-summary', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const json = await res.json();
                if (json.success) setData(json);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    if (!user || user.guest) {
        return null;
    }

    if (loading)
        return (
            <div
                className="fullscreen-loader page-title-main-name"
                style={{
                    minHeight: "100vh",
                    width: "100%",
                }}
            >
                <div className="text-center">
                    <DotLottieReact className='foryoulanding-css'
                        src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                        loop
                        autoplay
                    />
                    <p className="text-muted mb-0">
                        Please wait while we prepare the best products for you...
                    </p>
                </div>
            </div>
        )

    if (!data) {
        return (
            <div style={{ minHeight: '100vh', background: '#fff' }}>
                <Header />
                <Container className="py-5 text-center">
                    <h3>No recommendations found right now.</h3>
                    <button className="j-back-link mt-4" onClick={onBack}>Back to Home</button>
                </Container>
                <Footer />
            </div>
        );
    }

    const productSections = (data.sections || []).filter((s) => s.key !== 'banner' && s.products?.length > 0);

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--j-font-sans)' }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Header />

            <Container fluid className="py-5">
                <div className="mb-lg-5 mb-4 text-center mt-lg-5 pt-lg-3 padding-left-rightss" style={{ cursor: 'pointer' }} onClick={onBannerClick}>
                    <img src={FoyoulandingImg} alt="Personalize Your Experience" className="img-fluid mt-5" style={{ maxHeight: 'auto', width: '100%' }} />
                </div>

                {productSections.map((section) => (
                    <div key={section.key} className="mb-lg-5">
                        <h2 className="font-familys text-start foryou-heading ms-lg-3 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-3 fw-normal">
                            {section.title}
                        </h2>

                        <div className="mobile-responsive-code position-relative">
                            <Swiper
                                modules={[Autoplay, Pagination, Navigation]}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
                                breakpoints={{
                                    300: { slidesPerView: 2, spaceBetween: 10 },
                                    576: { slidesPerView: 2.5, spaceBetween: 15 },
                                    768: { slidesPerView: 3, spaceBetween: 15 },
                                    992: { slidesPerView: 4, spaceBetween: 20 },
                                    1200: { slidesPerView: 4, spaceBetween: 25 },
                                }}
                                className="foryou-swipers mt-lg-0 mt-3"
                            >
                                {section.products.map((product) => (
                                    <SwiperSlide key={product._id}>
                                        <ProductCard product={product} navigate={navigate} location={location} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                ))}

                <div className="mt-5 text-center">
                    <button className="j-back-link" onClick={onBack}>Back to Home</button>
                </div>
            </Container>

            <Footer />
        </div>
    );
}

/* ─────────────────────────────────────────────
   THANK YOU PAGE
───────────────────────────────────────────── */
function ThankYouPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="text-center j-reveal">
                    <h2 className="j-hero-title-main mb-3">Thank You!</h2>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>We are curating your personalized beauty recommendations...</p>
                    <div className="spinner-border mt-4" style={{ color: '#1f2937', width: '3rem', height: '3rem' }} />
                </div>
            </main>
            <Footer />
        </div>
    );
}

/* ─────────────────────────────────────────────
   PROFILE RESULT VIEW
───────────────────────────────────────────── */
function ProfileResult({ profileData, onNextFromProfile, onEditQuestion }) {
    if (!profileData) return null;
    const { answers, skinType, concern, ingredient, productType, budget, formulation } = profileData;

    const tagStyle = { display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: '#f3f4f6', color: '#374151', fontSize: 12, fontWeight: 600, marginRight: 6, marginBottom: 6, border: '1px solid #e5e7eb' };
    const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, marginTop: 16 };
    const findQId = (field) => answers?.find((a) => a.mappingField === field)?.questionId;

    const EditBtn = ({ field }) => (
        <button onClick={() => onEditQuestion(findQId(field))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}>
            <Edit2 size={14} />
        </button>
    );

    return (
        <>
            <div className="j-panel-body page-title-main-name">
                <p className="j-panel-eyebrow">YOUR PROFILE</p>
                <h3 className="j-panel-heading page-title-main-name fs-6" style={{ marginBottom: 4 }}>Here's What We Know About You</h3>
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>Based on your answers, we've built your personalised skincare profile.</p>

                {skinType && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Skin Type</p><EditBtn field="skinType" /></div>
                        <span style={{ ...tagStyle, background: '#1f2937', color: 'white', border: 'none' }}>{skinType.charAt(0).toUpperCase() + skinType.slice(1)}</span>
                    </>
                )}
                {concern?.length > 0 && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Skin Concern</p><EditBtn field="concern" /></div>
                        <div>{concern.map((c, i) => <span key={i} style={tagStyle}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>)}</div>
                    </>
                )}
                {productType?.length > 0 && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Looking For</p><EditBtn field="productType" /></div>
                        <div>{productType.map((p, i) => <span key={i} style={tagStyle}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>)}</div>
                    </>
                )}
                {formulation && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Formulation</p><EditBtn field="formulation" /></div>
                        <span style={tagStyle}>{formulation.charAt(0).toUpperCase() + formulation.slice(1)}</span>
                    </>
                )}
                {ingredient?.length > 0 && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Key Ingredient</p><EditBtn field="ingredient" /></div>
                        <div>{ingredient.map((ing, i) => <span key={i} style={tagStyle}>{ing.charAt(0).toUpperCase() + ing.slice(1)}</span>)}</div>
                    </>
                )}
                {budget && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><p style={sectionLabel}>Budget</p><EditBtn field="budget" /></div>
                        <span style={tagStyle}>
                            {budget === 'under500' ? 'Under Rs 500' : budget === '500to1000' ? 'Rs 500 – Rs 1000' : budget === '1000to2000' ? 'Rs 1000 – Rs 2000' : budget === 'above2000' ? 'Rs 2000+' : budget}
                        </span>
                    </>
                )}
                {answers?.length > 0 && (
                    <>
                        <p style={{ ...sectionLabel, marginTop: 24 }}>Your Answers</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {answers.map((ans, i) => (
                                <div key={ans._id || i} style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <span style={{ fontSize: 12, color: '#6b7280' }}>{ans.questionText || ans.mappingField}</span>
                                        <button onClick={() => onEditQuestion(ans.questionId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1f2937' }}><Edit2 size={14} /></button>
                                    </div>
                                    <div className="mt-2 mb-2">
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', background: '#e5e7eb', padding: '2px 10px 5px 10px', borderRadius: 12 }}>{ans.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="j-panel-cta-area">
                <button className="j-quiz-btn page-title-main-name" onClick={onNextFromProfile}>Next</button>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────
   SIDE PANEL
───────────────────────────────────────────── */
function SidePanel({ isOpen, isClosing, onClose, showQuizContent, quizData, loading, error, currentQuestionIndex, selectedAnswers, expandedOption, onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz, onStartQuiz, profileData, profileLoading, showProfile, onNextFromProfile, onEditQuestion }) {
    if (!isOpen) return null;
    const currentQuestion = quizData?.[currentQuestionIndex];

    return (
        <>
            <div className="j-backdrop" onClick={onClose} />
            <div className={`j-panel${isClosing ? ' closing' : ''}`}>
                <div className="j-panel-header">
                    <h2 className="j-panel-title page-title-main-name">For You</h2>
                    <button className="j-panel-close page-title-main-name" onClick={onClose}><X size={22} /></button>
                </div>

                {showProfile ? (
                    profileLoading
                        ? <div className="j-panel-body page-title-main-name"><div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#6b7280' }}>Building your profile...</p></div></div>
                        : <ProfileResult profileData={profileData} onNextFromProfile={onNextFromProfile} onEditQuestion={onEditQuestion} />
                ) : (
                    <>
                        <div className="j-panel-body page-title-main-name">
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#6b7280' }}>Loading...</p></div>
                            ) : error ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ fontSize: 14, color: '#ef4444' }}>{error}</p></div>
                            ) : showQuizContent && quizData ? (
                                <>
                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ fontSize: 12, color: '#6b7280' }}>Question {currentQuestionIndex + 1} of {quizData.length}</span>
                                            <span style={{ fontSize: 12, color: '#6b7280' }}>{Math.round(((currentQuestionIndex + 1) / quizData.length) * 100)}%</span>
                                        </div>
                                        <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2 }}>
                                            <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`, background: '#1f2937', borderRadius: 2, transition: 'width 0.4s ease' }} />
                                        </div>
                                    </div>

                                    <p className="j-panel-eyebrow" style={{ marginBottom: 8 }}>SKINCARE QUIZ</p>
                                    <h3 className="j-panel-heading fs-6" style={{ marginBottom: 12 }}>{currentQuestion?.questionText}</h3>
                                    {currentQuestion?.description && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>{currentQuestion.description}</p>}

                                    <div style={{ marginBottom: 24 }}>
                                        {currentQuestion?.options.map((option) => {
                                            const isSelected = selectedAnswers[currentQuestion._id] === option.value;
                                            const isExpanded = expandedOption === option._id;
                                            return (
                                                <div key={option._id} style={{ marginBottom: 12, border: `2px solid ${isSelected ? '#1f2937' : '#e5e7eb'}`, borderRadius: 8, background: isSelected ? '#f9fafb' : 'white', overflow: 'hidden' }}>
                                                    <div onClick={() => onToggleExpand(option._id)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isExpanded ? '#f3f4f6' : 'transparent' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                                                            <div onClick={(e) => { e.stopPropagation(); onOptionSelect(currentQuestion._id, option.value); }} style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSelected ? '#1f2937' : '#d1d5db'}`, background: isSelected ? '#1f2937' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                                {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                                                            </div>
                                                            <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#374151' }}>{option.label}</h5>
                                                        </div>
                                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </div>
                                                    {isExpanded && (
                                                        <div style={{ padding: '0 16px 16px 48px' }}>
                                                            <p style={{ fontSize: 13, color: '#6b7280', margin: '12px 0 0 0', lineHeight: 1.5 }}>{option.subtext}</p>
                                                            {!isSelected
                                                                ? <button onClick={() => onOptionSelect(currentQuestion._id, option.value)} style={{ marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#1f2937', background: 'transparent', border: '1px solid #1f2937', borderRadius: 6, cursor: 'pointer' }}>Select This Option</button>
                                                                : <div style={{ marginTop: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: 'white', background: '#1f2937', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />Selected</div>}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                                        <button onClick={onPrevQuestion} disabled={currentQuestionIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'transparent', border: 'none', color: currentQuestionIndex === 0 ? '#9ca3af' : '#374151', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}>
                                            <ChevronLeft size={18} /> Previous
                                        </button>
                                        <button onClick={() => onSubmitQuiz(currentQuestionIndex === quizData.length - 1)} disabled={!selectedAnswers[currentQuestion?._id]} style={{ padding: '10px 24px', background: selectedAnswers[currentQuestion?._id] ? '#1f2937' : '#9ca3af', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: selectedAnswers[currentQuestion?._id] ? 'pointer' : 'not-allowed' }}>
                                            Submit
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="j-panel-eyebrow">FOR YOU</p>
                                    <h3 className="j-panel-heading page-title-main-name fs-6">Your Tailored Shopping Experience</h3>
                                    <div className="j-collage">
                                        <div className="j-collage-col">
                                            <img src="https://picsum.photos/seed/face1/200/200" alt="" referrerPolicy="no-referrer" />
                                            <img src="https://picsum.photos/seed/face2/200/200" alt="" referrerPolicy="no-referrer" />
                                        </div>
                                        <div className="j-collage-col">
                                            <img src="https://picsum.photos/seed/face3/200/200" alt="" referrerPolicy="no-referrer" />
                                            <img src="https://picsum.photos/seed/face4/200/200" alt="" referrerPolicy="no-referrer" />
                                            <img src="https://picsum.photos/seed/face5/200/200" alt="" referrerPolicy="no-referrer" />
                                        </div>
                                        <div className="j-collage-col">
                                            <img src="https://picsum.photos/seed/face6/200/200" alt="" referrerPolicy="no-referrer" />
                                            <img src="https://picsum.photos/seed/face7/200/200" alt="" referrerPolicy="no-referrer" />
                                        </div>
                                    </div>
                                    <h4 className="page-title-main-name" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>Let's Get Personal</h4>
                                    <p className="page-title-main-name" style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Answer these questions to unlock a customised Joyory Experience, Just For You</p>
                                </>
                            )}
                        </div>
                        {!showQuizContent && (
                            <div className="j-panel-cta-area">
                                <button className="j-quiz-btn page-title-main-name" onClick={onStartQuiz}>Take The Quiz</button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </>
    );
}

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
function HomePage({ onOpenPanel, isPanelOpen, isClosing, onClosePanel, showQuizContent, quizData, loading, error, currentQuestionIndex, selectedAnswers, expandedOption, onOptionSelect, onToggleExpand, onPrevQuestion, onSubmitQuiz, introData, introLoading, onCategoryClick, onStartQuiz, profileData, profileLoading, showProfile, onNextFromProfile, onEditQuestion, hasCompletedQuiz, quizCheckLoading }) {

    return (
        <div style={{ minHeight: '100vh', background: 'var(--j-cream)', fontFamily: 'var(--j-font-sans)' }}>
            <Header />
            <main style={{ position: 'relative' }}>
                <div className="py-5 text-center container-lg margin-padding-for-foryoulanding">
                    <div className="mb-lg-5 mb-3 j-reveal">
                        <h2 className="j-hero-title-pre page-title-main-name">Not Sure</h2>
                        <h3 className="j-hero-title-main page-title-main-name">Where to Start? <span className="j-hero-title-light">Let's Help</span></h3>
                    </div>
                    <Row className="justify-content-center">
                        {introLoading || quizCheckLoading ? (
                            <Col md={12} className="text-center">
                                {/* <div className="spinner-border text-dark mb-3" role="status" />
                <p style={{ color: '#6b7280', fontSize: 14 }}>Loading categories...</p> */}

                                <div
                                    className="fullscreen-loader page-title-main-name"
                                    style={{
                                        minHeight: "100vh",
                                        width: "100%",
                                    }}
                                >
                                    <div className="text-center">
                                        <DotLottieReact className='foryoulanding-css'
                                            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                                            loop
                                            autoplay
                                        />
                                        <p className="text-muted mb-0">
                                            Please wait while we prepare the best products for you...
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        ) : introData?.length > 0 ? (
                            introData.map((item) => (
                                <Col key={item._id} lg={5}    className="j-reveal mt-4">
                                {/* // <Col key={item._id} xs={6} lg={5} className="j-reveal"> */}
                                    <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick(item.title)}>
                                        <div className="j-cat-img-wrap"><img src={item.image} alt={item.title} referrerPolicy="no-referrer" /></div>
                                        <h4 className="j-cat-label">{item.title}</h4>
                                        {item.title.toLowerCase().includes('skincare') && hasCompletedQuiz && (
                                            <div style={{
                                                marginTop: '8px',
                                                padding: '4px 12px',
                                                background: '#10b981',
                                                color: 'white',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                display: 'inline-block',
                                                fontWeight: '600'
                                            }}>
                                                ✓ Quiz Completed - View Recommendations
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <>
                                <Col md={5} className="j-reveal">
                                    <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Makeup')}>
                                        <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/makeup-main/800/1000" alt="Makeup" referrerPolicy="no-referrer" /></div>
                                        <h4 className="j-cat-label">Makeup</h4>
                                    </div>
                                </Col>
                                <Col md={5} className="j-reveal">
                                    <div className="j-cat-card" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick('Skincare')}>
                                        <div className="j-cat-img-wrap"><img src="https://picsum.photos/seed/skincare-main/800/1000" alt="Skincare" referrerPolicy="no-referrer" /></div>
                                        <h4 className="j-cat-label">Skincare</h4>
                                        {hasCompletedQuiz && (
                                            <div style={{
                                                marginTop: '8px',
                                                padding: '4px 12px',
                                                background: '#10b981',
                                                color: 'white',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                display: 'inline-block',
                                                fontWeight: '600'
                                            }}>
                                                ✓ Quiz Completed - View Recommendations
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </>
                        )}
                    </Row>
                </div>
                <SidePanel
                    isOpen={isPanelOpen} isClosing={isClosing} onClose={onClosePanel}
                    showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
                    currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
                    onOptionSelect={onOptionSelect} onToggleExpand={onToggleExpand} onPrevQuestion={onPrevQuestion}
                    onSubmitQuiz={onSubmitQuiz} onStartQuiz={onStartQuiz}
                    profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
                    onNextFromProfile={onNextFromProfile} onEditQuestion={onEditQuestion}
                />
                {!isPanelOpen && <button className="j-float-btn" onClick={onOpenPanel}>Personalize</button>}
            </main>
            <Footer />
        </div>
    );
}

/* ─────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────── */
export default function Foryoulanding() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);

    const [view, setView] = useState('home');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showQuizContent, setShowQuizContent] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [expandedOption, setExpandedOption] = useState(null);
    const [introData, setIntroData] = useState([]);
    const [introLoading, setIntroLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // State to track if user has completed the quiz
    const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
    const [quizCheckLoading, setQuizCheckLoading] = useState(true);

    // ==================== FIX: Track auth loading state ====================
    const [authChecked, setAuthChecked] = useState(false);

    // ==================== FIX: Wait for user context to be fully loaded ====================
    useEffect(() => {
        // Only proceed when user context is fully resolved (not undefined)
        if (user !== undefined) {
            setAuthChecked(true);
        }
    }, [user]);

    // ==================== FIX: Only check quiz when auth is confirmed ====================
    useEffect(() => {
        // Don't check until auth is fully loaded
        if (!authChecked) return;

        const checkQuizCompletion = async () => {
            // If user is null or guest after auth is confirmed, redirect to login
            if (!user || user.guest) {
                setHasCompletedQuiz(false);
                setQuizCheckLoading(false);
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            try {
                const res = await fetch(
                    'https://beauty.joyory.com/api/user/for-you/skincare/profile',
                    {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const json = await res.json();

                // Check if data is empty
                const isDataEmpty =
                    !json?.data ||
                    Object.keys(json.data).length === 0 ||
                    (!json.data.skinType &&
                        (!json.data.answers || json.data.answers.length === 0) &&
                        (!json.data.concern || json.data.concern.length === 0));

                if (isDataEmpty) {
                    // No quiz data → show home page with quiz option
                    setHasCompletedQuiz(false);
                    setView('home');
                } else {
                    // Quiz completed → show recommendations
                    setHasCompletedQuiz(true);
                    setProfileData(json.data);
                    setView('recommendations');
                }
            } catch (e) {
                console.error('Error checking quiz completion:', e);
                setHasCompletedQuiz(false);
                // On error, stay on home page instead of redirecting
                setView('home');
            } finally {
                setQuizCheckLoading(false);
            }
        };

        checkQuizCompletion();
    }, [user, authChecked]); // Only depend on user and authChecked, NOT navigate/location

    // Check if user is logged in when view changes to recommendations
    useEffect(() => {
        if (view === 'recommendations' && (!user || user.guest)) {
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [view, user, navigate, location]);

    useEffect(() => {
        (async () => {
            try {
                setInitialLoading(false);
            } catch (e) {
                console.error(e);
            } finally {
                setInitialLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('https://beauty.joyory.com/api/user/for-you/intro');
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) setIntroData(json.data.sort((a, b) => a.displayOrder - b.displayOrder));
            } catch (e) { console.error(e); }
            finally { setIntroLoading(false); }
        })();
    }, []);

    useEffect(() => {
        if (view === 'thankyou') {
            const t = setTimeout(() => setView('recommendations'), 3000);
            return () => clearTimeout(t);
        }
    }, [view]);

    const fetchQuizData = async () => {
        setLoading(true); setError(null);
        try {
            const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/questions');
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                const sorted = json.data.sort((a, b) => a.displayOrder - b.displayOrder);
                setQuizData(sorted); setCurrentQuestionIndex(0);
                if (sorted[0]?.options?.length > 0) {
                    setSelectedAnswers({ [sorted[0]._id]: sorted[0].options[0].value });
                    setExpandedOption(sorted[0].options[0]._id);
                }
            } else setError('Failed to load questions');
        } catch (e) { setError('Error loading quiz'); console.error(e); }
        finally { setLoading(false); }
    };

    const handleSubmitQuiz = async (isFinalStep = true) => {
        if (!quizData) return;
        const answersPayload = quizData.map((q) => {
            const val = selectedAnswers[q._id];
            const opt = q.options.find((o) => o.value === val);
            return { questionId: q._id, questionText: q.questionText || '', mappingField: opt?.mappingField || '', value: val || '', label: opt?.label || '', subtext: opt?.subtext || '' };
        }).filter((a) => a.value);

        if (!isFinalStep) {
            fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answers: answersPayload }) }).catch(console.error);
            const next = currentQuestionIndex + 1; setCurrentQuestionIndex(next);
            const q = quizData[next];
            if (q && !selectedAnswers[q._id] && q.options?.length > 0) {
                setSelectedAnswers((prev) => ({ ...prev, [q._id]: q.options[0].value }));
                setExpandedOption(q.options[0]._id);
            }
            return;
        }

        setShowQuizContent(false); setShowProfile(true); setProfileLoading(true);
        try {
            const sr = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answers: answersPayload }) });
            const submitResult = await sr.json();
            if (!submitResult.success) throw new Error('Submit failed');

            const pr = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
            const pj = await pr.json();
            if (pj.success && pj.data) {
                setProfileData(pj.data);
                setHasCompletedQuiz(true);
            } else throw new Error('Profile fetch failed');
        } catch (e) { console.error(e); }
        finally { setProfileLoading(false); }
    };

    const handleCategoryClick = (category) => {
        if (category.toLowerCase().includes('makeup')) {
            navigate('/makeupquiz');
        } else {
            if ((!user || user.guest) && view === 'recommendations') {
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            if (hasCompletedQuiz) {
                setView('recommendations');
            } else {
                setIsPanelOpen(true);
                setShowQuizContent(false);
                setShowProfile(false);
            }
        }
    };

    const closePanel = () => { setIsClosing(true); setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); }, 280); };

    const handleClosePanel = () => { closePanel(); setTimeout(() => { setShowQuizContent(false); setShowProfile(false); }, 350); };

    const handleNextFromProfile = () => {
        setIsClosing(true);
        setTimeout(() => { setIsPanelOpen(false); setIsClosing(false); setView('thankyou'); setShowQuizContent(false); setShowProfile(false); }, 280);
    };

    const handleEditQuestion = async (questionId) => {
        if (!quizData) await fetchQuizData();
        const index = quizData?.findIndex((q) => q._id === questionId);
        if (index !== undefined && index !== -1) {
            if (view !== 'home') setView('home');
            setIsPanelOpen(true); setShowQuizContent(true); setShowProfile(false); setCurrentQuestionIndex(index);
            const answer = profileData?.answers?.find((a) => a.questionId === questionId);
            if (answer) setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer.value }));
        }
    };

    const handleBannerClick = async () => {
        if (!user || user.guest) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        setView('home');
        if (!profileData) {
            setProfileLoading(true);
            try {
                const res = await fetch('https://beauty.joyory.com/api/user/for-you/skincare/profile', { credentials: 'include' });
                const json = await res.json();
                if (json.success && json.data) {
                    setProfileData(json.data);
                    setHasCompletedQuiz(true);
                }
            } catch (e) { console.error(e); }
            finally { setProfileLoading(false); }
        }
        setIsPanelOpen(true); setShowProfile(true); setShowQuizContent(false);
    };

    const handleOpenPanel = () => {
        if (!user || user.guest) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        setIsPanelOpen(true);
        setShowQuizContent(false);
        setShowProfile(false);
    };

    // ==================== FIX: Show loading while auth is being checked ====================
    if (!authChecked) {
        return (
            // <div style={{ minHeight: '100vh', background: 'var(--j-cream)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            //     <div className="text-center">
            //         <div className="spinner-border text-dark mb-3" role="status" />
            //         <p className="text-muted">Loading...</p>
            //     </div>
            // </div>

              <div
        className="fullscreen-loader page-title-main-name"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="text-center">
          <DotLottieReact className='foryoulanding-css'
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />
          <p className="text-muted mb-0">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
        );
    }

    if (initialLoading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--j-cream)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="text-center">
                    <div className="spinner-border text-dark mb-3" role="status" />
                    <p className="text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {view === 'thankyou' ? (
                <ThankYouPage />
            ) : view === 'recommendations' ? (
                <RecommendationsPage onBack={() => setView('home')} onBannerClick={handleBannerClick} />
            ) : (
                <HomePage
                    onOpenPanel={handleOpenPanel}
                    isPanelOpen={isPanelOpen} isClosing={isClosing} onClosePanel={handleClosePanel}
                    showQuizContent={showQuizContent} quizData={quizData} loading={loading} error={error}
                    currentQuestionIndex={currentQuestionIndex} selectedAnswers={selectedAnswers} expandedOption={expandedOption}
                    onOptionSelect={(qId, val) => setSelectedAnswers((prev) => ({ ...prev, [qId]: val }))}
                    onToggleExpand={(optId) => setExpandedOption((prev) => (prev === optId ? null : optId))}
                    onPrevQuestion={() => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1); }}
                    onSubmitQuiz={handleSubmitQuiz}
                    introData={introData} introLoading={introLoading} onCategoryClick={handleCategoryClick}
                    onStartQuiz={() => { setShowQuizContent(true); setShowProfile(false); fetchQuizData(); }}
                    profileData={profileData} profileLoading={profileLoading} showProfile={showProfile}
                    onNextFromProfile={handleNextFromProfile} onEditQuestion={handleEditQuestion}
                    hasCompletedQuiz={hasCompletedQuiz}
                    quizCheckLoading={quizCheckLoading}
                />
            )}
        </>
    );
}
//=======================================================================================Done-Code(End)================================================
