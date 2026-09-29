import{r as e}from"./env.ChiNoBrB.js";import{$ as t,O as n,Sn as r,V as i,a,b as o,et as s,i as c,it as l,l as u,nn as d,nt as f,tn as p,un as m,vn as h,yn as g}from"./three.core.mSza925M.js";var _=`
attribute vec3 aTo;
attribute vec4 aRand;
uniform float uTime, uMix, uIntro, uMouseForce, uMouseRadius, uFlow, uTurb, uSize, uPR, uYaw, uPitch, uAlpha, uTwinkle;
uniform vec3 uMouse, uIntroScale, uIntroOffset;
varying vec3 vAbs;
varying float vA;
varying float vBig;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
vec3 flowNoise(vec3 p){ return vec3(snoise(p), snoise(p+vec3(17.1,3.7,9.2)), snoise(p+vec3(-8.3,31.7,4.4))); }
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.0,-s, 0.0,1.0,0.0, s,0.0,c); }
mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.0,0.0,0.0, 0.0,c,s, 0.0,-s,c); }

void main(){
  // kaydırmaya bağlı, parçacık başına gecikmeli geçiş
  float delay = aRand.x * 0.45;
  float m = clamp((uMix - delay) / 0.55, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  vec3 pos = mix(position, aTo, m);
  pos = rotX(uPitch) * rotY(uYaw) * pos;
  // açılış: ekrana yayılmış buluttan toplanır (bulut ekranın ortasında)
  vec3 introPos = (aRand.yzw - 0.5) * uIntroScale + uIntroOffset;
  float intro = clamp(uIntro * 1.25 - aRand.x * 0.25, 0.0, 1.0);
  pos = mix(pos, introPos, intro * intro * (3.0 - 2.0 * intro));
  // akış gürültüsü: geçiş sırasında ve hızlı kaydırmada artar
  float transit = sin(m * 3.14159265);
  vec3 flow = flowNoise(pos * 0.16 + vec3(0.0, uTime * 0.07, aRand.y * 12.0));
  pos += flow * (uFlow + transit * uTurb * 1.6 + intro * 1.2) * (0.5 + aRand.w);
  // imleç itmesi: yalnız imleç hareket ederken güçlü
  vec2 d = pos.xy - uMouse.xy;
  float dist = length(d);
  float push = (1.0 - smoothstep(0.0, uMouseRadius, dist)) * uMouseForce;
  pos.xy += (d / max(dist, 1e-4)) * push * (0.55 + aRand.z * 0.9) * 1.7;
  pos.z += push * 2.4 * aRand.w;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  // boyut çeşitliliği: çoğu ince, ~%22 orta, ~%6 iri ve yumuşak
  float hsh = fract(aRand.z * 53.17);
  float big = step(0.94, hsh);
  float mid = step(0.72, hsh) * (1.0 - big);
  float base = mix(0.5 + aRand.z * 0.55, 3.6 + fract(aRand.z * 91.3) * 3.6, big) + mid * 1.1;
  vBig = big;
  gl_PointSize = base * uSize * uPR * (26.0 / -mv.z) * (1.0 + push * 1.2);
  // renk (emilim): derin mavi → açık camgöbeği; itilen ve geçişteki parçacıklar açılır, kıvılcımlar koyu
  float spark = step(0.94, aRand.y);
  vec3 deep = vec3(0.9, 0.64, 0.1);
  vec3 lite = vec3(0.62, 0.2, 0.0);
  float c = clamp(aRand.z * 0.6 + (pos.y + 5.0) / 14.0 * 0.35 + push * 0.9 + transit * 0.35 - spark * 0.6, 0.0, 1.0);
  vAbs = mix(deep, lite, c);
  // ışıltı: yavaş ve küçük genlikli (yanıp sönmez)
  float twinkle = 0.6 + 0.6 * uTwinkle * sin(uTime * (0.5 + aRand.z * 1.2) + aRand.y * 40.0);
  vA = (0.066 + aRand.w * 0.045) * twinkle * (1.0 + push * 1.4 + spark * 1.6) * mix(1.0, 0.55, big) * (1.0 - intro * 0.35) * uAlpha;
}
`,v=`
varying vec3 vAbs;
varying float vA;
varying float vBig;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r2 = dot(c, c) * 4.0;
  float r = sqrt(r2);
  float disc = 1.0 - smoothstep(0.6, 1.0, r);
  float a = mix(disc, disc * 0.7 + exp(-r2 * 2.2) * 0.35, vBig) * vA;
  gl_FragColor = vec4(vAbs * a, 1.0);
}
`,y=`
attribute vec3 aR;
uniform float uTime, uPR, uDrift, uTwinkle;
uniform vec2 uPar;
varying float vA;
void main(){
  vec3 p = position;
  float depth = clamp((-p.z - 4.0) / 36.0, 0.0, 1.0);
  // yakındaki toz yukarı süzülür ve kaydırmayla kayar
  p.y = mod(p.y + uTime * (0.15 + aR.z * 0.35) * (1.0 - depth) + uDrift * (1.0 - depth) * 6.0 + 22.0, 44.0) - 22.0;
  p.x += sin(uTime * 0.2 + aR.x * 20.0) * 0.4 * (1.0 - depth);
  p.xy += uPar * (1.0 - depth) * 1.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float big = step(0.93, aR.x);
  gl_PointSize = mix(0.8 + aR.x * 1.2, 2.6 + aR.y * 2.8, big) * uPR * (1.0 + (1.0 - depth) * 0.6);
  float tw = 0.55 + 0.55 * uTwinkle * sin(uTime * (0.4 + aR.y * 0.9) + aR.x * 40.0);
  vA = (0.2 + big * 0.18) * tw * (1.0 - depth * 0.55);
}
`,b=`
varying float vA;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c) * 2.0;
  float a = (1.0 - smoothstep(0.45, 1.0, r)) * vA;
  gl_FragColor = vec4(vec3(0.62, 0.42, 0.12) * a, 1.0);
}
`,x=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,S=`
uniform sampler2D tSrc;
uniform vec2 uTexel;
uniform vec2 uDir;
varying vec2 vUv;
void main(){
  vec4 c = texture2D(tSrc, vUv) * 0.2270;
  c += (texture2D(tSrc, vUv + uDir * uTexel * 1.3846) + texture2D(tSrc, vUv - uDir * uTexel * 1.3846)) * 0.3162;
  c += (texture2D(tSrc, vUv + uDir * uTexel * 3.2308) + texture2D(tSrc, vUv - uDir * uTexel * 3.2308)) * 0.0703;
  gl_FragColor = c;
}
`,C=`
uniform sampler2D tMain, t1, t2, t3;
uniform vec2 uCenter;
uniform float uAspect, uHaze, uHazeScale, uFade, uOpacity;
varying vec2 vUv;
void main(){
  vec3 a = texture2D(tMain, vUv).rgb;
  vec3 g = texture2D(t1, vUv).rgb * 0.55 + texture2D(t2, vUv).rgb * 0.45 + texture2D(t3, vUv).rgb * 0.5;
  vec3 A = (a * 1.25 + g * 0.22) * uFade;
  A = A / (1.0 + A * 0.35);
  vec3 T = exp(-A * 1.9);
  vec2 q = (vUv - uCenter) * vec2(uAspect, 1.0) / max(uHazeScale, 0.05);
  float haze = exp(-dot(q, q) * 3.2) * 0.05 * uHaze * uFade;
  T *= mix(vec3(1.0), vec3(0.78, 0.9, 1.0), haze);
  // titreşim (dither): sisin yumuşak geçişi 8 bitte halka halka görünmesin
  float dn = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  T = clamp(T + (dn - 0.5) / 255.0 * step(1e-4, 1.0 - min(T.r, min(T.g, T.b))), 0.0, 1.0);
  float al = clamp(1.0 - min(T.r, min(T.g, T.b)), 0.0, 1.0);
  gl_FragColor = vec4(T - (1.0 - al), al) * uOpacity;
}
`,w=3,T=class{main;comp;levels;blur;quad;blurScene=new p;compScene=new p;cam=new t(-1,1,1,-1,0,1);size=new h;clear=new u;bw=0;bh=0;constructor(e){let t={type:e.extensions.has(`EXT_color_buffer_float`)||e.extensions.has(`EXT_color_buffer_half_float`)?n:m,depthBuffer:!1,stencilBuffer:!1};this.main=new r(1,1,t),this.levels=Array.from({length:w},()=>({a:new r(1,1,t),b:new r(1,1,t)})),this.quad=new f(2,2),this.blur=new d({uniforms:{tSrc:{value:null},uTexel:{value:new h},uDir:{value:new h}},vertexShader:x,fragmentShader:S,blending:0,depthTest:!1,depthWrite:!1}),this.comp=new d({uniforms:{tMain:{value:this.main.texture},t1:{value:this.levels[0].b.texture},t2:{value:this.levels[1].b.texture},t3:{value:this.levels[2].b.texture},uCenter:{value:new h(.7,.5)},uAspect:{value:1},uHaze:{value:1},uHazeScale:{value:1},uFade:{value:1},uOpacity:{value:1}},vertexShader:x,fragmentShader:C,blending:0,depthTest:!1,depthWrite:!1});let a=new i(this.quad,this.blur),o=new i(this.quad,this.comp);a.frustumCulled=!1,o.frustumCulled=!1,this.blurScene.add(a),this.compScene.add(o)}compile(e,t,n){let r=e.getRenderTarget();e.setRenderTarget(this.main);let i=e.compileAsync(t,n),a=e.compileAsync(this.blurScene,this.cam);e.setRenderTarget(null);let o=e.compileAsync(this.compScene,this.cam);return e.setRenderTarget(r),Promise.all([i,a,o])}setSize(e,t){this.bw=e,this.bh=t,this.main.setSize(e,t),this.levels.forEach((n,r)=>{let i=2<<r,a=Math.max(1,e/i|0),o=Math.max(1,t/i|0);n.a.setSize(a,o),n.b.setSize(a,o)})}pass(e,t,n,r,i){let a=this.blur.uniforms;a.tSrc.value=t,a.uTexel.value.set(1/n.width,1/n.height),a.uDir.value.set(r,i),e.setRenderTarget(n),e.render(this.blurScene,this.cam)}render(e,t,n,r,i){let a=Math.max(1,Math.round(r.w*i)),o=Math.max(1,Math.round(r.h*i));(a!==this.bw||o!==this.bh)&&this.setSize(a,o),e.getClearColor(this.clear);let s=e.getClearAlpha();e.setScissorTest(!1),e.setClearColor(0,0),e.setRenderTarget(this.main),e.clear(!0,!1,!1),e.render(t,n);let c=this.main.texture;for(let t of this.levels)this.pass(e,c,t.a,1,0),this.pass(e,t.a.texture,t.b,0,1),c=t.b.texture;let l=this.comp.uniforms;l.uAspect.value=r.w/Math.max(1,r.h),e.setRenderTarget(null),e.getSize(this.size);let u=this.size.y-(r.y+r.h);e.setViewport(r.x,u,r.w,r.h),e.setScissor(r.x,u,r.w,r.h),e.setScissorTest(!0),e.render(this.compScene,this.cam),e.setScissorTest(!1),e.setClearColor(this.clear,s)}dispose(){this.main.dispose(),this.levels.forEach(e=>{e.a.dispose(),e.b.dispose()}),this.quad.dispose(),this.blur.dispose(),this.comp.dispose()}},E=e=>e<0?0:e>1?1:e;function D(e,t,n=.9,r=.55){let i=Math.max(1,t),a=0;for(let t=1;t<e.length;t++)a+=E((i*n-e[t])/(i*r));return a}function O(e,t,n=!1){if(t<=1||!Number.isFinite(e))return{a:0,b:0,mix:0};let r=Math.min(Math.max(e,0),t-1);if(n){let e=Math.round(r);return{a:e,b:e,mix:0}}let i=Math.min(Math.floor(r),t-1),a=Math.min(i+1,t-1);return{a:i,b:a,mix:i===a?0:r-i}}function k(e,t,n){let r=0;e[0]===t?r=0:(e[1]===t||e[0]===n&&t!==n)&&(r=1);let i=+(r===0),a=[];return e[r]!==t&&a.push({slot:r,name:t}),t!==n&&e[i]!==n&&a.push({slot:i,name:n}),{from:r,fills:a}}function A(e,t=2.8,n=.2){let r=E((e-n)/t);return 1-(r<.5?4*r*r*r:1-(-2*r+2)**3/2)}var j=95e3/1260.25;function M(e,t,n){let r=Math.max(1,e)*t*t/Math.max(1,n*n);return Math.min(2.2,Math.max(1,j/r))}function N(e,t){return 1-(1-e)**(Math.max(0,t)*60)}var P=[`sphere`,`bars`,`orbits`,`lattice`,`galaxy`,`ring`];function F(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var I={sphere:(e,t)=>{let n=new Float32Array(e*3);for(let r=0;r<e;r++){let e=t()*2-1,i=t()*Math.PI*2,a=t()<.6?3.4+(t()-.5)*.18:3.3*Math.cbrt(t()),o=Math.sqrt(1-e*e);n[r*3]=a*o*Math.cos(i),n[r*3+1]=a*e,n[r*3+2]=a*o*Math.sin(i)}return n},bars:(e,t)=>{let n=new Float32Array(e*3),r=[2.2,4,3,5.6,4.6,7];for(let i=0;i<e;i++){let e=i%6,a=(t()-.5)*1.1,o=t()*r[e],s=(t()-.5)*1.1;t()<.6&&(t()<.5?a=Math.sign(a)*.55:s=Math.sign(s)*.55),n[i*3]=e*1.7-4.25+a,n[i*3+1]=o-3.4,n[i*3+2]=s}return n},orbits:(e,t)=>{let n=new Float32Array(e*3),r=[2.4,3.6,4.8],i=[.25,1,-.7],a=[0,1.1,2.2];for(let o=0;o<e;o++){let e=o%5;if(e>=3){let e=t()*2-1,r=t()*Math.PI*2,i=Math.cbrt(t()),a=Math.sqrt(1-e*e);n[o*3]=i*a*Math.cos(r),n[o*3+1]=i*e,n[o*3+2]=i*a*Math.sin(r);continue}let s=t()*Math.PI*2,c=.18+t()*t()*.5,l=Math.cos(s)*r[e]+(t()-.5)*c,u=(t()-.5)*c,d=Math.sin(s)*r[e]+(t()-.5)*c,f=Math.cos(i[e]),p=Math.sin(i[e]),m=u*f-d*p,h=u*p+d*f,g=Math.cos(a[e]),_=Math.sin(a[e]);n[o*3]=l*g+h*_,n[o*3+1]=m,n[o*3+2]=-l*_+h*g}return n},lattice:(e,t)=>{let n=new Float32Array(e*3),r=[-3,0,3],i=()=>(t()-.5)*.18*t();for(let a=0;a<e;a++){let e=a%3,o=r[Math.floor(t()*3)],s=r[Math.floor(t()*3)],c=(t()-.5)*6,l=a*3;e===0?(n[l]=c,n[l+1]=o+i(),n[l+2]=s+i()):e===1?(n[l]=o+i(),n[l+1]=c,n[l+2]=s+i()):(n[l]=o+i(),n[l+1]=s+i(),n[l+2]=c)}return n},galaxy:(e,t)=>{let n=new Float32Array(e*3),r=.9,i=Math.cos(r),a=Math.sin(r);for(let r=0;r<e;r++){let e=r%3,o=t()**.7,s=.5+o*5.6,c=o*5.2+Math.PI*2/3*e+(t()-.5)*.5*(1-o*.5),l=Math.cos(c)*s,u=Math.sin(c)*s,d=(t()-.5)*.5*(1.2-o);n[r*3]=l,n[r*3+1]=d*i-u*a,n[r*3+2]=d*a+u*i}return n},ring:(e,t)=>{let n=new Float32Array(e*3);for(let r=0;r<e;r++){let e=t(),i=t()*Math.PI*2,a=r*3;if(e<.72){let e=3.6+(t()-.5)*.9*t()*t();n[a]=Math.cos(i)*e,n[a+1]=Math.sin(i)*e,n[a+2]=(t()-.5)*.5*t()}else{let e=3.4*t()**.6,r=i+e*.9;n[a]=Math.cos(r)*e,n[a+1]=Math.sin(r)*e,n[a+2]=-t()*1.2}}return n}},L={sphere:101,bars:202,orbits:303,lattice:404,galaxy:505,ring:606};function R(e,t){return I[e](Math.max(0,Math.floor(t)),F(L[e]))}function z(e,t=20260927){let n=F(t),r=new Float32Array(Math.max(0,Math.floor(e))*4);for(let e=0;e<r.length;e++)r[e]=n();return r}var B=24,V=38,H=.055,U={1:1.5,2:1.75},W=1.2,G={sphere:{yaw:.4,pitch:0,sway:.6},bars:{yaw:.45,pitch:.12,sway:.3},orbits:{yaw:.2,pitch:0,sway:.5},lattice:{yaw:.55,pitch:.28,sway:.35},galaxy:{yaw:.15,pitch:0,sway:.4},ring:{yaw:0,pitch:0,sway:.3}},K=class{id=`energy`;section;scene=new p;camera=new s(V,1,.1,200);tier;count;reduced;sequence;geometry=new a;slots;labels=[null,null];shapes=new Map;material;points;starGeometry=new a;starMaterial;stars;glow;u;su;anchor={x:.72,y:.5,s:1};anchorTarget={x:.72,y:.5,s:1};progress=0;fromSlot=0;mouse=new h(0,0);mouseSeen=!1;lastMove=-10;mouseTarget=new g(99,99,0);velIn=0;vel=0;drift=0;time=0;introOn;introStart=-1;ready=!1;fade;disposed=!1;hold=!1;height=1;drawnSig=``;constructor(t,n,r,i={}){this.section=t,this.tier=r,this.reduced=e.reduced,this.count=Math.max(1e3,Math.floor(i.count??(r===2?95e3:4e4))),this.sequence=[...i.sequence?.length?i.sequence:P],this.introOn=!this.reduced&&i.intro!==!1,this.fade=+!!this.reduced,this.camera.position.set(0,0,B);let a=this.count;this.slots=[new c(new Float32Array(a*3),3),new c(new Float32Array(a*3),3)],this.slots.forEach(e=>e.setUsage(o)),this.geometry.setAttribute(`position`,this.slots[0]),this.geometry.setAttribute(`aTo`,this.slots[1]),this.geometry.setAttribute(`aRand`,new c(z(a),4)),this.bind(0),this.u={uTime:{value:0},uMix:{value:0},uIntro:{value:+!!this.introOn},uIntroScale:{value:new g(14,9,6)},uIntroOffset:{value:new g},uMouse:{value:new g(99,99,0)},uMouseForce:{value:0},uMouseRadius:{value:2.4},uFlow:{value:.05},uTurb:{value:this.reduced?0:.45},uSize:{value:r===1?1.2:1},uPR:{value:1},uYaw:{value:G[this.sequence[0]].yaw},uPitch:{value:G[this.sequence[0]].pitch},uAlpha:{value:1},uTwinkle:{value:this.reduced?0:.15}};let s={blending:5,blendEquation:100,blendSrc:201,blendDst:201,depthTest:!1,depthWrite:!1,transparent:!0};this.material=new d({uniforms:this.u,vertexShader:_,fragmentShader:v,...s}),this.points=new l(this.geometry,this.material),this.points.frustumCulled=!1;let u=r===2?2800:1200,f=F(7331),p=new Float32Array(u*3),m=new Float32Array(u*3);for(let e=0;e<u;e++)p[e*3]=(f()-.5)*70,p[e*3+1]=(f()-.5)*44,p[e*3+2]=-4-f()*36,m[e*3]=f(),m[e*3+1]=f(),m[e*3+2]=f();this.starGeometry.setAttribute(`position`,new c(p,3)),this.starGeometry.setAttribute(`aR`,new c(m,3)),this.su={uTime:this.u.uTime,uPR:this.u.uPR,uTwinkle:this.u.uTwinkle,uPar:{value:new h},uDrift:{value:0}},this.starMaterial=new d({uniforms:this.su,vertexShader:y,fragmentShader:b,...s}),this.stars=new l(this.starGeometry,this.starMaterial),this.stars.frustumCulled=!1,this.scene.add(this.stars,this.points),this.glow=new T(n),this.glow.compile(n,this.scene,this.camera).catch(()=>void 0).then(()=>{this.ready=!0,this.warm()})}warm(){let e=this.sequence.filter(e=>!this.shapes.has(e)),t=window.requestIdleCallback,n=()=>{e.length&&(t?t(r,{timeout:1500}):setTimeout(r,100))},r=()=>{let t=e.shift();!this.disposed&&t&&(this.shape(t),n())};n()}setAnchor(e,t=!1){this.anchorTarget.x=e.x,this.anchorTarget.y=e.y,this.anchorTarget.s=e.s,(t||this.reduced)&&(this.anchor.x=e.x,this.anchor.y=e.y,this.anchor.s=e.s)}setHold(e){this.hold=e}setVeil(e){let t=Number.isFinite(e)?1-Math.min(1,Math.max(0,e)):1;this.glow.comp.uniforms.uOpacity.value=t}setProgress(e){Number.isFinite(e)&&(this.progress=e)}setMouse(e,t){this.mouse.set(e,t),this.mouseSeen=!0,this.lastMove=this.time}setScrollVelocity(e){Number.isFinite(e)&&(this.velIn=e)}get current(){return this.sequence[O(this.progress,this.sequence.length,!0).a]}resize(e,t){this.height=t,this.camera.aspect=e/Math.max(1,t),this.camera.updateProjectionMatrix()}shape(e){let t=this.shapes.get(e);return t||(t=R(e,this.count),this.shapes.set(e,t)),t}bind(e){let t=this.sequence.length-1,n=this.sequence[Math.min(e,t)],r=this.sequence[Math.min(e+1,t)],i=k(this.labels,n,r);for(let e of i.fills){let t=this.slots[e.slot];t.array.set(this.shape(e.name)),t.needsUpdate=!0,this.labels[e.slot]=e.name}i.from!==this.fromSlot&&(this.fromSlot=i.from,this.geometry.setAttribute(`position`,this.slots[i.from]),this.geometry.setAttribute(`aTo`,this.slots[+(i.from===0)]))}update(e,t,n){if(!this.ready||this.disposed||this.hold)return;this.time+=t;let r=this.u,i=this.reduced;this.introOn&&(this.introStart<0&&(this.introStart=this.time),r.uIntro.value=A(this.time-this.introStart),r.uIntro.value<=0&&(this.introOn=!1));let a=O(this.progress,this.sequence.length,i);this.bind(a.a),r.uMix.value=a.mix;let o=Math.min(1,t*3.2),s=this.anchor,c=this.anchorTarget;s.x+=(c.x-s.x)*o,s.y+=(c.y-s.y)*o,s.s+=(c.s-s.s)*o;let l=48*Math.tan(V*Math.PI/360),u=l*this.camera.aspect,d=Math.max(1e-4,s.s*H*l),f=(s.x-.5)*u,p=(.5-s.y)*l;this.points.position.set(f,p,0),this.points.scale.setScalar(d),this.points.visible=s.y>-.4&&s.y<1.4&&s.s>.01,r.uIntroScale.value.set(u*1.2/d,l*1.2/d,6),r.uIntroOffset.value.set(-f/d,-p/d,0);let m=this.velIn;this.velIn*=.5**(t*12),this.vel+=(Math.abs(m)-this.vel)*N(.2,t),i||(r.uTurb.value+=(.45+Math.min(this.vel*.0022,1.4)-r.uTurb.value)*N(.08,t),this.drift+=m*t/Math.max(1,this.height)*.25,this.su.uDrift.value+=(this.drift-this.su.uDrift.value)*N(.1,t),r.uTime.value=this.time);let h=G[this.sequence[a.a]],g=G[this.sequence[a.b]],_=a.mix*a.mix*(3-2*a.mix),v=i?0:Math.sin(this.time*.13)*(h.sway+(g.sway-h.sway)*_);r.uYaw.value=h.yaw+(g.yaw-h.yaw)*_+v,r.uPitch.value=h.pitch+(g.pitch-h.pitch)*_;let y=!i&&this.mouseSeen&&this.time-this.lastMove<W;if(this.mouseTarget.set((this.mouse.x*u*.5-f)/d,(this.mouse.y*l*.5-p)/d,0),this.mouseSeen&&r.uMouse.value.lerp(this.mouseTarget,N(.14,t)),r.uMouseForce.value+=((y?.75:0)-r.uMouseForce.value)*N(.06,t),!i&&this.mouseSeen){let e=this.su.uPar.value,n=y?1:.4;e.x+=(this.mouse.x*n-e.x)*N(.05,t),e.y+=(this.mouse.y*n-e.y)*N(.05,t)}r.uAlpha.value=M(this.count,r.uSize.value,s.s*H*this.height);let b=this.glow.comp.uniforms;b.uCenter.value.set(s.x,1-s.y),b.uHazeScale.value=s.s,b.uHaze.value=+!!this.points.visible,this.fade=Math.min(1,this.fade+t/.8),b.uFade.value=1-(1-this.fade)**3}frameSig(){let e=this.u,t=this.glow.comp.uniforms,n=t.uCenter.value,r=this.points,i=[e.uMix.value,e.uYaw.value,e.uPitch.value,e.uAlpha.value,e.uIntro.value,r.position.x,r.position.y,r.scale.x,this.camera.aspect,n.x,n.y,t.uHazeScale.value,t.uHaze.value,t.uFade.value,t.uOpacity.value];return`${+this.ready}${+this.hold}${+this.disposed}${+r.visible}${this.fromSlot}|${this.labels.join(`,`)}|${i.map(e=>e.toFixed(5)).join(`,`)}`}needsRender(){return!this.reduced||this.frameSig()!==this.drawnSig}render(e,t){if(this.reduced&&(this.drawnSig=this.frameSig()),!this.ready||this.disposed||this.hold)return;let n=Math.min(e.getPixelRatio(),U[this.tier]);this.u.uPR.value=n,this.glow.render(e,this.scene,this.camera,t,n)}dispose(){this.disposed=!0,this.geometry.dispose(),this.material.dispose(),this.starGeometry.dispose(),this.starMaterial.dispose(),this.glow.dispose(),this.shapes.clear()}};export{P as ENERGY_SHAPES,K as EnergyChapter,R as energyShape,D as sectionProgress,O as segmentAt};