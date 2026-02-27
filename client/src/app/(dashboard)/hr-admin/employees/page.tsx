"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchEmployees } from "../../../../features/hr-admin/api/employees";
import { Search, Filter, Download, MoreHorizontal, ChevronDown } from "lucide-react";

export default function EmployeeDirectoryPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [deptFilter, setDeptFilter] = useState("ALL");

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchEmployees({ search, status: statusFilter, department: deptFilter });
            setEmployees(data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [search, statusFilter, deptFilter]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'ON_LEAVE': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'SUSPENDED': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    }

    return (
        <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and view all employee profiles.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-all focus:ring-2 focus:ring-slate-100 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 shadow-sm transition-all focus:ring-2 focus:ring-blue-100">
                        + Add Employee
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">

                {/* Advanced Filter Bar */}
                <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-1 items-center gap-4 min-w-[300px]">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or ID..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <select
                                    className="appearance-none pl-9 pr-8 a py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="ON_LEAVE">On Leave</option>
                                    <option value="SUSPENDED">Suspended</option>
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
                                    <option value="Product">Product</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="HR">HR</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department & Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex justify-center items-center gap-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-500"></div>
                                            Loading directory...
                                        </div>
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No employees found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {emp.photo ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img src={emp.photo} alt={emp.firstName} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                                                        {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{emp.firstName} {emp.lastName}</div>
                                                    <div className="text-xs text-slate-500">ID: {emp.id || "N/A"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-700">{emp.email}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{emp.phone || "---"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{emp.department?.name || "N/A"}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{emp.position?.title || "N/A"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border ${getStatusStyle(emp.status)}`}>
                                                {emp.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-700">{new Date(emp.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link href={`/hr-admin/employees/${emp.id}`} className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 hover:text-blue-700 hover:border-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-100">
                                                View Profile
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50 rounded-b-xl">
                    <div>Showing 1 to {employees.length} of {employees.length} entries</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 bg-slate-50 cursor-not-allowed">Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded text-slate-700 bg-white hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
