import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/swiper-bundle.css";
import "./header.css";
import acredityImg from "/assets/akreditas.png";
import logoWrSupratman from "../../../public/assets/logo.svg";
import logoMikroskil from "../../../public/assets/mikroskil.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRequest } from "../../utils/api-call";

// 1. Definisikan Props untuk komponen Header
export interface validJenjang {
  jenjang?: "SMA" | "SMP" | "SD" | "PG-TK";
}
interface HeaderProps {
  jenjang?: "SMA" | "SMP" | "SD" | "PG-TK";
}
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

const BASE_URL = import.meta.env.VITE_BASE_URL;

const buildImageUrl = (basUrl: string, path: string): string => {
  if (!path) return "";
  const encoded = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${basUrl}/${encoded}`;
};

// 2. Gunakan Props jenjang pada komponen Header
const Header = ({ jenjang }: HeaderProps) => {
  const navigate = useNavigate();
  const [data, setData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigate = (id: string) => {
    navigate(`/carousel-detail/${id}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

        // 3. Implementasi URL sesuai saran: gunakan endpoint publik dengan filter jenjang
        const url = jenjang
          ? `/carousels/publik?jenjang=${jenjang}`
          : `/carousels/publik`;

        const response = await getRequest(url);

        // 4. Data dari endpoint publik biasanya sudah difilter 'is_published' oleh backend,
        // tapi kita pastikan kembali sorting-nya di client jika diperlukan.
        const finalData = (response.data || [])
          .sort((a: Data, b: Data) => a.urutan - b.urutan)
          .slice(0, 10);

        setData(finalData);
      } catch (error) {
        console.error("Error fetching carousels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [jenjang]); // Trigger ulang jika prop jenjang berubah

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="header-carousel-container relative">
        {/* Badge tetap sama */}
        <div className="akreditasi-badge">
          <img
            src={logoWrSupratman}
            alt="Akreditasi"
            className="akreditasi-img"
          />
        </div>
        <div className="logo-wr-badge">
          <img
            src={acredityImg}
            alt="Logo WR Supratman"
            className="logo-wr-img"
          />
        </div>
        <div className="logo-mikroskil-badge">
          <img
            src={logoMikroskil}
            alt="Logo Mikroskil"
            className="logo-mikroskil-img"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-lg">Loading carousel...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-lg">
              Belum ada carousel untuk tingkat {jenjang || "Umum"}
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
            loop={data.length > 1}
            centeredSlides={true}
            slidesPerView="auto"
            spaceBetween={30}
            pagination={{ clickable: true }}
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
              320: {
                spaceBetween: 20,
                coverflowEffect: { depth: 100, modifier: 1 },
              },
              768: {
                spaceBetween: 25,
                coverflowEffect: { depth: 150, modifier: 1.3 },
              },
              1024: {
                spaceBetween: 30,
                coverflowEffect: { depth: 200, modifier: 1.5 },
              },
            }}
          >
            {data.map((slide) => (
              <SwiperSlide
                key={slide.carousel_id}
                className="carousel-slide cursor-pointer"
                onClick={() => handleNavigate(slide.carousel_id)}
              >
                <div className="slide-wrapper-content">
                  <div
                    className="slide-image"
                    style={{
                      backgroundImage: `url('${buildImageUrl(BASE_URL, slide.path_gambar)}')`,
                    }}
                    role="img"
                    aria-label={slide.judul}
                  />
                  <div className="slide-content">
                    <p>{slide.judul}</p>
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
