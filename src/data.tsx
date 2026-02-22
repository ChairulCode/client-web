// Existing types
export type NavType = "scroll" | "link" | "route";

export interface NavTab {
  name: string;
  id: string;
  type: NavType;
  scrollTo?: string;
  children?: NavTab[];
}

export const navTabs: NavTab[] = [
  { name: "Beranda", id: "/", type: "route" },
  {
    name: "Tingkatan",
    id: "/Tingkatan",
    type: "route",
    children: [
      { name: "PG-TK", id: "/tingkatan/PG-TK", type: "route" },
      { name: "SD", id: "/tingkatan/SD", type: "route" },
      { name: "SMP", id: "/tingkatan/SMP", type: "route" },
      { name: "SMA", id: "/tingkatan/SMA", type: "route" },
    ],
  },
  { name: "Fasilitas", id: "/Fasilitas", type: "route" },
  { name: "Lagu Mars", id: "/Lagu-Mars", type: "route" },
  { name: "Ekstrakurikuler", id: "/ekstrakurikuler", type: "route" },
];

// route khusus untuk get tiap tingkatan
export const navTabs2: NavTab[] = [
  {
    name: "Halaman Utama",
    id: "halaman-utama",
    type: "route",
  },
  { name: "Beranda", id: "/", type: "route" },
  {
    name: "About",
    id: "/about",
    type: "route",
    // Bisa diakses langsung untuk about umum
  },
  { name: "Prestasi", id: "/prestasi", type: "route" },
  { name: "kegiatan", id: "/kegiatan", type: "route" },
  { name: "Pengumuman", id: "/pengumuman", type: "route" },
  { name: "Pengumuman Kelulusan", id: "/pengumuman-kelulusan", type: "route" },
  {
    name: "Nilai Mapel",
    id: "/nilai",
    type: "route",
  },
];

