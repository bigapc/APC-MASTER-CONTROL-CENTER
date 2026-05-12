import { Map, MapPin, Radio, ShieldCheck } from "lucide-react";

const zones = [
  { name: "SafeConnect Exchange Zone", app: "SafeConnect", status: "Prepared", location: "Private / Hidden" },
  { name: "Community Safety Zone", app: "CommunitySafeConnect", status: "Prepared", location: "Community Region" },
  { name: "CSC 2.0 Dispatch Zone", app: "CommunitySafeConnect-CSC-2.0", status: "Prepared", location: "Dispatcher Region" },
];

export default function LiveMapPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Live Map Monitor</div>
        <h1 className="mt-4 text-4xl font-black text-white">APC Live Map & Dispatch Monitor</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Prepared for Mapbox live tracking, courier zones, dispatcher visibility, and safety exchange monitoring.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <div className="apc-card p-6">
          <div className="flex min-h-[440px] items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-[radial-gradient(circle_at_center,rgba(193,18,31,.12),transparent_35%),linear-gradient(135deg,#18181b,#09090b)] text-white">
            <div className="max-w-md text-center">
              <Map className="mx-auto text-red-400" size={58} />
              <h2 className="mt-5 text-3xl font-black">Mapbox Dispatch Surface</h2>
              <p className="mt-3 leading-7 text-zinc-300">
                Add NEXT_PUBLIC_MAPBOX_TOKEN later to turn this into a live dispatch and courier tracking map.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="apc-card p-6"><Radio className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Live Dispatches</p><p className="mt-3 text-4xl font-black">0</p></div>
          <div className="apc-card p-6"><MapPin className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Tracked Zones</p><p className="mt-3 text-4xl font-black">3</p></div>
          <div className="apc-card p-6"><ShieldCheck className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Safety Status</p><p className="mt-3 text-4xl font-black">Ready</p></div>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Dispatch Zones</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {zones.map((zone) => (
            <div key={zone.name} className="rounded-2xl bg-zinc-50 p-5">
              <p className="font-black">{zone.name}</p>
              <p className="mt-1 text-sm text-zinc-600">{zone.app}</p>
              <p className="mt-3 text-sm"><strong>Location:</strong> {zone.location}</p>
              <span className="apc-status apc-status-green mt-3">{zone.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
