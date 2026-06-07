interface Props {
  name: string;
  status: string;
}

export default function AppHealthCard({
  name,
  status,
}: Props) {
  return (
    <div className="apc-card p-5">
      <h3 className="font-black">
        {name}
      </h3>

      <p className="mt-2 text-sm">
        Status: {status}
      </p>
    </div>
  );
}
