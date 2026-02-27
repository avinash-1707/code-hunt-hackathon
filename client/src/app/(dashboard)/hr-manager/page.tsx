"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { LayoutDashboard, Target, Users } from "lucide-react";
import {
  fetchJobPostings,
  fetchCandidatesForJob,
} from "../../../features/hr-manager/api/jobPostings";

export default function HRManagerDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchJobPostings();
        setJobs(res.data);
        // also gather candidates count for all jobs
        const all = [];
        for (const j of res.data) {
          const cRes = await fetchCandidatesForJob(j.id);
          all.push(...cRes.data);
        }
        setCandidates(all);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="p-12 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  const openJobs = jobs.filter((j) => j.status === "OPEN").length;
  const totalCandidates = candidates.length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-400 mx-auto bg-[#F8FAFC] min-h-screen">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Manager Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Overview of your active job openings and applicant flow.
          </p>
        </div>
        <div>
          <Link
            href="/hr-manager/job-postings"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Target className="w-4 h-4" /> Manage Jobs
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-700">Open Positions</p>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Target className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{openJobs}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-700">
              Total Applicants
            </p>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Users className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {totalCandidates}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
