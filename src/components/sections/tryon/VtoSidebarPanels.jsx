import React from 'react';
import { FaChevronLeft, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function VtoSidebarPanels({
    sidePanel = 'types',
    setSidePanel,
    vtoTypes = [],
    activeType,
    onTypeSelect,
    loadingTypes,
    products = [],
    activeProduct,
    setActiveType,
    setProducts,
    onProductSelect,
    loadingProducts,
    shades = [],
    activeShade,
    onApplyShade,
    loadingShades,
}) {
    const navigate = useNavigate();

    const labelFor = (type) => {
        if (!type) return "";
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const getCategoryIcon = (type) => {
        const t = (type || '').toLowerCase();
        let svgIcon = null;

        if (t.includes('lip') || t.includes('lipstick')) {
            svgIcon = (
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="8" y="13" width="8" height="8" rx="1" stroke="currentColor" />
                    <rect x="9.5" y="9" width="5" height="4" stroke="currentColor" />
                    <path d="M9.5 9V6.5L12 4.5l2.5 1.5V9H9.5z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" />
                    <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" />
                </svg>
            );
        } else if (t.includes('blush') || t.includes('cheek')) {
            svgIcon = (
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="7" r="5" stroke="currentColor" />
                    <ellipse cx="12" cy="17" rx="6" ry="4" stroke="currentColor" />
                    <ellipse cx="12" cy="17" rx="4" ry="2.5" fill="currentColor" fillOpacity="0.2" />
                    <path d="M19 8l1 1-1 1M5 9l1-1-1-1" strokeWidth="1" />
                </svg>
            );
        } else if (t.includes('eyeliner')) {
            svgIcon = (
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 13.5C16 11 19.5 11 22 13c-2-3-5.5-4.5-9-3" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M4 20L15 9l2 2L6 22H4v-2z" fill="currentColor" fillOpacity="0.15" />
                    <path d="M14 10l1.5-1.5a1 1 0 0 1 1.4 0v0a1 1 0 0 1 0 1.4L15.5 11.5" />
                    <path d="M13.5 10.5l-1-1" strokeWidth="2" />
                </svg>
            );
        } else if (t.includes('eye') || t.includes('shadow') || t.includes('eyes')) {
            svgIcon = (
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" />
                    <circle cx="7.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="16.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="7.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="16.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
                    <line x1="5" y1="20" x2="19" y2="20" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="4.5" cy="20" r="1.2" fill="currentColor" />
                    <circle cx="19.5" cy="20" r="1.2" fill="currentColor" />
                </svg>
            );
        } else if (t.includes('brow') || t.includes('eyebrow') || t.includes('brows')) {
            svgIcon = (
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 13.5c3.5-3 8.5-4.5 13-2 2.5 1.4 4 3 5 4-1.5-2.5-4.5-4.5-8-4.5-4 0-7.5 1.5-10 2.5z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
                    <line x1="6" y1="18" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 8l1.5-1.5a1 1 0 0 1 1.4 0v0a1 1 0 0 1 0 1.4L17.5 9.5" />
                    <path d="M5 19l1.5-1.5" />
                </svg>
            );
        } else if (t.includes('found') || t.includes('face') || t.includes('concealer') || t.includes('foundation')) {
            svgIcon = (
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="7" y="10" width="10" height="11" rx="2" stroke="currentColor" />
                    <rect x="8.5" y="12" width="7" height="7" fill="currentColor" fillOpacity="0.25" stroke="none" />
                    <path d="M10 10V7h4v3" />
                    <path d="M14 6H9.5a1 1 0 0 0-1 1v1h3" />
                    <path d="M19 12c0 1.6-1.3 3-3 3s-3-1.4-3-3c0-1.5 2-4.5 3-4.5s3 3 3 4.5z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
                </svg>
            );
        } else {
            svgIcon = (
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" />
                    <circle cx="7.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="16.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="7.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="16.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
                </svg>
            );
        }

        return (
            <div
                className="vto-category-svg-wrapper"
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    color: "inherit"
                }}
            >
                {svgIcon}
            </div>
        );
    };

    return (
        <div className="vto-engine-sidebar">
            {sidePanel === 'types' && (
                <div className="vto-sidebar-items">
                    {loadingTypes ? (
                        <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div>
                    ) : (
                        vtoTypes.map((type, i) => (
                            <div
                                key={i}
                                className={`vto-sidebar-item ${activeType === type ? 'active' : ''}`}
                                onClick={() => onTypeSelect(type)}
                            >
                                <div className="vto-sidebar-icon-box">
                                    {getCategoryIcon(type)}
                                </div>
                                <span className="vto-sidebar-label">{labelFor(type)}</span>
                            </div>
                        ))
                    )}
                </div>
            )}

            {sidePanel === 'products' && (
                <div className="vto-sidebar-items vto-sidebar-products">
                    <div
                        className="vto-sidebar-item"
                        onClick={() => {
                            setActiveType(null);
                            setProducts([]);
                            setSidePanel('types');
                        }}
                    >
                        <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}>
                            <FaChevronLeft size={24} />
                        </div>
                    </div>
                    {loadingProducts ? (
                        <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div>
                    ) : (
                        (() => {
                            const activeProductIdx = products.findIndex(p => p._id === activeProduct?._id);
                            const visibleProducts = (activeProductIdx === -1 || activeProductIdx < 5)
                                ? products.slice(0, 5)
                                : [products[activeProductIdx], ...products.filter(p => p._id !== activeProduct?._id).slice(0, 4)];

                            return (
                                <>
                                    {visibleProducts.map((p, i) => (
                                        <div
                                            key={p._id || i}
                                            className={`vto-sidebar-item ${activeProduct?._id === p._id ? 'active' : ''}`}
                                            onClick={() => onProductSelect(p)}
                                        >
                                            <div className="vto-sidebar-icon-box">
                                                <img src={p.image || "https://via.placeholder.com/56"} alt={p.name} className="vto-cat-thumb-img" style={{ borderRadius: '8px' }} />
                                            </div>
                                            <span className="vto-sidebar-label">{p.name || p.brand}</span>
                                        </div>
                                    ))}
                                    {products.length > 0 && (
                                        <div className="vto-sidebar-item vto-sidebar-more-item" onClick={() => navigate('/vto-products')}>
                                            <div
                                                className="vto-sidebar-icon-box d-flex align-items-center justify-content-center"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    border: '2px dashed rgba(255, 255, 255, 0.4)',
                                                    color: '#fff',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                <span style={{ fontSize: '24px', fontWeight: '300', marginTop: '-2px' }}>+</span>
                                            </div>
                                            <span className="vto-sidebar-label" style={{ opacity: 0.8 }}>More</span>
                                        </div>
                                    )}
                                </>
                            );
                        })()
                    )}
                </div>
            )}

            {sidePanel === 'shades' && (
                <div className="vto-sidebar-items vto-sidebar-shades">
                    <div className="vto-sidebar-item" onClick={() => setSidePanel('products')}>
                        <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}>
                            <FaChevronLeft size={24} />
                        </div>
                    </div>
                    {loadingShades ? (
                        <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div>
                    ) : (
                        shades.map((shade, idx) => (
                            <div
                                key={shade.sku || idx}
                                className={`vto-sidebar-item ${activeShade === shade.sku || activeShade === shade.variantSku || activeShade === shade._id || activeShade === shade.name ? 'active' : ''}`}
                                onClick={() => onApplyShade(shade)}
                            >
                                <div
                                    className="vto-sidebar-shade-square"
                                    style={{
                                        backgroundColor: (shade.hex && typeof shade.hex === 'string' && shade.hex.startsWith('#'))
                                            ? shade.hex
                                            : '#' + (shade.hex || shade.color || '000000')
                                    }}
                                />
                                <span className="vto-sidebar-label">{shade.shadeName}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
