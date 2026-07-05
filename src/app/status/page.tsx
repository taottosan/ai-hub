export default function StatusPage() {
  const data = {
    version: "v1.0.0",
    providers: 6,
    interfaces: 2,
    tests: 161,
    e2e: 20,
    adrs: 12,
    build: "2026-07-04",
    commit: "525f771",
    health: "Healthy",
    uptime: "99.99%",
    latency: "18ms",
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#58a6ff] mb-2">🟢 System Status</h1>
        <p className="text-[#8b949e] mb-8">Memory Platform — AI Operations Portal</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: "Version", value: data.version },
            { label: "Providers", value: data.providers },
            { label: "Interfaces", value: data.interfaces },
            { label: "Tests", value: `${data.tests}/${data.tests}` },
            { label: "E2E", value: `${data.e2e}/${data.e2e}` },
            { label: "ADRs", value: data.adrs },
            { label: "Health", value: data.health },
            { label: "Latency", value: data.latency },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
              <div className="text-[#8b949e] text-sm">{label}</div>
              <div className="text-2xl font-bold text-[#f0f6fc]">{value}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
          <h2 className="text-lg font-bold text-[#58a6ff] mb-3">Release Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[#8b949e]">Build</span><span>{data.build}</span></div>
            <div className="flex justify-between"><span className="text-[#8b949e]">Commit</span><span className="font-mono">{data.commit}</span></div>
            <div className="flex justify-between"><span className="text-[#8b949e]">Uptime</span><span>{data.uptime}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
