import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// Gunakan instance yang kita buat tadi agar baseURL otomatis
import axios from "axios";
import Footer from "../../components/footer";
import "./css/pengumuman-kelulusan.css";

const PengumumanKelulusan = () => {
  const { level } = useParams(); // Isinya misal: "sd", "smp"
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mapping slug URL ke Nama Jenjang untuk ditampilkan di UI
  const getReadableLevel = (lvl: string | undefined) => {
    const map: Record<string, string> = {
      "pg-tk": "PG & TK",
      sd: "SD",
      smp: "SMP",
      sma: "SMA",
    };
    return map[lvl || ""] || lvl?.toUpperCase() || "";
  };

  // Di PengumumanKelulusan.tsx
  // PengumumanKelulusan.tsx

  const fetchGraduationData = async () => {
    setLoading(true);
    try {
      // 1. Ambil slug dari URL (misal: "pg-tk") dan jadikan HURUF BESAR
      // agar cocok dengan data di database "PG-TK"
      const searchParam = level?.toUpperCase();

      // 2. Tembak API
      const response = await axios.get(
        `http://localhost:3000/api/v1/graduation`,
        {
          params: {
            search: searchParam, // Ini akan mengirim "PG-TK"
            limit: 100,
          },
        },
      );

      console.log("Kata kunci yang dicari:", searchParam);
      console.log("Data dari server:", response.data);

      // 3. Pastikan mengambil array dari response.data.data
      setData(response.data.data || []);
    } catch (error) {
      console.error("Gagal load data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraduationData();
  }, [level]); // Re-run jika level di URL berubah

  return (
    <>
      <div className="page-layout">
        <div className="pk-page">
          {/* Breadcrumb */}
          <div className="pk-breadcrumb">
            <button
              className="pk-breadcrumb-link"
              onClick={() => navigate("/kelulusan")}
            >
              Kelulusan
            </button>
            <span className="pk-breadcrumb-separator">/</span>
            <span className="pk-breadcrumb-current">
              {getReadableLevel(level)}
            </span>
          </div>

          <div className="pk-wrapper">
            <h1 className="pk-title">
              Pengumuman Kelulusan {getReadableLevel(level)}
            </h1>

            {loading ? (
              <div className="pk-loading">
                <div className="spinner"></div>{" "}
                {/* Tambahkan CSS spinner nanti */}
                <p>Memuat data kelulusan...</p>
              </div>
            ) : data.length > 0 ? (
              <div className="pk-table-container">
                <table className="pk-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>No. Siswa</th>
                      <th>Status</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item.kelulusan_id}>
                        <td>{index + 1}</td>
                        <td className="pk-nama">{item.nama_siswa}</td>
                        <td>{item.nomor_siswa}</td>
                        <td>
                          <span
                            className={`pk-status ${item.status_lulus ? "lulus" : "tidak-lulus"}`}
                          >
                            {item.status_lulus ? "LULUS" : "TIDAK LULUS"}
                          </span>
                        </td>
                        <td>{item.keterangan || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="pk-empty-state">
                <p className="pk-empty">
                  Belum ada data pengumuman untuk {getReadableLevel(level)}.
                </p>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PengumumanKelulusan;
