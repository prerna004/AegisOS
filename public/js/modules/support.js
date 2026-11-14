// ============================================================================
// Module Group C: Customer Service & Support
// Replaces: Zoho Desk, SalesIQ, Assist, Lens
// Composable Foundation: Chatwoot / Zammad / RustDesk
// Autonomous Agents: Tier-1 & Tier-2 Resolution, Sentiment & Churn Escalation, Auto-KB
// ============================================================================

const SupportModule = {
    async render(container) {
        const [ticketsRes, kbRes] = await Promise.all([
            fetch('/api/support/tickets').then(r => r.json()),
            fetch('/api/support/kb').then(r => r.json())
        ]);

        const tickets = ticketsRes || [];
        const kb = kbRes || [];

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">Customer Service & Omnichannel Support</h2>
                            <span class="badge badge-indigo">Module Group C</span>
                            <span class="badge badge-emerald">Chatwoot / RustDesk Core</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            Unified inbox, real-time SLA breach timers, auto-resolution RAG, and browser-based remote support.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="SupportModule.openRemoteAssistModal()">💻 RustDesk Remote Assist</button>
                        <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Analyze high-priority open tickets and generate auto-resolution drafts using RAG', 'agent-tier1-2-resolution')">
                            ⚡ Run Tier-1 AI Resolver
                        </button>
                    </div>
                </div>

                <!-- Tickets & KB Split -->
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px;">
                    <!-- Omnichannel Ticketing Inbox -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Active Ticket Queue (SLA & Sentiment Monitored)</h3>
                            <span class="badge badge-indigo">${tickets.length} Total Tickets</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${tickets.map(t => `
                                <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:flex-start;">
                                    <div>
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <span style="font-weight:600; font-size:13px; color:var(--text-primary);">${t.subject}</span>
                                            <span class="badge ${t.priority === 'Urgent' ? 'badge-rose' : (t.priority === 'High' ? 'badge-amber' : 'badge-emerald')}">
                                                ${t.priority}
                                            </span>
                                            <span class="badge ${t.sentiment === 'Frustrated' ? 'badge-rose' : 'badge-cyan'}">
                                                ${t.sentiment}
                                            </span>
                                        </div>
                                        <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">
                                            Customer: <strong>${t.customer_name}</strong> (${t.email}) • Dept: ${t.department}
                                        </div>
                                        <p style="font-size:11px; color:var(--text-muted); margin-top:6px; background:#070b14; padding:6px 10px; border-radius:6px;">
                                            ${t.resolution_notes || 'Pending agent triage'}
                                        </p>
                                    </div>
                                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
                                        <span style="font-size:10px; color:#f59e0b; font-family:var(--font-mono);">SLA Due: ${t.sla_due_at ? t.sla_due_at.substring(11, 16) : '4h'}</span>
                                        <button class="btn-secondary" style="font-size:10px; padding:3px 8px;" onclick="Copilot.sendQuickPrompt('Resolve ticket: ${t.subject}', 'agent-tier1-2-resolution')">
                                            🤖 AI Auto-Resolve
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Auto-Authored Knowledge Base -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Auto-Authored Knowledge Base</h3>
                            <button class="btn-secondary" style="font-size:10px; padding:2px 6px;" onclick="Copilot.sendQuickPrompt('Synthesize resolved tickets into new public knowledge base article', 'agent-auto-kb')">
                                + Auto-Author KB
                            </button>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${kb.map(k => `
                                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:12px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <span style="font-weight:600; font-size:12px; color:var(--text-primary);">${k.title}</span>
                                        <span class="badge badge-cyan">${k.category}</span>
                                    </div>
                                    <p style="font-size:11px; color:var(--text-secondary); margin-top:6px; line-height:1.4;">${k.content.substring(0, 110)}...</p>
                                    <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:10px; color:var(--text-muted);">
                                        <span>👁️ ${k.views} views</span>
                                        <span>👍 ${k.helpful_count} helpful</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    openRemoteAssistModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:10000; display:flex; align-items:center; justify-content:center;`;
        modal.innerHTML = `
            <div class="glass-card" style="width:780px; max-width:92vw; background:#0b1120; padding:20px; border:1px solid var(--border-strong);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:18px;">💻</span>
                        <h3 style="font-size:16px; font-weight:600; color:var(--text-primary);">RustDesk Browser-Based Unattended Remote Assist</h3>
                    </div>
                    <button class="btn-secondary" onclick="this.closest('div[style*=\\'position:fixed\\']').remove()">✕</button>
                </div>
                <div style="background:#05080e; border:1px solid var(--border-subtle); border-radius:8px; padding:20px; text-align:center;">
                    <div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">Connected to Managed Host: <strong>fleet-gw-nordic-418.iot</strong></div>
                    <div style="background:#000; border:1px solid #1e293b; border-radius:6px; height:180px; display:flex; align-items:center; justify-content:center; color:#22c55e; font-family:var(--font-mono); font-size:12px; text-align:left; padding:16px;">
                        root@fleet-gw-418:~# uptime<br>
                        12:08:12 up 48 days, 14:12, 1 user, load average: 0.14, 0.22, 0.18<br>
                        root@fleet-gw-418:~# df -h /<br>
                        Filesystem      Size  Used Avail Use% Mounted on<br>
                        /dev/sda1        40G   37G  2.8G  93% / [HIGH DISK WARNING]<br>
                        root@fleet-gw-418:~# _
                    </div>
                </div>
                <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:11px; color:var(--accent-amber);">🔒 Level 3 Guardrail Active: Remote commands require HITL Authorization</span>
                    <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Diagnose disk usage alert on fleet-gw-nordic-418.iot and prepare clean script', 'agent-it-helpdesk'); this.closest('div[style*=\\'position:fixed\\']').remove();">
                        Run IT Self-Healing Diagnostic
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

window.SupportModule = SupportModule;
