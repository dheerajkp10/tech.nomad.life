import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/portfolio", label: "Portfolio", icon: "💼" },
  { to: "/analysis", label: "Analysis", icon: "🔍" },
  { to: "/backtesting", label: "Backtesting", icon: "⏪" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col py-6 px-3">
      <div className="mb-8 px-3">
        <h1 className="text-xl font-bold text-blue-400">📈 StockPilot</h1>
        <p className="text-xs text-gray-500 mt-1">Algo Trading Dashboard</p>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
