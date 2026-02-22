import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../../components/footer";
// PASTIKAN BARIS DI BAWAH INI ADA
import "./css/nilai-tingkatan.css";

interface SubjectGrade {
  grade_id: string;
  nama_siswa: string;
  student_user_id: string;
  tahun_ajaran: string;
  semester: string;
  nilai_json: Record<string, number>;
  catatan?: string;
  jenjang: {
    nama_jenjang: string;
  };
}

const NilaiTingkatan = () => {
  const { level } = useParams();
  const normalizedLevel = (level || "").toUpperCase();
  const [listNilai, setListNilai] = useState<SubjectGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/v1/subject-grades?search=${normalizedLevel}`,
      );
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const result = await response.json();
      if (result.success) setListNilai(result.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [normalizedLevel]);

  const getPredikat = (nilai: number) => {
    if (nilai >= 90) return "A";
    if (nilai >= 80) return "B";
    if (nilai >= 70) return "C";
    return "D";
  };

  const groupedData = listNilai.reduce(
    (acc, curr) => {
      const tahun = curr.tahun_ajaran;
      if (!acc[tahun]) acc[tahun] = [];
      acc[tahun].push(curr);
      return acc;
    },
    {} as Record<string, SubjectGrade[]>,
  );

  return (
    <>
      <div
        className="nt-wrapper"
        style={{ padding: "20px", backgroundColor: "#f9f9f9" }}
      >
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "20px", fontSize: "14px" }}>
          <Link to="/" style={{ color: "#d4af37", textDecoration: "none" }}>
            Home
          </Link>
          <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
          <span style={{ color: "#666" }}>{normalizedLevel}</span>
          <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
          <span style={{ fontWeight: "bold" }}>Nilai Mapel</span>
        </nav>

        <h1
          className="nt-title"
          style={{
            textAlign: "center",
            color: "#2c3e50",
            marginBottom: "30px",
          }}
        >
          Data Nilai Siswa {normalizedLevel}
        </h1>

        {isLoading ? (
          <p style={{ textAlign: "center" }}>Memuat data...</p>
        ) : Object.keys(groupedData).length > 0 ? (
          <div className="nt-container">
            {Object.entries(groupedData).map(([tahunAjaran, siswaList]) => (
              <div key={tahunAjaran} style={{ marginBottom: "40px" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    marginBottom: "15px",
                    color: "#333",
                  }}
                >
                  Tahun Ajaran: {tahunAjaran}
                </h2>

                <div
                  style={{
                    overflowX: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                  }}
                >
                  <table
                    className="nt-table"
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      backgroundColor: "white",
                    }}
                  >
                    <thead
                      style={{ backgroundColor: "#d4af37", color: "white" }}
                    >
                      <tr>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "left",
                            width: "50px",
                          }}
                        >
                          No
                        </th>
                        <th style={{ padding: "12px", textAlign: "left" }}>
                          Nama Siswa
                        </th>
                        <th style={{ padding: "12px", textAlign: "left" }}>
                          Semester
                        </th>
                        <th style={{ padding: "12px", textAlign: "left" }}>
                          Mata Pelajaran
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            width: "80px",
                          }}
                        >
                          Nilai
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            width: "100px",
                          }}
                        >
                          Predikat
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {siswaList.map((grade, sIndex) => {
                        const mapelEntries = Object.entries(grade.nilai_json);
                        return mapelEntries.map(([mapel, nilai], mIndex) => {
                          const predikat = getPredikat(nilai);
                          return (
                            <tr
                              key={`${grade.grade_id}-${mIndex}`}
                              style={{ borderBottom: "1px solid #eee" }}
                            >
                              {mIndex === 0 && (
                                <>
                                  <td
                                    rowSpan={mapelEntries.length}
                                    style={{
                                      padding: "12px",
                                      verticalAlign: "top",
                                    }}
                                  >
                                    {sIndex + 1}
                                  </td>
                                  <td
                                    rowSpan={mapelEntries.length}
                                    style={{
                                      padding: "12px",
                                      verticalAlign: "top",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {grade.nama_siswa}
                                  </td>
                                  <td
                                    rowSpan={mapelEntries.length}
                                    style={{
                                      padding: "12px",
                                      verticalAlign: "top",
                                    }}
                                  >
                                    {grade.semester}
                                  </td>
                                </>
                              )}
                              <td
                                style={{
                                  padding: "12px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {mapel}
                              </td>
                              <td
                                style={{
                                  padding: "12px",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                {nilai}
                              </td>
                              <td
                                style={{ padding: "12px", textAlign: "center" }}
                              >
                                <span
                                  style={{
                                    backgroundColor:
                                      predikat === "A" ? "#dcfce7" : "#fef3c7",
                                    color:
                                      predikat === "A" ? "#166534" : "#92400e",
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    border: "1px solid currentColor",
                                  }}
                                >
                                  {predikat}
                                </span>
                              </td>
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <p
              style={{
                textAlign: "right",
                fontSize: "12px",
                color: "#888",
                marginTop: "10px",
              }}
            >
              ← Geser untuk melihat lebih banyak →
            </p>
          </div>
        ) : (
          <p className="nt-empty">Belum ada data nilai.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default NilaiTingkatan;
