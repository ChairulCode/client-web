import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./css/prestasi-tingkatan.css";
import Footer from "../../components/footer";
import { getRequest } from "../../utils/api-call";
import { formatTime } from "../../utils/time-format";
import { Pagination } from "../../components/pagination/pagination";

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

const TingkatanPrestasi = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AchievementsResponse["data"] | null>(null);
  const [backupData, setBackupData] = useState<
    AchievementsResponse["data"] | null
  >(null);
  const params = useParams();

  // PAGINATION
  const [page, setPage] = useState(1);
  const limit = 10; // Items per page
  const totalData = backupData?.length || 0;
  const totalPages = Math.ceil(totalData / limit);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
    });
  }, []);

  // Fetch data on mount or when level changes
  useEffect(() => {
    const getData = async () => {
      try {
        const response: AchievementsResponse = await getRequest(
          "prestasi?page=1&limit=1000",
        );

        if (params?.level) {
          // Filter by level
          const filteredData = response.data.filter((item) =>
            item.jenjang_relasi.some(
              (relasi) => relasi.jenjang.kode_jenjang === params.level,
            ),
          );
          setBackupData(filteredData);
          setData(filteredData.slice(0, limit)); // Show first page
        } else {
          // No filter, show all
          setBackupData(response.data);
          setData(response.data.slice(0, limit)); // Show first page
        }

        // Reset to page 1 when level changes
        setPage(1);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [params?.level]); // Re-fetch when level changes

  // Handle pagination change
  useEffect(() => {
    if (backupData) {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      setData(backupData.slice(startIndex, endIndex));

      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page, backupData]);

  // Format level title
  const getLevelTitle = (level: string | undefined) => {
    const levelMap: { [key: string]: string } = {
      "pg-tk": "PG-TK",
      sd: "SD",
      smp: "SMP",
      sma: "SMA",
    };
    return levelMap[level?.toLowerCase() || ""] || level?.toUpperCase();
  };

  return (
    <>
      <div className="tp-page">
        {/* Breadcrumb */}
        <div className="tp-breadcrumb" data-aos="fade-down">
          <button
            onClick={() => navigate("/prestasi")}
            className="tp-breadcrumb-link"
          >
            Prestasi
          </button>
          <span className="tp-breadcrumb-separator">/</span>
          <span className="tp-breadcrumb-current">
            {getLevelTitle(params?.level)}
          </span>
        </div>

        <section className="tingkatan-prestasi-section">
          {/* HEADER */}
          <div className="tp-header" data-aos="fade-down">
            <h1>🏆 Prestasi Tingkat {getLevelTitle(params?.level)}</h1>
            <p>
              Menampilkan {totalData} prestasi gemilang siswa di tingkat{" "}
              {getLevelTitle(params?.level)}
            </p>
          </div>

          {/* KONTEN */}
          {data && data.length > 0 ? (
            <div className="">
              <div className="tp-grid">
                {data.map((item, index) => (
                  <div
                    key={item.prestasi_id}
                    className="tp-card"
                    data-aos="fade-up"
                    data-aos-delay={index * 120}
                  >
                    {/* IMAGE */}
                    {item.path_gambar && (
                      <div className="tp-image-container">
                        <img
                          src={`${BASE_URL}/${item.path_gambar}`}
                          alt={item.judul}
                          className="tp-image"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/assets/placeholder-achievement.jpg";
                          }}
                        />
                        <div className="tp-image-overlay">
                          <span className="tp-badge-overlay">
                            {formatTime(item.tanggal_publikasi, "DD MMMM yyyy")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CONTENT */}
                    <div className="tp-card-content">
                      {/* BADGE (jika tidak ada gambar) */}
                      {!item.path_gambar && (
                        <div className="tp-badge">
                          {formatTime(item.tanggal_publikasi, "DD MMMM yyyy")}
                        </div>
                      )}

                      {/* TITLE */}
                      <h2 className="tp-title">{item.judul}</h2>

                      {/* DESCRIPTION */}
                      {item.deskripsi && (
                        <p className="tp-description">{item.deskripsi}</p>
                      )}

                      {/* BUTTON DETAIL */}
                      <button
                        className="tp-btn"
                        onClick={() =>
                          navigate(`/prestasi/${item.prestasi_id}`)
                        }
                      >
                        Baca Selengkapnya →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION - Only show if more than 1 page */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </div>
          ) : (
            // NO DATA
            <div className="tp-empty" data-aos="fade-up">
              <h2>
                Belum ada prestasi di tingkat {getLevelTitle(params?.level)} 🎯
              </h2>
              <p>
                Prestasi untuk tingkat <b>{getLevelTitle(params?.level)}</b>{" "}
                akan ditampilkan di sini apabila sudah tersedia.
              </p>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default TingkatanPrestasi;
