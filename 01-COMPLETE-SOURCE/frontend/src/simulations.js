/**
 * CYBERAWARE 3D interactive defensive learning simulations.
 * All tasks use fictional training data. No password, OTP, token or personal data is collected.
 */
export const SIMULATION_DEFS = [
  {
    id: 'phishing', title: 'Phishing inspection', level: 'Beginner',
    objective: 'Identify multiple independent indicators before deciding whether an email is trustworthy.',
    description: 'Inspect a fictional supplier notification. Select only evidence-based warning signs; branding and polished language are not proof of legitimacy.',
    sceneLabel: 'MESSAGE ANALYSIS', references: ['[1]', '[6]', '[7]', '[25]'],
    questionIds: ['PHISH-B01', 'SENDER-B02', 'LINK-B03']
  },
  {
    id: 'password', title: 'Password security lab', level: 'Beginner',
    objective: 'Choose a long, unique authentication strategy and avoid password reuse.',
    description: 'Configure a fictional training profile. Do not enter or reuse a real password; this lab evaluates characteristics only.',
    sceneLabel: 'CREDENTIAL HYGIENE', references: ['[1]', '[16]'],
    questionIds: ['PASS-UNIQ-B04', 'PASS-MGR-B05', 'OTP-B06']
  },
  {
    id: 'mfa', title: 'MFA fatigue response', level: 'Intermediate',
    objective: 'Respond safely to unexpected repeated authentication prompts and suspected account compromise.',
    description: 'A user receives a stream of unrequested push notifications. Work through the response in the correct order.',
    sceneLabel: 'AUTHENTICATION DEFENSE', references: ['[16]', '[25]'],
    questionIds: ['MFA-FATIGUE-I05', 'ATO-I07', 'RESET-I13']
  },
  {
    id: 'incident', title: 'Incident response command', level: 'Advanced',
    objective: 'Prioritize safe containment, timely reporting and evidence preservation during a ransomware incident.',
    description: 'A workstation displays a ransomware note and unusual file activity. Choose the safest response sequence.',
    sceneLabel: 'INCIDENT CONTAINMENT', references: ['[17]', '[28]', '[35]'],
    questionIds: ['IR-PRIORITY-A05', 'RANSOM-A12', 'LOGS-A10']
  }
];

export const PHISHING_INDICATORS = [
  { id: 'sender', label: 'The actual sender domain differs from the supplier’s verified domain.', correct: true, why: 'A display name can be spoofed. Verify the full sending address against a trusted directory or known contact.' },
  { id: 'urgency', label: 'The message threatens account suspension unless action is taken within minutes.', correct: true, why: 'Artificial urgency is a common pressure tactic. Pause and verify through an independent, trusted channel.' },
  { id: 'link', label: 'The visible link text and the destination host do not match.', correct: true, why: 'A link label can conceal a different destination. Do not open it; navigate using a known bookmark or typed official address.' },
  { id: 'credential', label: 'The message asks the recipient to enter credentials through an unexpected email link.', correct: true, why: 'Unexpected credential requests are high-risk. Use the service’s known sign-in route and report the message.' },
  { id: 'logo', label: 'The email contains the supplier’s familiar logo.', correct: false, why: 'Logos are easy to copy. Their presence does not authenticate the sender.' },
  { id: 'grammar', label: 'The message is grammatically polished and has no spelling errors.', correct: false, why: 'Well-written messages can still be fraudulent. Poor grammar is neither necessary nor sufficient to identify phishing.' }
];

export const PASSWORD_DEFAULTS = Object.freeze({ length: 16, unique: true, manager: true, mfa: true });
export const PASSWORD_INITIAL_PROFILE = Object.freeze({ length: 12, unique: false, manager: false, mfa: false });
export function normalizeSimulationProgress(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  const clean = {};
  for (const sim of SIMULATION_DEFS) {
    const row = input[sim.id];
    if (!row || typeof row !== 'object' || Array.isArray(row)) continue;
    const attempts = Number.isSafeInteger(row.attempts) ? Math.max(0, Math.min(100000, row.attempts)) : 0;
    const score = Number.isFinite(row.bestScore) ? Math.max(0, Math.min(100, row.bestScore)) : 0;
    const timestamp = typeof row.completedAt === 'string' && !Number.isNaN(Date.parse(row.completedAt)) ? row.completedAt : null;
    clean[sim.id] = { completed: row.completed === true, attempts, bestScore: score, completedAt: timestamp };
  }
  return clean;
}

