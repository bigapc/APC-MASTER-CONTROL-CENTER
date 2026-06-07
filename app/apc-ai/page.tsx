export default function APCAIPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">
          APC Intelligence
        </div>

        <h1 className="mt-4 text-4xl font-black text-white">
          APC Command AI
        </h1>

        <p className="mt-4 text-zinc-300">
          Future AI assistant for APC operations,
          dispatching, reporting and analytics.
        </p>
      </section>

      <div className="apc-card p-8">
        <textarea
          className="w-full rounded-xl border p-4"
          rows={8}
          placeholder="Ask APC Command AI..."
        />
      </div>
    </div>
  );
}
