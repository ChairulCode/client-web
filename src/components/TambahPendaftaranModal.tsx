import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postRequest } from "../utils/api-call";
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

interface TambahModalProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const TambahPendaftaranModal = ({
  open,
  onClose,
  refetch,
}: TambahModalProps) => {
  const initialFormData = {
    namaSiswa: "",
    kelas: "",
    telpSiswa: "",
    statusPendaftaran: "pending",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await postRequest("/pendaftaran", data);
    },
    onSuccess: () => {
      setToast({ type: "success", message: "Data berhasil dikirim!" });
      refetch();

      // Reset form dan close modal setelah 1.5 detik
      setTimeout(() => {
        setFormData(initialFormData);
        onClose();
      }, 1500);
    },
    onError: (error: any) => {
      setToast({
        type: "error",
        message: error.response?.data?.message || "Gagal mengirim data!",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {toast && (
        <CustomToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Tambah Pendaftaran Baru</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createMutation.isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Mengirim..." : "Kirim Data"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TambahPendaftaranModal;
