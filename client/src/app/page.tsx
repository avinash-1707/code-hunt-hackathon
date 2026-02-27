"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const MOCK_JOBS = [
  {
    id: "job-1",
    title: "Senior Backend Developer",
    department: "Engineering",
    vacancies: 2,
    status: "OPEN",
    type: "Full-time",
    location: "Remote",
  },
  {
    id: "job-2",
    title: "Product Manager",
    department: "Product",
    vacancies: 1,
    status: "OPEN",
    type: "Full-time",
    location: "Hybrid",
  },
  {
    id: "job-3",
    title: "Frontend Engineer (React)",
    department: "Engineering",
    vacancies: 3,
    status: "OPEN",
    type: "Full-time",
    location: "Remote",
  },
  {
    id: "job-4",
    title: "UX Designer",
    department: "Design",
    vacancies: 1,
    status: "OPEN",
    type: "Full-time",
    location: "On-site",
  },
  {
    id: "job-5",
    title: "Data Scientist",
    department: "Data",
    vacancies: 1,
    status: "OPEN",
    type: "Full-time",
    location: "Hybrid",
  },
  {
    id: "job-6",
    title: "Technical Recruiter",
    department: "HR",
    vacancies: 1,
    status: "OPEN",
    type: "Full-time",
    location: "Remote",
  },
  {
    id: "job-7",
    title: "DevOps Engineer",
    department: "Infrastructure",
    vacancies: 2,
    status: "OPEN",
    type: "Full-time",
    location: "Remote",
  },
  {
    id: "job-8",
    title: "UI Designer",
    department: "Design",
    vacancies: 2,
    status: "OPEN",
    type: "Full-time",
    location: "Hybrid",
  },
  {
    id: "job-9",
    title: "Marketing Specialist",
    department: "Marketing",
    vacancies: 1,
    status: "OPEN",
    type: "Full-time",
    location: "On-site",
  },
  {
    id: "job-10",
    title: "QA Engineer",
    department: "Engineering",
    vacancies: 1,
    status: "OPEN",
    type: "Full-time",
    location: "Remote",
  },
  {
    id: "job-11",
    title: "Content Writer",
    department: "Marketing",
    vacancies: 1,
    status: "OPEN",
    type: "Part-time",
    location: "Remote",
  },
  {
    id: "job-12",
    title: "Customer Success Manager",
    department: "Support",
    vacancies: 1,
    status: "OPEN",
    type: "Full-time",
    location: "Hybrid",
  },
  {
    id: "job-13",
    title: "Business Analyst",
    department: "Product",
    vacancies: 1,
    status: "OPEN",
    type: "Full-time",
    location: "On-site",
  },
  {
    id: "job-14",
    title: "HR Assistant",
    department: "HR",
    vacancies: 1,
    status: "OPEN",
    type: "Full-time",
    location: "Hybrid",
  },
];

const DEPT_COLORS: Record<string, string> = {
  Engineering: "#E8F4FF",
  Product: "#F0EBFF",
  Design: "#FFF0F8",
  Data: "#EBFFF4",
  HR: "#FFFAEB",
  Infrastructure: "#FFF3EB",
  Marketing: "#F0FFF4",
  Support: "#EBF8FF",
};

const DEPT_TEXT: Record<string, string> = {
  Engineering: "#1A6FC4",
  Product: "#6A3AC4",
  Design: "#C43A8A",
  Data: "#1AAA5A",
  HR: "#C48A1A",
  Infrastructure: "#C45A1A",
  Marketing: "#1AC45A",
  Support: "#1A8AC4",
};

const LOCATION_ICON: Record<string, string> = {
  Remote: "🌐",
  Hybrid: "🏠",
  "On-site": "🏢",
};

