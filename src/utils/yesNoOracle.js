// Yes / No Oracle Polarity, Context & Practical Conditions Engine
// Provides direct verdicts, concise answers, and actionable conditional tips ("Sim, mas depende...", "Não, a não ser que...")

export const getYesNoEvaluation = (card, isReversed = false) => {
  if (!card) {
    return {
      verdict: 'TALVEZ',
      type: 'maybe',
      percentage: 50,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 border-amber-400/60',
      summary: 'O momento pede reflexão e observação antes de qualquer definição.',
      tip: 'Depende de você analisar os fatos com calma e não se precipitar.'
    };
  }

  // --- REVERSED CARDS ---
  if (isReversed) {
    // Highly positive majors when reversed (delays rather than absolute "No")
    if (['major_0', 'major_1', 'major_19', 'major_21'].includes(card.id) || [0, 1, 19, 21].includes(card.number)) {
      return {
        verdict: 'SIM, COM CONDIÇÃO',
        type: 'conditional_yes',
        percentage: 60,
        color: 'text-amber-300',
        badgeBg: 'bg-amber-500/20 border-amber-400/60',
        summary: `A essência de ${card.name} permanece favorável, mas a inversão alerta para atrasos ou falta de alinhamento.`,
        tip: 'Sim, mas depende de você ajustar o foco, ter paciência e não forçar os acontecimentos antes da hora.'
      };
    }

    // Heavy majors reversed (deep blockage or inner resistance)
    if (['major_13', 'major_15', 'major_16', 'major_18'].includes(card.id) || [13, 15, 16, 18].includes(card.number)) {
      return {
        verdict: 'NÃO / ALERTA',
        type: 'no',
        percentage: 15,
        color: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 border-rose-400/60',
        summary: `A energia invertida de ${card.name} aponta para apegos, ilusões ou risco de frustração se insistir agora.`,
        tip: 'Não, a não ser que você faça uma limpeza profunda e rompa de vez com velhos padrões.'
      };
    }

    return {
      verdict: 'NÃO / BLOQUEIO',
      type: 'no',
      percentage: 25,
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/20 border-rose-400/60',
      summary: `A inversão de ${card.name} indica resistências internas, falta de clareza ou momento inoportuno.`,
      tip: 'Não no momento. A não ser que você reveja suas premissas e mude de estratégia radicalmente.'
    };
  }

  // --- MAJOR ARCANA UPRIGHT ---
  if (card.arcana === 'Major') {
    // Definite Yes Majors
    const majorAbsoluteYes = [1, 3, 4, 6, 7, 8, 10, 14, 17, 19, 21];
    // 0: Louco, 2: Sacerdotisa, 5: Hierofante, 9: Eremita, 11: Justiça, 12: Enforcado
    const majorCautionNo = [13, 15, 16, 18, 20]; // Morte, Diabo, Torre, Lua, Julgamento

    if (card.number === 0) { // O Louco
      return {
        verdict: 'SIM, COM CORAGEM',
        type: 'conditional_yes',
        percentage: 85,
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
        summary: 'Os caminhos estão abertos para o novo e a energia é de liberdade e recomeço.',
        tip: 'Sim, mas depende de você dar o primeiro passo sem medo, cuidando para não ser imprudente com os detalhes práticos.'
      };
    }

    if (card.number === 19) { // O Sol
      return {
        verdict: 'SIM CONVICTO',
        type: 'yes',
        percentage: 98,
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
        summary: 'Clareza total, sucesso, vitalidade e verdade absoluta a seu favor.',
        tip: 'Sim! Seja autêntico, aja com transparência e aproveite o momento favorável com confiança.'
      };
    }

    if (card.number === 21) { // O Mundo
      return {
        verdict: 'SIM CONVICTO',
        type: 'yes',
        percentage: 95,
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
        summary: 'Ciclo favorável de realização, coroação e expansão plena.',
        tip: 'Sim! Conclua o que começou e confie na plenitude dos seus resultados.'
      };
    }

    if (majorAbsoluteYes.includes(card.number)) {
      return {
        verdict: 'SIM',
        type: 'yes',
        percentage: 90,
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
        summary: `A energia de ${card.name} favorece diretamente a sua intenção e impulsiona seu caminho.`,
        tip: card.advice 
          ? `Sim, mas lembre-se: ${card.advice.toLowerCase().replace(/^[a-z]/, (c) => c.toUpperCase())}`
          : 'Sim, mas depende de você manter a constância e agir com firmeza.'
      };
    }

    if (card.number === 11) { // A Justiça
      return {
        verdict: 'DEPENDE DE VOCÊ',
        type: 'maybe',
        percentage: 50,
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 border-amber-400/60',
        summary: 'O desfecho será a consequência exata das suas escolhas e do seu senso ético.',
        tip: 'Depende de você agir com total retidão, analisar contratos ou acordos e ser 100% justo.'
      };
    }

    if (card.number === 2) { // A Sacerdotisa
      return {
        verdict: 'SIM, COM SIGILO',
        type: 'conditional_yes',
        percentage: 65,
        color: 'text-amber-300',
        badgeBg: 'bg-amber-500/20 border-amber-400/60',
        summary: 'As respostas estão se maturando no oculto; a intuição aponta para uma direção favorável.',
        tip: 'Sim, mas depende de você guardar segredo sobre seus planos e confiar mais no seu pressentimento.'
      };
    }

    if (card.number === 9) { // O Eremita
      return {
        verdict: 'NÃO POR AGORA',
        type: 'conditional_no',
        percentage: 40,
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 border-amber-400/60',
        summary: 'O momento pede pausa, reflexão solitária e prudência antes de qualquer avanço público.',
        tip: 'Não de imediato. Depende de você amadurecer a ideia sozinho antes de tomar a decisão final.'
      };
    }

    if (card.number === 12) { // O Enforcado
      return {
        verdict: 'PAUSA / TALVEZ',
        type: 'maybe',
        percentage: 45,
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 border-amber-400/60',
        summary: 'Há um compasso de espera necessário para mudar a sua perspectiva sobre o assunto.',
        tip: 'Depende de você abrir mão da teimosia e enxergar a situação por outro ângulo.'
      };
    }

    if (majorCautionNo.includes(card.number)) {
      return {
        verdict: 'NÃO / CAUTELA',
        type: 'no',
        percentage: 15,
        color: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 border-rose-400/60',
        summary: `A energia de ${card.name} avisa sobre riscos, desilusões, rompimentos ou conflitos ocultos.`,
        tip: 'Não, a não ser que você esteja disposto a enfrentar verdades duras e mudar tudo do zero.'
      };
    }
  }

  // --- MINOR ARCANA ---
  // Swords (Mental / Conflicts)
  if (card.suit === 'swords') {
    if (['ace', 'six'].includes(card.rank)) {
      return {
        verdict: 'SIM, COM CLAREZA',
        type: 'yes',
        percentage: 80,
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
        summary: 'A lucidez mental, a verdade e a razão apontam para uma resolução favorável.',
        tip: 'Sim, mas depende de você ter uma conversa honesta e não alimentar meias-palavras.'
      };
    }
    if (['three', 'seven', 'eight', 'nine', 'ten', 'five'].includes(card.rank)) {
      return {
        verdict: 'NÃO / TENSÃO',
        type: 'no',
        percentage: 20,
        color: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 border-rose-400/60',
        summary: 'O cenário aponta para desgastes, desconfiança, frustração ou excesso de preocupação.',
        tip: 'Não. A não ser que você se proteja de influências tóxicas e evite agir no calor da emoção.'
      };
    }
    return {
      verdict: 'DEPENDE DA RAZÃO',
      type: 'maybe',
      percentage: 50,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 border-amber-400/60',
      summary: 'A resposta exige estratégia, equilíbrio emocional e análise lógica da realidade.',
      tip: 'Depende de você decidir com a cabeça, cortando dúvidas que estão te paralisando.'
    };
  }

  // Wands (Fire / Action / Passion)
  if (card.suit === 'wands') {
    if (['five', 'nine', 'ten'].includes(card.rank)) {
      return {
        verdict: 'SIM, COM ESFORÇO',
        type: 'conditional_yes',
        percentage: 65,
        color: 'text-amber-300',
        badgeBg: 'bg-amber-500/20 border-amber-400/60',
        summary: 'Há potencial positivo, porém acompanhado de sobrecarga, concorrência ou cansaço.',
        tip: 'Sim, mas depende de você delegar tarefas e não carregar o peso do mundo nas costas.'
      };
    }
    return {
      verdict: 'SIM ENÉRGICO',
      type: 'yes',
      percentage: 90,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
      summary: 'Entusiasmo, motivação e movimento direto aceleram os acontecimentos a seu favor.',
      tip: 'Sim! Tome a iniciativa agora e não deixe a chama da sua motivação esfriar.'
    };
  }

  // Cups (Water / Emotions / Relationships)
  if (card.suit === 'cups') {
    if (['five', 'seven', 'eight'].includes(card.rank)) {
      return {
        verdict: 'NÃO / DESILUSÃO',
        type: 'no',
        percentage: 30,
        color: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 border-rose-400/60',
        summary: 'Expectativas irreais, apego ao passado ou ilusões emocionais estão bloqueando o fluxo.',
        tip: 'Não por enquanto. A não ser que você supere as frustrações antigas e encare a realidade como ela é.'
      };
    }
    return {
      verdict: 'SIM AFETIVO',
      type: 'yes',
      percentage: 90,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
      summary: 'Harmonia nos sentimentos, acolhimento sincero e sintonia positiva para o seu pedido.',
      tip: 'Sim, mas depende de você expressar o que sente com sinceridade e empatia.'
    };
  }

  // Pentacles (Earth / Material / Stability)
  if (card.suit === 'pentacles') {
    if (['five'].includes(card.rank)) {
      return {
        verdict: 'NÃO / ESCASSEZ',
        type: 'no',
        percentage: 20,
        color: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 border-rose-400/60',
        summary: 'Sensação de desamparo, aperto financeiro ou falta de apoio no momento.',
        tip: 'Não neste instante. A não ser que você busque ajuda e reestruture suas bases materiais primeiro.'
      };
    }
    if (['four', 'seven'].includes(card.rank)) {
      return {
        verdict: 'SIM, COM PACIÊNCIA',
        type: 'conditional_yes',
        percentage: 70,
        color: 'text-amber-300',
        badgeBg: 'bg-amber-500/20 border-amber-400/60',
        summary: 'A semente foi plantada com segurança, mas o resultado precisa de tempo para amadurecer.',
        tip: 'Sim, mas depende de você ter paciência para colher no tempo certo, sem tentar apressar o ritmo natural.'
      };
    }
    return {
      verdict: 'SIM CONCRETO',
      type: 'yes',
      percentage: 90,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
      summary: 'Estabilidade, ganho prático e solo firme para a concretização dos seus planos.',
      tip: 'Sim! Mantenha a disciplina, organize seus recursos e avance com pés no chão.'
    };
  }

  // Default fallback
  return {
    verdict: 'SIM',
    type: 'yes',
    percentage: 80,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
    summary: 'As correntes energéticas sopram favoravelmente para a sua questão.',
    tip: 'Sim, mas depende de você manter a dedicação e focar nas suas metas.'
  };
};

// Generate an ultra-direct, concise local fallback response matching the AI format
export const generateOfflineYesNoReading = ({ card, userQuestion, evaluation }) => {
  const evalData = evaluation || getYesNoEvaluation(card, card?.isReversed);
  const q = (userQuestion || '').trim();

  let directAnswer = '';
  if (q) {
    directAnswer = `Para a sua dúvida ("${q}"): o arcano ${card?.name || 'revelado'} ${card?.isReversed ? '(Invertido)' : ''} indica ${evalData.summary.toLowerCase()}`;
  } else {
    directAnswer = `O arcano ${card?.name || 'revelado'} ${card?.isReversed ? '(Invertido)' : ''} mostra que ${evalData.summary.toLowerCase()}`;
  }

  return {
    isAi: false,
    verdict: evalData.verdict,
    answer: directAnswer,
    tip: evalData.tip,
    type: evalData.type,
    color: evalData.color,
    badgeBg: evalData.badgeBg,
    percentage: evalData.percentage,
    rawText: `VEREDITO: ${evalData.verdict}\nRESPOSTA: ${directAnswer}\nDICA: ${evalData.tip}`
  };
};
