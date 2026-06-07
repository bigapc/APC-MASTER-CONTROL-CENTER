const checklist = [
  "Review incidents",
  "Review dispatcher queue",
  "Review user registrations",
  "Review platform health",
  "Review agency activity",
  "Review notifications",
];

export default function OperationalChecklist() {
  return (
    <div className="apc-card p-6">
      <h2 className="text-2xl font-black">
        Daily Operations Checklist
      </h2>

      <div className="mt-5 space-y-3">
        {checklist.map((item) => (
          <label
            key={item}
            className="flex items-center gap-3"
          >
            <input type="checkbox" />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}
