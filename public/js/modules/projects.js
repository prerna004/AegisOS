// ============================================================================
// Module Group G: Project Management (Agile & Waterfall)
// Replaces: Zoho Projects, Sprints, BugTracker
// Composable Foundation: Plane (Agile) + OpenProject (Waterfall/Gantt)
// Autonomous Agents: AI Scrum Master, Blocker & Slippage Prediction, Standup Digest
// ============================================================================

const ProjectsModule = {
    viewMode: 'kanban', // kanban or gantt

    async render(container) {
        const [projRes, tasksRes] = await Promise.all([
            fetch('/api/projects').then(r => r.json()),
            fetch('/api/projects/tasks').then(r => r.json())
        ]);

        const projects = projRes || [];
        const tasks = tasksRes || [];

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">Project Management (Agile & Waterfall)</h2>
                            <span class="badge badge-indigo">Module Group G</span>
                            <span class="badge badge-emerald">Plane / OpenProject Core</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            Sprint planning, PRD decomposition, interactive Gantt dependencies, and blocker slippage prediction.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="ProjectsModule.toggleView('${this.viewMode === 'kanban' ? 'gantt' : 'kanban'}')">
                            ${this.viewMode === 'kanban' ? '📊 Switch to Interactive Gantt WBS' : '📋 Switch to Scrum Board'}
                        </button>
                        <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Analyze task dependency graph for critical path blockers and sprint milestone slippage', 'agent-blocker-slippage')">
                            ⚡ Run Blocker Prediction
                        </button>
                    </div>
                </div>

                <!-- Projects Summary Bar -->
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:14px;">
                    ${projects.map(p => `
                        <div class="glass-card" style="padding:16px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight:600; font-size:13px; color:var(--text-primary);">${p.name}</span>
                                <span class="badge badge-indigo">${p.type}</span>
                            </div>
                            <div style="margin-top:10px;">
                                <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-bottom:4px;">
                                    <span>Progress</span>
                                    <span>${p.progress_percent}%</span>
                                </div>
                                <div style="width:100%; height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
                                    <div style="width:${p.progress_percent}%; height:100%; background:linear-gradient(90deg, #6366f1, #10b981);"></div>
                                </div>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:11px; color:var(--text-secondary);">
                                <span>Budget: <strong>$${p.budget.toLocaleString()}</strong></span>
                                <span>Target: <strong>${p.deadline}</strong></span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${this.viewMode === 'kanban' ? this.renderKanban(tasks) : this.renderGantt(tasks)}
            </div>
        `;
    },

    toggleView(mode) {
        this.viewMode = mode;
        const container = document.getElementById('module-content-area');
        if (container) this.render(container);
    },

    renderKanban(tasks) {
        const columns = ['todo', 'in_progress', 'review', 'done'];
        const colTitles = { todo: 'To Do', in_progress: 'In Progress', review: 'Code Review', done: 'Completed' };

        return `
            <div class="glass-card" style="padding:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                    <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Scrum Sprint Board (Plane Core)</h3>
                    <button class="btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="Copilot.sendQuickPrompt('Decompose Product Requirement Document into user stories with story points', 'agent-scrum-master')">
                        + AI Story Decomposition
                    </button>
                </div>
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px;">
                    ${columns.map(col => {
                        const colTasks = tasks.filter(t => t.status === col);
                        return `
                            <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:12px;">
                                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:10px;">
                                    <span>${colTitles[col]}</span>
                                    <span style="font-family:var(--font-mono);">${colTasks.length}</span>
                                </div>
                                <div style="display:flex; flex-direction:column; gap:8px;">
                                    ${colTasks.map(t => `
                                        <div class="glass-card" style="padding:10px; background:#0b1120; border:1px solid var(--border-subtle); font-size:12px;">
                                            <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">${t.title}</div>
                                            <div style="font-size:11px; color:var(--text-secondary);">${t.assignee}</div>
                                            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                                                <span class="badge ${t.priority === 'Critical' ? 'badge-rose' : (t.priority === 'High' ? 'badge-amber' : 'badge-emerald')}">
                                                    ${t.priority}
                                                </span>
                                                <span style="font-size:11px; font-family:var(--font-mono); color:var(--text-muted);">${t.story_points} pts</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    renderGantt(tasks) {
        return `
            <div class="glass-card" style="padding:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                    <div>
                        <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Interactive Waterfall Gantt Chart & Critical Path (OpenProject Core)</h3>
                        <p style="font-size:11px; color:var(--text-secondary);">Work Breakdown Structures (WBS) with task dependencies (FS/SS/FF) and baseline tracking.</p>
                    </div>
                    <span class="badge badge-emerald">Critical Path Active</span>
                </div>
                <div style="background:#070b14; border:1px solid var(--border-subtle); border-radius:8px; padding:16px;">
                    <div style="display:grid; grid-template-columns: 240px 1fr; border-bottom:1px solid var(--border-subtle); padding-bottom:8px; font-size:11px; color:var(--text-muted); font-weight:600;">
                        <span>TASK / MILESTONE (WBS)</span>
                        <div style="display:flex; justify-content:space-between;">
                            <span>Nov 10</span>
                            <span>Nov 12</span>
                            <span>Nov 14</span>
                            <span>Nov 16</span>
                            <span>Nov 18</span>
                            <span>Nov 20</span>
                        </div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px; margin-top:12px;">
                        ${tasks.map((t, idx) => {
                            const leftOffset = Math.min(idx * 14, 70);
                            const widthPercent = Math.max(30, 80 - leftOffset);
                            const isCrit = t.priority === 'Critical' || t.priority === 'High';
                            return `
                                <div style="display:grid; grid-template-columns: 240px 1fr; align-items:center; font-size:11px;">
                                    <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--text-primary); padding-right:10px;">
                                        ${t.title}
                                    </div>
                                    <div style="position:relative; height:24px; background:rgba(255,255,255,0.02); border-radius:4px;">
                                        <div style="position:absolute; left:${leftOffset}%; width:${widthPercent}%; height:100%; border-radius:4px; background:${isCrit ? 'linear-gradient(90deg, #f43f5e, #fbbf24)' : 'linear-gradient(90deg, #6366f1, #06b6d4)'}; display:flex; align-items:center; padding:0 8px; color:#fff; font-size:10px; font-weight:600; box-shadow:0 2px 8px rgba(0,0,0,0.3);">
                                            ${t.assignee} (${t.story_points}d)
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }
};

window.ProjectsModule = ProjectsModule;
