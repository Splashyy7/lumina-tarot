<div align="center">

# 🔮 LUMINA TAROT
### *Sabedoria Ancestral & Arcanos do Destino*

Um aplicativo web moderno, imersivo e visualmente deslumbrante para consultas e tiragens de Tarot com 78 cartas clássicas, renderização espacial 3D e sintetizador de áudio oracular nativo via Web Audio API.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-black?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Native-orange)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

</div>

---

## ✨ Funcionalidades Principais

- **🌌 Baralho Completo de 78 Cartas**:
  - **22 Arcanos Maiores** (de *O Louco* a *O Mundo*) com numerais romanos, arquétipos, elementos, planetas, significados de luz/sombra e conselhos oraculares em português.
  - **56 Arcanos Menores** distribuídos pelos 4 naipes sagrados (*Paus / Fogo*, *Copas / Água*, *Espadas / Ar*, *Ouros / Terra*) com cartas numeradas de Ás a 10 e cartas da corte (*Pajem, Cavaleiro, Rainha e Rei*).
- **🏛️ 5 Modos de Tiragem com Layouts Espaciais Realistas**:
  - **Passado, Presente & Futuro** (3 Cartas - Linha Temporal com setas energéticas).
  - **Carta Única** (1 Carta - Altar Focal com aura cósmica).
  - **Decisão & Ação** (3 Cartas - Pirâmide Triádica de Situação, Ação e Desfecho).
  - **Mente, Corpo & Espírito** (3 Cartas - Alinhamento Vertical dos Três Corpos).
  - **Cruz Céltica Tradicional** (10 Cartas - A Cruz Sagrada com a carta 2 cruzada horizontalmente a 90° sobre o Cerne + Coluna do Báculo com 4 cartas de ascensão).
- **🎴 Embaralhamento 3D Cinematográfico**:
  - Animação em 4 fases baseada no algoritmo **Fisher-Yates**: *Corte do Baralho (Split)*, *Riffle Weave Intercalado*, *Leque Cósmico (Cosmic Arc Fan)* e *Consagração & Redistribuição*.
- **🎶 Motor de Áudio Oracular em Tempo Real (Web Audio API)**:
  - Síntese acústica com latência zero (sem arquivos externos pesados):
    - *Hover Chimes* suaves em afinação pentatônica.
    - *Riffle Clicks* com atrito texturizado de cartas no embaralhamento.
    - *3D Flip Shimmer* e *Zoom Lens Sweep* ao inspecionar detalhes.
    - *Paper Rustle* (farfalhar autêntico de pergaminho) ao copiar a leitura.
    - *Ethereal Dismiss Pop* suave ao fechar modais.
    - *Celestial Chord* de acorde maior com 9ª na revelação da tiragem.
    - Controle de áudio (*Mute / Unmute*) no cabeçalho.
- **📜 Modal de Interpretação Oracular Completa**:
  - Chuva de confetes estelares dourados e púrpuras.
  - Análise de **Balanço Elemental** (predominância de Fogo, Água, Ar, Terra e Arcanos Maiores).
  - **Síntese Integrada** do Oráculo com narrativa contextualizada e **Afirmação de Poder**.
  - Botão de **Copiar Leitura Completa** formatada para WhatsApp / Notion com som de pergaminho.
- **✨ Microinterações & Física de Molas (Spring Physics)**:
  - Desenvolvido com **Framer Motion** para elevação tátil das cartas, giro 3D de 180° nos slots receptores e transições fluidas de layout.
- **🪐 Tela de Carregamento Cósmica**:
  - Tríade dos arcanos em levitação 3D (*Lua, Estrela e Sol*), geometria sagrada animada e transição com desfoque cósmico.

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)**: Componentes funcionais com Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
- **[Vite 6](https://vitejs.dev/)**: Build tool ultrarrápida com Hot Module Replacement (HMR).
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Estilização moderna com design system em tema Dark Mode Místico (`#070A18`, `#120B2E`, `#FBBF24`).
- **[Framer Motion](https://www.framer.com/motion/)**: Animações fluidas com aceleração por GPU e física elástica.
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)**: Sintetizador nativo de ondas senoidais, ruídos e filtros passa-banda.
- **[Lucide React](https://lucide.dev/)**: Ícones vetoriais modernos.
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)**: Efeito de celebração oracular.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- `npm` ou `yarn`

### Passo a Passo

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/SEU_USUARIO/lumina-tarot.git
   cd lumina-tarot
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**:
   ```
   http://localhost:5173/
   ```

5. **Gerar build de produção**:
   ```bash
   npm run build
   ```

---

## 📂 Estrutura de Pastas

```
lumina-tarot/
├── public/
├── src/
│   ├── components/
│   │   ├── BackgroundStars.jsx          # Fundo de estrelas cintilantes e nebulosas
│   │   ├── CardArt.jsx                  # Ilustrações e faces das 78 cartas
│   │   ├── CardBack.jsx                 # Verso da carta com mandala e geometria sagrada
│   │   ├── CardDetailModal.jsx          # Modal de inspeção e ampliação de carta individual
│   │   ├── ConfirmSpreadChangeModal.jsx # Overlay de confirmação de troca de tiragem
│   │   ├── DeckSelectionGrid.jsx        # Grid de seleção das 78 cartas com abas e filtros
│   │   ├── DeckShuffleAnimation.jsx     # Animação 3D de corte, riffle e leque
│   │   ├── GuideModal.jsx               # Guia oracular explicativo
│   │   ├── Header.jsx                   # Cabeçalho com input de intenção e som
│   │   ├── InterpretationModal.jsx      # Modal de síntese completa e cópia de leitura
│   │   ├── LoadingScreen.jsx            # Tela de carregamento cósmica com tríade 3D
│   │   ├── SpreadArea.jsx               # Mesa do altar com layouts dinâmicos (Cruz Céltica, etc.)
│   │   ├── SpreadSelector.jsx           # Seletor de tiragens com indicador deslizante
│   │   ├── SpreadSlot.jsx               # Slot receptor com reveal 3D flip e remoção
│   │   └── TarotTable.jsx               # Componente mestre e gerenciador de estado
│   ├── data/
│   │   ├── spreads.js                   # Definição dos 5 modos de tiragem
│   │   └── tarotDeck.js                 # Dataset com as 78 cartas de Tarot e significados
│   ├── utils/
│   │   └── audio.js                     # Motor sintetizador de áudio Web Audio API
│   ├── App.jsx                          # Componente raiz
│   ├── index.css                        # Estilos globais e tokens do Tailwind CSS v4
│   └── main.jsx                         # Ponto de entrada React
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 📜 Licença

Distribuído sob a licença **MIT**. Veja `LICENSE` para mais informações.

<div align="center">
  <sub>Criado com 💜 e sabedoria ancestral. Que as cartas iluminem sua jornada.</sub>
</div>
