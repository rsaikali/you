'use strict';


/* ─── Analytics helper ──────────────────────────────────────────────── */
function track(event, data) {
    window.umami?.track(event, data);
}

/* ─── Copy prompt ────────────────────────────────────────────────────── */
function triggerCopy() {
    const btn = document.getElementById('btn-copy');
    const label = document.getElementById('btn-copy-label');
    navigator.clipboard.writeText(getPrompt()).then(() => {
        track('prompt_copied');
        btn.classList.add('copied');
        label.textContent = t('btn_copied');
        setTimeout(() => {
            btn.classList.remove('copied');
            label.textContent = t('btn_copy');
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers / non-secure context
        const ta = document.createElement('textarea');
        ta.value = getPrompt();
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    });
}

/* ─── AI quick-open buttons ──────────────────────────────────────────── */
const promptText = document.getElementById('prompt-text');
const aiBtns = document.querySelectorAll('.ai-btn');

promptText.classList.add('is-ready');

function setReady(el) {
    el.classList.remove('is-ready');
    void el.offsetWidth;
    el.classList.add('is-ready');
}

document.getElementById('btn-copy').addEventListener('click', () => {
    triggerCopy();
    promptText.classList.remove('is-ready');
    aiBtns.forEach(b => setReady(b));
});
document.getElementById('prompt-text').addEventListener('click', () => {
    triggerCopy();
    promptText.classList.remove('is-ready');
    aiBtns.forEach(b => setReady(b));
});

aiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        triggerCopy();
        track('ai_opened', { ai: btn.textContent.trim() });
        window.open(btn.dataset.url, '_blank', 'noopener');
        promptText.classList.remove('is-ready');
        aiBtns.forEach(b => b.classList.remove('is-ready'));
        jsonInput.classList.remove('is-ready');
        void jsonInput.offsetWidth;
        jsonInput.classList.add('is-ready');
        jsonInput.addEventListener('input', () => jsonInput.classList.remove('is-ready'), { once: true });
    });
});

/* ─── Mentions légales panel ─────────────────────────────────────────── */
const mentionsPanel = document.getElementById('mentions-panel');

document.getElementById('btn-mentions').addEventListener('click', () => {
    document.getElementById('empty-state').hidden = true;
    document.getElementById('profile').hidden = true;
    mentionsPanel.hidden = false;
    document.getElementById('main-scroll').scrollTop = 0;
});

document.getElementById('btn-mentions-back').addEventListener('click', () => {
    mentionsPanel.hidden = true;
    const hasProfile = document.getElementById('profile').dataset.loaded;
    document.getElementById(hasProfile ? 'profile' : 'empty-state').hidden = false;
});

/* ─── JSON input handling ────────────────────────────────────────────── */
const jsonInput = document.getElementById('json-input');
const jsonError = document.getElementById('json-error');
const emptyState = document.getElementById('empty-state');
const profileEl = document.getElementById('profile');

let _errorTimer = null;

/* ─── Dev prefill (localhost only) ──────────────────────────────────── */
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    const script = document.createElement('script');
    script.src = '_dev-seed.js';
    script.onload = () => {
        if (window.DEV_PROFILE) {
            jsonInput.value = JSON.stringify(window.DEV_PROFILE, null, 2);
            requestAnimationFrame(handleInput);
        }
    };
    document.head.appendChild(script);
}

jsonInput.addEventListener('paste', () => requestAnimationFrame(handleInput));
jsonInput.addEventListener('input', () => {
    clearTimeout(_errorTimer);
    // On valid JSON: render immediately. On invalid: wait 800ms before showing error.
    const raw = jsonInput.value.trim();
    if (!raw) { clearError(); showEmpty(); return; }
    try {
        const data = JSON.parse(raw);
        clearError();
        renderProfile(data);
    } catch (_) {
        // Hide any previous error instantly while the user is still typing
        clearError();
        _errorTimer = setTimeout(() => {
            jsonInput.classList.add('has-error');
            jsonError.hidden = false;
            track('json_invalid');
            showEmpty();
        }, 800);
    }
});

