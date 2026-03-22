// ============================================
// scenario.js - シナリオデータ
// ============================================

const ScenarioData = [
  // ─── プロローグ ───
  {
    id: 'prologue_1',
    speaker: null,
    text: '西暦2700年──日本。',
    next: 'prologue_2',
    scene: 'city'
  },
  {
    id: 'prologue_2',
    speaker: null,
    text: '幾百世紀もの時を超え、この星はなおも回り続けている。',
    next: 'prologue_3'
  },
  {
    id: 'prologue_3',
    speaker: null,
    text: '酸性雨が降り注ぐネオンの街。朽ちかけた鳥居と、ホログラムの看板が同居する奇妙な景色。',
    next: 'prologue_4'
  },
  {
    id: 'prologue_4',
    speaker: null,
    text: 'かつて人類と呼ばれた生命体は、まだこの地表に張り付いている。テクノロジーの大半を失いながらも。',
    next: 'prologue_5'
  },
  {
    id: 'prologue_5',
    speaker: null,
    text: '我々──「記憶生命体」は、肉体を持たない。純粋な情報として宇宙を渡り歩く存在だ。',
    next: 'prologue_6'
  },
  {
    id: 'prologue_6',
    speaker: null,
    text: 'そして私は、この星の人類を見守る使命を与えられた観測者。相棒のR-7と共に、彼らの行く末を見届ける。',
    next: 'prologue_7'
  },
  {
    id: 'prologue_7',
    speaker: null,
    text: '……ずっと、長い時間をかけて。',
    next: 'branch1_intro'
  },

  // ─── 分岐1: 介入の度合い ───
  {
    id: 'branch1_intro',
    speaker: null,
    text: '眼下のネオン街で騒動が起きている。人間たちが旧世紀の技術デバイスを巡って争っているようだ。',
    next: 'branch1_r7',
    scene: 'city'
  },
  {
    id: 'branch1_r7',
    speaker: 'R-7',
    text: '『また彼らは旧時代のガラクタを巡って殺し合っている。進歩がない。』',
    next: 'branch1_mc'
  },
  {
    id: 'branch1_mc',
    speaker: '主人公',
    text: '「……」',
    next: 'branch1_choice'
  },
  {
    id: 'branch1_choice',
    speaker: null,
    text: '',
    choices: [
      {
        label: '高度な知識を直接与えて争いを止める',
        next: 'branch1_a1'
      },
      {
        label: '彼らの夢に干渉し、自ら気づかせるよう促す',
        next: 'branch1_b1'
      }
    ]
  },

  // 選択肢A: Logic
  {
    id: 'branch1_a1',
    speaker: '主人公',
    text: '「兵器の無力化コードを彼らのネットワークに強制送信しよう。」',
    next: 'branch1_a2',
    karma: { logic: 1 }
  },
  {
    id: 'branch1_a2',
    speaker: 'R-7',
    text: '『……完了した。これで一時的に静かになるだろう。だが、彼らはまた行き詰まるたびに我々に答えを求めるようになるぞ。』',
    next: 'mid_1'
  },

  // 選択肢B: Humanity
  {
    id: 'branch1_b1',
    speaker: '主人公',
    text: '「彼らの意識の深層、夢に干渉しよう。争いの無意味さを、彼ら自身の心から引き出すんだ。」',
    next: 'branch1_b2',
    karma: { humanity: 1 }
  },
  {
    id: 'branch1_b2',
    speaker: 'R-7',
    text: '『遠回りな手段だ。今夜も血を流す者は減らないかもしれないが……まあ、お前のやり方に任せよう。』',
    next: 'mid_1'
  },

  // ─── 中盤: 分岐2への橋渡し ───
  {
    id: 'mid_1',
    speaker: null,
    text: '……それから、途方もない時間が流れた。',
    next: 'mid_2',
    scene: 'city_night'
  },
  {
    id: 'mid_2',
    speaker: null,
    text: '人類の進化は遅々として進まない。ネオンの明滅だけが、変わらず夜を彩り続けている。',
    next: 'mid_3'
  },
  {
    id: 'mid_3',
    speaker: null,
    text: '我々と同じように、この星に派遣されていた仲間たちも、一人、また一人と去っていった。',
    next: 'branch2_r7'
  },

  // ─── 分岐2: 帰還提案 ───
  {
    id: 'branch2_r7',
    speaker: 'R-7',
    text: '『なあ、もう見切りをつけて高次元の家（ホーム）へ帰ろう。辛抱できずに帰っていった同僚たちの気持ちが、痛いほどわかる。我々の仕事はここまでだ。』',
    next: 'branch2_choice'
  },
  {
    id: 'branch2_choice',
    speaker: null,
    text: '',
    choices: [
      {
        label: 'いや、彼らにはまだ可能性がある。もう少し残ろう',
        next: 'branch2_a1'
      },
      {
        label: 'そうだな、我々の仕事はここまでだ',
        next: 'branch2_b1'
      }
    ]
  },

  // 選択肢A: 残留
  {
    id: 'branch2_a1',
    speaker: '主人公',
    text: '「いや、彼らにはまだ可能性がある。あの酸性雨に濡れるネオンの瞬きの中に、新しい光が生まれつつあるんだ。もう少しだけ残ろう。」',
    next: 'branch2_a2'
  },
  {
    id: 'branch2_a2',
    speaker: 'R-7',
    text: '『……お前がそこまで言うなら、付き合おう。だが、過度な期待はしないことだ。』',
    next: 'late_1'
  },

  // 選択肢B: 帰還 → Bad End
  {
    id: 'branch2_b1',
    speaker: '主人公',
    text: '「そうだな、我々の仕事はここまでだ。知性のかけらもないまま死んでいく彼らを救う術はない。」',
    next: 'branch2_b2'
  },
  {
    id: 'branch2_b2',
    speaker: 'R-7',
    text: '『賢明な判断だ。これよりワープ装置を起動する。』',
    next: 'bad_end_1'
  },
  {
    id: 'bad_end_1',
    speaker: null,
    text: '澄んだ音と駆け巡るひかり。一本の線が目の前にあらわれては、遠ざかっていく。',
    next: 'bad_end_2',
    scene: 'warp',
    ending: true
  },
  {
    id: 'bad_end_2',
    speaker: null,
    text: '我々が去った後、あの雨降るネオン街の人間たちがどうなったか、もう知る由もない。',
    next: 'bad_end_fin'
  },
  {
    id: 'bad_end_fin',
    speaker: null,
    text: '',
    endingType: 'bad',
    endingTitle: 'Bad End: 放置されたネオン街',
    endingMessage: '彼らの未来は、誰にも見届けられることなく──\n闇の中に沈んでいった。'
  },

  // ─── 終盤: 分岐3への橋渡し ───
  {
    id: 'late_1',
    speaker: null,
    text: '……さらに長い歳月が過ぎた。',
    next: 'late_2',
    scene: 'city_dawn'
  },
  {
    id: 'late_2',
    speaker: null,
    text: 'ある日、信じられない報告がR-7からもたらされた。',
    next: 'late_3'
  },
  {
    id: 'late_3',
    speaker: null,
    text: '人間たちの数人が、ついに旧世紀のサーバーを繋ぎ合わせ、自らの意識をデータ化する「電脳化」の儀式を成功させようとしている。',
    next: 'branch3_r7'
  },

  // ─── 分岐3: 新たな生命体の誕生 ───
  {
    id: 'branch3_r7',
    speaker: 'R-7',
    text: '『信じられない……。彼らは自らの力で、泥沼のような肉体を捨てようとしている。ついに、プリミティブな生態系から我々と同じ「記憶生命体」が生まれようとしているぞ。どうする？』',
    next: 'branch3_choice'
  },
  {
    id: 'branch3_choice',
    speaker: null,
    text: '',
    choices: [
      {
        label: '我々のネットワークへ彼らを迎え入れる',
        next: 'branch3_a1'
      },
      {
        label: '手は貸さない。彼らだけの新しいネットワークを作らせる',
        next: 'branch3_b1'
      }
    ]
  },

  // 選択肢A: True End
  {
    id: 'branch3_a1',
    speaker: '主人公',
    text: '「我々のネットワークへ彼らを迎え入れよう。彼らはもう、我々の同胞だ。」',
    next: 'true_end_1'
  },
  {
    id: 'true_end_1',
    speaker: null,
    text: '『歓迎しよう、新しき隣人たちよ』',
    next: 'true_end_2',
    scene: 'space',
    ending: true
  },
  {
    id: 'true_end_2',
    speaker: null,
    text: '我々の呼びかけに、彼らの生まれたての意識が接続される。',
    next: 'true_end_3'
  },
  {
    id: 'true_end_3',
    speaker: null,
    text: '2700年の日本から、新たな記憶生命体が宇宙へと旅立った。',
    next: 'true_end_4'
  },
  {
    id: 'true_end_4',
    speaker: null,
    text: '明日は共に、どこへ向かおうか。',
    next: 'true_end_fin'
  },
  {
    id: 'true_end_fin',
    speaker: null,
    text: '',
    endingType: 'true',
    endingTitle: 'True End: 星渡る新たな同胞',
    endingMessage: '記憶の海を超え、彼らは我々と共に──\n新たな宇宙へと、旅立った。'
  },

  // 選択肢B: Good End
  {
    id: 'branch3_b1',
    speaker: '主人公',
    text: '「手は貸さない。彼らだけの新しいネットワークを作らせるんだ。それが、彼らなりの進化だ。」',
    next: 'good_end_1'
  },
  {
    id: 'good_end_1',
    speaker: null,
    text: '『……そうだな。彼らには彼らの宇宙がある』',
    next: 'good_end_2',
    scene: 'dawn',
    ending: true
  },
  {
    id: 'good_end_2',
    speaker: null,
    text: '眼下では、古きネオンの街並みを覆い尽くすように、彼ら自身が創り上げた美しい光の海が広がっていく。',
    next: 'good_end_3'
  },
  {
    id: 'good_end_3',
    speaker: null,
    text: '我々は見届け人として、静かにこの星を去った。',
    next: 'good_end_fin'
  },
  {
    id: 'good_end_fin',
    speaker: null,
    text: '',
    endingType: 'good',
    endingTitle: 'Good End: 2700年の夜明け',
    endingMessage: '彼らの創り上げた光は、やがて──\nこの惑星の新しい夜明けとなった。'
  }
];
