// ============================================================================
// Module Group D: Finance, ERP & Supply Chain
// Replaces: Zoho Books, Invoice, Inventory, Billing, Expense, Payroll
// Composable Foundation: ERPNext / Odoo / Lago
// Autonomous Agents: Autonomous Bookkeeper, Receipt OCR & Audit, Inventory Forecast
// ============================================================================

const FinanceModule = {
    async render(container) {
        const [invRes, stockRes, expRes] = await Promise.all([
            fetch('/api/finance/invoices').then(r => r.json()),
            fetch('/api/finance/inventory').then(r => r.json()),
            fetch('/api/finance/expenses').then(r => r.json())
        ]);

        const invoices = invRes || [];
        const inventory = stockRes || [];
        const expenses = expRes || [];

        const totalInvoiced = invoices.reduce((s, i) => s + (i.amount || 0), 0);
        const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.stock_on_hand <= i.reorder_point).length;

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">Finance, ERP & Supply Chain</h2>
                            <span class="badge badge-indigo">Module Group D</span>
                            <span class="badge badge-emerald">ERPNext / Lago Billing Core</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            Double-entry accounting, autonomous bank reconciliation, multi-warehouse stock, and forensic receipt OCR.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="FinanceModule.openOcrModal()">📷 Scan Expense Receipt</button>
                        <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Perform automated bank reconciliation across November feeds', 'agent-bookkeeper')">
                            ⚡ Run AI Bookkeeper
                        </button>
                    </div>
                </div>

                <!-- Metrics Strip -->
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:14px;">
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Total Invoiced (Q4)</div>
                        <div style="font-size:22px; font-weight:700; color:var(--text-primary); margin-top:4px; font-family:var(--font-mono);">$${totalInvoiced.toLocaleString()}</div>
                        <div style="font-size:11px; color:#34d399; margin-top:4px;">Double-entry balanced</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Low Stock SKUs</div>
                        <div style="font-size:22px; font-weight:700; color:#fb7185; margin-top:4px; font-family:var(--font-mono);">${lowStockCount} SKUs</div>
                        <div style="font-size:11px; color:#fb7185; margin-top:4px;">Below safe reorder threshold</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Flagged Policy Expenses</div>
                        <div style="font-size:22px; font-weight:700; color:#fbbf24; margin-top:4px; font-family:var(--font-mono);">${expenses.filter(e => e.status === 'flagged_policy').length}</div>
                        <div style="font-size:11px; color:#fbbf24; margin-top:4px;">Over $3,000 threshold</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Lago Metered Billing Nodes</div>
                        <div style="font-size:22px; font-weight:700; color:#818cf8; margin-top:4px; font-family:var(--font-mono);">1,285</div>
                        <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Telemetry events streamed</div>
                    </div>
                </div>

                <!-- ERP Invoices & Inventory Tables -->
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                    <!-- Invoices -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">General Ledger Invoices</h3>
                            <span class="badge badge-emerald">Tax Compliant</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            ${invoices.map(inv => `
                                <div class="glass-card" style="padding:12px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <span style="font-weight:600; font-size:12px; color:var(--text-primary);">${inv.customer_name}</span>
                                            <span class="badge ${inv.status === 'paid' ? 'badge-emerald' : (inv.status === 'unpaid' ? 'badge-amber' : 'badge-rose')}">
                                                ${inv.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
                                            Invoice #${inv.id} • Due: ${inv.due_date}
                                        </div>
                                    </div>
                                    <div style="font-size:14px; font-weight:700; color:var(--text-primary); font-family:var(--font-mono);">
                                        $${Number(inv.amount).toLocaleString()}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Multi-Warehouse Inventory -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Multi-Warehouse Stock (Bhiwandi / Munich)</h3>
                            <button class="btn-secondary" style="font-size:10px; padding:2px 6px;" onclick="Copilot.sendQuickPrompt('Forecast SKU depletion velocity and calculate safety stock buffer', 'agent-inventory-forecast')">
                                📦 Forecast Depletion
                            </button>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            ${inventory.map(item => `
                                <div class="glass-card" style="padding:12px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <span style="font-weight:600; font-size:12px; color:var(--text-primary);">${item.name}</span>
                                            <span class="badge ${item.status === 'Optimal' ? 'badge-emerald' : 'badge-rose'}">
                                                ${item.status}
                                            </span>
                                        </div>
                                        <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
                                            SKU: ${item.sku} • Warehouse: ${item.warehouse}
                                        </div>
                                    </div>
                                    <div style="text-align:right;">
                                        <div style="font-size:13px; font-weight:700; color:var(--text-primary); font-family:var(--font-mono);">${item.stock_on_hand} on hand</div>
                                        <div style="font-size:10px; color:var(--text-muted);">Reorder point: ${item.reorder_point}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Expenses & Forensic Policy Audit -->
                <div class="glass-card" style="padding:18px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                        <div>
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Corporate Expenses & Automated Policy Audit</h3>
                            <p style="font-size:11px; color:var(--text-secondary);">Forensic OCR verifies merchant receipts against tax ID registers and per-diem limits.</p>
                        </div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${expenses.map(e => `
                            <div class="glass-card" style="padding:12px 16px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span style="font-weight:600; font-size:13px; color:var(--text-primary);">${e.employee_name}</span>
                                        <span class="badge ${e.status === 'approved' ? 'badge-emerald' : (e.status === 'flagged_policy' ? 'badge-rose' : 'badge-amber')}">
                                            ${e.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                                        Category: ${e.category} • Ref #${e.id}
                                    </div>
                                    ${e.flag_reason ? `
                                        <div style="margin-top:4px; font-size:11px; color:#fb7185; background:rgba(244,63,94,0.1); padding:4px 8px; border-radius:4px;">
                                            ⚠️ Policy Flag: ${e.flag_reason}
                                        </div>
                                    ` : ''}
                                </div>
                                <div style="font-size:15px; font-weight:700; color:var(--text-primary); font-family:var(--font-mono);">
                                    $${Number(e.amount).toFixed(2)} ${e.currency}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    openOcrModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:10000; display:flex; align-items:center; justify-content:center;`;
        modal.innerHTML = `
            <div class="glass-card" style="width:640px; max-width:90vw; background:#0b1120; padding:20px; border:1px solid var(--border-strong);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-size:16px; font-weight:600; color:var(--text-primary);">Mobile Receipt Forensic OCR & Audit</h3>
                    <button class="btn-secondary" onclick="this.closest('div[style*=\\'position:fixed\\']').remove()">✕</button>
                </div>
                <div style="background:#070b14; border:2px dashed var(--border-strong); border-radius:8px; padding:24px; text-align:center;">
                    <span style="font-size:32px;">📷</span>
                    <div style="font-size:13px; color:var(--text-primary); margin-top:8px;">Drag & Drop Receipt or Simulated Camera Upload</div>
                    <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">PNG, JPG, PDF up to 15MB</div>
                    <button class="btn-primary" style="margin-top:14px;" onclick="FinanceModule.simulateOcrUpload(this)">
                        Simulate Receipt OCR Scan
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    simulateOcrUpload(btn) {
        btn.innerHTML = 'Extracting line items & tax IDs...';
        setTimeout(() => {
            Copilot.sendQuickPrompt('Scan uploaded receipt for Camille Dubois and audit against company travel policy', 'agent-receipt-ocr');
            btn.closest('div[style*="position:fixed"]').remove();
        }, 800);
    }
};

window.FinanceModule = FinanceModule;
