import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BriefcaseBusiness,
  Check,
  Download,
  FileText,
  Github,
  LayoutTemplate,
  MonitorSmartphone,
  Plus,
  Printer,
  Sparkles,
  Trash2,
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "ai-resume-builder-data-v1";

const starterResume = {
  name: "Yuda Lin",
  role: "UI / Front-End Intern",
  location: "Seattle, WA",
  email: "louis042200@gmail.com",
  phone: "13758049261",
  summary:
    "Informatics student focused on UI design, front-end interaction, and product-minded web experiences. Comfortable using AI agents to speed up prototyping, code iteration, and resume content refinement.",
  skills: ["HTML", "CSS", "JavaScript", "React", "Figma", "Responsive Design", "AI Agent Workflow"],
  education: [
    {
      school: "University of Washington",
      degree: "B.S. Informatics",
      period: "2023.09 - 2027.03",
      detail: "GPA 3.8/4.0; coursework in web development, UI design, data visualization, and information systems.",
    },
  ],
  projects: [
    {
      title: "PlayPal Game Recommendation Website",
      role: "Front-End Interaction / JavaScript",
      period: "2026 Spring",
      bullets: [
        "Designed the browse-filter-view-details flow for a party game discovery website.",
        "Built JavaScript filter interactions for player count, duration, style, format, and price.",
        "Structured detail pages to make rules, best-fit scenarios, and requirements easier to scan.",
      ],
    },
    {
      title: "Fashion Supply Chain Traceability Platform",
      role: "Requirements Analysis",
      period: "2026 Autumn",
      bullets: [
        "Mapped requirements for real-time tracking, role-based access, supply chain transparency, and customer-facing views.",
        "Created process and information-flow diagrams to clarify system modules and user paths.",
        "Presented feature design, user scenarios, and traceability logic in the final project deck.",
      ],
    },
  ],
  experience: [
    {
      company: "Shanghai Jingzheng Technology Co., Ltd.",
      role: "Finance Intern",
      period: "2025.07 - 2025.08",
      bullets: [
        "Verified vendor invoices and business records with operations and procurement teams.",
        "Supported management reporting for P&L, cash flow, and KPI materials.",
        "Improved accuracy and execution through cross-functional communication and data checks.",
      ],
    },
  ],
};

const templates = {
  studio: {
    name: "Studio",
    description: "Clean UI-focused resume",
  },
  technical: {
    name: "Technical",
    description: "Developer-oriented layout",
  },
};

function loadInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterResume;
  } catch {
    return starterResume;
  }
}

