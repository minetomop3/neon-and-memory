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
    ended: false
  };

  // DOM参照
  let textWindow, speakerName, textContent, choicesContainer, clickIndicator;
  let endingOverlay, endingTitle, endingMessage, restartBtn;

  // シナリオノードをIDでルックアップできるmapを作成
  let nodeMap = {};

  function init() {
    // DOM取得
    textWindow = document.getElementById('text-window');
    speakerName = document.getElementById('speaker-name');
    textContent = document.getElementById('text-content');
    choicesContainer = document.getElementById('choices-container');
    clickIndicator = document.getElementById('click-indicator');
    endingOverlay = document.getElementById('ending-overlay');
    endingTitle = document.getElementById('ending-title');
    endingMessage = document.getElementById('ending-message');
    restartBtn = document.getElementById('restart-btn');

    // ノードマップ構築
    ScenarioData.forEach(node => {
      nodeMap[node.id] = node;
    });

    // クリックイベント
    textWindow.addEventListener('click', onTextClick);
    restartBtn.addEventListener('click', restartGame);
  }

  function startGame() {
    state.started = true;
    state.ended = false;
    state.karma_humanity = 0;
    state.karma_logic = 0;
    textWindow.classList.add('visible');
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

    // Karma処理
    if (node.karma) {
      if (node.karma.humanity) state.karma_humanity += node.karma.humanity;
      if (node.karma.logic) state.karma_logic += node.karma.logic;
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
      // スピーカーによる色分け
      if (node.speaker === 'R-7') {
        speakerName.style.color = '#00f0ff';
      } else {
        speakerName.style.color = '#ff2d75';
      }
    } else {
      speakerName.style.display = 'none';
    }

    // テキスト表示
    typeText(node.text);
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

        // タイプSE（3文字に1回）
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
      // タイプ中ならスキップして全文表示
      clearTimeout(state.typingTimeout);
      textContent.textContent = state.currentText;
      state.isTyping = false;
      clickIndicator.style.opacity = '1';
    } else {
      // 次のノードへ
      const currentNode = nodeMap[state.currentNodeId];
      if (currentNode && currentNode.next) {
        showNode(currentNode.next);
      }
    }
  }

  function showChoices(choices) {
    speakerName.style.display = 'none';
    textContent.textContent = '';
    clickIndicator.style.opacity = '0';
    choicesContainer.innerHTML = '';
    choicesContainer.classList.add('visible');

    choices.forEach((choice, index) => {
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

    AudioManager.playEndingChime();

    setTimeout(() => {
      endingOverlay.classList.add('visible');

      // エンディングタイプごとのスタイル
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
    Background.setScene('city');

    setTimeout(() => {
      // タイトルに戻す
      textWindow.classList.remove('visible');
      document.getElementById('title-screen').classList.add('visible');
    }, 500);
  }

  return { init, startGame, state };
})();