export interface Slide {
  [x: string]: any;
  id: number;
  content: string;
  image: string;
  description?: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    content: "Slide 1 - Welcome",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200",
    description:
      "Quis proident consectetur id proident aute. Nostrud fugiat cillum excepteur velit cillum nostrud elit nulla officia incididunt dolor consequat. Ullamco minim ea aliqua ea aute quis labore. Ex nisi culpa laboris velit. Non ad minim sit sit. Aliqua irure labore amet officia nostrud pariatur eu esse. Amet qui laborum qui incididunt quis.",
  },
  {
    id: 2,
    content: "Slide 2 - Our Vision",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200",
    description:
      "Quis proident consectetur id proident aute. Nostrud fugiat cillum excepteur velit cillum nostrud elit nulla officia incididunt dolor consequat. Ullamco minim ea aliqua ea aute quis labore. Ex nisi culpa laboris velit. Non ad minim sit sit. Aliqua irure labore amet officia nostrud pariatur eu esse. Amet qui laborum qui incididunt quis.",
  },
  {
    id: 3,
    content: "Slide 3 - Our Mission",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200",
    description:
      "Quis proident consectetur id proident aute. Nostrud fugiat cillum excepteur velit cillum nostrud elit nulla officia incididunt dolor consequat. Ullamco minim ea aliqua ea aute quis labore. Ex nisi culpa laboris velit. Non ad minim sit sit. Aliqua irure labore amet officia nostrud pariatur eu esse. Amet qui laborum qui incididunt quis.",
  },
  {
    id: 4,
    content: "Slide 4 - Achievements",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200",
    description:
      "Quis proident consectetur id proident aute. Nostrud fugiat cillum excepteur velit cillum nostrud elit nulla officia incididunt dolor consequat. Ullamco minim ea aliqua ea aute quis labore. Ex nisi culpa laboris velit. Non ad minim sit sit. Aliqua irure labore amet officia nostrud pariatur eu esse. Amet qui laborum qui incididunt quis.",
  },
  {
    id: 5,
    content: "Slide 5 - Activities",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200",
    description:
      "Quis proident consectetur id proident aute. Nostrud fugiat cillum excepteur velit cillum nostrud elit nulla officia incididunt dolor consequat. Ullamco minim ea aliqua ea aute quis labore. Ex nisi culpa laboris velit. Non ad minim sit sit. Aliqua irure labore amet officia nostrud pariatur eu esse. Amet qui laborum qui incididunt quis.",
  },
  {
    id: 6,
    content: "Slide 6 - Facilities",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200",
    description:
      "Quis proident consectetur id proident aute. Nostrud fugiat cillum excepteur velit cillum nostrud elit nulla officia incididunt dolor consequat. Ullamco minim ea aliqua ea aute quis labore. Ex nisi culpa laboris velit. Non ad minim sit sit. Aliqua irure labore amet officia nostrud pariatur eu esse. Amet qui laborum qui incididunt quis.",
  },
  {
    id: 7,
    content: "Slide 7 - Teachers",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200",
    description:
      "Quis proident consectetur id proident aute. Nostrud fugiat cillum excepteur velit cillum nostrud elit nulla officia incididunt dolor consequat. Ullamco minim ea aliqua ea aute quis labore. Ex nisi culpa laboris velit. Non ad minim sit sit. Aliqua irure labore amet officia nostrud pariatur eu esse. Amet qui laborum qui incididunt quis.",
  },
  {
    id: 8,
    content: "Slide 8 - Students",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200",
    description:
      "Quis proident consectetur id proident aute. Nostrud fugiat cillum excepteur velit cillum nostrud elit nulla officia incididunt dolor consequat. Ullamco minim ea aliqua ea aute quis labore. Ex nisi culpa laboris velit. Non ad minim sit sit. Aliqua irure labore amet officia nostrud pariatur eu esse. Amet qui laborum qui incididunt quis.",
  },
  {
    id: 9,
    content: "Slide 9 - Events",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200",
    description:
      "Quis proident consectetur id proident aute. Nostrud fugiat cillum excepteur velit cillum nostrud elit nulla officia incididunt dolor consequat. Ullamco minim ea aliqua ea aute quis labore. Ex nisi culpa laboris velit. Non ad minim sit sit. Aliqua irure labore amet officia nostrud pariatur eu esse. Amet qui laborum qui incididunt quis.",
  },
  {
    id: 10,
    content: "Slide 10 - Contact Us",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200",
    description:
      "Quis proident consectetur id proident aute. Nostrud fugiat cillum excepteur velit cillum nostrud elit nulla officia incididunt dolor consequat. Ullamco minim ea aliqua ea aute quis labore. Ex nisi culpa laboris velit. Non ad minim sit sit. Aliqua irure labore amet officia nostrud pariatur eu esse. Amet qui laborum qui incididunt quis.",
  },
];

export interface WelcomeData {
  headingEmoji: string;
  headingMain: string;
  headingSub: string;
  description: string;
  highlight: string;
  buttonText: string;
}

export const welcomeData: WelcomeData = {
  headingEmoji: "👋",
  headingMain: "Selamat Datang",
  headingSub: "Di Website Resmi Perguruan WR Supratman 1 Medan",
  description: `Website ini menyajikan berbagai informasi tentang Perguruan WR
  Supratman Medan. Berbahagia sekali kami dapat menjumpai Anda. Telah
  menjadi kewajiban kami untuk memperkenalkan diri dan
  menginformasikan sekolah kami yang mengutamakan pendidikan
  berkarakter, sains, teknologi informasi, dan penguasaan 3 bahasa, `,
  highlight: ` (TriLingual : Bahasa Indonesia, Bahasa Inggris, dan Bahasa Mandarin)`,
  buttonText: "Mulai Jelajah",
};

export interface Announcement {
  [x: string]: any;
  id: number;
  title: string;
  date: string;
  content: string;
  image: string;
  level: "SD" | "SMP" | "SMA" | "PG-TK";
}