export function scorePasswordProfile(profile) {
  const checks = [
    { id: 'length', label: 'At least 16 characters or a long passphrase', passed: Number(profile.length) >= 16 },
    { id: 'unique', label: 'Unique for this account', passed: Boolean(profile.unique) },
    { id: 'manager', label: 'Stored in a reputable password manager', passed: Boolean(profile.manager) },
    { id: 'mfa', label: 'Protected with an appropriate MFA method', passed: Boolean(profile.mfa) }
  ];
  return { score: Math.round(checks.filter(c => c.passed).length / checks.length * 100), checks, ready: checks.every(c => c.passed) };
}

export const MFA_STEPS = [
  {
    prompt: 'A sign-in you did not initiate triggers repeated push notifications. What should you do first?',
    options: [
      { id: 'approve', label: 'Approve one prompt to make the notifications stop.', correct: false, feedback: 'Never approve an authentication request you did not initiate. Approval can grant an attacker access.' },
      { id: 'deny-report', label: 'Deny the request and report the unexpected prompts using the organization’s approved channel.', correct: true, feedback: 'Correct. Deny unexpected prompts and report the activity promptly. Do not engage with the requester.' },
      { id: 'ignore', label: 'Ignore the prompts but take no further action.', correct: false, feedback: 'Ignoring may stop the immediate interruption, but it does not alert the security team to a possible password compromise.' }
    ]
  },
  {
    prompt: 'The prompts stop, but you suspect someone knows your password. What is the safest next step?',
    options: [
      { id: 'official-reset', label: 'Use a known official route or contact IT from a trusted device to reset credentials and review/revoke active sessions.', correct: true, feedback: 'Correct. Use a trusted route, rotate the compromised credential and have sessions/tokens reviewed or revoked.' },
      { id: 'email-link', label: 'Follow the password-reset link in the notification email.', correct: false, feedback: 'Do not follow an unexpected link. It may lead to a credential-harvesting site.' },
      { id: 'reuse', label: 'Change the password to a familiar password used on another site.', correct: false, feedback: 'Password reuse allows a compromise on one service to affect another. Use a unique credential.' }
    ]
  },
  {
    prompt: 'What information should you provide when reporting the event?',
    options: [
      { id: 'share-otp', label: 'Send the security team your password and any OTPs so they can reproduce the event.', correct: false, feedback: 'Never share passwords, OTPs, recovery codes or session tokens. Responders do not need them.' },
      { id: 'preserve-report', label: 'Share the time, approximate number of prompts, device/context and any known sign-in alerts; preserve relevant notifications.', correct: true, feedback: 'Correct. Provide useful context and preserve evidence without sharing secrets.' },
      { id: 'delete-all', label: 'Delete all notifications and messages before reporting.', correct: false, feedback: 'Deleting evidence can hinder investigation. Follow approved reporting and evidence-handling guidance.' }
    ]
  }
];

