'use strict';

/* ─── Locale definitions ─────────────────────────────────────────────── */
/* Only 'fr' is fully defined for now — other locales are stubs.
   t() falls back to 'fr' for any missing key.                           */

const LOCALES = {

    /* ── French (source of truth) ─────────────────────────────────────── */
    fr: {
        title: 'You',
        description: 'Génère ton profil intellectuel avec ton IA favorite.',

        intro_1: 'Découvre comment ton IA te voit vraiment.',
        intro_2: 'Copie le prompt, colle-le dans <strong>ChatGPT</strong>, <strong>Claude</strong> ou <strong>Gemini</strong>, puis colle le JSON qu\'elle te renvoie — ton profil s\'affiche instantanément.',
        intro_3: 'Alors\u202f? Inquiet de ce que l\'IA sait de vous\u202f?',

        step1: '1 · Copie ce prompt',
        btn_copy_aria: 'Copier le prompt',
        btn_copy: 'Copier',
        btn_copied: 'Copié\u202f!',

        step2: '2 · Ouvre <span class="accent">ton IA</span> et colle le prompt',
        step2_sub: 'Ou ouvre le tien... peu importe\u202f!',
        step3: '3 · Colle la réponse ici',
        step3_sub: 'Le rendu se fait dans <span class="accent">ton navigateur</span>.<br>La réponse collée n’est pas envoyée au serveur.',
        step4: '4 · Visualise ton profil',
        step4_sub: 'Plus ton IA te connaît, plus le résultat est précis.',
        step4_line1: 'Reviens régulièrement <span class="accent">!</span>',
        step4_line2: 'Ton profil évolue avec tes conversations...',
        json_placeholder: '{"user_name": "...", "model_name": "...", ...}',
        json_error: 'JSON invalide — vérifie la syntaxe.',

        empty_title: 'Ton profil apparaît ici',
        empty_sub: 'Prêt à des surprises\u202f?',

        verdict_by: 'par',

        card_ton: 'Mon',
        card_style: 'Mon style',
        card_persona: 'Mon persona',
        card_forces: 'Mes forces',
        card_faiblesses: 'Mes faiblesses',
        card_themes: 'Mon univers thématique',
        card_contradictions: 'Mes contradictions',
        card_ai_knows: 'Ce que mon IA sait de moi',
        card_speech: 'Mes tournures récurrentes',
        card_registre: 'Mon registre linguistique',
        card_next_question: 'Ma prochaine question',
        card_next_project: 'Mon prochain projet',
        card_never_admit: 'Ce que je n’admettrai jamais', card_philosophy: 'Ma philosophie', security_ok: 'Aucune donnée sensible détectée',
        security_warn: 'Donnée(s) sensible(s) détectée(s) · Reparlez-en à votre IA',
        security_warn_title: 'Données sensibles détectées',
        security_warn_body: 'Des éléments potentiellement sensibles ont été relevés dans votre conversation. Consultez votre IA directement pour en savoir plus — elle seule peut vous confirmer ce qu’elle a vu.',
        footer_disclaimer: 'Profil généré par intelligence artificielle — à lire comme un miroir, pas comme une vérité.',
        btn_mentions: 'Mentions légales',
        btn_tweet: 'Tweet',
    },

    /* ── English ─────────────────────────────────────────────────────── */
    en: {
        title: 'You',
        description: 'Generate your intellectual profile with your favourite AI.',

        intro_1: 'Discover how your AI really sees you.',
        intro_2: 'Copy the prompt, paste it into <strong>ChatGPT</strong>, <strong>Claude</strong> or <strong>Gemini</strong>, then paste back the JSON it returns — your profile appears instantly.',
        intro_3: 'So? Worried about what the AI knows about you?',

        step1: '1 · Copy this prompt',
        btn_copy_aria: 'Copy the prompt',
        btn_copy: 'Copy',
        btn_copied: 'Copied!',

        step2: '2 · Open <span class="accent">your AI</span> and paste the prompt',
        step2_sub: 'Or open yours… whatever works!',
        step3: '3 · Paste the response here',
        step3_sub: 'Rendering happens in <span class="accent">your browser</span>.<br>The pasted response is not sent to the server.',
        step4: '4 · Visualise your profile',
        step4_sub: 'The more your AI knows you, the more accurate the result.',
        step4_line1: 'Come back regularly <span class="accent">!</span>',
        step4_line2: 'Your profile evolves with your conversations...',
        json_placeholder: '{"user_name": "...", "model_name": "...", ...}',
        json_error: 'Invalid JSON — check the syntax.',

        empty_title: 'Your profile appears here',
        empty_sub: 'Ready for some surprises?',

        verdict_by: 'by',

        card_ton: 'Tone',
        card_style: 'My style',
        card_persona: 'My persona',
        card_forces: 'Strengths',
        card_faiblesses: 'Weaknesses',
        card_themes: 'My thematic universe',
        card_contradictions: 'Contradictions',
        card_ai_knows: 'What my AI knows about me',
        card_speech: 'Recurring patterns',
        card_registre: 'My linguistic register',
        card_next_question: 'My next question',
        card_next_project: 'My next project',
        card_never_admit: 'What I’ll never admit', card_philosophy: 'My philosophy', security_ok: 'No sensitive data detected',
        security_warn: 'Sensitive data detected · Ask your AI',
        security_warn_title: 'Sensitive data detected',
        security_warn_body: 'Potentially sensitive elements were found in your conversation. Ask your AI directly for more details — it is the only one that can confirm what it saw.',
        footer_disclaimer: 'Profile generated by artificial intelligence — to be read as a mirror, not a truth.',
        btn_mentions: 'Legal notice',
        btn_tweet: 'Tweet',
    },

    /* ── Spanish ─────────────────────────────────────────────────────── */
    es: {
        title: 'You',
        description: 'Genera tu perfil intelectual con tu IA favorita.',

        intro_1: 'Descubre cómo tu IA te ve realmente.',
        intro_2: 'Copia el prompt, pégalo en <strong>ChatGPT</strong>, <strong>Claude</strong> o <strong>Gemini</strong>, luego pega el JSON que te devuelve — tu perfil aparece al instante.',
        intro_3: '¿Y bien? ¿Preocupado por lo que la IA sabe de ti?',

        step1: '1 · Copia este prompt',
        btn_copy_aria: 'Copiar el prompt',
        btn_copy: 'Copiar',
        btn_copied: '¡Copiado!',

        step2: '2 · Abre <span class="accent">tu IA</span> y pega el prompt',
        step2_sub: 'O abre la tuya... ¡lo que sea!',
        step3: '3 · Pega la respuesta aquí',
        step3_sub: 'El renderizado ocurre en <span class="accent">tu navegador</span>.<br>La respuesta pegada no se envía al servidor.',
        step4: '4 · Visualiza tu perfil',
        step4_sub: 'Cuanto más te conoce tu IA, más preciso es el resultado.',
        step4_line1: '¡Vuelve regularmente<span class="accent">!</span>',
        step4_line2: 'Tu perfil evoluciona con tus conversaciones...',
        json_placeholder: '{"user_name": "...", "model_name": "...", ...}',
        json_error: 'JSON inválido — verifica la sintaxis.',

        empty_title: 'Tu perfil aparece aquí',
        empty_sub: '¿Listo para algunas sorpresas?',

        verdict_by: 'por',

        card_ton: 'Tono',
        card_style: 'Mi estilo',
        card_persona: 'Mi persona',
        card_forces: 'Fortalezas',
        card_faiblesses: 'Debilidades',
        card_themes: 'Mi universo temático',
        card_contradictions: 'Contradicciones',
        card_ai_knows: 'Lo que mi IA sabe de mí',
        card_speech: 'Patrones recurrentes',
        card_registre: 'Mi registro lingüístico',
        card_next_question: 'Mi próxima pregunta',
        card_next_project: 'Mi próximo proyecto',
        card_never_admit: 'Lo que nunca admitiré',
        card_philosophy: 'Mi filosofía',
        security_ok: 'No se detectaron datos sensibles',
        security_warn: 'Dato(s) sensible(s) detectado(s) · Consulta tu IA',
        security_warn_title: 'Datos sensibles detectados',
        security_warn_body: 'Se encontraron elementos potencialmente sensibles en tu conversación. Consulta tu IA directamente para más detalles — solo ella puede confirmar lo que vio.',
        footer_disclaimer: 'Perfil generado por inteligencia artificial — léelo como un espejo, no como una verdad.',
        btn_mentions: 'Aviso legal',
        btn_tweet: 'Tweet',
    },

    /* ── Portuguese ──────────────────────────────────────────────────── */
    pt: {
        title: 'You',
        description: 'Gera o teu perfil intelectual com a tua IA favorita.',

        intro_1: 'Descobre como a tua IA te vê realmente.',
        intro_2: 'Copia o prompt, cola-o no <strong>ChatGPT</strong>, <strong>Claude</strong> ou <strong>Gemini</strong>, depois cola o JSON que ele te devolve — o teu perfil aparece imediatamente.',
        intro_3: 'E então? Preocupado com o que a IA sabe de ti?',

        step1: '1 · Copia este prompt',
        btn_copy_aria: 'Copiar o prompt',
        btn_copy: 'Copiar',
        btn_copied: 'Copiado!',

        step2: '2 · Abre <span class="accent">a tua IA</span> e cola o prompt',
        step2_sub: 'Ou abre a tua... tanto faz!',
        step3: '3 · Cola a resposta aqui',
        step3_sub: 'A renderização acontece no <span class="accent">teu navegador</span>.<br>A resposta colada não é enviada ao servidor.',
        step4: '4 · Visualiza o teu perfil',
        step4_sub: 'Quanto mais a tua IA te conhece, mais preciso é o resultado.',
        step4_line1: 'Volta regularmente <span class="accent">!</span>',
        step4_line2: 'O teu perfil evolui com as tuas conversas...',
        json_placeholder: '{"user_name": "...", "model_name": "...", ...}',
        json_error: 'JSON inválido — verifica a sintaxe.',

        empty_title: 'O teu perfil aparece aqui',
        empty_sub: 'Pronto para algumas surpresas?',

        verdict_by: 'por',

        card_ton: 'Tom',
        card_style: 'O meu estilo',
        card_persona: 'A minha persona',
        card_forces: 'Pontos fortes',
        card_faiblesses: 'Pontos fracos',
        card_themes: 'O meu universo temático',
        card_contradictions: 'Contradições',
        card_ai_knows: 'O que a minha IA sabe de mim',
        card_speech: 'Padrões recorrentes',
        card_registre: 'O meu registo linguístico',
        card_next_question: 'A minha próxima pergunta',
        card_next_project: 'O meu próximo projeto',
        card_never_admit: 'O que nunca admitirei',
        card_philosophy: 'A minha filosofia',
        security_ok: 'Nenhum dado sensível detetado',
        security_warn: 'Dado(s) sensível(eis) detetado(s) · Consulta a tua IA',
        security_warn_title: 'Dados sensíveis detetados',
        security_warn_body: 'Foram encontrados elementos potencialmente sensíveis na tua conversa. Consulta a tua IA diretamente para mais detalhes — só ela pode confirmar o que viu.',
        footer_disclaimer: 'Perfil gerado por inteligência artificial — leia como um espelho, não como uma verdade.',
        btn_mentions: 'Avisos legais',
        btn_tweet: 'Tweet',
    },

    /* ── German ──────────────────────────────────────────────────────── */
    de: {
        title: 'You',
        description: 'Erstelle dein intellektuelles Profil mit deiner Lieblings-KI.',

        intro_1: 'Entdecke, wie deine KI dich wirklich sieht.',
        intro_2: 'Kopiere den Prompt, füge ihn in <strong>ChatGPT</strong>, <strong>Claude</strong> oder <strong>Gemini</strong> ein, dann füge den JSON zurück ein — dein Profil erscheint sofort.',
        intro_3: 'Na? Beunruhigt, was die KI über dich weiß?',

        step1: '1 · Kopiere diesen Prompt',
        btn_copy_aria: 'Prompt kopieren',
        btn_copy: 'Kopieren',
        btn_copied: 'Kopiert!',

        step2: '2 · Öffne <span class="accent">deine KI</span> und füge den Prompt ein',
        step2_sub: 'Oder öffne deine eigene… egal!',
        step3: '3 · Füge die Antwort hier ein',
        step3_sub: 'Das Rendering passiert in <span class="accent">deinem Browser</span>.<br>Die eingefügte Antwort wird nicht an den Server gesendet.',
        step4: '4 · Visualisiere dein Profil',
        step4_sub: 'Je mehr deine KI dich kennt, desto präziser das Ergebnis.',
        step4_line1: 'Komm regelmäßig wieder <span class="accent">!</span>',
        step4_line2: 'Dein Profil entwickelt sich mit deinen Gesprächen...',
        json_placeholder: '{"user_name": "...", "model_name": "...", ...}',
        json_error: 'Ungültiges JSON — überprüfe die Syntax.',

        empty_title: 'Dein Profil erscheint hier',
        empty_sub: 'Bereit für einige Überraschungen?',

        verdict_by: 'von',

        card_ton: 'Ton',
        card_style: 'Mein Stil',
        card_persona: 'Meine Persona',
        card_forces: 'Stärken',
        card_faiblesses: 'Schwächen',
        card_themes: 'Mein thematisches Universum',
        card_contradictions: 'Widersprüche',
        card_ai_knows: 'Was meine KI über mich weiß',
        card_speech: 'Wiederkehrende Muster',
        card_registre: 'Mein Sprachregister',
        card_next_question: 'Meine nächste Frage',
        card_next_project: 'Mein nächstes Projekt',
        card_never_admit: 'Was ich nie zugeben werde',
        card_philosophy: 'Meine Philosophie',
        security_ok: 'Keine sensiblen Daten entdeckt',
        security_warn: 'Sensible Daten erkannt · Fragen Sie Ihre KI',
        security_warn_title: 'Sensible Daten erkannt',
        security_warn_body: 'In deinem Gespräch wurden potenziell sensible Elemente gefunden. Wende dich direkt an deine KI für weitere Details — nur sie kann bestätigen, was sie gesehen hat.',
        footer_disclaimer: 'Profil von künstlicher Intelligenz generiert — als Spiegel zu lesen, nicht als Wahrheit.',
        btn_mentions: 'Impressum',
        btn_tweet: 'Tweet',
    },
};

