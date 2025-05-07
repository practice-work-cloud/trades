import { X, CheckCircle } from "lucide-react";
import { useEffect } from "react";

interface NotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function Notification({ show, message, onClose }: NotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  
  if (!show) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-muted shadow-lg rounded-md px-4 py-3 flex items-center z-50 animate-in fade-in slide-in-from-top-5">
      <CheckCircle className="h-5 w-5 text-secondary mr-2" />
      <span>{message}</span>
      <button className="ml-3 text-muted-foreground hover:text-foreground" onClick={onClose}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
