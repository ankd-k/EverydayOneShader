/*{
  audio: true,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform float volume;
uniform sampler2D samples;
uniform sampler2D spectrum;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}

mat2 rotate(float r){
  return mat2(cos(r), -sin(r), sin(r), cos(r));
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}


vec3 opRep(vec3 p, vec3 c){
  return mod(p, c)-0.5*c;
}

float dfSphere(vec3 p, float r){
  return length(p)-r;
}

float dfBox(vec3 p, vec3 b){
  return length(max(abs(p)-b, 0.));
}

float dfTorus(vec3 p, vec2 t){
  vec2 q = vec2(length(p.xz)-t.x, p.y);
  return length(q)-t.y;
}

float df(vec3 p){
  p = opRep(p, vec3(16.));
  p.yz *= rotate(time*0.76);
  for(int i=0;i<4;i++){
    p.zy *= rotate(time);
    p.xy *= rotate(time);
    p = abs(p);
  }
  p.x += sin(p.y*1.8);
  return dfBox(p, volume * vec3(0.05, 0.08, 0.02));
  // return dfBox(p, vec3(0.2+volume*0.05));
}

bool castRay(inout vec3 ro, inout vec3 rd){
  float minD = 0.;
  float maxD = 40.;
  float thr = 0.01;

  float d = minD;
  for(int i=0;i<24;i++){
    float tmp = df(ro + rd*d);
    if(tmp<thr){
      rd *= d;
      return true;
    }
    else if(maxD<tmp){
      return false;
    }
    d += tmp;
  }
  return false;
}

vec3 getNormal(vec3 p){
  float ep = 0.0001;
  return normalize(vec3(
      df(p+vec3(ep, 0., 0.))-df(p-vec3(ep, 0., 0.)),
      df(p+vec3(0., ep, 0.))-df(p-vec3(0., ep, 0.)),
      df(p+vec3(0., 0., ep))-df(p-vec3(0., 0., ep))
    ));
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  float rox = snoise(vec3(0., 0., time*0.023));
  float roy = snoise(vec3(10., 10., time*0.058));
  vec3 ro = vec3(20.*rox, 20.*roy, -time*10.);
  vec3 rd = normalize(vec3(p, -1.));
  rd.xy *= rotate(sin(time*0.2));

  if(castRay(ro, rd)){
    float d = length(rd);
    vec3 ip = ro+rd;

    vec3 normal = getNormal(ip);

    vec3 lightPos = vec3(snoise(vec3(0.1, 0.8, time)),
                        snoise(vec3(0.4, 1.2, time)),
                        snoise(vec3(10.1, 3.8, time))
    );
    vec3 lightDir = normalize(ip - lightPos);
    lightDir = vec3(1.0);

    float diff = dot(normal, lightDir);
    color += clamp(diff, 0.1, 1.0);
    // color += 1.;
  }else{
    float bg = length(p*2.);
    float pct = usin(time*0.2);
    bg = bg*pct + (1.-bg)*(1.-pct);
    color = vec3(bg);
  }

  gl_FragColor = vec4(color, 1.);
}
