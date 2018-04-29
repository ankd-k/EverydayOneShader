/*{
  "PASSES": [
    {
      "TARGET": "buff",
    },
    {},
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D buff;

#define PI 3.14159265359

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

vec3 op(vec3 p){
  vec3 c = vec3(4.,4.,.65);
  p = mod(p+c*0.5, c)-0.5*c;
  return p;
}

float df(vec3 p){
  vec3 b1 = vec3(0.6,0.05,0.05);
  vec3 o1 = vec3(0.,0.55,0.);
  vec3 b2 = vec3(0.5,0.05,0.05);
  vec3 o2 = vec3(0.,0.2,0.);
  vec3 b3 = vec3(0.05,0.6,0.05);
  vec3 o3 = vec3(0.3,0.0,0.);
  vec3 b4 = vec3(0.05,0.6,0.05);
  vec3 o4 = vec3(-0.3,0.0,0.);

  float box1 = length(max(abs(p-o1)-b1, 0.));
  float box2 = length(max(abs(p-o2)-b2, 0.));
  float box3 = length(max(abs(p-o3)-b3, 0.));
  float box4 = length(max(abs(p-o4)-b4, 0.));
  // float box2 =
  return min(box1,min(box2,min(box3,box4)));
}

//----------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------



void main(){
  float t = mod(time*0.5, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  if(PASSINDEX==0){
    vec3 camPos = vec3(0.,0.,t*2.);
    vec3 dir = vec3(p, 1.);
    dir.xy *= rotate(t*0.2);

    float d = 0.;
    for(int i=0;i<50;i++){
      vec3 cur = op(camPos+d*dir);
      float tmp = df(cur)*0.6;
      if(tmp<0.01) break;
      d += tmp;
    }
    vec3 intersect_p = op(camPos + d*dir);

    color += 1. - (vec3(d*0.03) + df(intersect_p));
    color *= vec3(.7,0.07,0.);

    gl_FragColor = vec4(color, 1.);
  }else{
    vec2 st = uv * 10.;
    st = floor(st);
    float n = snoise(vec3(st,t));
    if(n<0.2){
      gl_FragColor = texture2D(buff, uv+vec2(0.0, 0.));
    }else{
      gl_FragColor = texture2D(buff, uv+vec2(0.0, 0.));
      gl_FragColor.a = 1.;
    }
  }
}
