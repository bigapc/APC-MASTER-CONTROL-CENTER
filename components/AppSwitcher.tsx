const apps = [
  "SafeConnect",
  "CommunitySafeConnect",
  "CSC 2.0",
];

export default function AppSwitcher() {
  return (
    <div className="apc-card p-6">
      <h2 className="text-xl font-black">
        Connected Platforms
      </h2>

      <div className="mt-4 space-y-3">
        {apps.map((app) => (
          <div
            key={app}
            className="rounded-xl bg-zinc-50 p-4"
          >
            {app}
          </div>
        ))}
      </div>
    </div>
  );
}
