'use strict';
// PERSONALIZE AQUI: textos e datas podem ser alterados sem mexer no HTML.
const CONFIG = {
  stars: [
    'Que você encontre motivos para sorrir até nos dias comuns.',
    'Algumas conversas deixam o dia mais leve.',
    'Que seus sonhos tenham sempre espaço para crescer.',
    'Há beleza em respeitar o tempo de cada pessoa.',
    'Os pequenos instantes também merecem ser lembrados.',
    'Que nunca faltem estrelas nas suas noites.'
  ],
  flowers: [
    ['🌷','Delicadeza também é uma forma de coragem.'],
    ['🌼','Seu jeito único merece ser celebrado.'],
    ['🌸','Florescer leva tempo, e tudo bem.'],
    ['🌻','Que a luz encontre você nos dias nublados.'],
    ['🪻','As coisas simples podem guardar grandes lembranças.']
  ],
  messages: {
    'Preciso de calma': ['Você não precisa resolver tudo hoje. Um passo de cada vez.','Descansar também faz parte de seguir em frente.'],
    'Quero sorrir': ['Um lembrete: pequenos momentos podem virar grandes histórias.','Hoje merece ao menos uma música bonita e um céu estrelado.'],
    'Sinto saudade': ['A distância não apaga as boas lembranças.','Que as memórias tragam aconchego, sem impedir novos capítulos.'],
    'Quero coragem': ['Você pode tentar de novo, no seu próprio ritmo.','A sua voz e suas escolhas importam.']
  },
  timeline: [
    {date:'Um dia especial',title:'O começo de uma história',text:'Substitua este texto pela lembrança que vocês escolherem guardar.'},
    {date:'Outro capítulo',title:'Uma conversa marcante',text:'Conte aqui o que tornou esse momento especial.'},
    {date:'O futuro',title:'Páginas ainda por escrever',text:'Que os próximos capítulos sejam vividos com leveza e respeito.'}
  ]
};
const $ = id => document.getElementById(id);
const store = {get(k,fallback){try{return JSON.parse(localStorage.getItem(k))??fallback}catch{return fallback}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}}};
const themeButton=$('theme');
function setTheme(night){document.body.classList.toggle('night',night);themeButton.textContent=night?'☀ Dia':'☾ Noite';themeButton.setAttribute('aria-label',night?'Ativar modo dia':'Ativar modo noite');store.set('lunari-theme',night?'night':'day')}
setTheme(store.get('lunari-theme', 'day')==='night');themeButton.addEventListener('click',()=>setTheme(!document.body.classList.contains('night')));
const sky=$('sky');CONFIG.stars.forEach((message,i)=>{const star=document.createElement('button');star.className='star';star.textContent=i%2?'✧':'✦';star.type='button';star.setAttribute('aria-label',`Abrir mensagem da estrela ${i+1}`);star.style.left=`${[13,28,48,69,84,55][i]}%`;star.style.top=`${[27,65,18,49,24,80][i]}%`;star.addEventListener('click',()=>{$('star-message').textContent=message});sky.append(star)});
const garden=$('garden');CONFIG.flowers.forEach(([symbol,message],i)=>{const flower=document.createElement('button');flower.type='button';flower.className='flower';flower.textContent=symbol;flower.setAttribute('aria-label',`Abrir mensagem da flor ${i+1}`);flower.addEventListener('click',()=>{$('flower-message').textContent=message});garden.append(flower)});
let activeMood=Object.keys(CONFIG.messages)[0],messageIndex=0;const moods=$('moods');function showMessage(){const list=CONFIG.messages[activeMood];$('mood-message').textContent=list[messageIndex%list.length];Array.from(moods.children).forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===activeMood)))}Object.keys(CONFIG.messages).forEach(mood=>{const button=document.createElement('button');button.type='button';button.className='small';button.textContent=mood;button.addEventListener('click',()=>{activeMood=mood;messageIndex=0;showMessage()});moods.append(button)});$('next-message').addEventListener('click',()=>{messageIndex++;showMessage()});showMessage();
CONFIG.timeline.forEach(item=>{const el=document.createElement('article');el.className='event';const date=document.createElement('time');date.textContent=item.date;const h=document.createElement('h3');h.textContent=item.title;const p=document.createElement('p');p.textContent=item.text;el.append(date,h,p);$('timeline').append(el)});
// A senha é apenas uma surpresa visual: em sites estáticos, o código pode ser inspecionado.
const capsuleAccess=$('capsule-access'),capsuleContent=$('capsule-content');
function setCapsuleAccess(open){capsuleAccess.hidden=open;capsuleContent.hidden=!open;if(!open){$('capsule-password').value='';$('capsule-error').textContent=''}}
capsuleAccess.addEventListener('submit',event=>{event.preventDefault();if($('capsule-password').value==='261026'){setCapsuleAccess(true)}else{$('capsule-error').textContent='Senha incorreta. Pense na nossa primeira chamada com um beijo. 🌙';$('capsule-password').value=''}});
$('capsule-lock').addEventListener('click',()=>setCapsuleAccess(false));setCapsuleAccess(false);
const dateInput=$('capsule-date');const localToday=()=>{const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`};dateInput.min=localToday();
const dialog=$('letter-dialog');$('close-dialog').addEventListener('click',()=>dialog.close());
function renderCapsules(){const list=$('capsule-list');list.replaceChildren();const capsules=store.get('lunari-capsules',[]);if(!capsules.length){const p=document.createElement('p');p.className='hint';p.textContent='Nenhuma carta guardada ainda.';list.append(p);return}capsules.forEach(item=>{const unlocked=localToday()>=item.date;const box=document.createElement('article');box.className='capsule';const info=document.createElement('div');const title=document.createElement('strong');title.textContent=(unlocked?'✉ ':'🔒 ')+item.title;const date=document.createElement('p');date.textContent='Abrir em '+item.date.split('-').reverse().join('/');info.append(title,date);const actions=document.createElement('div');actions.className='capsule-actions';if(unlocked){const open=document.createElement('button');open.className='small';open.textContent='Ler';open.addEventListener('click',()=>{$('dialog-title').textContent=item.title;$('dialog-text').textContent=item.text;dialog.showModal()});actions.append(open)}const remove=document.createElement('button');remove.className='small';remove.textContent='Excluir';remove.setAttribute('aria-label',`Excluir carta ${item.title}`);remove.addEventListener('click',()=>{if(confirm('Excluir esta carta deste navegador?')){store.set('lunari-capsules',store.get('lunari-capsules',[]).filter(c=>c.id!==item.id));renderCapsules()}});actions.append(remove);box.append(info,actions);list.append(box)})}
$('capsule-form').addEventListener('submit',event=>{event.preventDefault();const title=$('capsule-title').value.trim(),text=$('capsule-text').value.trim(),date=dateInput.value;if(!title||!text||date<localToday()){alert('Preencha todos os campos e escolha hoje ou uma data futura.');return}const capsules=store.get('lunari-capsules',[]);capsules.push({id:crypto.randomUUID?.()??String(Date.now()),title,text,date});if(!store.set('lunari-capsules',capsules)){alert('Não foi possível salvar neste navegador.');return}event.target.reset();renderCapsules()});renderCapsules();$('year').textContent=new Date().getFullYear();

// Galeria: imagens locais, ampliação por clique e fechamento acessível.
const photoDialog=$('photo-dialog');
const photoFull=$('photo-full');
document.querySelectorAll('.photo-card').forEach(card=>card.addEventListener('click',()=>{
  photoFull.src=card.dataset.full;
  photoFull.alt=card.dataset.caption;
  $('photo-caption').textContent=card.dataset.caption;
  photoDialog.showModal();
}));
$('close-photo').addEventListener('click',()=>photoDialog.close());
photoDialog.addEventListener('click',e=>{if(e.target===photoDialog)photoDialog.close()});
photoDialog.addEventListener('close',()=>photoFull.removeAttribute('src'));

// Navegação do carrossel; a ampliação das fotos continua disponível.
const gallery=$('photo-gallery'), photoCards=[...gallery.querySelectorAll('.photo-card')];
const prev=$('gallery-prev'),next=$('gallery-next'),counter=$('gallery-count');
function currentPhotoIndex(){const left=gallery.scrollLeft;let nearest=0,dist=Infinity;photoCards.forEach((card,i)=>{const d=Math.abs(card.offsetLeft-photoCards[0].offsetLeft-left);if(d<dist){dist=d;nearest=i}});return nearest}
function updateGallery(){const i=currentPhotoIndex();counter.textContent=`${i+1} de ${photoCards.length} fotografias`;prev.disabled=i===0;next.disabled=i===photoCards.length-1}
function moveGallery(direction){const i=Math.max(0,Math.min(photoCards.length-1,currentPhotoIndex()+direction));gallery.scrollTo({left:photoCards[i].offsetLeft-photoCards[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});setTimeout(updateGallery,400)}
prev.addEventListener('click',()=>moveGallery(-1));next.addEventListener('click',()=>moveGallery(1));
gallery.addEventListener('scroll',()=>requestAnimationFrame(updateGallery),{passive:true});
gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveGallery(e.key==='ArrowRight'?1:-1)}});
window.addEventListener('resize',updateGallery);updateGallery();

// Lunari 3.0 — recursos complementares, sem serviços externos.
const wishMessages=[
 'Que você encontre felicidade nas pequenas coisas.',
 'Que seus sonhos encontrem caminhos para florescer.',
 'Que nunca lhe faltem motivos para acreditar em si mesma.',
 'Que seus dias tenham espaço para descanso e alegria.',
 'Que cada nova estação traga possibilidades bonitas.',
 'Que você seja sempre respeitada nas suas escolhas.'
];
const wishTree=document.getElementById('wish-tree');
[[22,25],[40,14],[61,20],[76,38],[30,52],[58,58]].forEach(([x,y],i)=>{
 const leaf=document.createElement('button');leaf.type='button';leaf.className='wish-leaf';leaf.textContent='❧';leaf.style.left=x+'%';leaf.style.top=y+'%';leaf.setAttribute('aria-label','Ler desejo '+(i+1));leaf.addEventListener('click',()=>document.getElementById('wish-message').textContent=wishMessages[i]);wishTree.append(leaf);
});
document.querySelectorAll('[data-season]').forEach(btn=>btn.addEventListener('click',()=>{
 const season=btn.dataset.season;document.getElementById('garden').dataset.season=season;
 document.querySelectorAll('[data-season]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
}));document.querySelector('[data-season=spring]').click();
const bookPhotoCards=[...document.querySelectorAll(".photo-card")];let bookIndex=0;
function renderBook(){const card=bookPhotoCards[bookIndex];const img=document.getElementById('book-image');img.src=card.dataset.full;img.alt=card.dataset.caption;document.getElementById('book-counter').textContent=`${bookIndex+1} / ${bookPhotoCards.length}`;document.getElementById('book-verse').textContent=bookIndex===4?'Uma rosa, uma lembrança.': 'Uma página do nosso pequeno álbum de lembranças.';}
document.getElementById('book-prev').addEventListener('click',()=>{bookIndex=(bookIndex-1+bookPhotoCards.length)%bookPhotoCards.length;renderBook()});
document.getElementById('book-next').addEventListener('click',()=>{bookIndex=(bookIndex+1)%bookPhotoCards.length;renderBook()});renderBook();
const surprises=['Que seu sorriso encontre motivos para aparecer até nos dias mais simples.','Você não precisa ser forte o tempo todo. Que haja leveza e descanso quando precisar.','Que os próximos capítulos sejam escritos com liberdade, respeito e boas lembranças.'];
document.querySelectorAll('[data-letter]').forEach(btn=>btn.addEventListener('click',()=>{document.getElementById('surprise-message').textContent=surprises[Number(btn.dataset.letter)]}));