export const announcements1: Announcement[] = [
  {
    id: 1,
    date: "2 September 2025",
    title: "Siswa SMA WRS 1 meraih Medali Emas Kompetisi Pelajar Nasional 2025",
    content:
      "Selamat kepada Sherlyn atas keberhasilan meraih Medali Emas bidang studi Sejarah pada Kompetisi Pelajar Nasional 2025 yang diselenggarakan tgl 15 September 2025.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/medali%20emas%20mapel%20sejarah%20kpn%202025%2015%20sept%202025%20-%201k%20jpeg.jpg",
    level: "SMA",
  },
  {
    id: 2,
    date: "15 Oktober 2025",
    title: "Ujian Tengah Semester (UTS) Ganjil",
    content:
      "Selamat kepada Shannon Louisa dan Al Matin Seranna atas keberhasilan meraih Medali Perak dan Perunggu Olimpiade Siswa Nasional 38 (OSI) pada tgl 30-31 Agustus 2025 yang diselenggarakan oleh LKP ASTIKCOM & DEEHATI GLOBAL LOOP.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/congratulations%20-%201k%20jpeg.jpg",
    level: "SMA",
  },
  {
    id: 3,
    date: "25 Desember 2025",
    title: "Siswa SMA WRS 1 Juara II Lomba Public Speaking Mandarin",
    content:
      "Selamat kepada Angel Vallerie Tania, siswi SMA WR Supratman 1 berhasil meraih Juara 2 Lomba Pidato Cinta Indonesia dalam Bahasa Mandarin yang diselenggarakan oleh PT Vibe Akademik Bahasa tgl 17 Agustus 2025 dalam rangka menyambut HUT ke 80 Republik Indonesia. Hadiah yang didapat berupa Sertifikat dan E-Wallet.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/medali%20perak%20fisika%20kspi%2029%20juli%202025%20-%201k%20jpeg.jpg",
    level: "SMP",
  },
  {
    id: 4,
    date: "25 Desember 2025",
    title: "Siswa SMA WRS 1 Juara II Lomba Public Speaking Mandarin",
    content:
      "Selamat kepada Angel Vallerie Tania, siswi SMA WR Supratman 1 berhasil meraih Juara 2 Lomba Pidato Cinta Indonesia dalam Bahasa Mandarin yang diselenggarakan oleh PT Vibe Akademik Bahasa tgl 17 Agustus 2025 dalam rangka menyambut HUT ke 80 Republik Indonesia. Hadiah yang didapat berupa Sertifikat dan E-Wallet.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/medali%20perak%20fisika%20kspi%2029%20juli%202025%20-%201k%20jpeg.jpg",
    level: "SMP",
  },
  {
    id: 5,
    date: "25 Desember 2025",
    title: "Siswa SMA WRS 1 Juara II Lomba Public Speaking Mandarin",
    content:
      "Selamat kepada Angel Vallerie Tania, siswi SMA WR Supratman 1 berhasil meraih Juara 2 Lomba Pidato Cinta Indonesia dalam Bahasa Mandarin yang diselenggarakan oleh PT Vibe Akademik Bahasa tgl 17 Agustus 2025 dalam rangka menyambut HUT ke 80 Republik Indonesia. Hadiah yang didapat berupa Sertifikat dan E-Wallet.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/medali%20perak%20fisika%20kspi%2029%20juli%202025%20-%201k%20jpeg.jpg",
    level: "SD",
  },
  {
    id: 6,
    date: "25 Desember 2025",
    title: "Siswa SMA WRS 1 Juara II Lomba Public Speaking Mandarin",
    content:
      "Selamat kepada Angel Vallerie Tania, siswi SMA WR Supratman 1 berhasil meraih Juara 2 Lomba Pidato Cinta Indonesia dalam Bahasa Mandarin yang diselenggarakan oleh PT Vibe Akademik Bahasa tgl 17 Agustus 2025 dalam rangka menyambut HUT ke 80 Republik Indonesia. Hadiah yang didapat berupa Sertifikat dan E-Wallet.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/medali%20perak%20fisika%20kspi%2029%20juli%202025%20-%201k%20jpeg.jpg",
    level: "PG-TK",
  },
];
export interface Activity {
  id: number;
  date: string;
  title: string;
  content: string;
  image: string;
  level: "SD" | "SMP" | "SMA" | "PG-TK";
}

