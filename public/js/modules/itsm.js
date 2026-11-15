// ============================================================================
// Module Group H: IT Service Management (ITSM) & Endpoint Security
// Replaces: Zoho ServiceDesk Plus, Endpoint Central, MDM
// Composable Foundation: GLPI + FleetDM / Headwind MDM
// Autonomous Agents: Autonomous IT Helpdesk, Software License Optimizer
// ============================================================================

const ItsmModule = {
    async render(container) {
        const [assetsRes, incRes] = await Promise.all([
            fetch('/api/itsm/assets').then(r => r.json()),
            fetch('/api/itsm/incidents').then(r => r.json())
        ]);

        const assets = assetsRes || [];
        const incidents = incRes || [];

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">ITSM & Endpoint Security (MDM)</h2>
                            <span class="badge badge-indigo">Module Group H</span>
                            <span class="badge badge-emerald">GLPI / FleetDM Core</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            ITIL incident management, CMDB asset dependency mapping, and zero-touch FleetDM remote endpoint telemetry.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="ItsmModule.openCmdbModal()">🗺️ CMDB Dependency Graph</button>
                        <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Diagnose high disk pressure on fleet-gw-nordic-418.iot and prepare remediation script', 'agent-it-helpdesk')">
                            ⚡ Run Autonomous IT Helpdesk
                        </button>
                    </div>
                </div>

                <!-- Assets & Incidents Split -->
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px;">
                    <!-- Managed Endpoint Fleet -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">FleetDM Managed Endpoints (macOS, Linux, Windows)</h3>
                            <span class="badge badge-cyan">${assets.length} Enrolled Devices</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${assets.map(a => `
                                <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <span style="font-weight:600; font-size:13px; color:var(--text-primary); font-family:var(--font-mono);">${a.hostname}</span>
                                            <span class="badge ${a.health_status === 'Healthy' ? 'badge-emerald' : (a.health_status === 'Warning' ? 'badge-amber' : 'badge-rose')}">
                                                ${a.health_status}
                                            </span>
                                            <span class="badge badge-indigo">SOC 2: ${a.security_compliance}%</span>
                                        </div>
                                        <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">
                                            User: ${a.user_email} • OS: ${a.os} • Fleet Agent: v${a.agent_version}
                                        </div>
                                    </div>
                                    <div style="display:flex; gap:8px;">
                                        <button class="btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="ItsmModule.triggerRemoteTelemetry('${a.hostname}')">
                                            📡 Telemetry
                                        </button>
                                        <button class="btn-secondary" style="font-size:11px; padding:3px 8px; border-color:#f43f5e; color:#f43f5e;" onclick="ItsmModule.triggerRemoteLock('${a.hostname}')">
                                            🔒 MDM Lock
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- ITIL Incidents & Problems -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Active ITIL Incidents</h3>
                            <span class="badge badge-rose">1 P1 Incident</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${incidents.map(inc => `
                                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:12px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <strong style="font-size:12px; color:var(--text-primary);">${inc.title}</strong>
                                        <span class="badge badge-rose">${inc.urgency}</span>
                                    </div>
                                    <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Assigned: ${inc.assigned_to}</div>
                                    <p style="font-size:11px; color:#22d3ee; font-family:var(--font-mono); margin-top:6px; background:#070b14; padding:6px 8px; border-radius:4px;">
                                        ${inc.diagnostic_output}
                                    </p>
                                    <div style="margin-top:10px; display:flex; justify-content:flex-end;">
                                        <button class="btn-primary" style="font-size:11px; padding:3px 10px;" onclick="Copilot.sendQuickPrompt('Remediate incident on ${inc.asset_id}', 'agent-it-helpdesk')">
                                            ⚡ Execute Remediation
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

    triggerRemoteTelemetry(hostname) {
        HitlManager.showToast(`FleetDM telemetry streaming initiated for ${hostname}`, 'cyan');
    },

    triggerRemoteLock(hostname) {
        Copilot.sendQuickPrompt(`Execute remote security lock and asset containment on ${hostname}`, 'agent-it-helpdesk');
    },

    openCmdbModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:10000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px);`;
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        modal.innerHTML = `
            <div class="glass-card" style="width:720px; max-width:92vw; background:#0b1120; padding:20px; border:1px solid var(--border-strong);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:18px;">🗺️</span>
                        <h3 style="font-size:16px; font-weight:600; color:var(--text-primary);">CMDB Configuration Management Topology</h3>
                    </div>
                    <button class="btn-secondary" onclick="this.closest('.glass-card').parentElement.remove()">✕</button>
                </div>
                <div style="background:#070b14; border:1px solid var(--border-subtle); border-radius:8px; padding:20px; font-size:12px; font-family:var(--font-mono); line-height:2; color:#a5b4fc;">
                    [Kubernetes K3s Cluster] ──> [PostgreSQL 17 Primary] ──> [pgvector RAG Store]<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;└──> [NATS JetStream CDC Event Bus] ──> [Debezium Consumer]<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──> [LiteLLM Hybrid Gateway] ──> [Ollama Llama 3.3 / Claude 3.5]<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──> [Keycloak OIDC IdP] ──> [FleetDM Managed Endpoints (ast-01..04)]
                </div>
                <div style="margin-top:14px; text-align:right;">
                    <button class="btn-primary" onclick="this.closest('.glass-card').parentElement.remove()">Close Topology View</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

window.ItsmModule = ItsmModule;
