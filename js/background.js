// ============================================
// background.js - Canvas 背景アニメーション
// ============================================

const Background = (() => {
  let canvas, ctx;
  let width, height;
  let raindrops = [];
  let neonSigns = [];
  let buildings = [];
  let particles = [];
  let hologramAngle = 0;
  let currentScene = 'city';
  let sceneTransitionAlpha = 0;
  let targetScene = 'city';
  let frameCount = 0;
  let stars = [];

  // カラーパレット
  const COLORS = {
    city: {
      sky: [10, 0, 30],
      rain: 'rgba(120, 255, 160, 0.3)',
      neon1: '#ff2d75',
      neon2: '#00f0ff',
      neon3: '#ffaa00',
      ground: [15, 5, 25]
    },
    city_night: {
      sky: [5, 0, 20],
      rain: 'rgba(100, 200, 140, 0.25)',
      neon1: '#ff2d75',
      neon2: '#00f0ff',
      neon3: '#ffaa00',
      ground: [10, 3, 18]
    },
    city_dawn: {
      sky: [25, 10, 40],
      rain: 'rgba(180, 220, 255, 0.2)',
      neon1: '#ff8866',
      neon2: '#66ddff',
      neon3: '#ffcc44',
      ground: [20, 8, 30]
    },
    warp: {
      sky: [0, 0, 5],
      rain: 'rgba(255, 255, 255, 0.1)',
      neon1: '#ffffff',
      neon2: '#8888ff',
      neon3: '#ffffff',
      ground: [0, 0, 10]
    },
    space: {
      sky: [2, 0, 15],
      rain: 'rgba(200, 200, 255, 0.05)',
      neon1: '#aaaaff',
      neon2: '#ffaaff',
      neon3: '#aaffff',
      ground: [5, 0, 20]
    },
    dawn: {
      sky: [40, 15, 50],
      rain: 'rgba(255, 200, 150, 0.15)',
      neon1: '#ffaa66',
      neon2: '#ff88cc',
      neon3: '#ffdd88',
      ground: [30, 10, 35]
    }
  };

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    resize();
    initBuildings();
    initNeonSigns();
    initStars();
    window.addEventListener('resize', resize);
  }

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    initBuildings();
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005
      });
    }
  }

  function initBuildings() {
    buildings = [];
    const count = Math.floor(width / 30) + 5;
    for (let i = 0; i < count; i++) {
      const w = 20 + Math.random() * 40;
      const h = 60 + Math.random() * (height * 0.4);
      buildings.push({
        x: i * (width / count) + Math.random() * 10 - 5,
        w: w,
        h: h,
        windows: Math.floor(Math.random() * 8) + 3,
        windowRows: Math.floor(h / 16),
        hasAntenna: Math.random() > 0.6,
        antennaH: 10 + Math.random() * 30,
        toriiStyle: Math.random() > 0.85
      });
    }
  }

  function initNeonSigns() {
    const signs = ['居酒屋', '電脳', 'ラーメン', 'ネオン', '未来', '記憶', 'データ', '酒', '薬局', '宿'];
    neonSigns = [];
    for (let i = 0; i < 8; i++) {
      neonSigns.push({
        text: signs[Math.floor(Math.random() * signs.length)],
        x: Math.random() * 0.8 + 0.1,
        y: Math.random() * 0.3 + 0.35,
        color: ['#ff2d75', '#00f0ff', '#ffaa00', '#ff66aa', '#66ffaa'][Math.floor(Math.random() * 5)],
        flickerSpeed: Math.random() * 0.05 + 0.02,
        flickerPhase: Math.random() * Math.PI * 2,
        size: 10 + Math.random() * 8,
        vertical: Math.random() > 0.5
      });
    }
  }

  function setScene(scene) {
    if (COLORS[scene]) {
      targetScene = scene;
    }
  }

  function draw() {
    frameCount++;
    const colors = COLORS[currentScene] || COLORS.city;

    if (currentScene !== targetScene) {
      sceneTransitionAlpha += 0.01;
      if (sceneTransitionAlpha >= 1) {
        currentScene = targetScene;
        sceneTransitionAlpha = 0;
      }
    }

    // 空
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, `rgb(${colors.sky[0]}, ${colors.sky[1]}, ${colors.sky[2]})`);
    grad.addColorStop(1, `rgb(${colors.ground[0]}, ${colors.ground[1]}, ${colors.ground[2]})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // シーン別の描画
    if (currentScene === 'warp') {
      drawWarpEffect();
    } else if (currentScene === 'space') {
      drawStars();
      drawSpaceEffect();
    } else if (currentScene === 'dawn') {
      drawStars();
      drawDawnEffect();
      drawBuildings(colors);
    } else {
      drawStars();
      drawBuildings(colors);
      drawNeonSigns(colors);
      drawHologram(colors);
    }

    // 雨
    if (currentScene !== 'warp' && currentScene !== 'space') {
      drawRain(colors);
    }

    // パーティクル
    drawParticles();

    // シーン遷移オーバーレイ
    if (sceneTransitionAlpha > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${sceneTransitionAlpha})`;
      ctx.fillRect(0, 0, width, height);
    }

    // スキャンラインエフェクト
    drawScanlines();

    requestAnimationFrame(draw);
  }

  function drawStars() {
    stars.forEach(star => {
      star.twinkle += star.speed;
      const alpha = 0.3 + Math.sin(star.twinkle) * 0.3;
      const x = star.x * width;
      const y = star.y * height * 0.6;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      // ピクセル風の星
      const s = Math.round(star.size);
      ctx.fillRect(Math.round(x), Math.round(y), s, s);
    });
  }

  function drawBuildings(colors) {
    const groundY = height * 0.55;

    buildings.forEach(b => {
      const bx = Math.round(b.x);
      const by = Math.round(groundY - b.h);
      const bw = Math.round(b.w);
      const bh = Math.round(b.h + height - groundY);

      // メインビル
      ctx.fillStyle = `rgb(${colors.ground[0] + 8}, ${colors.ground[1] + 3}, ${colors.ground[2] + 12})`;
      ctx.fillRect(bx, by, bw, bh);

      // ビルの輪郭
      ctx.strokeStyle = `rgba(${colors.sky[0] + 30}, ${colors.sky[1] + 15}, ${colors.sky[2] + 40}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, bw, bh);

      // 窓
      for (let row = 0; row < b.windowRows; row++) {
        for (let col = 0; col < b.windows; col++) {
          const wx = bx + 3 + col * (bw - 6) / b.windows;
          const wy = by + 4 + row * 16;
          const lit = Math.sin(frameCount * 0.01 + row + col + b.x) > 0.2;
          if (lit) {
            const wColor = Math.random() > 0.7 ? colors.neon1 : (Math.random() > 0.5 ? '#ffdd66' : '#aaffee');
            ctx.fillStyle = wColor;
            ctx.globalAlpha = 0.4 + Math.random() * 0.3;
          } else {
            ctx.fillStyle = '#111122';
            ctx.globalAlpha = 0.8;
          }
          ctx.fillRect(Math.round(wx), Math.round(wy), 3, 4);
          ctx.globalAlpha = 1;
        }
      }

      // アンテナ
      if (b.hasAntenna) {
        ctx.strokeStyle = '#444466';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx + bw / 2, by);
        ctx.lineTo(bx + bw / 2, by - b.antennaH);
        ctx.stroke();

        // アンテナの点滅ライト
        const blink = Math.sin(frameCount * 0.05 + b.x) > 0;
        if (blink) {
          ctx.fillStyle = '#ff0033';
          ctx.fillRect(Math.round(bx + bw / 2 - 1), Math.round(by - b.antennaH), 3, 3);
        }
      }

      // 鳥居風装飾
      if (b.toriiStyle) {
        ctx.fillStyle = '#882233';
        ctx.fillRect(bx - 4, by - 6, bw + 8, 3);
        ctx.fillRect(bx - 2, by - 3, bw + 4, 2);
      }
    });
  }

  function drawNeonSigns(colors) {
    neonSigns.forEach(sign => {
      const flickerVal = Math.sin(frameCount * sign.flickerSpeed + sign.flickerPhase);
      if (flickerVal < -0.6) return;

      const alpha = 0.5 + flickerVal * 0.3;
      const x = Math.round(sign.x * width);
      const y = Math.round(sign.y * height);

      ctx.save();
      ctx.font = `${Math.round(sign.size)}px DotGothic16, monospace`;
      ctx.fillStyle = sign.color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = sign.color;
      ctx.shadowBlur = 8 + flickerVal * 4;

      if (sign.vertical) {
        const chars = sign.text.split('');
        chars.forEach((ch, i) => {
          ctx.fillText(ch, x, y + i * (sign.size + 2));
        });
      } else {
        ctx.fillText(sign.text, x, y);
      }

      ctx.restore();
    });
  }

  function drawHologram(colors) {
    hologramAngle += 0.02;
    const cx = width * 0.75;
    const cy = height * 0.3;
    const size = 25 + Math.sin(hologramAngle * 0.5) * 5;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(hologramAngle);

    // ホログラム三角形
    ctx.strokeStyle = colors.neon2;
    ctx.globalAlpha = 0.3 + Math.sin(hologramAngle) * 0.15;
    ctx.lineWidth = 1;
    ctx.shadowColor = colors.neon2;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    // 内側の回転四角形
    ctx.rotate(-hologramAngle * 2);
    ctx.strokeStyle = colors.neon1;
    ctx.shadowColor = colors.neon1;
    ctx.beginPath();
    const s2 = size * 0.6;
    ctx.rect(-s2 / 2, -s2 / 2, s2, s2);
    ctx.stroke();

    ctx.restore();
  }

  function drawRain(colors) {
    // 新しい雨粒を生成
    for (let i = 0; i < 3; i++) {
      raindrops.push({
        x: Math.random() * width,
        y: -5,
        speed: 3 + Math.random() * 4,
        length: 4 + Math.random() * 8
      });
    }

    ctx.strokeStyle = colors.rain;
    ctx.lineWidth = 1;

    raindrops = raindrops.filter(drop => {
      drop.y += drop.speed;
      ctx.beginPath();
      ctx.moveTo(Math.round(drop.x), Math.round(drop.y));
      ctx.lineTo(Math.round(drop.x - 0.5), Math.round(drop.y + drop.length));
      ctx.stroke();
      return drop.y < height;
    });
  }

  function drawWarpEffect() {
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 + frameCount * 0.02;
      const dist = 50 + (frameCount % 100) * 3 + i * 5;
      const x1 = cx + Math.cos(angle) * dist;
      const y1 = cy + Math.sin(angle) * dist;
      const x2 = cx + Math.cos(angle) * (dist + 40 + Math.random() * 60);
      const y2 = cy + Math.sin(angle) * (dist + 40 + Math.random() * 60);

      ctx.strokeStyle = `rgba(${150 + Math.random() * 105}, ${150 + Math.random() * 105}, 255, ${0.2 + Math.random() * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  function drawSpaceEffect() {
    // 星雲エフェクト
    for (let i = 0; i < 5; i++) {
      const x = width * (0.3 + Math.sin(frameCount * 0.003 + i) * 0.3);
      const y = height * (0.2 + Math.cos(frameCount * 0.002 + i * 2) * 0.15);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 60 + Math.sin(frameCount * 0.01 + i) * 20);
      grad.addColorStop(0, `rgba(100, 50, 200, 0.08)`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 接続するライン
    const lineCount = 8;
    for (let i = 0; i < lineCount; i++) {
      const t = (frameCount * 0.005 + i / lineCount) % 1;
      const x1 = width * 0.3 + Math.sin(t * Math.PI * 2 + i) * width * 0.2;
      const y1 = height * 0.3 + Math.cos(t * Math.PI * 2 + i) * height * 0.15;
      const x2 = width * 0.7 + Math.sin(t * Math.PI * 2 + i + 1) * width * 0.15;
      const y2 = height * 0.4 + Math.cos(t * Math.PI * 2 + i + 1) * height * 0.1;

      ctx.strokeStyle = `rgba(170, 170, 255, ${0.1 + Math.sin(frameCount * 0.02 + i) * 0.05})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  function drawDawnEffect() {
    // 夜明けのグラデーション光
    const grad = ctx.createLinearGradient(0, height * 0.4, 0, height);
    grad.addColorStop(0, 'rgba(255, 150, 50, 0)');
    grad.addColorStop(0.5, `rgba(255, 180, 80, ${0.1 + Math.sin(frameCount * 0.01) * 0.03})`);
    grad.addColorStop(1, `rgba(255, 200, 100, ${0.15 + Math.sin(frameCount * 0.008) * 0.05})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 光の粒子
    for (let i = 0; i < 20; i++) {
      const x = (Math.sin(frameCount * 0.003 + i * 1.5) * 0.5 + 0.5) * width;
      const y = height * 0.5 + Math.sin(frameCount * 0.005 + i) * height * 0.15;
      const alpha = 0.1 + Math.sin(frameCount * 0.02 + i * 3) * 0.08;
      ctx.fillStyle = `rgba(255, 220, 150, ${Math.max(0, alpha)})`;
      ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
    }
  }

  function drawParticles() {
    particles = particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      const alpha = p.life / p.maxLife;
      ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
      return p.life > 0;
    });
  }

  function addParticles(x, y, count, color) {
    const r = parseInt(color.slice(1, 3), 16) || 255;
    const g = parseInt(color.slice(3, 5), 16) || 100;
    const b = parseInt(color.slice(5, 7), 16) || 200;
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 30 + Math.random() * 30,
        maxLife: 60,
        r, g, b
      });
    }
  }

  function drawScanlines() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    for (let y = 0; y < height; y += 3) {
      ctx.fillRect(0, y, width, 1);
    }
  }

  function start() {
    requestAnimationFrame(draw);
  }

  return { init, start, setScene, addParticles };
})();
