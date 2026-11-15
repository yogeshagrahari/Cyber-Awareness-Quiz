const vertexShader = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const fragmentShader = `
precision mediump float;
uniform vec2 uResolution;
uniform vec2 uRotation;
uniform float uTime;
uniform float uMotion;
float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
mat3 rotateY(float a) { float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
mat3 rotateX(float a) { float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5*uResolution) / min(uResolution.x, uResolution.y) * 2.0;
  float r2 = dot(p,p);
  float dist = sqrt(r2);
  float halo = exp(-max(dist-0.87,0.0)*15.0) * (1.0-smoothstep(0.91,1.22,dist)) * 0.16;
  if (dist > 1.16) { gl_FragColor = vec4(0.10,0.68,0.85,halo); return; }
  float z = sqrt(max(0.0001,1.0-r2));
  vec3 n = normalize(vec3(p.x, -p.y, z));
  float spin = uRotation.x + uTime*uMotion*0.075;
  n = rotateX(uRotation.y) * rotateY(spin) * n;
  float lat = asin(clamp(n.y,-1.0,1.0));
  float lon = atan(n.z,n.x);
  float latLine = 1.0-smoothstep(0.0,0.035,abs(sin(lat*8.0)));
  float lonLine = 1.0-smoothstep(0.0,0.025,abs(sin(lon*10.0)*cos(lat)));
  float grid = max(latLine*0.45,lonLine*0.50);
  vec3 lightDir = normalize(vec3(-0.45,0.55,0.78));
  float diffuse = 0.28 + 0.72*max(dot(n,lightDir),0.0);
  float rim = pow(1.0-max(n.z,0.0),2.0);
  float landA = sin(lon*2.7+sin(lat*3.1))*cos(lat*4.1+lon*0.7);
  float landB = sin(lon*5.2-lat*2.4)*cos(lat*2.8+lon*3.0);
  float land = smoothstep(0.22,0.68,landA*0.56+landB*0.44);
  vec3 ocean = vec3(0.025,0.105,0.205);
  vec3 continent = vec3(0.045,0.25,0.32);
  vec3 col = mix(ocean,continent,land*0.42);
  col *= diffuse;
  col += vec3(0.10,0.73,0.86)*grid*0.72;
  col += vec3(0.08,0.36,0.58)*rim*0.22;
  vec3 nodes[5];
  nodes[0]=normalize(vec3(-0.58,0.36,0.72));
  nodes[1]=normalize(vec3(0.42,0.18,0.89));
  nodes[2]=normalize(vec3(0.08,-0.58,0.81));
  nodes[3]=normalize(vec3(0.72,-0.22,0.66));
  nodes[4]=normalize(vec3(-0.16,0.73,0.67));
  float nodeGlow=0.0;
  for(int i=0;i<5;i++) {
    float d=dot(n,nodes[i]);
    nodeGlow += exp(-pow((1.0-d)*95.0,2.0));
  }
  col += vec3(0.20,0.92,1.0)*nodeGlow*0.92;
  float edge = (1.0-smoothstep(0.91,1.0,dist));
  float alpha = max(edge,halo);
  gl_FragColor = vec4(col,alpha);
}`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(message || 'Shader compile failed');
  }
  return shader;
}

let activeFrame = null;
export function initGlobe(canvas, fallback, reducedMotion = false) {
  if (activeFrame !== null) cancelAnimationFrame(activeFrame);
  const gl = canvas?.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) { canvas?.classList.add('hide'); fallback?.classList.remove('hide'); return false; }
  try {
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Program link failed');
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const resolution = gl.getUniformLocation(program,'uResolution');
    const rotation = gl.getUniformLocation(program,'uRotation');
    const time = gl.getUniformLocation(program,'uTime');
    const motion = gl.getUniformLocation(program,'uMotion');
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    let rx = 0, ry = -0.08, dragging = false, lastX = 0, lastY = 0, lastTime = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width*dpr));
      const height = Math.max(1, Math.round(rect.height*dpr));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0,0,width,height); gl.uniform2f(resolution,width,height);
    };
    const onDown = e => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture?.(e.pointerId); };
    const onMove = e => { if (!dragging) return; const dx=e.clientX-lastX, dy=e.clientY-lastY; rx += dx*0.006; ry = Math.max(-0.9,Math.min(0.9,ry+dy*0.006)); lastX=e.clientX; lastY=e.clientY; if (reducedMotion) draw(0); };
    const onUp = () => { dragging = false; };
    canvas.addEventListener('pointerdown',onDown); canvas.addEventListener('pointermove',onMove);
    canvas.addEventListener('pointerup',onUp); canvas.addEventListener('pointercancel',onUp);
    canvas.setAttribute('aria-hidden','true');
    const draw = ms => {
      resize();
      gl.uniform2f(rotation,rx,ry); gl.uniform1f(time,ms/1000); gl.uniform1f(motion,reducedMotion?0:1);
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES,0,6);
      if (!reducedMotion) activeFrame = requestAnimationFrame(draw);
      else activeFrame = null;
    };
    resize(); draw(0);
    if (reducedMotion) { /* static, draggable frame */ }
    fallback?.classList.add('hide'); canvas.classList.remove('hide');
    return true;
  } catch (error) {
    console.warn('WebGL globe unavailable; using 2D fallback.', error);
    canvas.classList.add('hide'); fallback?.classList.remove('hide');
    return false;
  }
}
