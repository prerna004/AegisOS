// ============================================================================
// AegisOS: Persistent Generative UI (GenUI) Copilot Drawer
// Capable of streaming interactive React/HTML cards:
// - Level 3 Mandatory HITL Approval Cards
// - Dynamic Forms & Inline Charts
// - Model Router & Token Cost Telemetry
// ============================================================================

const Copilot = {
    isOpen: true,
    activeAgent: 'general',
    isListening: false,
    speechRecognition: null,
    isVoiceOutputEnabled: true,

    init() {
        if (window.innerWidth < 1024) {
            this.isOpen = false;
        }
        this.renderDrawer();
        this.bindEvents();
        this.initVoice();
        this.applyState();
    },

    initVoice() {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
            try {
                this.speechRecognition = new SpeechRec();
                this.speechRecognition.continuous = false;
                this.speechRecognition.interimResults = false;
                this.speechRecognition.lang = 'en-US';

                this.speechRecognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    console.log('[Voice Copilot] Recognized speech:', transcript);
                    const input = document.getElementById('copilot-input');
                    if (input) {
                        input.value = transcript;
                        this.handleSubmit(new Event('submit'));
                    }
                    this.stopVoiceListening();
                };

                this.speechRecognition.onerror = (event) => {
                    console.warn('[Voice Copilot] Speech error:', event.error);
                    this.stopVoiceListening();
                };

                this.speechRecognition.onend = () => {
                    this.stopVoiceListening();
                };
            } catch (e) {
                console.warn('[Voice Copilot] SpeechRec init failed:', e);
            }
        }
    },

    toggleVoiceListening() {
        if (!this.speechRecognition) {
            this.initVoice();
        }
        if (!this.speechRecognition) {
            HitlManager.showToast('Voice Recognition is not supported in this browser. Please use Chrome or Edge.', 'amber');
            return;
        }

        if (this.isListening) {
            this.stopVoiceListening();
        } else {
            this.startVoiceListening();
        }
    },

    startVoiceListening() {
        if (!this.speechRecognition) this.initVoice();
        try {
            this.speechRecognition.start();
            this.isListening = true;
            const btn = document.getElementById('copilot-voice-btn');
            if (btn) {
                btn.style.background = '#ef4444';
                btn.style.borderColor = '#ef4444';
                btn.style.color = '#ffffff';
                btn.innerHTML = '🔴 Listening...';
            }
            HitlManager.showToast('🎙️ Listening... Speak your prompt now!', 'emerald');
        } catch (e) {
            console.warn('[Voice Copilot] Start error:', e);
        }
    },

    stopVoiceListening() {
        this.isListening = false;
        try {
            if (this.speechRecognition) this.speechRecognition.stop();
        } catch (e) {}
        const btn = document.getElementById('copilot-voice-btn');
        if (btn) {
            btn.style.background = 'rgba(255,255,255,0.05)';
            btn.style.borderColor = 'var(--border-subtle)';
            btn.style.color = 'var(--text-primary)';
            btn.innerHTML = '🎙️ Voice';
        }
    },

    currentSpeakingBtn: null,

    stopAllSpeech() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        if (this.currentSpeakingBtn) {
            this.resetSpeakingBtn(this.currentSpeakingBtn);
        }
        const stopBtn = document.getElementById('copilot-stop-audio-btn');
        if (stopBtn) stopBtn.style.display = 'none';
    },

    toggleSpeakMessage(btnElem, text) {
        if (!window.speechSynthesis) {
            HitlManager.showToast('Text-to-speech is not supported by your browser', 'amber');
            return;
        }

        // If currently speaking this message, stop it!
        if (this.currentSpeakingBtn === btnElem && window.speechSynthesis.speaking) {
            this.stopAllSpeech();
            HitlManager.showToast('Audio reading stopped', 'indigo');
            return;
        }

        // Stop any previously playing speech
        this.stopAllSpeech();

        const cleanText = (text || '')
            .replace(/\*\*/g, '')
            .replace(/`/g, '')
            .replace(/•/g, '')
            .replace(/#/g, '')
            .replace(/\n+/g, '. ')
            .substring(0, 500);

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        btnElem.style.background = 'rgba(245, 158, 11, 0.25)';
        btnElem.style.borderColor = '#f59e0b';
        btnElem.style.color = '#fbbf24';
        const label = btnElem.querySelector('.read-btn-text');
        if (label) label.textContent = '⏹️ Stop Reading';
        this.currentSpeakingBtn = btnElem;

        const stopBtn = document.getElementById('copilot-stop-audio-btn');
        if (stopBtn) stopBtn.style.display = 'inline-flex';

        utterance.onend = () => {
            this.resetSpeakingBtn(btnElem);
            if (stopBtn) stopBtn.style.display = 'none';
        };
        utterance.onerror = () => {
            this.resetSpeakingBtn(btnElem);
            if (stopBtn) stopBtn.style.display = 'none';
        };

        window.speechSynthesis.speak(utterance);
        HitlManager.showToast('🔊 Reading response aloud...', 'emerald');
    },

    resetSpeakingBtn(btnElem) {
        if (!btnElem) return;
        btnElem.style.background = 'rgba(255,255,255,0.05)';
        btnElem.style.borderColor = 'rgba(255,255,255,0.12)';
        btnElem.style.color = '#cbd5e1';
        const label = btnElem.querySelector('.read-btn-text');
        if (label) label.textContent = 'Read Aloud';
        if (this.currentSpeakingBtn === btnElem) {
            this.currentSpeakingBtn = null;
        }
    },

    toggle() {
        this.isOpen = !this.isOpen;
        this.applyState();
    },

    open() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.applyState();
        }
    },

    close() {
        if (this.isOpen) {
            this.isOpen = false;
            this.applyState();
        }
    },

    applyState() {
        const drawer = document.getElementById('copilot-drawer');
        if (drawer) {
            if (this.isOpen) {
                drawer.classList.remove('closed');
            } else {
                drawer.classList.add('closed');
            }
        }
        this.updateButtonStates();
    },

    updateButtonStates() {
        const heroBtn = document.getElementById('hero-copilot-btn');
        if (heroBtn) {
            if (this.isOpen) {
                heroBtn.innerHTML = '✕ Close AI Assistant';
                heroBtn.className = 'btn-secondary';
                heroBtn.style.background = 'rgba(239, 68, 68, 0.15)';
                heroBtn.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                heroBtn.style.color = '#f87171';
            } else {
                heroBtn.innerHTML = '✦ Open AI Assistant';
                heroBtn.className = 'btn-primary';
                heroBtn.style.background = '';
                heroBtn.style.borderColor = '';
                heroBtn.style.color = '';
            }
        }

        const headerBtn = document.getElementById('header-copilot-btn');
        if (headerBtn) {
            if (this.isOpen) {
                headerBtn.innerHTML = '✕ Copilot';
                headerBtn.style.background = '#4338ca';
            } else {
                headerBtn.innerHTML = '✦ Copilot';
                headerBtn.style.background = '';
            }
        }
    },

    renderDrawer() {
        let drawer = document.getElementById('copilot-drawer');
        if (!drawer) {
            drawer = document.createElement('aside');
            drawer.id = 'copilot-drawer';
            drawer.className = 'copilot-drawer';
            const shell = document.getElementById('app-shell') || document.body;
            shell.appendChild(drawer);
        }

        if (this.isOpen) {
            drawer.classList.remove('closed');
        } else {
            drawer.classList.add('closed');
        }

        drawer.innerHTML = `
            <!-- Copilot Header -->
            <div style="padding: 14px 18px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.01);">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="pulse-dot thinking"></span>
                    <div>
                        <div style="font-size:13px; font-weight:600; color:var(--text-primary);">Aegis Copilot (GenUI)</div>
                        <div style="font-size:11px; color:var(--text-muted);">LiteLLM Router • 26 Agents Active</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <select id="copilot-model-select" style="background:#070b14; color:var(--text-secondary); border:1px solid var(--border-subtle); border-radius:6px; font-size:11px; padding:2px 6px;">
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                        <option value="llama-3.3-70b-local">Llama 3.3 (Local Ollama)</option>
                    </select>
                    <button class="btn-secondary" onclick="Copilot.close()" style="padding:2px 6px; font-size:11px;" title="Close Copilot">✕</button>
                </div>
            </div>

            <!-- Agent Selector Tokens / Chips Quick Bar -->
            <div style="padding: 10px 14px 8px; background: rgba(0,0,0,0.3); border-bottom:1px solid var(--border-subtle);">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                    <span style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.04em;">Target Agent Token:</span>
                    <span id="active-agent-label" class="badge badge-indigo" style="font-size:9.5px;">✦ General Copilot</span>
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button class="btn-secondary copilot-agent-chip active" onclick="Copilot.selectAgent('general', this)" style="padding:4px 9px; font-size:11px; border-color:var(--accent-primary); color:#818cf8; border-radius:6px;">
                        ✦ General Copilot
                    </button>
                    <button class="btn-secondary copilot-agent-chip" onclick="Copilot.selectAgent('agent-deal-desk', this)" style="padding:4px 9px; font-size:11px; border-radius:6px;">
                        Deal Desk (HITL)
                    </button>
                    <button class="btn-secondary copilot-agent-chip" onclick="Copilot.selectAgent('agent-it-helpdesk', this)" style="padding:4px 9px; font-size:11px; border-radius:6px;">
                        IT Helpdesk (HITL)
                    </button>
                    <button class="btn-secondary copilot-agent-chip" onclick="Copilot.selectAgent('agent-data-scientist', this)" style="padding:4px 9px; font-size:11px; border-radius:6px;">
                        NL to SQL
                    </button>
                    <button class="btn-secondary copilot-agent-chip" onclick="Copilot.selectAgent('agent-bookkeeper', this)" style="padding:4px 9px; font-size:11px; border-radius:6px;">
                        Bookkeeper
                    </button>
                </div>
            </div>

            <!-- Live Tokens Available & Context Telemetry Bar -->
            <div id="copilot-token-bar" style="padding: 7px 14px; background: rgba(16, 185, 129, 0.08); border-bottom: 1px solid rgba(16, 185, 129, 0.25); display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
                <div style="display:flex; align-items:center; gap:6px;">
                    <span class="pulse-dot online" style="width:6px; height:6px;"></span>
                    <span style="color:#e2e8f0; font-weight:600;">Tokens Available:</span>
                    <strong style="color:#34d399; font-family:var(--font-mono); font-size:12px;">123,880</strong>
                    <span style="color:var(--text-muted); font-size:10px;">/ 128k</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:10.5px;">
                    <span style="color:#818cf8;">Session: 4,120</span>
                    <span style="color:var(--border-strong);">•</span>
                    <span style="color:#fbbf24;">$0.006</span>
                </div>
            </div>

            <!-- Messages Stream Area -->
            <div id="copilot-messages" style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:14px;">
                <!-- Initial Welcome Greeting -->
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius:10px; padding:14px; font-size:12px; line-height:1.5;">
                    <div style="font-weight:700; color:#818cf8; margin-bottom:6px; display:flex; align-items:center; gap:6px; font-size:13px;">
                        <span>✦</span> Welcome to Aegis Enterprise Copilot
                    </div>
                    I am your AI assistant across all 9 departments and 26 agents. You can ask me any question in plain English or click a quick shortcut:
                    <div style="margin-top:12px; display:flex; flex-direction:column; gap:6px;">
                        <button class="btn-secondary" style="font-size:11px; text-align:left; justify-content:flex-start; background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.3); color:#818cf8;" onclick="Copilot.sendQuickPrompt('what i am doing here', 'general')">
                            📍 "What am I doing here? (Orientation Guide)"
                        </button>
                        <button class="btn-secondary" style="font-size:11px; text-align:left; justify-content:flex-start; background:rgba(245,158,11,0.1); border-color:rgba(245,158,11,0.3); color:#fbbf24;" onclick="Copilot.sendQuickPrompt('What is Zoho and why is AegisOS replacing it?', 'general')">
                            🏢 "What is Zoho & why are we replacing it?"
                        </button>
                        <button class="btn-secondary" style="font-size:11px; text-align:left; justify-content:flex-start; background:rgba(52,211,153,0.1); border-color:rgba(52,211,153,0.3); color:#34d399;" onclick="Copilot.sendQuickPrompt('Where do the figures on the dashboard come from and how do I verify them?', 'general')">
                            📊 "Where do the figures ($195k & $805k) come from?"
                        </button>
                        <button class="btn-secondary" style="font-size:11px; text-align:left; justify-content:flex-start;" onclick="Copilot.sendQuickPrompt('Check Deal Desk margin for $480,000 Nordic quote with 12% discount', 'agent-deal-desk')">
                            🔒 "Test Level 3 Safety Brake (Deal Desk 12% Discount)"
                        </button>
                        <button class="btn-secondary" style="font-size:11px; text-align:left; justify-content:flex-start;" onclick="Copilot.sendQuickPrompt('Show revenue breakdown by deal pipeline stages', 'agent-data-scientist')">
                            📈 "Show company revenue breakdown from database"
                        </button>
                    </div>
                </div>
            </div>

            <!-- Input Box -->
            <div style="padding: 12px; border-top: 1px solid var(--border-subtle); background: #070b14;">
                <form id="copilot-input-form" onsubmit="Copilot.handleSubmit(event)" style="display:flex; flex-direction:column; gap:8px;">
                    <div style="position:relative;">
                        <textarea id="copilot-input" placeholder="Ask any of the 26 agents or execute cross-suite commands..." 
                            rows="2" style="width:100%; background:rgba(255,255,255,0.04); border:1px solid var(--border-strong); border-radius:8px; padding:8px 10px; color:var(--text-primary); font-size:12px; resize:none; font-family:inherit;"></textarea>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <button type="button" id="copilot-voice-btn" class="btn-secondary" style="padding:5px 10px; font-size:11px; display:flex; align-items:center; gap:5px; border-radius:6px;" onclick="Copilot.toggleVoiceListening()" title="Speak with Voice (STT)">
                                🎙️ Speak Prompt
                            </button>
                            <button type="button" id="copilot-stop-audio-btn" class="btn-secondary" style="display:none; padding:5px 10px; font-size:11px; align-items:center; gap:5px; background:rgba(245,158,11,0.2); border-color:#f59e0b; color:#fbbf24; border-radius:6px;" onclick="Copilot.stopAllSpeech()" title="Stop Playing Audio">
                                ⏹️ Stop Speech
                            </button>
                        </div>
                        <button type="submit" class="btn-primary" style="padding:6px 14px; font-size:12px; font-weight:600;">Send ↵</button>
                    </div>
                </form>
            </div>
        `;
    },

    bindEvents() {
        const input = document.getElementById('copilot-input');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSubmit(e);
                }
            });
        }
    },

    selectAgent(agentId, btnElem) {
        this.activeAgent = agentId;
        document.querySelectorAll('.copilot-agent-chip').forEach(b => {
            b.style.borderColor = 'var(--border-subtle)';
            b.style.color = 'var(--text-primary)';
            b.classList.remove('active');
        });
        if (btnElem) {
            btnElem.style.borderColor = 'var(--accent-primary)';
            btnElem.style.color = '#818cf8';
            btnElem.classList.add('active');
        }
        const label = document.getElementById('active-agent-label');
        if (label) {
            const names = {
                'general': '✦ General Copilot',
                'agent-deal-desk': 'Deal Desk (HITL)',
                'agent-it-helpdesk': 'IT Helpdesk (HITL)',
                'agent-data-scientist': 'NL to SQL',
                'agent-bookkeeper': 'Bookkeeper',
                'agent-lead-enrichment': 'Lead Enrichment'
            };
            label.textContent = names[agentId] || agentId;
        }
    },

    sendQuickPrompt(promptText, agentId = null) {
        if (!this.isOpen) {
            this.open();
        }
        if (agentId) this.activeAgent = agentId;
        const input = document.getElementById('copilot-input');
        if (input) {
            input.value = promptText;
            this.handleSubmit(new Event('submit'));
        }
    },

    async handleSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();
        const input = document.getElementById('copilot-input');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this.appendUserMessage(text);

        // Show thinking indicator
        const thinkingId = 'think-' + Date.now();
        this.appendThinkingIndicator(thinkingId, this.activeAgent);

        try {
            const res = await fetch('/api/agents/invoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: this.activeAgent,
                    prompt: text,
                    context: {
                        client: text.includes('Nordic') ? 'Nordic Logistics Global' : undefined,
                        amount: text.includes('480,000') ? 480000 : undefined,
                        discountPercent: text.includes('12%') ? 12.0 : undefined
                    }
                })
            });

            const data = await res.json();
            const thinkElem = document.getElementById(thinkingId);
            if (thinkElem) thinkElem.remove();

            this.renderAgentResponse(data);
        } catch (err) {
            const thinkElem = document.getElementById(thinkingId);
            if (thinkElem) thinkElem.remove();
            this.appendErrorMessage(`Agent execution failed: ${err.message}`);
        }
    },

    appendUserMessage(text) {
        const container = document.getElementById('copilot-messages');
        const div = document.createElement('div');
        div.style.cssText = `
            align-self: flex-end; max-width: 85%; background: var(--accent-primary);
            color: #ffffff; padding: 10px 14px; border-radius: 12px 12px 2px 12px;
            font-size: 12px; line-height: 1.4; word-break: break-word;
        `;
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    appendThinkingIndicator(id, agentId) {
        const container = document.getElementById('copilot-messages');
        const div = document.createElement('div');
        div.id = id;
        div.style.cssText = `
            align-self: flex-start; max-width: 90%; background: rgba(255,255,255,0.03);
            border: 1px solid var(--border-subtle); padding: 10px 12px; border-radius: 12px 12px 12px 2px;
            font-size: 12px; color: var(--text-secondary); display:flex; align-items:center; gap:8px;
        `;
        div.innerHTML = `
            <span class="pulse-dot thinking"></span>
            <span>Agent <strong>${agentId}</strong> is reasoning & calling MCP tools...</span>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    formatMarkdown(str) {
        if (!str) return '';
        let html = str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Inline code
        html = html.replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.08); padding:1px 5px; border-radius:4px; font-size:11px; font-family:var(--font-mono); color:#38bdf8;">$1</code>');
        // Bullets
        html = html.replace(/^• (.*)$/gm, '<div style="margin-left:8px; display:flex; align-items:flex-start; gap:6px;"><span style="color:#818cf8;">•</span><span>$1</span></div>');
        // Numbers
        html = html.replace(/^([0-9]+\.) (.*)$/gm, '<div style="margin-left:4px; margin-top:4px;"><strong>$1</strong> $2</div>');
        // Newlines
        html = html.replace(/\n\n/g, '<div style="height:8px;"></div>');
        html = html.replace(/\n/g, '<br>');
        return html;
    },

    renderAgentResponse(data) {
        const container = document.getElementById('copilot-messages');
        const div = document.createElement('div');
        div.style.cssText = `
            align-self: flex-start; width: 100%; display:flex; flex-direction:column; gap:10px;
        `;

        const encodedMsg = encodeURIComponent(data.humanResponse || '');
        const humanMessageHtml = data.humanResponse ? `
            <div style="font-size:12.5px; color:#f8fafc; line-height:1.6; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.3); border-radius:10px; padding:14px; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
                ${this.formatMarkdown(data.humanResponse)}
                <div style="margin-top:10px; display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,0.08); padding-top:8px;">
                    <button class="btn-secondary message-read-btn" onclick="Copilot.toggleSpeakMessage(this, decodeURIComponent('${encodedMsg}'))" style="padding:4px 10px; font-size:11px; display:inline-flex; align-items:center; gap:5px; background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.15); color:#cbd5e1; border-radius:6px; cursor:pointer;" title="Click to hear this message read aloud">
                        <span>🔊</span>
                        <span class="read-btn-text">Read Aloud</span>
                    </button>
                    <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">${data.agentName || 'Aegis Copilot'} • ~${Math.round((data.humanResponse.length || 0) / 4)} tokens</span>
                </div>
            </div>
        ` : '';

        let hitlCardHtml = '';
        if (data.requiresHitl && data.hitlRecord) {
            const h = data.hitlRecord;
            const p = h.payload || {};
            hitlCardHtml = `
                <div class="hitl-approval-card" style="border: 1px solid rgba(245,158,11,0.5); background: rgba(245,158,11,0.06); border-radius: 12px; padding: 16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="badge badge-amber" style="font-size:11px; font-weight:700;">⚠️ Level 3 Safety Brake Active</span>
                        <span style="font-size:11px; font-family:var(--font-mono); color:#f59e0b;">${h.id}</span>
                    </div>
                    <div style="font-weight:700; font-size:14px; color:#fff; margin-top:8px;">
                        ${h.actionType}
                    </div>
                    <p style="font-size:12px; color:#cbd5e1; margin-top:4px; line-height:1.5;">
                        ${h.description}
                    </p>

                    <!-- Formatted Business Summary -->
                    <div style="margin-top:10px; background:#070b14; border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:10px 14px; font-size:11.5px; display:flex; flex-direction:column; gap:5px;">
                        <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:4px;">
                            <span style="color:#94a3b8;">Client Name:</span>
                            <strong style="color:#fff;">${p.client || 'Nordic Logistics Global'}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding:4px 0;">
                            <span style="color:#94a3b8;">Quote Value:</span>
                            <strong style="color:#818cf8; font-family:var(--font-mono);">$${p.amount ? Number(p.amount).toLocaleString() : (p.finalAmount ? Number(p.finalAmount).toLocaleString() : '480,000')}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding:4px 0;">
                            <span style="color:#94a3b8;">Requested Discount:</span>
                            <strong style="color:#fbbf24;">${p.discountPercent || 12}%</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; padding-top:4px;">
                            <span style="color:#94a3b8;">Projected Gross Margin:</span>
                            <strong style="color:#34d399;">${p.projectedGrossMarginPercent || 34.1}% (Requires Sign-off)</strong>
                        </div>
                    </div>

                    <div style="display:flex; gap:8px; margin-top:12px;">
                        <button class="btn-primary" style="flex:1; background:#10b981; border:none; padding:8px 12px; font-size:12px; font-weight:700; justify-content:center;" onclick="HitlManager.resolve('${h.id}', 'approved')">
                            ✓ Approve & Execute
                        </button>
                        <button class="btn-secondary" style="flex:1; border-color:#f43f5e; color:#f43f5e; padding:8px 12px; font-size:12px; font-weight:700; justify-content:center;" onclick="HitlManager.resolve('${h.id}', 'rejected')">
                            ✕ Reject
                        </button>
                    </div>
                </div>
            `;
        }

        let chartHtml = '';
        if (data.executionResult && data.executionResult.data && data.executionResult.generatedSql) {
            chartHtml = `
                <div style="background:#070b14; border:1px solid var(--border-subtle); border-radius:8px; padding:10px; margin-top:8px;">
                    <div style="font-size:10px; color:var(--accent-cyan); font-family:var(--font-mono); margin-bottom:6px;">
                        SQL: ${data.executionResult.generatedSql}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        ${data.executionResult.data.map(d => {
                            const val = d.total_value || d.total_amount || d.sum_amount;
                            const label = (d.stage || d.status || d.priority || 'record').replace(/_/g, ' ');
                            const displayVal = val ? '$' + Number(val).toLocaleString() : (d.count !== undefined ? d.count + ' records' : '');
                            return `
                                <div style="display:flex; justify-content:space-between; font-size:12px; border-bottom:1px solid rgba(255,255,255,0.05); padding:5px 0;">
                                    <span style="color:var(--text-secondary); text-transform:capitalize;">${label}</span>
                                    <strong style="color:#34d399; font-family:var(--font-mono); font-size:12px;">${displayVal}</strong>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        const telemetryHtml = `
            <details style="margin-top:6px; font-size:10.5px; color:var(--text-muted);">
                <summary style="cursor:pointer; color:#818cf8; font-weight:600; padding:4px 0;">
                    ⚙️ Technical Details (Agent: ${data.agentName || 'Copilot'} | Tools: ${data.toolsCalled?.join(', ') || 'RAG Search'})
                </summary>
                <div style="margin-top:6px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:8px 10px;">
                    <div style="color:var(--text-secondary); line-height:1.4; margin-bottom:4px;">
                        ${data.reasoningTrace}
                    </div>
                    ${data.toolsCalled && data.toolsCalled.length ? `
                        <div style="display:flex; gap:4px; margin-top:4px; flex-wrap:wrap;">
                            ${data.toolsCalled.map(t => `<span class="badge badge-indigo" style="font-size:9px;">${t}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${chartHtml}
                </div>
            </details>
        `;

        div.innerHTML = `
            ${humanMessageHtml}
            ${hitlCardHtml}
            ${telemetryHtml}
        `;

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        if (data.undoAvailable) {
            HitlManager.showLevel2UndoToast(data.agentName, 'undo-' + Date.now());
        }
    },

    appendErrorMessage(msg) {
        const container = document.getElementById('copilot-messages');
        const div = document.createElement('div');
        div.style.cssText = `
            align-self: flex-start; max-width: 90%; background: rgba(244,63,94,0.1);
            border: 1px solid rgba(244,63,94,0.3); color: #fb7185; padding: 10px 12px;
            border-radius: 8px; font-size: 12px;
        `;
        div.textContent = msg;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
};

window.Copilot = Copilot;
