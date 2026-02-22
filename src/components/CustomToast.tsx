import { CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  type: "success" | "error";
  message: string;
  duration?: number;
  onClose: () => void;
}

const CustomToast = ({
  type,
  message,
  duration = 3000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right-5 duration-300">
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default CustomToast;
