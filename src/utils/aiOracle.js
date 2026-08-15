// Real AI Oracle Integration via Serverless Cloudflare Worker Proxy (100% Free, Zero Login, Zero User Keys)
// With Full Archetypal Fallback Engine

// Cloudflare Worker Endpoint (Can be set in .env as VITE_ORACLE_API_URL or customized)
const DEFAULT_WORKER_URL = import.meta.env.VITE_ORACLE_API_URL || 'https://lumina-oracle.jpedrooliveiragritz.workers.dev';

// Parse structured markdown sections
const parseAiSections = (text) => {
  if (!text) return null;

  let diagnosis = '';
  let dynamics = '';
  let advice = '';

  const diagMatch = text.match(/###\s*🌌[^\n]*\n([\s\S]*?)(?=###\s*🔮|$)/i);
  const dynMatch = text.match(/###\s*🔮[^\n]*\n([\s\S]*?)(?=###\s*🗝️|$)/i);
  const advMatch = text.match(/###\s*🗝️[^\n]*\n([\s\S]*?)$/i);

  if (diagMatch && dynMatch && advMatch) {
    diagnosis = diagMatch[1].trim();
    dynamics = dynMatch[1].trim();
    advice = advMatch[1].trim();
  } else {
    // If headers were slightly altered by AI, split gracefully by double newlines
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 20);
    if (paragraphs.length >= 3) {
      diagnosis = paragraphs[0].replace(/^###\s*[^\n]*\n?/, '').trim();
      dynamics = paragraphs[1].replace(/^###\s*[^\n]*\n?/, '').trim();
      advice = paragraphs.slice(2).join('\n\n').replace(/^###\s*[^\n]*\n?/, '').trim();
    } else {
      diagnosis = text.trim();
    }
  }

  return {
    diagnosis,
    dynamics,
    advice,
    text: text.trim()
  };
};

export const aiOracleService = {
  // Call Cloudflare Worker AI Proxy (Gemini 1.5 Flash - Real AI, Zero Login)
  async generateRealAiReading({ spreadConfig, chosenCards, userQuestion }) {
    const validCards = chosenCards.filter(Boolean);
    if (validCards.length === 0) return null;

    const workerUrl = DEFAULT_WORKER_URL || localStorage.getItem('lumina_worker_url') || '';

    if (workerUrl) {
      try {
        const response = await fetch(workerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            spreadConfig: {
              name: spreadConfig.name,
              description: spreadConfig.description,
              positions: spreadConfig.positions
            },
            chosenCards: validCards.map((c, i) => ({
              name: c.name,
              arcana: c.arcana,
              suit: c.suit,
              isReversed: Boolean(c.isReversed),
              keywords: c.keywords,
              light: c.light,
              shadow: c.shadow,
              advice: c.advice,
              positionName: spreadConfig.positions[i]?.name || `Posição ${i + 1}`
            })),
            userQuestion: (userQuestion || '').trim()
          })
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.text || data.reading || data.content || '';
          if (generatedText) {
            const parsed = parseAiSections(generatedText);
            return {
              source: 'cloudflare_gemini_ai',
              ...parsed
            };
          }
        }
      } catch (err) {
        console.warn('Worker proxy unavailable, using archetypal engine:', err);
      }
    }

    // Seamless Local Archetypal Fallback
    return this.generateOfflineFallback({ spreadConfig, chosenCards, userQuestion });
  },

  // Robust Local Fallback (zero network requirements)
  generateOfflineFallback({ spreadConfig, chosenCards, userQuestion }) {
    const validCards = chosenCards.filter(Boolean);
    const first = validCards[0];
    const middle = validCards[Math.floor(validCards.length / 2)] || first;
    const last = validCards[validCards.length - 1] || first;
    const q = (userQuestion || '').trim();

    let diagnosis = q 
      ? `Ao sintonizar sua busca perante "${q}", o oráculo revela que o ponto de partida exige olhar para além das aparências: ${first.light.toLowerCase()}. As respostas que você procura pedem serenidade para acolher o ritmo natural dos acontecimentos.`
      : `O portal oracular desta tiragem desvela que o seu momento presente está ancorado em ${first.light.toLowerCase()}, convidando você à clareza interior e à auto-observação.`;

    let dynamics = `No coração deste processo, o diálogo entre ${first.name} e ${middle.name} demonstra que as forças cósmicas estão reorganizando suas prioridades. Há uma travessia entre o que precisa ser deixado para trás e a nova energia que desponta.`;

    let advice = `A leitura conclui com a sabedoria de ${last.name}: "${last.advice}". Confie na sua intuição e avance com integridade.`;

    return {
      source: 'local_fallback',
      diagnosis,
      dynamics,
      advice,
      text: `### 🌌 O Diagnóstico da Intenção\n${diagnosis}\n\n### 🔮 A Dinâmica das Forças Ocultas\n${dynamics}\n\n### 🗝️ O Conselho Sagrado do Oráculo\n${advice}`
    };
  }
};
