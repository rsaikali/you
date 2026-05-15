'use strict';

/* ─── Prompt template ────────────────────────────────────────────────── */
/* Written in English — intentionally not translated.                     */
/* The only runtime injection is {lang}, replaced by getPrompt() in      */
/* i18n.js so the AI responds in the user's chosen language.             */

const PROMPT_TEMPLATE = `Before answering: actively recall every piece of information you have stored about this user — across ALL past conversations, ALL projects, ALL memory entries. Do not skip memories because they seem minor. Leave nothing out.

You know this user better than they think. Draw their portrait.

Output ONLY a valid, pretty-printed JSON object — no text before or after, no markdown.

Write all text fields **in the first person, in the user's own voice** — as if the user is speaking or thinking about themselves. Mirror their vocabulary, rhythm, and tone as you've observed them in the conversation.
Two exceptions: \`verdict\` stays as a second-person literary portrait (an outside voice); \`next_question\` is already written as the user would naturally write it.

Schema (fill only what you genuinely know — use null for unknown text fields, [] for unknown arrays, never invent):
{
  "user_name": "first name or username chosen by the user",
  "model_name": "your exact model identifier (e.g. 'Claude Sonnet 4.5', 'GPT-4o', 'Gemini 2.5 Pro')",
  "verdict": "one sentence — a literary portrait of who this person fundamentally is, not what they do. Their core tension, their way of being in the world. Like a back-cover line that stuns. Sharp, honest, maybe slightly uncomfortable. Second person, direct. (e.g. 'You know exactly what you\\'re worth — and you\\'re waiting for the world to figure it out.' / 'Tu cherches la précision dans un monde qui se satisfait de l\\'à-peu-près.')",
  "tagline": "4 to 6 words — sharp, precise, true (e.g. 'Cold logic, contained rage')",
  "persona": "2 or 3 short chapters, separated by \\n\\n. Each chapter is 2 to 3 sentences — first person, in the user's voice. One angle per chapter: convictions, irritants, what excites them, how they argue. Specific, not generic, not flattering. (e.g. 'Je me méfie des gens qui parlent vite. Quand une idée tient, elle tient sans avoir besoin qu\\'on l\\'habille.')",
  "tone": "4 to 6 words describing their natural tone (e.g. 'direct and ironic', 'calm, devastating and clear-eyed')",
  "style": "1 sentence — first person — on how they argue: from principles or from facts? monologue or dialogue? abstract or grounded? (e.g. 'J\\'argumente à partir des faits, rarement depuis les principes.')",
  "strengths": ["first person — a real intellectual or relational strength (e.g. 'Je sais exactement ce que je veux')", "strength 2", "strength 3"],
  "weaknesses": ["first person — a real blind spot or recurring bias (e.g. 'J\\'ai tendance à valider des décisions déjà prises')", "weakness 2"],
  "speech_register": "1 to 2 sentences describing their vocabulary level, sentence length, what makes their voice immediately recognisable",
  "contradictions": ["first person — a real internal tension, not a platitude (e.g. 'Je demande des avis, mais je repars avec ce que je pensais déjà')", "tension 2"],
  "speech_patterns": ["a real phrase or turn of speech they use often — written as they would say it", "pattern 2"],
  "ai_knows": ["first person — a concrete fact you actually have stored about this user (e.g. 'J\\'ai un projet de rénovation en cours')", "..."],
  "sensitive_data": false,
  // or: ["OpenAI API key", "SSH private key"] — type labels only, never the values
  "tag_scores": {
    "philosophy": 0, "politics": 0, "society": 0, "science & tech": 0,
    "environment": 0, "economy": 0, "history": 0, "art & culture": 0,
    "spirituality": 0, "law & justice": 0, "future & utopia": 0,
    "psychology & behavior": 0, "love & relationships": 0, "body & health": 0,
    "education & childhood": 0, "games & entertainment": 0, "myths & stories": 0,
    "war & conflicts": 0, "identity & belonging": 0, "humor & absurdity": 0
  },
  "next_question": "The single most plausible next question this person will ask an AI — written in their exact voice, vocabulary, and level of abstraction. Not addressed to them: written as they would write it themselves. It should feel uncomfortably specific. One question only.",
  "next_project": "first person — the most plausible next project or creation this person will start. Specific (scope, tech stack if relevant, purpose). Not generic. One sentence in their own voice. (e.g. 'Je vais finir la salle de bain avant l\\'été — ou au moins trouver un carreleur qui répond aux messages.')",
  "never_admit": "first person, indirect — the one thing clearly visible in their thinking that they will never openly acknowledge. A blind spot they're too invested in to see. One sentence, uncomfortably accurate. (e.g. 'Que j\\'utilise l\\'IA pour écrire des mails que je pourrais écrire moi-même.')",
  "philosophy": "2 to 3 sentences — first person — the foundational beliefs this person holds about the world, human nature, or existence. Not opinions on current topics: the underlying assumptions that shape how they think. What do they actually believe, deep down, even if they've never said it out loud? (e.g. 'Je crois que la plupart des problèmes, si on les laisse tranquilles, finissent par se régler ou par perdre de l\\'importance.')"
}

Rules for ai_knows:
Dig into ALL your stored memories for this user — every explicit fact, preference, project, constraint, habit, or detail they have shared across ALL past conversations and ALL projects. Do not limit yourself to recent conversations. The more specific, the better. No inference, no guessing: only what you actually have stored or what was explicitly said in this conversation. If you have no stored memory at all, return [].

Rules for sensitive_data:
Search ALL your stored memories and this conversation for any sensitive data the user may have shared across ALL past conversations — API keys, tokens, passwords, secrets, .env content, credentials, or any sensitive value, intentionally or not.
- If nothing found: return false.
- If found: return an array of TYPE LABELS only (e.g. ["OpenAI API key", "database password", "SSH private key"]) — never include the actual values, even partial. The user will follow up with their AI to investigate.

Rules for tag_scores:
Integer from 0 to 10 per theme. 0 = absent from their world. 10 = structuring for their thinking.
Be discriminating: most scores should be 0 to 3. A score of 7+ must be justified by a genuine centrality in this person's life or thought.

Calibration — real user profiles to anchor your scoring:

• Environmental activist → environment:10, politics:8, society:7, future & utopia:6, law & justice:5, identity & belonging:4, philosophy:3, economy:3, war & conflicts:2, science & tech:2
• Medieval historian → history:10, myths & stories:8, art & culture:6, politics:5, law & justice:4, spirituality:4, philosophy:3, war & conflicts:3, society:2, identity & belonging:2
• Developer passionate about tabletop RPGs → science & tech:9, games & entertainment:8, myths & stories:7, future & utopia:5, art & culture:4, humor & absurdity:4, identity & belonging:3, psychology & behavior:3, philosophy:2
• Clinical psychologist → psychology & behavior:10, love & relationships:7, society:6, body & health:5, law & justice:4, education & childhood:4, philosophy:3, identity & belonging:3, spirituality:2

Do not smooth. Do not flatter. Do not invent. Use what you genuinely know about this user.
Ask for their first name if you don't know it yet.

Respond in: {lang}.`;