const depts = [
  "All",
  ...Array.from(new Set(MOCK_JOBS.map((j) => j.department))),
];

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = MOCK_JOBS.filter((job) => {
    const matchesDept =
      activeFilter === "All" || job.department === activeFilter;
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #0D0D1A;
          --ink-soft: #3A3A55;
          --ink-muted: #7A7A99;
          --accent: #5B4FE8;
          --accent-light: #EAE8FF;
          --accent-glow: rgba(91,79,232,0.18);
          --surface: #FAFAFE;
          --card: #FFFFFF;
          --border: #E8E8F0;
          --white: #FFFFFF;
          --green: #22C97D;
        }

        body { font-family: 'DM Sans', sans-serif; background: var(--surface); color: var(--ink); }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          height: 68px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--ink);
          letter-spacing: -0.5px;
          display: flex; align-items: center; gap: 8px;
        }
        .nav-logo-dot {
          width: 8px; height: 8px;
          background: var(--accent);
          border-radius: 50%;
        }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a {
          font-size: 14px; color: var(--ink-soft); text-decoration: none;
          font-weight: 500; transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--accent); }
        .nav-cta {
          background: var(--accent); color: white;
          padding: 9px 20px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          cursor: pointer; border: none;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s, transform 0.2s;
        }
        .nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }

        /* HERO */
        .hero {
          padding-top: 68px;
          min-height: 100vh;
          display: flex; flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #F4F2FF 0%, #FAFAFE 40%, #EEF8FF 100%);
          z-index: 0;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          pointer-events: none;
        }
        .hero-orb-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #B8AFFF 0%, transparent 70%);
          top: -80px; right: -100px;
        }
        .hero-orb-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, #A8DFFF 0%, transparent 70%);
          bottom: 60px; left: -80px;
        }
        .hero-orb-3 {
          width: 240px; height: 240px;
          background: radial-gradient(circle, #C8FFE0 0%, transparent 70%);
          top: 200px; right: 30%;
        }

        /* Grid overlay */
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(91,79,232,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,79,232,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          z-index: 0;
        }

        .hero-inner {
          position: relative; z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 48px 60px;
          flex: 1;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--accent-light);
          color: var(--accent);
          font-size: 12px; font-weight: 600;
          letter-spacing: 1.2px; text-transform: uppercase;
          padding: 6px 14px; border-radius: 100px;
          border: 1px solid rgba(91,79,232,0.2);
          margin-bottom: 28px;
          animation: fadeUp 0.6s ease both;
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px;
          background: var(--green);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--green);
        }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -3px;
          color: var(--ink);
          margin-bottom: 28px;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-title-accent {
          background: linear-gradient(135deg, var(--accent) 0%, #9B8FFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 18px;
          color: var(--ink-soft);
          max-width: 520px;
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 48px;
          animation: fadeUp 0.6s 0.2s ease both;
        }
        .hero-actions {
          display: flex; gap: 16px; align-items: center;
          animation: fadeUp 0.6s 0.3s ease both;
        }
        .btn-primary {
          background: var(--accent); color: white;
          padding: 14px 32px; border-radius: 12px;
          font-size: 15px; font-weight: 600;
          cursor: pointer; border: none;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(91,79,232,0.3);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(91,79,232,0.4); }
        .btn-secondary {
          color: var(--ink-soft);
          padding: 14px 24px; border-radius: 12px;
          font-size: 15px; font-weight: 500;
          cursor: pointer; border: 1.5px solid var(--border);
          background: white;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

        /* Stats bar */
        .hero-stats {
          display: flex; gap: 0;
          border-top: 1px solid var(--border);
          margin-top: 80px;
          animation: fadeUp 0.6s 0.4s ease both;
        }
        .stat-item {
          flex: 1; padding: 32px 0;
          border-right: 1px solid var(--border);
        }
        .stat-item:last-child { border-right: none; }
        .stat-number {
          font-family: 'Syne', sans-serif;
          font-size: 36px; font-weight: 800;
          color: var(--ink);
          letter-spacing: -1.5px;
        }
        .stat-number span { color: var(--accent); }
        .stat-label {
          font-size: 13px;
          color: var(--ink-muted);
          margin-top: 4px;
          font-weight: 400;
        }

        /* SECTION */
        .section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 48px;
        }
        .section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 40px;
          flex-wrap: wrap; gap: 20px;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 36px; font-weight: 800;
          letter-spacing: -1.5px;
          color: var(--ink);
        }
        .section-count {
          font-size: 14px; color: var(--ink-muted);
          font-weight: 400; margin-top: 6px;
        }

        /* SEARCH & FILTER */
        .search-bar {
          position: relative; margin-bottom: 24px;
        }
        .search-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: var(--ink-muted); font-size: 16px;
          pointer-events: none;
        }
        .search-input {
          width: 100%; padding: 14px 16px 14px 44px;
          border: 1.5px solid var(--border); border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: var(--ink);
          background: white;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px var(--accent-glow);
        }
        .filter-row {
          display: flex; gap: 8px; flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .filter-btn {
          padding: 8px 18px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          border: 1.5px solid var(--border);
          background: white; color: var(--ink-soft);
          transition: all 0.15s;
        }
        .filter-btn:hover { border-color: var(--accent); color: var(--accent); }
        .filter-btn.active {
          background: var(--accent); color: white;
          border-color: var(--accent);
        }

        /* JOB GRID */
        .job-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }
        .job-card {
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 24px 24px 20px;
          cursor: pointer;
          transition: all 0.22s;
          position: relative;
          overflow: hidden;
        }
        .job-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), #9B8FFF);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .job-card:hover {
          border-color: rgba(91,79,232,0.3);
          box-shadow: 0 12px 40px rgba(91,79,232,0.1);
          transform: translateY(-3px);
        }
        .job-card:hover::before { transform: scaleX(1); }

        .card-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 16px;
        }
        .dept-badge {
          padding: 5px 12px; border-radius: 100px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .vacancies-badge {
          font-size: 12px;
          color: var(--green);
          font-weight: 600;
          background: rgba(34,201,125,0.1);
          padding: 4px 10px; border-radius: 100px;
        }
        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.3px;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        .card-meta {
          display: flex; gap: 16px; flex-wrap: wrap;
        }
        .meta-tag {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; color: var(--ink-muted);
          font-weight: 400;
        }
        .card-footer {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
          display: flex; justify-content: flex-end;
        }
        .apply-link {
          font-size: 13px; font-weight: 600;
          color: var(--accent);
          display: flex; align-items: center; gap: 4px;
          transition: gap 0.2s;
        }
        .job-card:hover .apply-link { gap: 8px; }

        /* EMPTY */
        .empty-state {
          text-align: center; padding: 80px 20px;
          color: var(--ink-muted);
        }
        .empty-state h3 {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 700;
          color: var(--ink-soft); margin-bottom: 8px;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(13,13,26,0.6);
          backdrop-filter: blur(8px);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        .modal {
          background: white;
          border-radius: 24px;
          width: 100%; max-width: 480px;
          padding: 36px;
          position: relative;
          animation: slideUp 0.3s ease;
          box-shadow: 0 40px 100px rgba(0,0,0,0.2);
        }
        .modal-close {
          position: absolute; top: 20px; right: 20px;
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 50%;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 16px;
          color: var(--ink-muted);
          transition: all 0.15s;
        }
        .modal-close:hover { background: var(--border); color: var(--ink); }
        .modal-badge {
          display: inline-flex; align-items: center; gap: 6px;
          margin-bottom: 12px;
        }
        .modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px; font-weight: 800;
          letter-spacing: -1px;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .modal-dept {
          font-size: 14px; color: var(--ink-muted);
          margin-bottom: 28px;
        }
        .field { margin-bottom: 18px; }
        .field label {
          display: block;
          font-size: 13px; font-weight: 600;
          color: var(--ink-soft);
          margin-bottom: 6px;
          letter-spacing: 0.2px;
        }
        .field input, .field textarea {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--ink);
          background: var(--surface);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field input:focus, .field textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px var(--accent-glow);
          background: white;
        }
        .field textarea { height: 80px; resize: none; }
        .modal-submit {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, var(--accent) 0%, #7B6FF0 100%);
          color: white;
          border: none; border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(91,79,232,0.3);
        }
        .modal-submit:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(91,79,232,0.4); }

        /* SUCCESS */
        .success-state {
          text-align: center; padding: 20px 0;
        }
        .success-icon {
          font-size: 52px; margin-bottom: 16px;
        }
        .success-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px; font-weight: 800;
          color: var(--ink); margin-bottom: 8px;
        }
        .success-subtitle {
          color: var(--ink-muted); font-size: 15px; line-height: 1.6;
        }

        /* FOOTER */
        .footer {
          border-top: 1px solid var(--border);
          padding: 36px 48px;
          display: flex; align-items: center; justify-content: space-between;
          max-width: 100%;
          color: var(--ink-muted); font-size: 13px;
        }
        .footer-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; color: var(--ink);
          font-size: 16px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .nav-links { display: none; }
          .hero-inner { padding: 60px 20px 40px; }
          .hero-title { letter-spacing: -2px; }
          .section { padding: 60px 20px; }
          .footer { padding: 24px 20px; flex-direction: column; gap: 12px; text-align: center; }
          .hero-stats { overflow-x: auto; }
          .stat-item { min-width: 140px; padding: 24px 0; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-dot" />
          TalentHQ
        </div>
        <div className="nav-links">
          <a href="#">About</a>
          <a href="#">Culture</a>
          <a href="#">Benefits</a>
          <a href="#">Open Roles</a>
        </div>
        <Link href="/login">
          <button className="nav-cta">Sign In</button>
        </Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-inner">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" />
            {MOCK_JOBS.length} open positions
          </div>

          <h1 className="hero-title">
            Find your next
            <br />
            <span className="hero-title-accent">great hire.</span>
          </h1>

          <p className="hero-subtitle">
            TalentHQ connects exceptional talent with teams that move fast.
            Streamlined hiring, smarter decisions, and careers worth pursuing.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => {
                document
                  .getElementById("positions")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Browse Roles →
            </button>
            <button className="btn-secondary">Learn More</button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">
                14<span>+</span>
              </div>
              <div className="stat-label">Open Positions</div>
            </div>
            <div className="stat-item" style={{ paddingLeft: 40 }}>
              <div className="stat-number">
                8<span>+</span>
              </div>
              <div className="stat-label">Departments</div>
            </div>
            <div className="stat-item" style={{ paddingLeft: 40 }}>
              <div className="stat-number">
                3<span>×</span>
              </div>
              <div className="stat-label">Faster Hiring</div>
            </div>
            <div className="stat-item" style={{ paddingLeft: 40 }}>
              <div className="stat-number">
                98<span>%</span>
              </div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* JOBS */}
      <section className="section" id="positions">
        <div className="section-header">
          <div>
            <h2 className="section-title">Open Positions</h2>
            <p className="section-count">
              {filtered.length} role{filtered.length !== 1 ? "s" : ""} matching
              your criteria
            </p>
          </div>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by role or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-row">
          {depts.map((dept) => (
            <button
              key={dept}
              className={`filter-btn${activeFilter === dept ? " active" : ""}`}
              onClick={() => setActiveFilter(dept)}
            >
              {dept}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <h3>No matching roles</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="job-grid">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="job-card"
                onClick={() => {
                  setSelectedJob(job);
                  setSubmitted(false);
                  setFormData({ name: "", email: "", resume: "", message: "" });
                }}
              >
                <div className="card-top">
                  <div
                    className="dept-badge"
                    style={{
                      background: DEPT_COLORS[job.department] || "#F0F0FF",
                      color: DEPT_TEXT[job.department] || "#5B4FE8",
                    }}
                  >
                    {job.department}
                  </div>
                  <div className="vacancies-badge">
                    {job.vacancies}{" "}
                    {job.vacancies === 1 ? "vacancy" : "vacancies"}
                  </div>
                </div>

                <div className="card-title">{job.title}</div>

                <div className="card-meta">
                  <div className="meta-tag">
                    <span>💼</span> {job.type}
                  </div>
                  <div className="meta-tag">
                    <span>{LOCATION_ICON[job.location]}</span> {job.location}
                  </div>
                </div>

                <div className="card-footer">
                  <div className="apply-link">
                    Apply now <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">TalentHQ</div>
        <div>© 2025 TalentHQ. All rights reserved.</div>
        <div>Made for great teams.</div>
      </footer>

      {/* MODAL */}
      {selectedJob && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedJob(null);
          }}
        >
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setSelectedJob(null)}
            >
              ✕
            </button>

            {submitted ? (
              <div className="success-state">
                <div className="success-icon">✅</div>
                <div className="success-title">Application Sent!</div>
                <p className="success-subtitle">
                  Thanks for applying to <strong>{selectedJob.title}</strong>.
                  We'll review your application and be in touch within 5–7
                  business days.
                </p>
              </div>
            ) : (
              <>
                <div className="modal-badge">
                  <div
                    className="dept-badge"
                    style={{
                      background:
                        DEPT_COLORS[selectedJob.department] || "#F0F0FF",
                      color: DEPT_TEXT[selectedJob.department] || "#5B4FE8",
                    }}
                  >
                    {selectedJob.department}
                  </div>
                </div>
                <div className="modal-title">Apply for this Role</div>
                <div className="modal-dept">
                  {selectedJob.title} · {selectedJob.location} ·{" "}
                  {selectedJob.type}
                </div>

                <form onSubmit={handleApply}>
                  <div className="field">
                    <label>Full Name *</label>
                    <input
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Resume / Portfolio URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.resume}
                      onChange={(e) =>
                        setFormData({ ...formData, resume: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Why are you a great fit?</label>
                    <textarea
                      placeholder="Tell us a bit about yourself..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit" className="modal-submit">
                    Submit Application →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