function handleInput() {
    clearTimeout(_errorTimer);
    const raw = jsonInput.value.trim();

    if (!raw) {
        clearError();
        showEmpty();
        return;
    }

    let data;
    try {
        data = JSON.parse(raw);
    } catch (_) {
        jsonInput.classList.add('has-error');
        jsonError.hidden = false;
        track('json_invalid');
        showEmpty();
        return;
    }

    clearError();
    renderProfile(data);
}

function clearError() {
    jsonInput.classList.remove('has-error');
    jsonError.hidden = true;
}

function showEmpty() {
    emptyState.hidden = false;
    profileEl.hidden = true;
}

/* ─── Profile renderer ───────────────────────────────────────────────── */
const MODEL_ICONS = {
    claude: '/icons/anthropic.svg',
    gemini: '/icons/googlegemini.svg',
    gpt: '/icons/openai.svg',
    chatgpt: '/icons/openai.svg',
    openai: '/icons/openai.svg',
};

function getModelIcon(modelName) {
    const n = (modelName || '').toLowerCase();
    for (const [key, src] of Object.entries(MODEL_ICONS)) {
        if (n.includes(key)) return src;
    }
    return null;
}

function renderModelPill(modelName) {
    const pill = document.getElementById('p-model-pill');
    const by = pill.closest('.verdict-by');
    if (!modelName) { pill.hidden = true; if (by) by.hidden = true; return; }
    const icon = getModelIcon(modelName);
    pill.textContent = '';
    if (icon) {
        const image = document.createElement('img');
        image.src = icon;
        image.className = 'ai-icon';
        image.alt = '';
        image.setAttribute('aria-hidden', 'true');
        pill.appendChild(image);
    }
    pill.appendChild(document.createTextNode(String(modelName)));
    pill.hidden = false;
    if (by) by.hidden = false;
}
function renderProfile(d) {
    // Model pill on verdict card
    renderModelPill(d.model_name);

    // Verdict
    setText('p-verdict-name', d.user_name || 'You');
    setText('p-verdict-tagline', d.tagline || '');
    setText('p-verdict', d.verdict || '—');

    // Simple text fields
    setText('p-ton', d.tone || '—');
    setText('p-style', d.style || '—');
    renderParagraphs('p-persona', d.persona);
    setText('p-registre', d.speech_register || '—');
    setText('p-philosophy', d.philosophy || '—');

    // Lists
    renderList('p-forces', d.strengths);
    renderList('p-faiblesses', d.weaknesses);
    renderContradictions('p-contradictions', d.contradictions);
    renderList('p-speech-patterns', d.speech_patterns);
    renderList('p-ai-knows', d.ai_knows);
    renderSecurityBadge(d.sensitive_data);
    setText('p-next-question', d.next_question || '—');
    setText('p-next-project', d.next_project || '—');
    setText('p-never-admit', d.never_admit || '—');

    // Tag scores (build DOM first, animate bars after reveal)
    renderTagScores('p-tag-scores', d.tag_scores);

    // Track profile generation without sending profile-derived metadata.
    track('profile_rendered');

    // Store for sharing
    _currentProfile = d;
    document.getElementById('btn-tweet').hidden = false;

    // Show profile
    mentionsPanel.hidden = true;
    emptyState.hidden = false;  // keep layout stable while animating
    emptyState.style.display = 'none';
    profileEl.hidden = false;
    profileEl.dataset.loaded = '1';

    // Staggered entrance for cards
    const items = profileEl.querySelectorAll('.anim-item');
    items.forEach((el, i) => {
        el.classList.remove('visible');
        void el.offsetWidth; // force reflow → restart animation
        el.style.animationDelay = `${0.06 + i * 0.065}s`;
        el.classList.add('visible');
    });

    // Animate score bars after a short delay
    requestAnimationFrame(() => {
        setTimeout(() => {
            profileEl.querySelectorAll('.score-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.target;
            });
        }, 150);
    });
}

/* ─── Helpers ────────────────────────────────────────────────────────── */

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

