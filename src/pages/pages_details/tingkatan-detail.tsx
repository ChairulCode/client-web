import { useParams } from "react-router-dom";
import Footer from "../../components/footer/index";
import Header from "../../components/header/index";
import Announcement from "../../components/annoucment/index";
import Activity from "../../components/activity/index";
import { useEffect } from "react";

// Definisikan tipe yang valid
type ValidJenjang = "SMA" | "SMP" | "SD" | "PGTK";

const TingkatanDetail = () => {
  // PENTING: Gunakan 'level' karena di App.tsx lu nulisnya :level
  const { level } = useParams<{ level: string }>();

  // 1. Debugging Browser
  console.log("📍 [CHECK] Param dari URL (:level):", level);

  // 2. Normalisasi Tahan Banting
  const rawLevel = level?.toUpperCase().trim() || "";

  let finalJenjang: ValidJenjang | undefined = undefined;

  if (rawLevel.includes("SMA")) {
    finalJenjang = "SMA";
  } else if (rawLevel.includes("SMP")) {
    finalJenjang = "SMP";
  } else if (rawLevel.includes("SD")) {
    finalJenjang = "SD";
  } else if (
    rawLevel.includes("PG") ||
    rawLevel.includes("TK") ||
    rawLevel.includes("PGTK")
  ) {
    finalJenjang = "PGTK";
  }

  console.log("📍 [RESULT] Jenjang yang dikirim ke API:", finalJenjang);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [finalJenjang]);

  return (
    <div>
      <Header jenjang={finalJenjang} />
      <Announcement jenjang={finalJenjang} />
      <Activity jenjang={finalJenjang} />
      <Footer />
    </div>
  );
};

export default TingkatanDetail;
