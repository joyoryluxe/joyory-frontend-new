import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../styles/CategorySeoContentBlock.css";

// ─── Face Category FAQs (Word-for-word from Document 1) ──────────────────────
const FACE_FAQS = [
  {
    q: "Which face makeup product should I apply first?",
    a: "Apply primer first, followed by foundation, then concealer."
  },
  {
    q: "What is the difference between compact powder and setting powder?",
    a: "Compact powder is pressed and good for touch-ups. Setting powder is loose and is used to lock the base in place."
  },
  {
    q: "How do I choose a blush shade?",
    a: "Pink and peach suit most fair to medium skin tones. Deeper berry and coral shades suit medium to deep skin."
  },
  {
    q: "How can I stop my makeup from looking cakey?",
    a: "Moisturise first, apply thin layers and avoid too much powder."
  },
  {
    q: "Can I buy face makeup online at Joyory in India?",
    a: "Yes. Browse the Face category, use the filters (Foundation, Blush, Compact and more) and order online."
  }
];

// ─── Lips Category FAQs (Word-for-word from Document 2) ──────────────────────
const LIPS_FAQS = [
  {
    q: "Which lipstick shade suits Indian skin tones?",
    a: "Coral, brick red, warm pink and terracotta suit most light to medium Indian skin tones, while wine, plum, deep berry and brown nudes look striking on deeper skin tones. Check your undertone: golden undertones prefer warm shades, and pink undertones prefer cool shades."
  },
  {
    q: "What is the difference between matte and liquid lipstick?",
    a: "Matte lipstick usually comes as a bullet with a flat, velvety finish. Liquid lipstick comes with an applicator and often lasts longer. Both are available in the Joyory lips collection."
  },
  {
    q: "How do I make my lipstick last longer?",
    a: "Prep lips with a thin layer of balm, line them with a lip liner, apply lipstick in thin layers and blot between layers. Touch up when needed."
  },
  {
    q: "What is the difference between lip gloss and lip oil?",
    a: "Lip gloss gives high shine and a fuller look and can feel slightly sticky. Lip oil is lighter and more nourishing, with a softer glossy finish."
  },
  {
    q: "Is a lip stain better than lipstick?",
    a: "A lip stain gives a natural, sheer tint that is easy to apply, while lipstick gives stronger colour and more finish options. Pick a stain for a fresh look and a lipstick for full colour."
  },
  {
    q: "Can I wear a lip balm with SPF under lipstick?",
    a: "Yes. Apply the SPF lip balm first, let it settle for a minute, and then apply lipstick on top."
  },
  {
    q: "How do I apply lip liner?",
    a: "Outline the natural edge of your lips, then fill in the lips with the liner. Add lipstick on top for better staying power and a cleaner edge."
  },
  {
    q: "Where can I buy lipsticks and lip gloss online in India?",
    a: "You can shop lipsticks, lip gloss, lip liners, lip balms, lip oils and lip stains from trusted beauty brands on Joyory, at joyory.com/category/makeup/lips."
  }
];

