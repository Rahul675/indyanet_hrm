// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { useAuth } from "@/store/auth";
// import Link from "next/link";
// import {
//   Menu,
//   LogOut,
//   Users,
//   CalendarDays,
//   Wallet,
//   User,
//   Settings,
//   LayoutDashboard,
//   Sun,
//   Moon,
// } from "lucide-react";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider, useTheme } from "@/context/ThemeProvider";

// // ---- Fonts
// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// // ---- Helper: strip /hrm (basePath) from pathname for comparisons
// function useNormalizedPathname() {
//   const pathname = usePathname() || "/";
//   const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, ""); // "/hrm"
//   return useMemo(() => {
//     if (!base) return pathname;
//     return pathname.startsWith(base)
//       ? pathname.slice(base.length) || "/"
//       : pathname;
//   }, [pathname, base]);
// }

// // ---- Root
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ThemeProvider>
//       <AppLayout>{children}</AppLayout>
//     </ThemeProvider>
//   );
// }

// // ---- App Shell
// function AppLayout({ children }: { children: React.ReactNode }) {
//   const rawPathname = usePathname(); // e.g. "/hrm/login"
//   const pathname = useNormalizedPathname(); // e.g. "/login"
//   const router = useRouter();
//   const { role, logout, token, load } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const { theme, toggleTheme } = useTheme();

//   // Restore session once
//   useEffect(() => {
//     useAuth.getState().load();
//   }, []);

//   // Route guarding (compare against normalized path)
//   useEffect(() => {
//     // not logged in
//     if (!token) {
//       if (pathname.startsWith("/dashboard")) router.replace("/login");
//       else if (pathname !== "/" && !pathname.startsWith("/login"))
//         router.replace("/");
//       return;
//     }
//     // logged in
//     if (pathname === "/" || pathname.startsWith("/login"))
//       router.replace("/dashboard");
//   }, [pathname, token, router]);

//   const handleLogout = () => {
//     logout();
//     router.replace("/login");
//   };

//   const isLoginPage = pathname.startsWith("/login");
//   const isPublicPage = pathname === "/" || isLoginPage;

//   // Public pages (landing/login)
//   if (isPublicPage && !token) {
//     return (
//       <html lang="en" className={theme === "dark" ? "dark" : ""}>
//         <body
//           className={${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors}
//         >
//           {children}
//         </body>
//       </html>
//     );
//   }

//   // Authenticated pages
//   return (
//     <html lang="en" className={theme === "dark" ? "dark" : ""}>
//       <body
//         className={${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300}
//       >
//         <div className="flex h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
//           {/* Sidebar */}
//           <aside
//             className={${sidebarOpen ? "w-64" : "w-20"} border-r border-[var(--border-color)] bg-[var(--card-bg)] transition-all duration-300 flex flex-col}
//           >
//             {/* Header */}
//             <div
//               className={flex items-center border-b border-[var(--border-color)] ${sidebarOpen ? "justify-between px-4" : "justify-center px-0"} h-[61px]}
//             >
//               {sidebarOpen && (
//                 <h1 className="font-semibold text-lg text-[var(--text-primary)]">
//                   HRM System
//                 </h1>
//               )}
//               <button
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//                 className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
//               >
//                 <Menu className="text-[var(--text-primary)]" size={22} />
//               </button>
//             </div>

//             {/* Navigation */}
//             <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
//               <SidebarLink
//                 href="/dashboard"
//                 icon={<LayoutDashboard size={18} />}
//                 label="Dashboard"
//                 open={sidebarOpen}
//               />
//               {role === "ADMIN" && (
//                 <SidebarLink
//                   href="/employees"
//                   icon={<Users size={18} />}
//                   label="Employees"
//                   open={sidebarOpen}
//                 />
//               )}
//               <SidebarLink
//                 href="/leave"
//                 icon={<CalendarDays size={18} />}
//                 label="Leave"
//                 open={sidebarOpen}
//               />
//               <SidebarLink
//                 href="/payroll"
//                 icon={<Wallet size={18} />}
//                 label="Payroll"
//                 open={sidebarOpen}
//               />
//               <SidebarLink
//                 href="/profile"
//                 icon={<User size={18} />}
//                 label="Profile"
//                 open={sidebarOpen}
//               />
//               <SidebarLink
//                 href="/settings"
//                 icon={<Settings size={18} />}
//                 label="Settings"
//                 open={sidebarOpen}
//               />
//             </nav>

