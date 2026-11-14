// ============================================================================
// Developer & Extensibility Gateway
// Requirement 2: "Must have APIs so others can build over it"
// Interactive OpenAPI 3.1 documentation, Model Context Protocol (MCP) tester,
// Webhook dispatcher, and multi-language client SDK generators
// ============================================================================

const DeveloperModule = {
    async render(container) {
        const [mcpToolsRes, openApiRes] = await Promise.all([
            fetch('/api/mcp/tools').then(r => r.json()),
            fetch('/api/openapi.json').then(r => r.json())
        ]);

        const tools = mcpToolsRes.tools || [];
        const spec = openApiRes || {};

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">Developer & Extensibility Gateway</h2>
                            <span class="badge badge-emerald">OpenAPI 3.1 Active</span>
                            <span class="badge badge-indigo">Model Context Protocol (MCP)</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            Full REST & MCP endpoints for third-party builders, SDK generators, and real-time webhook subscriptions.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <a href="/docs" target="_blank" class="btn-secondary" style="text-decoration:none;">
                            📖 Open Swagger UI Explorer ↗
                        </a>
                        <button class="btn-primary" onclick="DeveloperModule.dispatchTestWebhook()">
                            ⚡ Test Webhook Dispatch
                        </button>
                    </div>
                </div>

                <!-- API Key & Gateway Details -->
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:14px;">
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Primary API Endpoint</div>
                        <div style="font-size:13px; font-weight:600; color:var(--text-primary); margin-top:6px; font-family:var(--font-mono); overflow:hidden; text-overflow:ellipsis;">
                            ${window.location.origin}/api
                        </div>
                        <div style="font-size:11px; color:#34d399; margin-top:4px;">TLS 1.3 • CORS * Enabled</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Active Non-Human Identity (NHI) Token</div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
                            <code style="font-size:12px; color:#a5b4fc;">agy_sec_9942a7...</code>
                            <button class="btn-secondary" style="padding:2px 6px; font-size:10px;" onclick="HitlManager.showToast('API Key copied', 'emerald')">Copy</button>
                        </div>
                        <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Scoped: agents:invoke, crm:read</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Model Context Protocol (MCP)</div>
                        <div style="font-size:18px; font-weight:700; color:#22d3ee; margin-top:4px; font-family:var(--font-mono);">${tools.length} Registered Tools</div>
                        <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">JSON-RPC 2.0 Compliant</div>
                    </div>
                </div>

                <!-- Interactive MCP Tool Playground -->
                <div class="glass-card" style="padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <div>
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Model Context Protocol (MCP) Tool Playground</h3>
                            <p style="font-size:11px; color:var(--text-secondary);">Test standardized AI tool calls exposed directly to external coding agents (Cursor, Claude Code, Devin).</p>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                        <div>
                            <label style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Select Registered Tool:</label>
                            <select id="mcp-tool-select" onchange="DeveloperModule.handleToolSelect()" style="width:100%; background:#070b14; color:var(--text-primary); border:1px solid var(--border-strong); border-radius:6px; padding:8px; font-size:12px; margin-top:4px; font-family:var(--font-mono);">
                                ${tools.map(t => `<option value="${t.name}">${t.name} (Level ${t.riskLevel})</option>`).join('')}
                            </select>
                            <div style="margin-top:10px;">
                                <label style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">JSON-RPC Arguments:</label>
                                <textarea id="mcp-args-input" rows="5" style="width:100%; background:#070b14; color:#a5b4fc; border:1px solid var(--border-strong); border-radius:6px; padding:8px; font-size:11px; font-family:var(--font-mono); margin-top:4px;"></textarea>
                            </div>
                            <button class="btn-primary" style="margin-top:10px;" onclick="DeveloperModule.executeMcpCall()">
                                Execute MCP Tool Call ➔
                            </button>
                        </div>
                        <div>
                            <label style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Tool Execution Output:</label>
                            <pre id="mcp-output-box" style="height:175px; background:#070b14; border:1px solid var(--border-subtle); border-radius:6px; padding:10px; font-size:11px; color:#34d399; overflow-y:auto; margin-top:4px;">// Execute a tool to inspect JSON output</pre>
                        </div>
                    </div>
                </div>

                <!-- Auto-Generated Client SDK Snippets -->
                <div class="glass-card" style="padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <div>
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Auto-Generated Client Code SDKs</h3>
                            <p style="font-size:11px; color:var(--text-secondary);">Drop-in code snippets to invoke AegisOS agents from external Node, Python, or cURL applications.</p>
                        </div>
                    </div>
                    <div style="display:flex; gap:8px; margin-bottom:10px;">
                        <button class="btn-secondary active" style="font-size:11px; padding:3px 10px;" onclick="DeveloperModule.switchSnippet('curl', this)">cURL</button>
                        <button class="btn-secondary" style="font-size:11px; padding:3px 10px;" onclick="DeveloperModule.switchSnippet('node', this)">Node.js / TypeScript</button>
                        <button class="btn-secondary" style="font-size:11px; padding:3px 10px;" onclick="DeveloperModule.switchSnippet('python', this)">Python</button>
                    </div>
                    <pre id="code-snippet-box" style="background:#070b14; border:1px solid var(--border-subtle); border-radius:8px; padding:14px; font-size:11px; color:#e2e8f0; overflow-x:auto; line-height:1.6;"></pre>
                </div>
            </div>
        `;

        this.handleToolSelect();
        this.switchSnippet('curl');
    },

    handleToolSelect() {
        const select = document.getElementById('mcp-tool-select');
        const argsInput = document.getElementById('mcp-args-input');
        if (!select || !argsInput) return;

        const val = select.value;
        if (val.includes('enrich_lead')) {
            argsInput.value = JSON.stringify({ company: 'Aether Dynamics Robotics' }, null, 2);
        } else if (val.includes('calculate_cpq_margin')) {
            argsInput.value = JSON.stringify({ amount: 480000, discountPercent: 12.0 }, null, 2);
        } else if (val.includes('search_kb_rag')) {
            argsInput.value = JSON.stringify({ query: 'discount approval policy', limit: 2 }, null, 2);
        } else if (val.includes('translate_nl_to_sql')) {
            argsInput.value = JSON.stringify({ question: 'Show deals by stage and sum amount' }, null, 2);
        } else {
            argsInput.value = JSON.stringify({ param1: 'sample' }, null, 2);
        }
    },

    async executeMcpCall() {
        const select = document.getElementById('mcp-tool-select');
        const argsInput = document.getElementById('mcp-args-input');
        const outputBox = document.getElementById('mcp-output-box');
        if (!select || !argsInput || !outputBox) return;

        outputBox.textContent = 'Calling MCP tool...';
        try {
            const args = JSON.parse(argsInput.value);
            const res = await fetch('/api/mcp/call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ toolName: select.value, arguments: args })
            });
            const data = await res.json();
            outputBox.textContent = JSON.stringify(data, null, 2);
        } catch (e) {
            outputBox.textContent = `Error: ${e.message}`;
        }
    },

    switchSnippet(lang, btn) {
        if (btn) {
            btn.parentElement.querySelectorAll('button').forEach(b => {
                b.style.borderColor = 'var(--border-subtle)';
                b.style.color = 'var(--text-primary)';
            });
            btn.style.borderColor = 'var(--accent-primary)';
            btn.style.color = '#818cf8';
        }

        const box = document.getElementById('code-snippet-box');
        if (!box) return;

        const host = window.location.origin;

        if (lang === 'curl') {
            box.textContent = `curl -X POST "${host}/api/agents/invoke" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer agy_sec_9942a7..." \\
  -d '{
    "agentId": "agent-lead-enrichment",
    "prompt": "Enrich Elena Dynamics Robotics and calculate ICP fit score"
  }'`;
        } else if (lang === 'node') {
            box.textContent = `// AegisOS TypeScript Client SDK
import { AegisClient } from '@aegis-os/sdk';

const client = new AegisClient({
  baseUrl: '${host}',
  apiKey: process.env.AEGIS_API_KEY
});

// Invoke Autonomous Agent with Level 3 Guardrails
const result = await client.agents.invoke({
  agentId: 'agent-deal-desk',
  prompt: 'Calculate CPQ quote for Nordic Logistics with 12% discount',
  context: { amount: 480000, discountPercent: 12.0 }
});

console.log('Reasoning:', result.reasoningTrace);
console.log('Requires HITL Sign-off:', result.requiresHitl);`;
        } else if (lang === 'python') {
            box.textContent = `# AegisOS Python Client SDK
import os
import requests

AEGIS_HOST = "${host}"
API_KEY = os.getenv("AEGIS_API_KEY", "agy_sec_9942a7...")

response = requests.post(
    f"{AEGIS_HOST}/api/agents/invoke",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "agentId": "agent-data-scientist",
        "prompt": "Show deals by stage and sum amount"
    }
)

data = response.json()
print("Generated SQL:", data["executionResult"]["generatedSql"])
print("Chart Data:", data["executionResult"]["data"])`;
        }
    },

    async dispatchTestWebhook() {
        try {
            const res = await fetch('/api/webhooks/dispatch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'deal.closed_won',
                    payload: { dealId: 'deal-501', client: 'Apex BioSystems Ltd', amount: 240000 }
                })
            });
            const data = await res.json();
            HitlManager.showToast(`CDC Webhook Dispatched (${data.routingLatencyMs}ms). ERP & Project triggered.`, 'cyan');
        } catch (e) {
            HitlManager.showToast('Webhook dispatch failed', 'rose');
        }
    }
};

window.DeveloperModule = DeveloperModule;
