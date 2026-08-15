// Yes / No Oracle Polarity & Context Algorithm
export const getYesNoEvaluation = (card, isReversed = false) => {
  // If reversed, negative/caution tendencies usually increase
  if (isReversed) {
    if (['major_19', 'major_21', 'major_1'].includes(card.id)) {
      return {
        verdict: 'SIM, COM RETARDO',
        type: 'maybe',
        percentage: 60,
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 border-amber-400/60',
        summary: 'A essência do arcano é positiva, mas a inversão pede paciência antes que o resultado se manifeste plenamente.'
      };
    }
    return {
      verdict: 'NÃO / BLOQUEIO ATIVO',
      type: 'no',
      percentage: 25,
      color: 'text-red-400',
      badgeBg: 'bg-red-500/20 border-red-400/60',
      summary: 'A energia invertida indica resistências internas, momento inoportuno ou desvios que requerem reflexão.'
    };
  }

  // Major Arcana Upright
  const majorYes = [0, 1, 3, 4, 6, 7, 8, 10, 14, 17, 19, 21]; // Louco, Mago, Imperatriz, Imperador, Enamorados, Carro, Força, Roda, Temperança, Estrela, Sol, Mundo
  const majorNo = [13, 15, 16, 18, 20]; // Morte, Diabo, Torre, Lua, Julgamento
  const majorMaybe = [2, 5, 9, 11, 12]; // Sacerdotisa, Hierofante, Eremita, Justiça, Enforcado

  if (card.arcana === 'Major') {
    if (majorYes.includes(card.number)) {
      return {
        verdict: 'SIM CONVICTO',
        type: 'yes',
        percentage: 95,
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
        summary: 'As forças cósmicas e espirituais estão em perfeita expansão e harmonia a favor do seu propósito.'
      };
    }
    if (majorNo.includes(card.number)) {
      return {
        verdict: 'NÃO / CAUTELA',
        type: 'no',
        percentage: 15,
        color: 'text-red-400',
        badgeBg: 'bg-red-500/20 border-red-400/60',
        summary: 'O caminho atual apresenta rupturas, ilusões ou armadilhas. O oráculo recomenda pausa e proteção.'
      };
    }
    return {
      verdict: 'NEUTRO / DEPENDE DE VOCÊ',
      type: 'maybe',
      percentage: 50,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 border-amber-400/60',
      summary: 'O desfecho não está gravado em pedra; sua ponderação ética, silêncio e atitudes definirão a resposta.'
    };
  }

  // Minor Arcana by Suits
  if (card.suit === 'swords') {
    if (['ace', 'six'].includes(card.rank)) {
      return {
        verdict: 'SIM, COM CLAREZA MENTAL',
        type: 'yes',
        percentage: 80,
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
        summary: 'A verdade e a lucidez intelectual trarão o triunfo sobre os conflitos.'
      };
    }
    return {
      verdict: 'NÃO / MOMENTO DE TENSÃO',
      type: 'no',
      percentage: 20,
      color: 'text-red-400',
      badgeBg: 'bg-red-500/20 border-red-400/60',
      summary: 'Dúvidas, desgastes ou conflitos de interesse sugerem que não é o momento adequado.'
    };
  }

  if (card.suit === 'cups' || card.suit === 'pentacles' || card.suit === 'wands') {
    if (['five', 'seven'].includes(card.rank) && card.suit !== 'wands') {
      return {
        verdict: 'NÃO / CARÊNCIA OU ILUSÃO',
        type: 'no',
        percentage: 30,
        color: 'text-red-400',
        badgeBg: 'bg-red-500/20 border-red-400/60',
        summary: 'Há expectativas irreais ou sensação de escassez que precisam ser curadas primeiro.'
      };
    }
    return {
      verdict: 'SIM, COM ABUNDÂNCIA',
      type: 'yes',
      percentage: 85,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
      summary: 'A energia flui com vigor, fertilidade criativa e sustentação prática para o seu anseio.'
    };
  }

  return {
    verdict: 'SIM',
    type: 'yes',
    percentage: 75,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 border-emerald-400/60',
    summary: 'Os ventos do destino sopram favoravelmente.'
  };
};
