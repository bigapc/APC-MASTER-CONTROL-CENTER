import { AlertTriangle } from "lucide-react";
import { alertsCenterItems } from "@/lib/demoData";

export default function AlertsCenter() {
  return (
    <div className="apc-card p-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="text-[#c1121f]" />
        <h2 className="text-2xl font-black">Alerts Center</h2>
      </div>

      <div className="mt-5 space-y-3">
        {alertsCenterItems.map((alert) => (
          <div key={alert.title} className="rounded-xl bg-zinc-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-black">{alert.title}</p>
              <span className="apc-status apc-status-black">{alert.severity}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">{alert.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
