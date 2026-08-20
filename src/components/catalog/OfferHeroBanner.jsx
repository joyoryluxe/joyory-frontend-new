import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function OfferHeroBanner({ banner, onLinkNavigation }) {
    if (!banner?.image || banner.image.length === 0) return null;

    return (
        <section className="hero-slider w-100 mt-lg-0 pt-lg-4 pt-0">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                loop
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    bulletClass: 'custom-swiper-bullet',
                    bulletActiveClass: 'custom-swiper-bullet-active',
                }}
                navigation
                speed={800}
                className="mt-lg-0 mt-0"
                style={{ height: 'auto', width: '100%' }}
            >
                {banner.image.map((bannerItem, index) => (
                    <SwiperSlide key={bannerItem._id || index} className="mt-0">
                        <div
                            className="position-relative w-100 h-100 cursor-pointer offerces-banner-sections"
                            style={{ cursor: bannerItem.link ? 'pointer' : 'default' }}
                            onClick={() => onLinkNavigation(bannerItem.link)}
                        >
                            <img
                                src={bannerItem.url}
                                alt={banner.title || 'banner'}
                                className="w-100 img-fluid"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
