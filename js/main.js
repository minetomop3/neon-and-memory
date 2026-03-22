// ============================================
// main.js - エントリーポイント / 初期化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const titleScreen = document.getElementById('title-screen');
  const canvas = document.getElementById('bg-canvas');
  let audioInitialized = false;

  // 背景の初期化・開始
  Background.init(canvas);
  Background.start();

  // エンジン初期化
  GameEngine.init();

  // タイトル画面表示
  setTimeout(() => {
    titleScreen.classList.add('visible');
  }, 500);

  // タイトルクリックでゲーム開始
  titleScreen.addEventListener('click', () => {
    // 初回クリックでオーディオ初期化（ブラウザ制限対策）
    if (!audioInitialized) {
      AudioManager.init();
      audioInitialized = true;
    }
    AudioManager.startBGM();
    AudioManager.playSelectSE();

    titleScreen.classList.remove('visible');

    setTimeout(() => {
      GameEngine.startGame();
    }, 800);
  });
});