export const activities: Activity[] = [
  {
    id: 1,
    level: "PG-TK",
    date: "20 September 2025",
    title: "Upacara Hari Kemerdekaan",
    content:
      "Sekolah mengadakan upacara memperingati Hari Kemerdekaan Indonesia dengan khidmat di lapangan sekolah.",
    image: "/images/activity1.jpg",
  },
  {
    id: 2,
    level: "SD",
    date: "5 Oktober 2025",
    title: "Lomba Sains Antar Kelas",
    content:
      "Siswa-siswi mengikuti lomba sains untuk mengasah kemampuan akademik sekaligus menumbuhkan jiwa kompetitif yang sehat.",
    image: "/images/activity2.jpg",
  },
  {
    id: 3,
    level: "SMP",
    date: "12 Desember 2025",
    title: "Pentas Seni Sekolah",
    content:
      "Acara tahunan yang menampilkan kreativitas siswa dalam bidang seni tari, musik, dan drama.",
    image: "/images/activity3.jpg",
  },
  {
    id: 4,
    level: "SMA",
    date: "12 Desember 2025",
    title: "Ekstrakurikuler Pramuka",
    content:
      "Kegiatan pramuka rutin untuk melatih kedisiplinan dan kerja sama antar siswa.",
    image: "/images/activity3.jpg",
  },
];

// NEW: Fasilitas Data Structure
export interface Facility {
  id: number;
  name: string;
  description: string;
  image: string;
  icon: string;
}