/* ─── Language detection ─────────────────────────────────────────────── */
function detectLang() {
    const stored = localStorage.getItem('you_lang');
    if (stored && LOCALES[stored]) return stored;
    const nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
    return LOCALES[nav] ? nav : 'fr';
}

/* ─── Current language (mutable) ────────────────────────────────────── */
let _lang = detectLang();

/* ─── Translation helper — falls back to FR for missing keys ─────────── */
function t(key) {
    return (LOCALES[_lang]?.[key]) ?? (LOCALES['fr'][key] ?? key);
}

/* ─── Prompt with injected language ─────────────────────────────────── */
const LANG_NAMES = { fr: 'French', en: 'English', es: 'Spanish', pt: 'Portuguese', de: 'German' };
function getPrompt() {
    return PROMPT_TEMPLATE.replace('{lang}', LANG_NAMES[_lang] || 'the user\'s language');
}

/* ─── Apply language to the entire DOM ──────────────────────────────── */
function setLang(lang) {
    if (!LOCALES[lang]) return;
    _lang = lang;
    localStorage.setItem('you_lang', lang);

    document.documentElement.lang = lang;
    document.title = t('title');

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t('description'));

    // Plain text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });

    // HTML nodes — safe: values come exclusively from our static LOCALES object
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        el.innerHTML = t(el.dataset.i18nHtml);
    });

    // Placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    // aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });

    // Prompt box (managed separately to keep it out of the data-i18n loop)
    const promptEl = document.getElementById('prompt-text');
    if (promptEl) promptEl.textContent = getPrompt();

    // Active state on lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

/* ─── Bootstrap ──────────────────────────────────────────────────────── */
// Scripts are placed at end of <body> so DOM is already complete here.
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setLang(btn.dataset.lang);
        window.umami?.track('language_changed', { lang: btn.dataset.lang });
    });
});

setLang(_lang);
