export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const geminiApiKey = (env.GEMINI_API_KEY || "").trim();
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ 
        error: "A chave GEMINI_API_KEY não foi encontrada nas variáveis de ambiente do Worker." 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const urlObj = new URL(request.url);

    if (urlObj.pathname === "/models" || request.method === "GET") {
      try {
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`);
        const listData = await listRes.json();
        return new Response(JSON.stringify(listData, null, 2), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    try {
      const rawBody = await request.text();
      const { spreadConfig, chosenCards, userQuestion, mode, customPrompt } = JSON.parse(rawBody || '{}');

      const isYesNo = mode === 'yes_no' || spreadConfig?.isYesNo || spreadConfig?.name === 'Sim ou Não';

      let prompt = '';
      if (isYesNo) {
        const card = chosenCards?.[0] || {};
        prompt = `Você é o Oráculo do Sim ou Não do Lumina Tarot.
Sua missão é dar uma resposta EXTREMAMENTE OBJETIVA, DIRETA, LÚCIDA e CURTA para a pergunta do consulente, baseada no simbolismo do arcano tirado.

PERGUNTA DO CONSULENTE: ${userQuestion ? `"${userQuestion}"` : 'Consulta direta ao Oráculo.'}
CARTA REVELADA: ${card.name || 'Arcano'} (${card.arcana || ''}${card.suit ? ', ' + card.suit : ''})${card.isReversed ? ' [INVERTIDA]' : ' [DIRETA]'}.
Palavras-chave: Luz: ${card.light || ''} | Sombra: ${card.shadow || ''} | Conselho: "${card.advice || ''}".

DIRETRIZES FUNDAMENTAIS OBRIGATÓRIAS:
1. Responda em Português do Brasil de forma DIRETA, CLARA, OBJETIVA e CONCISA.
2. Seja cirúrgico: a resposta deve ter no máximo 1 a 2 frases curtas. PROIBIDO textos longos, pregações ou prolixidade.
3. Se a resposta depender de alguma atitude, condição ou se for um alerta, forneça uma "dica" ou condição prática em 1 frase (ex: "Sim, mas depende de você tomar a iniciativa antes que o prazo acabe", "Não, a não ser que você esclareça essa dúvida pessoalmente", "Depende de você manter a discrição e não contar seus planos a terceiros").
4. ESTRUTURE A RESPOSTA RIGOROSAMENTE NO SEGUINTE FORMATO:

VEREDITO: [Escolha apenas um: SIM | NÃO | SIM, COM CONDIÇÃO | NÃO, A NÃO SER QUE | DEPENDE DE VOCÊ]
RESPOSTA: [1 ou 2 frases curtas, objetivas e diretas respondendo à pergunta com base na energia da carta]
DICA: [1 frase curta com a dica prática ou condição fundamental]`;
      } else {
        const cardsText = (chosenCards || []).map(c => 
          `- Posição: ${c.positionName || 'Altar'} | Carta: ${c.name} (${c.arcana || ''}${c.suit ? ', ' + c.suit : ''})${c.isReversed ? ' [INVERTIDA]' : ' [DIRETA]'}. Luz: ${c.light || ''}. Sombra: ${c.shadow || ''}. Conselho: "${c.advice || ''}".`
        ).join('\n');

        prompt = customPrompt || `Você é o Oráculo Ancestral do Lumina Tarot. Crie uma interpretação oracular profunda, lúcida, poética e acolhedora.

CONSULTA:
- Tiragem: ${spreadConfig?.name || 'Tiragem Livre'}
- Pergunta / Intenção Mentalizada: ${userQuestion ? `"${userQuestion}"` : 'Leitura geral de autoconhecimento e caminhos do momento.'}

CARTAS REVELADAS NO ALTAR:
${cardsText}

DIRETRIZES FUNDAMENTAIS:
1. Responda em Português com tom oracular refinado, maduro e acolhedor (como um sábio mestre de tarot).
2. NÃO use frases prontas e NÃO faça listas mecânicas de nomes. Conecte de verdade o simbolismo arquetípico com a dúvida específica do consulente.
3. Garanta que TODAS as 3 seções sejam integralmente finalizadas sem cortes, estruturadas EXATAMENTE assim:

### 🌌 O Diagnóstico da Intenção
(Responda diretamente à dúvida do consulente e ao momento presente em 1 parágrafo profundo de 80 a 120 palavras)

### 🔮 A Dinâmica das Forças Ocultas
(Explique como os arcanos dialogam entre si, as tensões e os potenciais em jogo em 1 parágrafo profundo de 80 a 120 palavras)

### 🗝️ O Conselho Sagrado do Oráculo
(Um conselho oracular claro, inspirador e transformador em 1 parágrafo de 80 a 120 palavras)`;
      }

      // Modelos ativos verificados na conta
      const modelsToTry = [
        "gemini-flash-latest",
        "gemini-flash-lite-latest",
        "gemini-2.5-flash-lite",
        "gemini-pro-latest"
      ];

      let lastError = null;
      let generatedText = null;
      let modelUsed = null;

      for (const model of modelsToTry) {
        const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

        try {
          const geminiRes = await fetch(generateUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }]
                }
              ],
              generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 3000 // Limite ampliado para nunca cortar a resposta no meio
              }
            })
          });

          const geminiData = await geminiRes.json();
          if (geminiRes.ok && geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
            generatedText = geminiData.candidates[0].content.parts[0].text;
            modelUsed = model;
            break;
          } else {
            lastError = geminiData.error?.message || `Status ${geminiRes.status}`;
          }
        } catch (e) {
          lastError = e.message;
        }
      }

      if (!generatedText) {
        return new Response(JSON.stringify({ 
          error: "Erro na API do Gemini: " + lastError 
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ text: generatedText, modelUsed }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