// consume data announcement
export const announcements: Announcement[] = [
  {
    id: 1,
    date: "2 September 2025",
    title: "Siswa SMA WRS 1 meraih Medali Emas Kompetisi Pelajar Nasional 2025",
    content:
      "Selamat kepada Sherlyn atas keberhasilan meraih Medali Emas bidang studi Sejarah pada Kompetisi Pelajar Nasional 2025 yang diselenggarakan tgl 15 September 2025.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/medali%20emas%20mapel%20sejarah%20kpn%202025%2015%20sept%202025%20-%201k%20jpeg.jpg",
    level: "SD",
  },
  {
    id: 2,
    date: "15 Oktober 2025",
    title: "Ujian Tengah Semester (UTS) Ganjil",
    content:
      "Selamat kepada Shannon Louisa dan Al Matin Seranna atas keberhasilan meraih Medali Perak dan Perunggu Olimpiade Siswa Nasional 38 (OSI) pada tgl 30-31 Agustus 2025 yang diselenggarakan oleh LKP ASTIKCOM & DEEHATI GLOBAL LOOP.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/congratulations%20-%201k%20jpeg.jpg",
    level: "SD",
  },
  {
    id: 3,
    date: "25 Desember 2025",
    title: "Siswa SMA WRS 1 Juara II Lomba Public Speaking Mandarin",
    content:
      "Selamat kepada Angel Vallerie Tania, siswi SMA WR Supratman 1 berhasil meraih Juara 2 Lomba Pidato Cinta Indonesia dalam Bahasa Mandarin yang diselenggarakan oleh PT Vibe Akademik Bahasa tgl 17 Agustus 2025 dalam rangka menyambut HUT ke 80 Republik Indonesia. Hadiah yang didapat berupa Sertifikat dan E-Wallet.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/medali%20perak%20fisika%20kspi%2029%20juli%202025%20-%201k%20jpeg.jpg",
    level: "SD",
  },
  {
    id: 4,
    date: "2 September 2025",
    title: "Siswa SMA WRS 1 meraih Medali Emas Kompetisi Pelajar Nasional 2025",
    content:
      "Selamat kepada Sherlyn atas keberhasilan meraih Medali Emas bidang studi Sejarah pada Kompetisi Pelajar Nasional 2025 yang diselenggarakan tgl 15 September 2025.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/medali%20emas%20mapel%20sejarah%20kpn%202025%2015%20sept%202025%20-%201k%20jpeg.jpg",
    level: "SD",
  },
  {
    id: 5,
    date: "15 Oktober 2025",
    title: "Ujian Tengah Semester (UTS) Ganjil",
    content:
      "Selamat kepada Shannon Louisa dan Al Matin Seranna atas keberhasilan meraih Medali Perak dan Perunggu Olimpiade Siswa Nasional 38 (OSI) pada tgl 30-31 Agustus 2025 yang diselenggarakan oleh LKP ASTIKCOM & DEEHATI GLOBAL LOOP.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/congratulations%20-%201k%20jpeg.jpg",
    level: "SD",
  },
  {
    id: 6,
    date: "25 Desember 2025",
    title: "Siswa SMA WRS 1 Juara II Lomba Public Speaking Mandarin",
    content:
      "Selamat kepada Angel Vallerie Tania, siswi SMA WR Supratman 1 berhasil meraih Juara 2 Lomba Pidato Cinta Indonesia dalam Bahasa Mandarin yang diselenggarakan oleh PT Vibe Akademik Bahasa tgl 17 Agustus 2025 dalam rangka menyambut HUT ke 80 Republik Indonesia. Hadiah yang didapat berupa Sertifikat dan E-Wallet.",
    image:
      "https://www.wrsupratman.sch.id/images/stories/prestasi/medali%20perak%20fisika%20kspi%2029%20juli%202025%20-%201k%20jpeg.jpg",
    level: "SD",
  },
];

// Ganti nama interface
export interface Announcement2Item {
  // atau Announcement2Type, IAnnouncement2
  id: number;
  title: string;
  type: string;
  date: string;
  description: string;
  level: "SD" | "SMP" | "SMA" | "PG-TK";
}

// Update type di array
export const announcements2: Announcement2Item[] = [
  {
    id: 1,
    title: "Pemeliharaan Sistem Terjadwal",
    type: "maintenance",
    date: "25 Oktober 2025",
    description:
      "Sistem akan mengalami pemeliharaan terjadwal untuk meningkatkan performa dan keamanan. Selama periode ini, layanan mungkin tidak dapat diakses.",
    level: "SD",
  },
  {
    id: 2,
    title: "Update Fitur Baru",
    type: "update",
    date: "28 Oktober 2025",
    description:
      "Kami telah merilis fitur-fitur baru yang akan meningkatkan pengalaman pengguna. Silakan update aplikasi Anda ke versi terbaru.",
    level: "SD",
  },
  {
    id: 3,
    title: "Perubahan Kebijakan Layanan",
    type: "info",
    date: "30 Oktober 2025",
    description:
      "Terdapat perubahan pada kebijakan layanan kami. Harap baca dengan seksama dan hubungi support jika ada pertanyaan.",
    level: "SMP",
  },
  {
    id: 4,
    title: "Perubahan Kebijakan Layanan",
    type: "info",
    date: "30 Oktober 2025",
    description:
      "Terdapat perubahan pada kebijakan layanan kami. Harap baca dengan seksama dan hubungi support jika ada pertanyaan.",
    level: "SMP",
  },
  {
    id: 5,
    title: "Perubahan Kebijakan Layanan",
    type: "info",
    date: "30 Oktober 2025",
    description:
      "Terdapat perubahan pada kebijakan layanan kami. Harap baca dengan seksama dan hubungi support jika ada pertanyaan.",
    level: "PG-TK",
  },
  {
    id: 6,
    title: "Perubahan Kebijakan Layanan",
    type: "info",
    date: "30 Oktober 2025",
    description:
      "Terdapat perubahan pada kebijakan layanan kami. Harap baca dengan seksama dan hubungi support jika ada pertanyaan.",
    level: "SD",
  },
  {
    id: 7,
    title: "Perubahan Kebijakan Layanan",
    type: "info",
    date: "30 Oktober 2025",
    description:
      "Terdapat perubahan pada kebijakan layanan kami. Harap baca dengan seksama dan hubungi support jika ada pertanyaan.",
    level: "SMA",
  },
  {
    id: 8,
    title: "Perubahan Kebijakan Layanan",
    type: "info",
    date: "30 Oktober 2025",
    description:
      "Terdapat perubahan pada kebijakan layanan kami. Harap baca dengan seksama dan hubungi support jika ada pertanyaan.",
    level: "SMA",
  },
];

