import { NavLink, useLocation } from "react-router-dom";

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
    name: "Focus Room",
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
  const location = useLocation();

  const currentPage =
    navigationItems.find((item) => item.path === location.pathname)?.name ||
    "Page not found";

  return (
    <div className="min-h-screen bg-[#F7F3EE] md:flex">
      {/* Sidebar */}
      <aside className="flex w-full flex-col bg-[#302B32] text-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C8795D] text-xl font-bold text-white shadow-lg">
            H
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide">HubNest</h1>
            <p className="text-xs text-[#C9BDB8]">Your personal workspace</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex gap-2 overflow-x-auto px-4 py-5 md:flex-1 md:flex-col">
          <p className="hidden px-3 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#A99D98] md:block">
            Workspace
          </p>

          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#C8795D] text-white shadow-md"
                    : "text-[#D4CAC5] hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="flex h-6 w-6 items-center justify-center text-lg">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar bottom section */}
        <div className="hidden border-t border-white/10 p-5 md:block">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">
              Keep moving forward.
            </p>

            <p className="mt-2 text-xs leading-5 text-[#C9BDB8]">
              Small steps every day create meaningful progress.
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-[#A99D98]">
            © 2026 HubNest
          </p>
        </div>
      </aside>

      {/* Main workspace */}
      <div className="min-w-0 flex-1">
        {/* Top header */}
        <header className="flex min-h-[76px] items-center justify-between border-b border-[#E8DED6] bg-white px-5 sm:px-8 lg:px-10">
          <div>
            <p className="text-xs font-medium text-[#A18F86]">
              HUBNEST WORKSPACE
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#302B32]">
              {currentPage}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#302B32]">
                Your workspace
              </p>

              <p className="text-xs text-[#93857E]">Make today productive</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EADFD8] font-bold text-[#8D5744]">
              H
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

export default SiteLayout;