export const INCIDENT_STEPS = [
  {
    prompt: 'A workstation displays a ransomware note and files are changing unexpectedly. What is the immediate defensive priority?',
    options: [
      { id: 'isolate', label: 'Isolate the affected device from wired and wireless networks according to the response procedure; do not reconnect it.', correct: true, feedback: 'Correct. Network isolation can limit spread. Follow the organization’s incident procedure and responder instructions.' },
      { id: 'pay', label: 'Pay the ransom immediately to stop the incident.', correct: false, feedback: 'Do not make payment decisions independently. Escalate to the incident-response and legal leadership teams.' },
      { id: 'wipe', label: 'Format the workstation to remove the malware.', correct: false, feedback: 'Wiping can destroy evidence and impede recovery. Wait for authorized incident responders.' },
      { id: 'email', label: 'Email the suspicious file to colleagues to ask whether they recognize it.', correct: false, feedback: 'Do not spread potentially malicious files. Use the approved reporting channel.' }
    ]
  },
  {
    prompt: 'After taking the approved isolation action, what should happen next?',
    options: [
      { id: 'report', label: 'Report immediately to the incident-response team through an approved channel, using a separate trusted device if needed.', correct: true, feedback: 'Correct. Rapid reporting enables coordinated containment, triage and communications.' },
      { id: 'social', label: 'Post screenshots and internal system details on public social media.', correct: false, feedback: 'Public disclosure can expose sensitive information and interfere with response. Use approved internal channels.' },
      { id: 'reboot', label: 'Repeatedly reboot the machine until normal operation returns.', correct: false, feedback: 'Unapproved changes may destroy volatile evidence or worsen the situation. Follow responder instructions.' }
    ]
  },
  {
    prompt: 'How should evidence and recovery be handled?',
    options: [
      { id: 'preserve', label: 'Record times and observed symptoms, preserve relevant evidence, and let authorized responders direct forensic and recovery actions.', correct: true, feedback: 'Correct. Preserve evidence and maintain a clear timeline. Reconnect or restore only when authorized.' },
      { id: 'delete', label: 'Delete the ransom note and logs to reduce panic.', correct: false, feedback: 'Do not destroy evidence. Preserve artefacts according to the incident-response procedure.' },
      { id: 'reconnect', label: 'Reconnect the workstation as soon as files appear stable.', correct: false, feedback: 'Apparent stability does not establish containment. Reconnection requires clearance from authorized responders.' }
    ]
  }
];

// A native WebGL wireframe scene. No external graphics library or network asset is required.
let activeAnimation = 0;
let activeObserver = null;
export function stopSimulationScene() {
  if (activeAnimation) cancelAnimationFrame(activeAnimation);
  activeAnimation = 0;
  if (activeObserver) activeObserver.disconnect();
  activeObserver = null;
}

export function buildSimulationGeometry(type) {
  const positions = [], colors = [];
  const segment = (a, b, color = [0.16, 0.82, 0.94]) => {
    positions.push(...a, ...b); colors.push(...color, ...color);
  };
  const cube = (cx, cy, cz, s, color) => {
    const h=s/2, v=[[-h,-h,-h],[h,-h,-h],[h,h,-h],[-h,h,-h],[-h,-h,h],[h,-h,h],[h,h,h],[-h,h,h]].map(p=>[p[0]+cx,p[1]+cy,p[2]+cz]);
    [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([a,b])=>segment(v[a],v[b],color));
  };
  const ring = (cx,cy,cz,r,axis,color) => {
    let prev=null; for(let i=0;i<=48;i++){const a=i/48*Math.PI*2;let p=axis==='x'?[cx,cy+Math.cos(a)*r,cz+Math.sin(a)*r]:axis==='y'?[cx+Math.cos(a)*r,cy,cz+Math.sin(a)*r]:[cx+Math.cos(a)*r,cy+Math.sin(a)*r,cz];if(prev)segment(prev,p,color);prev=p;}
  };
  const octa = (cx,cy,cz,s,color) => {
    const v=[[cx,cy+s,cz],[cx+s,cy,cz],[cx,cy,cz+s],[cx-s,cy,cz],[cx,cy,cz-s],[cx,cy-s,cz]];
    [[0,1],[0,2],[0,3],[0,4],[5,1],[5,2],[5,3],[5,4],[1,2],[2,3],[3,4],[4,1]].forEach(([a,b])=>segment(v[a],v[b],color));
  };
  const cyan=[0.18,0.83,0.95], purple=[0.56,0.43,0.98], green=[0.25,0.88,0.67], amber=[1,0.68,0.32];
  if(type==='phishing'){
    cube(0,0,0,1.6,cyan); segment([-0.8,0.8,0.81],[0,0.1,0.81],purple); segment([0.8,0.8,0.81],[0,0.1,0.81],purple);
    octa(1.22,0.92,0.25,0.33,amber); ring(0,0,0,1.45,'z',[0.12,0.46,0.62]);
  } else if(type==='password') {
    cube(0,-0.28,0,1.35,green); ring(0,0.75,0,0.54,'z',cyan); ring(0,0.75,0,0.54,'x',cyan); octa(0,-0.24,0.74,0.22,amber);
  } else if(type==='mfa') {
    octa(0,0,0,1.0,cyan); cube(-1.28,0.78,0,0.45,amber); cube(1.28,0.78,0,0.45,amber); cube(-1.28,-0.78,0,0.45,purple); cube(1.28,-0.78,0,0.45,purple);
    [[-1.28,0.78,0],[1.28,0.78,0],[-1.28,-0.78,0],[1.28,-0.78,0]].forEach(p=>segment([0,0,0],p,[0.24,0.52,0.68]));
    ring(0,0,0,1.75,'z',[0.16,0.49,0.67]);
  } else {
    cube(0,0,0,1.1,amber); cube(-1.45,0.83,0,0.5,cyan); cube(1.45,0.83,0,0.5,purple); cube(0,-1.18,0,0.5,green);
    [[-1.45,0.83,0],[1.45,0.83,0],[0,-1.18,0]].forEach(p=>segment([0,0,0],p,[0.36,0.52,0.72]));
    ring(0,0,0,1.8,'y',[0.16,0.4,0.56]);
  }
  return {positions:new Float32Array(positions),colors:new Float32Array(colors)};
}

