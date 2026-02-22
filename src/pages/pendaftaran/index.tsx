import { postRequest } from "../../utils/api-call";
import { useState } from "react";
import {
  User,
  BookOpen,
  Send,
  CheckCircle,
  Upload,
  Users,
  Heart,
} from "lucide-react";
import Navbar from "../../components/navbar/index";
import "./pendaftaran.css";
import Footer from "../../components/footer/index";
import { Button } from "../../components/ui/button/button";
import { Input } from "../../components/ui/input/input";
import { Label } from "../../components/ui/label/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select/select";
import { Textarea } from "../../components/ui/textarea/textarea";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../components/ui/radio-group/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card/card";
import CustomToast from "../../components/CustomToast";
import Swal from "sweetalert2";

const Pendaftaran = () => {
  // Initial form data untuk keperluan reset
  const initialFormData = {
    // Data Siswa
    namaSiswa: "",
    kelas: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    belajarAgama: "",
    golonganDarah: "",
    anakKe: "",
    jumlahSaudara: "",
    status: "",
    alamatSiswa: "",
    telpSiswa: "",
    tinggalBersama: "",
    lulusanDariSekolah: "",
    nisn: "",

    // Ijazah (khusus SMP/SMA)
    nomorIjazah: "",
    tglIjazah: "",
    tahunIjazah: "",
    jumlahNilaiUS: "",
    pindahanDariSekolah: "",
    alamatSekolahAsal: "",

    // Data Ayah
    namaAyah: "",
    tempatLahirAyah: "",
    tanggalLahirAyah: "",
    agamaAyah: "",
    pendidikanAyah: "",
    alamatAyah: "",
    pekerjaanAyah: "",
    telpAyah: "",
    emailOrangTua: "",

    // Data Ibu
    namaIbu: "",
    tempatLahirIbu: "",
    tanggalLahirIbu: "",
    agamaIbu: "",
    pendidikanIbu: "",
    alamatIbu: "",
    pekerjaanIbu: "",
    telpIbu: "",
  };

  const initialFiles = {
    akteLahir: null as File | null,
    kartuKeluarga: null as File | null,
    buktiTransfer: null as File | null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [files, setFiles] = useState(initialFiles);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk toast notification
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      // Validasi format file
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        const fieldNames: { [key: string]: string } = {
          akteLahir: "Akte Lahir",
          kartuKeluarga: "Kartu Keluarga",
          buktiTransfer: "Bukti Transfer",
        };

        setToast({
          type: "error",
          message: `Gagal: Format file ${fieldNames[field]} tidak valid. Gunakan PDF, JPG, atau PNG.`,
        });

        const fileInput = document.getElementById(field) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        setFiles((prev) => ({ ...prev, [field]: null }));
        return;
      }

      // Validasi ukuran file
      const maxSize = 2 * 1024 * 1024; // 2MB dalam bytes
      if (file.size > maxSize) {
        const fieldNames: { [key: string]: string } = {
          akteLahir: "Akte Lahir",
          kartuKeluarga: "Kartu Keluarga",
          buktiTransfer: "Bukti Transfer",
        };

        setToast({
          type: "error",
          message: `Gagal: Ukuran file ${fieldNames[field]} melebihi 2MB (${(file.size / 1024 / 1024).toFixed(2)} MB). Silakan kompres file Anda.`,
        });

        const fileInput = document.getElementById(field) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        setFiles((prev) => ({ ...prev, [field]: null }));
        return;
      }
    }

    // Jika valid atau file dihapus, update state seperti biasa
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  // Fungsi untuk reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setFiles(initialFiles);

    // Reset file inputs secara manual
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input: any) => {
      input.value = "";
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== SUBMIT STARTED ===");

    // Validasi file sebelum submit
    if (!files.akteLahir || !files.kartuKeluarga || !files.buktiTransfer) {
      setToast({
        type: "error",
        message: "Gagal: Pastikan semua dokumen telah diupload.",
      });
      return;
    }

    // Validasi ulang ukuran file
    const fileEntries = Object.entries(files) as [
      keyof typeof files,
      File | null,
    ][];
    for (const [key, file] of fileEntries) {
      if (file && file.size > 2 * 1024 * 1024) {
        const fieldNames = {
          akteLahir: "Akte Lahir",
          kartuKeluarga: "Kartu Keluarga",
          buktiTransfer: "Bukti Transfer",
        };
        setToast({
          type: "error",
          message: `Gagal: File ${fieldNames[key]} melebihi batas 2MB.`,
        });
        return;
      }
    }

    setIsSubmitting(true);

    const data = new FormData();

    // Masukkan semua field teks
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key as keyof typeof formData]);
    });

    // Masukkan file fisik
    if (files.akteLahir) data.append("akteLahir", files.akteLahir);
    if (files.kartuKeluarga) data.append("kartuKeluarga", files.kartuKeluarga);
    if (files.buktiTransfer) data.append("buktiTransfer", files.buktiTransfer);

    try {
      console.log("Sending request to /pendaftaran...");

      const response = await postRequest("/pendaftaran", data);

      console.log("Full Response:", response);

      // Tampilkan SweetAlert sukses
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Pendaftaran Anda telah diterima oleh Admin dan akan segera diproses.",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      });

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Reset form
      resetForm();

      // Set submitted back to false setelah beberapa detik
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error: any) {
      console.error("=== ERROR CAUGHT ===");
      console.error("Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal mengirim data. Silakan coba lagi!";

      console.log("Error message:", errorMessage);

      // Tampilkan SweetAlert error
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: errorMessage,
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      console.log("Setting isSubmitting to false");
      setIsSubmitting(false);
      console.log("=== SUBMIT ENDED ===");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <CustomToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <main className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4"></div>
            <h1 className="text-4xl font-bold text-foreground mb-2 title-form ">
              Form Pendaftaran Online WR Supratman
            </h1>
            <p className="text-sm text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
              Khusus mendaftar di Perguruan WR Supratman 1.
            </p>
            <p className="text-sm text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
              Pendaftaran online dibuka untuk kelas PG, TK, SD kelas I, SMP
              kelas VII, dan SMA kelas X.
            </p>
          </div>

          {/* Success Message */}
          {submitted && (
            <Card className="mb-6 border-green-500 bg-green-50">
              <CardContent className="flex items-center gap-3 py-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <p className="text-green-800 font-medium">
                  Pendaftaran Berhasil Dikirim!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Important Information */}
          <Card className="mb-8 border-accent bg-accent/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-accent-foreground text-lg font-semibold text-center">
                Informasi Pendaftaran Siswa Baru
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-6 md:p-8">
              {/* Hero Section */}
              <div className="text-center space-y-3 pb-6 border-b-2 border-primary/20">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary-accent/10 px-4 py-2 rounded-full">
                  <span className="text-2xl">🎓</span>
                  <span className="text-sm font-semibold text-primary tracking-wide uppercase">
                    TP 2026-2027
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-accent-foreground tracking-tight">
                  Pendaftaran Siswa Baru Resmi Dibuka!
                </h3>
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
                  ⚡ Free Early Bird Registration
                </div>
                <p className="text-lg text-muted-foreground font-medium">
                  Ayo bergabung bersama kami!
                </p>
              </div>

              {/* 1. Pendaftaran Online */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-primary-accent/30 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-accent rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h4 className="text-xl font-bold text-accent-foreground">
                      1. Pendaftaran Online
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Pendaftaran online tersedia untuk jenjang{" "}
                      <strong className="text-accent-foreground">
                        PG, TK, SD kelas I, SMP kelas VII, dan SMA kelas X
                      </strong>
                      .
                    </p>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-l-4 border-primary-accent">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Untuk mutasi</strong> (SD kelas II–VI, SMP
                        kelas VIII–IX, SMA kelas XI–XII), silakan datang
                        langsung ke sekolah dengan membawa{" "}
                        <strong>rapor asli</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Persyaratan */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-success/30 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-success rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h4 className="text-xl font-bold text-accent-foreground">
                      2. Persyaratan Mudah
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3">
                        <span className="text-lg">✓</span>
                        <p className="text-muted-foreground">
                          Bersedia mematuhi seluruh peraturan dan tata tertib
                          sekolah
                        </p>
                      </div>
                      <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3">
                        <span className="text-lg">✓</span>
                        <p className="text-muted-foreground">
                          Tidak merokok, tidak mengonsumsi minuman keras, dan
                          tidak terlibat narkoba
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Dokumen Upload */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300/30 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h4 className="text-xl font-bold text-accent-foreground">
                      3. Dokumen yang Perlu Diupload
                    </h4>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3">
                        <span className="text-lg">📋</span>
                        <p className="text-muted-foreground">
                          Akte Kelahiran siswa
                        </p>
                      </div>
                      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3">
                        <span className="text-lg">👨‍👩‍👧‍👦</span>
                        <p className="text-muted-foreground">Kartu Keluarga</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3">
                        <span className="text-lg">💳</span>
                        <p className="text-muted-foreground">
                          Bukti transfer uang sekolah Juli 2026
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4">
                      <p className="text-sm text-amber-800 leading-relaxed">
                        <strong>⚠️ Catatan:</strong> Uang sekolah bulan Juli
                        2026 masih menunggu keputusan Yayasan. Untuk sementara,
                        pembayaran mengikuti tarif tahun berjalan. Setelah tarif
                        baru ditetapkan, selisih agar dibayarkan kemudian.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Pembayaran */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-300/30 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">🏦</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <h4 className="text-xl font-bold text-accent-foreground">
                      4. Rekening Pembayaran
                    </h4>
                    <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-primary">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-2xl font-bold text-white">
                            BNI
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Nomor Rekening
                          </p>
                          <p className="text-2xl font-bold text-accent-foreground tracking-wider">
                            0296142991
                          </p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-primary/10 to-primary-accent/10 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">
                          Atas Nama
                        </p>
                        <p className="text-lg font-bold text-accent-foreground">
                          SMA WR Supratman 1
                        </p>
                      </div>
                    </div>
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                      <p className="text-sm text-red-700 font-semibold text-center">
                        ⚠️ Mohon diperhatikan: Dana yang ditransfer tidak dapat
                        dikembalikan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Biaya Sekolah */}
              <div className="bg-gradient-to-br from-primary/5 to-primary-accent/5 rounded-2xl p-6 border-2 border-primary shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <h4 className="text-xl font-bold text-accent-foreground">
                      5. Biaya Sekolah Juli 2025
                    </h4>
                    <div className="grid gap-3">
                      {/* PG, TK */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-primary/20 hover:border-primary transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-accent-foreground">
                              PG, TK A & B
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                <span>🍽️</span> Include sarapan
                              </span>
                            </p>
                          </div>
                          <p className="text-xl font-bold text-primary">
                            Rp 700.000
                          </p>
                        </div>
                      </div>

                      {/* SD */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-primary/20 hover:border-primary transition-colors">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-accent-foreground">
                              SD Kelas 1–2
                            </p>
                            <p className="text-xl font-bold text-primary">
                              Rp 580.000
                            </p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <p className="font-semibold text-accent-foreground">
                              SD Kelas 3–6
                            </p>
                            <p className="text-xl font-bold text-primary">
                              Rp 620.000
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SMP */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-primary/20 hover:border-primary transition-colors">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-accent-foreground">
                            SMP
                          </p>
                          <p className="text-xl font-bold text-primary">
                            Rp 770.000
                          </p>
                        </div>
                      </div>

                      {/* SMA */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-primary/20 hover:border-primary transition-colors">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-accent-foreground">
                            SMA
                          </p>
                          <p className="text-xl font-bold text-primary">
                            Rp 800.000
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center pt-6">
                <div className="inline-block font-black  rounded-2xl p-6  btn-wr-suprtaman">
                  <p className="text-black text-lg font-semibold mb-2">
                    🎯 Jangan lewatkan kesempatan ini!
                  </p>
                  <p className="text-black text-sm">
                    Daftar sekarang dan raih masa depan gemilang bersama kami
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Data Siswa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Data Siswa
                </CardTitle>
                <CardDescription>
                  Lengkapi informasi data siswa dengan benar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="namaSiswa">Nama Siswa *</Label>
                  <Input
                    id="namaSiswa"
                    value={formData.namaSiswa}
                    onChange={(e) => handleChange("namaSiswa", e.target.value)}
                    placeholder="Masukkan nama lengkap siswa"
                    required
                    style={{
                      border: "2px solid #e5e7eb",
                      padding: "1rem 1.25rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "white",
                      fontSize: "1rem",
                      color: "black",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="kelas">Kelas *</Label>
                  <Select
                    value={formData.kelas}
                    onValueChange={(value) => handleChange("kelas", value)}
                    required
                  >
                    <SelectTrigger className="select-trigger">
                      <SelectValue
                        placeholder="Pilih kelas"
                        className="select-value"
                      />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      <SelectItem value="PG" className="select-item">
                        PG
                      </SelectItem>
                      <SelectItem value="TK A" className="select-item">
                        TK A
                      </SelectItem>
                      <SelectItem value="TK B" className="select-item">
                        TK B
                      </SelectItem>
                      <SelectItem value="SD Kelas I" className="select-item">
                        SD Kelas I
                      </SelectItem>
                      <SelectItem value="SMP Kelas VII" className="select-item">
                        SMP Kelas VII
                      </SelectItem>
                      <SelectItem value="SMA Kelas X" className="select-item">
                        SMA Kelas X
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="tempatLahir">Tempat/tanggal lahir *</Label>
                    <Input
                      id="tempatLahir"
                      value={formData.tempatLahir}
                      onChange={(e) =>
                        handleChange("tempatLahir", e.target.value)
                      }
                      placeholder="Kota kelahiran"
                      required
                      style={{
                        border: "2px solid #e5e7eb",
                        padding: "1rem 1.25rem",
                        borderRadius: "0.75rem",
                        backgroundColor: "white",
                        fontSize: "1rem",
                        color: "black",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                    <Input
                      id="tanggalLahir"
                      type="date"
                      value={formData.tanggalLahir}
                      onChange={(e) =>
                        handleChange("tanggalLahir", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label>Jenis Kelamin *</Label>
                  <RadioGroup
                    value={formData.jenisKelamin}
                    onValueChange={(value) =>
                      handleChange("jenisKelamin", value)
                    }
                    className="radio-group"
                    required
                  >
                    <div
                      className="radio-group-item"
                      data-state={
                        formData.jenisKelamin === "laki-laki" ? "checked" : ""
                      }
                    >
                      <RadioGroupItem value="laki-laki" id="laki" />
                      <Label htmlFor="laki" className="radio-group-item-label">
                        Laki-laki
                      </Label>
                    </div>
                    <div
                      className="radio-group-item"
                      data-state={
                        formData.jenisKelamin === "perempuan" ? "checked" : ""
                      }
                    >
                      <RadioGroupItem value="perempuan" id="perempuan" />
                      <Label
                        htmlFor="perempuan"
                        className="radio-group-item-label"
                      >
                        Perempuan
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="belajarAgama">Belajar Agama *</Label>
                    <Select
                      value={formData.belajarAgama}
                      onValueChange={(value) =>
                        handleChange("belajarAgama", value)
                      }
                      required
                    >
                      <SelectTrigger className="select-trigger">
                        <SelectValue
                          placeholder="Pilih agama"
                          className="select-value"
                        />
                      </SelectTrigger>
                      <SelectContent className="select-content">
                        <SelectItem value="Islam" className="select-item">
                          Islam
                        </SelectItem>
                        <SelectItem value="Kristen" className="select-item">
                          Kristen
                        </SelectItem>
                        <SelectItem value="Katolik" className="select-item">
                          Katolik
                        </SelectItem>
                        <SelectItem value="Hindu" className="select-item">
                          Hindu
                        </SelectItem>
                        <SelectItem value="Buddha" className="select-item">
                          Buddha
                        </SelectItem>
                        <SelectItem value="Konghucu" className="select-item">
                          Konghucu
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="form-group">
                    <Label htmlFor="golonganDarah">Golongan Darah</Label>
                    <Select
                      value={formData.golonganDarah}
                      onValueChange={(value) =>
                        handleChange("golonganDarah", value)
                      }
                    >
                      <SelectTrigger className="select-trigger">
                        <SelectValue
                          placeholder="Pilih golongan darah"
                          className="select-value"
                        />
                      </SelectTrigger>
                      <SelectContent className="select-content">
                        <SelectItem value="O" className="select-item">
                          O
                        </SelectItem>
                        <SelectItem value="A" className="select-item">
                          A
                        </SelectItem>
                        <SelectItem value="B" className="select-item">
                          B
                        </SelectItem>
                        <SelectItem value="AB" className="select-item">
                          AB
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="anakKe">Anak Ke *</Label>
                    <Input
                      id="anakKe"
                      type="number"
                      value={formData.anakKe}
                      onChange={(e) => handleChange("anakKe", e.target.value)}
                      placeholder="Contoh: 1"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="jumlahSaudara">Jumlah Saudara *</Label>
                    <Input
                      id="jumlahSaudara"
                      type="number"
                      value={formData.jumlahSaudara}
                      onChange={(e) =>
                        handleChange("jumlahSaudara", e.target.value)
                      }
                      placeholder="Contoh: 2"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label>Status *</Label>
                  <RadioGroup
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                    className="radio-group radio-group-horizontal"
                    required
                  >
                    <div
                      className="radio-group-item"
                      data-state={
                        formData.status === "anak kandung" ? "checked" : ""
                      }
                    >
                      <RadioGroupItem value="anak kandung" id="kandung" />
                      <Label
                        htmlFor="kandung"
                        className="radio-group-item-label"
                      >
                        Anak Kandung
                      </Label>
                    </div>
                    <div
                      className="radio-group-item"
                      data-state={
                        formData.status === "anak tiri" ? "checked" : ""
                      }
                    >
                      <RadioGroupItem value="anak tiri" id="tiri" />
                      <Label htmlFor="tiri" className="radio-group-item-label">
                        Anak Tiri
                      </Label>
                    </div>
                    <div
                      className="radio-group-item"
                      data-state={
                        formData.status === "anak angkat" ? "checked" : ""
                      }
                    >
                      <RadioGroupItem value="anak angkat" id="angkat" />
                      <Label
                        htmlFor="angkat"
                        className="radio-group-item-label"
                      >
                        Anak Angkat
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="form-group">
                  <Label htmlFor="alamatSiswa">Alamat Siswa *</Label>
                  <Textarea
                    id="alamatSiswa"
                    value={formData.alamatSiswa}
                    onChange={(e) =>
                      handleChange("alamatSiswa", e.target.value)
                    }
                    placeholder="Masukkan alamat lengkap"
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="telpSiswa">Telepon/HP Siswa *</Label>
                  <Input
                    id="telpSiswa"
                    type="tel"
                    value={formData.telpSiswa}
                    onChange={(e) => handleChange("telpSiswa", e.target.value)}
                    placeholder="08xx xxxx xxxx"
                    required
                  />
                </div>

                <div className="form-group">
                  <Label>Tinggal Bersama *</Label>
                  <RadioGroup
                    value={formData.tinggalBersama}
                    onValueChange={(value) =>
                      handleChange("tinggalBersama", value)
                    }
                    className="radio-group radio-group-horizontal"
                    required
                  >
                    <div
                      className="radio-group-item"
                      data-state={
                        formData.tinggalBersama === "Orang Tua" ? "checked" : ""
                      }
                    >
                      <RadioGroupItem value="Orang Tua" id="orangtua" />
                      <Label
                        htmlFor="orangtua"
                        className="radio-group-item-label"
                      >
                        Orang Tua
                      </Label>
                    </div>
                    <div
                      className="radio-group-item"
                      data-state={
                        formData.tinggalBersama === "Wali" ? "checked" : ""
                      }
                    >
                      <RadioGroupItem value="Wali" id="wali" />
                      <Label htmlFor="wali" className="radio-group-item-label">
                        Wali
                      </Label>
                    </div>
                    <div
                      className="radio-group-item"
                      data-state={
                        formData.tinggalBersama === "Kost" ? "checked" : ""
                      }
                    >
                      <RadioGroupItem value="Kost" id="kost" />
                      <Label htmlFor="kost" className="radio-group-item-label">
                        Kost
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="form-group">
                  <Label htmlFor="lulusanDariSekolah">
                    Lulusan Dari Sekolah
                  </Label>
                  <Input
                    id="lulusanDariSekolah"
                    value={formData.lulusanDariSekolah}
                    onChange={(e) =>
                      handleChange("lulusanDariSekolah", e.target.value)
                    }
                    placeholder="Nama sekolah asal"
                    style={{
                      border: "2px solid #e5e7eb",
                      padding: "1rem 1.25rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "white",
                      fontSize: "1rem",
                      color: "black",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="nisn">
                    Nomor Induk Siswa Nasional (NISN)
                  </Label>
                  <Input
                    id="nisn"
                    value={formData.nisn}
                    onChange={(e) => handleChange("nisn", e.target.value)}
                    placeholder="Masukkan NISN"
                    style={{
                      border: "2px solid #e5e7eb",
                      padding: "1rem 1.25rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "white",
                      fontSize: "1rem",
                      color: "black",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ijazah (khusus SMP/SMA) */}
            {(formData.kelas === "SMP Kelas VII" ||
              formData.kelas === "SMA Kelas X") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Data Ijazah
                  </CardTitle>
                  <CardDescription>
                    Khusus untuk pendaftar SMP dan SMA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="form-group">
                    <Label htmlFor="nomorIjazah">Nomor Ijazah</Label>
                    <Input
                      id="nomorIjazah"
                      value={formData.nomorIjazah}
                      onChange={(e) =>
                        handleChange("nomorIjazah", e.target.value)
                      }
                      placeholder="Masukkan nomor ijazah"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label htmlFor="tglIjazah">Tanggal Ijazah</Label>
                      <Input
                        id="tglIjazah"
                        type="date"
                        value={formData.tglIjazah}
                        onChange={(e) =>
                          handleChange("tglIjazah", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="tahunIjazah">Tahun Ijazah</Label>
                      <Input
                        id="tahunIjazah"
                        type="number"
                        value={formData.tahunIjazah}
                        onChange={(e) =>
                          handleChange("tahunIjazah", e.target.value)
                        }
                        placeholder="Contoh: 2024"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <Label htmlFor="jumlahNilaiUS">
                      Jumlah Nilai Ujian Sekolah
                    </Label>
                    <Input
                      id="jumlahNilaiUS"
                      type="number"
                      value={formData.jumlahNilaiUS}
                      onChange={(e) =>
                        handleChange("jumlahNilaiUS", e.target.value)
                      }
                      placeholder="Total nilai US"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="pindahanDariSekolah">
                      Pindahan Dari Sekolah
                    </Label>
                    <Input
                      id="pindahanDariSekolah"
                      value={formData.pindahanDariSekolah}
                      onChange={(e) =>
                        handleChange("pindahanDariSekolah", e.target.value)
                      }
                      placeholder="Jika pindahan, sebutkan nama sekolah"
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="alamatSekolahAsal">
                      Alamat Sekolah Asal
                    </Label>
                    <Textarea
                      id="alamatSekolahAsal"
                      value={formData.alamatSekolahAsal}
                      onChange={(e) =>
                        handleChange("alamatSekolahAsal", e.target.value)
                      }
                      placeholder="Alamat lengkap sekolah asal"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data Ayah */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Data Ayah
                </CardTitle>
                <CardDescription>
                  Lengkapi informasi data ayah kandung/wali
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="namaAyah">Nama Ayah *</Label>
                  <Input
                    id="namaAyah"
                    value={formData.namaAyah}
                    onChange={(e) => handleChange("namaAyah", e.target.value)}
                    placeholder="Nama lengkap ayah"
                    style={{
                      border: "2px solid #e5e7eb",
                      padding: "1rem 1.25rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "white",
                      fontSize: "1rem",
                      color: "black",
                      transition: "all 0.3s ease",
                    }}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="tempatLahirAyah">
                      Tempat Tanggal Lahir *
                    </Label>
                    <Input
                      id="tempatLahirAyah"
                      value={formData.tempatLahirAyah}
                      onChange={(e) =>
                        handleChange("tempatLahirAyah", e.target.value)
                      }
                      placeholder="Kota kelahiran"
                      style={{
                        border: "2px solid #e5e7eb",
                        padding: "1rem 1.25rem",
                        borderRadius: "0.75rem",
                        backgroundColor: "white",
                        fontSize: "1rem",
                        color: "black",
                        transition: "all 0.3s ease",
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="tanggalLahirAyah">Tanggal Lahir *</Label>
                    <Input
                      id="tanggalLahirAyah"
                      type="date"
                      value={formData.tanggalLahirAyah}
                      onChange={(e) =>
                        handleChange("tanggalLahirAyah", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="agamaAyah">Agama *</Label>
                  <Select
                    value={formData.agamaAyah}
                    onValueChange={(value) => handleChange("agamaAyah", value)}
                    required
                  >
                    <SelectTrigger className="select-trigger">
                      <SelectValue
                        placeholder="Pilih agama"
                        className="select-value"
                      />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      <SelectItem value="Islam" className="select-item">
                        Islam
                      </SelectItem>
                      <SelectItem value="Kristen" className="select-item">
                        Kristen
                      </SelectItem>
                      <SelectItem value="Katolik" className="select-item">
                        Katolik
                      </SelectItem>
                      <SelectItem value="Hindu" className="select-item">
                        Hindu
                      </SelectItem>
                      <SelectItem value="Buddha" className="select-item">
                        Buddha
                      </SelectItem>
                      <SelectItem value="Konghucu" className="select-item">
                        Konghucu
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label htmlFor="pendidikanAyah">Pendidikan Tertinggi *</Label>
                  <Select
                    value={formData.pendidikanAyah}
                    onValueChange={(value) =>
                      handleChange("pendidikanAyah", value)
                    }
                    required
                  >
                    <SelectTrigger className="select-trigger">
                      <SelectValue
                        placeholder="Pilih pendidikan tertinggi"
                        className="select-value"
                      />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      <SelectItem value="SD" className="select-item">
                        SD
                      </SelectItem>
                      <SelectItem value="SMP" className="select-item">
                        SMP
                      </SelectItem>
                      <SelectItem value="SMA" className="select-item">
                        SMA
                      </SelectItem>
                      <SelectItem value="D3" className="select-item">
                        D3
                      </SelectItem>
                      <SelectItem value="S1" className="select-item">
                        S1
                      </SelectItem>
                      <SelectItem value="S2" className="select-item">
                        S2
                      </SelectItem>
                      <SelectItem value="S3" className="select-item">
                        S3
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label htmlFor="alamatAyah">Alamat *</Label>
                  <Textarea
                    id="alamatAyah"
                    value={formData.alamatAyah}
                    onChange={(e) => handleChange("alamatAyah", e.target.value)}
                    placeholder="Alamat lengkap"
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="pekerjaanAyah">Pekerjaan *</Label>
                  <Input
                    id="pekerjaanAyah"
                    value={formData.pekerjaanAyah}
                    onChange={(e) =>
                      handleChange("pekerjaanAyah", e.target.value)
                    }
                    placeholder="Pekerjaan saat ini"
                    style={{
                      border: "2px solid #e5e7eb",
                      padding: "1rem 1.25rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "white",
                      fontSize: "1rem",
                      color: "black",
                      transition: "all 0.3s ease",
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="telpAyah">Telepon/HP *</Label>
                  <Input
                    id="telpAyah"
                    type="tel"
                    value={formData.telpAyah}
                    onChange={(e) => handleChange("telpAyah", e.target.value)}
                    placeholder="08xx xxxx xxxx"
                    required
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="emailOrangTua">
                    Email Orang Tua (Untuk Notifikasi) *
                  </Label>
                  <Input
                    id="emailOrangTua"
                    type="email"
                    value={formData.emailOrangTua}
                    onChange={(e) =>
                      handleChange("emailOrangTua", e.target.value)
                    }
                    placeholder="contoh@email.com"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Ibu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Data Ibu
                </CardTitle>
                <CardDescription>
                  Lengkapi informasi data ibu kandung/wali
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="namaIbu">Nama Ibu *</Label>
                  <Input
                    id="namaIbu"
                    value={formData.namaIbu}
                    onChange={(e) => handleChange("namaIbu", e.target.value)}
                    placeholder="Nama lengkap ibu"
                    style={{
                      border: "2px solid #e5e7eb",
                      padding: "1rem 1.25rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "white",
                      fontSize: "1rem",
                      color: "black",
                      transition: "all 0.3s ease",
                    }}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="tempatLahirIbu">Tempat Lahir *</Label>
                    <Input
                      id="tempatLahirIbu"
                      value={formData.tempatLahirIbu}
                      onChange={(e) =>
                        handleChange("tempatLahirIbu", e.target.value)
                      }
                      placeholder="Kota kelahiran"
                      style={{
                        border: "2px solid #e5e7eb",
                        padding: "1rem 1.25rem",
                        borderRadius: "0.75rem",
                        backgroundColor: "white",
                        fontSize: "1rem",
                        color: "black",
                        transition: "all 0.3s ease",
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="tanggalLahirIbu">Tanggal Lahir *</Label>
                    <Input
                      id="tanggalLahirIbu"
                      type="date"
                      value={formData.tanggalLahirIbu}
                      onChange={(e) =>
                        handleChange("tanggalLahirIbu", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="agamaIbu">Agama *</Label>
                  <Select
                    value={formData.agamaIbu}
                    onValueChange={(value) => handleChange("agamaIbu", value)}
                    required
                  >
                    <SelectTrigger className="select-trigger">
                      <SelectValue
                        placeholder="Pilih agama"
                        className="select-value"
                      />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      <SelectItem value="Islam" className="select-item">
                        Islam
                      </SelectItem>
                      <SelectItem value="Kristen" className="select-item">
                        Kristen
                      </SelectItem>
                      <SelectItem value="Katolik" className="select-item">
                        Katolik
                      </SelectItem>
                      <SelectItem value="Hindu" className="select-item">
                        Hindu
                      </SelectItem>
                      <SelectItem value="Buddha" className="select-item">
                        Buddha
                      </SelectItem>
                      <SelectItem value="Konghucu" className="select-item">
                        Konghucu
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label htmlFor="pendidikanIbu">Pendidikan Tertinggi *</Label>
                  <Select
                    value={formData.pendidikanIbu}
                    onValueChange={(value) =>
                      handleChange("pendidikanIbu", value)
                    }
                    required
                  >
                    <SelectTrigger className="select-trigger">
                      <SelectValue
                        placeholder="Pilih pendidikan tertinggi"
                        className="select-value"
                      />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      <SelectItem value="SD" className="select-item">
                        SD
                      </SelectItem>
                      <SelectItem value="SMP" className="select-item">
                        SMP
                      </SelectItem>
                      <SelectItem value="SMA" className="select-item">
                        SMA
                      </SelectItem>
                      <SelectItem value="D3" className="select-item">
                        D3
                      </SelectItem>
                      <SelectItem value="S1" className="select-item">
                        S1
                      </SelectItem>
                      <SelectItem value="S2" className="select-item">
                        S2
                      </SelectItem>
                      <SelectItem value="S3" className="select-item">
                        S3
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label htmlFor="alamatIbu">Alamat *</Label>
                  <Textarea
                    id="alamatIbu"
                    value={formData.alamatIbu}
                    onChange={(e) => handleChange("alamatIbu", e.target.value)}
                    placeholder="Alamat lengkap"
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="pekerjaanIbu">Pekerjaan *</Label>
                  <Input
                    id="pekerjaanIbu"
                    value={formData.pekerjaanIbu}
                    onChange={(e) =>
                      handleChange("pekerjaanIbu", e.target.value)
                    }
                    placeholder="Pekerjaan saat ini"
                    style={{
                      border: "2px solid #e5e7eb",
                      padding: "1rem 1.25rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "white",
                      fontSize: "1rem",
                      color: "black",
                      transition: "all 0.3s ease",
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="telpIbu">Telepon/HP *</Label>
                  <Input
                    id="telpIbu"
                    type="tel"
                    value={formData.telpIbu}
                    onChange={(e) => handleChange("telpIbu", e.target.value)}
                    placeholder="08xx xxxx xxxx"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload Dokumen */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Dokumen
                </CardTitle>
                <CardDescription>
                  Upload dokumen persyaratan pendaftaran
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="akteLahir">Akte Lahir *</Label>
                  <Input
                    id="akteLahir"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange("akteLahir", e.target.files?.[0] || null)
                    }
                    required
                  />
                  {/* Indikator file berhasil diupload */}
                  {files.akteLahir && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {files.akteLahir.name} (
                        {(files.akteLahir.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${files.akteLahir ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    Format: PDF, JPG, PNG (Max 2MB)
                  </p>
                </div>

                <div className="form-group">
                  <Label htmlFor="kartuKeluarga">Kartu Keluarga *</Label>
                  <Input
                    id="kartuKeluarga"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(
                        "kartuKeluarga",
                        e.target.files?.[0] || null,
                      )
                    }
                    required
                  />
                  {files.kartuKeluarga && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {files.kartuKeluarga.name} (
                        {(files.kartuKeluarga.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
                      </span>
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${files.kartuKeluarga ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    Format: PDF, JPG, PNG (Max 2MB)
                  </p>
                </div>

                <div className="form-group">
                  <Label htmlFor="buktiTransfer">Bukti Transfer *</Label>
                  <Input
                    id="buktiTransfer"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(
                        "buktiTransfer",
                        e.target.files?.[0] || null,
                      )
                    }
                    required
                  />
                  {files.buktiTransfer && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {files.buktiTransfer.name} (
                        {(files.buktiTransfer.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
                      </span>
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${files.buktiTransfer ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    Format: PDF, JPG, PNG (Max 2MB)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="form-actions">
              <Button
                type="submit"
                size="lg"
                className="submit-button btn-wr-suprtaman"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Pendaftaran
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pendaftaran;
