import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Users,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import mikrologo from "/assets/mikroskil.png";
import "./footer.css";

interface SocialMedia {
  social_media_id: number;
  platform: string;
  username: string;
  url: string;
  level: "SMA" | "SMP" | "SD" | "PGTK" | string;
}

const API_URL = "http://localhost:3000/api/v1/sosial";

// ─── SVG Icon per platform ────────────────────────────────────────────────────
const SocialIcon = ({
  platform,
  size = 20,
}: {
  platform: string;
  size?: number;
}) => {
  const s = size;
  switch (platform.toLowerCase()) {
    case "instagram":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "youtube":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
        </svg>
      );
    case "facebook":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    default:
      return <ExternalLink size={s} />;
  }
};

// ─── Konfigurasi warna per platform ──────────────────────────────────────────
const PLATFORM_CONFIG: Record<
  string,
  {
    iconColor: string;
    pillBg: string;
    pillColor: string;
    accentBorder: string;
  }
> = {
  instagram: {
    iconColor: "#fff",
    pillBg: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
    pillColor: "#fff",
    accentBorder: "rgba(253,29,29,0.45)",
  },
  youtube: {
    iconColor: "#fff",
    pillBg: "#FF0000",
    pillColor: "#fff",
    accentBorder: "rgba(255,0,0,0.45)",
  },
  facebook: {
    iconColor: "#fff",
    pillBg: "#1877F2",
    pillColor: "#fff",
    accentBorder: "rgba(24,119,242,0.45)",
  },
  tiktok: {
    iconColor: "#fff",
    pillBg: "linear-gradient(135deg,#25F4EE,#FE2C55)",
    pillColor: "#fff",
    accentBorder: "rgba(254,44,85,0.45)",
  },
};

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [socialData, setSocialData] = useState<SocialMedia[]>([]);
  const schoolLocation = "Jl. Asia No No.143 Medan 20214, Sumatera Utara";

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await axios.get(API_URL);
        setSocialData(response.data.data || response.data || []);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchSocials();
  }, []);

  const handleMapClick = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolLocation)}`;
    window.open(mapsUrl, "_blank");
  };

  const schoolStats = [
    { icon: Users, label: "Ekstrakulikuler", value: "9" },
    { icon: BookOpen, label: "Tingkatan", value: "4" },
    { icon: Award, label: "Prestasi", value: "50+" },
  ];

  // ─── Render social links dengan icon + card style baru ───────────────────
  const renderSocialLinks = (level: string) => {
    const filtered = socialData.filter(
      (item) => item.level?.toLowerCase() === level.toLowerCase(),
    );
    const order = ["Instagram", "Youtube", "Facebook", "Tiktok"];
    const sorted = [...filtered].sort(
      (a, b) => order.indexOf(a.platform) - order.indexOf(b.platform),
    );

    if (sorted.length === 0)
      return (
        <p
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.4)",
            fontStyle: "italic",
            marginTop: 8,
          }}
        >
          Belum tersedia
        </p>
      );

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 12,
        }}
      >
        {sorted.map((link) => {
          const cfg = PLATFORM_CONFIG[link.platform.toLowerCase()];
          return (
            <button
              key={link.social_media_id}
              onClick={() => window.open(link.url, "_blank")}
              title={`Buka ${link.platform} ${link.username}`}
              style={{
                /* ── kartu transparan dengan blur ── */
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: `1.5px solid ${cfg?.accentBorder ?? "rgba(255,255,255,0.15)"}`,
                borderRadius: 14,
                padding: "14px 10px 12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                transition: "transform .18s, background .18s, box-shadow .18s",
                boxShadow:
                  "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                width: "100%",
                minHeight: 95,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow =
                  "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
              }}
            >
              {/* Icon brand — putih agar terlihat di atas bg gelap */}
              <div
                style={{
                  color: cfg?.iconColor ?? "#fff",
                  filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.4))",
                  lineHeight: 1,
                }}
              >
                <SocialIcon platform={link.platform} size={24} />
              </div>

              {/* Nama platform — pill warna brand */}
              <span
                style={{
                  background: cfg?.pillBg ?? "rgba(255,255,255,0.2)",
                  color: cfg?.pillColor ?? "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  padding: "2px 10px",
                  borderRadius: 999,
                  lineHeight: 1.6,
                  whiteSpace: "nowrap",
                }}
              >
                {link.platform}
              </span>

              {/* Username — putih dengan shadow agar terbaca */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.3,
                }}
              >
                @{link.username}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <footer className="footer">
      <div className="footer-bg-pattern"></div>
      <div className="footer-bg-element footer-bg-element--1"></div>
      <div className="footer-bg-element footer-bg-element--2"></div>
      <div className="footer-bg-element footer-bg-element--3"></div>

      <div className="footer-container">
        <div className="footer-header">
          <div className="footer-header-icon">
            <GraduationCap size={40} className="text-yellow-300" />
          </div>
          <h2 className="footer-title">Perguruan WR Supratman 1 Medan</h2>
          <p className="footer-subtitle">
            Membangun Generasi Unggul untuk Masa Depan yang Cemerlang
          </p>
        </div>

        <div className="footer-stats">
          {schoolStats.map((stat, index) => (
            <div key={index} className="footer-stat-card">
              <div className="footer-stat-content">
                <div className="footer-stat-icon">
                  <stat.icon size={28} className="text-white" />
                </div>
                <div className="footer-stat-info">
                  <p className="footer-stat-value">{stat.value}</p>
                  <p className="footer-stat-label">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="footer-main-grid">
          <div className="footer-left-column">
            <div className="footer-section">
              <h3 className="footer-section-title">
                <MapPin className="footer-section-icon" size={28} />
                Lokasi & Kontak
              </h3>

              <div className="footer-address-card">
                <div className="footer-address-content">
                  <MapPin className="footer-address-icon" size={20} />
                  <div className="footer-address-text">
                    <h4 className="footer-address-title">Alamat Sekolah</h4>
                    <p className="footer-address-detail">
                      Jl. Asia No No.143 Medan 20214
                      <br />
                      Sumatera Utara
                    </p>
                  </div>
                </div>
              </div>

              <div className="footer-maps-container">
                <div
                  className="footer-maps-image-wrapper"
                  onClick={handleMapClick}
                >
                  <div className="footer-maps-image-container">
                    <div className="footer-maps-placeholder">
                      <iframe
                        title="School Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.02534567!2d98.6872!3d3.5894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMzUnMjEuOCJOIDk4wrA0MScxMy45IkU!5e0!3m2!1sid!2sid!4v123456789"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                    <div className="footer-maps-overlay">
                      <div className="footer-maps-overlay-content">
                        <div className="footer-maps-overlay-icon">
                          <MapPin size={24} />
                        </div>
                        <div className="footer-maps-overlay-text">
                          <h4 className="footer-maps-overlay-title">
                            Klik untuk membuka di Google Maps
                          </h4>
                          <p className="footer-maps-overlay-subtitle">
                            Lihat rute dan lokasi lengkap
                          </p>
                        </div>
                        <ExternalLink
                          className="footer-maps-overlay-external"
                          size={20}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer-contact-grid">
                <a
                  href="mailto:wr_supratman1@yahoo.com"
                  className="footer-contact-card"
                >
                  <div className="footer-contact-content">
                    <Mail
                      className="footer-contact-icon footer-contact-icon--mail"
                      size={20}
                    />
                    <div className="footer-contact-text">
                      <p className="footer-contact-label">Email</p>
                      <p className="footer-contact-value">
                        wr_supratman1@yahoo.com
                      </p>
                    </div>
                  </div>
                </a>
                <a href="tel:+62617345093" className="footer-contact-card">
                  <div className="footer-contact-content">
                    <Phone
                      className="footer-contact-icon footer-contact-icon--phone"
                      size={20}
                    />
                    <div className="footer-contact-text">
                      <p className="footer-contact-label">Telepon</p>
                      <p className="footer-contact-value">061-7345093</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-right-column">
            <div className="footer-section">
              <h3 className="footer-section-title">
                <BookOpen className="footer-section-icon" size={28} />
                Informasi Sekolah
              </h3>
              <div
                className="footer-info-card"
                onClick={() => navigate("/informasi-sekolah")}
                style={{ cursor: "pointer" }}
              >
                <div className="footer-info-content">
                  <div className="footer-info-item">
                    <h4 className="footer-info-title">Visi</h4>
                    <p className="footer-info-text mb-6">
                      Menjadikan SMA WR Supratman 1 Medan Diakui Keunggulannya
                      di Kota Medan, di Tingkat Provinsi dan di Tingkat
                      Nasional.
                    </p>
                    <h4 className="footer-info-title">Misi</h4>
                    <ol className="footer-mission-list">
                      <li>
                        Melaksanakan Pendidikan Yang Bermutu, Efektif, dan
                        Dinamis Untuk Menghasilkan Lulusan Yang Berkualitas,
                        Berkompeten, Terdidik, Kreatif, Cakap, dan Terampil
                        dalam dalam bidang ICT dan Penguasaan
                      </li>
                      <li>
                        Bahasa (Bahasa Indonesia, Bahasa Mandarin dan Bahasa
                        Inggris).
                      </li>
                      <li>
                        Melaksanakan Pendidikan Yang Berdasarkan Budi Pekerti
                        Luhur Untuk Menghasilkan Lulusan Yang Berkepribadian,
                        Berkarakter, Beretika Tinggi, Berakhlak Mulia, Beriman,
                        Bertaqwa, dan Mengabdi Untuk Kesejahteraan Bangsa dan
                        Negara.
                      </li>
                      <li>
                        Mendidik Para Siswa Menjadi Manusia Seutuhnya Dengan
                        Mengembangkan Seluruh Potensi Anak Dengan Proses
                        Pendidikan Yang Menyesuaikan Potensi Anak Secara
                        Individual Meliputi Kecerdasan Fisik (PQ), Kecerdasan
                        Intelektual (IQ), Kecerdasan Emosional (EQ) Dan
                        Kecerdasan Spiritual (SQ).
                      </li>
                    </ol>
                  </div>
                  <div className="footer-info-item">
                    <h4 className="footer-info-title">Jam Operasional</h4>
                    <div className="footer-schedule">
                      <p>Senin - Sabtu: 07:00 - 15:30 WIB</p>
                      <p>Minggu: Tutup</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Social Media Section ── */}
            <div className="footer-social-sections">
              {[
                { level: "SMA", label: "Media Sosial SMA" },
                { level: "SMP", label: "Media Sosial SMP" },
                { level: "SD", label: "Media Sosial SD" },
                { level: "PGTK", label: "Media Sosial PG/TK" },
              ].map(({ level, label }) => (
                <div key={level} className="footer-social-item">
                  <h3 className="footer-section-title">
                    <ExternalLink className="footer-section-icon" size={20} />
                    {label}
                  </h3>
                  {renderSocialLinks(level)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-partner">
              <div className="footer-partner-logo">
                <img
                  src={mikrologo}
                  alt="Mikroskil Logo"
                  className="footer-logo"
                />
              </div>
              <div className="footer-partner-info">
                <p className="footer-partner-title">Education Partners</p>
                <p className="footer-partner-name">Universitas Mikroskil</p>
                <p className="footer-partner-desc">Web Development & Design</p>
              </div>
            </div>
            <div className="footer-copyright">
              <p className="footer-copyright-main">
                © 2025 Perguruan WR Supratman 1 Medan. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom-border"></div>
    </footer>
  );
};

export default Footer;
