import { useParams } from "react-router-dom";
import "./css/about-detail.css";
import Footer from "../../components/footer";

interface AboutLevelItem {
  level: string;
  aliases?: string[];
  title: string;
  description: string;
  highlights: string[];
  image: string;
}

const aboutLevels: AboutLevelItem[] = [
  {
    level: "tk",
    aliases: ["pg-tk", "pg"],
    title: "Tentang TK",
    description:
      "Taman Kanak-Kanak kami fokus pada pembelajaran dasar melalui pendekatan belajar sambil bermain dalam lingkungan yang aman dan menyenangkan.",
    highlights: [
      "Pengembangan motorik & sensorik",
      "Pembentukan karakter & kebiasaan baik",
      "Kegiatan berbasis kreativitas",
    ],
    image: "/assets/tingkatan/tk.jpg",
  },

  {
    level: "sd",
    title: "Tentang SD",
    description:
      "Jenjang Sekolah Dasar berfokus pada literasi, numerasi, dan pembentukan karakter agar siswa siap menghadapi jenjang berikutnya.",
    highlights: [
      "Pembelajaran tematik dan interaktif",
      "Penguatan kemampuan literasi & numerasi",
      "Ekstrakurikuler untuk minat bakat",
    ],
    image: "/assets/tingkatan/sd.jpg",
  },

  {
    level: "smp",
    title: "Tentang SMP",
    description:
      "Jenjang SMP menekankan pola pikir kritis, pengembangan bakat, serta penanaman kedisiplinan untuk mempersiapkan siswa menghadapi SMA.",
    highlights: [
      "Pembelajaran kolaboratif",
      "Program pengembangan potensi siswa",
      "Pembinaan karakter & kepemimpinan",
    ],
    image: "/assets/tingkatan/smp.jpg",
  },

  {
    level: "sma",
    title: "Tentang SMA",
    description:
      "Jenjang SMA mempersiapkan siswa menuju perguruan tinggi dan dunia kerja melalui program peminatan dan pembinaan akademik intensif.",
    highlights: [
      "Program peminatan sesuai minat",
      "Bimbingan karier & persiapan kuliah",
      "Pengembangan organisasi & soft skill",
    ],
    image: "/assets/tingkatan/sma.jpg",
  },
];

const AboutDetail = () => {
  const { level } = useParams();

  const about = aboutLevels.find((item) => {
    const current = level?.toLowerCase();
    return (
      item.level.toLowerCase() === current ||
      item.aliases?.some((a) => a.toLowerCase() === current)
    );
  });

  if (!about) {
    return (
      <div className="about-container">
        <h1 className="about-title">Tingkatan tidak ditemukan</h1>
      </div>
    );
  }

  return (
    <>
      <section className="about-container">
        <div className="about-wrapper">
          <div className="about-image">
            <img src={about.image} alt={about.title} />
          </div>

          <div className="abeout-content">
            <h1 className="about-title">{about.title}</h1>

            <p className="about-desc">{about.description}</p>

            <ul className="about-list">
              {about.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutDetail;
