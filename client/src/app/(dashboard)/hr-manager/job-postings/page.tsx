"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchJobPostings,
  createJobPosting,
} from "../../../../features/hr-manager/api/jobPostings";
import { PlusCircle } from "lucide-react";

export default function JobPostingsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", department: "", vacancies: 1 });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchJobPostings();
        setJobs(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createJobPosting(form);
      setJobs((prev) => [...prev, res.data]);
      setForm({ title: "", department: "", vacancies: 1 });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-400 mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Job Postings</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> New Posting
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-black">
              Title
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full border border-slate-200 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Department
            </label>
            <input
              required
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="mt-1 block w-full border border-slate-200 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Vacancies
            </label>
            <input
              type="number"
              min={1}
              value={form.vacancies}
              onChange={(e) =>
                setForm({ ...form, vacancies: parseInt(e.target.value, 10) })
              }
              className="mt-1 block w-32 border border-slate-200 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">
                  Vacancies
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4 text-black">{job.title}</td>
                  <td className="px-6 py-4 text-black">{job.department}</td>
                  <td className="px-6 py-4 text-black">{job.vacancies}</td>
                  <td className="px-6 py-4 text-black">{job.status}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/hr-manager/job-postings/${job.id}/candidates`}
                      className="px-3 py-1.5 bg-blue-50 text-black rounded-md text-sm font-medium hover:bg-blue-100"
                    >
                      View Candidates
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
