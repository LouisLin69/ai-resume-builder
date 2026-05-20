import React, { useEffect, useId, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Check,
  Download,
  FileText,
  Github,
  GraduationCap,
  LayoutTemplate,
  LogIn,
  MonitorSmartphone,
  Plus,
  Printer,
  Sparkles,
  Trash2,
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "ai-resume-builder-blank-workspace-v3";
const SESSION_KEY = "ai-resume-builder-session";

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createBlankResume() {
  return {
    name: "",
    role: "",
    location: "",
    email: "",
    phone: "",
    summary: "",
    skills: [],
    education: [],
    projects: [],
    experience: [],
  };
}

function createBullet(value) {
  return { id: createId("bullet"), value };
}

function createSampleResume() {
  return {
    name: "Alex Chen",
    role: "UI / Front-End Intern",
    location: "Seattle, WA",
    email: "alex@example.com",
    phone: "1234567890",
    summary:
      "Informatics student focused on UI design, front-end development, and user-centered web experiences.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Figma", "Responsive Design"].map((value) => ({
      id: createId("skill"),
      value,
    })),
    education: [
      {
        id: createId("education"),
        school: "University Name",
        degree: "B.S. Informatics",
        period: "2023 - 2027",
        detail: "Relevant coursework in web development, UI design, data visualization, and information systems.",
      },
    ],
    projects: [
      {
        id: createId("project"),
        title: "Portfolio Website",
        role: "Front-End Development",
        period: "2026",
        bullets: [
          createBullet("Built a responsive website to present projects, experience, and design work."),
          createBullet("Created reusable UI sections and refined visual hierarchy for better readability."),
          createBullet("Deployed the project online for portfolio and resume review."),
        ],
      },
    ],
    experience: [],
  };
}

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

function normalizeBullets(bullets = []) {
  return bullets.map((bullet) =>
    typeof bullet === "string"
      ? createBullet(bullet)
      : { id: bullet.id || createId("bullet"), value: bullet.value || "" },
  );
}

function normalizeResume(data) {
  const base = createBlankResume();
  const next = { ...base, ...data };

  return {
    ...next,
    skills: (next.skills || []).map((skill) =>
      typeof skill === "string"
        ? { id: createId("skill"), value: skill }
        : { id: skill.id || createId("skill"), value: skill.value || "" },
    ),
    projects: (next.projects || []).map((project) => ({
      ...project,
      id: project.id || createId("project"),
      bullets: normalizeBullets(project.bullets),
    })),
    experience: (next.experience || []).map((item) => ({
      ...item,
      id: item.id || createId("experience"),
      bullets: normalizeBullets(item.bullets),
    })),
    education: (next.education || []).map((item) => ({
      ...item,
      id: item.id || createId("education"),
    })),
  };
}

function loadInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeResume(JSON.parse(saved)) : createBlankResume();
  } catch {
    return createBlankResume();
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem(SESSION_KEY) === "active");
  const [resume, setResume] = useState(loadInitialData);
  const [template, setTemplate] = useState("studio");
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    const id = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
      setSaved(true);
    }, 350);
    return () => window.clearTimeout(id);
  }, [resume, isLoggedIn]);

  const wordCount = useMemo(() => {
    const raw = JSON.stringify(resume);
    return raw.split(/\s+|。|，|；|、|,/).filter(Boolean).length;
  }, [resume]);

  const login = (event) => {
    event.preventDefault();
    sessionStorage.setItem(SESSION_KEY, "active");
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
  };

  const replaceResume = (nextResume) => {
    setSaved(false);
    setResume(normalizeResume(nextResume));
  };

  const clearWorkspace = () => {
    if (!window.confirm("Clear this browser's saved resume and start from a blank workspace?")) return;
    localStorage.removeItem(STORAGE_KEY);
    replaceResume(createBlankResume());
  };

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
              bullets: item.bullets.map((bullet, nextIndex) =>
                nextIndex === bulletIndex ? { ...bullet, value } : bullet,
              ),
            }
          : item,
      ),
    }));
  };

  const addBullet = (section, itemIndex) => {
    setSaved(false);
    setResume((current) => ({
      ...current,
      [section]: current[section].map((item, index) =>
        index === itemIndex
          ? { ...item, bullets: [...item.bullets, createBullet("Describe your work and impact.")] }
          : item,
      ),
    }));
  };

  const addSkill = () => {
    setSaved(false);
    setResume((current) => ({ ...current, skills: [...current.skills, { id: createId("skill"), value: "" }] }));
  };

  const updateSkill = (index, value) => {
    setSaved(false);
    setResume((current) => ({
      ...current,
      skills: current.skills.map((skill, itemIndex) => (itemIndex === index ? { ...skill, value } : skill)),
    }));
  };

  const removeSkill = (index) => {
    setSaved(false);
    setResume((current) => ({ ...current, skills: current.skills.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const addItem = (section) => {
    setSaved(false);
    const templatesBySection = {
      projects: {
        id: createId("project"),
        title: "",
        role: "",
        period: "",
        bullets: [createBullet("")],
      },
      experience: {
        id: createId("experience"),
        company: "",
        role: "",
        period: "",
        bullets: [createBullet("")],
      },
      education: {
        id: createId("education"),
        school: "",
        degree: "",
        period: "",
        detail: "",
      },
    };
    setResume((current) => ({ ...current, [section]: [...current[section], templatesBySection[section]] }));
  };

  const removeItem = (section, index) => {
    setSaved(false);
    setResume((current) => ({ ...current, [section]: current[section].filter((_, itemIndex) => itemIndex !== index) }));
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

  if (!isLoggedIn) {
    return <LoginScreen onSubmit={login} />;
  }

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
          <button type="button" className="secondary-button" onClick={clearWorkspace}>
            Blank
          </button>
          <button type="button" className="secondary-button" onClick={() => replaceResume(createSampleResume())}>
            Sample
          </button>
          <button type="button" className="icon-button" onClick={exportJson} aria-label="Export resume data">
            <Download size={18} />
          </button>
          <button type="button" className="primary-button" onClick={() => window.print()}>
            <Printer size={18} />
            Print / PDF
          </button>
          <button type="button" className="secondary-button" onClick={logout}>
            Sign out
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
                <div className="inline-row" key={skill.id}>
                  <input
                    aria-label={`Skill ${index + 1}`}
                    value={skill.value}
                    onChange={(event) => updateSkill(index, event.target.value)}
                  />
                  <button type="button" aria-label="Remove skill" onClick={() => removeSkill(index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {resume.skills.length === 0 && <p className="empty-note">Add skills to show them in the preview.</p>}
            </div>
          </EditorBlock>

          <ProjectEditor
            items={resume.projects}
            onAdd={() => addItem("projects")}
            onRemove={(index) => removeItem("projects", index)}
            onChange={(index, field, value) => updateListItem("projects", index, field, value)}
            onBulletChange={(index, bulletIndex, value) => updateBullet("projects", index, bulletIndex, value)}
            onAddBullet={(index) => addBullet("projects", index)}
          />

          <ExperienceEditor
            items={resume.experience}
            onAdd={() => addItem("experience")}
            onRemove={(index) => removeItem("experience", index)}
            onChange={(index, field, value) => updateListItem("experience", index, field, value)}
            onBulletChange={(index, bulletIndex, value) => updateBullet("experience", index, bulletIndex, value)}
            onAddBullet={(index) => addBullet("experience", index)}
          />

          <EducationEditor
            items={resume.education}
            onAdd={() => addItem("education")}
            onRemove={(index) => removeItem("education", index)}
            onChange={(index, field, value) => updateListItem("education", index, field, value)}
          />
        </section>

        <section className="preview-panel" aria-label="Resume preview">
          <div className="preview-toolbar">
            <div>
              <p className="eyebrow">Live Preview</p>
              <h2>{templates[template].name} template</h2>
            </div>
            <a className="github-link" href="https://github.com/LouisLin69/ai-resume-builder" target="_blank" rel="noreferrer">
              <Github size={17} />
              GitHub
            </a>
          </div>
          <ResumePreview resume={resume} template={template} />
        </section>
      </main>
    </div>
  );
}

function LoginScreen({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">AI Resume Builder</p>
        <h1>Sign in to start a blank resume.</h1>
        <p>
          This demo accepts any email and password. Each visitor gets a private blank workspace saved only in
          their own browser.
        </p>
        <form onSubmit={onSubmit}>
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Password" value={password} onChange={setPassword} password />
          <button type="submit" className="primary-button login-button">
            <LogIn size={18} />
            Enter builder
          </button>
        </form>
      </section>
    </main>
  );
}

function ProjectEditor({ items, onAdd, onRemove, onChange, onBulletChange, onAddBullet }) {
  return (
    <EditorBlock title="Projects" icon={<MonitorSmartphone size={18} />} action={<SmallButton onClick={onAdd} label="Project" />}>
      {items.map((project, index) => (
        <article className="nested-card" key={project.id}>
          <div className="nested-card-header">
            <strong>Project {index + 1}</strong>
            <button type="button" aria-label="Remove project" onClick={() => onRemove(index)}>
              <Trash2 size={16} />
            </button>
          </div>
          <Field label="Title" value={project.title} onChange={(value) => onChange(index, "title", value)} />
          <div className="field-grid">
            <Field label="Period" value={project.period} onChange={(value) => onChange(index, "period", value)} />
            <Field label="Role" value={project.role} onChange={(value) => onChange(index, "role", value)} />
          </div>
          {project.bullets.map((bullet, bulletIndex) => (
            <Field
              key={bullet.id}
              label={`Bullet ${bulletIndex + 1}`}
              value={bullet.value}
              onChange={(value) => onBulletChange(index, bulletIndex, value)}
            />
          ))}
          <SmallButton onClick={() => onAddBullet(index)} label="Bullet" />
        </article>
      ))}
      {items.length === 0 && <p className="empty-note">Add a project to document your work.</p>}
    </EditorBlock>
  );
}

function ExperienceEditor({ items, onAdd, onRemove, onChange, onBulletChange, onAddBullet }) {
  return (
    <EditorBlock title="Experience" icon={<FileText size={18} />} action={<SmallButton onClick={onAdd} label="Experience" />}>
      {items.map((item, index) => (
        <article className="nested-card" key={item.id}>
          <div className="nested-card-header">
            <strong>Experience {index + 1}</strong>
            <button type="button" aria-label="Remove experience" onClick={() => onRemove(index)}>
              <Trash2 size={16} />
            </button>
          </div>
          <Field label="Company" value={item.company} onChange={(value) => onChange(index, "company", value)} />
          <div className="field-grid">
            <Field label="Period" value={item.period} onChange={(value) => onChange(index, "period", value)} />
            <Field label="Role" value={item.role} onChange={(value) => onChange(index, "role", value)} />
          </div>
          {item.bullets.map((bullet, bulletIndex) => (
            <Field
              key={bullet.id}
              label={`Bullet ${bulletIndex + 1}`}
              value={bullet.value}
              onChange={(value) => onBulletChange(index, bulletIndex, value)}
            />
          ))}
          <SmallButton onClick={() => onAddBullet(index)} label="Bullet" />
        </article>
      ))}
      {items.length === 0 && <p className="empty-note">Add work, internship, leadership, or volunteer experience.</p>}
    </EditorBlock>
  );
}

function EducationEditor({ items, onAdd, onRemove, onChange }) {
  return (
    <EditorBlock title="Education" icon={<GraduationCap size={18} />} action={<SmallButton onClick={onAdd} label="Education" />}>
      {items.map((item, index) => (
        <article className="nested-card" key={item.id}>
          <div className="nested-card-header">
            <strong>Education {index + 1}</strong>
            <button type="button" aria-label="Remove education" onClick={() => onRemove(index)}>
              <Trash2 size={16} />
            </button>
          </div>
          <Field label="School" value={item.school} onChange={(value) => onChange(index, "school", value)} />
          <div className="field-grid">
            <Field label="Period" value={item.period} onChange={(value) => onChange(index, "period", value)} />
            <Field label="Degree" value={item.degree} onChange={(value) => onChange(index, "degree", value)} />
          </div>
          <Field label="Detail" value={item.detail} onChange={(value) => onChange(index, "detail", value)} />
        </article>
      ))}
      {items.length === 0 && <p className="empty-note">Add your school, degree, and relevant coursework.</p>}
    </EditorBlock>
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

function Field({ label, value, onChange, multiline = false, password = false }) {
  const reactId = useId();
  const id = `${reactId}-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? (
        <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input id={id} type={password ? "password" : "text"} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function ResumePreview({ resume, template }) {
  const hasSkills = resume.skills.some((skill) => skill.value);
  const hasProjects = resume.projects.length > 0;
  const hasExperience = resume.experience.length > 0;
  const hasEducation = resume.education.length > 0;

  return (
    <article className={`resume-sheet ${template}`}>
      <header className="resume-header">
        <div>
          <p className="resume-kicker">{resume.role || "Target role"}</p>
          <h2>{resume.name || "Your Name"}</h2>
          <p className="resume-summary">{resume.summary || "Write a concise summary that highlights your focus, strengths, and target role."}</p>
        </div>
        <div className="contact-box">
          <span>{resume.location || "Location"}</span>
          <span>{resume.phone || "Phone"}</span>
          <span>{resume.email || "Email"}</span>
        </div>
      </header>

      <section className="resume-section">
        <h3>Skills</h3>
        {hasSkills ? (
          <div className="skill-cloud">
            {resume.skills
              .filter((skill) => skill.value)
              .map((skill) => (
                <span key={skill.id}>{skill.value}</span>
              ))}
          </div>
        ) : (
          <p className="preview-empty">Add skills from the editor.</p>
        )}
      </section>

      <section className="resume-section">
        <h3>Projects</h3>
        {hasProjects ? (
          resume.projects.map((project) => (
            <ResumeItem
              key={project.id}
              title={project.title}
              meta={`${project.period} · ${project.role}`}
              bullets={project.bullets}
            />
          ))
        ) : (
          <p className="preview-empty">Add projects to show your work.</p>
        )}
      </section>

      <section className="resume-section two-column-section">
        <div>
          <h3>Experience</h3>
          {hasExperience ? (
            resume.experience.map((item) => (
              <ResumeItem
                key={item.id}
                title={item.company}
                meta={`${item.period} · ${item.role}`}
                bullets={item.bullets}
              />
            ))
          ) : (
            <p className="preview-empty">Add internship, work, or leadership experience.</p>
          )}
        </div>
        <div>
          <h3>Education</h3>
          {hasEducation ? (
            resume.education.map((item) => (
              <div className="resume-item compact" key={item.id}>
                <div className="item-line">
                  <strong>{item.school}</strong>
                  <span>{item.period}</span>
                </div>
                <p>{item.degree}</p>
                <p>{item.detail}</p>
              </div>
            ))
          ) : (
            <p className="preview-empty">Add education details.</p>
          )}
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
        {bullets
          .filter((bullet) => bullet.value)
          .map((bullet) => (
            <li key={bullet.id}>{bullet.value}</li>
          ))}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
