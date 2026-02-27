"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDashboardSummary } from "../../../features/hr-admin/api/dashboard";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { Users, Briefcase, Activity, Clock, ShieldAlert, ArrowUpRight, ArrowDownRight, FileText, CheckCircle } from "lucide-react";

const COLORS = ['#1E3A8A', '#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

export default function HRAdminDashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchDashboardSummary();
                const modifiedData = {
                    ...data.data,
                    attendanceTrend: [
                        { day: 'Mon', rate: 96 },
                        { day: 'Tue', rate: 97 },
                        { day: 'Wed', rate: 95 },
                        { day: 'Thu', rate: 98 },
                        { day: 'Fri', rate: 94 },
                    ],
                    statusBreakdown: [
                        { name: 'Active', value: 138 },
                        { name: 'On Leave', value: 5 },
                        { name: 'Suspended', value: 1 },
                    ],
                    performanceDistribution: [
                        { grade: 'Needs Impr.', count: 4 },
                        { grade: 'Meets Exp.', count: 65 },
                        { grade: 'Exceeds Exp.', count: 42 },
                        { grade: 'Outstanding', count: 18 },
                    ]
                }
                setSummary(modifiedData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className="p-12 flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto bg-[#F8FAFC] min-h-screen">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Comprehensive view of your organization's workforce metrics.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 bg-white transition-colors">
                        Generate Report
                    </button>
                    <Link href="/hr-admin/employees" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Users className="w-4 h-4" /> Go to Directory
                    </Link>
                </div>
            </div>

            {/* Top KPI Cards - Pure Professional White styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-slate-600">Total Employees</p>
                        <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
                            <Users className="w-4 h-4 text-slate-500" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">{summary.totalEmployees}</h3>
                        <p className="text-emerald-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> 4.2% from last month
                        </p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-slate-600">Avg Attendance</p>
                        <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
                            <Clock className="w-4 h-4 text-slate-500" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">96.4%</h3>
                        <p className="text-rose-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                            <ArrowDownRight className="w-3 h-3" /> 0.5% from last month
                        </p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-slate-600">Pending Leaves</p>
                        <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
                            <FileText className="w-4 h-4 text-slate-500" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">12</h3>
                        <p className="text-amber-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                            Requires attention
                        </p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-slate-600">Avg Performance</p>
                        <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
                            <Activity className="w-4 h-4 text-slate-500" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">4.2 / 5</h3>
                        <p className="text-emerald-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> Consistent across depts
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Section - 3 Charts side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Chart 1: Department Distribution */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-semibold text-slate-800">Department Setup</h2>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={summary.departmentBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                    animationDuration={1500}
                                    stroke="none"
                                >
                                    {(summary.departmentBreakdown || []).map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '6px', fontSize: '13px', border: '1px solid #E2E8F0' }}
                                    formatter={(value: any) => [`${value} Staff`, 'Headcount']}
                                />
                                <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Attendance Area */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-semibold text-slate-800">Weekly Attendance</h2>
                    </div>
                    <div className="h-[220px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={summary.attendanceTrend || []} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '6px', fontSize: '13px', border: '1px solid #E2E8F0' }}
                                    formatter={(value: any) => [`${value}%`, 'Attendance Rate']}
                                />
                                <Area type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRate)" animationDuration={1500} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 3: Performance Distribution */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-semibold text-slate-800">Performance Grades</h2>
                    </div>
                    <div className="h-[220px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={summary.performanceDistribution || []} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '6px', fontSize: '13px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
                                    cursor={{ fill: '#F1F5F9' }}
                                />
                                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={30} animationDuration={1500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Bottom Info Boxes - Replacing single large blocks with 3 concise dialogs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" /> Pending Approvals
                        </h2>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold">5 items</span>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] text-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-slate-700">Sia Rai <span className="text-slate-400 font-normal">requested Annual Leave</span></p>
                                <p className="text-xs text-slate-500 mt-0.5">Mar 01 - Mar 05 (5 days)</p>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">Review</button>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-slate-700">Kunal Desai <span className="text-slate-400 font-normal">requested Maternity Leave</span></p>
                                <p className="text-xs text-slate-500 mt-0.5">Apr 10 - Jul 10 (90 days)</p>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">Review</button>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-slate-700">Budget Proposal <span className="text-slate-400 font-normal">Team Building</span></p>
                                <p className="text-xs text-slate-500 mt-0.5">Q3 Marketing Offsite</p>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">Review</button>
                        </div>
                    </div>
                    <button className="mt-3 w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded text-xs font-medium transition-colors">
                        View All Requests
                    </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-rose-500" /> System Alerts
                        </h2>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] text-sm">
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded text-rose-800">
                            <p className="font-medium text-sm">Visa Expiring Soon</p>
                            <p className="text-xs mt-1">2 employees require immediate documentation update for H1B.</p>
                        </div>
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded text-amber-800 mb-2">
                            <p className="font-medium text-sm">Payroll Review</p>
                            <p className="text-xs mt-1">Monthly cycle closes in 24 hours. Finance sign-off pending.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-500" /> Upcoming Reviews
                        </h2>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] text-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Sanya Sharma" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                                <div>
                                    <p className="font-medium text-slate-700">Sanya Sharma</p>
                                    <p className="text-xs text-slate-500">Engineering • Annual</p>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-blue-600">Today</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://i.pravatar.cc/150?u=a04258114e29026702d" alt="Sahil Shrinivas" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                                <div>
                                    <p className="font-medium text-slate-700">Sahil Shrinivas</p>
                                    <p className="text-xs text-slate-500">Sales • Quarterly</p>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-slate-500">Mar 02</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Sia Rai" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                                <div>
                                    <p className="font-medium text-slate-700">Sia Rai</p>
                                    <p className="text-xs text-slate-500">Marketing • Promo</p>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-slate-500">Mar 05</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
