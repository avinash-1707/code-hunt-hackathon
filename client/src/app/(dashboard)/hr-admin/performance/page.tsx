"use client";

import { Star, StarHalf, ChevronDown, Download } from "lucide-react";
import Image from "next/image";

const PERFORMANCE_DATA = [
    { id: 1, rank: 1, name: "Sanya Sharma", photo: "https://i.pravatar.cc/150?u=a042581f4e29026024d", dept: "Engineering", role: "Senior Dev", rating: 4.8, max: 5, achievement: "Exceeded sprint velocity by 150%" },
    { id: 2, rank: 2, name: "Sia Rai", photo: "https://i.pravatar.cc/150?u=a042581f4e29026704d", dept: "Marketing", role: "Marketing Manager", rating: 4.5, max: 5, achievement: "Delivered major campaign ahead of schedule" },
    { id: 3, rank: 3, name: "Ria Kapoor", photo: "https://i.pravatar.cc/150?u=a04258114e29026701d", dept: "HR", role: "HR Manager", rating: 4.5, max: 5, achievement: "Streamlined onboarding process" },
    { id: 4, rank: 4, name: "Sahil Shrinivas", photo: "https://i.pravatar.cc/150?u=a04258114e29026702d", dept: "Sales", role: "Account Exec", rating: 4.2, max: 5, achievement: "Closed 3 enterprise deals this quarter" },
    { id: 5, rank: 5, name: "Arjun Verma", photo: "https://i.pravatar.cc/150?u=a04258114e29026706d", dept: "Sales", role: "VP Sales", rating: 4.1, max: 5, achievement: "Exceeded regional quota by 20%" },
    { id: 6, rank: 6, name: "Kunal Desai", photo: "https://i.pravatar.cc/150?u=a04258114e29026707d", dept: "Engineering", role: "Engineering Lead", rating: 4.0, max: 5, achievement: "Zero critical bugs in Q3 release" },
];

export default function PerformanceLeaderboard() {
    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Company Performance Leaderboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Review top performers across all departments.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                    <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 shadow-sm transition-all">
                        Run Review Cycle
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                {/* Advanced Filter Bar per mockup */}
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-4 items-center">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between min-w-[160px] shadow-sm">
                        <span>🗓 Q1 2026</span> <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between min-w-[160px] shadow-sm">
                        <span>Overall Rating</span> <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between min-w-[160px] shadow-sm">
                        <span>Sales Target %</span> <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between min-w-[200px] shadow-sm">
                        <span>Project Completion Rate</span> <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Rank</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider md:w-48">Overall Rating</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Key Achievement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {PERFORMANCE_DATA.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700 flex items-center gap-2">
                                        {emp.rank === 1 && <span className="text-xl">🥇</span>}
                                        {emp.rank === 2 && <span className="text-xl">🥈</span>}
                                        {emp.rank === 3 && <span className="text-xl">🥉</span>}
                                        {emp.rank > 3 && <span className="px-1">{emp.rank}</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={emp.photo} alt={emp.name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                                            <span className="text-sm font-semibold text-slate-900">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{emp.dept}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{emp.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            {[...Array(Math.floor(emp.rating))].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            ))}
                                            {emp.rating % 1 !== 0 && <StarHalf className="w-4 h-4 fill-amber-400 text-amber-400" />}
                                            {[...Array(5 - Math.ceil(emp.rating))].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-slate-200 text-slate-200" />
                                            ))}
                                            <span className="font-bold text-sm text-slate-700 ml-2">{emp.rating.toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                                        {emp.achievement}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
                    <div>Showing 1 to 6 of 124 entries</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 bg-slate-50 cursor-not-allowed">Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded text-slate-700 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
