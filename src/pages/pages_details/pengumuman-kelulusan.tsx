import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  ChevronRight,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  RotateCcw,
  GraduationCap,
  AlertTriangle,
  BookOpen,
  Calendar,
  Hash,
  School,
  Shield,
  Download, // Tambahan icon untuk tombol cetak
} from "lucide-react";
import { Input } from "../../components/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select/select";
import Footer from "../../components/footer";

interface HasilKelulusan {
  kelulusan_id: string;
  nama_siswa: string;
  nomor_siswa: string;
  kelas: "XII_MIPA" | "XII_IPS";
  status_lulus: boolean;
  keterangan?: string | null;
  tahun_ajaran: string;
  jenjang?: { nama_jenjang: string } | null;
}
type StatusCek = "idle" | "loading" | "found" | "not_found" | "locked";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";
const TAHUN_AJARAN = "2024/2025";
const KELAS_OPTIONS = [
  { value: "XII_MIPA", label: "XII MIPA" },
  { value: "XII_IPS", label: "XII IPS" },
];

const formatTglDisplay = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
};
const formatTanggalAkses = (iso: string | null) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};
const labelKelas = (k: string) =>
  k === "XII_MIPA" ? "XII MIPA" : k === "XII_IPS" ? "XII IPS" : k;

export default function PengumumanKelulusan() {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null); // Ref untuk menangkap elemen kartu

  const [kelas, setKelas] = useState("");
  const [nomorInduk, setNomorInduk] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [tanggalLahirDisplay, setTanggalLahirDisplay] = useState("");
  const [status, setStatus] = useState<StatusCek>("idle");
  const [hasil, setHasil] = useState<HasilKelulusan | null>(null);
  const [tanggalAkses, setTanggalAkses] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPrinting, setIsPrinting] = useState(false); // State loading saat proses PDF

  useEffect(() => {
    if (status !== "idle" && status !== "loading") {
      setStatus("idle");
      setHasil(null);
      setErrorMsg("");
    }
  }, [kelas, nomorInduk, tanggalLahir]);

  const handleNomorInduk = (v: string) =>
    setNomorInduk(v.replace(/\D/g, "").slice(0, 10));
  const handleTanggalLahir = (v: string) => {
    const raw = v.replace(/\D/g, "").slice(0, 8);
    setTanggalLahir(raw);
    setTanggalLahirDisplay(formatTglDisplay(raw));
  };

  const isFormValid =
    kelas !== "" && nomorInduk.length >= 5 && tanggalLahir.length === 8;

  const handleCek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setStatus("loading");
    setHasil(null);
    setErrorMsg("");
    try {
      const res = await axios.post(`${API_BASE}/graduation/cek-siswa`, {
        nomor_siswa: nomorInduk,
        tanggal_lahir: tanggalLahir,
        tahun_ajaran: TAHUN_AJARAN,
      });
      setHasil(res.data.data as HasilKelulusan);
      setStatus("found");
    } catch (err: any) {
      const code = err?.response?.status;
      if (code === 403) {
        setStatus("locked");
        setTanggalAkses(err.response?.data?.tanggal_akses ?? null);
      } else {
        setStatus("not_found");
        setErrorMsg(
          err.response?.data?.message ||
            "Data tidak ditemukan. Pastikan Nomor Induk dan tanggal lahir sudah benar.",
        );
      }
    }
  };

  const handleReset = () => {
    setKelas("");
    setNomorInduk("");
    setTanggalLahir("");
    setTanggalLahirDisplay("");
    setStatus("idle");
    setHasil(null);
    setErrorMsg("");
  };

  // Fungsi untuk Generate PDF
  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsPrinting(true);

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, // Skala tinggi agar teks tajam
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Menambahkan gambar ke PDF dengan margin atas 15mm
      pdf.addImage(imgData, "PNG", 0, 15, pdfWidth, pdfHeight);
      pdf.save(`Lulus_${hasil?.nomor_siswa}_${hasil?.nama_siswa}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <>
      <style>{`
        /* ... CSS Original Anda tetap di sini ... */
        .pk { --gold: #ddc588; --color-primary: #eddfa5; --gold-d: #c4a55e; --gold-dark: #8a6a20; --gold-pale: #fdf8ed; --ink: #1a1408; --ink2: #3d2e0a; --ink3: #6b5320; }
        .pk { min-height: 100vh; display: flex; flex-direction: column; background: #f5f5f0; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
        .pk-hero { background: var(--gold); position: relative; overflow: hidden; }
        .pk-hero::before { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 65% 80% at 95% 10%, rgba(255,255,255,0.25) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 5% 95%, rgba(100,70,10,0.18) 0%, transparent 55%); }
        .pk-hero::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(-55deg, transparent, transparent 48px, rgba(255,255,255,0.06) 48px, rgba(255,255,255,0.06) 49px ); }
        .pk-hero-inner { position: relative; z-index: 1; max-width: 660px; margin: 0 auto; padding: 52px 24px 44px; }
        .pk-bc { display: flex; align-items: center; gap: 7px; margin-bottom: 32px; }
        .pk-bc-btn { background: none; border: none; cursor: pointer; padding: 0; font-size: 12px; font-weight: 600; color: var(--ink2); transition: color .15s; text-decoration: underline; text-underline-offset: 3px; }
        .pk-bc-btn:hover { color: var(--ink); }
        .pk-bc-sep { width: 13px; height: 13px; color: var(--ink3); opacity: .6; }
        .pk-bc-cur { font-size: 12px; font-weight: 700; color: var(--ink); }
        .pk-hero-body { display: flex; align-items: flex-start; gap: 20px; }
        .pk-iconbox { display: none; flex-shrink: 0; width: 62px; height: 62px; border-radius: 16px; background: rgba(26,20,8,0.12); border: 1.5px solid rgba(26,20,8,0.2); align-items: center; justify-content: center; }
        @media(min-width:500px){ .pk-iconbox { display:flex; } }
        .pk-pill { display: inline-flex; align-items: center; gap: 7px; padding: 5px 14px; border-radius: 999px; margin-bottom: 16px; background: rgba(26,20,8,0.12); border: 1.5px solid rgba(26,20,8,0.18); }
        .pk-pill-txt { font-size: 10px; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; color: var(--ink2); }
        .pk-title { font-size: clamp(26px, 5.5vw, 40px); font-weight: 900; line-height: 1.15; letter-spacing: -.025em; color: var(--ink); margin: 0 0 12px; }
        .pk-title .g { color: #fff; text-shadow: 0 1px 6px rgba(100,70,10,0.35); }
        .pk-desc { font-size: 14px; line-height: 1.75; color: var(--ink2); max-width: 430px; margin: 0; }
        .pk-desc strong { color: var(--ink); font-weight: 700; }
        .pk-strip { margin-top: 28px; padding-top: 20px; border-top: 1.5px solid rgba(26,20,8,0.15); display: flex; gap: 24px; flex-wrap: wrap; }
        .pk-strip-item { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 500; color: var(--ink3); }
        .pk-strip-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--ink); opacity: .4; flex-shrink: 0; }
        .pk-content { flex: 1; max-width: 660px; margin: 0 auto; width: 100%; padding: 30px 24px 48px; }
        .pk-notice { display: flex; align-items: flex-start; gap: 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; }
        .pk-notice h4 { margin: 0 0 2px; font-size: 13px; font-weight: 700; color: #78350f; }
        .pk-notice p  { margin: 0; font-size: 12px; color: #92400e; line-height: 1.6; }
        .pk-card { background: #fff; border-radius: 20px; border: 1px solid #e5e5e5; box-shadow: 0 2px 12px rgba(0,0,0,.07); overflow: hidden; }
        .pk-stripe { height: 4px; background: linear-gradient(90deg, var(--gold-d), var(--gold), var(--gold-l)); }
        .pk-ch { padding: 22px 24px 0; }
        .pk-ch h2 { margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #111; }
        .pk-ch p  { margin: 0; font-size: 13px; color: #666; line-height: 1.65; }
        .pk-ch p strong { color: #222; }
        .pk-hr { height: 1px; background: #f0f0f0; margin: 18px 24px; }
        .pk-cb { padding: 0 24px 24px; }
        .pk-field { margin-bottom: 18px; }
        .pk-lbl { display: block; font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #999; margin-bottom: 7px; }
        .pk-lbl .r { color: #f87171; font-weight: 400; text-transform: none; font-size: 12px; }
        .pk-iw { position: relative; }
        .pk-cnt { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 5px; transition: all .2s; }
        .pk-cnt.ok { background: #fdf3d0; color: #7a5c10; }
        .pk-cnt.no { background: #f0f0f0; color: #aaa; }
        .pk-hint { display: flex; align-items: center; gap: 7px; background: #fafafa; border: 1px solid #efefef; border-radius: 8px; padding: 8px 12px; margin-top: 7px; font-size: 12px; color: #777; }
        .pk-hint code { background: #fff; border: 1px solid #e5e5e5; color: var(--gold-dark); font-family: monospace; font-weight: 700; padding: 1px 8px; border-radius: 5px; font-size: 11px; }
        .pk-btn { width: 100%; height: 50px; border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 700; letter-spacing: .04em; cursor: pointer; transition: all .2s; background: var(--ink); color: var(--gold); border: 1.5px solid rgba(221,197,136,.25); box-shadow: 0 4px 14px rgba(0,0,0,.2); }
        .pk-btn:hover:not(:disabled) { transform: translateY(-1px); background: #2a2010; border-color: var(--gold); box-shadow: 0 6px 20px rgba(0,0,0,.28), 0 0 0 1px rgba(221,197,136,.2); }
        .pk-btn:active:not(:disabled) { transform: scale(0.99); }
        .pk-btn:disabled { background: #f0f0f0; color: #bbb; border-color: #e5e5e5; box-shadow: none; cursor: not-allowed; }
        .pk-res  { margin-top: 26px; animation: pkUp .3s ease; }
        .pk-sep  { height: 1px; background: #f0f0f0; margin-bottom: 26px; }
        .pk-rbox { border-radius: 16px; overflow: hidden; border: 2px solid; }
        .pk-rbox.ok { border-color: #e8d89a; }
        .pk-rbox.no { border-color: #fecaca; }
        .pk-rbar { height: 5px; }
        .pk-rbar.ok { background: linear-gradient(90deg, var(--gold-d), var(--gold), var(--gold-l)); }
        .pk-rbar.no { background: linear-gradient(90deg, #ef4444, #f43f5e); }
        .pk-rbody { padding: 20px; }
        .pk-rbody.ok { background: linear-gradient(135deg, #fdf8ed, #fefef8); }
        .pk-rbody.no { background: linear-gradient(135deg, #fff5f5, #fff1f2); }
        .pk-srow { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
        .pk-sicon { width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .pk-sicon.ok { background: #fdf3d0; }
        .pk-sicon.no { background: #fee2e2; }
        .pk-badge { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; padding: 4px 14px; border-radius: 999px; }
        .pk-badge.ok { background: var(--ink); color: var(--gold); border: 1px solid rgba(221,197,136,.2); }
        .pk-badge.no { background: linear-gradient(135deg,#dc2626,#f43f5e); color: #fff; }
        .pk-stp { font-size: 11px; color: #aaa; font-weight: 500; margin-top: 4px; }
        .pk-nama { border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; }
        .pk-nama.ok { background: var(--ink); border: 1px solid rgba(221,197,136,.2); }
        .pk-nama.no { background: linear-gradient(135deg,#dc2626,#f43f5e); }
        .pk-nlbl { font-size: 9px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; margin-bottom: 4px; }
        .pk-nlbl.ok { color: rgba(221,197,136,.45); }
        .pk-nlbl.no { color: rgba(255,255,255,.5); }
        .pk-nval { font-size: 22px; font-weight: 900; line-height: 1.2; }
        .pk-nval.ok { color: var(--gold); }
        .pk-nval.no { color: #fff; }
        .pk-dgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .pk-ditem { display: flex; align-items: flex-start; gap: 10px; border-radius: 10px; padding: 10px 12px; }
        .pk-ditem.ok { background: rgba(253,248,237,.9); }
        .pk-ditem.no { background: rgba(255,245,245,.9); }
        .pk-dicon { flex-shrink: 0; margin-top: 1px; border-radius: 7px; padding: 5px; }
        .pk-dicon.ok { background: #fdf3d0; }
        .pk-dicon.no { background: #fee2e2; }
        .pk-dlbl { font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #aaa; margin-bottom: 2px; }
        .pk-dval { font-size: 13px; font-weight: 600; color: #111; }
        .pk-ket { margin-top: 8px; border-radius: 10px; padding: 10px 14px; }
        .pk-ket.ok { background: rgba(253,248,237,.9); border: 1px solid #e8d89a; }
        .pk-ket.no { background: rgba(255,245,245,.9); border: 1px solid #fecaca; }
        .pk-klbl { font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #aaa; margin-bottom: 4px; }
        .pk-kval { font-size: 13px; color: #555; line-height: 1.65; font-style: italic; }
        .pk-reset { width: 100%; height: 40px; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; background: transparent; border: 1.5px solid #e5e5e5; border-radius: 10px; color: #888; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; }
        .pk-reset:hover { border-color: var(--gold); color: var(--gold-dark); background: var(--gold-pale); }

        /* Style tambahan untuk Tombol Cetak PDF */
        .pk-btn-pdf {
          width: 100%; height: 48px; margin-top: 12px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #1a1408; color: #ddc588;
          border-radius: 12px; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all .2s; border: 1px solid #c9a96e;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .pk-btn-pdf:hover { background: #000; transform: translateY(-1px); }
        .pk-btn-pdf:disabled { opacity: 0.7; cursor: not-allowed; }

        .pk-alert { margin-top: 18px; border-radius: 12px; overflow: hidden; animation: pkUp .25s ease; }
        .pk-abar { height: 3px; }
        .pk-abar.danger  { background: linear-gradient(90deg,#ef4444,#f43f5e); }
        .pk-abar.warning { background: linear-gradient(90deg, var(--gold-d), var(--gold)); }
        .pk-ain { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; }
        .pk-aibox { width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .pk-aibox.danger  { background: #fee2e2; }
        .pk-aibox.warning { background: #fdf3d0; }
        .pk-alert.danger  { background: #fff5f5; border: 1px solid #fecaca; }
        .pk-alert.warning { background: #fffbeb; border: 1px solid #fde68a; }
        .pk-atitle { font-size: 14px; font-weight: 700; margin: 0 0 3px; }
        .pk-atitle.danger  { color: #b91c1c; }
        .pk-atitle.warning { color: #78350f; }
        .pk-amsg { font-size: 12px; line-height: 1.65; margin: 0; }
        .pk-amsg.danger  { color: #dc2626; }
        .pk-amsg.warning { color: #92400e; }
        .pk-amsg strong  { font-weight: 700; color: #78350f; }
        .pk-foot { text-align: center; font-size: 11px; color: #bbb; margin-top: 18px; }

        @keyframes pkUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pkSpin { to { transform: rotate(360deg); } }
        .pk-spin { animation: pkSpin .8s linear infinite; display: inline-block; }
      `}</style>

      <div className="pk">
        {/* Hero Section */}
        <div className="pk-hero">
          <div className="pk-hero-inner">
            <nav className="pk-bc">
              <button
                className="pk-bc-btn"
                onClick={() => navigate("/kelulusan")}
              >
                Kelulusan
              </button>
              <ChevronRight className="pk-bc-sep" />
              <span className="pk-bc-cur">SMA</span>
            </nav>

            <div className="pk-hero-body">
              <div className="pk-iconbox">
                <GraduationCap
                  style={{ width: 28, height: 28, color: "var(--ink)" }}
                />
              </div>
              <div>
                <div className="pk-pill">
                  <Shield
                    style={{ width: 10, height: 10, color: "var(--ink2)" }}
                  />
                  <span className="pk-pill-txt">
                    Pengumuman Resmi · T.P. {TAHUN_AJARAN}
                  </span>
                </div>
                <h1 className="pk-title">
                  Pengumuman <span className="g">Kelulusan</span>
                  <br />
                  Siswa Kelas XII
                </h1>
                <p className="pk-desc">
                  Siswa Kelas XII dinyatakan lulus berdasarkan{" "}
                  <strong>Kriteria Kelulusan</strong> yang ditetapkan oleh{" "}
                  <strong>Satuan Pendidikan</strong>.
                </p>
              </div>
            </div>
            <div className="pk-strip">
              {[
                "Data resmi satuan pendidikan",
                "Diverifikasi dengan tanggal lahir",
              ].map((t) => (
                <span key={t} className="pk-strip-item">
                  <span className="pk-strip-dot" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pk-content">
          <div className="pk-notice">
            <AlertTriangle
              style={{
                width: 15,
                height: 15,
                color: "#d97706",
                flexShrink: 0,
                marginTop: 1,
              }}
            />
            <div>
              <h4>Perhatian</h4>
              <p>
                Pengumuman ini mulai dapat diakses pada tanggal dan waktu yang
                telah ditetapkan oleh Satuan Pendidikan.
              </p>
            </div>
          </div>

          <div className="pk-card">
            <div className="pk-stripe" />
            <div className="pk-ch">
              <h2>Cek Hasil Kelulusan</h2>
              <p>
                Pilih <strong>Kelas</strong>, masukkan{" "}
                <strong>Nomor Induk</strong> dan <strong>Tanggal Lahir</strong>,
                lalu klik tombol.
              </p>
            </div>
            <div className="pk-hr" />
            <div className="pk-cb">
              <form onSubmit={handleCek} noValidate>
                {/* Inputs ... (tetap sama) */}
                <div className="pk-field">
                  <label className="pk-lbl">
                    Kelas <span className="r">*</span>
                  </label>
                  <Select value={kelas} onValueChange={setKelas}>
                    <SelectTrigger
                      style={{
                        height: 44,
                        borderRadius: 10,
                        border: "1.5px solid #e5e5e5",
                        background: "#fafafa",
                        fontSize: 14,
                      }}
                    >
                      <SelectValue placeholder="Pilih kelas Anda" />
                    </SelectTrigger>
                    <SelectContent
                      style={{ borderRadius: 12, border: "1px solid #e5e5e5" }}
                    >
                      {KELAS_OPTIONS.map((o) => (
                        <SelectItem
                          key={o.value}
                          value={o.value}
                          style={{ fontSize: 14 }}
                        >
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pk-field">
                  <label className="pk-lbl">
                    Nomor Induk <span className="r">*</span>
                  </label>
                  <div className="pk-iw">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Masukkan 10 digit nomor induk"
                      value={nomorInduk}
                      onChange={(e) => handleNomorInduk(e.target.value)}
                      maxLength={10}
                      style={{
                        height: 44,
                        borderRadius: 10,
                        border: "1.5px solid #e5e5e5",
                        background: "#fafafa",
                        fontSize: 14,
                        paddingRight: 56,
                      }}
                    />
                    <span
                      className={`pk-cnt ${nomorInduk.length === 10 ? "ok" : "no"}`}
                    >
                      {nomorInduk.length}/10
                    </span>
                  </div>
                </div>

                <div className="pk-field" style={{ marginBottom: 22 }}>
                  <label className="pk-lbl">
                    Tanggal Lahir <span className="r">*</span>
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="YYYYMMDD"
                    value={tanggalLahirDisplay}
                    onChange={(e) => handleTanggalLahir(e.target.value)}
                    maxLength={10}
                    style={{
                      height: 44,
                      borderRadius: 10,
                      border: "1.5px solid #e5e5e5",
                      background: "#fafafa",
                      fontFamily: "monospace",
                      letterSpacing: "0.08em",
                      fontSize: 14,
                    }}
                  />
                  <div className="pk-hint">
                    <Calendar
                      style={{
                        width: 13,
                        height: 13,
                        color: "#ccc",
                        flexShrink: 0,
                      }}
                    />
                    <span>
                      <strong style={{ color: "#444" }}>Contoh:</strong> 17
                      Agustus 2005{" "}
                      <span style={{ color: "#ccc", margin: "0 4px" }}>→</span>
                      <code>20050817</code>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || status === "loading"}
                  className="pk-btn"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2
                        className="pk-spin"
                        style={{ width: 16, height: 16 }}
                      />{" "}
                      Memeriksa Data...
                    </>
                  ) : (
                    <>
                      <Search style={{ width: 16, height: 16 }} /> Tampilkan
                      Hasil Kelulusan
                    </>
                  )}
                </button>
              </form>

              {status === "found" && hasil && (
                <div className="pk-res">
                  <div className="pk-sep" />

                  {/* WRAPPER PRINT - Elemen ini yang akan jadi PDF */}
                  <div
                    ref={printRef}
                    style={{
                      background: "#fff",
                      padding: "10px",
                      borderRadius: "16px",
                    }}
                  >
                    <div
                      className={`pk-rbox ${hasil.status_lulus ? "ok" : "no"}`}
                    >
                      <div
                        className={`pk-rbar ${hasil.status_lulus ? "ok" : "no"}`}
                      />
                      <div
                        className={`pk-rbody ${hasil.status_lulus ? "ok" : "no"}`}
                      >
                        <div className="pk-srow">
                          <div
                            className={`pk-sicon ${hasil.status_lulus ? "ok" : "no"}`}
                          >
                            {hasil.status_lulus ? (
                              <CheckCircle2
                                style={{
                                  width: 24,
                                  height: 24,
                                  color: "#c9a96e",
                                }}
                              />
                            ) : (
                              <XCircle
                                style={{
                                  width: 24,
                                  height: 24,
                                  color: "#dc2626",
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <span
                              className={`pk-badge ${hasil.status_lulus ? "ok" : "no"}`}
                            >
                              {hasil.status_lulus
                                ? "✓ Dinyatakan Lulus"
                                : "✗ Belum Lulus"}
                            </span>
                            <p className="pk-stp">
                              Tahun Pelajaran {hasil.tahun_ajaran}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`pk-nama ${hasil.status_lulus ? "ok" : "no"}`}
                        >
                          <p
                            className={`pk-nlbl ${hasil.status_lulus ? "ok" : "no"}`}
                          >
                            Nama Siswa
                          </p>
                          <p
                            className={`pk-nval ${hasil.status_lulus ? "ok" : "no"}`}
                          >
                            {hasil.nama_siswa}
                          </p>
                        </div>

                        <div className="pk-dgrid">
                          {[
                            {
                              icon: Hash,
                              label: "Nomor Induk",
                              value: hasil.nomor_siswa,
                            },
                            {
                              icon: BookOpen,
                              label: "Kelas",
                              value: labelKelas(hasil.kelas),
                            },
                            {
                              icon: Calendar,
                              label: "Tahun Ajaran",
                              value: hasil.tahun_ajaran,
                            },
                            {
                              icon: School,
                              label: "Satuan Pendidikan",
                              value: hasil.jenjang?.nama_jenjang ?? "SMA",
                            },
                          ].map(({ icon: Icon, label, value }) => (
                            <div
                              key={label}
                              className={`pk-ditem ${hasil.status_lulus ? "ok" : "no"}`}
                            >
                              <div
                                className={`pk-dicon ${hasil.status_lulus ? "ok" : "no"}`}
                              >
                                <Icon
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: hasil.status_lulus
                                      ? "#a07830"
                                      : "#991b1b",
                                  }}
                                />
                              </div>
                              <div>
                                <p className="pk-dlbl">{label}</p>
                                <p className="pk-dval">{value}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {hasil.keterangan && (
                          <div
                            className={`pk-ket ${hasil.status_lulus ? "ok" : "no"}`}
                          >
                            <p className="pk-klbl">Keterangan</p>
                            <p className="pk-kval">"{hasil.keterangan}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi (Tidak Masuk PDF) */}
                  <div style={{ marginTop: 20 }}>
                    <button
                      className="pk-btn-pdf"
                      onClick={handleDownloadPDF}
                      disabled={isPrinting}
                    >
                      {isPrinting ? (
                        <>
                          <Loader2
                            className="pk-spin"
                            style={{ width: 16, height: 16 }}
                          />{" "}
                          Mengolah Dokumen...
                        </>
                      ) : (
                        <>
                          <Download style={{ width: 18, height: 18 }} /> Simpan
                          Hasil (PDF)
                        </>
                      )}
                    </button>

                    <button className="pk-reset" onClick={handleReset}>
                      <RotateCcw style={{ width: 13, height: 13 }} /> Cek Siswa
                      Lain
                    </button>
                  </div>
                </div>
              )}

              {/* Status alerts ... (tetap sama) */}
              {status === "not_found" && (
                <div className="pk-alert danger">
                  <div className="pk-abar danger" />
                  <div className="pk-ain">
                    <div className="pk-aibox danger">
                      <XCircle
                        style={{ width: 16, height: 16, color: "#dc2626" }}
                      />
                    </div>
                    <div>
                      <p className="pk-atitle danger">Data Tidak Ditemukan</p>
                      <p className="pk-amsg danger">{errorMsg}</p>
                    </div>
                  </div>
                </div>
              )}
              {status === "locked" && (
                <div className="pk-alert warning">
                  <div className="pk-abar warning" />
                  <div className="pk-ain">
                    <div className="pk-aibox warning">
                      <Lock
                        style={{ width: 15, height: 15, color: "#b8941e" }}
                      />
                    </div>
                    <div>
                      <p className="pk-atitle warning">
                        Pengumuman Belum Dapat Diakses
                      </p>
                      <p className="pk-amsg warning">
                        Hasil kelulusan baru dapat dilihat mulai{" "}
                        <strong>{formatTanggalAkses(tanggalAkses)}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="pk-foot">
            Pengumuman resmi ini hanya dapat diakses oleh siswa yang
            bersangkutan.
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
}
