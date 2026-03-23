// ============================================
// engine.js - テキストエンジン / フラグ管理 / 分岐制御
// ============================================

const GameEngine = (() => {
  // ゲーム状態
  const state = {
    karma_humanity: 0,
    karma_logic: 0,
    currentNodeId: null,
    isTyping: false,
    typingTimeout: null,
    charIndex: 0,
    currentText: '',
    started: false,
    ended: false,
    log: []           // バックログ用
  };

  // DOM参照
  let textWindow, speakerName, textContent, choicesContainer, clickIndicator;
  let endingOverlay, endingTitle, endingMessage, restartBtn;
  let karmaLogicBar, karmaHumanityBar, karmaLogicVal, karmaHumanityVal;
  let backlogPanel, backlogContent, backlogCloseBtn;
  let gameContainer;

  // シナリオノードをIDでルックアップできるmapを作成
  let nodeMap = {};

  const SAVE_KEY = 'neon_and_memory_save';
  const MAX_KARMA = 3;

  function init() {
    gameContainer = document.getElementById('game');
    textWindow = document.getElementById('text-window');
    speakerName = document.getElementById('speaker-name');
    textContent = document.getElementById('text-content');
    choicesContainer = document.getElementById('choices-container');
    clickIndicator = document.getElementById('click-indicator');
    endingOverlay = document.getElementById('ending-overlay');
    endingTitle = document.getElementById('ending-title');
    endingMessage = document.getElementById('ending-message');
    restartBtn = document.getElementById('restart-btn');

    karmaLogicBar = document.getElementById('karma-logic-bar');
    karmaHumanityBar = document.getElementById('karma-humanity-bar');
    karmaLogicVal = document.getElementById('karma-logic-val');
    karmaHumanityVal = document.getElementById('karma-humanity-val');

    backlogPanel = document.getElementById('backlog-panel');
    backlogContent = document.getElementById('backlog-content');
    backlogCloseBtn = document.getElementById('backlog-close-btn');

    // ノードマップ構築
    ScenarioData.forEach(node => {
      nodeMap[node.id] = node;
    });

    // クリックイベント
    textWindow.addEventListener('click', onTextClick);
    restartBtn.addEventListener('click', restartGame);

    // バックログ
    document.getElementById('backlog-btn').addEventListener('click', openBacklog);
    backlogCloseBtn.addEventListener('click', closeBacklog);

    // セーブ/ロード
    document.getElementById('save-btn').addEventListener('click', saveGame);
    document.getElementById('load-btn').addEventListener('click', loadGame);

    // ロードボタンの有効/無効
    updateLoadButtonState();
  }

  function startGame() {
    state.started = true;
    state.ended = false;
    state.karma_humanity = 0;
    state.karma_logic = 0;
    state.log = [];
    textWindow.classList.add('visible');
    document.getElementById('hud').classList.add('visible');
    updateKarmaDisplay();
    showNode('prologue_1');
  }

  function showNode(nodeId) {
    const node = nodeMap[nodeId];
    if (!node) return;

    state.currentNodeId = nodeId;
    clickIndicator.style.opacity = '0';

    // シーン変更
    if (node.scene) {
      Background.setScene(node.scene);
    }

    // BGM切り替え
    if (node.bgm) {
      AudioManager.switchBGM(node.bgm);
    }

    // Karma処理
    if (node.karma) {
      if (node.karma.humanity) state.karma_humanity += node.karma.humanity;
      if (node.karma.logic) state.karma_logic += node.karma.logic;
      updateKarmaDisplay();
    }

    // エンディング表示
    if (node.endingType) {
      showEnding(node);
      return;
    }

    // 選択肢表示
    if (node.choices) {
      showChoices(node.choices);
      return;
    }

    // スピーカー名
    if (node.speaker) {
      speakerName.textContent = node.speaker;
      speakerName.style.display = 'block';
      if (node.speaker === 'R-7') {
        speakerName.style.color = '#00f0ff';
      } else if (node.speaker === 'レイ') {
        speakerName.style.color = '#ffaa44';
      } else if (node.speaker === 'ヴォルフ') {
        speakerName.style.color = '#ff6644';
      } else {
        speakerName.style.color = '#ff2d75';
      }
    } else {
      speakerName.style.display = 'none';
    }

    // Chapter3 (syndicate) シーン: グリッチエフェクト
    const currentScene = node.scene || _getCurrentScene();
    if (currentScene === 'syndicate') {
      _triggerGlitch();
    }

    // テキスト表示
    if (node.text) {
      typeText(node.text);
      // バックログに追加
      const logEntry = { speaker: node.speaker || null, text: node.text };
      state.log.push(logEntry);
    }
  }

  function _getCurrentScene() {
    // 現在表示中シーンをscenario上流から探す
    const node = nodeMap[state.currentNodeId];
    return node && node.scene ? node.scene : '';
  }

  function _triggerGlitch() {
    if (!gameContainer) return;
    gameContainer.classList.add('glitch-active');
    setTimeout(() => gameContainer.classList.remove('glitch-active'), 600);
  }

  function typeText(text) {
    state.isTyping = true;
    state.currentText = text;
    state.charIndex = 0;
    textContent.textContent = '';

    function typeNext() {
      if (state.charIndex < state.currentText.length) {
        textContent.textContent += state.currentText[state.charIndex];
        state.charIndex++;

        if (state.charIndex % 3 === 0) {
          AudioManager.playTypeSE();
        }

        state.typingTimeout = setTimeout(typeNext, 35);
      } else {
        state.isTyping = false;
        clickIndicator.style.opacity = '1';
      }
    }

    typeNext();
  }

  function onTextClick(e) {
    e.stopPropagation();
    if (state.ended) return;

    if (state.isTyping) {
      clearTimeout(state.typingTimeout);
      textContent.textContent = state.currentText;
      state.isTyping = false;
      clickIndicator.style.opacity = '1';
    } else {
      const currentNode = nodeMap[state.currentNodeId];
      if (currentNode && currentNode.next) {
        showNode(currentNode.next);
      }
    }
  }

  function showChoices(choices) {
    // Karma条件でフィルタリング
    const filtered = choices.filter(choice => {
      if (choice.requireLogic && state.karma_logic < choice.requireLogic) return false;
      if (choice.requireHumanity && state.karma_humanity < choice.requireHumanity) return false;
      return true;
    });

    speakerName.style.display = 'none';
    textContent.textContent = '';
    clickIndicator.style.opacity = '0';
    choicesContainer.innerHTML = '';
    choicesContainer.classList.add('visible');

    filtered.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.label;
      btn.style.animationDelay = `${index * 0.15}s`;

      btn.addEventListener('mouseenter', () => {
        AudioManager.playHoverSE();
        Background.addParticles(
          btn.getBoundingClientRect().left + btn.offsetWidth / 2,
          btn.getBoundingClientRect().top,
          5,
          '#00f0ff'
        );
      });

      btn.addEventListener('click', () => {
        AudioManager.playSelectSE();
        choicesContainer.classList.remove('visible');
        setTimeout(() => {
          choicesContainer.innerHTML = '';
          showNode(choice.next);
        }, 300);
      });

      choicesContainer.appendChild(btn);
    });
  }

  function showEnding(node) {
    state.ended = true;
    textWindow.classList.remove('visible');
    document.getElementById('hud').classList.remove('visible');

    AudioManager.playEndingChime();

    setTimeout(() => {
      endingOverlay.classList.add('visible');
      endingOverlay.className = 'ending-overlay visible';
      endingOverlay.classList.add(`ending-${node.endingType}`);
      endingTitle.textContent = node.endingTitle;
      endingMessage.textContent = node.endingMessage;
    }, 1000);
  }

  function restartGame() {
    endingOverlay.classList.remove('visible');
    endingOverlay.className = 'ending-overlay';
    state.ended = false;
    state.karma_humanity = 0;
    state.karma_logic = 0;
    state.log = [];
    Background.setScene('city');
    updateKarmaDisplay();
    gameContainer.classList.remove('glitch-active');

    setTimeout(() => {
      textWindow.classList.remove('visible');
      document.getElementById('hud').classList.remove('visible');
      document.getElementById('title-screen').classList.add('visible');
    }, 500);
  }

  // ─── Karma表示 ───
  function updateKarmaDisplay() {
    const logicPct = Math.min(state.karma_logic / MAX_KARMA, 1) * 100;
    const humanityPct = Math.min(state.karma_humanity / MAX_KARMA, 1) * 100;

    if (karmaLogicBar) karmaLogicBar.style.width = logicPct + '%';
    if (karmaHumanityBar) karmaHumanityBar.style.width = humanityPct + '%';
    if (karmaLogicVal) karmaLogicVal.textContent = state.karma_logic;
    if (karmaHumanityVal) karmaHumanityVal.textContent = state.karma_humanity;

    // Logic vs Humanity によってUI色合いを微変化
    const logicRatio = state.karma_logic / (state.karma_logic + state.karma_humanity + 0.01);
    const r = Math.round(0 + logicRatio * 0);
    const g = Math.round(240 - logicRatio * 130);
    const b = Math.round(255 - logicRatio * 100);
    document.documentElement.style.setProperty('--karma-accent', `rgb(${r}, ${g}, ${b})`);
  }

  // ─── セーブ / ロード ───
  function saveGame() {
    if (!state.started || state.ended) return;
    const saveData = {
      nodeId: state.currentNodeId,
      karma_logic: state.karma_logic,
      karma_humanity: state.karma_humanity
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      _flashMessage('SAVED');
      updateLoadButtonState();
    } catch(e) {
      _flashMessage('SAVE FAILED');
    }
  }

  function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (!data.nodeId || !nodeMap[data.nodeId]) return;

      // ゲーム未開始なら開始処理
      if (!state.started) {
        state.started = true;
        state.ended = false;
        state.log = [];
        textWindow.classList.add('visible');
        document.getElementById('hud').classList.add('visible');
        document.getElementById('title-screen').classList.remove('visible');
        AudioManager.startBGM('ambient');
      }

      state.karma_logic = data.karma_logic || 0;
      state.karma_humanity = data.karma_humanity || 0;
      state.ended = false;
      updateKarmaDisplay();
      showNode(data.nodeId);
      _flashMessage('LOADED');
    } catch(e) {
      _flashMessage('LOAD FAILED');
    }
  }

  function updateLoadButtonState() {
    const loadBtn = document.getElementById('load-btn');
    if (!loadBtn) return;
    const hasSave = !!localStorage.getItem(SAVE_KEY);
    loadBtn.classList.toggle('disabled', !hasSave);
  }

  function _flashMessage(msg) {
    const el = document.getElementById('flash-message');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 1500);
  }

  // ─── バックログ ───
  function openBacklog() {
    if (!backlogPanel) return;
    backlogContent.innerHTML = '';
    state.log.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'log-entry';
      if (entry.speaker) {
        const sp = document.createElement('span');
        sp.className = 'log-speaker';
        sp.textContent = entry.speaker;
        div.appendChild(sp);
      }
      const tx = document.createElement('p');
      tx.className = 'log-text';
      tx.textContent = entry.text;
      div.appendChild(tx);
      backlogContent.appendChild(div);
    });
    backlogPanel.classList.add('visible');
    backlogContent.scrollTop = backlogContent.scrollHeight;
  }

  function closeBacklog() {
    if (backlogPanel) backlogPanel.classList.remove('visible');
  }

  return { init, startGame, state };
})();
