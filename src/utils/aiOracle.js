// Real AI Oracle Integration via Serverless Cloudflare Worker Proxy (100% Free, Zero Login, Zero User Keys)
// With Full Archetypal Fallback Engine & Bulletproof Section Parser

// Cloudflare Worker Endpoint
const DEFAULT_WORKER_URL = import.meta.env.VITE_ORACLE_API_URL || 'https://lumina-oracle.jpedrooliveiragritz.workers.dev';

const cleanHeader = (str) => {
  if (!str) return '';
  return str
    .replace(/^###\s*[^\n]*\n?/gi, '')
    .replace(/^###\s*🌌[^\n]*/gi, '')
    .replace(/^###\s*🔮[^\n]*/gi, '')
    .replace(/^###\s*🗝️[^\n]*/gi, '')
    .trim();
};

// Parse structured markdown sections with total resilience against truncation
const parseAiSections = (text, fallbackData) => {
  if (!text) return null;

  let diagnosis = '';
  let dynamics = '';
  let advice = '';

  // Match sections by emoji or markdown headers
  const diagMatch = text.match(/(?:###\s*🌌|🌌)[^\n]*\n?([\s\S]*?)(?=(?:###\s*🔮|🔮)|$)/i);
  const dynMatch = text.match(/(?:###\s*🔮|🔮)[^\n]*\n?([\s\S]*?)(?=(?:###\s*🗝️|🗝️)|$)/i);
  const advMatch = text.match(/(?:###\s*🗝️|🗝️)[^\n]*\n?([\s\S]*?)$/i);

  if (diagMatch && diagMatch[1]) diagnosis = cleanHeader(diagMatch[1]);
  if (dynMatch && dynMatch[1]) dynamics = cleanHeader(dynMatch[1]);
  if (advMatch && advMatch[1]) advice = cleanHeader(advMatch[1]);

  // If dynamics or advice is missing due to any network/token cut, split logically
  if (!dynamics || !advice || dynamics.length < 10 || advice.length < 10) {
    const rawClean = text.replace(/###\s*[^\n]*\n?/g, '').trim();
    const paragraphs = rawClean.split('\n\n').filter(p => p.trim().length > 15);
    
    if (paragraphs.length >= 3) {
      diagnosis = paragraphs[0].trim();
      dynamics = paragraphs[1].trim();
      advice = paragraphs.slice(2).join('\n\n').trim();
    } else if (paragraphs.length === 2) {
      diagnosis = paragraphs[0].trim();
      dynamics = paragraphs[1].trim();
      advice = fallbackData?.advice || 'O oráculo orienta: cultive a paciência lúcida e acolha as transformações com equilíbrio.';
    } else if (paragraphs.length === 1 && paragraphs[0].length > 20) {
      diagnosis = paragraphs[0].trim();
      dynamics = fallbackData?.dynamics || 'As forças cósmicas atuam nos bastidores para reordenar suas prioridades e abrir caminhos mais sólidos.';
      advice = fallbackData?.advice || 'Aja com discernimento e confie no tempo sagrado de maturação dos seus anseios.';
    }
  }

  return {
    diagnosis: diagnosis || text.trim(),
    dynamics: dynamics || (fallbackData?.dynamics || 'As energias do momento pedem observação atenta e discernimento.'),
    advice: advice || (fallbackData?.advice || 'Mantenha a integridade em suas escolhas e siga sua intuição.'),
    text: text.trim()
  };
};

export const aiOracleService = {
  // Call Cloudflare Worker AI Proxy (Gemini 2.0 / Flash - Real AI, Zero Login)
  async generateRealAiReading({ spreadConfig, chosenCards, userQuestion }) {
    const validCards = chosenCards.filter(Boolean);
    if (validCards.length === 0) return null;

    const fallback = this.generateOfflineFallback({ spreadConfig, chosenCards, userQuestion });
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
              positionName: spreadConfig.positions?.[i]?.name || `Posição ${i + 1}`
            })),
            userQuestion: (userQuestion || '').trim()
          })
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.text || data.reading || data.content || '';
          if (generatedText && generatedText.length > 25) {
            const parsed = parseAiSections(generatedText, fallback);
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
    return fallback;
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
