// Spreads / Tiragens de Tarot com descrições das posições e layouts espaciais autênticos de mesa

export const SPREAD_TYPES = [
  {
    id: 'three_cards',
    name: 'Passado, Presente & Futuro',
    shortName: 'Passado / Presente / Futuro',
    compactName: 'Temporal',
    cardCount: 3,
    layoutType: 'timeline',
    icon: 'Layers',
    description: 'A clássica visão linear do tempo: a raiz da questão, o momento atual e a tendência futura.',
    positions: [
      {
        index: 0,
        name: 'Passado & Raízes',
        subtitle: 'A semente e as causas que moldaram o cenário',
        icon: 'Rewind',
        color: '#8B5CF6'
      },
      {
        index: 1,
        name: 'Presente & Momento Atual',
        subtitle: 'As forças ativas e a situação como se apresenta agora',
        icon: 'Sun',
        color: '#F59E0B'
      },
      {
        index: 2,
        name: 'Futuro & Tendência',
        subtitle: 'A direção para onde as forças atuais estão apontando',
        icon: 'FastForward',
        color: '#38BDF8'
      }
    ]
  },
  {
    id: 'single_card',
    name: 'Carta Única / Oráculo do Dia',
    shortName: 'Carta Única',
    compactName: 'Oráculo',
    cardCount: 1,
    layoutType: 'single',
    icon: 'Sparkles',
    description: 'Uma resposta direta, conselho imediato ou reflexão profunda para o momento presente.',
    positions: [
      {
        index: 0,
        name: 'O Conselho do Oráculo',
        subtitle: 'A energia focal e a mensagem essencial para sua reflexão',
        icon: 'Eye',
        color: '#FBBF24'
      }
    ]
  },
  {
    id: 'situation_action_outcome',
    name: 'Situação, Ação & Desfecho',
    shortName: 'Decisão & Ação',
    compactName: 'Decisão',
    cardCount: 3,
    layoutType: 'triangle',
    icon: 'Compass',
    description: 'Ideal para tomadas de decisão, clareza em dilemas e orientação prática de ação.',
    positions: [
      {
        index: 0,
        name: 'A Situação Real',
        subtitle: 'O cerne do que está acontecendo sem véus',
        icon: 'Shield',
        color: '#8B5CF6'
      },
      {
        index: 1,
        name: 'Ação Recomendada',
        subtitle: 'A atitude prática que você deve adotar perante o desafio',
        icon: 'Flame',
        color: '#F97316'
      },
      {
        index: 2,
        name: 'O Desfecho Provável',
        subtitle: 'O resultado e a culminação ao seguir a orientação',
        icon: 'Award',
        color: '#34D399'
      }
    ]
  },
  {
    id: 'mind_body_spirit',
    name: 'Mente, Corpo & Espírito',
    shortName: 'Mente / Corpo / Espírito',
    compactName: 'Harmonia',
    cardCount: 3,
    layoutType: 'trinity',
    icon: 'HeartHandshake',
    description: 'Diagnóstico holístico do seu estado mental, corpóreo e espiritual.',
    positions: [
      {
        index: 0,
        name: 'Plano Mental (Mente)',
        subtitle: 'Seus pensamentos, crenças, clareza e dilemas mentais',
        icon: 'Wind',
        color: '#E2E8F0'
      },
      {
        index: 1,
        name: 'Plano Espiritual (Alma)',
        subtitle: 'Sua conexão com o sagrado, intuição e propósito interior',
        icon: 'Sparkles',
        color: '#C084FC'
      },
      {
        index: 2,
        name: 'Plano Físico (Corpo & Matéria)',
        subtitle: 'Sua energia corpórea, saúde, trabalho e realidade prática',
        icon: 'Mountain',
        color: '#34D399'
      }
    ]
  },
  {
    id: 'celtic_cross',
    name: 'A Cruz Céltica Clássica',
    shortName: 'Cruz Céltica (10 Cartas)',
    compactName: 'Cruz Céltica',
    cardCount: 10,
    layoutType: 'celtic_cross',
    icon: 'PlusCircle',
    description: 'A mais famosa e completa tiragem de Tarot: a Cruz central revela as tensões do presente e o Báculo lateral revela o destino.',
    positions: [
      {
        index: 0,
        name: '1. O Presente / O Cerne',
        subtitle: 'O tema central e a energia ativa no momento',
        icon: 'Target',
        color: '#FBBF24',
        section: 'cross'
      },
      {
        index: 1,
        name: '2. O Desafio / O Cruzamento',
        subtitle: 'O obstáculo ou força que cruza o presente',
        icon: 'AlertCircle',
        color: '#EF4444',
        section: 'cross',
        isCrossing: true
      },
      {
        index: 2,
        name: '3. A Raiz / Subconsciente',
        subtitle: 'A fundação profunda e origens no inconsciente',
        icon: 'Anchor',
        color: '#8B5CF6',
        section: 'cross'
      },
      {
        index: 3,
        name: '4. O Passado Recente',
        subtitle: 'Eventos que estão se afastando mas ainda influenciam',
        icon: 'Rewind',
        color: '#6366F1',
        section: 'cross'
      },
      {
        index: 4,
        name: '5. A Coroa / Objetivo',
        subtitle: 'A melhor aspiração consciente e horizonte mental',
        icon: 'Crown',
        color: '#F59E0B',
        section: 'cross'
      },
      {
        index: 5,
        name: '6. O Futuro Próximo',
        subtitle: 'A próxima energia e eventos iminentes',
        icon: 'FastForward',
        color: '#38BDF8',
        section: 'cross'
      },
      {
        index: 6,
        name: '7. O Consulente / Postura',
        subtitle: 'Sua atitude interna, sentimentos e autoimagem',
        icon: 'User',
        color: '#A855F7',
        section: 'staff'
      },
      {
        index: 7,
        name: '8. O Ambiente Externo',
        subtitle: 'A influência das pessoas ao redor e seu meio',
        icon: 'Users',
        color: '#3B82F6',
        section: 'staff'
      },
      {
        index: 8,
        name: '9. Esperanças & Temores',
        subtitle: 'Seus desejos mais íntimos e bloqueios secretos',
        icon: 'Heart',
        color: '#EC4899',
        section: 'staff'
      },
      {
        index: 9,
        name: '10. O Desfecho Final',
        subtitle: 'A culminação e o resultado definitivo da jornada',
        icon: 'Star',
        color: '#10B981',
        section: 'staff'
      }
    ]
  }
];
