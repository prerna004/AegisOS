// ============================================================================
// Module Group E: Human Resources & Workplace Culture
// Replaces: Zoho People, Recruit, Connect
// Composable Foundation: Frappe HR / OrangeHRM
// Autonomous Agents: AI Recruiter & Screener, HR Policy Concierge, Onboarding Provisioning
// ============================================================================

const HrModule = {
    async render(container) {
        const [empRes, candRes] = await Promise.all([
            fetch('/api/hr/employees').then(r => r.json()),
            fetch('/api/hr/candidates').then(r => r.json())
        ]);

        const employees = empRes || [];
        const candidates = candRes || [];

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">Human Resources & Workplace Culture</h2>
                            <span class="badge badge-indigo">Module Group E</span>
                            <span class="badge badge-emerald">Frappe HR Core</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            Dynamic org chart, ATS resume benchmarking, automated PTO concierges, and zero-touch identity onboarding.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="HrModule.openPtoModal()">🌴 Request PTO Leave</button>
                        <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Screen incoming candidate resumes against Senior Distributed Systems rubric', 'agent-ai-recruiter')">
                            ⚡ Run AI Recruiter
                        </button>
                    </div>
                </div>

                <!-- Employees & ATS Split -->
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                    <!-- Employee Directory & Org Chart -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Employee Directory & Engineering Pod</h3>
                            <span class="badge badge-indigo">${employees.length} Active Staff</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            ${employees.map(e => `
                                <div class="glass-card" style="padding:12px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, #6366f1, #06b6d4); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:#fff;">
                                            ${e.name.split(' ').map(n=>n[0]).join('')}
                                        </div>
                                        <div>
                                            <div style="font-weight:600; font-size:13px; color:var(--text-primary);">${e.name}</div>
                                            <div style="font-size:11px; color:var(--text-secondary);">${e.title} • ${e.department}</div>
                                        </div>
                                    </div>
                                    <div style="text-align:right;">
                                        <span class="badge badge-emerald">PTO: ${e.pto_balance} days</span>
                                        <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${e.email}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- ATS Candidate Screening Pipeline -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">ATS Applicant Tracking Pipeline</h3>
                            <span class="badge badge-cyan">Automated Resume Parser</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${candidates.map(c => `
                                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:12px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <span style="font-weight:600; font-size:13px; color:var(--text-primary);">${c.name}</span>
                                        <span class="badge ${c.match_score >= 90 ? 'badge-emerald' : 'badge-indigo'}">
                                            Match: ${c.match_score}%
                                        </span>
                                    </div>
                                    <div style="font-size:11px; color:#818cf8; margin-top:2px;">Role: ${c.applied_role}</div>
                                    <p style="font-size:11px; color:var(--text-secondary); margin-top:6px; line-height:1.4;">${c.resume_summary}</p>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                                        <span class="badge badge-amber">${c.status}</span>
                                        <button class="btn-secondary" style="font-size:10px; padding:2px 6px;" onclick="Copilot.sendQuickPrompt('Initiate zero-touch onboarding credential provisioning for ${c.name}', 'agent-onboarding-provisioning')">
                                            🚀 Provision Onboarding
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    openPtoModal() {
        Copilot.sendQuickPrompt('How many days of PTO do I have remaining, and can I take Friday off?', 'agent-hr-concierge');
    }
};

window.HrModule = HrModule;
