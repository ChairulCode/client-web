import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./announcement.css";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest } from "../../utils/api-call";
import { formatTime } from "../../utils/time-format";
import { parseImages } from "../../utils/imageHelper";

export interface Metadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface Jenjang {
  jenjang_id: string;
  nama_jenjang: string;
  kode_jenjang: string;
}

export interface Jenjang_relasi {
  prestasi_id: string;
  jenjang_id: string;
  jenjang: Jenjang;
}

export interface Data {
  prestasi_id: string;
  judul: string;
  deskripsi: string;
  konten: string;
  path_gambar: string;
  tanggal_publikasi: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  penulis_user_id: string;
  editor_user_id?: string;
  jenjangJenjang_id?: string;
  jenjang_relasi: Jenjang_relasi[];
}

export interface AchievementsResponse {
  message: string;
  metadata: Metadata;
  data: Data[];
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Announcement = ({}: { jenjang?: string }) => {
  const navigate = useNavigate();
  const footerRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<AchievementsResponse["data"]>([]);
  const [stopped, setStopped] = useState(false);
  const [, setNavbarHeight] = useState(0);
  const [expandedCards, setExpandedCards] = useState<{
    [key: string]: boolean;
  }>({});
  // State untuk track active image index per card
  const [activeImageIndex, setActiveImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const params = useParams();

  const getGradeColors = (grade: string) => {
    switch (grade) {
      case "PG-TK":
        return "#86efac"; // bg-green-300
      case "SD":
        return "#fde047"; // bg-yellow-300
      case "SMP":
        return "#fca5a5"; // bg-red-300
      case "SMA":
        return "#93c5fd"; // bg-blue-300
      default:
        return "#93c5fd"; // bg-blue-300
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 80 });
  }, []);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector(".navbar");
      if (navbar && headerRef.current) {
        const height = navbar.getBoundingClientRect().height;
        setNavbarHeight(height);
        headerRef.current.style.top = `${height}px`;
      }
    };
    updateNavbarHeight();
    const handleScroll = () => updateNavbarHeight();
    const handleResize = () => updateNavbarHeight();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      const observer = new MutationObserver(updateNavbarHeight);
      observer.observe(navbar, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    footerRef.current = footer as HTMLElement;
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setStopped(true);
        else setStopped(false);
      },
      { threshold: 0 },
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Ganti gambar aktif pada card tertentu
  const handleImageDotClick = (prestasi_id: string, index: number) => {
    setActiveImageIndex((prev) => ({ ...prev, [prestasi_id]: index }));
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response: AchievementsResponse = await getRequest(
          "prestasi?page=1&limit=1000",
        );
        let filteredData = response.data.filter((item) => item.is_published);
        if (params?.level) {
          filteredData = filteredData.filter((item) =>
            item.jenjang_relasi.some(
              (relasi) => relasi.jenjang.kode_jenjang === params.level,
            ),
          );
        }
        const sorted = filteredData.sort(
          (a, b) =>
            new Date(b.tanggal_publikasi).getTime() -
            new Date(a.tanggal_publikasi).getTime(),
        );
        setData(sorted.slice(0, 3));
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [params?.level]);

  return (
    <section id="prestasi" className="announcement-section">
      <div
        ref={headerRef}
        className={`announcement-header sticky-header ${stopped ? "stopped" : ""}`}
        data-aos="fade-down"
      >
        <h1>📢 Prestasi Sekolah</h1>
      </div>

      <p className="announcement-subtitle">
        Informasi terbaru seputar aktivitas sekolah
      </p>

      <div className="announcement-grid">
        {data &&
          data.map((item, index) => {
            const images = parseImages(item.path_gambar);
            const activeIdx = activeImageIndex[item.prestasi_id] ?? 0;
            const currentImage = images[activeIdx] || images[0] || "";

            return (
              <div
                key={item.prestasi_id}
                className="announcement-card"
                data-aos="fade-up"
                data-aos-delay={index * 120}
              >
                {/* IMAGE */}
                <div
                  className="announcement-image"
                  style={{
                    position: "relative",
                    background: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    minHeight: "200px",
                  }}
                >
                  <img
                    src={`${BASE_URL}/${currentImage}`}
                    alt={item.judul}
                    className="announcement-img"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "280px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />

                  {/* Dot navigator — hanya tampil jika ada lebih dari 1 gambar */}
                  {images.length > 1 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      {images.map((_, imgIdx) => (
                        <button
                          key={imgIdx}
                          onClick={() =>
                            handleImageDotClick(item.prestasi_id, imgIdx)
                          }
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            border: "none",
                            cursor: "pointer",
                            backgroundColor:
                              imgIdx === activeIdx
                                ? "#fff"
                                : "rgba(255,255,255,0.5)",
                            padding: 0,
                            transition: "background-color 0.2s",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Badge jumlah gambar */}
                  {images.length > 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        borderRadius: "12px",
                        padding: "2px 8px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {activeIdx + 1}/{images.length}
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="announcement-content-wrapper">
                  <div className="announcement-date-badge">
                    {formatTime(item.tanggal_publikasi, "DD MMMM yyyy")}
                  </div>

                  {/* Badge Jenjang */}
                  {item.jenjang_relasi && item.jenjang_relasi.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        flexWrap: "wrap",
                        marginBottom: "10px",
                        marginTop: "6px",
                      }}
                    >
                      {item.jenjang_relasi.map((relasi) => (
                        <span
                          key={relasi.jenjang_id}
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: getGradeColors(
                              relasi.jenjang.kode_jenjang,
                            ),
                            color: "#000",
                            textAlign: "center",
                            minWidth: "50px",
                          }}
                        >
                          {relasi.jenjang.kode_jenjang}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="announcement-title">{item.judul}</h2>

                  <div className="announcement-text-container">
                    <p
                      className={`announcement-text ${
                        expandedCards[item.prestasi_id] ? "expanded" : ""
                      }`}
                    >
                      {item.konten}
                    </p>
                    {item.konten.length > 150 && (
                      <button
                        className="show-more-btn"
                        onClick={() => toggleExpand(item.prestasi_id)}
                      >
                        {expandedCards[item.prestasi_id]
                          ? "Lihat Lebih Sedikit ↑"
                          : "Lihat Selengkapnya ↓"}
                      </button>
                    )}
                  </div>

                  <button
                    className="announcement-btn"
                    onClick={() => navigate(`/prestasi/${item.prestasi_id}`)}
                    data-aos="zoom-in"
                    data-aos-delay={index * 200 + 150}
                  >
                    Baca Selengkapnya →
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default Announcement;
