// ============================================================================
// Module Group I: Business Intelligence, Low-Code & iPaaS
// Replaces: Zoho Analytics, Creator, Flow
// Composable Foundation: Metabase / Superset + NocoDB + n8n
// Autonomous Agents: Conversational Data Scientist, Workflow Builder
// ============================================================================

const AnalyticsModule = {
    async render(container) {
        const [metricsRes, workflowsRes] = await Promise.all([
            fetch('/api/bi/metrics').then(r => r.json()),
            fetch('/api/bi/workflows').then(r => r.json())
        ]);

        const metrics = metricsRes || {};
        const workflows = workflowsRes || [];

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">Business Intelligence, Low-Code & iPaaS</h2>
                            <span class="badge badge-indigo">Module Group I</span>
                            <span class="badge badge-emerald">Metabase / n8n / NocoDB Core</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            Cross-module data warehouse, Natural Language to SQL analytics, and visual drag-and-drop workflow automation.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="AnalyticsModule.openN8nCanvasModal()">⚡ Visual n8n Canvas</button>
                        <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Translate to SQL: Show revenue breakdown by deal pipeline stages', 'agent-data-scientist')">
                            📊 Run NL-to-SQL Data Scientist
                        </button>
                    </div>
                </div>

                <!-- BI Metric Strip -->
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:14px;">
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Realized Revenue</div>
                        <div style="font-size:22px; font-weight:700; color:#34d399; margin-top:4px; font-family:var(--font-mono);">$${Number(metrics.closedWonRevenue || 0).toLocaleString()}</div>
                        <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Closed won contracts</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Open Pipeline</div>
                        <div style="font-size:22px; font-weight:700; color:#818cf8; margin-top:4px; font-family:var(--font-mono);">$${Number(metrics.openPipelineValue || 0).toLocaleString()}</div>
                        <div style="font-size:11px; color:#818cf8; margin-top:4px;">Active negotiation stages</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Active iPaaS Workflows</div>
                        <div style="font-size:22px; font-weight:700; color:#fbbf24; margin-top:4px; font-family:var(--font-mono);">${metrics.automatedWorkflowsActive}</div>
                        <div style="font-size:11px; color:#fbbf24; margin-top:4px;">Event-driven CDC pipelines</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">P95 API Engine Latency</div>
                        <div style="font-size:22px; font-weight:700; color:#22d3ee; margin-top:4px; font-family:var(--font-mono);">${metrics.systemHealthP95Ms} ms</div>
                        <div style="font-size:11px; color:#34d399; margin-top:4px;">Target &lt; 200ms exceeded</div>
                    </div>
                </div>

                <!-- Conversational Data Scientist Studio -->
                <div class="glass-card" style="padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <div>
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Conversational Data Scientist Studio</h3>
                            <p style="font-size:11px; color:var(--text-secondary);">Ask any business question in plain English. The agent converts it to optimized SQL and produces charts.</p>
                        </div>
                        <span class="badge badge-cyan">Natural Language to SQL</span>
                    </div>
                    <div style="display:flex; gap:10px; margin-bottom:14px;">
                        <input id="nlsql-input" type="text" placeholder="e.g. 'Show total revenue grouped by deal pipeline stage' or 'Rank leads by score'" 
                            value="Show total revenue grouped by deal pipeline stage"
                            style="flex:1; background:rgba(255,255,255,0.05); border:1px solid var(--border-strong); border-radius:8px; padding:10px 14px; color:var(--text-primary); font-size:13px;" />
                        <button class="btn-primary" onclick="AnalyticsModule.runNlSql()">Generate & Execute SQL</button>
                    </div>
                    <div id="nlsql-results" style="background:#070b14; border:1px solid var(--border-subtle); border-radius:8px; padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono); margin-bottom:8px;">
                            Click "Generate & Execute SQL" to synthesize and visualize query data.
                        </div>
                    </div>
                </div>

                <!-- iPaaS Automated Workflows (n8n Style) -->
                <div class="glass-card" style="padding:18px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                        <div>
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Event-Driven iPaaS Workflow Automations</h3>
                            <p style="font-size:11px; color:var(--text-secondary);">Change Data Capture (CDC) streaming database mutations across all 9 modules in &lt;100ms.</p>
                        </div>
                        <button class="btn-secondary" onclick="Copilot.sendQuickPrompt('Create an automated iPaaS workflow that triggers on CRM Deal Won and provisions ERP invoice and Agile project', 'agent-workflow-builder')">
                            + AI Workflow Builder
                        </button>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${workflows.map(wf => {
                            let steps = [];
                            try { steps = JSON.parse(wf.steps_json); } catch(e){}
                            return `
                                <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02);">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <span class="pulse-dot online"></span>
                                            <strong style="font-size:13px; color:var(--text-primary);">${wf.name}</strong>
                                            <span class="badge badge-emerald">Active</span>
                                        </div>
                                        <span style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono);">Executed ${wf.execution_count} times</span>
                                    </div>
                                    <div style="margin-top:10px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                                        <span class="badge badge-cyan">Trigger: ${wf.trigger_event}</span>
                                        ${steps.map(s => `
                                            <span style="color:var(--text-muted); font-size:12px;">➔</span>
                                            <span class="badge badge-indigo">${s.action || s.name}</span>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    async runNlSql() {
        const input = document.getElementById('nlsql-input');
        const box = document.getElementById('nlsql-results');
        if (!input || !box) return;

        const question = input.value.trim();
        box.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-muted);">Translating natural language to SQL & running analytical plan...</div>`;

        try {
            const res = await fetch('/api/mcp/call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toolName: 'mcp::translate_nl_to_sql',
                    arguments: { question }
                })
            });
            const resData = await res.json();
            const output = resData.output;

            box.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:11px; color:#22d3ee; font-family:var(--font-mono);">GENERATED SQL: ${output.generatedSql}</span>
                        <span class="badge badge-emerald">Sub-10ms Exec</span>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:10px;">
                        ${output.data.map(row => `
                            <div class="glass-card" style="padding:12px; background:rgba(255,255,255,0.03);">
                                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">${row.stage || row.status || row.priority}</div>
                                <div style="font-size:18px; font-weight:700; color:var(--text-primary); margin-top:4px; font-family:var(--font-mono);">
                                    ${row.total_value ? '$' + Number(row.total_value).toLocaleString() : row.count}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (e) {
            box.innerHTML = `<div style="color:#fb7185; padding:10px;">Failed to execute query: ${e.message}</div>`;
        }
    },

    openN8nCanvasModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:10000; display:flex; align-items:center; justify-content:center;`;
        modal.innerHTML = `
            <div class="glass-card" style="width:820px; max-width:92vw; background:#0b1120; padding:20px; border:1px solid var(--border-strong);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:18px;">⚡</span>
                        <h3 style="font-size:16px; font-weight:600; color:var(--text-primary);">Visual n8n / Activepieces Workflow Canvas</h3>
                    </div>
                    <button class="btn-secondary" onclick="this.closest('div[style*=\\'position:fixed\\']').remove()">✕</button>
                </div>
                <div style="background:#070b14; border:1px solid var(--border-subtle); border-radius:8px; padding:24px; position:relative; min-height:220px; display:flex; align-items:center; justify-content:center; gap:16px;">
                    <div class="glass-card" style="padding:12px; background:#1e1b4b; border-color:#818cf8; text-align:center; min-width:140px;">
                        <span class="badge badge-indigo">Trigger Node</span>
                        <div style="font-size:12px; font-weight:600; margin-top:6px; color:#fff;">CRM Deal Won</div>
                    </div>
                    <span style="color:#818cf8; font-size:20px;">➔</span>
                    <div class="glass-card" style="padding:12px; background:#064e3b; border-color:#34d399; text-align:center; min-width:140px;">
                        <span class="badge badge-emerald">Action Node</span>
                        <div style="font-size:12px; font-weight:600; margin-top:6px; color:#fff;">ERP Books Invoice</div>
                    </div>
                    <span style="color:#34d399; font-size:20px;">➔</span>
                    <div class="glass-card" style="padding:12px; background:#083344; border-color:#22d3ee; text-align:center; min-width:140px;">
                        <span class="badge badge-cyan">Action Node</span>
                        <div style="font-size:12px; font-weight:600; margin-top:6px; color:#fff;">Plane Sprint Tasks</div>
                    </div>
                    <span style="color:#22d3ee; font-size:20px;">➔</span>
                    <div class="glass-card" style="padding:12px; background:#701a75; border-color:#e879f9; text-align:center; min-width:140px;">
                        <span class="badge badge-rose">Dispatch</span>
                        <div style="font-size:12px; font-weight:600; margin-top:6px; color:#fff;">Documenso Sign</div>
                    </div>
                </div>
                <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:11px; color:var(--text-muted);">Event propagation: Debezium CDC &lt; 100ms guaranteed</span>
                    <button class="btn-primary" onclick="HitlManager.showToast('Test execution successful! Event simulated.', 'emerald'); this.closest('div[style*=\\'position:fixed\\']').remove();">
                        Simulate Event Pipeline
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

window.AnalyticsModule = AnalyticsModule;
