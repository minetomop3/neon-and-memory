// ============================================
// audio.js - Web Audio API サウンド生成
// ============================================

const AudioManager = (() => {
  let ctx = null;
  let masterGain = null;
  let bgmOscs = null;
  let bgmGain = null;
  let bgmRunning = false;
  let currentBgmType = 'ambient';

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);
  }

  // タイプライターSE: 短い正弦波パルス
  function playTypeSE() {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 800 + Math.random() * 400;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  }

  // 選択肢ホバーSE
  function playHoverSE() {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1200;
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.08);
    gain.gain.value = 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  }

  // 選択肢クリックSE
  function playSelectSE() {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 600;
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.1);
    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }

  // エンディングチャイム
  function playEndingChime() {
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.12;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 1.5);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(ctx.currentTime + i * 0.3);
      osc.stop(ctx.currentTime + i * 0.3 + 1.5);
    });
  }

  // ─── BGM生成: 各タイプ ───

  function _buildAmbientBGM(gainNode) {
    const oscs = [];
    // ベースドローン (A1)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55;
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 200;
    osc1.connect(filter1); filter1.connect(gainNode); osc1.start();
    oscs.push(osc1);

    // パッドレイヤー (A2)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 110;
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.value = 400;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine'; lfo.frequency.value = 0.1;
    lfoGain.gain.value = 100;
    lfo.connect(lfoGain); lfoGain.connect(filter2.frequency); lfo.start();
    osc2.connect(filter2); filter2.connect(gainNode); osc2.start();
    oscs.push(osc2, lfo);

    // きらめき高音
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine'; osc3.frequency.value = 880;
    const g3 = ctx.createGain(); g3.gain.value = 0.015;
    osc3.connect(g3); g3.connect(gainNode); osc3.start();
    oscs.push(osc3);

    return oscs;
  }

  function _buildTenseBGM(gainNode) {
    const oscs = [];
    // 低音の緊張ドローン
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth'; osc1.frequency.value = 65;
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'lowpass'; filter1.frequency.value = 300;
    osc1.connect(filter1); filter1.connect(gainNode); osc1.start();
    oscs.push(osc1);

    // 速いLFOで不安感
    const osc2 = ctx.createOscillator();
    osc2.type = 'square'; osc2.frequency.value = 130;
    const g2 = ctx.createGain(); g2.gain.value = 0.04;
    const lfo2 = ctx.createOscillator();
    const lfoG2 = ctx.createGain();
    lfo2.type = 'sine'; lfo2.frequency.value = 0.5;
    lfoG2.gain.value = 0.03;
    lfo2.connect(lfoG2); lfoG2.connect(g2.gain); lfo2.start();
    osc2.connect(g2); g2.connect(gainNode); osc2.start();
    oscs.push(osc2, lfo2);

    // パルス的なビート
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine'; osc3.frequency.value = 220;
    const g3 = ctx.createGain(); g3.gain.value = 0.025;
    const lfo3 = ctx.createOscillator();
    const lfoG3 = ctx.createGain();
    lfo3.type = 'square'; lfo3.frequency.value = 2.0;
    lfoG3.gain.value = 0.02;
    lfo3.connect(lfoG3); lfoG3.connect(g3.gain); lfo3.start();
    osc3.connect(g3); g3.connect(gainNode); osc3.start();
    oscs.push(osc3, lfo3);

    return oscs;
  }

  function _buildMysteriousBGM(gainNode) {
    const oscs = [];
    // 深い低音
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine'; osc1.frequency.value = 45;
    const g1 = ctx.createGain(); g1.gain.value = 0.07;
    osc1.connect(g1); g1.connect(gainNode); osc1.start();
    oscs.push(osc1);

    // 倍音: 神秘的な不協和音
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine'; osc2.frequency.value = 135; // 3倍音
    const g2 = ctx.createGain(); g2.gain.value = 0.03;
    const lfo2 = ctx.createOscillator();
    const lfoG2 = ctx.createGain();
    lfo2.type = 'sine'; lfo2.frequency.value = 0.05;
    lfoG2.gain.value = 50;
    lfo2.connect(lfoG2); lfoG2.connect(osc2.frequency); lfo2.start();
    osc2.connect(g2); g2.connect(gainNode); osc2.start();
    oscs.push(osc2, lfo2);

    // 高音のきらめき（ゆっくり）
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine'; osc3.frequency.value = 660;
    const g3 = ctx.createGain(); g3.gain.value = 0.012;
    const lfo3 = ctx.createOscillator();
    const lfoG3 = ctx.createGain();
    lfo3.type = 'sine'; lfo3.frequency.value = 0.08;
    lfoG3.gain.value = 0.01;
    lfo3.connect(lfoG3); lfoG3.connect(g3.gain); lfo3.start();
    osc3.connect(g3); g3.connect(gainNode); osc3.start();
    oscs.push(osc3, lfo3);

    return oscs;
  }

  function _buildClimaxBGM(gainNode) {
    const oscs = [];
    // 荘厳な低音
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine'; osc1.frequency.value = 82; // E2
    const g1 = ctx.createGain(); g1.gain.value = 0.07;
    osc1.connect(g1); g1.connect(gainNode); osc1.start();
    oscs.push(osc1);

    // 5度上の音 (B2)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle'; osc2.frequency.value = 123;
    const g2 = ctx.createGain(); g2.gain.value = 0.035;
    osc2.connect(g2); g2.connect(gainNode); osc2.start();
    oscs.push(osc2);

    // 中音域のパッド (E3)
    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle'; osc3.frequency.value = 165;
    const g3 = ctx.createGain(); g3.gain.value = 0.025;
    const lfo3 = ctx.createOscillator();
    const lfoG3 = ctx.createGain();
    lfo3.type = 'sine'; lfo3.frequency.value = 0.15;
    lfoG3.gain.value = 0.02;
    lfo3.connect(lfoG3); lfoG3.connect(g3.gain); lfo3.start();
    osc3.connect(g3); g3.connect(gainNode); osc3.start();
    oscs.push(osc3, lfo3);

    // 高音の輝き
    const osc4 = ctx.createOscillator();
    osc4.type = 'sine'; osc4.frequency.value = 990;
    const g4 = ctx.createGain(); g4.gain.value = 0.01;
    const lfo4 = ctx.createOscillator();
    const lfoG4 = ctx.createGain();
    lfo4.type = 'sine'; lfo4.frequency.value = 0.3;
    lfoG4.gain.value = 0.008;
    lfo4.connect(lfoG4); lfoG4.connect(g4.gain); lfo4.start();
    osc4.connect(g4); g4.connect(gainNode); osc4.start();
    oscs.push(osc4, lfo4);

    return oscs;
  }

  // BGM開始（type: 'ambient' | 'tense' | 'mysterious' | 'climax'）
  function startBGM(type) {
    if (!ctx || bgmRunning) return;
    const bgmType = type || 'ambient';
    currentBgmType = bgmType;
    bgmRunning = true;

    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0;
    bgmGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3);
    bgmGain.connect(masterGain);

    switch (bgmType) {
      case 'tense':     bgmOscs = _buildTenseBGM(bgmGain); break;
      case 'mysterious':bgmOscs = _buildMysteriousBGM(bgmGain); break;
      case 'climax':    bgmOscs = _buildClimaxBGM(bgmGain); break;
      default:          bgmOscs = _buildAmbientBGM(bgmGain); break;
    }
  }

  function stopBGM() {
    if (!bgmRunning || !bgmOscs) return;
    bgmGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2);
    const oscsToStop = bgmOscs;
    setTimeout(() => {
      oscsToStop.forEach(o => { try { o.stop(); } catch(e) {} });
      bgmRunning = false;
      bgmOscs = null;
    }, 2500);
  }

  // BGM切り替え（フェードアウト→フェードイン）
  function switchBGM(type) {
    if (!ctx) return;
    if (type === currentBgmType && bgmRunning) return;
    if (bgmRunning) {
      stopBGM();
      setTimeout(() => startBGM(type), 2600);
    } else {
      startBGM(type);
    }
  }

  return { init, playTypeSE, playHoverSE, playSelectSE, playEndingChime, startBGM, stopBGM, switchBGM };
})();
