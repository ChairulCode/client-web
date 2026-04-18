import { useState, useEffect } from "react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import {
  Trophy,
  Code2,
  Languages,
  Palette,
  Music,
  CalendarDays,
} from "lucide-react";
import { getRequest } from "../../utils/api-call";
import "./ekstrakulikuler.css";

const SERVER_BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// ── INTERFACES ────────────────────────────────────────────────────────────────

interface EkskulGambar {
  gambar_id: string;
  ekskul_id: string;
  path_gambar: string;
  urutan: number;
}

interface Ekskul {
  ekskul_id: string;
  nama: string;
  deskripsi: string | null;
  kategori: string | null;
  hari_latihan: string | null; // ✅ field ini wajib ada di interface
  icon: string | null;
  is_active: boolean;
  urutan: number | null;
  gambar: EkskulGambar[];
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

const getIconComponent = (kategori: string | null) => {
  switch (kategori) {
    case "Olahraga":
      return <Trophy className="w-8 h-8" />;
    case "Teknologi":
      return <Code2 className="w-8 h-8" />;
    case "Bahasa":
      return <Languages className="w-8 h-8" />;
    case "Keterampilan":
      return <Palette className="w-8 h-8" />;
    case "Seni":
    case "Seni & Budaya":
      return <Music className="w-8 h-8" />;
    default:
      return <Trophy className="w-8 h-8" />;
  }
};

// ── SUB-COMPONENT: Carousel Gambar per Card ───────────────────────────────────

interface EkskulCarouselProps {
  gambar: EkskulGambar[];
  nama: string;
}

const EkskulCarousel = ({ gambar, nama }: EkskulCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Sort gambar berdasarkan urutan
  const sortedGambar = [...gambar].sort((a, b) => a.urutan - b.urutan);
  const hasMultiple = sortedGambar.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(
      (prev) => (prev - 1 + sortedGambar.length) % sortedGambar.length,
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % sortedGambar.length);
  };

  const currentSrc =
    sortedGambar.length > 0
      ? `${SERVER_BASE_URL}/${sortedGambar[activeIndex]?.path_gambar}`
      : "/assets/placeholder-ekskul.png";

