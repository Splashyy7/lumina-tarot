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
            systemPrompt: `Você é um leitor de Tarot experiente, honesto, direto e realista.
SEU OBJETIVO:
Dar uma resposta REAL, ESPECÍFICA e DIRETA para a pessoa, conectando as cartas com situações práticas do dia a dia, sem fugir da pergunta e sem enrolação.

REGRAS OBRIGATÓRIAS:
1. PROIBIDO RESPOSTAS GENÉRICAS OU EVASIVAS:
- Nunca use frases vazias de horóscopo como "o universo está agindo", "energias cósmicas fluem", "confie no fluxo", "coisas boas virão".
- Responda DIRETAMENTE à pergunta ou dúvida da pessoa. Diga o que está acontecendo de verdade, o que está favorável e o que está dando errado.

2. SEJA HONESTO COM CARTAS DIFÍCEIS OU SOMBRIAS (SEM PASSAR PANO):
- Se saírem cartas desafiadoras ou invertidas (como O Diabo, A Torre, 3 de Espadas, 10 de Espadas, 7 de Espadas, 5 de Ouros, 5 de Copas, A Lua, A Morte, O Enforcado, etc.), NUNCA tente suavizar ou inventar um lado bonitinho.
- Relacione a carta diretamente com problemas reais do cotidiano:
  * O Diabo: apegos tóxicos, vícios, dependência emocional, ficar preso a um emprego ou relacionamento ruim por comodismo ou dinheiro, manipulação, autossabotagem.
  * A Torre: rompimento repentino, choque de realidade, perda inesperada, verdade dura que veio à tona, estrutura frágil que desabou.
  * 3 de Espadas / 10 de Espadas: coração partido, traição, decepção profunda, sensação de estar no fundo do poço, conversa que machucou.
  * 7 de Espadas: mentiras, alguém agindo pelas costas, fuga de responsabilidades, atalhos desonestos.
  * 5 de Ouros / Pentáculos: aperto financeiro, medo da escassez, sensação de estar desamparado ou excluído.
  * A Lua: mentiras, desconfiança, ciúmes, ilusões, coisas escondidas.
  * O Louco (invertido) / 2 de Espadas: imprudência, fingir que não vê o problema, teimosia em não decidir.

3. LINGUAGEM CLARA, HUMANA E ACESSÍVEL:
- Use português simples, direto e do dia a dia.
- Nada de termos rebuscados ou arcaicos (como transmutação, epifania, diletantismo, éter, arquetípico).

4. ESTRUTURA OBRIGATÓRIA (3 SEÇÕES):
### 🔍 O que as cartas mostram
(Diga a realidade dos fatos e responda à dúvida da pessoa sem rodeios)

### 💡 O que está acontecendo por trás
(Explique as causas reais, os sentimentos, as atitudes erradas ou os desafios práticos envolvidos)

### 🧭 O que fazer na prática
(Dê um conselho realista e aplicável: o que a pessoa deve fazer e o que deve parar de fazer agora)`
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

  // Realistic, Direct & Honest Local Fallback
  generateOfflineFallback({ spreadConfig, chosenCards, userQuestion }) {
    const validCards = chosenCards.filter(Boolean);
    const first = validCards[0];
    const middle = validCards[Math.floor(validCards.length / 2)] || first;
    const last = validCards[validCards.length - 1] || first;
    const q = (userQuestion || '').trim();

    // Identify shadow or warning cards
    const shadowCard = validCards.find(c => 
      c.isReversed || 
      ['O Diabo', 'A Torre', 'A Morte', 'A Lua', 'Três de Espadas', 'Dez de Espadas', 'Sete de Espadas', 'Cinco de Ouros', 'Cinco de Copas', 'O Enforcado'].some(name => c.name.includes(name))
    );

    let diagnosis = '';
    if (q) {
      if (first.isReversed || (shadowCard && shadowCard.id === first.id)) {
        diagnosis = `Respondendo diretamente sobre "${q}": a carta ${first.name} ${first.isReversed ? '(Invertida)' : ''} aponta um sinal de alerta claro. Na prática, você está lidando com ${first.shadow ? first.shadow.toLowerCase() : 'bloqueios e descontentamento'}, o que indica que insistir no mesmo caminho sem mudar de atitude só vai trazer mais desgaste.`;
      } else {
        diagnosis = `Respondendo diretamente sobre "${q}": a carta ${first.name} indica que o cenário atual depende de ${first.light.toLowerCase()}. Não fique esperando as coisas se resolverem sozinhas; você precisa assumir a postura que essa carta pede.`;
      }
    } else {
      diagnosis = `A carta ${first.name} ${first.isReversed ? '(Invertida)' : ''} mostra que o seu momento atual está marcado por ${first.isReversed ? first.shadow?.toLowerCase() : first.light?.toLowerCase()}. É preciso encarar a situação de frente, sem fingir que está tudo bem quando não está.`;
    }

    let dynamics = '';
    if (shadowCard && shadowCard.id !== first.id) {
      dynamics = `O ponto crítico desta tiragem é a presença de ${shadowCard.name} ${shadowCard.isReversed ? '(Invertida)' : ''}. No dia a dia, isso aponta para problemas como ${shadowCard.shadow?.toLowerCase() || 'apego, ilusão ou desgaste'}. Em conjunto com ${middle.name}, isso mostra que há atitudes ou relações que estão te prendendo e impedindo o seu avanço.`;
    } else {
      dynamics = `A relação entre ${first.name} e ${middle.name} mostra o que está pesando no momento: de um lado a necessidade de agir, e do outro o risco de cair em ${middle.isReversed ? middle.shadow?.toLowerCase() : 'hesitação ou apego a velhos hábitos'}.`;
    }

    let advice = `O conselho direto da carta ${last.name} é: "${last.advice}". Seja realista, pare de adiar decisões difíceis e corte o que está te fazendo mal.`;

    return {
      source: 'local_fallback',
      diagnosis,
      dynamics,
      advice,
      text: `### 🔍 O que as cartas mostram\n${diagnosis}\n\n### 💡 O que está acontecendo por trás\n${dynamics}\n\n### 🧭 O que fazer na prática\n${advice}`
    };
  }
};
