import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/homescreen";
import Facility from "./pages/facility";
import ScrollToTop from "./scrolltotop";
import Songs from "./pages/songs";
import TingkatanDetail from "./pages/pages_details/tingkatan-detail";
import AboutDetail from "./pages/pages_details/about-detail";
import Pendaftaran from "./pages/pendaftaran";
import Ekstrakurikuler from "./pages/ekstrakulikuler";
import Carousel_detail_home from "./pages/pages_details/carousel_detail_home";
import PrestasiDetail from "./pages/pages_details/prestasi_detail";
import ActivityDetail from "./pages/pages_details/kegiatan_detail";
import TingkatanLayout from "./pages/pages_details/layout/tingkatan-layout";
import TingkatanPrestasi from "./pages/pages_details/prestasi-tingkatan";
import KegiatanTingkatan from "./pages/pages_details/kegiatan-tingkatan";
import PengumumanTingkatan from "./pages/pages_details/pengumuman-tingkatan";
import PengumumanKelulusan from "./pages/pages_details/pengumuman-kelulusan";
import NilaiTingkatan from "./pages/pages_details/nilai-tingkatan";
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeScreen />}></Route>
        {/* route handle tingkatan */}
        <Route path="/tingkatan/:level" element={<TingkatanLayout />}>
          <Route index element={<TingkatanDetail />} />
          <Route path="about" element={<AboutDetail />} />
          <Route path="prestasi" element={<TingkatanPrestasi />} />
          <Route path="kegiatan" element={<KegiatanTingkatan />} />
          <Route path="pengumuman" element={<PengumumanTingkatan />} />
          <Route
            path="pengumuman-kelulusan"
            element={<PengumumanKelulusan />}
          />
          <Route
            path="pengumuman-kelulusan"
            element={<PengumumanKelulusan />}
          />
          <Route path="nilai" element={<NilaiTingkatan />} />
        </Route>

        <Route path="/Fasilitas" element={<Facility />}></Route>
        <Route path="/Lagu-Mars" element={<Songs />}></Route>
        <Route path="/ekstrakurikuler" element={<Ekstrakurikuler />}></Route>
        <Route path="/pendaftaran-siswa" element={<Pendaftaran />}></Route>
        <Route
          path="/carousel-detail/:id"
          element={<Carousel_detail_home />}
        ></Route>
        <Route path="/prestasi/:id" element={<PrestasiDetail />} />
        <Route path="/kegiatan/:id" element={<ActivityDetail />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
