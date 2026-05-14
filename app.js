const app = document.querySelector("#app");

const topics = [
  {
    id: "mobility",
    label: "Traffic & mobility",
    count: 7,
    color: "#2f86dd",
    soft: "#e6f2ff",
    muted: "#9fcdf5",
    icon: "bus"
  },
  {
    id: "schools",
    label: "Schools & kids",
    count: 3,
    color: "#5f9e22",
    soft: "#eef8e6",
    muted: "#b7d88b",
    icon: "school"
  },
  {
    id: "parks",
    label: "Parks & nature",
    count: 5,
    color: "#9cc75d",
    soft: "#f1f8e6",
    muted: "#c9e49b",
    icon: "leaf"
  },
  {
    id: "commerce",
    label: "Local commerce",
    count: 2,
    color: "#f4a01f",
    soft: "#fff3df",
    muted: "#f8bf61",
    icon: "building"
  },
  {
    id: "housing",
    label: "Housing",
    count: 4,
    color: "#8c8c8c",
    soft: "#f4f4f4",
    muted: "#b6b6b6",
    icon: "home"
  },
  {
    id: "budget",
    label: "Budget & finance",
    count: 1,
    color: "#0d9b76",
    soft: "#e6f7f2",
    muted: "#7ed4bd",
    icon: "wallet"
  }
];

const issues = [
  {
    id: "bus",
    topic: "mobility",
    category: "Mobility",
    title: "Improve bus frequency on line 4",
    votes: 142,
    days: 12,
    icon: "bus",
    body: "Many residents experience long waiting times during peak hours.",
    objectives: ["Reduce waiting times", "Improve reliability", "Encourage public transport use"],
    done: "The city analysed data and identified peak-time gaps.",
    phase: "Consultation"
  },
  {
    id: "garden",
    topic: "parks",
    category: "Environment",
    title: "Create a new community garden",
    votes: 98,
    days: 5,
    icon: "leaf",
    body: "Residents proposed converting an unused lot into a garden with shared plots, seating and a small learning area.",
    objectives: ["Bring neighbours together", "Add green space", "Support local biodiversity"],
    done: "A first location check has been completed.",
    phase: "Analysis"
  },
  {
    id: "square",
    topic: "commerce",
    category: "Public spaces",
    title: "Reimagine the central square",
    votes: 76,
    days: 8,
    icon: "building",
    body: "The central square needs safer crossings, clearer walking areas and more space for local market days.",
    objectives: ["Make walking easier", "Support local shops", "Improve seating areas"],
    done: "A draft concept is open for public comments.",
    phase: "Consultation"
  }
];

const activities = [
  {
    id: "crosswalk",
    title: "Safer crosswalk near the school",
    status: "Under review",
    statusColor: "#be185d",
    statusBg: "#fce7f3",
    updated: "Updated today",
    category: "Mobility",
    submitted: "Apr 12"
  },
  {
    id: "parking",
    title: "More bike parking at the station",
    status: "In progress",
    statusColor: "#4f46e5",
    statusBg: "#eef2ff",
    updated: "Updated 3 days ago",
    category: "Mobility",
    submitted: "Apr 4"
  },
  {
    id: "lighting",
    title: "Better lighting on Main Street",
    status: "Decided",
    statusColor: "#047857",
    statusBg: "#d1fae5",
    updated: "Decided on Feb 10",
    category: "Public spaces",
    submitted: "Jan 28"
  }
];

const proposalCategories = [
  { id: "mobility", label: "Mobility", icon: "bus", color: "#2f86dd", soft: "#e6f2ff" },
  { id: "environment", label: "Environment", icon: "leaf", color: "#1f9d51", soft: "#e7f6e9" },
  { id: "spaces", label: "Public spaces", icon: "building", color: "#f47a22", soft: "#fff0e7" },
  { id: "economy", label: "Local economy", icon: "wallet", color: "#5630bd", soft: "#f1ebff" },
  { id: "culture", label: "Culture & events", icon: "star", color: "#f3b51c", soft: "#fff7dd" },
  { id: "other", label: "Other", icon: "more", color: "#858d9b", soft: "#f1f3f6" }
];

const ONBOARDING_KEY = "civicpath_onboarded";
const onboardingDone = () => localStorage.getItem(ONBOARDING_KEY) === "1";

const state = {
  route: parseRoute(),
  selectedTopics: new Set(["mobility", "schools", "commerce"]),
  activeFilter: "All",
  currentIssueId: "bus",
  opinionStep: 1,
  opinion: {
    stance: "support",
    reason: "",
    suggestion: ""
  },
  proposalStep: 1,
  proposal: {
    category: "mobility",
    title: "Safer crosswalk near the school",
    description: "I propose adding an elevated crosswalk and better lighting near the school entrance to improve safety for children and families.",
    location: "Sous-Gare neighborhood",
    beneficiaries: ["Families"],
    impact: "Improves safety"
  },
  activityTab: "All",
  currentActivityId: "crosswalk",
  toast: "",
  onboarding: {
    step: 0, // 0=splash 1=identity 2=address 3=notifications 4=success
    firstName: "",
    lastName: "",
    age: 32,
    street: "",
    city: "",
    postalCode: "",
    neighbourhood: "",
    notifAlerts: true,
    notifVotes: true,
    notifNews: false
  }
};


