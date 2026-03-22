// ============================================
// audio.js - Web Audio API サウンド生成
// ============================================

const AudioManager = (() => {
  let ctx = null;
  let masterGain = null;
  let bgmOsc = null;
  let bgmGain = null;
  let bgmRunning = false;

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

  // BGM: アンビエントドローン
  function startBGM() {
    if (!ctx || bgmRunning) return;
    bgmRunning = true;
    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0;
    bgmGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3);
    bgmGain.connect(masterGain);

    // ベースドローン
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55; // A1
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 200;
    osc1.connect(filter1);
    filter1.connect(bgmGain);
    osc1.start();

    // パッドレイヤー
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 110;
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.value = 400;
    osc2.connect(filter2);
    filter2.connect(bgmGain);
    osc2.start();

    // LFOでフィルターを揺らす
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 100;
    lfo.connect(lfoGain);
    lfoGain.connect(filter2.frequency);
    lfo.start();

    // 高音のきらめき
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 880;
    const gain3 = ctx.createGain();
    gain3.gain.value = 0.015;
    osc3.connect(gain3);
    gain3.connect(bgmGain);
    osc3.start();

    bgmOsc = [osc1, osc2, lfo, osc3];
  }

  function stopBGM() {
    if (!bgmRunning || !bgmOsc) return;
    bgmGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2);
    setTimeout(() => {
      bgmOsc.forEach(o => { try { o.stop(); } catch(e) {} });
      bgmOsc = null;
      bgmRunning = false;
    }, 2500);
  }

  return { init, playTypeSE, playHoverSE, playSelectSE, playEndingChime, startBGM, stopBGM };
})();
