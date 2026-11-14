// ============================================================================
// AegisOS: Enterprise Master Seed Data
// Pre-populates all 9 Zoho One Module equivalents + 26 Agent initial states
// ============================================================================

const db = require('./db');

function seedDatabase() {
    console.log('[Seed] Populating AegisOS Enterprise Data...');

    // 1. Leads
    const existingLeads = db.query('SELECT count(*) as count FROM leads');
    if (existingLeads[0]?.count === 0) {
        const leads = [
            ['lead-101', 'Arjun Mehta', 'Apex BioSystems Ltd', 'arjun@apexbio.com', '+91 98201 11223', 'Qualified', 94, 'High', JSON.stringify({ employees: '500-1000', funding: 'Series C', techStack: ['AWS', 'Salesforce', 'SAP'], hq: 'Bandra-Kurla Complex, Mumbai' })],
            ['lead-102', 'Sophia Vance', 'Nordic Logistics Global', 'sophia@nordiclog.dk', '+45 3321 8890', 'Contacted', 88, 'High', JSON.stringify({ employees: '2500+', fleetSize: '1200 trucks', hq: 'Copenhagen / Hamburg' })],
            ['lead-103', 'Vikramaditya Rao', 'Titanium FinTech Infra', 'v.rao@titaniumfi.in', '+91 99302 44556', 'New', 72, 'Medium', JSON.stringify({ employees: '200', valuation: '$180M', hq: 'Bangalore / Nariman Point' })],
            ['lead-104', 'Elena Rostova', 'Aether Dynamics Robotics', 'elena@aetherdyn.de', '+49 89 2314 901', 'Qualified', 96, 'High', JSON.stringify({ employees: '800', r_and_d: 'Autonomous AGVs', hq: 'Munich' })],
            ['lead-105', 'Kavita Subramaniam', 'Zenith Healthtech', 'kavita@zenithhealth.org', '+91 97110 55443', 'Nurturing', 64, 'Low', JSON.stringify({ employees: '120', hq: 'Hyderabad' })]
        ];
        for (const l of leads) {
            db.run('INSERT INTO leads (id, name, company, email, phone, status, score, intent, firmographics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', l);
        }
    }

    // 2. Accounts & Deals
    const existingDeals = db.query('SELECT count(*) as count FROM deals');
    if (existingDeals[0]?.count === 0) {
        const accounts = [
            ['acc-01', 'Apex BioSystems Ltd', 'Biotechnology & MedTech', 45000000, 'Mumbai BKC', 96, 'https://apexbio.example.com'],
            ['acc-02', 'Nordic Logistics Global', 'Supply Chain & Freight', 120000000, 'Copenhagen', 89, 'https://nordiclog.example.com'],
            ['acc-03', 'Aether Dynamics Robotics', 'Industrial Automation', 62000000, 'Munich', 92, 'https://aetherdyn.example.com'],
            ['acc-04', 'Titanium FinTech Infra', 'Financial Infrastructure', 28000000, 'Bangalore', 84, 'https://titaniumfi.example.com']
        ];
        for (const a of accounts) {
            db.run('INSERT OR IGNORE INTO accounts (id, name, industry, annual_revenue, location, health_score, website) VALUES (?, ?, ?, ?, ?, ?, ?)', a);
        }

        const deals = [
            ['deal-501', 'Enterprise AI OS Expansion - 2500 Seats', 'acc-01', 'Apex BioSystems Ltd', 240000, 'negotiation', 85, '2026-12-15', 'quote-801'],
            ['deal-502', 'Global Telemetry & Fleet Dispatch Agent Rollout', 'acc-02', 'Nordic Logistics Global', 480000, 'proposal', 65, '2027-01-20', 'quote-802'],
            ['deal-503', 'Autonomous Quality Inspection Pipeline', 'acc-03', 'Aether Dynamics Robotics', 195000, 'closed_won', 100, '2026-11-10', 'quote-803'],
            ['deal-504', 'Unified Core Ledger & Ledger Agent Pilot', 'acc-04', 'Titanium FinTech Infra', 85000, 'qualification', 40, '2027-02-28', null]
        ];
        for (const d of deals) {
            db.run('INSERT INTO deals (id, title, account_id, account_name, amount, stage, probability, expected_close, cpq_quote_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', d);
        }

        const quotes = [
            ['quote-801', 'deal-501', 'Apex BioSystems Ltd', JSON.stringify([
                { item: 'Aegis Core Platform (Enterprise 2500 Seats)', qty: 1, unit: 180000, subtotal: 180000 },
                { item: 'Autonomous SDR & Lead Enrichment Pod', qty: 1, unit: 35000, subtotal: 35000 },
                { item: 'Dedicated VPC & 24/7 Tier-3 SRE SLA', qty: 1, unit: 25000, subtotal: 25000 }
            ]), 240000, 8.5, 42.0, 'approved'],
            ['quote-802', 'deal-502', 'Nordic Logistics Global', JSON.stringify([
                { item: 'Nordic Fleet Agentic Dispatch Node', qty: 1200, unit: 350, subtotal: 420000 },
                { item: 'Cross-Border Real-time Customs Broker Agent', qty: 1, unit: 60000, subtotal: 60000 }
            ]), 480000, 12.0, 38.5, 'pending_hitl']
        ];
        for (const q of quotes) {
            db.run('INSERT INTO quotes (id, deal_id, client_name, items_json, total_amount, discount_percent, margin_percent, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', q);
        }
    }

    // 3. Campaigns & Social
    const existingCampaigns = db.query('SELECT count(*) as count FROM campaigns');
    if (existingCampaigns[0]?.count === 0) {
        const campaigns = [
            ['camp-01', 'Q4 AI Enterprise Orchestration Blitz', 'Omnichannel', 'Active', 14500, 42.8, 14.2, 18500, 'Targeted at CTOs & Heads of Ops across APAC & EMEA'],
            ['camp-02', 'Autonomous CPQ & Deal Desk Webinar Series', 'Email', 'Active', 8200, 38.5, 9.6, 6200, '3-part interactive masterclass with live agentic quote creation'],
            ['camp-03', 'Agentic Supply Chain Optimization Playbook', 'Social', 'Completed', 29000, 56.1, 18.9, 12000, 'Whitepaper download driven by LinkedIn technical thought leadership']
        ];
        for (const c of campaigns) {
            db.run('INSERT INTO campaigns (id, name, type, status, audience_size, open_rate, click_rate, budget, generated_brief) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', c);
        }

        const social = [
            ['soc-01', 'LinkedIn', 'Proud to announce that AegisOS now integrates over 26 autonomous enterprise agents into a single PostgreSQL data fabric. Say goodbye to SaaS fragmentation!', '2026-11-13 14:00:00', 'Published', 0.94, 1420],
            ['soc-02', 'X', 'Human-in-the-Loop is not a compromise—it is the enterprise safety bedrock. Here is how AegisOS handles Level 3 financial and code mutations.', '2026-11-14 09:30:00', 'Published', 0.88, 895]
        ];
        for (const s of social) {
            db.run('INSERT INTO social_posts (id, platform, content, scheduled_time, status, sentiment_score, engagement_count) VALUES (?, ?, ?, ?, ?, ?, ?)', s);
        }
    }

    // 4. Tickets & KB Articles (Customer Service)
    const existingTickets = db.query('SELECT count(*) as count FROM tickets');
    if (existingTickets[0]?.count === 0) {
        const tickets = [
            ['tick-301', 'Webhook payload latency spike on EU-Central Cluster', 'Marcus Lindqvist', 'm.lindqvist@nordiclog.dk', 'High', 'open', 'Infrastructure', '2026-11-14 18:00:00', 'Neutral', 'Investigating Debezium CDC consumer lag.'],
            ['tick-302', 'Automated Bank Reconciliation mismatch on EUR/INR rate', 'Sunita Kulkarni', 'sunita@apexbio.com', 'Urgent', 'escalated', 'Finance', '2026-11-14 15:30:00', 'Frustrated', 'AI Bookkeeper flagged out-of-band FX spread of 0.8%.'],
            ['tick-303', 'Inquiry on custom Model Context Protocol (MCP) tool exposure', 'Dr. Florian Weber', 'f.weber@aetherdyn.de', 'Medium', 'resolved', 'Developer Relations', '2026-11-13 12:00:00', 'Positive', 'Shared OpenAPI 3.1 endpoints and tool manifests.']
        ];
        for (const t of tickets) {
            db.run('INSERT INTO tickets (id, subject, customer_name, email, priority, status, department, sla_due_at, sentiment, resolution_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', t);
        }

        const kb = [
            ['kb-101', 'Configuring Level 3 HITL Guardrails for Financial Invoicing', 'Finance & Billing', 'Learn how to configure mandatory human approvals for invoice items exceeding $5,000 or customer discount deviations over 10%.', 840, 94, 'tick-289', 'published'],
            ['kb-102', 'Connecting Self-Hosted Ollama / vLLM Models to LiteLLM Gateway', 'AI Infrastructure', 'Step-by-step setup to route internal confidential PII queries to local Llama 3.3 instances while keeping complex reasoning on Claude 3.5 Sonnet / Gemini 2.0.', 1420, 128, 'tick-214', 'published'],
            ['kb-103', 'Setting Up Real-Time Event Bus CDC via NATS JetStream', 'Architecture', 'How AegisOS guarantees sub-100ms data synchronization between CRM deal status changes and ERP inventory provisioning.', 920, 89, 'tick-303', 'published']
        ];
        for (const k of kb) {
            db.run('INSERT INTO kb_articles (id, title, category, content, views, helpful_count, source_ticket_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', k);
        }
    }

    // 5. Invoices, Inventory & Expenses (Finance & ERP)
    const existingInvoices = db.query('SELECT count(*) as count FROM invoices');
    if (existingInvoices[0]?.count === 0) {
        const invoices = [
            ['inv-901', 'Apex BioSystems Ltd', 240000, 43200, '2026-12-01', 'paid', JSON.stringify([{ desc: 'Enterprise Platform Subscription', amount: 240000 }])],
            ['inv-902', 'Nordic Logistics Global', 125000, 22500, '2026-11-28', 'unpaid', JSON.stringify([{ desc: 'Fleet Dispatch Telemetry Nodes Q4', amount: 125000 }])],
            ['inv-903', 'Aether Dynamics Robotics', 195000, 35100, '2026-12-15', 'pending_approval', JSON.stringify([{ desc: 'Custom Autonomous Agent Pod Deployment', amount: 195000 }])]
        ];
        for (const inv of invoices) {
            db.run('INSERT INTO invoices (id, customer_name, amount, tax_amount, due_date, status, items_json) VALUES (?, ?, ?, ?, ?, ?, ?)', inv);
        }

        const inventory = [
            ['inv-sku-01', 'MED-GLV-75', 'Sterile Nitrile Surgical Gloves 7.5', 'Disposables', 'Bhiwandi Central Hub', 1420, 300, 18.50, 'Optimal'],
            ['inv-sku-02', 'MED-SYR-05', 'Dispovan Syringes 5ml with 24G Needle', 'Surgicals', 'Bhiwandi Central Hub', 450, 500, 4.20, 'Low Stock'],
            ['inv-sku-03', 'IOT-RTE-40', 'Enterprise Industrial Edge Gateway V4', 'Hardware / Telemetry', 'Munich Warehouse', 85, 20, 380.00, 'Optimal'],
            ['inv-sku-04', 'MED-CAN-18', 'Polymed Safety IV Cannula 18G Green', 'Disposables', 'Bhiwandi Central Hub', 180, 250, 28.00, 'Low Stock'],
            ['inv-sku-05', 'SRV-RACK-01', 'Aegis High-Density GPU Inferencing Node', 'Infrastructure', 'Frankfurt DC 1', 14, 5, 12500.00, 'Optimal']
        ];
        for (const item of inventory) {
            db.run('INSERT INTO inventory (id, sku, name, category, warehouse, stock_on_hand, reorder_point, unit_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', item);
        }

        const expenses = [
            ['exp-401', 'Rohit Sharma', 'Travel & Client Onboarding', 1850.00, 'USD', 'https://receipts.example.com/exp-401.pdf', 'approved', null],
            ['exp-402', 'Camille Dubois', 'Conference Sponsorship & Booth', 4800.00, 'EUR', 'https://receipts.example.com/exp-402.pdf', 'flagged_policy', 'Amount exceeds single transaction threshold of €3,000 without prior VP sign-off.'],
            ['exp-403', 'Devendra Patil', 'Server Hardware Spare Components', 890.00, 'USD', 'https://receipts.example.com/exp-403.pdf', 'approved', null]
        ];
        for (const exp of expenses) {
            db.run('INSERT INTO expenses (id, employee_name, category, amount, currency, receipt_url, status, flag_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', exp);
        }
    }

    // 6. Employees & Candidates (HR & Workplace)
    const existingEmployees = db.query('SELECT count(*) as count FROM employees');
    if (existingEmployees[0]?.count === 0) {
        const employees = [
            ['emp-01', 'Prerna Chotwani', 'Chief AI Architect & Pod Lead', 'Engineering', 'prerna@aegis-os.internal', '+91 98200 44321', '2025-01-15', 'Active', null, 22],
            ['emp-02', 'Vikram Malhotra', 'Principal Platform & Data Engineer', 'Infrastructure', 'vikram.m@aegis-os.internal', '+91 98199 88776', '2025-03-01', 'Active', 'emp-01', 19],
            ['emp-03', 'Ananya Deshmukh', 'Lead Product & GenUI Engineer', 'Product', 'ananya.d@aegis-os.internal', '+91 99201 33445', '2025-04-10', 'Active', 'emp-01', 18],
            ['emp-04', 'Samir Kulkarni', 'Full-Stack Integration & AI QA', 'Quality', 'samir.k@aegis-os.internal', '+91 98700 12345', '2025-06-01', 'Active', 'emp-01', 20],
            ['emp-05', 'Nisha Sen', 'Director of Customer Operations', 'Support', 'nisha.s@aegis-os.internal', '+91 98111 67890', '2025-02-15', 'Active', 'emp-01', 16]
        ];
        for (const e of employees) {
            db.run('INSERT INTO employees (id, name, title, department, email, phone, join_date, status, manager_id, pto_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', e);
        }

        const candidates = [
            ['cand-01', 'Tanvi Parekh', 'Senior Distributed Systems Engineer (Rust/Go)', 'tanvi.p@gmail.com', 96, 'Interview', 'Expert in NATS JetStream, Raft consensus, and Kafka Debezium streaming with 6 years experience.'],
            ['cand-02', 'Aditya Joshi', 'Full-Stack GenUI Engineer (Next.js/React)', 'aditya.j@outlook.com', 92, 'Offer Pending', 'Deep experience with Vercel AI SDK, CopilotKit, and WebRTC streaming frontends.'],
            ['cand-03', 'Zara Chen', 'AI Evaluation & Langfuse Benchmarking Lead', 'zara.c@stanford.alumni.edu', 89, 'Screened', 'Published researcher in automated LLM-as-a-judge agent evaluation pipelines.']
        ];
        for (const cand of candidates) {
            db.run('INSERT INTO candidates (id, name, applied_role, email, match_score, status, resume_summary) VALUES (?, ?, ?, ?, ?, ?, ?)', cand);
        }
    }

    // 7. Collaboration: Emails & Chat
    const existingEmails = db.query('SELECT count(*) as count FROM emails');
    if (existingEmails[0]?.count === 0) {
        const emails = [
            ['em-01', 'arjun@apexbio.com', 'prerna@aegis-os.internal', 'Contract Signature & Security Architecture Review', 'Prerna, we have reviewed the Documenso digital contract and SOC 2 Type II controls. We are ready to execute once the margin approval is logged.', 'Full text: Hi Prerna, The legal team has signed off on the Documenso workflow. Please ensure the agent audit logs are exported to our S3 bucket for compliance auditing.', 'action_needed', 0, 'Hi Arjun, Thank you for the confirmation! I have verified our tamper-proof audit hash and scheduled the onboarding provisioning agent.'],
            ['em-02', 'm.lindqvist@nordiclog.dk', 'support@aegis-os.internal', 'Fleet Telemetry sync latency question', 'Can we adjust the batch flush interval from 100ms to 50ms for high-speed motorway segments?', 'Hi team, We want to confirm if the JetStream consumer can sustain 50ms batch flushes across 1200 mobile gateways without dropping frames.', 'primary', 1, 'Hi Marcus, Yes, NATS JetStream will easily handle this throughput. We have updated your consumer configuration to 50ms.']
        ];
        for (const em of emails) {
            db.run('INSERT INTO emails (id, sender, recipient, subject, preview, body, category, is_read, ai_draft_reply) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', em);
        }

        const chat = [
            ['msg-01', '#general', 'Prerna Chotwani', 'Team, we just passed all 26 autonomous agent regression tests! Phase 2 & 3 exit criteria are 100% verified.', '2026-11-14 10:15:00', 0],
            ['msg-02', '#general', 'Aegis Sentinel Agent', '🤖 Automated Standup Alert: 4 pull requests merged, 0 build failures, p95 API latency is 42ms.', '2026-11-14 10:15:30', 1],
            ['msg-03', '#leads', 'Lead Enrichment Agent', '⚡ New high-intent lead detected: Elena Rostova (Aether Dynamics). Score: 96/100. Autonomous SDR outreach sequence initialized.', '2026-11-14 10:45:00', 1]
        ];
        for (const ch of chat) {
            db.run('INSERT INTO chat_messages (id, channel, sender, text, timestamp, is_bot) VALUES (?, ?, ?, ?, ?, ?)', ch);
        }
    }

    // 8. Projects & Tasks
    const existingProjects = db.query('SELECT count(*) as count FROM projects');
    if (existingProjects[0]?.count === 0) {
        const projects = [
            ['proj-01', 'AegisOS Enterprise Production Rollout (Phase 2 & 3)', 'Agile', 88, 'In Progress', 450000, '2026-11-20'],
            ['proj-02', 'Zero-Trust Endpoint MDM & FleetDM Hardening', 'Waterfall', 92, 'In Progress', 180000, '2026-12-05'],
            ['proj-03', 'Cross-Module BI Data Warehouse & NL-to-SQL Studio', 'Agile', 76, 'In Progress', 220000, '2026-12-30']
        ];
        for (const p of projects) {
            db.run('INSERT INTO projects (id, name, type, progress_percent, status, budget, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)', p);
        }

        const tasks = [
            ['task-101', 'proj-01', 'Deploy Model Context Protocol (MCP) tool exposure endpoints', 'done', 'High', 'Prerna Chotwani', 5, '2026-11-14', 'None'],
            ['task-102', 'proj-01', 'Configure Level 3 HITL Interactive Approval Cards in Copilot Drawer', 'done', 'Critical', 'Ananya Deshmukh', 8, '2026-11-14', 'None'],
            ['task-103', 'proj-01', 'Wire Immutable Agent Audit Ledger with token cost & diff tracking', 'done', 'High', 'Vikram Malhotra', 5, '2026-11-15', 'None'],
            ['task-104', 'proj-01', 'Automate Playwright E2E verification test suite across 9 modules', 'in_progress', 'Medium', 'Samir Kulkarni', 3, '2026-11-16', 'Low'],
            ['task-105', 'proj-02', 'Implement Zero-Touch Device Enrollment and Remote Lock/Wipe script', 'done', 'Critical', 'Vikram Malhotra', 5, '2026-11-14', 'None'],
            ['task-106', 'proj-03', 'Integrate DuckDB / SQLite semantic parser for natural language analytics', 'review', 'High', 'Prerna Chotwani', 8, '2026-11-17', 'None']
        ];
        for (const t of tasks) {
            db.run('INSERT INTO tasks (id, project_id, title, status, priority, assignee, story_points, due_date, blocker_risk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', t);
        }
    }

    // 9. ITSM Assets & Incidents
    const existingAssets = db.query('SELECT count(*) as count FROM it_assets');
    if (existingAssets[0]?.count === 0) {
        const assets = [
            ['ast-01', 'macbook-pro-m3-prerna.local', 'prerna@aegis-os.internal', 'macOS 15.1 Sequoia', 'Healthy', '2.4.1', '2026-11-14 11:30:00', 100],
            ['ast-02', 'thinkpad-x1-vikram.corp', 'vikram.m@aegis-os.internal', 'Ubuntu 24.04 LTS', 'Healthy', '2.4.1', '2026-11-14 11:28:00', 100],
            ['ast-03', 'dell-xps16-ananya.corp', 'ananya.d@aegis-os.internal', 'Windows 11 Enterprise', 'Healthy', '2.4.1', '2026-11-14 11:15:00', 98],
            ['ast-04', 'fleet-gw-nordic-418.iot', 'telemetry@nordiclog.dk', 'Alpine Linux Edge', 'Warning', '2.3.9', '2026-11-14 09:40:00', 84]
        ];
        for (const a of assets) {
            db.run('INSERT INTO it_assets (id, hostname, user_email, os, health_status, agent_version, last_seen, security_compliance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', a);
        }

        const incidents = [
            ['inc-01', 'ast-04', 'Disk usage threshold 92% on Nordic Edge Gateway #418', 'High', 'Open', 'Autonomous IT Helpdesk Agent', 'Root partition filling with unrotated journal logs. Remediation script prepared.']
        ];
        for (const inc of incidents) {
            db.run('INSERT INTO it_incidents (id, asset_id, title, urgency, status, assigned_to, diagnostic_output) VALUES (?, ?, ?, ?, ?, ?, ?)', inc);
        }
    }

    // 10. Workflows (iPaaS / n8n style)
    const existingWorkflows = db.query('SELECT count(*) as count FROM workflows');
    if (existingWorkflows[0]?.count === 0) {
        const workflows = [
            ['wf-01', 'Autonomous Quote-to-Cash & Project Initialization', 'deal.closed_won', JSON.stringify([
                { step: 1, action: 'Generate ERP General Ledger Invoice (Books)' },
                { step: 2, action: 'Create Agile Project & Sprint Backlog (Projects)' },
                { step: 3, action: 'Dispatch Documenso Counter-Signed Envelope (Sign)' },
                { step: 4, action: 'Send Slack/Cliq Notification to Account Exec (#deals)' }
            ]), 1, '2026-11-14 08:30:00', 42],
            ['wf-02', 'High-Risk Churn Escalation & VIP Ticket Routing', 'ticket.sentiment_frustrated', JSON.stringify([
                { step: 1, action: 'Calculate Customer Lifetime Value (LTV)' },
                { step: 2, action: 'Check SLA Tier (< 15 min response guaranteed)' },
                { step: 3, action: 'Page On-Call Customer Success Lead via Twilio/SMS' },
                { step: 4, action: 'Draft Empathetic Executive Response via AI Copilot' }
            ]), 1, '2026-11-13 19:12:00', 18]
        ];
        for (const wf of workflows) {
            db.run('INSERT INTO workflows (id, name, trigger_event, steps_json, is_active, last_run_at, execution_count) VALUES (?, ?, ?, ?, ?, ?, ?)', wf);
        }
    }

    // 11. Initial HITL Queue & Audit Ledger Records
    const existingHitl = db.query('SELECT count(*) as count FROM hitl_queue');
    if (existingHitl[0]?.count === 0) {
        const hitlItems = [
            ['hitl-01', 'agent-deal-desk', 'Deal Desk & CPQ Agent', 'Approve Commercial Quote with 12% Special Discount', 'Client Nordic Logistics requested 12% volume rebate exceeding standard 10% ceiling. Projected deal margin: 38.5% (Threshold: 35%). Requires CFO / VP Sales approval.', JSON.stringify({
                quoteId: 'quote-802',
                client: 'Nordic Logistics Global',
                amount: 480000,
                discountPercent: 12.0,
                marginPercent: 38.5,
                impact: 'Annual Recurring Revenue +$480,000, Gross Margin: $184,800'
            }), 3, 'pending', '2026-11-14 11:20:00', null, null],
            ['hitl-02', 'agent-it-helpdesk', 'Autonomous IT Helpdesk Agent', 'Execute Remote Self-Healing Disk Clean Script on ast-04', 'Execute shell script /opt/aegis/scripts/cleanup_journals.sh on fleet-gw-nordic-418.iot to reclaim 4.2GB log storage.', JSON.stringify({
                assetId: 'ast-04',
                hostname: 'fleet-gw-nordic-418.iot',
                script: 'journalctl --vacuum-time=2d && rm -rf /var/log/telemetry/*.old.gz',
                riskLevel: 'Level 3 - Remote Endpoint Execution'
            }), 3, 'pending', '2026-11-14 11:25:00', null, null]
        ];
        for (const h of hitlItems) {
            db.run('INSERT INTO hitl_queue (id, agent_id, agent_name, action_type, description, payload_json, risk_level, status, requested_at, reviewed_by, reviewed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', h);
        }
    }

    const existingAudit = db.query('SELECT count(*) as count FROM agent_audit_ledger');
    if (existingAudit[0]?.count === 0) {
        const auditRecords = [
            ['aud-001', '2026-11-14 10:45:12', 'agent-lead-enrichment', 'Lead Enrichment & Scoring Agent', 'usr_admin', 'lead.created', 1, 'h8a2f91', 'Scraped Crunchbase & LinkedIn API for Elena Rostova. Found €62M Series B funding.', 'mcp::enrich_lead, mcp::compute_icp_score', JSON.stringify({ score: { before: 0, after: 96 }, status: { before: 'New', after: 'Qualified' } }), 0.0014, 'Autonomous'],
            ['aud-002', '2026-11-14 11:10:04', 'agent-receipt-ocr', 'Receipt OCR & Policy Audit Agent', 'usr_admin', 'expense.submitted', 2, 'k93b71c', 'Analyzed receipt exp-402 for Camille Dubois. Detected €4,800 exceeds single charge policy limit.', 'mcp::ocr_receipt, mcp::audit_policy', JSON.stringify({ status: { before: 'pending_audit', after: 'flagged_policy' } }), 0.0021, 'Autonomous'],
            ['aud-003', '2026-11-14 11:20:30', 'agent-deal-desk', 'Deal Desk & CPQ Agent', 'usr_admin', 'quote.create_request', 3, 'p01e45a', 'Calculated 12% discount request for Nordic Logistics. Exceeded 10% threshold. Pushed to HITL approval queue.', 'mcp::calculate_cpq_margin, mcp::queue_hitl_approval', JSON.stringify({ status: { before: 'draft', after: 'pending_hitl' } }), 0.0035, 'Pending_HITL']
        ];
        for (const aud of auditRecords) {
            db.run('INSERT INTO agent_audit_ledger (id, timestamp, agent_id, agent_name, on_behalf_of_user_id, trigger_event, risk_level, prompt_hash, reasoning_trace, mcp_tools_called, before_after_diff, token_cost, approval_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', aud);
        }
    }

    // 12. Agent Memory Seeds (Working, Episodic, Semantic)
    const existingMemory = db.query('SELECT count(*) as count FROM agent_memory');
    if (existingMemory[0]?.count === 0) {
        const memories = [
            ['mem-01', 'working', 'session_current_active_view', 'User is reviewing Phase 2 & 3 Enterprise Operating System Architecture and testing CPQ approval flows.', JSON.stringify({ activeModule: 'crm', role: 'Chief AI Architect' })],
            ['mem-02', 'episodic', 'nordic_logistics_negotiation_history', 'Nordic Logistics previously rejected 5% discount; granted 12% on commitment of 1,200 telemetry gateways across Baltic fleet.', JSON.stringify({ outcome: 'HITL Pending', approvedPreviously: false })],
            ['mem-03', 'semantic', 'enterprise_expense_travel_policy_v3', 'Company travel policy: Single flight expenses > $1,500 and non-travel charges > $3,000 require Department VP approval. All receipts must have merchant GST/VAT identifier.', JSON.stringify({ category: 'Finance SOP', complianceTag: 'SOC2-EXP-04' })],
            ['mem-04', 'semantic', 'sla_tier_matrix_enterprise_contracts', 'Enterprise Platinum SLA: Critical tickets (P1) require first response under 15 minutes and root-cause analysis within 4 hours. Automated escalation triggers if unacknowledged at 10 minutes.', JSON.stringify({ category: 'Customer Support SOP', complianceTag: 'ISO27001-SLA-01' })]
        ];
        for (const m of memories) {
            db.run('INSERT INTO agent_memory (id, tier, key, content, metadata_json) VALUES (?, ?, ?, ?, ?)', m);
        }
    }

    console.log('[Seed] Database populated with full enterprise dataset across all 9 modules and 26 agents!');
}

seedDatabase();

module.exports = { seedDatabase };
