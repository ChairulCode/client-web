import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRequest, putRequest } from "../utils/api-call";
import { X } from "lucide-react";
import { Button } from "../components/ui/button/button";
import { Input } from "../components/ui/input/input";
import { Label } from "../components/ui/label/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select/select";
import CustomToast from "./CustomToast";

interface DetailModalProps {
  id: string | null;
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

interface FormData {
  namaSiswa: string;
  kelas: string;
  telpSiswa: string;
  statusPendaftaran: string;
  // tambahkan field lain sesuai kebutuhan
}

const DetailModal = ({ id, open, onClose, refetch }: DetailModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    namaSiswa: "",
    kelas: "",
    telpSiswa: "",
    statusPendaftaran: "pending",
  });
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch detail data
  const { data, isLoading } = useQuery({
    queryKey: ["pendaftaran-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await getRequest(`/pendaftaran/${id}`);
      return response.data;
    },
    enabled: !!id && open,
  });

  // Set form data when data is loaded
  useEffect(() => {
    if (data) {
      setFormData({
        namaSiswa: data.namaSiswa || "",
        kelas: data.kelas || "",
        telpSiswa: data.telpSiswa || "",
        statusPendaftaran: data.statusPendaftaran || "pending",
      });
    }
  }, [data]);

  // Mutation untuk update data
  const updateMutation = useMutation({
    mutationFn: async (dataToUpdate: FormData) => {
      return await putRequest(`/pendaftaran/${id}`, dataToUpdate);
    },
    onSuccess: () => {
      setToast({ type: "success", message: "Data berhasil diperbarui!" });
      refetch();

      // Reset form setelah 1.5 detik
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    },
    onError: (error: any) => {
      setToast({
        type: "error",
        message: error.response?.data?.message || "Gagal memperbarui data!",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      namaSiswa: "",
      kelas: "",
      telpSiswa: "",
      statusPendaftaran: "pending",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <CustomToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Detail Pendaftaran</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nama Siswa */}
              <div>
                <Label htmlFor="namaSiswa">Nama Siswa</Label>
                <Input
                  id="namaSiswa"
                  value={formData.namaSiswa}
                  onChange={(e) =>
                    setFormData({ ...formData, namaSiswa: e.target.value })
                  }
                  required
                />
              </div>

              {/* Kelas */}
              <div>
                <Label htmlFor="kelas">Kelas</Label>
                <Select
                  value={formData.kelas}
                  onValueChange={(value) =>
                    setFormData({ ...formData, kelas: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="TK A">TK A</SelectItem>
                    <SelectItem value="TK B">TK B</SelectItem>
                    <SelectItem value="SD Kelas I">SD Kelas I</SelectItem>
                    <SelectItem value="SMP Kelas VII">SMP Kelas VII</SelectItem>
                    <SelectItem value="SMA Kelas X">SMA Kelas X</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Telepon */}
              <div>
                <Label htmlFor="telpSiswa">Telepon</Label>
                <Input
                  id="telpSiswa"
                  value={formData.telpSiswa}
                  onChange={(e) =>
                    setFormData({ ...formData, telpSiswa: e.target.value })
                  }
                  required
                />
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status Pendaftaran</Label>
                <Select
                  value={formData.statusPendaftaran}
                  onValueChange={(value) =>
                    setFormData({ ...formData, statusPendaftaran: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu Verifikasi</SelectItem>
                    <SelectItem value="approved">Diterima</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={updateMutation.isPending}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default DetailModal;
