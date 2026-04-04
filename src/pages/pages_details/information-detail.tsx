import { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "./css/information-detail.css";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Heart,
  ChevronDown,
  Building2,
  ExternalLink,
  Target,
  X,
  BookOpen,
  Layers,
} from "lucide-react";

// ─── Data card biasa (versi singkat) ──────────────────────────
const misiItems = [
  "Melaksanakan Pendidikan yang Bermutu...",
  "Bahasa (Bahasa Indonesia, Bahasa Mandarin dan Bahasa Inggris)...",
];

// ─── Data modal misi (versi lengkap) ──────────────────────────
// Edit bagian ini untuk mengubah isi detail modal misi
const misiDetailItems = [
  {
    num: "01",
    title: "Pendidikan Bermutu",
    desc: "Melaksanakan Pendidikan Yang Bermutu, Efektif, dan Dinamis Untuk Menghasilkan Lulusan Yang Berkualitas, Berkompeten, Terdidik, Kreatif, Cakap, dan Terampil dalam dalam bidang ICT dan Penguasaan",
  },
  {
    num: "02",
    title: "Bahasa",
    desc: "Bahasa (Bahasa Indonesia, Bahasa Mandarin dan Bahasa Inggris).",
  },
  {
    num: "03",
    title: "Budi Pekerti Luhur",
    desc: "Melaksanakan Pendidikan Yang Berdasarkan Budi Pekerti Luhur Untuk Menghasilkan Lulusan Yang Berkepribadian, Berkarakter, Beretika Tinggi, Berakhlak Mulia, Beriman, Bertaqwa, dan Mengabdi Untuk Kesejahteraan Bangsa dan Negara.",
  },
  {
    num: "04",
    title: "Pendidikan Seutuhnya",
    desc: "Mendidik Para Siswa Menjadi Manusia Seutuhnya Dengan Mengembangkan Seluruh Potensi Anak Dengan Proses Pendidikan Yang Menyesuaikan Potensi Anak Secara Individual Meliputi Kecerdasan Fisik (PQ), Kecerdasan Intelektual (IQ), Kecerdasan Emosional (EQ) Dan Kecerdasan Spiritual (SQ).",
  },
  // ── Tambah poin misi baru di sini ──
  // {
  //   num: "03",
  //   title: "Judul Poin Baru",
  //   desc: "Deskripsi lengkap poin misi baru...",
  // },
];

const jadwalList = [
  { hari: "Senin – Sabtu", waktu: "07:00 – 15:30 WIB", closed: false },
  { hari: "Minggu", waktu: "Tutup", closed: true },
];

const kontakList = [
  {
    Icon: MapPin,
    label: "Alamat",
    val: "Jl. Asia No. 143, Medan 20214\nSumatera Utara, Indonesia",
    href: undefined,
  },
  {
    Icon: Phone,
    label: "Telepon",
    val: "061-7345093",
    href: "tel:+62617345093",
  },
  {
    Icon: Mail,
    label: "Email",
    val: "wr_supratman1@yahoo.com",
    href: "mailto:wr_supratman1@yahoo.com",
  },
];

// ─── Modal Data ───────────────────────────────────────────────
type ModalType = "visi" | "misi" | null;

