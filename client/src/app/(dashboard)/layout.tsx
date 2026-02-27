"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Target,
    BarChart2,
    Wallet,
    FileText,
    Clock,
    History,
    Bell,
    Search,
    Menu,
    UserCircle
} from "lucide-react";

const SIDEBAR_LINKS = [
    { href: "/hr-admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/hr-admin/employees", label: "Employee Directory", icon: Users },
    { href: "/hr-admin/performance", label: "Performance (Global)", icon: BarChart2 },
    { href: "/hr-admin/leaves", label: "Leave Requests", icon: CalendarDays },
    { href: "/hr-admin/audit", label: "Audit Logs", icon: History },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col hidden md:flex">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-700 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-2 shadow-sm border border-blue-500">
                            <Users className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">TalentHQ<span className="text-blue-600">.</span></span>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {SIDEBAR_LINKS.map((link) => {
                        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/hr-admin');
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-slate-100 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-slate-400"}`} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Aanya Gupta" className="w-10 h-10 rounded-full border-2 border-slate-200 object-cover" />
                        <div>
                            <p className="text-sm font-bold text-slate-900">Aanya Gupta</p>
                            <p className="text-xs font-semibold text-blue-600">HR Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 relative shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] z-10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
                    <div className="flex items-center gap-6">
                        <button className="md:hidden text-slate-500 hover:text-slate-900 transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden md:flex flex-col">
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                                {/* Could add breadcrumbs based on pathname if needed */}
                                {pathname === '/hr-admin' ? 'Dashboard Overview' : pathname.split('/').pop()?.toUpperCase()}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium tracking-wide">TalentHQ Management Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-auto bg-[#F8FAFC]">
                    {children}
                </div>
            </main>
        </div>
    );
}
