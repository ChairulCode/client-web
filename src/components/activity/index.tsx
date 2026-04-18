import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./activity.css";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest } from "../../utils/api-call";
import { formatTime } from "../../utils/time-format";
import { getFirstImage } from "../../utils/imageHelper";

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
  kegiatan_id: string;
  jenjang_id: string;
  jenjang: Jenjang;
}

export interface Penulis {
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
  kegiatan_id: string;
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
  penulis: Penulis;
}

export interface ActivityResponse {
  message: string;
  metadata: Metadata;
  data: Data[];
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Activity = ({}: { jenjang?: string }) => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<ActivityResponse["data"]>([]);
  const [, setNavbarHeight] = useState(0);
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
    AOS.init({ duration: 1000, once: true, offset: 100 });
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
    const getData = async () => {
      try {
        const response: ActivityResponse = await getRequest(
          "kegiatan?page=1&limit=1000",
        );
        const rawData = Array.isArray(response?.data) ? response.data : [];
        let filteredData = rawData.filter((item) => item.is_published);
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
    <section className="activity-section">
      <div
        ref={headerRef}
        className="activity-header sticky-header"
        data-aos="fade-down"
      >
        <h1>📢 Kegiatan Sekolah</h1>
      </div>

      <p className="activity-subtitle">
        Informasi terbaru seputar kegiatan dan aktivitas sekolah.
      </p>

      <div className="timeline">
        {data.map((item, index) => {
          const firstImage = getFirstImage(item.path_gambar);
          return (
            <div
              key={item.kegiatan_id}
              className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="timeline-content">
                {/* Gambar — tampil penuh tanpa crop */}
                {firstImage && (
                  <div
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      marginBottom: "12px",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={`${BASE_URL}/${firstImage}`}
                      alt={item.judul}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "220px",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                )}
                <span className="timeline-date">
                  {formatTime(item.tanggal_publikasi, "DD MMMM yyyy")}
                </span>

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

                <h2>{item.judul}</h2>
                <p>
                  {" "}
                  {item.deskripsi?.length > 120
                    ? `${item.deskripsi.substring(0, 120)}...`
                    : item.deskripsi}
                </p>
                <button
                  className="activity-btn"
                  onClick={() => navigate(`/kegiatan/${item.kegiatan_id}`)}
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

export default Activity;
