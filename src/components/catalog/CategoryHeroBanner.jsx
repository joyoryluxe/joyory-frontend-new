import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function CategoryHeroBanner({ category, onSlideChange, onLinkNavigation }) {
    const swiperRef = useRef(null);

    if (!category?.bannerImage || category.bannerImage.length === 0) {
        return <div className="non-hero-spacer" />;
    }

    return (
        <section className="hero-slider">
            <Swiper
                ref={swiperRef}
                modules={[Autoplay, Pagination, Navigation]}
                onSlideChange={onSlideChange}
                loop
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    bulletClass: 'custom-swiper-bullet',
                    bulletActiveClass: 'custom-swiper-bullet-active',
                }}
                navigation
                speed={800}
                className="mt-lg-5"
                style={{ height: 'auto', width: '100%' }}
            >
                {category.bannerImage.map((banner, index) => {
                    const imgUrl = typeof banner === 'string' ? banner : banner.url;
                    const targetLink = typeof banner === 'object' ? banner.link : null;

                    return (
                        <SwiperSlide key={index}>
                            <div
                                className="position-relative w-100 h-100 mt-xl-0 mt-0 padding-left-rightss"
                                style={{ cursor: targetLink ? 'pointer' : 'default' }}
                                onClick={() => targetLink && onLinkNavigation(targetLink)}
                            >
                                <img
                                    src={imgUrl}
                                    alt={`Shop Premium ${category.name || 'Category'} Products Online - Joyory`}
                                    className="slide-media hero-slider-image-responsive mt-0 pt-0"
                                    style={{ height: '100%' }}
                                />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
}