export const facilities: Facility[] = [
  {
    id: 1,
    name: "Ruangan Kelas Full AC + Proyektor",
    description:
      "Ruangan kelas yang sejuk dan nyaman dengan AC serta dilengkapi proyektor modern untuk mendukung pembelajaran interaktif dan efektif.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
    icon: "🏛️",
  },
  {
    id: 2,
    name: "Laboratorium Komputer",
    description:
      "Laboratorium komputer dengan perangkat terkini dan koneksi internet cepat untuk praktikum teknologi informasi dan pembelajaran digital.",
    image: "/assets/img-lab-komputer.jpeg",
    icon: "💻",
  },
  {
    id: 3,
    name: "Laboratorium Fisika",
    description:
      "Laboratorium fisika lengkap dengan alat peraga dan peralatan eksperimen untuk mendukung pembelajaran sains yang mendalam dan praktis.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
    icon: "🔎",
  },
  {
    id: 4,
    name: "Laboratorium Kimia",
    description:
      "Laboratorium kimia standar dengan peralatan lengkap dan sistem keamanan terjamin untuk praktikum dan eksperimen kimia siswa.",
    image: "/assets/img-lab-kimia.jpeg",
    icon: "🧪",
  },
  {
    id: 5,
    name: "Laboratorium Biologi",
    description:
      "Laboratorium biologi dilengkapi mikroskop dan specimen untuk mempelajari kehidupan dan organisme secara detail dan komprehensif.",
    image: "/assets/img-lab-biologi.jpeg",
    icon: "🔬",
  },
  {
    id: 6,
    name: "Laboratorium Bahasa",
    description:
      "Laboratorium bahasa modern dengan audio visual dan headset untuk meningkatkan kemampuan listening dan speaking siswa.",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
    icon: "💬",
  },
  {
    id: 7,
    name: "Perpustakaan",
    description:
      "Perpustakaan modern dengan koleksi buku lengkap dan ruang baca nyaman untuk mendukung literasi dan kegiatan belajar siswa.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
    icon: "📖",
  },
  {
    id: 8,
    name: "Wifi Zone",
    description:
      "Area wifi gratis dengan koneksi internet cepat dan stabil di seluruh area sekolah untuk mendukung pembelajaran digital siswa.",
    image: "/assets/img-wifi-sekolah.png",
    icon: "🛜",
  },
  {
    id: 10,
    name: "Indoor Playground TK",
    description:
      "Playground indoor yang aman dan edukatif khusus untuk siswa TK dengan berbagai permainan yang merangsang kreativitas anak.",
    image: "/assets/img-playground.png",
    icon: "🛝",
  },
  {
    id: 11,
    name: "Beasiswa Bagi Siswa Yang Berprestasi",
    description:
      "Program beasiswa penuh untuk siswa berprestasi akademik maupun non-akademik sebagai bentuk apresiasi dan motivasi belajar.",
    image: "/assets/img-berprestasi.png",
    icon: "🎓",
  },
  {
    id: 12,
    name: "UKS + Dokter Sekolah",
    description:
      "Unit Kesehatan Sekolah dengan dokter profesional dan peralatan medis lengkap untuk menjaga kesehatan dan keselamatan siswa.",
    image: "/assets/img-sekolah-uks.png",
    icon: "🧑🏻‍⚕️",
  },
];
// data lagu mars
export const songs = [
  {
    id: 1,
    title: "MARS PERGURUAN W.R.SUPRATMAN",
    subtitle: "Lagu Kebanggaan Sekolah",
    lyrics: [
      "SMK Negeri Satu tercinta",
      "Tempat kami menuntut ilma",
      "Dengan tekad dan semangat membara",
      "Meraih cita di masa depan",
      "",
      "Guru pembimbing penuh dedikasi",
      "Membina kami dengan kasih sayang",
      "Ilmu dan akhlak kami tegakkan",
      "Demi nusa dan bangsa tercinta",
      "",
      "Reff:",
      "Maju terus pantang mundur",
      "SMK Negeri Satu jaya",
      "Berprestasi dan berbudi",
      "Mengharumkan nama sekolah kita",
    ],
    composer: "karya T Sihombing",
    year: "2020",
    youtubeUrl: "https://www.youtube.com/watch?v=eewfP3ueoRg",
  },
];

