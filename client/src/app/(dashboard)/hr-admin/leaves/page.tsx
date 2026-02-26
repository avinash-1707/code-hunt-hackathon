"use client";

import { useState, useMemo } from "react";
import { Download, Search, Filter, CheckCircle, XCircle, Clock, ChevronDown } from "lucide-react";

// Updated Mock Data with realistic Indian names and distinct images
const MOCK_LEAVES = [
    { id: "LV-1001", name: "Sahil Shrinivas", photo: "https://i.pravatar.cc/150?u=a04258114e29026702d", department: "Sales", type: "Sick Leave", dates: "Feb 23 - Feb 25, 2026", days: 3, status: "APPROVED", appliedOn: "Feb 22, 2026" },
    { id: "LV-1002", name: "Sia Rai", photo: "https://i.pravatar.cc/150?u=a042581f4e29026704d", department: "Marketing", type: "Annual Leave", dates: "Mar 01 - Mar 05, 2026", days: 5, status: "PENDING", appliedOn: "Feb 26, 2026" },
    { id: "LV-1003", name: "Kunal Desai", photo: "https://i.pravatar.cc/150?u=a04258114e29026707d", department: "Engineering", type: "Maternity Leave", dates: "Apr 10 - Jul 10, 2026", days: 90, status: "PENDING", appliedOn: "Feb 26, 2026" },
    { id: "LV-1004", name: "Sanya Sharma", photo: "https://i.pravatar.cc/150?u=a042581f4e29026024d", department: "Engineering", type: "Casual Leave", dates: "Feb 20, 2026", days: 1, status: "REJECTED", appliedOn: "Feb 18, 2026" },
    { id: "LV-1005", name: "Ria Kapoor", photo: "https://i.pravatar.cc/150?u=a04258114e29026701d", department: "HR", type: "Annual Leave", dates: "Jan 15 - Jan 25, 2026", days: 10, status: "APPROVED", appliedOn: "Jan 05, 2026" },
];

export default function LeaveRequestsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [deptFilter, setDeptFilter] = useState("ALL");

    const filteredLeaves = useMemo(() => {
        let result = MOCK_LEAVES;
        if (search) {
            const query = search.toLowerCase();
            result = result.filter(leave =>
                leave.name.toLowerCase().includes(query) ||
                leave.id.toLowerCase().includes(query) ||
                leave.type.toLowerCase().includes(query)
            );
        }
        if (statusFilter !== "ALL") {
            result = result.filter(leave => leave.status === statusFilter);
        }
        if (deptFilter !== "ALL") {
            result = result.filter(leave => leave.department === deptFilter);
        }
        return result;
    }, [search, statusFilter, deptFilter]);
    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Requests</h1>
                    <p className="text-slate-500 text-sm mt-1">Approve, reject, and manage employee leave requests.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-all focus:ring-2 focus:ring-slate-100 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Data
                    </button>
                    <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 shadow-sm transition-all flex items-center gap-2">
                        Configure Policies
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
                                placeholder="Search employees or leave type..."
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
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <select
                                className="appearance-none pl-9 pr-8 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                value={deptFilter}
                                onChange={(e) => setDeptFilter(e.target.value)}
                            >
                                <option value="ALL">All Departments</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Sales">Sales</option>
                                <option value="Marketing">Marketing</option>
                                <option value="HR">HR</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Leave Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLeaves.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No leave requests found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredLeaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={leave.photo} alt={leave.name} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{leave.name}</div>
                                                    <div className="text-xs text-slate-500">{leave.department} • {leave.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-800">{leave.type}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{leave.days} Day(s) • Applied on {leave.appliedOn}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {leave.dates}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {leave.status === "APPROVED" && <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md"><CheckCircle className="w-3.5 h-3.5" /> Approved</span>}
                                            {leave.status === "PENDING" && <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-md"><Clock className="w-3.5 h-3.5" /> Pending</span>}
                                            {leave.status === "REJECTED" && <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-md"><XCircle className="w-3.5 h-3.5" /> Rejected</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {leave.status === "PENDING" ? (
                                                <div className="flex gap-2 justify-end">
                                                    <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-md text-sm font-medium transition-colors">Approve</button>
                                                    <button className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-md text-sm font-medium transition-colors">Reject</button>
                                                </div>
                                            ) : (
                                                <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 my-auto text-center inline-flex">View Details</button>
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
