"use client";

import { useState, useMemo } from "react";
import { Download, Search, Filter, ShieldCheck, Activity, AlertCircle, FileEdit, LogIn, Trash2, ChevronDown } from "lucide-react";

// Mock Data for Audit Logs
const MOCK_AUDIT_LOGS = [
    { id: "AL-5921", user: "HR_ADMIN", action: "Updated Compensation", details: "Changed base salary for emp-1 (Sanya Sharma)", ip: "192.168.1.45", timestamp: "Feb 27, 2026 10:45 AM", status: "SUCCESS" },
    { id: "AL-5920", user: "SYSTEM", action: "Automated Backup", details: "Daily database snapshot completed", ip: "10.0.0.1", timestamp: "Feb 27, 2026 02:00 AM", status: "SUCCESS" },
    { id: "AL-5919", user: "Ria Kapoor", action: "Leave Request Approved", details: "Approved Annual Leave for Sia Rai", ip: "192.168.1.82", timestamp: "Feb 26, 2026 04:30 PM", status: "SUCCESS" },
    { id: "AL-5918", user: "UNKNOWN", action: "Failed Login Attempt", details: "Invalid password for hr_admin account", ip: "45.22.19.102", timestamp: "Feb 26, 2026 01:15 PM", status: "FAILURE" },
    { id: "AL-5917", user: "HR_ADMIN", action: "Deleted Record", details: "Removed deprecated goal from emp-3", ip: "192.168.1.45", timestamp: "Feb 26, 2026 11:20 AM", status: "SUCCESS" },
    { id: "AL-5916", user: "Kunal Desai", action: "Updated Performance", details: "Submitted Q1 review for Sanya Sharma", ip: "192.168.1.105", timestamp: "Feb 25, 2026 09:10 AM", status: "SUCCESS" },
];

export default function AuditLogsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredLogs = useMemo(() => {
        let result = MOCK_AUDIT_LOGS;
        if (search) {
            const query = search.toLowerCase();
            result = result.filter(log =>
                log.action.toLowerCase().includes(query) ||
                log.user.toLowerCase().includes(query) ||
                log.ip.toLowerCase().includes(query)
            );
        }
        if (statusFilter !== "ALL") {
            result = result.filter(log => log.status === statusFilter);
        }
        return result;
    }, [search, statusFilter]);

    const getActionIcon = (action: string) => {
        if (action.includes("Updated") || action.includes("Approved")) return <FileEdit className="w-4 h-4 text-blue-600" />;
        if (action.includes("Backup")) return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
        if (action.includes("Login")) return <LogIn className="w-4 h-4 text-amber-600" />;
        if (action.includes("Deleted")) return <Trash2 className="w-4 h-4 text-rose-600" />;
        return <Activity className="w-4 h-4 text-slate-600" />;
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit Logs</h1>
                    <p className="text-slate-500 text-sm mt-1">Track all system events, data changes, and security events.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Advanced Filter
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
                <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
                    <div className="flex flex-1 items-center gap-4 min-w-[300px]">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by action, user, or IP..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <select
                                className="appearance-none pl-9 pr-8 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Status</option>
                                <option value="SUCCESS">Success</option>
                                <option value="FAILURE">Failed</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User / IP</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        No logs found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-slate-900">{log.timestamp}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5">{log.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                                                    {getActionIcon(log.action)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">{log.action}</div>
                                                    <div className="text-sm text-slate-600 mt-0.5 max-w-md truncate" title={log.details}>{log.details}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{log.user}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5">{log.ip}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {log.status === "SUCCESS" ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md"><ShieldCheck className="w-3.5 h-3.5" /> Success</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-md"><AlertCircle className="w-3.5 h-3.5" /> Failed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
