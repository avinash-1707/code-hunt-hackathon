import { api } from "../../../lib/api";

export const HR_MANAGER_API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/hr-manager`
  : "http://localhost:4000/api/v1/hr-manager";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

// mock data in-memory — expanded for better demo coverage
const MOCK_JOB_POSTINGS = [
  {
    id: "job-1",
    title: "Senior Backend Developer",
    department: "Engineering",
    status: "OPEN",
    vacancies: 2,
    createdAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "job-2",
    title: "Product Manager",
    department: "Product",
    status: "OPEN",
    vacancies: 1,
    createdAt: "2026-01-10T09:30:00.000Z",
  },
  {
    id: "job-3",
    title: "Frontend Engineer (React)",
    department: "Engineering",
    status: "OPEN",
    vacancies: 3,
    createdAt: "2026-02-01T11:15:00.000Z",
  },
  {
    id: "job-4",
    title: "UX Designer",
    department: "Design",
    status: "ON_HOLD",
    vacancies: 1,
    createdAt: "2025-12-05T09:00:00.000Z",
  },
  {
    id: "job-5",
    title: "Data Scientist",
    department: "Data",
    status: "CLOSED",
    vacancies: 1,
    createdAt: "2025-11-18T10:30:00.000Z",
  },
  {
    id: "job-6",
    title: "Technical Recruiter",
    department: "HR",
    status: "OPEN",
    vacancies: 1,
    createdAt: "2026-02-20T08:45:00.000Z",
  },
  {
    id: "job-7",
    title: "DevOps Engineer",
    department: "Engineering",
    status: "OPEN",
    vacancies: 2,
    createdAt: "2026-02-22T09:00:00.000Z",
  },
  {
    id: "job-8",
    title: "Marketing Manager",
    department: "Marketing",
    status: "OPEN",
    vacancies: 1,
    createdAt: "2026-02-10T14:00:00.000Z",
  },
  {
    id: "job-9",
    title: "QA Engineer",
    department: "Engineering",
    status: "ON_HOLD",
    vacancies: 2,
    createdAt: "2026-01-28T10:00:00.000Z",
  },
  {
    id: "job-10",
    title: "Finance Analyst",
    department: "Finance",
    status: "CLOSED",
    vacancies: 1,
    createdAt: "2025-10-12T08:30:00.000Z",
  },
  {
    id: "job-11",
    title: "iOS Developer",
    department: "Engineering",
    status: "OPEN",
    vacancies: 1,
    createdAt: "2026-02-25T11:00:00.000Z",
  },
  {
    id: "job-12",
    title: "Customer Success Manager",
    department: "Operations",
    status: "OPEN",
    vacancies: 2,
    createdAt: "2026-02-18T09:15:00.000Z",
  },
];

const MOCK_CANDIDATES = [
  {
    id: "cand-1",
    name: "Rahul Jain",
    email: "rahul.jain@example.com",
    applicationId: "app-1",
    jobId: "job-1",
    status: "APPLIED",
    appliedAt: "2026-02-20T12:00:00.000Z",
    interview: null,
  },
  {
    id: "cand-2",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    applicationId: "app-2",
    jobId: "job-1",
    status: "APPLIED",
    appliedAt: "2026-02-21T08:45:00.000Z",
    interview: null,
  },
  {
    id: "cand-3",
    name: "Arjun Verma",
    email: "arjun.verma@example.com",
    applicationId: "app-3",
    jobId: "job-2",
    status: "APPLIED",
    appliedAt: "2026-02-18T14:15:00.000Z",
    interview: null,
  },
  {
    id: "cand-4",
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    applicationId: "app-4",
    jobId: "job-3",
    status: "SHORTLISTED",
    appliedAt: "2026-02-10T09:30:00.000Z",
    interview: {
      interviewer: "Sanya Sharma",
      scheduledAt: "2026-02-25T15:00:00.000Z",
      durationMins: 45,
      location: "Zoom",
      status: "SCHEDULED",
    },
  },
  {
    id: "cand-5",
    name: "Vikram Patel",
    email: "vikram.patel@example.com",
    applicationId: "app-5",
    jobId: "job-3",
    status: "INTERVIEWING",
    appliedAt: "2026-02-12T10:00:00.000Z",
    interview: {
      interviewer: "Kunal Desai",
      scheduledAt: "2026-02-22T11:00:00.000Z",
      durationMins: 60,
      location: "Office - Room 402",
      status: "COMPLETED",
      feedback: "Strong React skills, good system design",
      rating: 4,
    },
  },
  {
    id: "cand-6",
    name: "Rhea Bose",
    email: "rhea.bose@example.com",
    applicationId: "app-6",
    jobId: "job-6",
    status: "APPLIED",
    appliedAt: "2026-02-23T13:20:00.000Z",
    interview: null,
  },
  {
    id: "cand-7",
    name: "Manoj Singh",
    email: "manoj.singh@example.com",
    applicationId: "app-7",
    jobId: "job-4",
    status: "REJECTED",
    appliedAt: "2026-01-05T09:00:00.000Z",
    interview: null,
  },
  // job-1: Senior Backend Developer
  {
    id: "cand-8",
    name: "Aditya Mehta",
    email: "aditya.mehta@example.com",
    applicationId: "app-8",
    jobId: "job-1",
    status: "SHORTLISTED",
    appliedAt: "2026-02-22T10:30:00.000Z",
    interview: {
      interviewer: "Rohan Gupta",
      scheduledAt: "2026-02-27T14:00:00.000Z",
      durationMins: 60,
      location: "Google Meet",
      status: "SCHEDULED",
    },
  },
  {
    id: "cand-9",
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    applicationId: "app-9",
    jobId: "job-1",
    status: "REJECTED",
    appliedAt: "2026-02-16T09:00:00.000Z",
    interview: {
      interviewer: "Rohan Gupta",
      scheduledAt: "2026-02-19T11:00:00.000Z",
      durationMins: 45,
      location: "Zoom",
      status: "COMPLETED",
      feedback: "Lacked depth in distributed systems",
      rating: 2,
    },
  },
  // job-2: Product Manager
  {
    id: "cand-10",
    name: "Kavya Nair",
    email: "kavya.nair@example.com",
    applicationId: "app-10",
    jobId: "job-2",
    status: "INTERVIEWING",
    appliedAt: "2026-02-14T11:00:00.000Z",
    interview: {
      interviewer: "Tanvi Rao",
      scheduledAt: "2026-02-24T10:00:00.000Z",
      durationMins: 60,
      location: "Office - Room 201",
      status: "COMPLETED",
      feedback:
        "Excellent product sense, strong stakeholder management experience",
      rating: 5,
    },
  },
  {
    id: "cand-11",
    name: "Sahil Khanna",
    email: "sahil.khanna@example.com",
    applicationId: "app-11",
    jobId: "job-2",
    status: "SHORTLISTED",
    appliedAt: "2026-02-19T15:00:00.000Z",
    interview: null,
  },
  // job-7: DevOps Engineer
  {
    id: "cand-12",
    name: "Deepika Rao",
    email: "deepika.rao@example.com",
    applicationId: "app-12",
    jobId: "job-7",
    status: "APPLIED",
    appliedAt: "2026-02-24T09:45:00.000Z",
    interview: null,
  },
  {
    id: "cand-13",
    name: "Karan Malhotra",
    email: "karan.malhotra@example.com",
    applicationId: "app-13",
    jobId: "job-7",
    status: "SHORTLISTED",
    appliedAt: "2026-02-23T11:30:00.000Z",
    interview: {
      interviewer: "Amit Sharma",
      scheduledAt: "2026-02-28T13:00:00.000Z",
      durationMins: 45,
      location: "Zoom",
      status: "SCHEDULED",
    },
  },
  {
    id: "cand-14",
    name: "Pooja Reddy",
    email: "pooja.reddy@example.com",
    applicationId: "app-14",
    jobId: "job-7",
    status: "INTERVIEWING",
    appliedAt: "2026-02-22T08:00:00.000Z",
    interview: {
      interviewer: "Amit Sharma",
      scheduledAt: "2026-02-26T10:00:00.000Z",
      durationMins: 60,
      location: "Office - Room 305",
      status: "COMPLETED",
      feedback:
        "Solid Kubernetes and CI/CD pipeline experience, good problem solver",
      rating: 4,
    },
  },
  // job-8: Marketing Manager
  {
    id: "cand-15",
    name: "Ananya Ghosh",
    email: "ananya.ghosh@example.com",
    applicationId: "app-15",
    jobId: "job-8",
    status: "APPLIED",
    appliedAt: "2026-02-25T10:00:00.000Z",
    interview: null,
  },
  {
    id: "cand-16",
    name: "Rohan Pillai",
    email: "rohan.pillai@example.com",
    applicationId: "app-16",
    jobId: "job-8",
    status: "SHORTLISTED",
    appliedAt: "2026-02-13T14:00:00.000Z",
    interview: {
      interviewer: "Meera Joshi",
      scheduledAt: "2026-03-01T11:00:00.000Z",
      durationMins: 45,
      location: "Google Meet",
      status: "SCHEDULED",
    },
  },
  // job-11: iOS Developer
  {
    id: "cand-17",
    name: "Ishaan Chopra",
    email: "ishaan.chopra@example.com",
    applicationId: "app-17",
    jobId: "job-11",
    status: "APPLIED",
    appliedAt: "2026-02-26T09:00:00.000Z",
    interview: null,
  },
  {
    id: "cand-18",
    name: "Nisha Bansal",
    email: "nisha.bansal@example.com",
    applicationId: "app-18",
    jobId: "job-11",
    status: "INTERVIEWING",
    appliedAt: "2026-02-25T12:30:00.000Z",
    interview: {
      interviewer: "Vijay Kumar",
      scheduledAt: "2026-02-27T16:00:00.000Z",
      durationMins: 60,
      location: "Office - Room 108",
      status: "SCHEDULED",
    },
  },
  // job-12: Customer Success Manager
  {
    id: "cand-19",
    name: "Tariq Hussain",
    email: "tariq.hussain@example.com",
    applicationId: "app-19",
    jobId: "job-12",
    status: "APPLIED",
    appliedAt: "2026-02-20T16:00:00.000Z",
    interview: null,
  },
  {
    id: "cand-20",
    name: "Simran Kaur",
    email: "simran.kaur@example.com",
    applicationId: "app-20",
    jobId: "job-12",
    status: "SHORTLISTED",
    appliedAt: "2026-02-19T10:15:00.000Z",
    interview: {
      interviewer: "Divya Menon",
      scheduledAt: "2026-02-28T15:30:00.000Z",
      durationMins: 45,
      location: "Zoom",
      status: "SCHEDULED",
    },
  },
  {
    id: "cand-21",
    name: "Aman Dubey",
    email: "aman.dubey@example.com",
    applicationId: "app-21",
    jobId: "job-12",
    status: "REJECTED",
    appliedAt: "2026-02-18T13:00:00.000Z",
    interview: {
      interviewer: "Divya Menon",
      scheduledAt: "2026-02-21T14:00:00.000Z",
      durationMins: 30,
      location: "Google Meet",
      status: "COMPLETED",
      feedback: "Limited experience with enterprise SaaS clients",
      rating: 2,
    },
  },
  // job-3: Frontend Engineer — additional candidates
  {
    id: "cand-22",
    name: "Lavanya Suresh",
    email: "lavanya.suresh@example.com",
    applicationId: "app-22",
    jobId: "job-3",
    status: "APPLIED",
    appliedAt: "2026-02-24T08:30:00.000Z",
    interview: null,
  },
  {
    id: "cand-23",
    name: "Dev Agarwal",
    email: "dev.agarwal@example.com",
    applicationId: "app-23",
    jobId: "job-3",
    status: "SHORTLISTED",
    appliedAt: "2026-02-17T11:00:00.000Z",
    interview: {
      interviewer: "Sanya Sharma",
      scheduledAt: "2026-02-26T14:00:00.000Z",
      durationMins: 60,
      location: "Office - Room 402",
      status: "COMPLETED",
      feedback:
        "Clean code, great TypeScript knowledge, needs more testing experience",
      rating: 3,
    },
  },
];

export async function fetchJobPostings() {
  if (!USE_MOCK_DATA) {
    const response = await api.get(`${HR_MANAGER_API_URL}/jobs`);
    return response.data;
  }
  return { data: MOCK_JOB_POSTINGS };
}

export async function fetchCandidatesForJob(jobId: string) {
  if (!USE_MOCK_DATA) {
    const response = await api.get(
      `${HR_MANAGER_API_URL}/jobs/${jobId}/candidates`,
    );
    return response.data;
  }
  return {
    data: MOCK_CANDIDATES.filter((c) => c.jobId === jobId),
  };
}

// simple client-side create functions for mock mode
export function createJobPosting(posting: {
  title: string;
  department: string;
  vacancies: number;
}) {
  if (!USE_MOCK_DATA) {
    return api.post(`${HR_MANAGER_API_URL}/jobs`, posting);
  }
  const newJob = {
    id: `job-${MOCK_JOB_POSTINGS.length + 1}`,
    ...posting,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  } as any;
  MOCK_JOB_POSTINGS.push(newJob);
  return Promise.resolve({ data: newJob });
}

export function updateCandidateStatus(applicationId: string, status: string) {
  if (!USE_MOCK_DATA) {
    return api.patch(
      `${HR_MANAGER_API_URL}/applications/${applicationId}/status`,
      { status },
    );
  }
  const cand = MOCK_CANDIDATES.find((c) => c.applicationId === applicationId);
  if (cand) {
    cand.status = status;
  }
  return Promise.resolve({ data: cand });
}

export function addInterview(applicationId: string, interview: any) {
  if (!USE_MOCK_DATA) {
    return api.post(
      `${HR_MANAGER_API_URL}/applications/${applicationId}/interviews`,
      interview,
    );
  }
  const cand = MOCK_CANDIDATES.find((c) => c.applicationId === applicationId);
  if (cand) {
    cand.interview = interview;
    cand.status = "INTERVIEWING";
  }
  return Promise.resolve({ data: cand });
}

export function addInterviewReview(
  applicationId: string,
  review: { feedback: string; rating: number },
) {
  if (!USE_MOCK_DATA) {
    return api.patch(
      `${HR_MANAGER_API_URL}/interviews/${applicationId}/review`,
      review,
    );
  }
  const cand = MOCK_CANDIDATES.find((c) => c.applicationId === applicationId);
  if (cand && cand.interview) {
    // interview is loosely typed in mock data, cast to any for mutation
    const iv: any = cand.interview;
    iv.feedback = review.feedback;
    iv.rating = review.rating;
    iv.status = "COMPLETED";
  }
  return Promise.resolve({ data: cand });
}
