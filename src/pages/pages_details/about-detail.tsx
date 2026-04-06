import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "../../utils/api-call";
import "./css/about-detail.css";
import Footer from "../../components/footer";

interface AboutData {
  about_id: string;
  hero_badge?: string;
  hero_title: string;
  hero_subtitle?: string;
  hero_image?: string;
  hero_meta_pills?: string[];
  description_text?: string;
  visi_quote?: string;
  highlights?: { icon: string; label: string }[];
  fasilitas_items?: { icon: string; nama: string }[];
  cta_title?: string;
  cta_description?: string;
  cta_button_text?: string;
  cta_button_url?: string;
}

const AboutPage = () => {
  // ✅ :level berasal dari parent route /tingkatan/:level
  const { level } = useParams();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchAboutData = async () => {
      setIsLoading(true);
      try {
        // ✅ Kirim kode_jenjang dari URL param ke query string
        // Contoh: /tingkatan/SMA/about → ?jenjang=SMA
        const endpoint = level
          ? `/about/publik?jenjang=${level.toUpperCase()}`
          : `/about/publik`;

        console.log("[AboutPage] Fetching:", endpoint);

        const response = await getRequest(endpoint);

        console.log("[AboutPage] Raw response:", response);

        // ✅ Service mengembalikan { data: about, jenjang: {...} }
        // Controller melakukan spread: res.json({ message, ...result })
        // Sehingga struktur akhir response adalah: { message, data, jenjang }
        // Axios membungkusnya lagi: axiosResponse.data = { message, data, jenjang }
        // Jadi kita akses: response.data (hasil getRequest sudah unwrap axios)
        // Cek apakah getRequest sudah mengembalikan axiosResponse.data atau raw axios
        const payload = response?.data?.about_id
          ? response.data // getRequest return axiosRes.data.data
          : response?.about_id
            ? response // getRequest return axiosRes.data langsung
            : (response?.data ?? null); // fallback

        console.log("[AboutPage] Payload:", payload);
        setAboutData(payload);
      } catch (error) {
        console.error("[AboutPage] Error fetching about data:", error);
        setAboutData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, [level]);

  if (isLoading) {
    return (
      <div className="about-page">
        <div className="about-notfound">
          <div className="about-notfound-inner">
            <span className="about-notfound-icon">⏳</span>
            <p>Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="about-page">
        <div className="about-notfound">
          <div className="about-notfound-inner">
            <span className="about-notfound-icon">😕</span>
            <h1>Halaman Tidak Ditemukan</h1>
            <p>
              Konten halaman about untuk jenjang{" "}
              <strong>{level?.toUpperCase()}</strong> belum tersedia.
            </p>
            <p className="about-notfound-hint">
              Silakan hubungi administrator untuk menambahkan konten ini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page">
      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-image-wrap">
          {aboutData.hero_image ? (
            <img
              src={`${BASE_URL}/${aboutData.hero_image}`}
              alt={aboutData.hero_title}
              className="about-hero-image"
            />
          ) : (
            <div className="about-hero-image-placeholder" />
          )}
          <div className="about-hero-overlay" />
        </div>

        <div className="about-hero-content">
          {aboutData.hero_badge && (
            <span className="about-hero-badge">{aboutData.hero_badge}</span>
          )}
          <h1 className="about-hero-title">{aboutData.hero_title}</h1>
          {aboutData.hero_subtitle && (
            <p className="about-hero-subtitle">{aboutData.hero_subtitle}</p>
          )}
          {aboutData.hero_meta_pills &&
            aboutData.hero_meta_pills.length > 0 && (
              <div className="about-hero-meta">
                {aboutData.hero_meta_pills.map((pill, idx) => (
                  <span key={idx} className="about-meta-pill">
                    {pill}
                  </span>
                ))}
              </div>
            )}
        </div>
      </section>

      {/* ── DESKRIPSI + VISI ── */}
      {(aboutData.description_text || aboutData.visi_quote) && (
        <section className="about-section about-desc-section">
          <div className="about-container">
            <div className="about-desc-grid">
              {aboutData.description_text && (
                <div className="about-desc-block">
                  <div className="about-section-label">Tentang Kami</div>
                  <p className="about-desc-text">
                    {aboutData.description_text}
                  </p>
                </div>
              )}
              {aboutData.visi_quote && (
                <div className="about-visi-block">
                  <div className="about-section-label">Visi</div>
                  <blockquote className="about-visi-quote">
                    <span className="about-visi-mark">"</span>
                    {aboutData.visi_quote}
                    <span className="about-visi-mark">"</span>
                  </blockquote>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── KEUNGGULAN ── */}
      {aboutData.highlights && aboutData.highlights.length > 0 && (
        <section className="about-section about-highlights-section">
          <div className="about-container">
            <div className="about-section-header">
              <div className="about-section-label">Keunggulan Program</div>
              <h2 className="about-section-title">Mengapa Memilih Kami?</h2>
            </div>
            <div className="about-highlights-grid">
              {aboutData.highlights.map((item, idx) => (
                <div key={idx} className="about-highlight-card">
                  <span className="about-highlight-icon">{item.icon}</span>
                  <span className="about-highlight-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FASILITAS ── */}
      {aboutData.fasilitas_items && aboutData.fasilitas_items.length > 0 && (
        <section className="about-section about-fasilitas-section">
          <div className="about-container">
            <div className="about-section-header">
              <div className="about-section-label">Fasilitas</div>
              <h2 className="about-section-title">Sarana & Prasarana</h2>
            </div>
            <div className="about-fasilitas-grid">
              {aboutData.fasilitas_items.map((item, idx) => (
                <div key={idx} className="about-fasilitas-card">
                  <span className="about-fasilitas-icon">{item.icon}</span>
                  <p className="about-fasilitas-nama">{item.nama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {aboutData.cta_title && (
        <section className="about-cta-section">
          <div className="about-container">
            <div className="about-cta-box">
              <h2 className="about-cta-title">{aboutData.cta_title}</h2>
              {aboutData.cta_description && (
                <p className="about-cta-desc">{aboutData.cta_description}</p>
              )}
              {aboutData.cta_button_text && aboutData.cta_button_url && (
                <a href={aboutData.cta_button_url} className="about-cta-btn">
                  {aboutData.cta_button_text}
                </a>
              )}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
};

export default AboutPage;
