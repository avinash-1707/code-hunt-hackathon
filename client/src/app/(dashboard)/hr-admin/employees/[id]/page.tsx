"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchEmployeeProfile } from "../../../../../features/hr-admin/api/employees";
import { LeavesTab } from "../../../../../features/hr-admin/components/LeavesTab";
import {
    ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar,
    MoreVertical, Award, TrendingUp, CheckCircle, Clock, Users,
    DollarSign, Percent, Target, FileEdit, ArrowUpRight, ArrowDownRight, Activity, ShieldCheck, PieChart
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

export default function EmployeeProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchEmployeeProfile(id);
            setEmployee(data.data.employee);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-12 flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div></div>;
    if (!employee) return <div className="p-12 text-center text-red-500">Employee not found</div>;

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "performance", label: "Performance" },
        { id: "goals", label: "Goals" },
        { id: "leaves", label: "Leaves" },
        { id: "attendance", label: "Attendance" },
        { id: "compensation", label: "Compensation" }
    ];

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
            {/* Back Button */}
            <button
                onClick={() => router.push('/hr-admin/employees')}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Directory
            </button>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-end pt-12">
                    {/* Avatar */}
                    <div className="h-28 w-28 rounded-xl bg-white p-1 shadow-md shrink-0">
                        {employee.photo ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={employee.photo} alt={employee.firstName} className="w-full h-full object-cover rounded-lg border border-slate-200" />
                        ) : (
                            <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-700 text-3xl font-bold rounded-lg border border-blue-100">
                                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-slate-900">{employee.firstName} {employee.lastName}</h1>
                                <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border ${getStatusStyle(employee.status)}`}>
                                    {employee.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-blue-700 mb-4">{employee.position?.title} • {employee.department?.name}</p>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-400" /> {employee.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-400" /> {employee.phone || "No phone added"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" /> {employee.location || "Office HQ"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" /> {employee.employmentType}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                            <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto">
                                Message
                            </button>
                            <button className="p-2 border border-slate-200 text-slate-400 rounded-lg hover:bg-slate-50 transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${activeTab === t.id
                                ? "border-blue-600 text-blue-700"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                }`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="pt-2 pb-12">

                {activeTab === "overview" && (
                    <div className="space-y-6">
                        {/* Top row - 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Team Block */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-600" /> {employee.firstName}'s Team
                                    </h3>
                                    <button className="p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 text-slate-400">
                                        <MoreVertical className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-y-6 gap-x-2 justify-items-center">
                                    {/* Mock Team Members */}
                                    {[
                                        { name: "Jake Thompson", img: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
                                        { name: "Ryan Mitchell", img: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
                                        { name: "Ashley Morgan", img: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
                                        { name: "Brandon Carter", img: "https://i.pravatar.cc/150?u=a04258114e29026707d" },
                                        { name: "Ethan Wallace", img: "https://i.pravatar.cc/150?u=a04258114e29026701d" },
                                        { name: "Josh Daniels", img: "https://i.pravatar.cc/150?u=a04258114e290267aaa" },
                                    ].map((member, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1.5">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={member.img} alt={member.name} className="w-12 h-12 rounded-full border-2 border-slate-50 shadow-sm object-cover" />
                                            <span className="text-[10px] text-center text-slate-600 font-medium leading-tight px-1">{member.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Statistics Block */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-blue-600" /> Statistics
                                    </h3>
                                    <div className="flex gap-1.5">
                                        <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 border border-slate-200 text-slate-400 font-medium pb-0.5">+</button>
                                        <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 border border-slate-200 text-slate-400"><FileEdit className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> Experience</p>
                                        <p className="text-xl font-medium text-slate-800">5+<span className="text-xs text-slate-500 font-normal ml-0.5">yrs</span></p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> Salary</p>
                                        <p className="text-xl font-medium text-slate-800">$100K<span className="text-xs text-slate-500 font-normal ml-0.5">/yr</span></p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Employee From</p>
                                        <p className="text-xl font-medium text-slate-800">11<span className="text-xs text-slate-500 font-normal ml-0.5">Months</span></p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1.5"><Users className="w-3 h-3" /> Team Size</p>
                                        <p className="text-xl font-medium text-slate-800">02<span className="text-xs text-slate-500 font-normal ml-0.5">yrs</span></p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1.5"><Target className="w-3 h-3" /> Projects Completed</p>
                                        <p className="text-xl font-medium text-slate-800">3+<span className="text-xs text-slate-500 font-normal ml-0.5">Projects</span></p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Avg. Project Duration</p>
                                        <p className="text-xl font-medium text-slate-800">03<span className="text-xs text-slate-500 font-normal ml-0.5">Months</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Sparkle Block */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-600" /> Attendance Report
                                    </h3>
                                    <div className="flex gap-1.5">
                                        <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 border border-slate-200 text-slate-400 font-medium pb-0.5">+</button>
                                        <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 border border-slate-200 text-slate-400"><FileEdit className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                                <div className="flex items-end gap-4 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-2xl font-medium text-slate-800">63</span>
                                        <ArrowUpRight className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <span className="text-xl">12</span>
                                        <ArrowDownRight className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="flex-1 flex items-center justify-center pt-2">
                                    <div className="grid grid-cols-12 gap-1.5 w-full">
                                        {/* Generate a random scatter of dots heavily favoring solid blue */}
                                        {Array.from({ length: 96 }).map((_, i) => {
                                            const isActive = Math.random() > 0.3;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`w-3 h-3 rounded-full ${isActive ? 'bg-blue-600' : 'bg-blue-100'}`}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom row - 2 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
                            {/* AI Scoring */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-blue-600" /> AI Scoring
                                    </h3>
                                    <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 border border-slate-200 text-slate-400"><FileEdit className="w-3.5 h-3.5" /></button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: "Personality", val: 10 },
                                        { label: "Punctuality", val: 8 },
                                        { label: "Communication", val: 9 },
                                        { label: "Teamwork", val: 10 },
                                        { label: "Problem Solving", val: 8 },
                                        { label: "Adaptability", val: 10 },
                                        { label: "Accountability", val: 7 },
                                    ].map((skill, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600 w-28">{skill.label}</span>
                                            <div className="flex gap-1">
                                                {Array.from({ length: 10 }).map((_, j) => (
                                                    <div key={j} className={`w-[9px] h-3 rounded-sm ${j < skill.val ? 'bg-blue-600' : 'bg-blue-100'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Transactions / Activity Mock */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <PieChart className="w-4 h-4 text-blue-600" /> Recent Transactions
                                    </h3>
                                    <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 border border-slate-200 text-slate-400"><FileEdit className="w-3.5 h-3.5" /></button>
                                </div>
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="text-xs text-slate-400 font-medium uppercase border-b border-transparent">
                                            <th className="pb-4 font-medium uppercase tracking-wider">Type</th>
                                            <th className="pb-4 font-medium uppercase tracking-wider">Amount</th>
                                            <th className="pb-4 font-medium uppercase tracking-wider">Pay Type</th>
                                            <th className="pb-4 font-medium uppercase tracking-wider">Status</th>
                                            <th className="pb-4 font-medium uppercase tracking-wider">From</th>
                                            <th className="pb-4 font-medium uppercase tracking-wider">Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="group">
                                            <td className="py-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-rose-200 flex items-center justify-center text-rose-500">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </div>
                                                <span className="text-slate-700">Sent</span>
                                            </td>
                                            <td className="py-4">
                                                <p className="text-slate-800 font-medium">-200,000 IDR</p>
                                                <p className="text-slate-400 text-xs mt-0.5">40 USD</p>
                                            </td>
                                            <td className="py-4 text-slate-600">Credit Card</td>
                                            <td className="py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-semibold">Success</span></td>
                                            <td className="py-4 text-slate-600">HR Vault</td>
                                            <td className="py-4">
                                                <p className="text-slate-600">05/05/2026</p>
                                                <p className="text-slate-400 text-xs mt-0.5">04:50 AM</p>
                                            </td>
                                        </tr>
                                        <tr className="group">
                                            <td className="py-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-500">
                                                    <ArrowDownRight className="w-4 h-4" />
                                                </div>
                                                <span className="text-slate-700">Received</span>
                                            </td>
                                            <td className="py-4">
                                                <p className="text-slate-800 font-medium">+200,000 IDR</p>
                                                <p className="text-slate-400 text-xs mt-0.5">+1,500 USD</p>
                                            </td>
                                            <td className="py-4 text-slate-600">Wire Transfer</td>
                                            <td className="py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-semibold">Success</span></td>
                                            <td className="py-4 text-slate-600">Payroll System</td>
                                            <td className="py-4">
                                                <p className="text-slate-600">05/05/2026</p>
                                                <p className="text-slate-400 text-xs mt-0.5">04:50 AM</p>
                                            </td>
                                        </tr>
                                        <tr className="group">
                                            <td className="py-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-500">
                                                    <ArrowDownRight className="w-4 h-4" />
                                                </div>
                                                <span className="text-slate-700">Received</span>
                                            </td>
                                            <td className="py-4">
                                                <p className="text-slate-800 font-medium">+200,000 IDR</p>
                                                <p className="text-slate-400 text-xs mt-0.5">+2,500 USD</p>
                                            </td>
                                            <td className="py-4 text-slate-600">Bank Transfer</td>
                                            <td className="py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-semibold">Success</span></td>
                                            <td className="py-4 text-slate-600">Bonus Pool</td>
                                            <td className="py-4">
                                                <p className="text-slate-600">05/05/2026</p>
                                                <p className="text-slate-400 text-xs mt-0.5">04:50 AM</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "performance" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Performance Trend</h3>
                                <p className="text-sm text-slate-500 mt-1">Individual score out of 5.0 points tracked across past 6 months</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md text-sm font-semibold border border-emerald-100 shadow-sm">
                                <TrendingUp className="w-5 h-5" /> Consistent Top 10%
                            </div>
                        </div>
                        <div className="h-[350px] w-full mt-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={employee.performanceHistory || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B' }} dy={15} />
                                    <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B' }} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === "goals" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-4xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-slate-900">Current Monthly Goals</h3>
                            <button className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-md hover:bg-blue-100 transition shadow-sm border border-blue-100">
                                + Assign New Goal
                            </button>
                        </div>
                        <div className="space-y-8 mt-6">
                            {(employee.goals || []).map((goal: any) => (
                                <div key={goal.id} className="p-4 border border-slate-100 bg-slate-50 rounded-lg">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-3">
                                            {goal.progress === 100 ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Target className="w-5 h-5 text-blue-500" />}
                                            <span className="text-base font-semibold text-slate-800">{goal.title}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{goal.progress}% completed</span>
                                    </div>
                                    <div className="w-full bg-white rounded-full h-2.5 border border-slate-200 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${goal.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                                            style={{ width: `${goal.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-3 flex justify-end">Status: {goal.status}</p>
                                </div>
                            ))}
                            {(!employee.goals || employee.goals.length === 0) && (
                                <p className="text-sm text-slate-500 text-center py-12">No active goals found.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "attendance" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                        <div className="flex items-center justify-between border-b pb-4 mb-6">
                            <h3 className="text-lg font-semibold text-slate-900">Attendance Tracker</h3>
                            <p className="text-sm text-slate-500 italic">Tracking trailing 30-day reliability matrix</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            <div className="md:col-span-1 flex flex-col items-center justify-center p-8 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
                                <Clock className="w-8 h-8 text-blue-600 mb-3" />
                                <p className="text-5xl font-black text-slate-900 mb-2">{employee.attendanceRate || 0}%</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Average On-Time <br /> Clock-in Rate</p>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold text-slate-700 mb-4">Daily Activity Map (Last 14 Working Days)</h4>
                                <div className="grid grid-cols-7 gap-2">
                                    {Array.from({ length: 14 }).map((_, i) => (
                                        <div key={i} className={`h-12 w-full rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm transition-transform hover:scale-105 cursor-pointer
                                            ${i % 7 === 5 || i % 7 === 6 ? 'bg-slate-200 text-slate-400 border border-slate-300'
                                                : employee.attendanceRate && employee.attendanceRate > 90 ? 'bg-emerald-500'
                                                    : 'bg-amber-500'}`}
                                        >
                                            {i % 7 === 5 || i % 7 === 6 ? 'WKND' : (100 - (i % 5)) + '%'}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 mt-6 text-xs text-slate-500">
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div> On Time</div>
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-500"></div> Late Arrival</div>
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-rose-500"></div> Absent</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "compensation" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
                            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b pb-4">Compensation Package</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-5 border border-slate-100 bg-slate-50 rounded-xl relative overflow-hidden">
                                    <DollarSign className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-slate-200/50" />
                                    <p className="text-sm font-semibold text-slate-500 mb-1">Base Salary</p>
                                    <p className="text-3xl font-bold text-slate-900">{employee.compensation?.salary || "N/A"}</p>
                                    <p className="text-xs text-slate-400 mt-2">Annualized</p>
                                </div>
                                <div className="p-5 border border-slate-100 bg-emerald-50 rounded-xl relative overflow-hidden">
                                    <Percent className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-emerald-200/50" />
                                    <p className="text-sm font-semibold text-emerald-700 mb-1">Target Bonus</p>
                                    <p className="text-3xl font-bold text-emerald-900">{employee.compensation?.bonus || "N/A"}</p>
                                    <p className="text-xs text-emerald-600 mt-2">Performance based</p>
                                </div>
                                <div className="p-5 border border-slate-100 bg-indigo-50 rounded-xl lg:col-span-2 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-indigo-700 mb-1">Equity & Options</p>
                                        <p className="text-xl font-bold text-indigo-900">{employee.compensation?.stockOptions || "N/A"}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700">View Vesting Schedule</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
                            <h3 className="text-base font-semibold text-slate-900 mb-4">Upcoming Events</h3>
                            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 bg-slate-50">
                                <Calendar className="w-10 h-10 text-blue-500 mb-3" />
                                <p className="text-sm font-bold text-slate-700">Next Review Date</p>
                                <p className="text-lg font-black text-slate-900 mt-1">{employee.compensation?.nextReview ? new Date(employee.compensation.nextReview).toLocaleDateString() : "Pending"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "leaves" && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[500px]">
                        <LeavesTab employeeId={id} />
                    </div>
                )}
            </div>
        </div>
    );
}
