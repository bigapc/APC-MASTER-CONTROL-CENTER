interface ExecutiveStatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export default function ExecutiveStatCard({
  title,
  value,
  description,
}: ExecutiveStatCardProps) {
  return (
    <div className="apc-card p-6">
      <p className="text-sm font-bold text-zinc-500">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-black">
        {value}
      </h2>

      {description && (
        <p className="mt-2 text-sm text-zinc-600">
          {description}
        </p>
      )}
    </div>
  );
}