function renderParagraphs(id, text) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    const chunks = (text || '').split(/\n\n+/).map(s => s.trim()).filter(Boolean);
    if (!chunks.length) { el.textContent = '—'; return; }
    chunks.forEach(chunk => {
        const p = document.createElement('p');
        p.className = 'persona-text';
        p.textContent = chunk;
        el.appendChild(p);
    });
}

function getInitials(name) {
    if (!name || !name.trim()) return '?';
    return name.trim()
        .split(/\s+/)
        .map(w => (w[0] || '').toUpperCase())
        .slice(0, 2)
        .join('');
}

// Deterministic color from name, picked from design palette
const AVATAR_COLORS = ['#E89056', '#2F6A93', '#3A7A55', '#8E5A2A', '#6A3A7A'];
function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
    }
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function renderList(id, items) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
        const li = document.createElement('li');
        li.textContent = '—';
        li.style.opacity = '0.4';
        el.appendChild(li);
        return;
    }
    items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = String(text);
        el.appendChild(li);
    });
}

function renderSecurityBadge(sensitiveData) {
    const alert = document.getElementById('p-security-alert');
    const types = Array.isArray(sensitiveData) && sensitiveData.length > 0 ? sensitiveData : null;

    if (types) {
        alert.textContent = '';

        const card = document.createElement('div');
        card.className = 'card card--danger-solid';

        const title = document.createElement('div');
        title.className = 'card-label';
        title.textContent = t('security_warn_title');

        const body = document.createElement('p');
        body.className = 'card-value';
        body.textContent = t('security_warn_body');

        const list = document.createElement('ul');
        list.className = 'trait-list';

        types.forEach(item => {
            const li = document.createElement('li');
            li.textContent = String(item);
            list.appendChild(li);
        });

        card.append(title, body, list);
        alert.appendChild(card);
        alert.hidden = false;
    } else {
        alert.textContent = '';
        alert.hidden = true;
    }
}

function renderContradictions(id, items) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
        const li = document.createElement('li');
        li.textContent = '\u2014';
        li.style.opacity = '0.4';
        el.appendChild(li);
        return;
    }
    items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = String(text);
        el.appendChild(li);
    });
}

function renderChips(id, items) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
        const span = document.createElement('span');
        span.className = 'chip';
        span.textContent = '—';
        span.style.opacity = '0.4';
        el.appendChild(span);
        return;
    }
    items.forEach(text => {
        const span = document.createElement('span');
        span.className = 'chip';
        span.textContent = String(text);
        el.appendChild(span);
    });
}

function renderTagScores(id, scores) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    if (!scores || typeof scores !== 'object') return;

    // Sort highest score first, skip zeros, keep top 6
    const entries = Object.entries(scores)
        .map(([topic, raw]) => [topic, Math.max(0, Math.min(10, Number(raw) || 0))])
        .filter(([, score]) => score > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    entries.forEach(([topic, score]) => {
        const pct = `${score * 10}%`;
        const item = document.createElement('div');
        item.className = 'score-item';
        item.dataset.score = score;

        const topicEl = document.createElement('span');
        topicEl.className = 'score-topic';
        topicEl.textContent = topic;

        const valEl = document.createElement('span');
        valEl.className = 'score-val';
        valEl.textContent = score;

        const track = document.createElement('div');
        track.className = 'score-bar-track';

        const fill = document.createElement('div');
        fill.className = 'score-bar-fill';
        fill.dataset.target = pct;
        fill.style.width = '0';

        track.appendChild(fill);
        item.append(topicEl, valEl, track);
        el.appendChild(item);
    });
}

/* ─── Share / Export ─────────────────────────────────────────────────── */
let _currentProfile = null;

document.getElementById('btn-tweet').addEventListener('click', () => {
    if (!_currentProfile) return;
    const name = _currentProfile.user_name || 'You';
    const tagline = _currentProfile.tagline || '';
    const lines = [
        `${name}\u202f? ${tagline}...`,
        '',
        'You\u202f? \u2192 you.saikali.fr',
    ];
    const text = lines.join('\n');
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(intent, '_blank', 'noopener,width=600,height=400');
    track('profile_shared', { method: 'tweet' });
});
