(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const stories = [
    {title:"Let's play!",panel:1,en:['Lemon is near a tree.','The rabbit and the kangaroo can run and jump.'],zh:['Lemon 在一棵树附近。','兔子和袋鼠会跑，也会跳。'],words:['rabbit','kangaroo','run','jump','near'],alt:'黑短发、绿上衣的 Lemon 在树附近，兔子和袋鼠跑跳着玩小红球。'},
    {title:'Oh no!',panel:2,en:['The rabbit and the kangaroo lose the ball.','It falls into the water.'],zh:['兔子和袋鼠弄丢了球。','球掉进了水里。'],words:['lose','fall'],alt:'小红球从岸边掉进水里，兔子和袋鼠惊讶地看着。'},
    {title:'Look up!',panel:3,en:['The bear can climb the tree.','The parrot can fly above the bear.'],zh:['熊会爬树。','鹦鹉会在熊的上方飞。'],words:['bear','climb','parrot','fly','above'],alt:'熊正在爬树，一只鹦鹉在熊的上方飞。'},
    {title:'Who is below?',panel:4,en:['The bat is below the parrot.','The rabbit can hide behind the tree.'],zh:['蝙蝠在鹦鹉的下方。','兔子可以躲在树后面。'],words:['bat','below','hide','behind'],alt:'鹦鹉在高处树枝上，蝙蝠挂在它下方的树枝，兔子躲在树干后面。'},
    {title:'Across the path',panel:5,en:['The panda is opposite the lion.','They are looking for the ball.'],zh:['熊猫在狮子的对面。','它们正在找球。'],words:['panda','opposite','lion'],alt:'熊猫与狮子在小路两侧，同一高度，隔着小路面对面。'},
    {title:'We can help!',panel:6,en:['The whale is near the dolphin.','We can move the ball!'],zh:['鲸鱼在海豚附近。','我们可以把球移过去！'],words:['whale','near','dolphin','move'],alt:'鲸鱼在海豚附近游泳，海豚把小红球推向岸边。'},
    {title:'Here it is!',panel:7,en:['The penguin can walk to the ball.','Here it is!'],zh:['企鹅可以走到球旁边。','球在这里！'],words:['penguin','walk'],alt:'企鹅在沙滩上走向海边的小红球，身后留下一串脚印。'},
    {title:'Together again',panel:8,en:['The ball is between Lemon and the rabbit.',"Let's play!"],zh:['球在 Lemon 和兔子之间。','我们一起玩吧！'],words:['between','rabbit'],alt:'Lemon 在左，兔子在右，小红球在它们之间，袋鼠和企鹅在旁边。'}
  ];
  const groups = [
    {title:'动物朋友',label:'10 ANIMALS',words:[['bat','蝙蝠'],['bear','熊'],['parrot','鹦鹉'],['kangaroo','袋鼠'],['rabbit','兔子'],['panda','熊猫'],['lion','狮子'],['whale','鲸鱼'],['penguin','企鹅'],['dolphin','海豚']]},
    {title:'动一动，说一说',label:'9 ACTIONS',words:[['run','跑'],['climb','爬'],['jump','跳'],['hide','躲藏'],['lose','丢失'],['fall','落下'],['fly','飞'],['move','移动'],['walk','走']]},
    {title:'它们在哪里？',label:'6 PREPOSITIONS',words:[['near','在……附近'],['above','在……上方'],['below','在……下方'],['behind','在……后面'],['opposite','在……对面'],['between','在……之间']]}
  ];
  const questions = [
    {panel:4,prompt:'The bat is ___ the parrot.',zh:'蝙蝠在鹦鹉的哪里？',options:['below','opposite','near'],answer:'below',explain:'蝙蝠比鹦鹉低，在它的下方，所以用 below。'},
    {panel:5,prompt:'The panda is ___ the lion.',zh:'熊猫在狮子的哪里？',options:['below','behind','opposite'],answer:'opposite',explain:'它们隔着小路面对面，所以用 opposite。'},
    {panel:4,prompt:'The parrot is ___ the bat.',zh:'这次换成鹦鹉：它在蝙蝠的哪里？',options:['below','above','between'],answer:'above',explain:'现在说的是鹦鹉，它比蝙蝠高，所以用 above。'},
    {panel:6,prompt:'The whale is ___ the dolphin.',zh:'鲸鱼和海豚靠得很近，用哪个词？',options:['near','opposite','behind'],answer:'near',explain:'鲸鱼就在海豚附近，所以用 near。'},
    {panel:4,prompt:'The rabbit is ___ the tree.',zh:'树干挡住了兔子，它躲在哪里？',options:['above','below','behind'],answer:'behind',explain:'兔子躲在树干后面，所以用 behind。'},
    {panel:8,prompt:'The ball is ___ Lemon and the rabbit.',zh:'球在 Lemon 和兔子的哪里？',options:['near','between','opposite'],answer:'between',explain:'Lemon 在一边，兔子在另一边，球在它们之间，所以用 between。'}
  ];
  const vocabulary = new Set(groups.flatMap(g => g.words.map(w => w[0])).concat(['falls']));
  const speakerIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>';
  let page = 0, view = 'story', showChinese = true, hiddenEnglish = false, questionIndex = 0, answered = false, utterance = null;
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  function art(el, index, alt) {
    el.style.backgroundPosition = `${index % 3 * 50}% ${Math.floor(index / 3) * 50}%`;
    el.setAttribute('aria-label', alt);
  }
  function sentence(text) {
    const p = document.createElement('p'); p.lang = 'en';
    text.split(/(\b[a-zA-Z]+\b)/).forEach(part => {
      if (vocabulary.has(part.toLowerCase())) { const b = document.createElement('strong'); b.textContent = part; p.append(b); }
      else p.append(document.createTextNode(part));
    });
    return p;
  }
  function stopAudio() {
    const previous = utterance;
    utterance = null;
    if (previous) { previous.onend = null; previous.onerror = null; }
    if (canSpeak) window.speechSynthesis.cancel();
    $('readPage').classList.remove('speaking');
    $('readPage').innerHTML = '<span aria-hidden="true">▶</span> 朗读这一页';
  }
  function say(text, onPage = false) {
    stopAudio();
    $('audioStatus').textContent = '';
    if (!canSpeak) { $('audioStatus').textContent = '当前浏览器不支持朗读，可以和家长一起读。'; return; }
    utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-US'; utterance.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => /^en[-_]US$/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
    if (voice) utterance.voice = voice;
    if (onPage) { $('readPage').classList.add('speaking'); $('readPage').innerHTML = '<span aria-hidden="true">■</span> 停止朗读'; }
    utterance.onend = () => { stopAudio(); $('audioStatus').textContent = ''; };
    utterance.onerror = e => { if (e.error !== 'canceled' && e.error !== 'interrupted') $('audioStatus').textContent = '当前设备暂时无法朗读，可以和家长一起读。'; stopAudio(); };
    window.speechSynthesis.speak(utterance);
  }
  function renderStory() {
    stopAudio(); const cover = page === 0; const s = stories[page - 1];
    $('book').classList.toggle('cover', cover);
    $('storyTitle').replaceChildren();
    if (cover) $('storyTitle').innerHTML = 'Where Is<br>the <span class="red">Red Ball?</span>';
    else $('storyTitle').textContent = s.title;
    $('coverChinese').hidden = !cover || !showChinese;
    $('storyLines').replaceChildren(); $('storyChinese').replaceChildren(); $('storyWords').replaceChildren();
    art($('storyArt'), cover ? 0 : s.panel, cover ? '黑短发、绿上衣的 Lemon 和兔子、袋鼠一起坐在海边的树旁，小红球在身边。' : s.alt);
    if (cover) { const p = document.createElement('p'); p.textContent = '8页短故事 · 19个词 · 一起看图学方位'; $('storyLines').append(p); }
    else {
      s.en.forEach(line => $('storyLines').append(sentence(line)));
      s.zh.forEach(line => { const p = document.createElement('p'); p.textContent = line; $('storyChinese').append(p); });
      s.words.forEach(word => { const tag = document.createElement('span'); tag.lang = 'en'; tag.textContent = word; $('storyWords').append(tag); });
    }
    $('storyChinese').hidden = !showChinese;
    $('pageLabel').textContent = cover ? '封面 · 8页故事' : `${String(page).padStart(2, '0')} / 08`;
    $('prevPage').disabled = cover;
    $('nextPage').textContent = cover ? '开始读 →' : page === stories.length ? '去练习 →' : '下一页 →';
    $('toggleChinese').textContent = showChinese ? '中文已显示' : '显示中文';
    $('toggleChinese').setAttribute('aria-pressed', String(showChinese));
    $('pageDots').replaceChildren();
    for (let n = 0; n <= stories.length; n++) {
      const b = document.createElement('button'); b.type = 'button';
      b.setAttribute('aria-label', n === 0 ? '封面' : `故事第${n}页`);
      if (n === page) b.setAttribute('aria-current', 'page');
      b.addEventListener('click', () => navigate('story', n)); $('pageDots').append(b);
    }
  }
  function navigate(nextView, nextPage = page, updateHash = true) {
    stopAudio(); view = ['story','words','quiz'].includes(nextView) ? nextView : 'story';
    page = Math.max(0, Math.min(stories.length, Number(nextPage) || 0));
    ['story','words','quiz'].forEach(name => $(name + 'View').hidden = name !== view);
    document.querySelectorAll('[data-view]').forEach(b => { if (b.dataset.view === view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    if (view === 'story') renderStory();
    if (view === 'quiz') renderQuiz();
    if (updateHash) history.replaceState(null, '', view === 'story' ? `#story-${page}` : '#' + view);
  }
  function buildWords() {
    groups.forEach(g => {
      const group = document.createElement('section'); group.className = 'word-group';
      const h = document.createElement('h2'); h.textContent = g.title;
      const small = document.createElement('span'); small.textContent = g.label; h.append(small); group.append(h);
      const grid = document.createElement('div'); grid.className = 'word-grid';
      g.words.forEach(([en,zh]) => {
        const card = document.createElement('div'); card.className = 'word-card';
        const english = document.createElement('span'); english.className = 'word-en'; english.lang = 'en'; english.textContent = en;
        const chinese = document.createElement('span'); chinese.className = 'word-zh'; chinese.textContent = zh;
        const b = document.createElement('button'); b.className = 'listen-word'; b.type = 'button'; b.innerHTML = speakerIcon;
        b.setAttribute('aria-label', '朗读 ' + en); b.addEventListener('click', () => say(en));
        b.disabled = !canSpeak; card.append(english,chinese,b); grid.append(card);
      });
      group.append(grid); $('wordGroups').append(group);
    });
  }
  function renderQuiz() {
    const q = questions[questionIndex]; answered = false;
    $('quizProgress').textContent = `${questionIndex + 1} / ${questions.length}`;
    $('quizPrompt').textContent = q.prompt; $('quizChinese').textContent = q.zh;
    art($('quizArt'), q.panel, stories.find(s => s.panel === q.panel).alt);
    $('quizFeedback').textContent = ''; $('nextQuiz').disabled = true;
    $('nextQuiz').textContent = questionIndex === questions.length - 1 ? '完成练习 →' : '下一题 →';
    $('quizOptions').replaceChildren(); $('quizFinish').hidden = true;
    q.options.forEach(option => {
      const b = document.createElement('button'); b.type = 'button'; b.lang = 'en'; b.textContent = option;
      b.addEventListener('click', () => {
        if (answered) return;
        if (option === q.answer) {
          answered = true; b.classList.add('correct'); $('quizFeedback').textContent = '对啦！' + q.explain;
          $('nextQuiz').disabled = false; $('quizOptions').querySelectorAll('button').forEach(x => x.disabled = true);
        } else { b.classList.add('try-again'); b.disabled = true; $('quizFeedback').textContent = '再看一看：' + q.zh; }
      });
      $('quizOptions').append(b);
    });
  }
  function fromHash() {
    const hash = location.hash.slice(1); const match = /^story-(\d+)$/.exec(hash);
    navigate(match ? 'story' : hash, match ? Number(match[1]) : page, false);
  }
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.view)));
  $('prevPage').addEventListener('click', () => { if (page > 0) navigate('story', page - 1); });
  $('nextPage').addEventListener('click', () => page < stories.length ? navigate('story', page + 1) : navigate('quiz'));
  $('toggleChinese').addEventListener('click', () => { showChinese = !showChinese; renderStory(); });
  $('readPage').disabled = !canSpeak;
  if (!canSpeak) { $('readPage').textContent = '请一起读'; $('readingNote').textContent = '当前浏览器不支持朗读，可以和家长一起看图读句子。'; }
  $('readPage').addEventListener('click', () => {
    if ($('readPage').classList.contains('speaking')) { stopAudio(); return; }
    say(page === 0 ? 'Where is the red ball?' : stories[page - 1].en.join(' '), true);
  });
  $('hideEnglish').addEventListener('click', () => {
    hiddenEnglish = !hiddenEnglish; $('wordGroups').classList.toggle('english-hidden', hiddenEnglish);
    $('hideEnglish').textContent = hiddenEnglish ? '显示英文' : '遮住英文'; $('hideEnglish').setAttribute('aria-pressed', String(hiddenEnglish));
    document.querySelectorAll('.word-en').forEach(el => el.setAttribute('aria-hidden', String(hiddenEnglish)));
  });
  $('nextQuiz').addEventListener('click', () => {
    if (!answered) return;
    if (questionIndex < questions.length - 1) { questionIndex++; renderQuiz(); }
    else { $('quizFinish').hidden = false; $('nextQuiz').disabled = true; $('quizFinish').scrollIntoView({block:'nearest',behavior:'smooth'}); }
  });
  $('restartQuiz').addEventListener('click', () => { questionIndex = 0; renderQuiz(); });
  $('backToStory').addEventListener('click', () => navigate('story', 0));
  document.addEventListener('keydown', e => { if (view !== 'story' || e.altKey || e.ctrlKey || e.metaKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; if (e.key === 'ArrowLeft' && page > 0) { e.preventDefault(); navigate('story', page - 1); } if (e.key === 'ArrowRight' && page < stories.length) { e.preventDefault(); navigate('story', page + 1); } });
  let touchStart = null;
  $('storyArt').addEventListener('touchstart', e => { if (e.touches.length === 1) touchStart = {x:e.touches[0].clientX,y:e.touches[0].clientY}; }, {passive:true});
  $('storyArt').addEventListener('touchend', e => { if (!touchStart || !e.changedTouches.length) return; const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y; touchStart=null; if (Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.5) { if(dx<0&&page<stories.length)navigate('story',page+1); else if(dx>0&&page>0)navigate('story',page-1); } }, {passive:true});
  window.addEventListener('hashchange', fromHash); window.addEventListener('pagehide', stopAudio);
  buildWords(); fromHash();
})();