  return (
    <div className="card-image-container" style={{ position: "relative" }}>
      <img
        key={`${sortedGambar[activeIndex]?.gambar_id}-${activeIndex}`}
        src={currentSrc}
        alt={`${nama} foto ${activeIndex + 1}`}
        className="card-image"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/assets/placeholder-ekskul.png";
        }}
      />

      {/* Counter gambar — hanya jika > 1 */}
      {hasMultiple && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "12px",
            zIndex: 2,
          }}
        >
          {activeIndex + 1} / {sortedGambar.length}
        </div>
      )}

      {/* Tombol PREV */}
      {hasMultiple && (
        <button
          onClick={handlePrev}
          aria-label="Gambar sebelumnya"
          style={{
            position: "absolute",
            left: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.45)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            fontSize: "18px",
            zIndex: 2,
          }}
        >
          ‹
        </button>
      )}

      {/* Tombol NEXT */}
      {hasMultiple && (
        <button
          onClick={handleNext}
          aria-label="Gambar berikutnya"
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.45)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            fontSize: "18px",
            zIndex: 2,
          }}
        >
          ›
        </button>
      )}

      {/* Dot indicator */}
      {hasMultiple && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "5px",
            zIndex: 2,
          }}
        >
          {sortedGambar.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(idx);
              }}
              aria-label={`Foto ${idx + 1}`}
              style={{
                width: idx === activeIndex ? "18px" : "7px",
                height: "7px",
                borderRadius: "4px",
                border: "none",
                background:
                  idx === activeIndex ? "#ddc588" : "rgba(255,255,255,0.65)",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Overlay kategori & icon */}
      <div className="card-overlay">
        <div className="card-icon">
          {/* icon ditampilkan di overlay — diambil dari parent lewat props */}
        </div>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

const Ekstrakurikuler = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [ekskulList, setEkskulList] = useState<Ekskul[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEkskul = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getRequest(`/ekstrakurikuler?page=1&limit=100`);

        let rawData: Ekskul[] = [];
        if (Array.isArray(res)) {
          rawData = res;
        } else if (Array.isArray(res?.data)) {
          rawData = res.data;
        } else if (Array.isArray(res?.requestedData)) {
          rawData = res.requestedData;
        } else {
          rawData = [];
        }

        const sorted: Ekskul[] = rawData
          .filter((e: Ekskul) => e.is_active)
          .sort(
            (a: Ekskul, b: Ekskul) => (a.urutan ?? 999) - (b.urutan ?? 999),
          );
        setEkskulList(sorted);
      } catch (e) {
        setError("Gagal memuat data ekstrakurikuler. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEkskul();
  }, []);

  const categories = [
    "Semua",
    ...Array.from(
      new Set(ekskulList.map((e) => e.kategori).filter(Boolean) as string[]),
    ),
  ];

  const filteredList =
    selectedCategory === "Semua"
      ? ekskulList
      : ekskulList.filter((e) => e.kategori === selectedCategory);

  return (
    <div className="ekstrakurikuler-page">
      <Navbar />

      {/* Hero Section */}
      <section className="ekstra-hero">
        <div className="ekstra-hero-content">
          <h1 className="ekstra-hero-title">
            Ekstrakurikuler
            <span className="ekstra-hero-accent"> WR Supratman 1 Medan</span>
          </h1>
          <p className="ekstra-hero-subtitle">
            Temukan passion dan kembangkan bakatmu melalui berbagai kegiatan
            ekstrakurikuler yang menarik dan mendidik
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-section">
        <div className="container">
          <h2 className="category-title">Pilih Kategori</h2>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-filter ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Extracurricular Grid */}
      <section className="extracurricular-section">
        <div className="container">
          {/* Loading */}
          {isLoading && (
            <div className="text-center py-10">
              <p>Memuat data ekstrakurikuler...</p>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="text-center py-10">
              <p style={{ color: "red" }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="category-filter"
                style={{ marginTop: "1rem" }}
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && filteredList.length === 0 && (
            <div className="text-center py-10">
              <p>Belum ada data ekstrakurikuler untuk kategori ini.</p>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !error && filteredList.length > 0 && (
            <div className="extracurricular-grid">
              {filteredList.map((ekskul) => {
                const hasGambar = ekskul.gambar && ekskul.gambar.length > 0;

                return (
                  <div key={ekskul.ekskul_id} className="extracurricular-card">
                    {/* ── Carousel / Gambar tunggal ── */}
                    {hasGambar ? (
                      // Gunakan komponen carousel (berlaku untuk 1 atau lebih gambar)
                      <div style={{ position: "relative" }}>
                        <EkskulCarousel
                          gambar={ekskul.gambar}
                          nama={ekskul.nama}
                        />
                        {/* Overlay icon & kategori di atas carousel */}
                        <div
                          className="card-overlay"
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            pointerEvents: "none",
                          }}
                        >
                          <div className="card-icon">
                            {ekskul.icon ? (
                              <span style={{ fontSize: "2rem" }}>
                                {ekskul.icon}
                              </span>
                            ) : (
                              getIconComponent(ekskul.kategori)
                            )}
                          </div>
                          <div className="card-category">
                            {ekskul.kategori || "Umum"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Placeholder jika tidak ada gambar
                      <div
                        className="card-image-container"
                        style={{ position: "relative" }}
                      >
                        <img
                          src="/assets/placeholder-ekskul.png"
                          alt={ekskul.nama}
                          className="card-image"
                        />
                        <div className="card-overlay">
                          <div className="card-icon">
                            {ekskul.icon ? (
                              <span style={{ fontSize: "2rem" }}>
                                {ekskul.icon}
                              </span>
                            ) : (
                              getIconComponent(ekskul.kategori)
                            )}
                          </div>
                          <div className="card-category">
                            {ekskul.kategori || "Umum"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Konten card ── */}
                    <div className="card-content">
                      <h3 className="card-title">{ekskul.nama}</h3>

                      {/* ✅ Hari latihan */}
                      {ekskul.hari_latihan && (
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.78rem",
                            color: "#6b7280",
                            margin: "4px 0 6px",
                            fontWeight: 500,
                          }}
                        >
                          <CalendarDays size={13} />
                          {ekskul.hari_latihan}
                        </p>
                      )}

                      <p className="card-description">
                        {ekskul.deskripsi || "Deskripsi belum tersedia."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Ekstrakurikuler;