const modalContent = {
  visi: {
    icon: Star,
    iconClass: "id-modal-icon--gold",
    badge: "Visi Sekolah",
    title: "Visi",
    accent: "#ddc588",
    body: (
      <>
        <p className="id-modal-lead">
          Menjadikan Sekolah WR Supratman 1 Medan Diakui Keunggulannya dalam
          Bidang Akademik, Karakter, dan Prestasi di Tingkat Nasional maupun
          Internasional.
        </p>
        <div className="id-modal-highlight">
          <BookOpen size={16} />
          <span>
            Kami berkomitmen untuk terus berkembang demi masa depan yang lebih
            cerah bagi seluruh peserta didik.
          </span>
        </div>
      </>
    ),
  },
  misi: {
    icon: Heart,
    iconClass: "id-modal-icon--blue",
    badge: "Misi Sekolah",
    title: "Misi",
    accent: "#9fc4e8",
    body: (
      <ol className="id-modal-misi-list">
        {misiDetailItems.map((item) => (
          <li key={item.num} className="id-modal-misi-item">
            <span className="id-modal-misi-num">{item.num}</span>
            <div>
              <p className="id-modal-misi-title">{item.title}</p>
              <p className="id-modal-misi-desc">{item.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    ),
  },
};

// ─── Section Header ───────────────────────────────────────────
const SectionHeader = ({
  badge,
  title,
  desc,
  Icon,
}: {
  badge: string;
  title: string;
  desc?: string;
  Icon: React.ElementType;
}) => (
  <div className="id-section-header">
    <div className="id-section-badge">
      <Icon size={13} />
      <span>{badge}</span>
    </div>
    <h2 className="id-section-title">{title}</h2>
    {desc && <p className="id-section-desc">{desc}</p>}
  </div>
);

// ─── Visi Misi Modal ──────────────────────────────────────────
const VisiMisiModal = ({
  type,
  onClose,
}: {
  type: ModalType;
  onClose: () => void;
}) => {
  if (!type) return null;
  const content = modalContent[type];
  const IconComp = content.icon;

  return (
    <div className="id-modal-overlay" onClick={onClose}>
      <div
        className="id-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ "--modal-accent": content.accent } as React.CSSProperties}
      >
        {/* Close */}
        <button className="id-modal-close" onClick={onClose} aria-label="Tutup">
          <X size={18} />
        </button>

        {/* Header */}
        <div className="id-modal-header">
          <div className={`id-modal-icon-wrap ${content.iconClass}`}>
            <IconComp size={24} />
          </div>
          <div>
            <p className="id-modal-badge">{content.badge}</p>
            <h3 className="id-modal-title">{content.title}</h3>
          </div>
        </div>

        <div className="id-modal-divider" />

        {/* Body */}
        <div className="id-modal-body">{content.body}</div>

        {/* Footer button */}
        <button className="id-modal-btn" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────
const InformationDetail = () => {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <div className="id-page">
      <Navbar />

      {/* Modal */}
      <VisiMisiModal type={modal} onClose={() => setModal(null)} />

      {/* ══ HERO ══ */}
      <section className="id-hero">
        <div className="id-hero-bg" />
        <div className="id-hero-dots" />
        <div className="id-hero-blob id-hero-blob--1" />
        <div className="id-hero-blob id-hero-blob--2" />

        <div className="id-hero-content">
          <div className="id-hero-badge">
            <Building2 size={13} />
            <span>Informasi Sekolah</span>
          </div>

          <h1 className="id-hero-title">
            Perguruan <span className="id-hero-title-gold">WR Supratman 1</span>
            <br />
            Medan
          </h1>

          <p className="id-hero-sub">
            Informasi lengkap mengenai visi, misi, dan kontak Perguruan WR
            Supratman Medan
          </p>
        </div>

        <div className="id-hero-scroll">
          <ChevronDown size={22} />
        </div>
      </section>

      {/* ══ VISI & MISI ══ */}
      <section className="id-section">
        <div className="id-container">
          <SectionHeader
            badge="Arah & Tujuan"
            title="Visi & Misi"
            Icon={Target}
          />
          <div className="id-visi-misi-grid">
            {/* Visi */}
            <button
              className="id-card id-card--visi id-card--clickable"
              onClick={() => setModal("visi")}
              aria-label="Lihat detail Visi"
            >
              <div className="id-card-head">
                <div className="id-card-icon id-card-icon--gold">
                  <Star size={22} />
                </div>
                <h3 className="id-card-title">Visi</h3>
                <span className="id-card-click-hint">
                  <Layers size={13} />
                  Lihat Detail
                </span>
              </div>
              <p className="id-card-lead">
                Menjadikan Sekolah WR Supratman 1 Medan Diakui Keunggulannya...
              </p>
            </button>

            {/* Misi */}
            <button
              className="id-card id-card--misi id-card--clickable"
              onClick={() => setModal("misi")}
              aria-label="Lihat detail Misi"
            >
              <div className="id-card-head">
                <div className="id-card-icon id-card-icon--blue">
                  <Heart size={22} />
                </div>
                <h3 className="id-card-title">Misi</h3>
                <span className="id-card-click-hint">
                  <Layers size={13} />
                  Lihat Detail
                </span>
              </div>
              <ol className="id-misi-list">
                {misiItems.map((item, i) => (
                  <li key={i} className="id-misi-item">
                    <span className="id-misi-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </button>
          </div>
        </div>
      </section>

      {/* ══ KONTAK & JADWAL ══ */}
      <section className="id-section id-section--alt">
        <div className="id-container">
          <SectionHeader
            badge="Hubungi Kami"
            title="Lokasi & Kontak"
            Icon={MapPin}
          />
          <div className="id-kontak-grid">
            {/* Kontak */}
            <div className="id-card id-card--kontak">
              <h3 className="id-kontak-sub">Informasi Kontak</h3>
              <div className="id-divider" />
              <div className="id-kontak-list">
                {kontakList.map(({ Icon, label, val, href }, i) => (
                  <div key={i} className="id-kontak-item">
                    <div className="id-kontak-icon">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="id-kontak-label">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={
                            href.startsWith("http") ? "_blank" : undefined
                          }
                          rel="noreferrer"
                          className="id-kontak-val id-kontak-link"
                        >
                          {val}
                          {href.startsWith("http") && (
                            <ExternalLink
                              size={11}
                              style={{ marginLeft: 4, display: "inline" }}
                            />
                          )}
                        </a>
                      ) : (
                        <p className="id-kontak-val">{val}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jadwal */}
            <div className="id-card id-card--jadwal">
              <h3 className="id-kontak-sub">Jam Operasional</h3>
              <div className="id-divider" />
              <div className="id-jadwal-clock">
                <Clock size={56} strokeWidth={1.2} />
              </div>
              <div className="id-jadwal-list">
                {jadwalList.map((j, i) => (
                  <div
                    key={i}
                    className={`id-jadwal-row${j.closed ? " id-jadwal-row--closed" : ""}`}
                  >
                    <span className="id-jadwal-hari">{j.hari}</span>
                    <span className="id-jadwal-waktu">{j.waktu}</span>
                  </div>
                ))}
              </div>
              <p className="id-jadwal-note">
                * Jam operasional dapat berubah pada hari libur sekolah
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InformationDetail;
