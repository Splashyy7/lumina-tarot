// Mystic Reading Card Visual Exporter (HTML5 Canvas to High-Res PNG & Web Share API)

export const cardImageExportService = {
  // Generate a high-resolution mystical card canvas
  async generateReadingCanvas({ spreadConfig, chosenCards, userQuestion, oracleSynthesis }) {
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1440;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Cosmic Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0E0826');
    bgGrad.addColorStop(0.5, '#070A18');
    bgGrad.addColorStop(1, '#150A2E');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ethereal Radial Glow
    const radialGlow = ctx.createRadialGradient(width / 2, 350, 50, width / 2, 350, 600);
    radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
    radialGlow.addColorStop(0.5, 'rgba(147, 51, 234, 0.12)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Sacred Gold Frame Border
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // 4. Corner Diamonds
    const drawCornerDiamond = (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-8, -8, 16, 16);
      ctx.restore();
    };
    drawCornerDiamond(48, 48);
    drawCornerDiamond(width - 48, 48);
    drawCornerDiamond(48, height - 48);
    drawCornerDiamond(width - 48, height - 48);

    // 5. Header: LUMINA TAROT
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 36px "Cinzel", Georgia, serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('✦ LUMINA TAROT ✦', width / 2, 115);

    // Subheader: Spread Name
    ctx.fillStyle = '#C084FC';
    ctx.font = '500 22px "Cinzel", sans-serif';
    ctx.fillText((spreadConfig?.name || 'Tiragem Sagrada').toUpperCase(), width / 2, 155);

    // 6. User Question Box (if provided)
    if (userQuestion && userQuestion.trim()) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 1;
      const qWidth = width - 180;
      ctx.beginPath();
      ctx.roundRect((width - qWidth) / 2, 185, qWidth, 65, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FEF08A';
      ctx.font = 'italic 20px "Outfit", sans-serif';
      const cleanQ = `"${userQuestion.length > 70 ? userQuestion.slice(0, 67) + '...' : userQuestion}"`;
      ctx.fillText(cleanQ, width / 2, 225);
    }

    // 7. Render Cards Grid
    const cards = (chosenCards || []).slice(0, 6);
    const count = cards.length;
    const cols = count <= 3 ? count : Math.min(3, count);
    const rows = Math.ceil(count / cols);
    const cardBoxW = 260;
    const cardBoxH = 140;
    const gapX = 30;
    const gapY = 24;
    const totalGridW = cols * cardBoxW + (cols - 1) * gapX;
    const startX = (width - totalGridW) / 2;
    const startY = userQuestion ? 280 : 220;

    cards.forEach((card, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cx = startX + col * (cardBoxW + gapX);
      const cy = startY + row * (cardBoxH + gapY);

      // Card Background Tile
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = card.isReversed ? 'rgba(239, 68, 68, 0.5)' : 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cardBoxW, cardBoxH, 14);
      ctx.fill();
      ctx.stroke();

      // Card Position Name
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 12px "Outfit", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText((card.positionName || `Arcano ${idx + 1}`).toUpperCase(), cx + 16, cy + 28);

      // Card Title
      ctx.fillStyle = card.isReversed ? '#FCA5A5' : '#FDE68A';
      ctx.font = 'bold 16px "Cinzel", Georgia, serif';
      const cardTitle = card.isReversed ? `${card.name} (Inv.)` : card.name;
      ctx.fillText(cardTitle.length > 20 ? cardTitle.slice(0, 18) + '...' : cardTitle, cx + 16, cy + 56);

      // Card Light/Keywords
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '13px "Outfit", sans-serif';
      const cardDesc = card.light ? card.light.slice(0, 32) + '...' : (card.keywords?.[0] || 'Luz sagrada');
      ctx.fillText(cardDesc, cx + 16, cy + 86);

      // Advice Snippet
      if (card.advice) {
        ctx.fillStyle = '#E9D5FF';
        ctx.font = 'italic 11px "Outfit", sans-serif';
        const advSnippet = `"${card.advice.slice(0, 34)}..."`;
        ctx.fillText(advSnippet, cx + 16, cy + 114);
      }
    });

    // 8. Oracle Revelation Box (Bottom Area)
    const oracleBoxY = startY + rows * (cardBoxH + gapY) + 20;
    const oracleBoxH = height - oracleBoxY - 110;
    const oWidth = width - 140;

    ctx.fillStyle = 'rgba(18, 11, 46, 0.75)';
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect((width - oWidth) / 2, oracleBoxY, oWidth, oracleBoxH, 20);
    ctx.fill();
    ctx.stroke();

    // Oracle Box Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 18px "Cinzel", Georgia, serif';
    ctx.fillText('🗝️ CONSELHO DO ORÁCULO', width / 2, oracleBoxY + 38);

    // Oracle Advice Text (Wrapped)
    const adviceText = oracleSynthesis?.advice || oracleSynthesis?.diagnosis || 'Acolha as transformações com equilíbrio, integridade e serenidade.';
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '16px "Outfit", sans-serif';
    
    // Simple canvas text wrap
    const maxLineW = oWidth - 60;
    const words = adviceText.split(' ');
    let line = '';
    let lineY = oracleBoxY + 74;
    const lineH = 26;
    const maxLines = 4;
    let linesDrawn = 0;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW && i > 0) {
        ctx.fillText(line.trim(), width / 2, lineY);
        line = words[i] + ' ';
        lineY += lineH;
        linesDrawn++;
        if (linesDrawn >= maxLines) break;
      } else {
        line = testLine;
      }
    }
    if (line && linesDrawn < maxLines) {
      ctx.fillText(line.trim(), width / 2, lineY);
    }

    // 9. Footer
    ctx.fillStyle = '#64748B';
    ctx.font = '13px "Cinzel", serif';
    ctx.fillText('Lumina Tarot • Sabedoria Ancestral & Arcanos do Destino', width / 2, height - 55);

    return canvas;
  },

  // Export and download high-res PNG image
  async downloadReadingImage(readingData) {
    try {
      const canvas = await this.generateReadingCanvas(readingData);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const filename = `lumina-tarot-${Date.now()}.png`;
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (err) {
      console.error('Error generating reading image:', err);
      return false;
    }
  },

  // Native Web Share API (Mobile / Desktop)
  async shareReadingNative({ spreadConfig, chosenCards, userQuestion, oracleSynthesis }) {
    const cardsList = (chosenCards || []).map(c => 
      `• ${c.positionName || 'Altar'}: ${c.name} ${c.isReversed ? '(Invertida)' : ''}`
    ).join('\n');

    const shareText = `🔮 Leitura no Lumina Tarot\n✦ Tiragem: ${spreadConfig?.name || 'Tiragem Livre'}${userQuestion ? `\n✦ Dúvida: "${userQuestion}"` : ''}\n\nCartas Reveladas:\n${cardsList}\n\n🗝️ Conselho do Oráculo:\n"${oracleSynthesis?.advice || oracleSynthesis?.diagnosis || 'Confie na sua intuição.'}"\n\n✨ Consulte o oráculo: https://splashyy7.github.io/lumina-tarot/`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lumina Tarot • Revelação dos Arcanos',
          text: shareText,
          url: 'https://splashyy7.github.io/lumina-tarot/'
        });
        return { success: true, method: 'native' };
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.warn('Native share failed, falling back to clipboard', e);
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      return { success: true, method: 'clipboard' };
    } catch (err) {
      return { success: false, error: err };
    }
  }
};
