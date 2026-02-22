import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getRequest } from "../../utils/api-call";
import "./css/carousel_detail_home.css";

export interface Penulis {
  user_id: string;
  username: string;
  email: string;
  password_hash: string;
  nama_lengkap: string;
  role_id: number;
  jabatan?: string | null;
  created_at: string;
  updated_at: string;
  login_terakhir?: string | null;
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
  jenjang_id?: string | null;
  penulis_user_id: string;
  editor_user_id?: string | null;
  jenjang?: string | null;
  penulis: Penulis;
  editor?: string | null;
}

export interface CarouselsResponse {
  message: string;
  data: Data;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Carousel_detail_home = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<CarouselsResponse["data"] | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getRequest(`carousels/${id}`);
        setData(response.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  if (!data) {
    return (
      <>
        <Navbar />
        <section className="not-found-section">
          <div className="not-found-container">
            <div className="not-found-icon">
              <svg
                className="icon-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="not-found-title">Content Not Found</h1>
            <p className="not-found-text">
              The content you're looking for is not available.
            </p>
            <button onClick={() => navigate("/")} className="back-button">
              <ArrowLeft size={18} />
              Back to Home
            </button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="detail-page">
        <div className="hero-section">
          <img
            src={`${BASE_URL}/${data.path_gambar}`}
            alt="Slide"
            className="hero-image"
          />
          <div className="hero-overlay-top"></div>
          <div className="hero-overlay-bottom"></div>

          <div className="hero-content">
            <div className="hero-content-inner">
              <button
                onClick={() => navigate("/")}
                className="hero-back-button"
              >
                <ArrowLeft size={18} className="back-arrow" />
                <span>Back to Home</span>
              </button>
              <h1 className="hero-title">{data.konten}</h1>
            </div>
          </div>
        </div>

        <section className="content-section">
          <div className="content-container">
            <h2 className="section-title">Informasi Lebih Lanjut</h2>

            <div className="content-card">
              <div className="decorative-gradient-top"></div>
              <div className="decorative-gradient-bottom"></div>

              <div className="decorative-line"></div>

              <p className="content-text">{data.konten}</p>

              <div className="content-footer">
                <div className="status-indicator">
                  <div className="status-dot"></div>
                  <span>Published Content</span>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="footer-back-button"
                >
                  <ArrowLeft size={14} className="footer-arrow" />
                  Return Home
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
};

export default Carousel_detail_home;
