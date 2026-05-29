import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from './ProductCard';

function SwiperSlider({ items = [], slidesPerView = { default: 1, md: 2, lg: 3 } }) {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.2} // Mobile thấy 1 phần slide sau để biết có thể vuốt
            navigation={true}
            // autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: slidesPerView.md || 3 },
                1024: { slidesPerView: slidesPerView.lg || 4 },
                1280: { slidesPerView: slidesPerView.xl || 4 },
            }}
            className="!pb-14 !px-2" // Padding bottom cho pagination, px để không cắt shadow
        >
            {items.map((product) => (
                <SwiperSlide key={product.id || Math.random()} className="h-auto py-2">
                    <ProductCard product={product} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default SwiperSlider;