//             {/* Footer actions */}
//             <div className="border-t border-[var(--border-color)] p-4 space-y-3">
//               <button
//                 onClick={toggleTheme}
//                 className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
//               >
//                 {theme === "dark" ? (
//                   <>
//                     <Sun size={18} /> {sidebarOpen && "Light Mode"}
//                   </>
//                 ) : (
//                   <>
//                     <Moon size={18} /> {sidebarOpen && "Dark Mode"}
//                   </>
//                 )}
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800 w-full px-3 py-2 rounded-lg"
//               >
//                 <LogOut size={18} /> {sidebarOpen && "Logout"}
//               </button>
//             </div>
//           </aside>

//           {/* Main */}
//           <div className="flex flex-col flex-1">
//             <Header role={role || ""} />
//             <main className="flex-1 overflow-y-auto p-6">{children}</main>
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }

// // ---- Sidebar Link (uses normalized pathname for active state)
// function SidebarLink({
//   href,
//   icon,
//   label,
//   open,
// }: {
//   href: string;
//   icon: React.ReactNode;
//   label: string;
//   open: boolean;
// }) {
//   const pathname = useNormalizedPathname(); // e.g. "/dashboard"
//   const active = pathname === href || pathname.startsWith(${href}/);

//   return (
//     <Link
//       href={href}
//       className={`group flex items-center rounded-lg transition-all duration-300
//         ${open ? "justify-start gap-3 px-3" : "justify-center px-0"} h-10
//         ${active ? "bg-[var(--hover-bg)] font-semibold" : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--button-hover-text)]"}`}
//     >
//       <span className="flex items-center justify-center w-6 min-w-[1.5rem]">
//         {icon}
//       </span>
//       <span
//         className={transition-all duration-300 ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 w-0 overflow-hidden"}}
//       >
//         {label}
//       </span>
//     </Link>
//   );
// }

// // ---- Header
// function Header({ role }: { role: string }) {
//   return (
//     <header className="bg-[var(--card-bg)] border-b border-[var(--border-color)] px-6 py-3 flex justify-between items-center">
//       <h2 className="font-semibold text-[var(--text-primary)]">
//         Human Resource Management
//       </h2>
//       <div className="flex items-center gap-3">
//         <span className="text-sm text-gray-500 dark:text-gray-400">
//           Role: <strong>{role}</strong>
//         </span>
//         <div className="w-9 h-9 rounded-full border border-[var(--border-color)] flex items-center justify-center font-bold text-sm bg-blue-600 text-white shadow-sm">
//           {role?.toLowerCase() === "admin" ? "A" : "E"}
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import Link from "next/link";
import {
  Menu,
  LogOut,
  Users,
  CalendarDays,
  Wallet,
  User,
  Settings,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, useTheme } from "@/context/ThemeProvider";

// ---- Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ---- Helper: strip /hrm (basePath) from pathname for comparisons
function useNormalizedPathname() {
  const pathname = usePathname() || "/";
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  return useMemo(() => {
    if (!base) return pathname;
    return pathname.startsWith(base)
      ? pathname.slice(base.length) || "/"
      : pathname;
  }, [pathname, base]);
}

// ---- Root
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AppLayout>{children}</AppLayout>
    </ThemeProvider>
  );
}