export const CategorySeoContentBlock = ({ categoryType }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openFaqs, setOpenFaqs] = useState({});

  if (categoryType !== "face" && categoryType !== "lips") {
    return null;
  }

  const toggleFaq = (index) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isFace = categoryType === "face";
  const faqs = isFace ? FACE_FAQS : LIPS_FAQS;

  return (
    <section className="category-seo-container" aria-label="Category Guide and SEO Information">
      <div className="container-lg category-seo-inner">
        {isFace ? (
          /* ====================================================================
             FACE MAKEUP SEO CONTENT (From Document 1)
             ==================================================================== */
          <>
            <h2 className="category-seo-title">Shop Face Makeup Online at Joyory</h2>
            <p className="category-seo-intro">
              Face makeup evens out your skin tone, covers blemishes and adds colour and glow. At Joyory you can shop foundation, compact powder, blush, bronzer, concealer, contour, highlighter and primer from trusted beauty brands. Browse our full{" "}
              <Link to="/category/makeup">makeup collection</Link> for more, or explore{" "}
              <Link to="/category/makeup/lips/lips-lipstick">lipstick</Link>,{" "}
              <Link to="/category/makeup/lips/lips-lip-gloss">lip gloss</Link> and{" "}
              <Link to="/category/makeup/lips/lips-lip-liner">lip liner</Link>.
            </p>

            {/* Expandable Section */}
            <div
              className="category-seo-expandable-content"
              style={{
                display: isExpanded ? "block" : "-webkit-box",
                WebkitLineClamp: isExpanded ? "unset" : 3,
                WebkitBoxOrient: "vertical",
                overflow: isExpanded ? "visible" : "hidden"
              }}
            >
              <div className="category-seo-section">
                <h3 className="category-seo-subtitle">What Is Face Makeup and Why Use It?</h3>
                <p>
                  Face makeup creates a balanced, smooth base for your overall look. Whether you want sheer coverage for everyday wear or a full-coverage finish for special occasions, modern face products are formulated to feel lightweight while staying in place.
                </p>
              </div>

              <div className="category-seo-section">
                <h3 className="category-seo-subtitle">Key Types of Face Makeup</h3>
                <ul className="category-seo-list">
                  <li>
                    <strong>Foundation:</strong> Evens out skin tone and provides your desired coverage level, from natural dewy to velvety matte.
                  </li>
                  <li>
                    <strong>Compact &amp; Setting Powder:</strong> Sets liquid products in place, controls excess shine and blurs pores for a smooth finish.
                  </li>
                  <li>
                    <strong>Concealer:</strong> Delivers targeted correction for dark circles, blemishes and redness without heaviness.
                  </li>
                  <li>
                    <strong>Blush:</strong> Adds a natural flush of colour to the cheeks in warm peach, soft rose, coral or rich berry tones.
                  </li>
                  <li>
                    <strong>Bronzer &amp; Contour:</strong> Sculpts facial features and adds sun-kissed warmth and dimension.
                  </li>
                  <li>
                    <strong>Highlighter &amp; Illuminator:</strong> Captures light on high points of the face for a healthy, radiant glow.
                  </li>
                  <li>
                    <strong>Primer:</strong> Smooths skin texture, minimizes the look of pores and helps your makeup last all day long.
                  </li>
                </ul>
              </div>

              <div className="category-seo-section">
                <h3 className="category-seo-subtitle">How to Apply Face Makeup Step by Step</h3>
                <ol className="category-seo-list">
                  <li>
                    <strong>Prep:</strong> Cleanse and moisturise thoroughly, then apply primer to blur pores and smooth texture.
                  </li>
                  <li>
                    <strong>Base:</strong> Apply foundation starting from the centre of the face and blending outward using a sponge or brush.
                  </li>
                  <li>
                    <strong>Conceal:</strong> Dot concealer under the eyes and on blemishes; pat gently with a fingertip or beauty sponge.
                  </li>
                  <li>
                    <strong>Set:</strong> Lock your base with a dusting of compact or loose setting powder in shine-prone areas.
                  </li>
                  <li>
                    <strong>Define &amp; Glow:</strong> Sweep blush onto the apples of the cheeks, bronzer along the temples, and highlighter on the high cheekbones.
                  </li>
                </ol>
              </div>

              <div className="category-seo-section">
                <h3 className="category-seo-subtitle">Popular Face Makeup Brands at Joyory</h3>
                <p>
                  Shop face makeup from trusted beauty brands including Pilgrim, Dot &amp; Key, Swiss Beauty, Plum, Lakmé and more. Every product is 100% authentic and verified.
                </p>
              </div>
            </div>

            {/* Read More / Read Less Toggle */}
            <div className="category-seo-toggle-wrap">
              <button
                type="button"
                className="category-seo-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    Read Less <FaChevronUp size={11} />
                  </>
                ) : (
                  <>
                    Read More About Face Makeup <FaChevronDown size={11} />
                  </>
                )}
              </button>
            </div>

            {/* FAQs Accordion */}
            <div className="category-faq-wrap">
              <h3 className="category-seo-subtitle">Frequently Asked Questions</h3>
              {faqs.map((faq, idx) => {
                const isOpen = openFaqs[idx] ?? idx === 0;
                return (
                  <div key={idx} className="category-faq-item">
                    <button
                      type="button"
                      className="category-faq-question"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <span className="category-faq-icon">
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="category-faq-answer">
                        <p className="mb-0">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* ====================================================================
             LIPS CATEGORY SEO CONTENT (From Document 2)
             ==================================================================== */
          <>
            <h2 className="category-seo-title">Shop Lipsticks, Lip Gloss &amp; Lip Care Online at Joyory</h2>
            <p className="category-seo-intro">
              Find the perfect shade and formula for every mood and occasion. Joyory carries a wide range of{" "}
              <Link to="/category/makeup/lips/lips-lipstick">lipsticks</Link>,{" "}
              <Link to="/category/makeup/lips/lips-lip-gloss">lip gloss</Link>,{" "}
              <Link to="/category/makeup/lips/lips-lip-liner">lip liner</Link>, lip balms, lip oils and lip stains crafted to flatter all Indian skin tones. Pair your lip colour with our{" "}
              <Link to="/category/makeup/face">face makeup</Link> essentials or explore the full{" "}
              <Link to="/category/makeup">makeup collection</Link>.
            </p>

            {/* Expandable Section */}
            <div
              className="category-seo-expandable-content"
              style={{
                display: isExpanded ? "block" : "-webkit-box",
                WebkitLineClamp: isExpanded ? "unset" : 3,
                WebkitBoxOrient: "vertical",
                overflow: isExpanded ? "visible" : "hidden"
              }}
            >
              <div className="category-seo-section">
                <h3 className="category-seo-subtitle">Understanding Lip Finishes</h3>
                <ul className="category-seo-list">
                  <li>
                    <strong>Matte:</strong> Full opacity with no shine; long-lasting, smudge-resistant and ideal for all-day wear.
                  </li>
                  <li>
                    <strong>Satin / Cream:</strong> Soft sheen with rich hydration; comfortable on dry lips with rich pigmentation.
                  </li>
                  <li>
                    <strong>Glossy:</strong> Mirror-like high-shine finish that reflects light, making lips look visibly fuller and plumper.
                  </li>
                  <li>
                    <strong>Sheer / Tinted:</strong> A natural flush of translucent colour with daily nourishing benefits.
                  </li>
                </ul>
              </div>

              {/* Lip Types Comparison Table */}
              <div className="category-seo-section">
                <h3 className="category-seo-subtitle">Lip Product Types Compared</h3>
                <div className="category-seo-table-wrap">
                  <table className="category-seo-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Finish</th>
                        <th>Staying Power</th>
                        <th>Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Lipstick</strong></td>
                        <td>Matte, satin or cream</td>
                        <td>4 to 8 hours</td>
                        <td>Everyday wear, work, events</td>
                      </tr>
                      <tr>
                        <td><strong>Liquid Lipstick</strong></td>
                        <td>Transfer-proof matte</td>
                        <td>6 to 12 hours</td>
                        <td>Long days, parties, weddings</td>
                      </tr>
                      <tr>
                        <td><strong>Lip Gloss</strong></td>
                        <td>High shine, reflective</td>
                        <td>2 to 4 hours</td>
                        <td>Juicy lip look, layering over lipstick</td>
                      </tr>
                      <tr>
                        <td><strong>Lip Oil</strong></td>
                        <td>Subtle shine, non-sticky</td>
                        <td>2 to 3 hours</td>
                        <td>Hydration with a hint of tint</td>
                      </tr>
                      <tr>
                        <td><strong>Lip Stain</strong></td>
                        <td>Natural matte tint</td>
                        <td>6 to 10 hours</td>
                        <td>Effortless flush that won't smudge</td>
                      </tr>
                      <tr>
                        <td><strong>Lip Liner</strong></td>
                        <td>Matte definition</td>
                        <td>6 to 8 hours</td>
                        <td>Preventing feathering, contouring lips</td>
                      </tr>
                      <tr>
                        <td><strong>Lip Balm</strong></td>
                        <td>Soft sheer or clear</td>
                        <td>2 to 4 hours</td>
                        <td>Daily nourishment and SPF sun protection</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Indian Skin Tone Guide Table */}
              <div className="category-seo-section">
                <h3 className="category-seo-subtitle">Lipstick Shade Guide for Indian Skin Tones</h3>
                <div className="category-seo-table-wrap">
                  <table className="category-seo-table">
                    <thead>
                      <tr>
                        <th>Skin Tone</th>
                        <th>Recommended Shades</th>
                        <th>Undertone Tips</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Fair to Light</strong></td>
                        <td>Soft pinks, peach, rosy nudes, crisp berry for contrast</td>
                        <td>Cool undertones suit blue-reds; warm undertones suit peachy nudes</td>
                      </tr>
                      <tr>
                        <td><strong>Light to Medium (Wheatish)</strong></td>
                        <td>Coral, brick red, warm pink, mauve nude, warm terracotta</td>
                        <td>Warm golden and olive undertones glow in terracotta and warm browns</td>
                      </tr>
                      <tr>
                        <td><strong>Medium to Tan</strong></td>
                        <td>Terracotta, rust, deep rose, rich brown nude, cherry red</td>
                        <td>Caramel and bronze tones pair beautifully with deep brick reds</td>
                      </tr>
                      <tr>
                        <td><strong>Deep</strong></td>
                        <td>Wine, plum, deep berry, chocolate brown, bold classic red</td>
                        <td>High-contrast berries and rich chocolate pigments look striking</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="category-seo-section">
                <h3 className="category-seo-subtitle">How to Make Lipstick Last Longer</h3>
                <ol className="category-seo-list">
                  <li>Exfoliate gently and apply a thin layer of lip balm. Blot off any excess.</li>
                  <li>Outline and softly fill in your lips with a matching lip liner.</li>
                  <li>Apply lipstick from the centre outward for an even layer.</li>
                  <li>Blot with a tissue, then dust a whisper of translucent powder and apply a second thin coat.</li>
                  <li>Touch up lightly through the day instead of layering thick product.</li>
                </ol>
              </div>

              <div className="category-seo-section">
                <h3 className="category-seo-subtitle">Popular Lip Brands at Joyory</h3>
                <p>
                  Shop authentic lip essentials from top brands including Pilgrim, Dot &amp; Key, Swiss Beauty, Foxtale, Be Nude, WishCare and Conscious Chemist.
                </p>
              </div>

              <div className="category-seo-section">
                <h3 className="category-seo-subtitle">Lipstick Price Range at Joyory</h3>
                <p>
                  Lip products at Joyory range from about ₹229 to ₹945, offering premium quality and beauty-tech tools for every budget.
                </p>
              </div>
            </div>

            {/* Read More / Read Less Toggle */}
            <div className="category-seo-toggle-wrap">
              <button
                type="button"
                className="category-seo-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    Read Less <FaChevronUp size={11} />
                  </>
                ) : (
                  <>
                    Read More About Lip Products <FaChevronDown size={11} />
                  </>
                )}
              </button>
            </div>

            {/* FAQs Accordion */}
            <div className="category-faq-wrap">
              <h3 className="category-seo-subtitle">Frequently Asked Questions</h3>
              {faqs.map((faq, idx) => {
                const isOpen = openFaqs[idx] ?? idx === 0;
                return (
                  <div key={idx} className="category-faq-item">
                    <button
                      type="button"
                      className="category-faq-question"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <span className="category-faq-icon">
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="category-faq-answer">
                        <p className="mb-0">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CategorySeoContentBlock;
