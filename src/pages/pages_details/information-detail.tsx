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
} from "lucide-react";

// ─── Data persis dari footer ──────────────────────────────────
const misiItems = [
  "Melaksanakan Pendidikan yang Bermutu...",
  "Melaksanakan Pendidikan berdasarkan budi pekerti...",
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

// ─── Main ─────────────────────────────────────────────────────
const InformationDetail = () => {
  return (
    <div className="id-page">
      <Navbar />

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
            Perguruan <span className="id-hero-title-gold">WR Supratman</span>
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
            <div className="id-card id-card--visi">
              <div className="id-card-head">
                <div className="id-card-icon id-card-icon--gold">
                  <Star size={22} />
                </div>
                <h3 className="id-card-title">Visi</h3>
              </div>
              <p className="id-card-lead">
                Menjadikan Sekolah WR Supratman 1 Medan Diakui Keunggulannya...
              </p>
            </div>

            {/* Misi */}
            <div className="id-card id-card--misi">
              <div className="id-card-head">
                <div className="id-card-icon id-card-icon--blue">
                  <Heart size={22} />
                </div>
                <h3 className="id-card-title">Misi</h3>
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
            </div>
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
