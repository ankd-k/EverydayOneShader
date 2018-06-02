/*{
    "pixelRatio": .0,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define PI 3.14159265359

float random(vec2 n){
    return fract(sin(dot(n, vec2(12.9898,4.1414)))*43978.95789);
}

float usin(float x){
  return (sin(x)+1.)*0.5;
}

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

//-----------------------------------------------------------------------------

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }

vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v)
{
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
//-----------------------------------------------------------------------------
float Box(vec3 p, vec3 b){
  vec3 d = abs(p) - b;
  return min(max(d.x, max(d.y, d.z)),0.) + length(max(d, 0.));
}

float Box2(vec3 p, vec3 b){
    float d[4];
    d[0] = Box(p, b);
    d[1] = Box(p, b*vec3(1.2,0.8,0.8));
    d[2] = Box(p, b*vec3(0.8,1.2,0.8));
    d[3] = Box(p, b*vec3(0.8,0.8,1.2));
    return max(d[0], -min(d[1],min(d[2],d[3])));
}

float Box3(vec3 p, vec3 b){
    float d[8];
    p.xy*=rotate(time);
    d[0] = Box2(p-vec3(1.,1.,1.)*b*0.5, b*0.45);
    p.yz*=rotate(time);
    d[1] = Box2(p-vec3(1.,1.,-1.)*b*0.5, b*0.45);
    p.zx*=rotate(time);
    d[2] = Box2(p-vec3(1.,-1.,1.)*b*0.5, b*0.45);
    p.yx*=rotate(time);
    d[3] = Box2(p-vec3(1.,-1.,-1.)*b*0.5, b*0.45);
    p.zy*=rotate(time);
    d[4] = Box2(p-vec3(-1.,1.,1.)*b*0.5, b*0.45);
    p.xz*=rotate(time);
    d[5] = Box2(p-vec3(-1.,1.,-1.)*b*0.5, b*0.45);
    p.xz*=rotate(time);
    d[6] = Box2(p-vec3(-1.,-1.,1.)*b*0.5, b*0.45);
    p.yz*=rotate(time);
    d[7] = Box2(p-vec3(-1.,-1.,-1.)*b*0.5, b*0.45);
    return min(d[0],min(d[1],min(d[2],min(d[3],min(d[4],min(d[5],min(d[6],d[7])))))));
}

float df(vec3 p){
    vec3 q = p;
    vec3 c = vec3(4.);
    vec3 ql = floor(q);
    vec3 qm = mod(p-0.5*c, c)-0.5*c;

    // float n = mod(ql.x+ql.y+ql.z, 3.);
    return Box3(qm, vec3(.4));
}

vec3 getNormal(vec3 p){
    vec2 d = vec2(0.00003, 0.);
    return normalize(vec3(
            df(p+d.xyy)-df(p-d.xyy),
            df(p+d.yxy)-df(p-d.yxy),
            df(p+d.yyx)-df(p-d.yyx)
        ));
}

void main(){
  float t = mod(time, 60.);
  // vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  t *= 0.2;
  // vec3 camPos = vec3(0.,0.08,.7);
  vec3 camPos = vec3(cos(t), .5, sin(t))*1.;
  vec3 dir = vec3(p, 1.);
  dir.yz *= rotate(PI*0.15);
  dir.xz *= rotate(t+PI*.5);

  float d = 0.;
  for(int i=0;i<24;i++){
      float tmp = df(camPos + d*dir)*0.5;
      if(tmp<0.001)break;
      d += tmp;
  }
  vec3 intersect_p = camPos + d*dir;

  if(df(intersect_p)<.1){
      vec3 normal = getNormal(intersect_p);

      t *=64.;
      vec3 lightDir = normalize(vec3(1.));
      lightDir.xz *= rotate(t);

      mat4 modelMat = mat4(1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.);
      mat4 invMatrix = mat4(1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.);
      vec3 invLight  = normalize(invMatrix * vec4(lightDir, 0.0)).xyz;
      vec3 invEye    = normalize(invMatrix * vec4(dir, 0.0)).xyz;
      vec3 halfLE    = normalize(invLight + invEye);
      vec4 ambientColor = vec4(vec3(0.02),1.);
      float diffuse   = clamp(dot(normal, invLight), 0.0, 1.0);
      float specular  = pow(clamp(dot(normal, halfLE), 0.0, 1.0), 100.);
      vec4  destColor = vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;
      // float attenuation = 1./ (1. + 20.*pow(length(lightPos-(modelMat*vec4(pos, 0.)).xyz), 2.));
      color += destColor.rgb;
  }else{
      color += vec3(0.02);
  }
  // color += vec3(d*0.03)+df(intersect_p);



  gl_FragColor = vec4(color, 1.);
}
