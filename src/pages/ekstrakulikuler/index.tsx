import { useState } from "react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import { Music, Palette, Code2, Languages, Trophy } from "lucide-react";
import "./ekstrakulikuler.css";

interface Extracurricular {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  image: string;
  highlights: string[];
}

const Ekstrakurikuler = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const extracurriculars: Extracurricular[] = [
    {
      id: 1,
      name: "Basket",
      description:
        "Mengembangkan skill bermain basket dengan teknik yang benar. Fokus pada teamwork, strategi permainan, dan fisik yang optimal untuk pertandingan basket.",
      icon: <Trophy className="w-8 h-8" />,
      category: "Olahraga",
      image:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      highlights: [
        "Juara 2 Liga Basket Pelajar Kota",
        "Turnamen Antar Sekolah",
        "Latihan dengan Pelatih Bersertifikat",
      ],
    },
    {
      id: 2,
      name: "Badminton",
      description:
        "Melatih teknik dan strategi bermain badminton dari dasar hingga advanced. Mengasah refleks, ketahanan fisik, dan mental bertanding.",
      icon: <Trophy className="w-8 h-8" />,
      category: "Olahraga",
      image:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      highlights: [
        "Juara 1 Turnamen Badminton Tingkat Kota",
        "Pelatihan Intensif Bulanan",
        "Sparring dengan Atlet Profesional",
      ],
    },
    {
      id: 3,
      name: "Tenis Meja",
      description:
        "Mengasah kemampuan bermain tenis meja dengan fokus pada teknik pukulan, footwork, dan strategi permainan yang efektif.",
      icon: <Trophy className="w-8 h-8" />,
      category: "Olahraga",
      image:
        "https://images.unsplash.com/photo-1534158914592-062992fbe900?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      highlights: [
        "Juara 3 Kejuaraan Tenis Meja Regional",
        "Turnamen Bulanan",
        "Latihan Teknik Profesional",
      ],
    },
    {
      id: 4,
      name: "Futsal",
      description:
        "Mengembangkan skill bermain futsal dengan teknik yang benar. Fokus pada kerjasama tim, strategi pertandingan, dan kebugaran fisik optimal.",
      icon: <Trophy className="w-8 h-8" />,
      category: "Olahraga",
      image: "/assets/img-ekskul-futsal.png",
      highlights: [
        "Juara Liga Futsal Pelajar",
        "Turnamen Antar Sekolah",
        "Latihan dengan Pelatih Bersertifikat",
      ],
    },
    {
      id: 5,
      name: "Programming Club",
      description:
        "Belajar pemrograman dari dasar hingga advanced. Membuat website, aplikasi mobile, dan proyek IoT dengan teknologi terkini.",
      icon: <Code2 className="w-8 h-8" />,
      category: "Teknologi",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      highlights: [
        "Hackathon Nasional",
        "Proyek Kolaborasi dengan Industri",
        "Kompetisi Coding Tingkat Nasional",
      ],
    },
    {
      id: 6,
      name: "English Club",
      description:
        "Meningkatkan kemampuan bahasa Inggris melalui conversation, debate, dan creative writing. Lingkungan yang supportive untuk praktik bahasa.",
      icon: <Languages className="w-8 h-8" />,
      category: "Bahasa",
      image: "/assets/english-club.png",
      highlights: [
        "English Debate Competition",
        "Story Telling Contest",
        "Native Speaker Sessions",
      ],
    },
    {
      id: 7,
      name: "Mandarin Club",
      description:
        "Belajar bahasa Mandarin dari dasar hingga mahir. Mempelajari speaking, listening, reading, dan writing dengan metode interaktif dan menyenangkan.",
      icon: <Languages className="w-8 h-8" />,
      category: "Bahasa",
      image: "/assets/mandarin-club.png",
      highlights: [
        "Sertifikat HSK",
        "Chinese Cultural Festival",
        "Exchange Program ke China",
      ],
    },
    {
      id: 8,
      name: "Tata Boga",
      description:
        "Belajar seni memasak dan mengolah makanan dari berbagai resep tradisional hingga modern. Mengasah kreativitas dalam penyajian dan dekorasi makanan.",
      icon: <Palette className="w-8 h-8" />,
      category: "Keterampilan",
      image:
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      highlights: [
        "Kompetisi Memasak Tingkat Kota",
        "Cooking Demo Bulanan",
        "Kerjasama dengan Chef Profesional",
      ],
    },
    {
      id: 9,
      name: "Seni Tari",
      description:
        "Mempelajari berbagai jenis tarian tradisional dan modern. Mengembangkan ekspresi seni, kelenturan tubuh, dan penampilan panggung yang memukau.",
      icon: <Music className="w-8 h-8" />,
      category: "Seni",
      image:
        "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      highlights: [
        "Pentas Seni Tahunan",
        "Festival Tari Tingkat Provinsi",
        "Kolaborasi dengan Sanggar Tari",
      ],
    },
  ];

  const categories = ["Semua", "Seni", "Olahraga", "Teknologi", "Bahasa"];

  const filteredExtracurriculars =
    selectedCategory === "Semua"
      ? extracurriculars
      : extracurriculars.filter(
          (extracurricular) => extracurricular.category === selectedCategory,
        );

  return (
    <div className="ekstrakurikuler-page">
      <Navbar />

      {/* Hero Section */}
      <section className="ekstra-hero">
        <div className="ekstra-hero-content">
          <h1 className="ekstra-hero-title">
            Ekstrakurikuler
            <span className="ekstra-hero-accent"> WR Supratman</span>
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
          <div className="extracurricular-grid">
            {filteredExtracurriculars.map((extracurricular) => (
              <div key={extracurricular.id} className="extracurricular-card">
                <div className="card-image-container">
                  <img
                    src={extracurricular.image}
                    alt={extracurricular.name}
                    className="card-image"
                  />
                  <div className="card-overlay">
                    <div className="card-icon">{extracurricular.icon}</div>
                    <div className="card-category">
                      {extracurricular.category}
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="card-title">{extracurricular.name}</h3>
                  <p className="card-description">
                    {extracurricular.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Ekstrakurikuler;
