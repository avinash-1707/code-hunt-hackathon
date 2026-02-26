"use client";

import { useEffect, useState } from "react";
import { fetchEmployeeLeaves, updateLeaveStatus } from "../api/leaves";

export function LeavesTab({ employeeId }: { employeeId: string }) {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchEmployeeLeaves(employeeId);
            setLeaves(data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [employeeId]);

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await updateLeaveStatus(id, status);
            await loadData();
        } catch (e) {
            console.error("Failed to update status");
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading leaves...</div>;

    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-lg">Leave Requests</h3>

            {leaves.length === 0 ? (
                <div className="p-8 text-center text-gray-500 border border-dashed rounded-md">
                    No leave records found.
                </div>
            ) : (
                <div className="border rounded-md shadow-sm divide-y">
                    {leaves.map((leave) => (
                        <div key={leave.id} className="p-4 flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-900">
                                    {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    Type: <span className="font-medium">{leave.leaveType}</span> • Reason: {leave.reason || "None provided"}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${leave.status === "APPROVED" ? "bg-green-100 text-green-800" :
                                        leave.status === "REJECTED" ? "bg-red-100 text-red-800" :
                                            "bg-yellow-100 text-yellow-800"
                                    }`}>
                                    {leave.status}
                                </span>

                                {leave.status === "PENDING" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusChange(leave.id, "APPROVED")}
                                            className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(leave.id, "REJECTED")}
                                            className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-md hover:bg-red-200"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
