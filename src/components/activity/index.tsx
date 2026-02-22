import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./activity.css";
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

const Activity = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<ActivityResponse["data"]>([]);
  const [, setNavbarHeight] = useState(0);
  const params = useParams();

  /** ---------------------------------------
   *  INIT AOS
   * --------------------------------------- */
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
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

    // Update saat scroll
    const handleScroll = () => {
      updateNavbarHeight();
    };

    // Update saat resize
    const handleResize = () => {
      updateNavbarHeight();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // MutationObserver untuk detect perubahan class navbar
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
   *  FETCH DATA
   * --------------------------------------- */
  useEffect(() => {
    const getData = async () => {
      try {
        const response: ActivityResponse = await getRequest(
          "kegiatan?page=1&limit=1000",
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
        {data
          .filter((item) => item.is_published && item.is_featured)
          .map((item, index) => (
            <div
              key={item.kegiatan_id}
              className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="timeline-content">
                <span className="timeline-date">
                  {formatTime(item.tanggal_publikasi, "DD MMMM yyyy")}
                </span>
                <h2>{item.judul}</h2>
                <p>{item.deskripsi}</p>
                <button
                  className="activity-btn"
                  onClick={() => navigate(`/kegiatan/${item.kegiatan_id}`)}
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

export default Activity;
