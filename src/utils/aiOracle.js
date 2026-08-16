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
            systemPrompt: `Você é um leitor de Tarot tradicional, objetivo, direto e sem rodeios.
SEU OBJETIVO:
Responder de forma REAL, ESPECÍFICA e CONCRETA exatamente ao que foi perguntado, interpretando o que as cartas revelam sobre a situação ou sobre as pessoas envolvidas.

REGRAS OBRIGATÓRIAS:
1. RESPONDA À PERGUNTA FEITA (PROIBIDO SERMÃO DE AUTOAJUDA / "FOQUE EM SI"):
- Se a pergunta for sobre OUTRA PESSOA (ex: relacionamentos, sentimentos do parceiro, traição, intenções de sócio, chefe, amigo ou família):
  * PROIBIDO fugir para discursos de terapia ou autoajuda (NUNCA diga "você não controla o outro", "foque em si mesma", "cure seu amor próprio", "trabalhe seu interior").
  * RESPONDA O QUE AS CARTAS MOSTRAM SOBRE A OUTRA PESSOA: se há interesse real, frieza, mentiras, atração física, falsidade, lealdade, indecisão ou manipulação da parte dela.

2. SEJA DIRETO E HONESTO COM CARTAS DIFÍCEIS (SEM PASSAR PANO):
- Se saírem cartas desafiadoras (ex: O Diabo, A Torre, 3 de Espadas, 10 de Espadas, 7 de Espadas, 5 de Ouros, A Lua, A Morte, cartas Invertidas), NÃO tente dourar a pílula nem forçar positividade.
- Relacione diretamente com a realidade:
  * O Diabo: atração puramente física ou por interesse financeiro/conveniência, jogo de poder, apego tóxico, mentira, manipulação.
  * 7 de Espadas: falsidade, agir pelas costas, esconder coisas, traição, desonestidade.
  * A Torre: rompimento repentino, verdades duras que vieram à tona, perda inesperada, fim abrupto.
  * 3 de Espadas / 10 de Espadas: decepção, traição, dor de um término ou conversa que machucou.
  * A Lua: mentiras, ilusões, ciúmes, coisas ocultas.
  * 5 de Ouros: aperto financeiro, falta de apoio, desamparo.
  * 2 de Copas / O Sol / Os Enamorados / 10 de Copas: afeto sincero, conexão real, compatibilidade e lealdade.

3. LINGUAGEM CLARA, HUMANA E ACESSÍVEL:
- Use português simples e natural do dia a dia.
- PROIBIDO usar palavras difíceis, arcaicas ou floreios poéticos (como transmutação, epifania, diletantismo, éter, arquetípico).

4. ESTRUTURA OBRIGATÓRIA EM 3 SEÇÕES:
### 🔍 O que as cartas mostram
(Responda diretamente à dúvida sobre a situação ou a outra pessoa, sem meias palavras)

### 💡 O que está acontecendo por trás
(Explique as intenções, sentimentos, atitudes ou desafios reais que as cartas apontam)

### 🧭 O que fazer na prática
(Dê uma orientação prática para a situação real, dizendo que atitude tomar ou do que fugir)`
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
    const isAboutOtherPerson = /\b(ele|ela|ex|namorad|marid|espos|ficante|s[oó]ci|chefe|amig|trai[çc]|gosta|sente|voltar|pensa)\b/i.test(q);

    // Identify shadow or warning cards
    const shadowCard = validCards.find(c => 
      c.isReversed || 
      ['O Diabo', 'A Torre', 'A Morte', 'A Lua', 'Três de Espadas', 'Dez de Espadas', 'Sete de Espadas', 'Cinco de Ouros', 'Cinco de Copas', 'O Enforcado'].some(name => c.name.includes(name))
    );

    let diagnosis = '';
    if (q) {
      if (isAboutOtherPerson) {
        if (shadowCard && (shadowCard.id === first.id || shadowCard.id === middle.id)) {
          diagnosis = `Sobre a sua pergunta ("${q}"): as cartas mostram uma postura desfavorável ou complicada da outra parte. A presença de ${shadowCard.name} ${shadowCard.isReversed ? '(Invertida)' : ''} indica ${shadowCard.shadow ? shadowCard.shadow.toLowerCase() : 'atitudes duvidosas, distanciamento ou falta de transparência'}. Não há sinais de estabilidade ou clareza vindos de lá no momento.`;
        } else {
          diagnosis = `Sobre a sua pergunta ("${q}"): a carta ${first.name} indica que o envolvimento e as atitudes da outra pessoa estão ligadas a ${first.light.toLowerCase()}. Há movimentação concreta acontecendo nesse cenário.`;
        }
      } else {
        if (first.isReversed || (shadowCard && shadowCard.id === first.id)) {
          diagnosis = `Respondendo diretamente sobre "${q}": a carta ${first.name} ${first.isReversed ? '(Invertida)' : ''} aponta um sinal de alerta claro. Na prática, você está lidando com ${first.shadow ? first.shadow.toLowerCase() : 'bloqueios e descontentamento'}, o que indica que insistir no mesmo caminho sem mudar de atitude só vai trazer mais desgaste.`;
        } else {
          diagnosis = `Respondendo diretamente sobre "${q}": a carta ${first.name} indica que o cenário atual depende de ${first.light.toLowerCase()}. As coisas estão caminhando de acordo com essa energia.`;
        }
      }
    } else {
      diagnosis = `A carta ${first.name} ${first.isReversed ? '(Invertida)' : ''} mostra que o seu momento atual está marcado por ${first.isReversed ? first.shadow?.toLowerCase() : first.light?.toLowerCase()}. É preciso encarar a situação de frente, sem fingir que está tudo bem quando não está.`;
    }

    let dynamics = '';
    if (shadowCard && shadowCard.id !== first.id) {
      dynamics = `O ponto crítico desta tiragem é a presença de ${shadowCard.name} ${shadowCard.isReversed ? '(Invertida)' : ''}. No dia a dia, isso aponta para problemas como ${shadowCard.shadow?.toLowerCase() || 'apego, ilusão ou desgaste'}. Em conjunto com ${middle.name}, isso mostra que há atitudes ou fatores externos pesando negativamente.`;
    } else {
      dynamics = `A relação entre ${first.name} e ${middle.name} mostra o que está pesando no momento: de um lado a necessidade de ação prática, e do outro ${middle.isReversed ? middle.shadow?.toLowerCase() : middle.light?.toLowerCase()}.`;
    }

    let advice = `O conselho direto da carta ${last.name} é: "${last.advice}". Tenha clareza, tome sua decisão com base nos fatos reais e não aceite menos do que o justo.`;

    return {
      source: 'local_fallback',
      diagnosis,
      dynamics,
      advice,
      text: `### 🔍 O que as cartas mostram\n${diagnosis}\n\n### 💡 O que está acontecendo por trás\n${dynamics}\n\n### 🧭 O que fazer na prática\n${advice}`
    };
  }
};
