import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/swiper-bundle.css";
import "./header.css";
import acredityImg from "/assets/akreditas.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRequest } from "../../utils/api-call";

export interface Metadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface Penuli {
  user_id: string;
  username: string;
  email: string;
  password_hash: string;
  nama_lengkap: string;
  role_id: number;
  jabatan?: string;
  created_at: string;
  updated_at: string;
  login_terakhir?: string;
}

export interface Data {
  carousel_id: string;
  judul: string;
  urutan: number;
  konten: string;
  path_gambar: string;
  tanggal_publikasi: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  jenjang_id?: string;
  penulis_user_id: string;
  editor_user_id?: string;
  jenjang?: string;
  penulis: Penuli;
}

export interface CarouselsResponse {
  message: string;
  metadata: Metadata;
  data: Data[];
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Header = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CarouselsResponse["data"]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigate = (id: string) => {
    navigate(`/carousel-detail/${id}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        // Fetch more data to ensure we have enough published & featured items
        const response = await getRequest(`carousels?page=1&limit=100`);

        // Filter, sort by urutan, and get top 10
        const filteredAndSorted = response.data
          .filter((slide: Data) => slide.is_published && slide.is_featured)
          .sort((a: Data, b: Data) => a.urutan - b.urutan) // Sort by urutan (ascending)
          .slice(0, 10); // Get top 10 only

        setData(filteredAndSorted);
        console.log("Top 10 Carousel Items:", filteredAndSorted);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  // Use data directly (already filtered and sorted to top 10)
  const featuredSlides = data;

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="header-carousel-container relative">
        {/* Fixed Akreditasi Badge */}
        <div className="akreditasi-badge">
          <img src={acredityImg} alt="Akreditasi" className="akreditasi-img" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-lg">Loading carousel...</div>
          </div>
        ) : featuredSlides.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-lg">
              No featured content available
            </div>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination, EffectCoverflow]}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={featuredSlides.length > 1}
            centeredSlides={true}
            slidesPerView="auto"
            spaceBetween={30}
            pagination={{
              clickable: true,
              dynamicBullets: false,
            }}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 1.5,
              slideShadows: false,
            }}
            speed={600}
            className="header-swiper"
            breakpoints={{
              // Mobile
              320: {
                spaceBetween: 20,
                coverflowEffect: {
                  depth: 100,
                  modifier: 1,
                },
              },
              // Tablet
              768: {
                spaceBetween: 25,
                coverflowEffect: {
                  depth: 150,
                  modifier: 1.3,
                },
              },
              // Desktop
              1024: {
                spaceBetween: 30,
                coverflowEffect: {
                  depth: 200,
                  modifier: 1.5,
                },
              },
            }}
          >
            {featuredSlides.map((slide, _index) => (
              <SwiperSlide
                key={slide.carousel_id}
                className="carousel-slide cursor-pointer"
                onClick={() => handleNavigate(slide.carousel_id)}
              >
                {/* Wrapper Utama */}
                <div className="slide-wrapper-content">
                  <div
                    className="slide-image"
                    style={{
                      backgroundImage: `url(${BASE_URL}/${slide.path_gambar})`,
                    }}
                    role="img"
                    aria-label={slide.judul}
                  >
                    {/* Optional: Show urutan number for debugging */}
                    {/* <div style={{position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '12px'}}>
                      #{slide.urutan}
                    </div> */}
                  </div>

                  {/* Content below image */}
                  <div className="slide-content">
                    <p>{slide.konten}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default Header;