export function initSimulationScene(canvas, type, reducedMotion = false) {
  stopSimulationScene();
  if (!canvas) return false;
  const fallback=canvas.parentElement?.querySelector('.scene-2d-fallback');
  let gl;
  try { gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'}); } catch { gl=null; }
  if(!gl){canvas.hidden=true;if(fallback)fallback.hidden=false;return false;}
  canvas.hidden=false;if(fallback)fallback.hidden=true;
  const vs=`attribute vec3 a_position; attribute vec3 a_color; uniform float u_angle; uniform float u_aspect; varying vec3 v_color; void main(){float cy=cos(u_angle),sy=sin(u_angle),cx=cos(u_angle*0.63),sx=sin(u_angle*0.63);vec3 p=a_position;float x=p.x*cy-p.z*sy;float z=p.x*sy+p.z*cy;float y=p.y*cx-z*sx;z=p.y*sx+z*cx;float depth=z+4.4;float f=2.45/depth;gl_Position=vec4(x*f/u_aspect,y*f,(depth-2.0)/8.0,1.0);v_color=a_color;}`;
  const fs=`precision mediump float; varying vec3 v_color; void main(){gl_FragColor=vec4(v_color,0.92);}`;
  const compile=(kind,src)=>{const sh=gl.createShader(kind);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;};
  try {
    const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vs));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
    const geometry=buildSimulationGeometry(type),pos=gl.createBuffer(),col=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,pos);gl.bufferData(gl.ARRAY_BUFFER,geometry.positions,gl.STATIC_DRAW);const pLoc=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(pLoc);gl.vertexAttribPointer(pLoc,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,col);gl.bufferData(gl.ARRAY_BUFFER,geometry.colors,gl.STATIC_DRAW);const cLoc=gl.getAttribLocation(program,'a_color');gl.enableVertexAttribArray(cLoc);gl.vertexAttribPointer(cLoc,3,gl.FLOAT,false,0,0);
    gl.useProgram(program);const angleLoc=gl.getUniformLocation(program,'u_angle'),aspectLoc=gl.getUniformLocation(program,'u_aspect');
    let angle=0,drag=false,lastX=0;
    canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;canvas.setPointerCapture?.(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(drag){angle+=(e.clientX-lastX)*0.009;lastX=e.clientX;if(reducedMotion)draw();}});
    canvas.addEventListener('pointerup',()=>{drag=false;});canvas.addEventListener('pointercancel',()=>{drag=false;});
    const resize=()=>{const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.6),w=Math.max(1,Math.floor(rect.width*dpr)),h=Math.max(1,Math.floor(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}gl.uniform1f(aspectLoc,w/h);};
    resize();activeObserver=new ResizeObserver(resize);activeObserver.observe(canvas);
    const draw=()=>{gl.clearColor(0.015,0.045,0.08,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(!reducedMotion&&!drag)angle+=0.0025;gl.uniform1f(angleLoc,angle);gl.drawArrays(gl.LINES,0,geometry.positions.length/3);if(!reducedMotion)activeAnimation=requestAnimationFrame(draw);};
    canvas.addEventListener('keydown',e=>{const delta=0.12;if(e.key==='ArrowLeft'||e.key==='ArrowRight'||e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();angle+=(e.key==='ArrowLeft'||e.key==='ArrowUp'?-delta:delta);if(reducedMotion)draw();}});
    draw();return true;
  } catch { canvas.hidden=true;if(fallback)fallback.hidden=false;return false; }
}
