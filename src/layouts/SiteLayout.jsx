import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: "⌂",
  },
  {
    name: "My Tasks",
    path: "/tasks",
    icon: "▤",
  },
  {
    name: "Focus Timer",
    path: "/focus",
    icon: "◷",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "⚙",
  },
];

function SiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F0E8] md:flex">
      {/* Sidebar */}
      <aside className="w-full bg-[#29272D] text-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9C9EF] text-xl font-bold text-[#29272D]">
            S
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide">StudyFlow</h1>
            <p className="text-xs text-[#BDB5C5]">Your study workspace</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex gap-2 overflow-x-auto px-4 py-5 md:flex-col">
          <p className="hidden px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-[#928A99] md:block">
            Workspace
          </p>

          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#D9C9EF] text-[#29272D]"
                    : "text-[#D5CED9] hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="hidden border-t border-white/10 px-6 py-5 md:block">
          <p className="text-xs leading-5 text-[#BDB5C5]">
            Plan with purpose.
            <br />
            Learn at your own pace.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[#E8E0D8] bg-[#F5F0E8] px-5 sm:px-8">
          <p className="text-sm font-medium text-[#756F78]">My workspace</p>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7DDF0] text-sm font-bold text-[#51445D]">
            S
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

export default SiteLayout;
