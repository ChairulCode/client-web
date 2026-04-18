import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../../components/footer";
import "./css/nilai-tingkatan.css";

const BASE_URL = (
  import.meta.env.VITE_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

interface NilaiSiswa {
  id: string;
  mataPelajaran: string;
  semester: string;
  tahunAjaran: string;
  nilaiAkhir: number;
}

interface DataSiswa {
  nama: string;
  nisn: string;
  kelas: string;
  daftar_nilai: NilaiSiswa[];
}

// =============================================
// KONFIGURASI KELAS PER TINGKATAN
// =============================================
const KELAS_PER_TINGKATAN: Record<string, string[]> = {
  pgtk: ["TK A", "TK B"],
  sd: ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"],
  smp: ["7A", "7B", "7C", "8A", "8B", "8C", "9A", "9B", "9C"],
  sma: [
    "10 MIPA 1",
    "10 MIPA 2",
    "10 IPS 1",
    "10 IPS 2",
    "11 MIPA 1",
    "11 MIPA 2",
    "11 IPS 1",
    "11 IPS 2",
    "12 MIPA 1",
    "12 MIPA 2",
    "12 IPS 1",
    "12 IPS 2",
  ],
};

// Label nama tingkatan untuk ditampilkan di UI
const LABEL_TINGKATAN: Record<string, string> = {
  pgtk: "PG / TK",
  sd: "SD",
  smp: "SMP",
  sma: "SMA",
};

const NilaiTingkatan = () => {
  const { level } = useParams<{ level: string }>();
  const tingkatan = (level || "").toLowerCase(); // "sma" | "smp" | "sd" | "pgtk"

  const daftarKelas = KELAS_PER_TINGKATAN[tingkatan] || [];
  const labelTingkatan = LABEL_TINGKATAN[tingkatan] || tingkatan.toUpperCase();

  // State form
  const [inputNisn, setInputNisn] = useState("");
  const [inputNama, setInputNama] = useState("");
  const [inputKelas, setInputKelas] = useState("");
  const [inputTglLahir, setInputTglLahir] = useState("");

  // State UI
  const [dataSiswa, setDataSiswa] = useState<DataSiswa | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inputNisn || !inputNama || !inputKelas || !inputTglLahir) {
      setError(
        "Silakan lengkapi semua field: NISN, Nama Lengkap, Kelas, dan Tanggal Lahir.",
      );
      return;
    }

    if (inputTglLahir.length !== 8 || isNaN(Number(inputTglLahir))) {
      setError("Format Tanggal Lahir harus YYYYMMDD (Contoh: 20080520)");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/v1/subject-grades/cek-publik`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nisn: inputNisn,
            nama: inputNama,
            tanggal_lahir: inputTglLahir,
            kelas: inputKelas,
            tingkatan: tingkatan, // kirim tingkatan ke backend sebagai konteks validasi tambahan
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        setDataSiswa(result.data);
      } else {
        setError(
          result.message ||
            "Data tidak ditemukan. Pastikan data yang dimasukkan benar.",
        );
        setDataSiswa(null);
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Pastikan koneksi internet aktif.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDataSiswa(null);
    setError("");
    setInputNisn("");
    setInputNama("");
    setInputKelas("");
    setInputTglLahir("");
  };

  const getPredikat = (nilai: number) => {
    if (nilai >= 90) return "A";
    if (nilai >= 80) return "B";
    if (nilai >= 75) return "C";
    return "D";
  };

  const getPredikatStyle = (nilai: number) => {
    const map: Record<string, { bg: string; color: string }> = {
      A: { bg: "#dcfce7", color: "#166534" },
      B: { bg: "#dbeafe", color: "#1e40af" },
      C: { bg: "#fef3c7", color: "#92400e" },
      D: { bg: "#fee2e2", color: "#991b1b" },
    };
    return map[getPredikat(nilai)];
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: "14px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#374151",
  };

  // Jika tingkatan tidak valid / tidak dikenali
  if (daftarKelas.length === 0) {
    return (
      <>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2 style={{ color: "#e74c3c" }}>Tingkatan tidak ditemukan</h2>
          <p style={{ color: "#888" }}>
            URL tidak valid. Pilih tingkatan yang tersedia.
          </p>
          <Link to="/" style={{ color: "#d4af37" }}>
            ← Kembali ke Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div
        className="nt-wrapper"
        style={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          minHeight: "80vh",
        }}
      >
        {/* Breadcrumb */}
        <nav
          style={{ fontSize: "14px", maxWidth: "900px", margin: "0 auto 20px" }}
        >
          <Link to="/" style={{ color: "#d4af37", textDecoration: "none" }}>
            Home
          </Link>
          <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
          <Link
            to={`/tingkatan/${tingkatan}`}
            style={{ color: "#d4af37", textDecoration: "none" }}
          >
            {labelTingkatan}
          </Link>
          <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
          <span style={{ color: "#666" }}>Cek Nilai Siswa</span>
        </nav>

        {/* ===== FORM ===== */}
        {!dataSiswa && (
          <div
            style={{
              maxWidth: "480px",
              margin: "20px auto",
              padding: "30px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header Form */}
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {labelTingkatan}
              </span>
              <h2
                style={{
                  color: "#2c3e50",
                  margin: "0 0 6px",
                  fontSize: "22px",
                }}
              >
                Cek Nilai Siswa
              </h2>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
                Masukkan data diri untuk melihat nilai rapor Semester Terakhir
              </p>
            </div>

            <form onSubmit={handleSearch}>
              {/* NISN */}
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>NISN</label>
                <input
                  type="text"
                  value={inputNisn}
                  onChange={(e) => setInputNisn(e.target.value)}
                  placeholder="Masukkan NISN"
                  maxLength={10}
                  style={inputStyle}
                />
              </div>

              {/* Nama */}
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Nama Lengkap</label>
                <input
                  type="text"
                  value={inputNama}
                  onChange={(e) => setInputNama(e.target.value)}
                  placeholder="Sesuai Akta Kelahiran / Ijazah"
                  style={inputStyle}
                />
              </div>

              {/* Kelas - Otomatis sesuai tingkatan dari URL */}
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Kelas</label>
                <select
                  value={inputKelas}
                  onChange={(e) => setInputKelas(e.target.value)}
                  style={{
                    ...inputStyle,
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                >
                  <option value="">-- Pilih Kelas {labelTingkatan} --</option>
                  {daftarKelas.map((kelas) => (
                    <option key={kelas} value={kelas}>
                      {kelas}
                    </option>
                  ))}
                </select>
                <small
                  style={{ color: "#888", display: "block", marginTop: "5px" }}
                >
                  *Menampilkan kelas untuk tingkatan {labelTingkatan}
                </small>
              </div>

              {/* Tanggal Lahir */}
              <div style={{ marginBottom: "25px" }}>
                <label style={labelStyle}>Tanggal Lahir</label>
                <input
                  type="text"
                  value={inputTglLahir}
                  onChange={(e) => setInputTglLahir(e.target.value)}
                  placeholder="Format: YYYYMMDD (Contoh: 20080520)"
                  maxLength={8}
                  style={inputStyle}
                />
                <small
                  style={{ color: "#888", display: "block", marginTop: "5px" }}
                >
                  *Tahun-Bulan-Tanggal tanpa spasi/garis
                </small>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: isLoading ? "#e8c96a" : "#d4af37",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                }}
              >
                {isLoading ? "⏳ Mencari Data..." : "🔍 Lihat Nilai"}
              </button>
            </form>

            {error && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "12px 15px",
                  backgroundColor: "#fff5f5",
                  borderLeft: "4px solid #e74c3c",
                  color: "#c0392b",
                  fontSize: "13px",
                  borderRadius: "0 6px 6px 0",
                }}
              >
                ⚠️ {error}
              </div>
            )}
          </div>
        )}

        {/* ===== HASIL NILAI ===== */}
        {dataSiswa && (
          <div
            className="nt-container"
            style={{ maxWidth: "900px", margin: "0 auto" }}
          >
            <button
              onClick={handleReset}
              style={{
                marginBottom: "20px",
                background: "none",
                border: "none",
                color: "#d4af37",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "14px",
                padding: 0,
              }}
            >
              ← Cari Siswa Lain
            </button>

            {/* Profil Siswa */}
            <div
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "10px",
                marginBottom: "20px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                borderLeft: "5px solid #d4af37",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    padding: "3px 12px",
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  {labelTingkatan}
                </span>
              </div>
              <h2
                style={{
                  color: "#2c3e50",
                  margin: "0 0 12px",
                  fontSize: "20px",
                }}
              >
                {dataSiswa.nama}
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "25px",
                  color: "#666",
                  fontSize: "14px",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  <strong style={{ color: "#444" }}>NISN:</strong>{" "}
                  {dataSiswa.nisn}
                </span>
                <span>
                  <strong style={{ color: "#444" }}>Kelas:</strong>{" "}
                  {dataSiswa.kelas}
                </span>
                <span>
                  <strong style={{ color: "#444" }}>
                    Total Mata Pelajaran:
                  </strong>{" "}
                  {dataSiswa.daftar_nilai.length}
                </span>
              </div>
            </div>

            {/* Tabel Nilai */}
            <div
              style={{
                overflowX: "auto",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "white",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#d4af37", color: "white" }}>
                  <tr>
                    <th style={{ padding: "15px", textAlign: "left" }}>No</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>
                      Mata Pelajaran
                    </th>
                    <th style={{ padding: "15px", textAlign: "center" }}>
                      Semester
                    </th>
                    <th style={{ padding: "15px", textAlign: "center" }}>
                      Tahun Ajaran
                    </th>
                    <th style={{ padding: "15px", textAlign: "center" }}>
                      Nilai
                    </th>
                    <th style={{ padding: "15px", textAlign: "center" }}>
                      Predikat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataSiswa.daftar_nilai.length > 0 ? (
                    dataSiswa.daftar_nilai.map((item, index) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: "1px solid #eee",
                          backgroundColor:
                            index % 2 === 0 ? "white" : "#fafafa",
                        }}
                      >
                        <td
                          style={{
                            padding: "14px 15px",
                            color: "#888",
                            fontSize: "13px",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td style={{ padding: "14px 15px", fontWeight: "500" }}>
                          {item.mataPelajaran}
                        </td>
                        <td
                          style={{ padding: "14px 15px", textAlign: "center" }}
                        >
                          {item.semester}
                        </td>
                        <td
                          style={{ padding: "14px 15px", textAlign: "center" }}
                        >
                          {item.tahunAjaran}
                        </td>
                        <td
                          style={{
                            padding: "14px 15px",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#2c3e50",
                          }}
                        >
                          {item.nilaiAkhir}
                        </td>
                        <td
                          style={{ padding: "14px 15px", textAlign: "center" }}
                        >
                          <span
                            style={{
                              padding: "5px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              backgroundColor: getPredikatStyle(item.nilaiAkhir)
                                .bg,
                              color: getPredikatStyle(item.nilaiAkhir).color,
                            }}
                          >
                            {getPredikat(item.nilaiAkhir)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: "40px",
                          textAlign: "center",
                          color: "#888",
                        }}
                      >
                        📭 Data nilai belum tersedia untuk siswa ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p
              style={{
                textAlign: "center",
                color: "#aaa",
                fontSize: "12px",
                marginTop: "15px",
              }}
            >
              Data nilai bersifat rahasia dan hanya dapat diakses oleh siswa
              yang bersangkutan.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default NilaiTingkatan;
