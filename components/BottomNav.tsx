import { NavLink } from "react-router-dom";
import { Home, Search, MessageCircleMore, User2 } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="mx-auto max-w-screen-sm">
        <ul className="grid grid-cols-4 bg-black/70 backdrop-blur-md border-t border-white/10">
          <NavItem to="/fan/home" label="Home" Icon={Home} />
          <NavItem to="/fan/discover" label="Discover" Icon={Search} />
          <NavItem to="/fan/messages" label="Messages" Icon={MessageCircleMore} />
          <NavItem to="/fan/home" label="Profile" Icon={User2} />
        </ul>
      </div>
    </nav>
  );
}

function NavItem({ to, label, Icon }) {
  return (
    <li className="relative">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 py-3 text-sm ${
            isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div className="relative">
              <Icon size={22} />
              {isActive && (
                <span
                  className="absolute -inset-2 rounded-lg"
                  style={{
                    boxShadow:
                      "0 0 24px rgba(180,180,255,.25), 0 0 8px rgba(140,140,255,.25)",
                  }}
                />
              )}
            </div>
            <span className="text-[11px] leading-none">{label}</span>
            {isActive ? (
              <i className="mt-2 block h-[2px] w-7 rounded-full" style={{ background: "var(--chrome-accent)" }} />
            ) : (
              <i className="mt-2 block h-[2px] w-7 rounded-full bg-white/0" />
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}
