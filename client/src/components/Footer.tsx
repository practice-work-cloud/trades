import { Cloud } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card px-6 py-3 text-sm text-muted-foreground flex justify-between items-center">
      <div>&copy; {new Date().getFullYear()} Upstox Trading Dashboard</div>
      <div className="flex items-center">
        <span className="mr-2">Powered by</span>
        <span className="text-sm font-medium">AWS</span>
        <Cloud className="h-4 w-4 ml-1" />
      </div>
    </footer>
  );
}
