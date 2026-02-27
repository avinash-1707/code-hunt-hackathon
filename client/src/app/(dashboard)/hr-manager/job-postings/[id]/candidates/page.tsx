"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  fetchCandidatesForJob,
  updateCandidateStatus,
  addInterview,
  addInterviewReview,
} from "../../../../../../features/hr-manager/api/jobPostings";

export default function CandidatesPage() {
  const router = useRouter();
  const { id: jobId } = useParams() as { id: string };
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{
    appId: string;
    type: "schedule" | "review";
  } | null>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchCandidatesForJob(jobId);
        setCandidates(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [jobId]);

  const handleSchedule = async (appId: string) => {
    // form contains interviewer, date
    const interview = {
      interviewer: form.interviewer || "",
      scheduledAt: form.scheduledAt || new Date().toISOString(),
      durationMins: form.durationMins || 60,
      location: form.location || "Online",
      status: "SCHEDULED",
    };
    await addInterview(appId, interview);
    setCandidates((prev) =>
      prev.map((c) =>
        c.applicationId === appId
          ? { ...c, interview, status: "INTERVIEWING" }
          : c,
      ),
    );
    setEditing(null);
  };

  const handleReview = async (appId: string) => {
    const review = {
      feedback: form.feedback || "",
      rating: parseInt(form.rating || "0", 10),
    };
    await addInterviewReview(appId, review);
    setCandidates((prev) =>
      prev.map((c) =>
        c.applicationId === appId
          ? {
              ...c,
              interview: { ...c.interview, ...review, status: "COMPLETED" },
            }
          : c,
      ),
    );
    setEditing(null);
  };

  const handleDecision = async (
    appId: string,
    decision: "HIRED" | "REJECTED",
  ) => {
    await updateCandidateStatus(appId, decision);
    setCandidates((prev) =>
      prev.map((c) =>
        c.applicationId === appId ? { ...c, status: decision } : c,
      ),
    );
  };

  if (loading)
    return (
      <div className="p-12 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="p-8 max-w-400 mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="text-black hover:underline"
      >
        &larr; Back to postings
      </button>
      <h1 className="text-2xl font-bold text-black">
        Candidates for posting {jobId}
      </h1>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">
                Email
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
            {candidates.map((c) => (
              <tr
                key={c.applicationId}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-6 py-4 text-black">{c.name}</td>
                <td className="px-6 py-4 text-black">{c.email}</td>
                <td className="px-6 py-4 text-black">{c.status}</td>
                <td className="px-6 py-4 text-right">
                  {c.status === "APPLIED" && (
                    <button
                      onClick={() =>
                        setEditing({ appId: c.applicationId, type: "schedule" })
                      }
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-md text-sm font-medium hover:bg-amber-100 mr-2"
                    >
                      Schedule Interview
                    </button>
                  )}
                  {c.status === "INTERVIEWING" &&
                    c.interview &&
                    c.interview.status === "SCHEDULED" && (
                      <button
                        onClick={() =>
                          setEditing({ appId: c.applicationId, type: "review" })
                        }
                        className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm font-medium hover:bg-green-100 mr-2"
                      >
                        Add Review
                      </button>
                    )}
                  {(c.status === "APPLIED" || c.status === "INTERVIEWING") && (
                    <>
                      <button
                        onClick={() => handleDecision(c.applicationId, "HIRED")}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium hover:bg-emerald-100 mr-2"
                      >
                        Hire
                      </button>
                      <button
                        onClick={() =>
                          handleDecision(c.applicationId, "REJECTED")
                        }
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-md text-sm font-medium hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            {editing.type === "schedule" ? (
              <>
                <h2 className="text-lg font-bold mb-4 text-black">
                  Schedule Interview
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSchedule(editing.appId);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Interviewer
                    </label>
                    <input
                      required
                      onChange={(e) =>
                        setForm({ ...form, interviewer: e.target.value })
                      }
                      className="mt-1 block w-full border border-slate-200 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Date & Time
                    </label>
                    <input
                      required
                      type="datetime-local"
                      onChange={(e) =>
                        setForm({ ...form, scheduledAt: e.target.value })
                      }
                      className="mt-1 block w-full border border-slate-200 rounded-md p-2"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4 text-black">
                  Interview Review
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReview(editing.appId);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Rating (1-5)
                    </label>
                    <input
                      required
                      type="number"
                      min={1}
                      max={5}
                      onChange={(e) =>
                        setForm({ ...form, rating: e.target.value })
                      }
                      className="mt-1 block w-full border border-slate-200 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Feedback
                    </label>
                    <textarea
                      required
                      onChange={(e) =>
                        setForm({ ...form, feedback: e.target.value })
                      }
                      className="mt-1 block w-full border border-slate-200 rounded-md p-2"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
