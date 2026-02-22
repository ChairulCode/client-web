import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./announcement.css";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest } from "../../utils/api-call";
import { formatTime } from "../../utils/time-format";

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
const Announcement = () => {
  const navigate = useNavigate();
  const footerRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<AchievementsResponse["data"]>([]);
  const [stopped, setStopped] = useState(false);
  const [, setNavbarHeight] = useState(0);
  const [expandedCards, setExpandedCards] = useState<{
    [key: string]: boolean;
  }>({});
  const params = useParams();

  /** ---------------------------------------
   *  INIT AOS — HANYA SEKALI
   * --------------------------------------- */
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
    });
  }, []);

  /** ---------------------------------------
   *  DETECT & UPDATE NAVBAR HEIGHT
   * --------------------------------------- */
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector(".navbar");
      if (navbar && headerRef.current) {
        const height = navbar.getBoundingClientRect().height;
        setNavbarHeight(height);
        headerRef.current.style.top = `${height}px`;
      }
    };

    // Initial check
    updateNavbarHeight();

    // Update saat scroll (karena navbar height berubah saat visible)
    const handleScroll = () => {
      updateNavbarHeight();
    };

    // Update saat resize
    const handleResize = () => {
      updateNavbarHeight();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Gunakan MutationObserver untuk detect perubahan class navbar
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

  /** ---------------------------------------
   *  STOP STICKY HEADER SAAT FOOTER TERLIHAT
   * --------------------------------------- */
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

  /** ---------------------------------------
   *  Expand / Collapse tanpa trigger AOS
   * --------------------------------------- */
  const toggleExpand = (id: string) => {
    setExpandedCards((prev: Record<string, boolean>) => ({
      ...prev,
      [id]: !prev[id as string],
    }));
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response: AchievementsResponse = await getRequest(
          "prestasi?page=1&limit=1000",
        );

        if (params?.level) {
          const filteredData = response.data.filter((item) =>
            item.jenjang_relasi.some(
              (relasi) => relasi.jenjang.kode_jenjang === params.level,
            ),
          );
          setData(filteredData.slice(0, 3));
          return;
        }
        setData(response.data.slice(0, 3));
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
          data
            .filter((item) => item.is_published && item.is_featured)
            .map((item, index) => (
              <div
                key={item.prestasi_id}
                className={`announcement-card`}
                data-aos="fade-up"
                data-aos-delay={index * 120}
              >
                {/* IMAGE */}
                <div className="announcement-image">
                  <img
                    src={`${BASE_URL}/${item.path_gambar}`}
                    alt={item.judul}
                    className="announcement-img"
                  />
                </div>
                {/* CONTENT */}
                <div className="announcement-content-wrapper">
                  <div className="announcement-date-badge">
                    {formatTime(item.tanggal_publikasi, "DD MMMM yyyy")}
                  </div>
                  <h2 className="announcement-title">{item.judul}</h2>

                  {/* TEXT EXPAND AREA (NO AOS!) */}
                  <div className="announcement-text-container">
                    <p
                      className={`announcement-text ${expandedCards[item.prestasi_id] ? "expanded" : ""}`}
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

                  {/* READ MORE BUTTON */}
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
            ))}
      </div>
    </section>
  );
};

export default Announcement;
