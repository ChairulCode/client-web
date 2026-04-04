import { useState, useEffect } from "react";
import "./facility.css";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface FasilitasGambar {
  gambar_id: string;
  fasilitas_id: string;
  path_gambar: string;
  urutan: number;
}

interface Facility {
  fasilitas_id: string;
  nama: string;
  deskripsi: string | null;
  icon: string | null;
  is_active: boolean;
  urutan: number | null;
  gambar: FasilitasGambar[];
}

// ─── CONFIG ──────────────────────────────────────────────────────────────────

// Gunakan VITE_BASE_URL yang sudah ada di .env client
// Untuk API: http://localhost:3000/api/v1/fasilitas
// Untuk gambar: http://localhost:3000/facilities/nama-file.webp
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
const API_BASE_URL = `${BASE_URL}/api/v1`;

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Fasilitas() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // ─── FETCH DATA ──────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchFasilitas = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch(`${API_BASE_URL}/fasilitas?page=1&limit=100`);
        if (!res.ok) throw new Error("Gagal memuat data");

        const json = await res.json();

        const aktif: Facility[] = (json.data || [])
          .filter((f: Facility) => f.is_active)
          .sort(
            (a: Facility, b: Facility) => (a.urutan ?? 999) - (b.urutan ?? 999),
          );

        setFacilities(aktif);

        if (aktif.length > 0) {
          setSelectedFacility(aktif[0]);
          setActiveIndex(0);
          setActiveImageIndex(0);
        }
      } catch (e) {
        console.error(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFasilitas();
  }, []);

  // Reset activeImageIndex ke 0 setiap kali fasilitas yang dipilih berubah
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedFacility?.fasilitas_id]);

  // ─── HANDLERS ────────────────────────────────────────────────────────────

  const handleFacilityClick = (facility: Facility, index: number) => {
    setSelectedFacility(facility);
    setActiveIndex(index);
    setActiveImageIndex(0);
  };

  const handlePrevImage = () => {
    const total = currentImages.length;
    if (total <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNextImage = () => {
    const total = currentImages.length;
    if (total <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % total);
  };

  // ─── LOADING ─────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="facilities-page">
          <div className="facilities-hero">
            <h1 className="text-gradient">Fasilitas dan Layanan</h1>
            <p>
              Fasilitas lengkap dan modern untuk mendukung kegiatan belajar
              mengajar
            </p>
          </div>
          <div className="facilities-container">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  border: "4px solid #ddc588",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ color: "#666", fontSize: "16px" }}>
                Memuat data fasilitas...
              </p>
            </div>
          </div>
        </div>
        <Footer />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  // ─── ERROR / KOSONG ───────────────────────────────────────────────────────

  if (isError || facilities.length === 0) {
    return (
      <>
        <Navbar />
        <div className="facilities-page">
          <div className="facilities-hero">
            <h1 className="text-gradient">Fasilitas dan Layanan</h1>
            <p>
              Fasilitas lengkap dan modern untuk mendukung kegiatan belajar
              mengajar
            </p>
          </div>
          <div className="facilities-container">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
                gap: "12px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "60px" }}>🏫</span>
              <p style={{ color: "#666", fontSize: "16px" }}>
                {isError
                  ? "Gagal memuat data fasilitas. Silakan coba lagi nanti."
                  : "Belum ada data fasilitas yang tersedia."}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── DERIVED STATE ────────────────────────────────────────────────────────

  // Sort gambar berdasarkan urutan agar tampil konsisten
  const currentImages: FasilitasGambar[] = selectedFacility
    ? [...(selectedFacility.gambar ?? [])].sort((a, b) => a.urutan - b.urutan)
    : [];

  const hasMultipleImages = currentImages.length > 1;

  // Guard: pastikan index tidak melebihi jumlah gambar
  const safeImageIndex =
    currentImages.length > 0
      ? Math.min(activeImageIndex, currentImages.length - 1)
      : 0;

  // Gabungkan BASE_URL + path_gambar
  // path_gambar dari DB  : "facilities/nama-file.webp"
  // URL hasil            : "http://localhost:3000/facilities/nama-file.webp"
  const currentImgSrc =
    currentImages.length > 0
      ? `${BASE_URL}/${currentImages[safeImageIndex]?.path_gambar}`
      : null;

  // ─── RENDER ──────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <div className="facilities-page">
        <div className="facilities-hero">
          <h1 className="text-gradient">Fasilitas dan Layanan</h1>
          <p>
            Fasilitas lengkap dan modern untuk mendukung kegiatan belajar
            mengajar
          </p>
        </div>

        <div className="facilities-container">
          <div className="facilities-grid">
            {/* SIDEBAR UNTUK DESKTOP & TABLET */}
            <div className="facilities-sidebar desktop-sidebar">
              <div className="sidebar-title">Daftar Fasilitas</div>
              <div className="facility-list-wrapper">
                {facilities.map((facility, index) => (
                  <div
                    key={facility.fasilitas_id}
                    className={`facility-item ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => handleFacilityClick(facility, index)}
                  >
                    <span className="facility-icon">
                      {facility.icon || "🏫"}
                    </span>
                    <span>{facility.nama}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DROPDOWN UNTUK MOBILE */}
            <div className="mobile-dropdown">
              <select
                value={activeIndex}
                onChange={(e) => {
                  const index = Number(e.target.value);
                  handleFacilityClick(facilities[index], index);
                }}
              >
                {facilities.map((facility, index) => (
                  <option key={facility.fasilitas_id} value={index}>
                    {facility.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* KONTEN DETAIL */}
            {selectedFacility && (
              <div className="facility-content">
                <div className="facility-detail-header">
                  <div className="facility-detail-icon">
                    {selectedFacility.icon || "🏫"}
                  </div>
                  <div className="facility-detail-title">
                    <h2>{selectedFacility.nama}</h2>
                    <span className="facility-badge">Fasilitas Unggulan</span>
                  </div>
                </div>

                {/* GAMBAR */}
                <div
                  className="facility-image-container"
                  style={{ position: "relative" }}
                >
                  {currentImgSrc ? (
                    <>
                      <img
                        key={`${selectedFacility.fasilitas_id}-${safeImageIndex}`}
                        src={currentImgSrc}
                        alt={selectedFacility.nama}
                        className="facility-image"
                      />

                      {/* Counter gambar — hanya jika > 1 */}
                      {hasMultipleImages && (
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "rgba(0,0,0,0.5)",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: "12px",
                            zIndex: 2,
                          }}
                        >
                          {safeImageIndex + 1} / {currentImages.length}
                        </div>
                      )}

                      {/* TOMBOL PREV / NEXT — hanya jika gambar > 1 */}
                      {hasMultipleImages && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            aria-label="Gambar sebelumnya"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "rgba(0,0,0,0.45)",
                              border: "none",
                              borderRadius: "50%",
                              width: "36px",
                              height: "36px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: "#fff",
                              fontSize: "20px",
                              zIndex: 2,
                            }}
                          >
                            ‹
                          </button>

                          <button
                            onClick={handleNextImage}
                            aria-label="Gambar berikutnya"
                            style={{
                              position: "absolute",
                              right: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "rgba(0,0,0,0.45)",
                              border: "none",
                              borderRadius: "50%",
                              width: "36px",
                              height: "36px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: "#fff",
                              fontSize: "20px",
                              zIndex: 2,
                            }}
                          >
                            ›
                          </button>

                          {/* DOT INDICATOR */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "12px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              display: "flex",
                              gap: "6px",
                              zIndex: 2,
                            }}
                          >
                            {currentImages.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                aria-label={`Gambar ${idx + 1}`}
                                style={{
                                  width:
                                    idx === safeImageIndex ? "20px" : "8px",
                                  height: "8px",
                                  borderRadius: "4px",
                                  border: "none",
                                  background:
                                    idx === safeImageIndex
                                      ? "#ddc588"
                                      : "rgba(255,255,255,0.6)",
                                  cursor: "pointer",
                                  padding: 0,
                                  transition: "all 0.3s ease",
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    /* Placeholder jika belum ada gambar */
                    <div
                      style={{
                        width: "100%",
                        minHeight: "280px",
                        background:
                          "linear-gradient(135deg, #f5f0e8 0%, #e8f0f8 100%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        borderRadius: "12px",
                      }}
                    >
                      <span style={{ fontSize: "64px", opacity: 0.4 }}>
                        {selectedFacility.icon || "🏫"}
                      </span>
                      <p style={{ color: "#999", fontSize: "14px" }}>
                        Gambar belum tersedia
                      </p>
                    </div>
                  )}
                </div>

                {/* DESKRIPSI */}
                <div className="facility-description">
                  <h3>Tentang Fasilitas</h3>
                  <p>
                    {selectedFacility.deskripsi ||
                      "Informasi detail tentang fasilitas ini akan segera tersedia."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
