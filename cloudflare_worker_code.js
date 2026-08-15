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
      const { spreadConfig, chosenCards, userQuestion } = JSON.parse(rawBody);

      const cardsText = (chosenCards || []).map(c => 
        `- Posição: ${c.positionName || 'Altar'} | Carta: ${c.name} (${c.arcana || ''}${c.suit ? ', ' + c.suit : ''})${c.isReversed ? ' [INVERTIDA]' : ' [DIRETA]'}. Luz: ${c.light || ''}. Sombra: ${c.shadow || ''}. Conselho: "${c.advice || ''}".`
      ).join('\n');

      const prompt = `Você é o Oráculo Ancestral do Lumina Tarot. Crie uma interpretação oracular profunda, lúcida, poética e acolhedora.

CONSULTA:
- Tiragem: ${spreadConfig?.name || 'Tiragem Livre'}
- Pergunta / Intenção Mentalizada: ${userQuestion ? `"${userQuestion}"` : 'Leitura geral de autoconhecimento e caminhos do momento.'}

CARTAS REVELADAS NO ALTAR:
${cardsText}

DIRETRIZES FUNDAMENTAIS:
1. Responda em Português com tom oracular refinado, maduro e acolhedor (como um sábio mestre de tarot).
2. NÃO use frases prontas e NÃO faça listas mecânicas de nomes. Conecte de verdade o simbolismo arquetípico com a dúvida específica do consulente.
3. Estruture a resposta EXATAMENTE nestas 3 seções:

### 🌌 O Diagnóstico da Intenção
(Responda diretamente à dúvida do consulente e ao momento presente em 1 parágrafo profundo)

### 🔮 A Dinâmica das Forças Ocultas
(Explique como os arcanos dialogam entre si, as tensões e os potenciais em jogo em 1 parágrafo)

### 🗝️ O Conselho Sagrado do Oráculo
(Um conselho oracular claro, inspirador e transformador em 1 parágrafo)`;

      // Modelos ativos verificados da sua conta no Google
      const modelsToTry = [
        "gemini-flash-latest",
        "gemini-flash-lite-latest",
        "gemini-2.5-flash-lite",
        "gemini-3-flash-preview",
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
                maxOutputTokens: 1000
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
