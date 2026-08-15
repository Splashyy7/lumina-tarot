// Real AI Oracle Integration via Serverless Cloudflare Worker Proxy (100% Free, Zero Login, Zero User Keys)
// With Full Archetypal Fallback Engine & Bulletproof Section Parser

// Cloudflare Worker Endpoint
const DEFAULT_WORKER_URL = import.meta.env.VITE_ORACLE_API_URL || 'https://lumina-oracle.jpedrooliveiragritz.workers.dev';

const cleanHeader = (str) => {
  if (!str) return '';
  return str
    .replace(/^###\s*[^\n]*\n?/gi, '')
    .replace(/^###\s*🔍[^\n]*/gi, '')
    .replace(/^###\s*💡[^\n]*/gi, '')
    .replace(/^###\s*🧭[^\n]*/gi, '')
    .replace(/^###\s*🌌[^\n]*/gi, '')
    .replace(/^###\s*🔮[^\n]*/gi, '')
    .replace(/^###\s*🗝️[^\n]*/gi, '')
    .trim();
};

// Parse structured markdown sections with total resilience
const parseAiSections = (text, fallbackData) => {
  if (!text) return null;

  let diagnosis = '';
  let dynamics = '';
  let advice = '';

  // Match sections by modern clean emojis/headers or legacy headers
  const diagMatch = text.match(/(?:###\s*(?:🔍|🌌)|(?:🔍|🌌))[^\n]*\n?([\s\S]*?)(?=(?:###\s*(?:💡|🔮)|(?:💡|🔮))|$)/i);
  const dynMatch = text.match(/(?:###\s*(?:💡|🔮)|(?:💡|🔮))[^\n]*\n?([\s\S]*?)(?=(?:###\s*(?:🧭|🗝️)|(?:🧭|🗝️))|$)/i);
  const advMatch = text.match(/(?:###\s*(?:🧭|🗝️)|(?:🧭|🗝️))[^\n]*\n?([\s\S]*?)$/i);

  if (diagMatch && diagMatch[1]) diagnosis = cleanHeader(diagMatch[1]);
  if (dynMatch && dynMatch[1]) dynamics = cleanHeader(dynMatch[1]);
  if (advMatch && advMatch[1]) advice = cleanHeader(advMatch[1]);

  // Fallback splitting if tokens were cut
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
      advice = fallbackData?.advice || 'O conselho principal é manter a calma, ser honesto com você mesmo e não tomar decisões por impulso.';
    } else if (paragraphs.length === 1 && paragraphs[0].length > 20) {
      diagnosis = paragraphs[0].trim();
      dynamics = fallbackData?.dynamics || 'A situação atual pede paciência para enxergar as coisas com mais clareza.';
      advice = fallbackData?.advice || 'Dê um passo de cada vez e confie na sua intuição.';
    }
  }

  return {
    diagnosis: diagnosis || text.trim(),
    dynamics: dynamics || (fallbackData?.dynamics || 'A situação atual pede calma e observação atenta.'),
    advice: advice || (fallbackData?.advice || 'Mantenha os pés no chão e faça escolhas conscientes.'),
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
            userQuestion: (userQuestion || '').trim(),
            systemPrompt: `Você é um guia de Tarot amigável, direto, humano e acolhedor.
REGRAS OBRIGATÓRIAS:
1. Use uma linguagem simples, clara, acessível e fácil de entender por qualquer pessoa comum.
2. NÃO use palavras difíceis, rebuscadas, arcaicas ou excessivamente teatrais/místicas (evite termos como "transmutação", "epifania", "conjunção cósmica", "diletantismo", etc).
3. Seja prático e direto: explique o que está acontecendo na vida real da pessoa e dê conselhos fáceis de aplicar no dia a dia.
4. Estruture SEMPRE sua resposta exatamente nestas 3 seções:
### 🔍 O que as cartas mostram
(Explique a situação de forma simples e direta, respondendo à pergunta da pessoa se houver)

### 💡 O que está acontecendo por trás
(Explique os desafios, sentimentos ou detalhes práticos envolvidos na situação)

### 🧭 O que fazer na prática
(Dê um conselho útil, claro e encorajador para o dia a dia)`
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
        console.warn('Worker proxy unavailable, using clear fallback engine:', err);
      }
    }

    // Seamless Local Fallback
    return fallback;
  },

  // Clear, Human, Direct Local Fallback (zero network requirements)
  generateOfflineFallback({ spreadConfig, chosenCards, userQuestion }) {
    const validCards = chosenCards.filter(Boolean);
    const first = validCards[0];
    const middle = validCards[Math.floor(validCards.length / 2)] || first;
    const last = validCards[validCards.length - 1] || first;
    const q = (userQuestion || '').trim();

    let diagnosis = q 
      ? `Pensando na sua dúvida sobre "${q}", a carta ${first.name} mostra que o ponto principal agora é ter clareza sobre o que você realmente quer: ${first.light.toLowerCase()}. Não tente apressar as coisas antes da hora certa.`
      : `Para este momento, a carta ${first.name} mostra que o mais importante agora é olhar para a sua realidade com calma: ${first.light.toLowerCase()}.`;

    let dynamics = `O momento atual envolve entender a ligação entre ${first.name} e ${middle.name}. Na prática, isso quer dizer que você está passando por uma fase de mudança, onde precisa deixar o que não funciona mais para trás e focar no que te traz segurança.`;

    let advice = `O conselho prático da carta ${last.name} é: "${last.advice}". Mantenha os pés no chão, seja sincero com você mesmo e dê um passo de cada vez.`;

    return {
      source: 'local_fallback',
      diagnosis,
      dynamics,
      advice,
      text: `### 🔍 O que as cartas mostram\n${diagnosis}\n\n### 💡 O que está acontecendo por trás\n${dynamics}\n\n### 🧭 O que fazer na prática\n${advice}`
    };
  }
};
