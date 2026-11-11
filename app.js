'use strict';
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
window.matchMedia('(min-width:651px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
document.getElementById('year').textContent=String(new Date().getFullYear());

if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)document.querySelectorAll('.egg-alive animate').forEach(a=>a.remove());
const board=document.querySelector('.board');
if(board&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches&&'animate' in Element.prototype){
board.classList.add('is-live');
const EGG='<svg viewBox="0 0 64 64"><use href="#egg"/></svg>';
const foot={todo:'<span class="who"><span class="mini-av mini-po">PO</span>Project Owner</span><span class="ticket-status">Ready</span>',progress:'<span class="who"><span class="mini-av mini-gd">'+EGG+'</span>Game Developer</span><span class="ticket-status st-progress">Building</span>',done:'<span class="who"><span class="mini-av mini-gd">'+EGG+'</span>Game Developer</span><span class="ticket-status st-done">Done</span>'};
const WORK='<div class="ticket-work"><div class="work-bar"><i></i></div><div class="work-text"><span class="work-step">Reading the task</span><span class="work-dots" aria-hidden="true"><b></b><b></b><b></b></span></div></div>';
const steps=['Reading the task','Writing code','Testing in Unity','Fixing a bug','Checking the result'];
const pool=[['Levels','Lay out level 5'],['UI','Victory screen'],['Audio','Sound for big matches'],['Feature','Shuffle when stuck'],['UI','Daily reward popup'],['Gameplay','Tutorial for level 1'],['Animation','Booster burst effect'],['Levels','Tune level difficulty']];
let next=107,poolIndex=0,phase=0,stepIndex=1,visible=false;
const list=c=>board.querySelector('[data-col="'+c+'"] .col-list');
const logText=document.getElementById('board-log-text');
const status=a=>document.querySelector('.agent-status[data-agent="'+a+'"]');
function say(agent,text,busy){const el=status(agent);if(!el)return;el.textContent=text;el.classList.toggle('is-busy',!!busy);const card=el.closest('.board-agent');card.classList.remove('is-active');void card.offsetWidth;card.classList.add('is-active');setTimeout(()=>card.classList.remove('is-active'),1400);}
function setState(t,state){t.dataset.state=state;const w=t.querySelector('.ticket-work');if(w)w.remove();if(state==='progress'){t.querySelector('h4').insertAdjacentHTML('afterend',WORK);stepIndex=0;}t.querySelector('.ticket-foot').innerHTML=foot[state];}
function counts(){board.querySelectorAll('.board-col').forEach(col=>{col.querySelector('.col-count').textContent=col.querySelectorAll('.ticket').length;});}
function flip(mutate){const before=new Map([...board.querySelectorAll('.ticket')].map(el=>[el,el.getBoundingClientRect()]));mutate();counts();board.querySelectorAll('.ticket').forEach(el=>{const a=before.get(el),b=el.getBoundingClientRect();if(!a){el.animate([{opacity:0,transform:'translateY(-10px) scale(.97)'},{opacity:1,transform:'none'}],{duration:450,easing:'ease-out'});return;}const dx=a.left-b.left,dy=a.top-b.top;if(dx||dy)el.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});});}
function key(t){return t.querySelector('.ticket-key').textContent;}
function step(){
if(phase===0){const t=list('progress').querySelector('.ticket');if(t){const k=key(t);flip(()=>{list('done').prepend(t);const d=list('done').querySelectorAll('.ticket');if(d.length>3)d[d.length-1].remove();});setTimeout(()=>setState(t,'done'),650);logText.textContent='Game Developer finished '+k+' and moved it to Done.';say('gd','Finished '+k,false);setTimeout(()=>say('team','Reviewing '+k,true),700);}}
else if(phase===1){const t=list('todo').querySelector('.ticket');if(t){const k=key(t);flip(()=>{list('progress').append(t);});setTimeout(()=>setState(t,'progress'),650);logText.textContent='Game Developer picked up '+k+' and started building.';say('gd','Working on '+k,true);}}
else{const [tag,title]=pool[poolIndex++%pool.length];const k='EGG-'+next++;const t=document.createElement('article');t.className='ticket';t.innerHTML='<div class="ticket-top"><span class="ticket-key">'+k+'</span><span class="ticket-tag">'+tag+'</span></div><h4>'+title+'</h4><div class="ticket-foot"></div>';setState(t,'todo');flip(()=>list('todo').append(t));logText.textContent='Project Owner added '+k+' to To Do.';say('po','Added '+k,true);setTimeout(()=>{const el=status('po');if(el){el.textContent='Planning the next task';el.classList.remove('is-busy');}},1600);}
phase=(phase+1)%3;}
function work(){const el=board.querySelector('.ticket[data-state=progress] .work-step');if(el&&stepIndex<steps.length-1){stepIndex++;el.textContent=steps[stepIndex];}}
if('IntersectionObserver' in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting;}).observe(board);else visible=true;
setInterval(()=>{if(visible&&!document.hidden)step();},2200);
setInterval(()=>{if(visible&&!document.hidden)work();},900);}
