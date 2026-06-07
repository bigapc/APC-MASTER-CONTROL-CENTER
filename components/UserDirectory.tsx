const users = [
  {
    name: "Darrell Armstrong",
    role: "Super Admin",
  },
  {
    name: "Dispatcher Alpha",
    role: "Dispatcher",
  },
];

export default function UserDirectory() {
  return (
    <div className="apc-card p-6">
      <h2 className="text-2xl font-black">
        User Directory
      </h2>

      <div className="mt-5 space-y-3">
        {users.map((user) => (
          <div
            key={user.name}
            className="rounded-xl bg-zinc-50 p-4"
          >
            <p className="font-black">
              {user.name}
            </p>

            <p className="text-sm text-zinc-600">
              {user.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