// ---- App Shell
function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = useNormalizedPathname();
  const router = useRouter();
  const { role, logout, token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // Restore session
  useEffect(() => {
    useAuth.getState().load();
  }, []);

  // Route guarding
  useEffect(() => {
    if (!token) {
      if (pathname.startsWith("/dashboard")) router.replace("/login");
      else if (pathname !== "/" && !pathname.startsWith("/login"))
        router.replace("/");
      return;
    }
    if (pathname === "/" || pathname.startsWith("/login"))
      router.replace("/dashboard");
  }, [pathname, token, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const isLoginPage = pathname.startsWith("/login");
  const isPublicPage = pathname === "/" || isLoginPage;

  if (isPublicPage && !token) {
    return (
      <html lang="en" className={theme === "dark" ? "dark" : ""}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors`}
        >
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300`}
      >
        <div className="flex h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? "w-64" : "w-20"
            } border-r border-[var(--border-color)] bg-[var(--card-bg)] transition-all duration-300 flex flex-col`}
          >
            {/* Header */}
            <div
              className={`flex items-center border-b border-[var(--border-color)] ${
                sidebarOpen
                  ? "justify-between px-4"
                  : "justify-center px-0"
              } h-[61px]`}
            >
              {sidebarOpen && (
                <h1 className="font-semibold text-lg text-[var(--text-primary)]">
                  HRM System
                </h1>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
              >
                <Menu className="text-[var(--text-primary)]" size={22} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              <SidebarLink
                href="/dashboard"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                open={sidebarOpen}
              />
              {role === "ADMIN" && (
                <SidebarLink
                  href="/employees"
                  icon={<Users size={18} />}
                  label="Employees"
                  open={sidebarOpen}
                />
              )}
              <SidebarLink
                href="/leave"
                icon={<CalendarDays size={18} />}
                label="Leave"
                open={sidebarOpen}
              />
              <SidebarLink
                href="/payroll"
                icon={<Wallet size={18} />}
                label="Payroll"
                open={sidebarOpen}
              />
              <SidebarLink
                href="/profile"
                icon={<User size={18} />}
                label="Profile"
                open={sidebarOpen}
              />
              <SidebarLink
                href="/settings"
                icon={<Settings size={18} />}
                label="Settings"
                open={sidebarOpen}
              />
            </nav>

            {/* Footer actions */}
            <div className="border-t border-[var(--border-color)] p-4 space-y-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={18} /> {sidebarOpen && "Light Mode"}
                  </>
                ) : (
                  <>
                    <Moon size={18} /> {sidebarOpen && "Dark Mode"}
                  </>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800 w-full px-3 py-2 rounded-lg"
              >
                <LogOut size={18} /> {sidebarOpen && "Logout"}
              </button>
            </div>
          </aside>

          {/* Main */}
          <div className="flex flex-col flex-1">
            <Header role={role || ""} />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

// ---- Sidebar Link
function SidebarLink({
  href,
  icon,
  label,
  open,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
}) {
  const pathname = useNormalizedPathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`group flex items-center rounded-lg transition-all duration-300 ${
        open ? "justify-start gap-3 px-3" : "justify-center px-0"
      } h-9 ${
        active
          ? "bg-[var(--hover-bg)] font-semibold"
          : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--button-hover-text)]"
      }`}
    >
      {icon}
      {open && <span>{label}</span>}
    </Link>
  );
}

// ---- Header
function Header({ role }: { role: string }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const { token } = useAuth();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const fetchStatus = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setSessions([]);
        setIsCheckedIn(false);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setSessions(data);
        const latest = data[data.length - 1];
        setIsCheckedIn(latest && !latest.checkOutTime);
      } else {
        setSessions([]);
        setIsCheckedIn(false);
      }
    } catch (err) {
      console.error("Failed to fetch attendance status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [token, API_BASE]);

  const handleCheckToggle = async () => {
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    const endpoint = isCheckedIn
      ? "/attendance/checkout"
      : "/attendance/checkin";

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Something went wrong.");
        return;
      }

      await fetchStatus();
    } catch (err) {
      console.error("Check-in/out failed:", err);
      alert("Something went wrong while checking in/out.");
    }
  };

  const latestSession = sessions[sessions.length - 1];
  const checkInTime =
    latestSession?.checkInTime &&
    new Date(latestSession.checkInTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  const checkOutTime =
    latestSession?.checkOutTime &&
    new Date(latestSession.checkOutTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <header className="bg-[var(--card-bg)] border-b border-[var(--border-color)] px-6 py-3 flex justify-between items-center">
      <h2 className="font-semibold text-[var(--text-primary)]">
        Human Resource Management
      </h2>

      <div className="flex items-center gap-4">
      {/* Show check-in/out only for non-admin users */}
{role?.toLowerCase() !== "admin" && (
  <div className="flex items-center gap-2">
    <button
      onClick={handleCheckToggle}
      className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all ${
        isCheckedIn
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-green-600 text-white hover:bg-green-700"
      }`}
    >
      {isCheckedIn ? "Check Out" : "Check In"}
    </button>

    <div className="text-xs text-gray-500 dark:text-gray-400">
      {checkInTime && !checkOutTime && `Checked in at ${checkInTime}`}
      {checkOutTime && `Checked out at ${checkOutTime}`}
      {!checkInTime && "No activity yet today"}
    </div>
  </div>
)}


        <span className="text-sm text-gray-500 dark:text-gray-400">
          Role: <strong>{role}</strong>
        </span>

        <div className="w-9 h-9 rounded-full border border-[var(--border-color)] flex items-center justify-center font-bold text-sm bg-blue-600 text-white shadow-sm">
          {role?.toLowerCase() === "admin" ? "A" : "E"}
        </div>
      </div>
    </header>
  );
}