function parseRoute() {
  const raw = window.location.hash.replace(/^#/, "");
  // Only redirect empty hash to onboarding (or home)
  if (!raw || raw.startsWith("page-")) {
    return onboardingDone() ? "home" : "onboarding";
  }
  // No hash at all → onboarding first time, home after
  if (raw === "onboarding" && onboardingDone()) return "home";
  return raw;
}

function routeTo(route) {
  state.route = route;
  window.location.hash = route;
  render();
}

function topicById(id) {
  return topics.find((topic) => topic.id === id) || topics[0];
}

function issueById(id) {
  return issues.find((issue) => issue.id === id) || issues[0];
}

function activityById(id) {
  return activities.find((activity) => activity.id === id) || activities[0];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function icon(name, size = 20) {
  const common = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
  const paths = {
    bell: '<path d="M15 17h5l-1.4-1.4A3 3 0 0 1 18 13.5V10a6 6 0 0 0-12 0v3.5a3 3 0 0 1-.6 2.1L4 17h5"/><path d="M10 20h4"/>',
    bus: '<path d="M6 17h12"/><path d="M6 17v2"/><path d="M18 17v2"/><path d="M5 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"/><path d="M7 9h10"/><circle cx="8.5" cy="14" r="1"/><circle cx="15.5" cy="14" r="1"/>',
    school: '<path d="M4 10 12 5l8 5-8 5-8-5Z"/><path d="M6 12v4c2.8 2 9.2 2 12 0v-4"/><path d="M20 10v6"/>',
    leaf: '<path d="M5 20c10-1 14-8 14-16-8 0-14 4-14 14"/><path d="M5 20c1-5 4-8 8-10"/>',
    building: '<path d="M4 20h16"/><path d="M7 20V7l7-3v16"/><path d="M14 9h4v11"/><path d="M9 10h2"/><path d="M9 14h2"/><path d="M16 13h1"/>',
    home: '<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
    wallet: '<path d="M4 7h15a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><path d="M16 12h4"/><path d="M16 15h4"/>',
    mapPin: '<path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    activity: '<path d="m6 6 12 12"/><path d="m18 6-12 12"/><circle cx="12" cy="12" r="3"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    document: '<path d="M7 3h7l4 4v14H7Z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };

  return `<svg ${common}>${paths[name] || paths.more}</svg>`;
}

function statusBar() {
  return `
    <div class="status-bar">
      <span>9:41</span>
      <span></span>
      <div class="status-icons" aria-hidden="true">
        <span class="signal"></span>
        <span class="wifi"></span>
        <span class="battery"></span>
      </div>
    </div>
  `;
}

function bottomNav(active) {
  const items = [
    ["home", "Home", "home", "home"],
    ["activity", "My activity", "activity", "activity"],
    ["propose", "Propose", "plus", "propose"],
    ["profile", "Profile", "profile", "profile"]
  ];

  return `
    <nav class="bottom-nav" aria-label="Main navigation">
      ${items
        .map(([route, label, iconName, extra]) => `
          <button class="nav-button ${active === route ? "active" : ""} ${extra === "propose" ? "propose" : ""}" data-action="nav" data-route="${route}" type="button">
            <span class="nav-icon">${icon(iconName, extra === "propose" ? 24 : 21)}</span>
            <span>${label}</span>
          </button>
        `)
        .join("")}
    </nav>
  `;
}

function screen(content, options = {}) {
  const { nav = null, noNav = false } = options;
  return `
    <section class="screen ${noNav ? "no-nav" : ""}">
      <div class="scroll-area">${content}</div>
      ${nav ? bottomNav(nav) : ""}
      ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ""}
    </section>
  `;
}

function topicStyle(topic) {
  return `--topic-border:${topic.color};--topic-soft:${topic.soft};--topic-text:${topic.color};--topic-muted:${topic.muted};`;
}

function tagStyle(issue) {
  const topic = topicById(issue.topic);
  return `--tag-color:${topic.color};--tag-bg:${topic.soft};`;
}

function welcomeScreen() {
  const selectedLabels = topics
    .filter((topic) => state.selectedTopics.has(topic.id))
    .map((topic) => {
      if (topic.id === "mobility") return "Traffic";
      if (topic.id === "schools") return "Schools";
      if (topic.id === "commerce") return "Commerce";
      return topic.label.split(" ")[0];
    })
    .join(" &bull; ");

  return screen(
    `
      <div class="hero-icon" aria-hidden="true"></div>
      <div class="centered-copy">
        <h1 class="title">Welcome to CivicPath</h1>
        <p class="subtitle">Select the topics that matter to you.<br>You will only see what's relevant.</p>
      </div>
      <div class="divider"></div>
      <h2 class="section-title">What matters to you? <span>Pick at least one</span></h2>
      <div class="topic-grid">
        ${topics
          .map((topic) => `
            <button class="topic-card ${state.selectedTopics.has(topic.id) ? "selected" : ""}" style="${topicStyle(topic)}" data-action="toggle-topic" data-topic="${topic.id}" type="button">
              <span class="topic-icon">${icon(topic.icon, 21)}</span>
              <span class="topic-name">${topic.label}</span>
              <span class="topic-count">${topic.count} open issue${topic.count > 1 ? "s" : ""}</span>
            </button>
          `)
          .join("")}
      </div>
      <div class="selection-summary">
        <strong>${state.selectedTopics.size} topics selected</strong>
        <span>${selectedLabels || "Choose one topic"}</span>
      </div>
      <button class="primary-button" data-action="build-path" type="button">Build my CivicPath ${icon("arrowRight", 18)}</button>
    `,
    { noNav: true }
  );
}

function header(title = "Hello Karim") {
  return `
    <header class="header">
      <div class="top-row">
        <div>
          <h1 class="hello">${title}</h1>
          <p class="location">${icon("mapPin", 13)} Sous-Gare neighborhood</p>
        </div>
        <button class="icon-button" data-action="toast" data-message="Notifications are enabled for your tracked topics." type="button" aria-label="Notifications">${icon("bell", 19)}</button>
      </div>
    </header>
  `;
}

function filters() {
  const filterLabels = ["All", "Mobility", "Environment", "Public spaces"];
  return `
    <div class="filter-row" aria-label="Issue filters">
      ${filterLabels
        .map((label) => `
          <button class="chip ${state.activeFilter === label ? "active" : ""}" data-action="filter" data-filter="${label}" type="button">${label}</button>
        `)
        .join("")}
    </div>
  `;
}

function issueCard(issue) {
  return `
    <button class="issue-card" style="${tagStyle(issue)}" data-action="open-issue" data-issue="${issue.id}" type="button">
      <span>
        <span class="issue-tag">${issue.category}</span>
        <strong class="issue-title">${issue.title}</strong>
        <span class="issue-meta"><span>${issue.votes} votes</span><span class="dot">&bull;</span><span>${issue.days} days left</span></span>
      </span>
      <span class="issue-symbol">${icon(issue.icon, 32)}</span>
    </button>
  `;
}

function filteredIssues() {
  return issues.filter((issue) => {
    if (state.activeFilter !== "All" && issue.category !== state.activeFilter) return false;
    return true;
  });
}

function homeScreen() {
  const list = filteredIssues();
  return screen(
    `
      ${header()}
      <section>
        <div class="top-row">
          <h2 class="section-title">Current issues</h2>
          <button class="header-link" data-action="filter" data-filter="All" type="button">See all</button>
        </div>
        ${filters()}
        <div class="issue-list">
          ${list.map(issueCard).join("")}
        </div>
        <button class="idea-card" data-action="nav" data-route="propose" type="button">
          <span>
            <strong>Propose a project for your quartier</strong>
            <span>Title - Budget - Beneficiaries - Impact</span>
          </span>
          ${icon("arrowRight", 24)}
        </button>
      </section>
    `,
    { nav: "home" }
  );
}

function backHeader(title, route = "home") {
  return `
    <div class="back-header">
      <button class="icon-button" data-action="nav" data-route="${route}" type="button" aria-label="Back">${icon("arrowLeft", 20)}</button>
      <h1>${title}</h1>
      <button class="icon-button" data-action="toast" data-message="Saved to your tracked issues." type="button" aria-label="More">${icon("more", 20)}</button>
    </div>
  `;
}

function detailScreen() {
  const issue = issueById(state.currentIssueId);

  return screen(
    `
      ${backHeader(issue.title, "home")}
      <section style="${tagStyle(issue)}">
        <span class="mini-chip">${issue.category}</span>
        <h2 class="detail-title">${issue.title}</h2>
        <p class="issue-meta">${issue.votes} voices - ${issue.days} days left</p>
        <div class="detail-section">
          <h2>Why is it important?</h2>
          <p>${issue.body}</p>
        </div>
        <div class="illustration-row" aria-hidden="true">
          <span class="person"></span>
          <span class="person"></span>
          <span class="bus"></span>
          <span class="bus"></span>
        </div>
        <div class="detail-section">
          <h2>Objectives</h2>
          <div class="objectives">
            ${issue.objectives
              .map((objective) => `<div class="objective"><span class="check-dot">${icon("check", 11)}</span>${objective}</div>`)
              .join("")}
          </div>
        </div>
        <div class="detail-section">
          <div class="info-box">
            <h3>What has been done?</h3>
            <p>${issue.done}</p>
          </div>
        </div>
        <div class="detail-section">
          <h2>Process</h2>
          ${processStepper(["Consultation", "Analysis", "Decision", "Implementation"], issue.phase, false, "green")}
        </div>
      </section>
      <button class="primary-button" data-action="opinion" data-issue="${issue.id}" type="button">Give my opinion</button>
    `,
    { nav: "home" }
  );
}

function processStepper(labels, activeLabel, hideLabels = false, color = "purple") {
  const activeIndex = Math.max(0, labels.indexOf(activeLabel));
  return `
    <div class="stepper stepper-${color}" style="--steps:${labels.length}">
      ${labels
        .map((label, index) => `
          <div class="step ${index < activeIndex ? "done" : ""} ${index === activeIndex ? "active" : ""}">
            ${index === 0 ? "" : '<span class="step-line"></span>'}
            <span class="step-dot"></span>
            ${hideLabels ? "" : `<span class="step-label">${label}</span>`}
          </div>
        `)
        .join("")}
    </div>
  `;
}

function opinionScreen() {
  const issue = issueById(state.currentIssueId);
  const isConfirm = state.opinionStep === 3;

  return screen(
    `
      ${backHeader("Give your opinion", "issue")}
      <section>
        ${processStepper(["Your opinion", "Details", "Confirm"], ["Your opinion", "Details", "Confirm"][state.opinionStep - 1])}
        ${
          state.opinionStep === 1
            ? `
              <h2 class="form-title">What is your position?</h2>
              <div class="choice-list">
                ${opinionChoice("support", "I support this project", "This should move forward.")}
                ${opinionChoice("concerns", "I have concerns", "I support with some conditions.")}
                ${opinionChoice("oppose", "I do not support", "I don't think this is a good idea.")}
              </div>
              <h2 class="form-title" style="margin-top:18px">Why?</h2>
              <textarea class="text-area" data-field="opinion.reason" placeholder="Share your thoughts (optional)">${escapeHtml(state.opinion.reason)}</textarea>
              <div class="wizard-actions single">
                <button class="primary-button purple" data-action="opinion-next" type="button">Next</button>
              </div>
            `
            : ""
        }
        ${
          state.opinionStep === 2
            ? `
              <h2 class="form-title">Add details</h2>
              <p class="field-label">Optional - add a suggestion or extra context.</p>
              <textarea class="text-area" data-field="opinion.suggestion" placeholder="Suggest an alternative or add context (optional)">${escapeHtml(state.opinion.suggestion || "")}</textarea>
              <div class="wizard-actions">
                <button class="secondary-button" data-action="opinion-back" type="button">${icon("arrowLeft", 16)} Back</button>
                <button class="primary-button purple" data-action="opinion-next" type="button">Next ${icon("arrowRight", 16)}</button>
              </div>
            `
            : ""
        }
        ${
          isConfirm
            ? `
              <h2 class="form-title">Confirm your contribution</h2>
              <div class="review-card">
                <dl>
                  <div>
                    <dt>Issue</dt>
                    <dd>${issue.title}</dd>
                  </div>
                  <div>
                    <dt>Your position</dt>
                    <dd>${opinionLabel(state.opinion.stance)}</dd>
                  </div>
                  <div>
                    <dt>Your comment</dt>
                    <dd>${escapeHtml(state.opinion.reason || "No comment added")}</dd>
                  </div>
                </dl>
              </div>
              <div class="wizard-actions">
                <button class="secondary-button" data-action="opinion-back" type="button">${icon("arrowLeft", 16)} Back</button>
                <button class="primary-button purple" data-action="opinion-submit" type="button">Submit</button>
              </div>
            `
            : ""
        }
      </section>
    `,
    { nav: "home" }
  );
}

function opinionChoice(id, title, detail) {
  return `
    <button class="choice ${state.opinion.stance === id ? "selected" : ""}" data-action="select-opinion" data-stance="${id}" type="button">
      <span class="radio"></span>
      <span>
        <strong>${title}</strong>
        <span>${detail}</span>
      </span>
    </button>
  `;
}

function opinionLabel(id) {
  return {
    support: "I support this project",
    concerns: "I have concerns",
    oppose: "I do not support"
  }[id];
}

function proposalScreen() {
  const step = state.proposalStep;
  return screen(
    `
      ${proposalHeader(step)}
      <section>
        ${processStepper(["Choose", "Describe", "Details", "Review"], ["Choose", "Describe", "Details", "Review"][Math.min(step, 4) - 1], true)}
        ${proposalStepContent(step)}
      </section>
    `,
    { noNav: true }
  );
}

function proposalHeader(step) {
  const backAction = step === 1 || step === 5 ? "nav" : "proposal-back";
  const backRoute = step === 1 || step === 5 ? "home" : "";
  return `
    <div class="back-header">
      <button class="icon-button" data-action="${backAction}" ${backRoute ? `data-route="${backRoute}"` : ""} type="button" aria-label="Back">${icon("arrowLeft", 20)}</button>
      <h1>Propose a project</h1>
      <button class="icon-button" data-action="nav" data-route="home" type="button" aria-label="Close">${icon("close", 20)}</button>
    </div>
  `;
}

function proposalStepContent(step) {
  if (step === 1) {
    return `
      <h2 class="form-title">Step 1 - Choose a category</h2>
      <p class="field-label">In which area does your idea fit best?</p>
      <div class="choice-list">
        ${proposalCategories
          .map((category) => `
            <button class="choice category-option ${state.proposal.category === category.id ? "selected" : ""}" style="--option-color:${category.color};--option-soft:${category.soft};" data-action="proposal-category" data-category="${category.id}" type="button">
              <span class="small-icon">${icon(category.icon, 17)}</span>
              <strong>${category.label}</strong>
              <span class="radio"></span>
            </button>
          `)
          .join("")}
      </div>
      <div class="wizard-actions single">
        <button class="primary-button purple" data-action="proposal-next" type="button">Next ${icon("arrowRight", 16)}</button>
      </div>
    `;
  }

  if (step === 2) {
    return `
      <h2 class="form-title">Step 2 - Describe your idea</h2>
      <div class="field-group">
        <label for="proposal-title">Project title</label>
        <input id="proposal-title" class="text-field" data-field="proposal.title" value="${escapeHtml(state.proposal.title)}" maxlength="80">
      </div>
      <div class="field-group">
        <label for="proposal-description">Describe your idea in a few lines...</label>
        <textarea id="proposal-description" class="text-area" data-field="proposal.description" maxlength="500">${escapeHtml(state.proposal.description)}</textarea>
      </div>
      <div class="wizard-actions">
        <button class="secondary-button" data-action="proposal-back" type="button">${icon("arrowLeft", 16)} Back</button>
        <button class="primary-button purple" data-action="proposal-next" type="button">Next ${icon("arrowRight", 16)}</button>
      </div>
    `;
  }

  if (step === 3) {
    return `
      <h2 class="form-title">Step 3 - Add key details</h2>
      <div class="field-group">
        <label for="proposal-location">Where is the project?</label>
        <input id="proposal-location" class="text-field" data-field="proposal.location" value="${escapeHtml(state.proposal.location)}">
      </div>
      <div class="field-group">
        <p class="field-label">Who will benefit?</p>
        <div class="benefit-row">
          ${["Residents", "Families", "Visitors"].map((label) => `<button class="pill ${state.proposal.beneficiaries.includes(label) ? "active" : ""}" data-action="toggle-beneficiary" data-beneficiary="${label}" type="button">${label}</button>`).join("")}
        </div>
      </div>
      <div class="field-group">
        <p class="field-label">What impact will it have?</p>
        <div class="choice-list">
          ${["Improves safety", "Enhances environment", "Strengthens community", "Other impact"].map((label) => `
            <button class="choice ${state.proposal.impact === label ? "selected" : ""}" data-action="proposal-impact" data-impact="${label}" type="button">
              <span class="radio"></span>
              <strong>${label}</strong>
            </button>
          `).join("")}
        </div>
      </div>
      <div class="wizard-actions">
        <button class="secondary-button" data-action="proposal-back" type="button">${icon("arrowLeft", 16)} Back</button>
        <button class="primary-button purple" data-action="proposal-next" type="button">Next ${icon("arrowRight", 16)}</button>
      </div>
    `;
  }

  if (step === 4) {
    const category = proposalCategories.find((item) => item.id === state.proposal.category);
    return `
      <h2 class="form-title">Step 4 - Review & confirm</h2>
      <div class="review-card">
        <dl>
          <div>
            <dt>Category</dt>
            <dd>${category.label}</dd>
          </div>
          <div>
            <dt>Title</dt>
            <dd>${escapeHtml(state.proposal.title)}</dd>
          </div>
          <div>
            <dt>Description</dt>
            <dd>${escapeHtml(state.proposal.description)}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>${escapeHtml(state.proposal.location)}</dd>
          </div>
          <div>
            <dt>Beneficiaries</dt>
            <dd>${state.proposal.beneficiaries.join(", ") || "Residents"}</dd>
          </div>
          <div>
            <dt>Impact</dt>
            <dd>${escapeHtml(state.proposal.impact)}</dd>
          </div>
        </dl>
      </div>
      <div class="wizard-actions">
        <button class="secondary-button" data-action="proposal-back" type="button">${icon("arrowLeft", 16)} Back</button>
        <button class="primary-button purple" data-action="proposal-publish" type="button">Publish</button>
      </div>
    `;
  }

  return `
    <div class="confetti" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="success-icon">${icon("check", 34)}</div>
    <div class="centered-copy">
      <h2 class="title">Your project is live!</h2>
      <p class="subtitle">Thank you for your contribution.<br>Your idea is now visible to the community.</p>
    </div>
    <div class="next-card">
      <h3>What happens next?</h3>
      <div class="next-list">
        <div class="next-item"><span class="small-icon" style="color:#5630bd;background:#f1ebff;">${icon("eye", 16)}</span><span>Residents can view and support your idea.</span></div>
        <div class="next-item"><span class="small-icon" style="color:#5630bd;background:#f1ebff;">${icon("document", 16)}</span><span>Your project may be reviewed by local stakeholders.</span></div>
        <div class="next-item"><span class="small-icon" style="color:#5630bd;background:#f1ebff;">${icon("bell", 16)}</span><span>You will receive updates on the progress.</span></div>
      </div>
    </div>
    <div class="wizard-actions single">
      <button class="primary-button purple" data-action="nav" data-route="activity" type="button">View my project</button>
      <button class="ghost-button" data-action="nav" data-route="home" type="button">Back to home</button>
    </div>
  `;
}

function activityScreen() {
  const rows = activities.filter((activity) => {
    if (state.activityTab === "All") return true;
    return activity.status === state.activityTab;
  });

  return screen(
    `
      ${backHeader("My activity", "home")}
      <div class="tabs" role="tablist" aria-label="Activity status">
        ${["All", "Under review", "In progress", "Decided"]
          .map((tab) => `<button class="tab-button ${state.activityTab === tab ? "active" : ""}" data-action="activity-tab" data-tab="${tab}" type="button">${tab}</button>`)
          .join("")}
      </div>
      <div class="activity-list">
        ${rows.map(activityCard).join("")}
      </div>
    `,
    { nav: "activity" }
  );
}

function activityCard(activity) {
  const isDecided = activity.status === "Decided";
  const indicator = isDecided
    ? `<span class="decided-check" aria-hidden="true">${icon("check", 14)}</span>`
    : `<span class="chevron">${icon("arrowRight", 18)}</span>`;
  return `
    <button class="activity-card" style="--status-color:${activity.statusColor};--status-bg:${activity.statusBg};" data-action="open-activity" data-activity="${activity.id}" type="button">
      <span>
        <span class="status-label">${activity.status}</span>
        <h3>${activity.title}</h3>
        <p>${activity.updated}</p>
      </span>
      ${indicator}
    </button>
  `;
}

function contributionScreen() {
  const activity = activityById(state.currentActivityId);
  return screen(
    `
      ${backHeader("Contribution details", "activity")}
      <section>
        <span class="status-label" style="--status-color:${activity.statusColor};--status-bg:${activity.statusBg};">${activity.status}</span>
        <h2 class="detail-title" style="margin-top:12px">${activity.title}</h2>
        <p class="issue-meta">${activity.category} - Submitted on ${activity.submitted}</p>
        <div class="detail-section">
          <h2>Progress</h2>
          <div class="timeline">
            ${timelineItem("Received", "Your idea has been received.", "Apr 12 &bull; 09:41", "done")}
            ${timelineItem("Validated", "Our team has validated your idea.", "Apr 13 &bull; 14:20", "done")}
            ${timelineItem("Under review", "Mobility Office is currently reviewing your proposal.", "Since Apr 15", "active", "Mobility Office &bull; Decision by Apr 30. We will notify you as soon as a decision is made.")}
            ${timelineItem("Decision", "", "", "")}
            ${timelineItem("Closed", "", "", "")}
          </div>
        </div>
      </section>
    `,
    { nav: "activity" }
  );
}

function timelineItem(title, text, date, status, note = "") {
  return `
    <div class="timeline-item ${status}">
      <span class="timeline-marker">${status === "done" ? icon("check", 10) : ""}</span>
      <div class="timeline-content">
        <div class="timeline-heading">
          <strong>${title}</strong>
          ${date ? `<span>${date}</span>` : ""}
        </div>
        ${text ? `<p>${text}</p>` : ""}
        ${note ? `<div class="timeline-note">${note}</div>` : ""}
      </div>
    </div>
  `;
}

function profileScreen() {
  const ob = state.onboarding;
  const fullName = [ob.firstName, ob.lastName].filter(Boolean).join(" ") || "Citoyen";
  const address = [ob.street, ob.postalCode, ob.city].filter(Boolean).join(", ") || "Non renseignée";
  const neighbourhood = ob.neighbourhood || ob.city || "Non renseigné";

  function toggle(field, on) {
    return `<button class="switch" data-action="ob-toggle" data-field="${field}" type="button" aria-pressed="${on}" style="${on ? "" : "background:#d0d5de"}"></button>`;
  }

  return screen(
    `
      ${header("Mon profil")}

      <div class="ob-summary-card" style="margin-bottom:16px">
        <div class="ob-summary-row">
          <span class="ob-summary-icon" style="background:#e8f3ff;color:#2f6fdb">${icon("profile", 18)}</span>
          <div class="ob-summary-text">
            <strong>${escapeHtml(fullName)}</strong>
            <span>${ob.age} ans</span>
          </div>
        </div>
        <div class="ob-summary-row">
          <span class="ob-summary-icon" style="background:#edf8e6;color:#58a02a">${icon("mapPin", 18)}</span>
          <div class="ob-summary-text">
            <strong>${escapeHtml(neighbourhood)}</strong>
            <span>${escapeHtml(address)}</span>
          </div>
        </div>
      </div>

      <section class="profile-card">
        <div class="profile-row">
          <span><strong>Sujets suivis</strong><span>${state.selectedTopics.size} sélectionnés</span></span>
          <button class="ghost-button" data-action="nav" data-route="welcome" type="button">Modifier</button>
        </div>
        <div class="profile-row">
          <span><strong>Alertes de vote</strong><span>Consultations en cours</span></span>
          ${toggle("notifAlerts", ob.notifAlerts)}
        </div>
        <div class="profile-row">
          <span><strong>Décisions &amp; résultats</strong><span>Mises à jour sur tes propositions</span></span>
          ${toggle("notifVotes", ob.notifVotes)}
        </div>
        <div class="profile-row">
          <span><strong>Actualités du quartier</strong><span>Nouveaux projets près de chez toi</span></span>
          ${toggle("notifNews", ob.notifNews)}
        </div>
        <div class="profile-row">
          <span><strong>Level 1 Observer</strong><span>Lis 2 sujets de plus pour débloquer le vote</span></span>
          ${icon("eye", 20)}
        </div>
      </section>

      <div class="read-progress" style="margin-top:16px">
        <div class="read-progress-row">
          <span>Lire des sujets pour débloquer le vote</span>
          <span>2 / 5</span>
        </div>
        <div class="progress-bar"><span style="width:40%"></span></div>
      </div>
    `,
    { nav: "profile" }
  );
}

/* ─── ONBOARDING SCREENS ──────────────────────────────────── */

function obProgress(active) {
  // 4 steps: identity(1) address(2) notifs(3) success(4)
  return `<div class="ob-progress" aria-hidden="true">
    ${[1,2,3,4].map(i => `<span class="ob-step-dot ${i < active ? 'done' : i === active ? 'active' : ''}"></span>`).join('')}
  </div>`;
}

function onboardingSplashScreen() {
  return `<div class="ob-screen ob-splash">
    <div class="ob-splash-logo">
      ${icon('mapPin', 40)}
    </div>
    <h1>CivicPath</h1>
    <p>Rejoins ta communauté.<br>Participe aux décisions qui façonnent ton quartier.</p>
    <button class="ob-splash-btn" data-action="ob-start" type="button" id="ob-splash-btn">
      Créer mon compte ${icon('arrowRight', 18)}
    </button>
    <p class="ob-splash-hint">Prend moins de 2 minutes</p>
  </div>`;
}

function onboardingStep1Screen() {
  const ob = state.onboarding;
  return `<div class="ob-screen">
    ${obProgress(1)}
    <div class="ob-body">
      <p class="ob-step-label">Étape 1 sur 3</p>
      <h1 class="ob-title">Qui es-tu ?</h1>
      <p class="ob-subtitle">Ces infos restent privées et servent uniquement à personnaliser ton expérience.</p>

      <div class="ob-input-row">
        <div class="ob-field">
          <label for="ob-firstname">Prénom</label>
          <input id="ob-firstname" class="ob-input" data-ob="firstName" type="text" placeholder="Ex. Karim" value="${escapeHtml(ob.firstName)}" autocomplete="given-name">
        </div>
        <div class="ob-field">
          <label for="ob-lastname">Nom</label>
          <input id="ob-lastname" class="ob-input" data-ob="lastName" type="text" placeholder="Ex. Benali" value="${escapeHtml(ob.lastName)}" autocomplete="family-name">
        </div>
      </div>

      <div class="ob-field">
        <label>Ton âge</label>
        <div class="ob-age-row">
          <button class="ob-age-btn" data-action="ob-age" data-dir="-1" type="button" aria-label="Diminuer l'âge">−</button>
          <div>
            <div class="ob-age-value" id="ob-age-display">${ob.age}</div>
            <div class="ob-age-unit">ans</div>
          </div>
          <button class="ob-age-btn" data-action="ob-age" data-dir="1" type="button" aria-label="Augmenter l'âge">+</button>
        </div>
      </div>
    </div>
    <div class="ob-footer">
      <button class="ob-btn-primary" data-action="ob-next" type="button" id="ob-step1-next">Continuer ${icon('arrowRight', 18)}</button>
    </div>
  </div>`;
}

function onboardingStep2Screen() {
  const ob = state.onboarding;
  return `<div class="ob-screen">
    ${obProgress(2)}
    <div class="ob-body">
      <p class="ob-step-label">Étape 2 sur 3</p>
      <h1 class="ob-title">Où habites-tu ?</h1>
      <p class="ob-subtitle">Ton adresse nous permet de t'afficher les actualités de ton quartier.</p>

      <div class="ob-field">
        <label for="ob-street">Rue et numéro</label>
        <input id="ob-street" class="ob-input" data-ob="street" type="text" placeholder="Ex. 14 rue des Alpes" value="${escapeHtml(ob.street)}" autocomplete="street-address">
      </div>

      <div class="ob-input-row">
        <div class="ob-field">
          <label for="ob-postal">Code postal</label>
          <input id="ob-postal" class="ob-input" data-ob="postalCode" type="text" placeholder="1000" value="${escapeHtml(ob.postalCode)}" autocomplete="postal-code" inputmode="numeric">
        </div>
        <div class="ob-field">
          <label for="ob-city">Ville</label>
          <input id="ob-city" class="ob-input" data-ob="city" type="text" placeholder="Lausanne" value="${escapeHtml(ob.city)}" autocomplete="address-level2">
        </div>
      </div>

      <div class="ob-field">
        <label for="ob-neighbourhood">Quartier</label>
        <input id="ob-neighbourhood" class="ob-input" data-ob="neighbourhood" type="text" placeholder="Ex. Sous-Gare, Bellevaux…" value="${escapeHtml(ob.neighbourhood)}">
      </div>
    </div>
    <div class="ob-footer">
      <div style="display:grid;grid-template-columns:auto 1fr;gap:9px">
        <button class="secondary-button" data-action="ob-back" type="button" style="min-width:52px;border-radius:12px">${icon('arrowLeft', 18)}</button>
        <button class="ob-btn-primary" data-action="ob-next" type="button" id="ob-step2-next">Continuer ${icon('arrowRight', 18)}</button>
      </div>
      <button class="ob-btn-skip" data-action="ob-next" type="button">Passer cette étape</button>
    </div>
  </div>`;
}

function onboardingStep3Screen() {
  const ob = state.onboarding;
  function toggle(field, on) {
    return `<button class="ob-toggle ${on ? 'on' : ''}" data-action="ob-toggle" data-field="${field}" type="button" aria-pressed="${on}" aria-label="Activer/désactiver"></button>`;
  }
  return `<div class="ob-screen">
    ${obProgress(3)}
    <div class="ob-body">
      <p class="ob-step-label">Étape 3 sur 3</p>
      <h1 class="ob-title">Tes notifications</h1>
      <p class="ob-subtitle">Reste informé des sujets qui te concernent. Tu peux modifier ça plus tard.</p>

      <div class="ob-notif-card">
        <div class="ob-notif-row">
          <div class="ob-notif-info">
            <strong>${icon('bell', 15)} Alertes de vote</strong>
            <span>Quand un sujet que tu suis passe en consultation</span>
          </div>
          ${toggle('notifAlerts', ob.notifAlerts)}
        </div>
        <div class="ob-divider"></div>
        <div class="ob-notif-row">
          <div class="ob-notif-info">
            <strong>${icon('check', 15)} Décisions &amp; résultats</strong>
            <span>Quand une décision est prise sur tes propositions</span>
          </div>
          ${toggle('notifVotes', ob.notifVotes)}
        </div>
        <div class="ob-divider"></div>
        <div class="ob-notif-row">
          <div class="ob-notif-info">
            <strong>${icon('document', 15)} Actualités du quartier</strong>
            <span>Nouveaux projets et sujets près de chez toi</span>
          </div>
          ${toggle('notifNews', ob.notifNews)}
        </div>
      </div>
    </div>
    <div class="ob-footer">
      <div style="display:grid;grid-template-columns:auto 1fr;gap:9px">
        <button class="secondary-button" data-action="ob-back" type="button" style="min-width:52px;border-radius:12px">${icon('arrowLeft', 18)}</button>
        <button class="ob-btn-primary" data-action="ob-finish" type="button" id="ob-step3-next">Créer mon compte ${icon('check', 18)}</button>
      </div>
      <button class="ob-btn-skip" data-action="ob-finish" type="button">Tout refuser</button>
    </div>
  </div>`;
}

function onboardingSuccessScreen() {
  const ob = state.onboarding;
  const name = ob.firstName || "Citoyen";
  const addr = ob.neighbourhood || ob.city || "ton quartier";
  const notifCount = [ob.notifAlerts, ob.notifVotes, ob.notifNews].filter(Boolean).length;
  return `<div class="ob-screen">
    <div class="ob-body" style="display:flex;flex-direction:column;align-items:stretch">
      <div class="ob-avatar">${icon('profile', 34)}</div>
      <h1 class="ob-success-title">Bienvenue, ${escapeHtml(name)} ! 🎉</h1>
      <p class="ob-success-sub">Ton compte CivicPath est prêt.<br>Tu es connecté à <strong>${escapeHtml(addr)}</strong>.</p>

      <div class="ob-summary-card">
        <div class="ob-summary-row">
          <span class="ob-summary-icon" style="background:#e8f3ff;color:#2f6fdb">${icon('profile', 18)}</span>
          <div class="ob-summary-text">
            <strong>${escapeHtml(ob.firstName || '–')} ${escapeHtml(ob.lastName || '')}</strong>
            <span>${ob.age} ans</span>
          </div>
        </div>
        <div class="ob-summary-row">
          <span class="ob-summary-icon" style="background:#edf8e6;color:#58a02a">${icon('mapPin', 18)}</span>
          <div class="ob-summary-text">
            <strong>${escapeHtml(ob.neighbourhood || ob.city || 'Non renseigné')}</strong>
            <span>${escapeHtml([ob.street, ob.postalCode, ob.city].filter(Boolean).join(', ') || 'Adresse non renseignée')}</span>
          </div>
        </div>
        <div class="ob-summary-row">
          <span class="ob-summary-icon" style="background:#fff3df;color:#f7a11f">${icon('bell', 18)}</span>
          <div class="ob-summary-text">
            <strong>Notifications</strong>
            <span>${notifCount} type${notifCount > 1 ? 's' : ''} activé${notifCount > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="ob-footer">
      <button class="ob-btn-primary" data-action="ob-enter-app" type="button" id="ob-enter-app">Accéder à l'app ${icon('arrowRight', 18)}</button>
    </div>
  </div>`;
}

function onboardingScreen() {
  const step = state.onboarding.step;
  if (step === 0) return onboardingSplashScreen();
  if (step === 1) return onboardingStep1Screen();
  if (step === 2) return onboardingStep2Screen();
  if (step === 3) return onboardingStep3Screen();
  return onboardingSuccessScreen();
}

/* ─── RENDER ──────────────────────────────────────────────── */

function render() {
  const route = state.route;
  const routeMap = {
    onboarding: onboardingScreen,
    welcome: welcomeScreen,
    home: homeScreen,
    issue: detailScreen,
    opinion: opinionScreen,
    propose: proposalScreen,
    activity: activityScreen,
    contribution: contributionScreen,
    profile: profileScreen
  };

  const renderer = routeMap[route] || (onboardingDone() ? homeScreen : onboardingScreen);
  app.innerHTML = renderer();
  document.title = `CivicPath - ${route}`;
}

function showToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 1800);
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;

  // ── Onboarding actions ──────────────────────────────────
  if (action === "ob-start") {
    state.onboarding.step = 1;
    render();
  }

  if (action === "ob-age") {
    const dir = parseInt(target.dataset.dir, 10);
    state.onboarding.age = Math.min(120, Math.max(13, state.onboarding.age + dir));
    render();
  }

  if (action === "ob-toggle") {
    const field = target.dataset.field;
    state.onboarding[field] = !state.onboarding[field];
    render();
  }

  if (action === "ob-back") {
    state.onboarding.step = Math.max(0, state.onboarding.step - 1);
    render();
  }

  if (action === "ob-next") {
    state.onboarding.step = Math.min(4, state.onboarding.step + 1);
    render();
  }

  if (action === "ob-finish") {
    state.onboarding.step = 4;
    render();
  }

  if (action === "ob-enter-app") {
    localStorage.setItem(ONBOARDING_KEY, "1");
    routeTo("welcome");
  }
  // ────────────────────────────────────────────────────────

  if (action === "toggle-topic") {
    const id = target.dataset.topic;
    if (state.selectedTopics.has(id)) {
      if (state.selectedTopics.size > 1) state.selectedTopics.delete(id);
      else showToast("Pick at least one topic.");
    } else {
      state.selectedTopics.add(id);
    }
    render();
  }

  if (action === "build-path") {
    routeTo("home");
  }

  if (action === "filter") {
    state.activeFilter = target.dataset.filter;
    render();
  }

  if (action === "open-issue") {
    state.currentIssueId = target.dataset.issue;
    state.opinionStep = 1;
    routeTo("issue");
  }

  if (action === "opinion") {
    state.currentIssueId = target.dataset.issue;
    state.opinionStep = 1;
    routeTo("opinion");
  }

  if (action === "select-opinion") {
    state.opinion.stance = target.dataset.stance;
    render();
  }

  if (action === "opinion-next") {
    state.opinionStep = Math.min(3, state.opinionStep + 1);
    render();
  }

  if (action === "opinion-back") {
    state.opinionStep = Math.max(1, state.opinionStep - 1);
    render();
  }

  if (action === "opinion-submit") {
    const issue = issueById(state.currentIssueId);
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    activities.unshift({
      id: "vote-" + Date.now(),
      title: issue.title,
      status: "Under review",
      statusColor: "#be185d",
      statusBg: "#fce7f3",
      updated: "Updated today",
      category: issue.category,
      submitted: dateStr
    });

    state.activityTab = "All";
    showToast("Your opinion was submitted and added to My activity.");
    routeTo("activity");
  }

  if (action === "nav") {
    const route = target.dataset.route;
    if (route === "propose") state.proposalStep = Math.max(1, Math.min(state.proposalStep, 4));
    routeTo(route);
  }

  if (action === "proposal-category") {
    state.proposal.category = target.dataset.category;
    render();
  }

  if (action === "proposal-impact") {
    state.proposal.impact = target.dataset.impact;
    render();
  }

  if (action === "toggle-beneficiary") {
    const beneficiary = target.dataset.beneficiary;
    if (state.proposal.beneficiaries.includes(beneficiary)) {
      state.proposal.beneficiaries = state.proposal.beneficiaries.filter((item) => item !== beneficiary);
    } else {
      state.proposal.beneficiaries = [...state.proposal.beneficiaries, beneficiary];
    }
    render();
  }

  if (action === "proposal-next") {
    state.proposalStep = Math.min(4, state.proposalStep + 1);
    render();
  }

  if (action === "proposal-back") {
    state.proposalStep = Math.max(1, state.proposalStep - 1);
    render();
  }

  if (action === "proposal-publish") {
    const category = proposalCategories.find((item) => item.id === state.proposal.category);
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    activities.unshift({
      id: "prop-" + Date.now(),
      title: state.proposal.title,
      status: "Under review",
      statusColor: "#be185d",
      statusBg: "#fce7f3",
      updated: "Updated today",
      category: category.label,
      submitted: dateStr
    });

    state.proposalStep = 5;
    render();
  }

  if (action === "activity-tab") {
    state.activityTab = target.dataset.tab;
    render();
  }

  if (action === "open-activity") {
    state.currentActivityId = target.dataset.activity;
    routeTo("contribution");
  }

  if (action === "toast") {
    showToast(target.dataset.message);
  }
});

app.addEventListener("input", (event) => {
  // Onboarding inputs use data-ob attribute
  const obField = event.target.dataset.ob;
  if (obField) {
    state.onboarding[obField] = event.target.value;
    return;
  }

  const field = event.target.dataset.field;
  if (!field) return;

  const [group, key] = field.split(".");
  state[group][key] = event.target.value;
});

window.addEventListener("hashchange", () => {
  state.route = parseRoute();
  render();
});

render();