function App() {
  const [resume, setResume] = useState(loadInitialData);
  const [template, setTemplate] = useState("studio");
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
      setSaved(true);
    }, 350);
    return () => window.clearTimeout(id);
  }, [resume]);

  const wordCount = useMemo(() => {
    const raw = JSON.stringify(resume);
    return raw.split(/\s+|。|，|；|、|,/).filter(Boolean).length;
  }, [resume]);

  const updateField = (field, value) => {
    setSaved(false);
    setResume((current) => ({ ...current, [field]: value }));
  };

  const updateListItem = (section, index, field, value) => {
    setSaved(false);
    setResume((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateBullet = (section, itemIndex, bulletIndex, value) => {
    setSaved(false);
    setResume((current) => ({
      ...current,
      [section]: current[section].map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              bullets: item.bullets.map((bullet, nextIndex) => (nextIndex === bulletIndex ? value : bullet)),
            }
          : item,
      ),
    }));
  };

  const addProject = () => {
    setSaved(false);
    setResume((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
          title: "New Front-End Project",
          role: "UI / React Development",
          period: "2026",
          bullets: ["Describe the user problem, your implementation, and the measurable outcome."],
        },
      ],
    }));
  };

  const removeProject = (index) => {
    setSaved(false);
    setResume((current) => ({
      ...current,
      projects: current.projects.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addSkill = () => {
    setSaved(false);
    setResume((current) => ({ ...current, skills: [...current.skills, "New Skill"] }));
  };

  const updateSkill = (index, value) => {
    setSaved(false);
    setResume((current) => ({
      ...current,
      skills: current.skills.map((skill, itemIndex) => (itemIndex === index ? value : skill)),
    }));
  };

  const removeSkill = (index) => {
    setSaved(false);
    setResume((current) => ({ ...current, skills: current.skills.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI Resume Builder</p>
          <h1>Build a polished resume preview from structured content.</h1>
        </div>
        <div className="topbar-actions" aria-label="Resume actions">
          <span className={`save-pill ${saved ? "is-saved" : ""}`}>
            {saved ? <Check size={16} /> : <Sparkles size={16} />}
            {saved ? "Saved" : "Saving"}
          </span>
          <button type="button" className="icon-button" onClick={exportJson} aria-label="Export resume data">
            <Download size={18} />
          </button>
          <button type="button" className="primary-button" onClick={() => window.print()}>
            <Printer size={18} />
            Print / PDF
          </button>
        </div>
      </header>

      <main className="workspace">
        <section className="editor-panel" aria-label="Resume editor">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Editor</p>
              <h2>Content controls</h2>
            </div>
            <span>{wordCount} words</span>
          </div>

          <EditorBlock title="Profile" icon={<FileText size={18} />}>
            <Field label="Name" value={resume.name} onChange={(value) => updateField("name", value)} />
            <Field label="Target role" value={resume.role} onChange={(value) => updateField("role", value)} />
            <div className="field-grid">
              <Field label="Location" value={resume.location} onChange={(value) => updateField("location", value)} />
              <Field label="Phone" value={resume.phone} onChange={(value) => updateField("phone", value)} />
            </div>
            <Field label="Email" value={resume.email} onChange={(value) => updateField("email", value)} />
            <Field
              label="Summary"
              value={resume.summary}
              onChange={(value) => updateField("summary", value)}
              multiline
            />
          </EditorBlock>

          <EditorBlock title="Template" icon={<LayoutTemplate size={18} />}>
            <div className="template-switcher">
              {Object.entries(templates).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  className={template === key ? "template-option is-active" : "template-option"}
                  onClick={() => setTemplate(key)}
                >
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </button>
              ))}
            </div>
          </EditorBlock>

          <EditorBlock title="Skills" icon={<Sparkles size={18} />} action={<SmallButton onClick={addSkill} label="Skill" />}>
            <div className="skill-editor">
              {resume.skills.map((skill, index) => (
                <div className="inline-row" key={`${skill}-${index}`}>
                  <input
                    aria-label={`Skill ${index + 1}`}
                    value={skill}
                    onChange={(event) => updateSkill(index, event.target.value)}
                  />
                  <button type="button" aria-label="Remove skill" onClick={() => removeSkill(index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </EditorBlock>

          <EditorBlock title="Projects" icon={<MonitorSmartphone size={18} />} action={<SmallButton onClick={addProject} label="Project" />}>
            {resume.projects.map((project, index) => (
              <article className="nested-card" key={`${project.title}-${index}`}>
                <div className="nested-card-header">
                  <strong>Project {index + 1}</strong>
                  <button type="button" aria-label="Remove project" onClick={() => removeProject(index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <Field label="Title" value={project.title} onChange={(value) => updateListItem("projects", index, "title", value)} />
                <div className="field-grid">
                  <Field label="Period" value={project.period} onChange={(value) => updateListItem("projects", index, "period", value)} />
                  <Field label="Role" value={project.role} onChange={(value) => updateListItem("projects", index, "role", value)} />
                </div>
                {project.bullets.map((bullet, bulletIndex) => (
                  <Field
                    key={`${bulletIndex}-${project.title}`}
                    label={`Bullet ${bulletIndex + 1}`}
                    value={bullet}
                    onChange={(value) => updateBullet("projects", index, bulletIndex, value)}
                  />
                ))}
              </article>
            ))}
          </EditorBlock>
        </section>

        <section className="preview-panel" aria-label="Resume preview">
          <div className="preview-toolbar">
            <div>
              <p className="eyebrow">Live Preview</p>
              <h2>{templates[template].name} template</h2>
            </div>
            <a className="github-link" href="https://github.com/" target="_blank" rel="noreferrer">
              <Github size={17} />
              GitHub ready
            </a>
          </div>
          <ResumePreview resume={resume} template={template} />
        </section>
      </main>
    </div>
  );
}

function EditorBlock({ title, icon, action, children }) {
  return (
    <section className="editor-block">
      <div className="block-title">
        <span>{icon}</span>
        <h3>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function SmallButton({ onClick, label }) {
  return (
    <button className="small-button" type="button" onClick={onClick}>
      <Plus size={15} />
      {label}
    </button>
  );
}

function Field({ label, value, onChange, multiline = false }) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? (
        <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function ResumePreview({ resume, template }) {
  return (
    <article className={`resume-sheet ${template}`}>
      <header className="resume-header">
        <div>
          <p className="resume-kicker">{resume.role}</p>
          <h2>{resume.name}</h2>
          <p className="resume-summary">{resume.summary}</p>
        </div>
        <div className="contact-box">
          <span>{resume.location}</span>
          <span>{resume.phone}</span>
          <span>{resume.email}</span>
        </div>
      </header>

      <section className="resume-section">
        <h3>Skills</h3>
        <div className="skill-cloud">
          {resume.skills.filter(Boolean).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <h3>Projects</h3>
        {resume.projects.map((project) => (
          <ResumeItem key={project.title} title={project.title} meta={`${project.period} · ${project.role}`} bullets={project.bullets} />
        ))}
      </section>

      <section className="resume-section two-column-section">
        <div>
          <h3>Experience</h3>
          {resume.experience.map((item) => (
            <ResumeItem key={item.company} title={item.company} meta={`${item.period} · ${item.role}`} bullets={item.bullets} />
          ))}
        </div>
        <div>
          <h3>Education</h3>
          {resume.education.map((item) => (
            <div className="resume-item compact" key={item.school}>
              <div className="item-line">
                <strong>{item.school}</strong>
                <span>{item.period}</span>
              </div>
              <p>{item.degree}</p>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

function ResumeItem({ title, meta, bullets }) {
  return (
    <div className="resume-item">
      <div className="item-line">
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
      <ul>
        {bullets.filter(Boolean).map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
