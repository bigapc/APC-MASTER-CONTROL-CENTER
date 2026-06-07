import { getDataSourceStatus } from "@/lib/supabaseAdapter";

interface DataSourceBadgeProps {
  className?: string;
}

export default function DataSourceBadge({ className = "" }: DataSourceBadgeProps) {
  const status = getDataSourceStatus();

  return (
    <div className={className}>
      <span
        className={
          status.source === "live"
            ? "apc-status apc-status-green"
            : "apc-status apc-status-yellow"
        }
      >
        {status.label}
      </span>
    </div>
  );
}
