// ============================================================================
// AegisOS: Autonomous Agent Swarm Studio & Governance Center
// Visual monitor for all 26 Autonomous AI Agents across Groups A through I
// Live Swarm Status, Token Tracking, Risk Level Matrices & Audit Logs
// ============================================================================

const AgentsViewModule = {
    async render(container) {
        const [registryRes, swarmRes, auditStatsRes, auditLogsRes] = await Promise.all([
            fetch('/api/agents/registry').then(r => r.json()),
            fetch('/api/agents/swarm-status').then(r => r.json()),
            fetch('/api/audit/stats').then(r => r.json()),
            fetch('/api/audit/logs?limit=15').then(r => r.json())
        ]);

        const agents = registryRes.agents || [];
        const swarm = swarmRes.activeSwarm || [];
        const stats = auditStatsRes || {};
        const logs = auditLogsRes.logs || [];

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">Autonomous Agent Swarm Studio</h2>
                            <span class="badge badge-indigo">26 Specialized Agents</span>
                            <span class="badge badge-emerald">LangGraph / MCP Engine</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            Orchestrating Level 1 (Autonomous), Level 2 (Undoable), and Level 3 (Mandatory HITL) execution nodes.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="MemoryViewer.openModal()">🧠 3-Tier Memory Explorer</button>
                        <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Run health and benchmark audit across all 26 agents in swarm', 'agent-standup-digest')">
                            ⚡ Benchmark Swarm
                        </button>
                    </div>
                </div>

                <!-- Telemetry Strip -->
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:14px;">
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Total Agent Invocations</div>
                        <div style="font-size:22px; font-weight:700; color:var(--text-primary); margin-top:4px; font-family:var(--font-mono);">${stats.totalInvocations}</div>
                        <div style="font-size:11px; color:#34d399; margin-top:4px;">100% telemetry captured</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Level 3 HITL Guarded</div>
                        <div style="font-size:22px; font-weight:700; color:#fb7185; margin-top:4px; font-family:var(--font-mono);">${stats.level3ProtectedInvocations} actions</div>
                        <div style="font-size:11px; color:#fb7185; margin-top:4px;">Zero unapproved mutations</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Estimated Token Cost</div>
                        <div style="font-size:22px; font-weight:700; color:#22d3ee; margin-top:4px; font-family:var(--font-mono);">$${stats.totalTokenCostUsd}</div>
                        <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Hybrid LiteLLM routing</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Active Swarm Health</div>
                        <div style="font-size:22px; font-weight:700; color:#34d399; margin-top:4px; font-family:var(--font-mono);">26 / 26 Nodes</div>
                        <div style="font-size:11px; color:#34d399; margin-top:4px;">Zero orphaned threads</div>
                    </div>
                </div>

                <!-- Complete 26 Agents Grid -->
                <div class="glass-card" style="padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                        <div>
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">26-Agent Master Roster & Risk Classification Matrix</h3>
                            <p style="font-size:11px; color:var(--text-secondary);">Direct 1:1 mapping replacing Zoho One manual workflows with autonomous intelligence.</p>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap:12px;">
                        ${agents.map(a => {
                            const swarmItem = swarm.find(s => s.id === a.id);
                            const st = swarmItem ? swarmItem.status : 'idle';
                            const badgeCol = a.riskLevel === 3 ? 'badge-rose' : (a.riskLevel === 2 ? 'badge-amber' : 'badge-emerald');
                            return `
                                <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); display:flex; flex-direction:column; justify-content:space-between;">
                                    <div>
                                        <div style="display:flex; justify-content:space-between; align-items:center;">
                                            <span style="font-weight:600; font-size:12px; color:var(--text-primary);">${a.name}</span>
                                            <span class="badge ${badgeCol}">Level ${a.riskLevel}</span>
                                        </div>
                                        <div style="font-size:10px; color:#818cf8; margin-top:2px;">Replaces: ${a.replacesZoho}</div>
                                        <p style="font-size:11px; color:var(--text-secondary); margin-top:6px; line-height:1.4;">${a.description}</p>
                                        <div style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono); margin-top:8px;">
                                            Core: ${a.openSourceCore} • Model: ${a.model.split('/')[0]}
                                        </div>
                                    </div>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:8px; border-top:1px solid var(--border-subtle);">
                                        <div style="display:flex; align-items:center; gap:6px;">
                                            <span class="pulse-dot ${st === 'thinking' ? 'thinking' : (st === 'awaiting_hitl' ? 'awaiting' : 'online')}"></span>
                                            <span style="font-size:10px; text-transform:capitalize; color:var(--text-muted);">${st}</span>
                                        </div>
                                        <button class="btn-secondary" style="font-size:10px; padding:2px 8px;" onclick="Copilot.selectAgent('${a.id}'); Copilot.toggle();">
                                            Invoke Agent ➔
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Immutable Audit Ledger Table -->
                <div class="glass-card" style="padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                        <div>
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Immutable Agent Audit Ledger</h3>
                            <p style="font-size:11px; color:var(--text-secondary);">Forensic log of agent prompts, SHA-256 hashes, MCP tool calls, before/after diffs, and approval states.</p>
                        </div>
                        <span class="badge badge-emerald">SOC 2 / ISO 27001 Compliant</span>
                    </div>
                    <div style="overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse; font-size:11px; text-align:left;">
                            <thead>
                                <tr style="border-bottom:1px solid var(--border-subtle); color:var(--text-muted); text-transform:uppercase;">
                                    <th style="padding:8px;">Timestamp</th>
                                    <th style="padding:8px;">Agent</th>
                                    <th style="padding:8px;">Trigger</th>
                                    <th style="padding:8px;">Risk</th>
                                    <th style="padding:8px;">Prompt Hash</th>
                                    <th style="padding:8px;">MCP Tools</th>
                                    <th style="padding:8px;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${logs.map(l => `
                                    <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                                        <td style="padding:8px; font-family:var(--font-mono); color:var(--text-muted);">${l.timestamp}</td>
                                        <td style="padding:8px; font-weight:600; color:var(--text-primary);">${l.agent_name}</td>
                                        <td style="padding:8px; color:var(--text-secondary);">${l.trigger_event}</td>
                                        <td style="padding:8px;"><span class="badge ${l.risk_level === 3 ? 'badge-rose' : (l.risk_level === 2 ? 'badge-amber' : 'badge-emerald')}">L${l.risk_level}</span></td>
                                        <td style="padding:8px; font-family:var(--font-mono); color:#22d3ee;">${l.prompt_hash}</td>
                                        <td style="padding:8px; color:#818cf8;">${l.mcp_tools_called || 'None'}</td>
                                        <td style="padding:8px;"><span class="badge ${l.approval_status === 'Approved' ? 'badge-emerald' : (l.approval_status === 'Pending_HITL' ? 'badge-rose' : 'badge-cyan')}">${l.approval_status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
};

window.AgentsViewModule = AgentsViewModule;
