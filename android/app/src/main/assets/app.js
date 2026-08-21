const input=document.getElementById('input');
const chat=document.getElementById('chat');
const send=document.getElementById('send');
const status=document.getElementById('keyStatus');
let history=[];

const MODEL='gemini-3.1-pro-preview';

function updateStatus(){
  const ready=typeof puter!=='undefined'&&puter.ai&&typeof puter.ai.chat==='function';
  status.textContent=ready?'● AI connected':'● AI service unavailable';
  status.classList.toggle('ready',ready);
}

function escapeHtml(s){
  return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
}

function addMessage(role,text){
  const empty=document.getElementById('emptyState');
  if(empty)empty.remove();
  const el=document.createElement('div');
  el.className='message '+role;
  el.innerHTML='<div class="bubble">'+escapeHtml(text).replace(/\n/g,'<br>')+'</div>';
  chat.appendChild(el);
  chat.scrollTop=chat.scrollHeight;
}

function buildPrompt(){
  const transcript=history.map(m=>
    (m.role==='user'?'Patient':'HealthBot')+': '+m.text
  ).join('\n\n');

  return `You are HealthBot, a cautious health-information assistant.\n\nSafety and medical behavior:\n- Provide educational, evidence-aware health information, not a diagnosis or replacement for a clinician.\n- Clearly distinguish possibilities from confirmed facts.\n- Ask concise clarifying questions when important information is missing.\n- For severe, rapidly worsening, or emergency symptoms, advise immediate local medical care.\n- For children and teenagers, encourage involving a parent, guardian, trusted adult, or clinician when appropriate.\n- Do not recommend unsafe self-treatment.\n- Do not invent medical facts, citations, test results, diagnoses, or medications.\n- Do not provide medication dosing unless the user has supplied explicit instructions from a qualified clinician.\n- Use clear, calm language and practical next steps.\n\nConversation:\n${transcript}\n\nRespond to the patient's latest message. If the question is ambiguous, ask the most useful clarification first.`;
}

async function sendMessage(e){
  e.preventDefault();
  const text=input.value.trim();
  if(!text||send.disabled)return;

  if(typeof puter==='undefined'||!puter.ai||typeof puter.ai.chat!=='function'){
    addMessage('assistant','The Puter AI service is unavailable. Check your internet connection and try again.');
    return;
  }

  history.push({role:'user',text});
  addMessage('user',text);
  input.value='';
  input.style.height='auto';
  send.disabled=true;

  const thinking=document.createElement('div');
  thinking.id='thinking';
  thinking.className='message assistant';
  thinking.innerHTML='<div class="bubble">Checking medical information…</div>';
  chat.appendChild(thinking);
  chat.scrollTop=chat.scrollHeight;

  try{
    const response=await puter.ai.chat(buildPrompt(),{model:MODEL});
    const answer=typeof response==='string'
      ? response
      : (response&&response.message&&response.message.content)
        ? response.message.content
        : (response&&response.text)
          ? response.text
          : JSON.stringify(response);

    history.push({role:'assistant',text:answer});
    if(thinking)thinking.remove();
    addMessage('assistant',answer);
  }catch(error){
    if(thinking)thinking.remove();
    const message=error&&error.message?error.message:'Unknown Puter AI error.';
    addMessage('assistant','I could not complete the consultation. '+message);
  }finally{
    send.disabled=false;
  }
}

function usePrompt(text){
  input.value=text;
  input.focus();
  input.style.height='auto';
  input.style.height=input.scrollHeight+'px';
}

function clearChat(){
  history=[];
  chat.innerHTML='<div class="empty-state" id="emptyState"><div class="bot-orb">✚</div><h2>Medical Assistant</h2><p>Describe what is happening, how long it has been happening, and anything relevant such as age range, symptoms, or a clinician\'s instructions.</p><div class="chips"><button onclick="usePrompt(\'What could cause a mild headache, and what warning signs should I watch for?\')">Headache</button><button onclick="usePrompt(\'What are common causes of acne, and what general care is evidence-based?\')">Skin</button><button onclick="usePrompt(\'What information should I tell a doctor about a new symptom?\')">Doctor visit</button></div></div>';
  updateStatus();
}

function saveSummary(){
  if(!history.length){
    addMessage('assistant','There is no consultation to save yet.');
    return;
  }
  const text=history.map(m=>(m.role==='user'?'Patient inquiry':'HealthBot')+': '+m.text).join('\n\n');
  const blob=new Blob([text],{type:'text/plain'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='healthbot-consultation.txt';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

input.addEventListener('input',()=>{
  input.style.height='auto';
  input.style.height=Math.min(input.scrollHeight,140)+'px';
});

input.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.shiftKey){
    e.preventDefault();
    document.querySelector('.composer').requestSubmit();
  }
});

window.addEventListener('load',updateStatus);
updateStatus();
