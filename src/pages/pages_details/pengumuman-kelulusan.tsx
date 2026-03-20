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
  Download,
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
  const printRef = useRef<HTMLDivElement>(null);

  const [kelas, setKelas] = useState("");
  const [nomorInduk, setNomorInduk] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [tanggalLahirDisplay, setTanggalLahirDisplay] = useState("");
  const [status, setStatus] = useState<StatusCek>("idle");
  const [hasil, setHasil] = useState<HasilKelulusan | null>(null);
  const [tanggalAkses, setTanggalAkses] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

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

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsPrinting(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 3,
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .pk {
          --gold: #ddc588; --gold-l: #eddfa5; --gold-d: #c4a55e;
          --gold-dark: #8a6a20; --gold-pale: #fdf8ed; --gold-deep: #5a3e10;
          --ink: #1a1408; --ink2: #3d2e0a; --ink3: #6b5320;
          --surface: #faf9f6; --white: #ffffff;
          --shadow-gold: 0 8px 32px rgba(196,165,94,0.18);
          --radius-card: 20px;
          min-height: 100vh; display: flex; flex-direction: column;
          background: var(--surface);
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* ── HERO ── */
        .pk-hero {
          background: linear-gradient(135deg, #1e3a8a, #3730a3, #7c3aed);
          position: relative; overflow: hidden;
        }
        .pk-hero::before {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 80% at 90% 5%, rgba(221,197,136,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 10% 100%, rgba(221,197,136,0.08) 0%, transparent 55%);
        }
        /* diagonal lines texture */
        .pk-hero::after {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(
            -55deg, transparent, transparent 60px,
            rgba(221,197,136,0.04) 60px, rgba(221,197,136,0.04) 61px
          );
        }
        .pk-hero-inner {
          position: relative; z-index: 1;
          max-width: 660px; margin: 0 auto; padding: 56px 24px 48px;
        }

        /* ── BREADCRUMB ── */
        .pk-bc { display: flex; align-items: center; gap: 8px; margin-bottom: 36px; }
        .pk-bc-btn {
          background: none; border: none; cursor: pointer; padding: 0;
          font-size: 12px; font-weight: 600; color: rgba(221,197,136,0.6);
          transition: color .15s; font-family: 'DM Sans', sans-serif;
        }
        .pk-bc-btn:hover { color: var(--gold); }
        .pk-bc-sep { width: 12px; height: 12px; color: rgba(221,197,136,0.3); }
        .pk-bc-cur { font-size: 12px; font-weight: 700; color: var(--gold); }

        /* ── HERO BODY ── */
        .pk-hero-body { display: flex; align-items: flex-start; gap: 20px; }
        .pk-iconbox {
          display: none; flex-shrink: 0; width: 64px; height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(221,197,136,0.15), rgba(221,197,136,0.05));
          border: 1px solid rgba(221,197,136,0.25);
          align-items: center; justify-content: center;
        }
        @media(min-width:500px){ .pk-iconbox { display:flex; } }
        .pk-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 999px; margin-bottom: 18px;
          background: rgba(221,197,136,0.1); border: 1px solid rgba(221,197,136,0.2);
        }
        .pk-pill-txt {
          font-size: 10px; font-weight: 700; letter-spacing: .15em;
          text-transform: uppercase; color: rgba(221,197,136,0.7);
        }
        .pk-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 5.5vw, 44px); font-weight: 900;
          line-height: 1.12; letter-spacing: -.02em;
          color: rgba(255,255,255,0.92); margin: 0 0 14px;
        }
        .pk-title .g {
          color: var(--gold);
          text-shadow: 0 0 40px rgba(221,197,136,0.4);
        }
        .pk-desc { font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.5); max-width: 430px; margin: 0; }
        .pk-desc strong { color: rgba(221,197,136,0.8); font-weight: 600; }
        .pk-strip {
          margin-top: 32px; padding-top: 22px;
          border-top: 1px solid rgba(221,197,136,0.12);
          display: flex; gap: 24px; flex-wrap: wrap;
        }
        .pk-strip-item { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 500; color: rgba(221,197,136,0.45); }
        .pk-strip-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--gold-d); opacity: .5; flex-shrink: 0; }

        /* ── CONTENT ── */
        .pk-content { flex: 1; max-width: 660px; margin: 0 auto; width: 100%; padding: 32px 24px 52px; }

        /* ── NOTICE ── */
        .pk-notice {
          display: flex; align-items: flex-start; gap: 12px;
          background: #fffcf0; border: 1px solid #f5e6b0;
          border-radius: 12px; padding: 13px 16px; margin-bottom: 22px;
        }
        .pk-notice h4 { margin: 0 0 2px; font-size: 13px; font-weight: 700; color: #78350f; }
        .pk-notice p  { margin: 0; font-size: 12px; color: #92400e; line-height: 1.6; }

        /* ── FORM CARD ── */
        .pk-card {
          background: var(--white); border-radius: var(--radius-card);
          border: 1px solid #ece9e0;
          box-shadow: 0 2px 16px rgba(26,20,8,0.06), 0 1px 3px rgba(26,20,8,0.04);
          overflow: hidden;
        }
        .pk-stripe { height: 3px; background: linear-gradient(90deg, var(--gold-deep), var(--gold-d), var(--gold), var(--gold-l), var(--gold)); }
        .pk-ch { padding: 24px 26px 0; }
        .pk-ch h2 { margin: 0 0 5px; font-size: 16px; font-weight: 700; color: #111; letter-spacing: -.01em; }
        .pk-ch p  { margin: 0; font-size: 13px; color: #777; line-height: 1.65; }
        .pk-ch p strong { color: #333; }
        .pk-hr { height: 1px; background: #f3f0e8; margin: 20px 26px; }
        .pk-cb { padding: 0 26px 26px; }
        .pk-field { margin-bottom: 18px; }
        .pk-lbl { display: block; font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #999; margin-bottom: 8px; }
        .pk-lbl .r { color: #f87171; font-weight: 400; text-transform: none; font-size: 12px; }
        .pk-iw { position: relative; }
        .pk-cnt {
          position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; transition: all .2s;
        }
        .pk-cnt.ok { background: #fdf3d0; color: #7a5c10; }
        .pk-cnt.no { background: #f3f3f3; color: #bbb; }
        .pk-hint {
          display: flex; align-items: center; gap: 7px;
          background: #fafaf8; border: 1px solid #eeebe0;
          border-radius: 8px; padding: 8px 12px; margin-top: 8px;
          font-size: 12px; color: #888;
        }
        .pk-hint code {
          background: var(--white); border: 1px solid #e8e3d5;
          color: var(--gold-dark); font-family: 'Courier New', monospace;
          font-weight: 700; padding: 1px 8px; border-radius: 5px; font-size: 11px;
        }

        /* Submit button */
        .pk-btn {
          width: 100%; height: 52px; border: none; border-radius: 13px;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          font-size: 14px; font-weight: 700; letter-spacing: .04em;
          cursor: pointer; transition: all .22s;
          background: linear-gradient(135deg, #1a1408 0%, #2d2010 100%);
          color: var(--gold);
          border: 1px solid rgba(221,197,136,0.2);
          box-shadow: 0 4px 16px rgba(26,20,8,0.22), 0 1px 3px rgba(26,20,8,0.12);
          font-family: 'DM Sans', sans-serif;
        }
        .pk-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(26,20,8,0.28), 0 2px 6px rgba(26,20,8,0.16);
          border-color: rgba(221,197,136,0.4);
        }
        .pk-btn:active:not(:disabled) { transform: scale(0.99); }
        .pk-btn:disabled { background: #f3f3f1; color: #ccc; border-color: #ebebeb; box-shadow: none; cursor: not-allowed; }

        /* ── RESULT ── */
        .pk-res { margin-top: 28px; animation: pkUp .35s cubic-bezier(.2,.8,.3,1); }
        .pk-sep { height: 1px; background: linear-gradient(90deg, transparent, #e8e3d5, transparent); margin-bottom: 28px; }

        /* Certificate card */
        .pk-cert {
          border-radius: 18px; overflow: hidden;
          border: 1px solid;
          position: relative;
        }
        .pk-cert.ok { border-color: #d4b97a; background: #fff; }
        .pk-cert.no { border-color: #fca5a5; background: #fff; }

        /* top accent bar */
        .pk-cert-bar { height: 6px; }
        .pk-cert-bar.ok { background: linear-gradient(90deg, var(--gold-deep), var(--gold-d) 30%, var(--gold) 60%, var(--gold-l)); }
        .pk-cert-bar.no { background: linear-gradient(90deg, #dc2626, #ef4444 40%, #f87171); }

        /* watermark ornament */
        .pk-cert-ornament {
          position: absolute; top: 0; right: 0; width: 220px; height: 220px;
          pointer-events: none; overflow: hidden; border-radius: 0 18px 0 0;
        }
        .pk-cert-ornament-inner {
          position: absolute; top: -60px; right: -60px;
          width: 200px; height: 200px; border-radius: 50%;
          border: 40px solid;
          opacity: 0.045;
        }
        .pk-cert-ornament-inner.ok { border-color: var(--gold-d); }
        .pk-cert-ornament-inner.no { border-color: #dc2626; }

        .pk-cert-body { padding: 30px 28px 24px; position: relative; z-index: 1; }

        /* status row */
        .pk-status-row { display: flex; align-items: center; gap: 16px; margin-bottom: 26px; }
        .pk-status-icon {
          width: 64px; height: 64px; border-radius: 18px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .pk-status-icon.ok {
          background: linear-gradient(135deg, var(--gold-pale), #fdf3d0);
          border: 1px solid #e8d89a;
          box-shadow: 0 2px 8px rgba(196,165,94,0.2);
        }
        .pk-status-icon.no {
          background: linear-gradient(135deg, #fff5f5, #fee2e2);
          border: 1px solid #fca5a5;
        }
        .pk-badge {
          display: inline-block; font-size: 12px; font-weight: 800;
          letter-spacing: .12em; text-transform: uppercase;
          padding: 7px 20px; border-radius: 999px;
        }
        .pk-badge.ok {
          background: linear-gradient(135deg, var(--gold-deep), var(--gold-dark));
          color: var(--gold-l);
          box-shadow: 0 2px 10px rgba(90,62,16,0.3);
        }
        .pk-badge.no {
          background: linear-gradient(135deg, #b91c1c, #dc2626);
          color: #fff;
          box-shadow: 0 2px 10px rgba(185,28,28,0.25);
        }
        .pk-year { font-size: 13px; color: #aaa; font-weight: 500; margin-top: 6px; }

        /* name block */
        .pk-name-block { border-radius: 16px; padding: 24px 26px; margin-bottom: 16px; }
        .pk-name-block.ok {
          background: linear-gradient(135deg, var(--ink) 0%, #2d2010 100%);
          border: 1px solid rgba(221,197,136,0.15);
          box-shadow: 0 4px 20px rgba(26,20,8,0.2);
        }
        .pk-name-block.no {
          background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
          box-shadow: 0 4px 20px rgba(185,28,28,0.2);
        }
        .pk-name-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; margin-bottom: 8px; }
        .pk-name-eyebrow.ok { color: rgba(221,197,136,0.4); }
        .pk-name-eyebrow.no { color: rgba(255,255,255,0.45); }
        .pk-name-value {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(26px, 5vw, 34px); font-weight: 700; line-height: 1.2;
        }
        .pk-name-value.ok { color: var(--gold); }
        .pk-name-value.no { color: #fff; }

        /* detail grid */
        .pk-dgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
        .pk-ditem { display: flex; align-items: flex-start; gap: 12px; border-radius: 13px; padding: 14px 16px; }
        .pk-ditem.ok { background: #faf8f2; border: 1px solid #f0eadb; }
        .pk-ditem.no { background: #fff9f9; border: 1px solid #fde8e8; }
        .pk-dicon-wrap { flex-shrink: 0; border-radius: 9px; padding: 8px; margin-top: 1px; }
        .pk-dicon-wrap.ok { background: #fdf3d0; }
        .pk-dicon-wrap.no { background: #fee2e2; }
        .pk-dlbl { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #bbb; margin-bottom: 5px; }
        .pk-dval { font-size: 15px; font-weight: 600; color: #222; line-height: 1.3; }

        /* keterangan */
        .pk-ket { border-radius: 13px; padding: 16px 20px; }
        .pk-ket.ok { background: #faf8f2; border: 1px solid #e8dfc8; }
        .pk-ket.no { background: #fff9f9; border: 1px solid #fde8e8; }
        .pk-klbl { font-size: 10px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #bbb; margin-bottom: 7px; }
        .pk-kval { font-size: 14px; color: #666; line-height: 1.75; font-style: italic; }

        /* cert footer */
        .pk-cert-footer {
          padding: 14px 28px 16px;
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid;
        }
        .pk-cert-footer.ok { background: #faf7ef; border-color: #ede7d5; }
        .pk-cert-footer.no { background: #fff8f8; border-color: #fde8e8; }
        .pk-cert-foot-txt { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
        .pk-cert-foot-txt.ok { color: #b8941e; }
        .pk-cert-foot-txt.no { color: #dc2626; }
        .pk-cert-foot-brand { font-size: 11px; font-weight: 500; color: #ccc; }

        /* action buttons */
        .pk-actions { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; }
        .pk-btn-pdf {
          width: 100%; height: 50px;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          background: linear-gradient(135deg, #1a1408 0%, #2d2010 100%);
          color: var(--gold); border-radius: 13px;
          font-size: 14px; font-weight: 700; letter-spacing: .04em;
          cursor: pointer; transition: all .22s;
          border: 1px solid rgba(221,197,136,0.25);
          box-shadow: 0 4px 14px rgba(26,20,8,0.2);
          font-family: 'DM Sans', sans-serif;
        }
        .pk-btn-pdf:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(26,20,8,0.28);
          border-color: rgba(221,197,136,0.45);
        }
        .pk-btn-pdf:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        .pk-reset {
          width: 100%; height: 42px;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          background: transparent; border: 1.5px solid #e8e3d8;
          border-radius: 11px; color: #999; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all .18s;
          font-family: 'DM Sans', sans-serif;
        }
        .pk-reset:hover { border-color: var(--gold-d); color: var(--gold-dark); background: var(--gold-pale); }

        /* alerts */
        .pk-alert { margin-top: 20px; border-radius: 13px; overflow: hidden; animation: pkUp .25s ease; }
        .pk-abar { height: 3px; }
        .pk-abar.danger  { background: linear-gradient(90deg,#ef4444,#f43f5e); }
        .pk-abar.warning { background: linear-gradient(90deg, var(--gold-d), var(--gold)); }
        .pk-ain { display: flex; align-items: flex-start; gap: 12px; padding: 15px 18px; }
        .pk-aibox { width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
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

        .pk-foot { text-align: center; font-size: 11px; color: #ccc; margin-top: 20px; letter-spacing: .02em; }

        @keyframes pkUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pkSpin { to { transform: rotate(360deg); } }
        .pk-spin { animation: pkSpin .8s linear infinite; display: inline-block; }
      `}</style>

      <div className="pk">
        {/* ── HERO ── */}
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
                  style={{ width: 28, height: 28, color: "var(--gold)" }}
                />
              </div>
              <div>
                <div className="pk-pill">
                  <Shield
                    style={{
                      width: 10,
                      height: 10,
                      color: "rgba(221,197,136,0.6)",
                    }}
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

        {/* ── CONTENT ── */}
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
                {/* Kelas */}
                <div className="pk-field">
                  <label className="pk-lbl">
                    Kelas <span className="r">*</span>
                  </label>
                  <Select value={kelas} onValueChange={setKelas}>
                    <SelectTrigger
                      style={{
                        height: 44,
                        borderRadius: 10,
                        border: "1.5px solid #eae7de",
                        background: "#fafaf8",
                        fontSize: 14,
                      }}
                    >
                      <SelectValue placeholder="Pilih kelas Anda" />
                    </SelectTrigger>
                    <SelectContent
                      style={{ borderRadius: 12, border: "1px solid #eae7de" }}
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

                {/* Nomor Induk */}
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
                        border: "1.5px solid #eae7de",
                        background: "#fafaf8",
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

                {/* Tanggal Lahir */}
                <div className="pk-field" style={{ marginBottom: 24 }}>
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
                      border: "1.5px solid #eae7de",
                      background: "#fafaf8",
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
                      <strong style={{ color: "#555" }}>Contoh:</strong> 17
                      Agustus 2005{" "}
                      <span style={{ color: "#ddd", margin: "0 4px" }}>→</span>
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

              {/* ── RESULT CARD ── */}
              {status === "found" && hasil && (
                <div className="pk-res">
                  <div className="pk-sep" />

                  {/* wrapper for PDF capture */}
                  <div
                    ref={printRef}
                    style={{ background: "#fff", borderRadius: 20, padding: 4 }}
                  >
                    <div
                      className={`pk-cert ${hasil.status_lulus ? "ok" : "no"}`}
                    >
                      {/* top color bar */}
                      <div
                        className={`pk-cert-bar ${hasil.status_lulus ? "ok" : "no"}`}
                      />

                      {/* decorative watermark circle */}
                      <div className="pk-cert-ornament">
                        <div
                          className={`pk-cert-ornament-inner ${hasil.status_lulus ? "ok" : "no"}`}
                        />
                      </div>

                      <div className="pk-cert-body">
                        {/* status row */}
                        <div className="pk-status-row">
                          <div
                            className={`pk-status-icon ${hasil.status_lulus ? "ok" : "no"}`}
                          >
                            {hasil.status_lulus ? (
                              <CheckCircle2
                                style={{
                                  width: 32,
                                  height: 32,
                                  color: "#c9a96e",
                                }}
                              />
                            ) : (
                              <XCircle
                                style={{
                                  width: 32,
                                  height: 32,
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
                            <p className="pk-year">
                              Tahun Pelajaran {hasil.tahun_ajaran}
                            </p>
                          </div>
                        </div>

                        {/* name block */}
                        <div
                          className={`pk-name-block ${hasil.status_lulus ? "ok" : "no"}`}
                        >
                          <p
                            className={`pk-name-eyebrow ${hasil.status_lulus ? "ok" : "no"}`}
                          >
                            Nama Siswa
                          </p>
                          <p
                            className={`pk-name-value ${hasil.status_lulus ? "ok" : "no"}`}
                          >
                            {hasil.nama_siswa}
                          </p>
                        </div>

                        {/* detail grid */}
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
                                className={`pk-dicon-wrap ${hasil.status_lulus ? "ok" : "no"}`}
                              >
                                <Icon
                                  style={{
                                    width: 15,
                                    height: 15,
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
                            style={{ marginTop: 8 }}
                          >
                            <p className="pk-klbl">Keterangan</p>
                            <p className="pk-kval">"{hasil.keterangan}"</p>
                          </div>
                        )}
                      </div>

                      {/* certificate footer */}
                      <div
                        className={`pk-cert-footer ${hasil.status_lulus ? "ok" : "no"}`}
                      >
                        <span
                          className={`pk-cert-foot-txt ${hasil.status_lulus ? "ok" : "no"}`}
                        >
                          {hasil.status_lulus
                            ? "Dokumen Resmi Kelulusan"
                            : "Dokumen Hasil Evaluasi"}
                        </span>
                        <span className="pk-cert-foot-brand">
                          Perguruan WR Supratman
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* action buttons — tidak masuk PDF */}
                  <div className="pk-actions">
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
                          <Download style={{ width: 16, height: 16 }} /> Simpan
                          sebagai PDF
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

              {/* not found */}
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

              {/* locked */}
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
