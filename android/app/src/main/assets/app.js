const $ = (id) => document.getElementById(id);
const canvas = $('preview');
const ctx = canvas.getContext('2d');
let graph = [];
let raf = null;

const ACTIONS = [
  {name:'WALK', duration:1.6, x:0, y:0, scale:1, rot:0},
  {name:'STOP', duration:.6, x:.05, y:0, scale:1, rot:0},
  {name:'LOOK_BACK', duration:.8, x:.05, y:-.02, scale:1.02, rot:-.12},
  {name:'CAMERA_ORBIT', duration:1.8, x:.22, y:0, scale:1.08, rot:-.2}
];

function buildGraph(text) {
  const lower = text.toLowerCase();
  const result = [];
  if (lower.includes('walk') || lower.includes('move')) result.push(ACTIONS[0]);
  if (lower.includes('stop')) result.push(ACTIONS[1]);
  if (lower.includes('look') || lower.includes('turn')) result.push(ACTIONS[2]);
  if (lower.includes('camera') || lower.includes('orbit')) result.push(ACTIONS[3]);
  if (!result.length) result.push({name:'IDLE',duration:2,x:0,y:0,scale:1,rot:0});
  return result;
}

function renderGraph() {
  const root = $('graph');
  root.innerHTML = graph.map((n,i) => `
    <div class="node">
      <strong>${n.name}</strong>
      <small>${n.duration.toFixed(1)}s · Δx ${n.x.toFixed(2)} · rot ${n.rot.toFixed(2)}</small>
    </div>${i < graph.length-1 ? '<div class="arrow">↓</div>' : ''}`).join('');
}

function draw(t) {
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#07090d'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(255,255,255,.07)';
  for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}

  const total=graph.reduce((a,n)=>a+n.duration,0);
  let time=(t/1000)%Math.max(total,.1);
  let elapsed=0, active=graph[0];
  for(const n of graph){ if(time<=elapsed+n.duration){active=n;break;} elapsed+=n.duration; }
  const local=Math.max(0,Math.min(1,(time-elapsed)/active.duration));
  const ease=local*local*(3-2*local);
  let px=.5, py=.52, scale=1, rot=0;
  const idx=graph.indexOf(active);
  for(let i=0;i<idx;i++){px+=graph[i].x; py+=graph[i].y; scale*=graph[i].scale; rot+=graph[i].rot;}
  px+=active.x*ease; py+=active.y*ease; scale*=1+(active.scale-1)*ease; rot+=active.rot*ease;

  ctx.save();
  ctx.translate(px*w,py*h); ctx.rotate(rot); ctx.scale(scale,scale);
  ctx.fillStyle='#d9dde6'; ctx.beginPath();ctx.arc(0,-58,25,0,Math.PI*2);ctx.fill();
  ctx.fillRect(-17,-32,34,92);
  ctx.fillStyle='#9aa4b5'; ctx.fillRect(-38,68,76,12);
  ctx.strokeStyle='#d9dde6';ctx.lineWidth=12;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(-55,38);ctx.moveTo(12,0);ctx.lineTo(55,38);ctx.moveTo(-10,88);ctx.lineTo(-30,140);ctx.moveTo(10,88);ctx.lineTo(30,140);ctx.stroke();
  ctx.restore();

  $('playhead').style.width=((time/Math.max(total,.1))*100)+'%';
  raf=requestAnimationFrame(draw);
}

$('plan').onclick=()=>{graph=buildGraph($('prompt').value);renderGraph();};
$('render').onclick=()=>{if(!graph.length){graph=buildGraph($('prompt').value);renderGraph();} if(!raf) raf=requestAnimationFrame(draw);};

graph=buildGraph($('prompt').value);renderGraph();raf=requestAnimationFrame(draw);