// data pengumuman kelulusan
// src/data/kelulusan.ts

export interface KelulusanItem {
  id: number;
  name: string;
  nis: string;
  status: "LULUS" | "TIDAK LULUS";
  keterangan: string;
  level: "SD" | "SMP" | "SMA" | "PG-TK";
}

export const kelulusanList: KelulusanItem[] = [
  {
    id: 1,
    name: "Fajar Ramadhan",
    nis: "20250123",
    status: "LULUS",
    keterangan: "Lulus dengan nilai memuaskan.",
    level: "SD",
  },
  {
    id: 2,
    name: "Ayu Lestari",
    nis: "20250124",
    status: "TIDAK LULUS",
    keterangan: "Belum memenuhi standar kelulusan.",
    level: "SMP",
  },
  {
    id: 3,
    name: "Dimas Pratama",
    nis: "20250125",
    status: "LULUS",
    keterangan: "Lulus dengan nilai sangat baik.",
    level: "SMA",
  },
  {
    id: 4,
    name: "testing",
    nis: "20250125",
    status: "LULUS",
    keterangan: "Lulus dengan nilai sangat baik.",
    level: "SMA",
  },
];

// =========================
// TIPE DATA NILAI MAPEL
// =========================

export interface NilaiMapelItem {
  id: number;
  mapel: string;
  nilai: number;
  keterangan: string;
  level: "SD" | "SMP" | "SMA" | "PG-TK";
}

// =========================
// DATA NILAI MAPEL
// =========================

export const nilaiMapelList: NilaiMapelItem[] = [
  {
    id: 1,
    mapel: "Matematika",
    nilai: 89,
    keterangan: "Sangat baik dalam pemahaman konsep.",
    level: "SMA",
  },
  {
    id: 2,
    mapel: "Bahasa Indonesia",
    nilai: 78,
    keterangan: "Pemahaman cukup baik.",
    level: "SMA",
  },
  {
    id: 3,
    mapel: "IPA",
    nilai: 92,
    keterangan: "Luar biasa dalam analisis.",
    level: "SMA",
  },

  // contoh SD
  {
    id: 4,
    mapel: "Matematika",
    nilai: 85,
    keterangan: "Baik.",
    level: "SD",
  },
  {
    id: 5,
    mapel: "IPS",
    nilai: 74,
    keterangan: "Cukup.",
    level: "SD",
  },
];
