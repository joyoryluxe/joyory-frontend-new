import React from 'react';

export default function BlogContentSections({
    sections = [],
    getImageUrl,
}) {
    if (!sections || sections.length === 0) return null;

    return (
        <div className="sections mt-5">
            {sections.map((section, index) => {
                const isEven = index % 2 === 0;
                return (
                    <div key={section._id || index} className="section mb-5">
                        <div className="row align-items-center g-4">
                            <div className={`col-lg-6 ${isEven ? 'order-lg-1' : 'order-lg-2'}`}>
                                {section.categoryName && (
                                    <h5 className="text-muted mb-2">{section.categoryName}</h5>
                                )}
                                {section.subtitle && (
                                    <h3 className="fw-bold mb-3">{section.subtitle}</h3>
                                )}
                                <div
                                    className="section-description"
                                    dangerouslySetInnerHTML={{ __html: section.description }}
                                />
                            </div>
                            {section.image && (
                                <div className={`col-lg-6 ${isEven ? 'order-lg-2' : 'order-lg-1'}`}>
                                    <img
                                        src={getImageUrl ? getImageUrl(section.image) : section.image}
                                        alt={section.subtitle || "Section image"}
                                        className="img-fluid rounded w-100"
                                        style={{ objectFit: "cover", maxHeight: "400px" }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
