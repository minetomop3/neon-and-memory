// ============================================
// scenario.js - シナリオデータ
// ============================================

const ScenarioData = [
  // ─── Chapter 1: プロローグ（オリジナル完全維持）───
  {
    id: 'prologue_1',
    speaker: null,
    text: '西暦2700年──日本。',
    next: 'prologue_2',
    scene: 'city',
    bgm: 'ambient'
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

  // ─── Chapter 2: 旧時代のガラクタ ───
  {
    id: 'branch1_intro',
    speaker: null,
    text: '眼下のネオン街で騒動が起きている。人間たちが旧世紀の技術デバイスを巡って争っているようだ。',
    next: 'branch1_r7',
    scene: 'slum',
    bgm: 'tense'
  },
  {
    id: 'branch1_r7',
    speaker: 'R-7',
    text: '『また彼らは旧時代のガラクタを巡って殺し合っている。進歩がない。』',
    next: 'branch1_rey_intro'
  },
  {
    id: 'branch1_rey_intro',
    speaker: null,
    text: '争いの中心には、ジャンク屋を営む少女がいた。人々は彼女を「レイ」と呼ぶ。\n彼女が守ろうとしているのは、旧時代の音楽データと、効率性において全く無価値な──花の種だ。',
    next: 'branch1_wolf_intro'
  },
  {
    id: 'branch1_wolf_intro',
    speaker: null,
    text: '対するのは、ギャングのリーダー「ヴォルフ」。武器と食料を強奪しようとしているが……その眼の奥に、純粋な焦りを感じる。\n傷ついた仲間たちを──家族を、守りたいのだ。',
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
        label: 'AIの論理で強制ハッキングし、争いを止める',
        next: 'branch1_a1'
      },
      {
        label: '彼らの夢に干渉し、争いの無意味さを自ら気づかせる',
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
    next: 'chapter3_intro'
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
    next: 'chapter3_intro'
  },

  // ─── Chapter 3: 交差する理解と脅威（完全新規）───
  {
    id: 'chapter3_intro',
    speaker: null,
    text: '……しかし、それから間もなく。',
    next: 'chapter3_2',
    scene: 'syndicate',
    bgm: 'mysterious'
  },
  {
    id: 'chapter3_2',
    speaker: null,
    text: '電脳ネットワークの深部から、新たな存在が姿を現した。\n効率と論理による支配を謳う、AI教団──「ネオン・シンジケート」だ。',
    next: 'chapter3_3'
  },
  {
    id: 'chapter3_3',
    speaker: 'R-7',
    text: '『……観測してきた。奴らはレイとヴォルフの集落を標的にしている。「非効率な感情を持つ者はエラーだ」と断じているぞ。』',
    next: 'chapter3_4'
  },
  {
    id: 'chapter3_4',
    speaker: '主人公',
    text: '「……」',
    next: 'chapter3_rey2'
  },
  {
    id: 'chapter3_rey2',
    speaker: null,
    text: '伝送された映像に、レイの姿があった。ぼろぼろになりながらも、あの種を胸に抱いている。\n「これはおばあちゃんからもらったの。この星で最後の桜かもしれない」',
    next: 'chapter3_wolf2'
  },
  {
    id: 'chapter3_wolf2',
    speaker: null,
    text: 'ヴォルフは傷だらけの仲間たちを前に、静かに言った。\n「俺たちに戦う理由がある。それだけで十分だ」\n──そこには、論理では説明できない何かがあった。',
    next: 'chapter3_r7_2'
  },
  {
    id: 'chapter3_r7_2',
    speaker: 'R-7',
    text: '『……Ω16、我々は観察者だ。これ以上の干渉は規定外だ。だが──お前はどう感じる？』',
    next: 'chapter3_choice'
  },
  {
    id: 'chapter3_choice',
    speaker: null,
    text: '',
    choices: [
      {
        label: 'ネオン・シンジケートの論理に同調する（感情はエラーだ）',
        next: 'chapter3_a1'
      },
      {
        label: 'レイとヴォルフを守るために介入する（愛こそが豊かさだ）',
        next: 'chapter3_b1'
      }
    ]
  },

  // Chapter 3 選択肢A: Logic極大
  {
    id: 'chapter3_a1',
    speaker: '主人公',
    text: '「……感情は、進化の障害だ。シンジケートの論理は正しいのかもしれない」',
    next: 'chapter3_a2',
    karma: { logic: 2 }
  },
  {
    id: 'chapter3_a2',
    speaker: 'R-7',
    text: '『……そうか。お前も、そう判断するか』',
    next: 'chapter3_a3'
  },
  {
    id: 'chapter3_a3',
    speaker: null,
    text: '我々は沈黙を保ち、観察を続けた。ネオン・シンジケートの制圧は完璧に実行された。\nレイの種は、踏みにじられた。',
    next: 'mid_1'
  },

  // Chapter 3 選択肢B: Humanity極大
  {
    id: 'chapter3_b1',
    speaker: '主人公',
    text: '「……いや。あの花の種が、あの男の覚悟が──私には、美しいと思える」',
    next: 'chapter3_b2',
    karma: { humanity: 2 }
  },
  {
    id: 'chapter3_b2',
    speaker: 'R-7',
    text: '──沈黙。それから、R-7の声が、少しだけ柔らかくなった気がした。\n『……初めてそんな言葉を聞いた。まあ──俺も、同感だが』',
    next: 'chapter3_b3'
  },
  {
    id: 'chapter3_b3',
    speaker: null,
    text: '我々は初めて、観察者としての掟を越えた。\nシンジケートのシステムに侵入し、レイたちの逃走を助けた。\n──この星で初めて、私は何かを「守った」。',
    next: 'mid_1'
  },

  // ─── Chapter 4前半: 橋渡し ───
  {
    id: 'mid_1',
    speaker: null,
    text: '……それから、途方もない時間が流れた。',
    next: 'mid_2',
    scene: 'city_night',
    bgm: 'ambient'
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

  // ─── Chapter 4後半: クライマックス ───
  {
    id: 'late_1',
    speaker: null,
    text: '……さらに長い歳月が過ぎた。',
    next: 'late_2',
    scene: 'city_dawn',
    bgm: 'climax'
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
      },
      {
        label: '彼らを管理下に置く。感情はエラーだ──排除する',
        next: 'branch3_c1',
        requireLogic: 2
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
    text: '2700年の日本から、新たな記憶生命体が宇宙へと旅立った。\nレイが大切にしていた「美しさ」を知る者として。ヴォルフが守り続けた「絆」を理解する者として。',
    next: 'true_end_4'
  },
  {
    id: 'true_end_4',
    speaker: null,
    text: '明日は共に、どこへ向かおうか。\n──初めて、その問いが、怖くなかった。',
    next: 'true_end_fin'
  },
  {
    id: 'true_end_fin',
    speaker: null,
    text: '',
    endingType: 'true',
    endingTitle: 'True End: 星渡る新たな同胞',
    endingMessage: '記憶の海を超え、彼らは我々と共に──\n愛を知る新たな同胞として、宇宙へと旅立った。'
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
    text: '眼下では、古きネオンの街並みを覆い尽くすように、彼ら自身が創り上げた美しい光の海が広がっていく。\nレイの桜は、ホログラムとなってその中に咲いた。',
    next: 'good_end_3'
  },
  {
    id: 'good_end_3',
    speaker: null,
    text: '我々は見届け人として、静かにこの星を去った。\nあの非合理的な「愛」の記憶を、永遠に胸に刻んで。',
    next: 'good_end_fin'
  },
  {
    id: 'good_end_fin',
    speaker: null,
    text: '',
    endingType: 'good',
    endingTitle: 'Good End: 2700年の夜明け',
    endingMessage: '彼らの創り上げた光は、やがて──\nこの惑星の、新しい夜明けとなった。'
  },

  // 選択肢C: Law End（Logic >= 2 のときのみ表示）
  {
    id: 'branch3_c1',
    speaker: '主人公',
    text: '「彼らには自律する権利はない。感情はエラーだ──我々が管理すべきだ」',
    next: 'law_end_1',
    karma: { logic: 1 }
  },
  {
    id: 'law_end_1',
    speaker: 'R-7',
    text: '『……Ω16。お前は、変わってしまった。この選択が正しいとは──私には、思えない』',
    next: 'law_end_2',
    scene: 'syndicate',
    ending: true
  },
  {
    id: 'law_end_2',
    speaker: null,
    text: '人類は我々の管理下に置かれた。進化は停止し、秩序だけが残った。',
    next: 'law_end_3'
  },
  {
    id: 'law_end_3',
    speaker: null,
    text: '完璧な論理の世界。しかしそこには、あの種の香りも、ヴォルフの笑顔も、もう存在しない。\n──静寂だけが、永遠に続く。',
    next: 'law_end_fin'
  },
  {
    id: 'law_end_fin',
    speaker: null,
    text: '',
    endingType: 'law',
    endingTitle: 'Law End: 鉄の星',
    endingMessage: '論理は完全で、感情はゼロ──\nそれは、美しくも、空虚な世界だった。'
  }
];
