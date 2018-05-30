/*{
  "PASSES": [
    {
      "TARGET" : "buff",
    },
    {

    },
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D buff;

const float PI = 3.14159265359;

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43123.9878);
}

float usin(float x){
  return 0.5+0.5*sin(x);
}

float ellipse(vec2 p, vec2 offset,vec2 size){
  vec2 q = (p-offset)/size;
  float l = length(q);
  return 1.-smoothstep(1.-0.02, 1., l);
}

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

float ease_in(float x, float n){
  return pow(x, n);
}
float ease_out(float x, float n){
  return 1.-pow(1.-x, n);
}
float ease_inout(float x, float n){
  float x2 = x*2.;
  if(x<0.5){
    return ease_in(x2, n)*0.5;
  }else{
    x2 -= 1.;
    return 0.5+ease_out(x2, n)*0.5;
  }
}

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

void main(){
    float t = mod(time, 60.);
    float tl = floor(t);
    float tf = fract(t);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    float sn[7];
    for(int i=0;i<7;i++){
      sn[i] = snoise(vec3(t*4., float(i), 0.));
    }

    if(PASSINDEX==0){
      // pre processing
      for(int i=0;i<4;i++){
        // p *= rotate(t);
        float fi = float(i);
        float pct = ease_inout(tf, 32.);
        float o = pct*random(vec2(fi, tl)) + (1.-pct)*random(vec2(fi, tl+1.));
        o = random(vec2(fi, tl));
        vec2 offset = vec2(o, 0.5)*2.-1.;
        float hue = mod(float(i), 3.);
        // if(hue<1.) color.r += ellipse(p, offset, vec2(1./(float(i)*0.2+1.))*(0.8+usin(t)*0.1))*0.2;
        // else if(hue<2.) color.g += ellipse(p, offset, vec2(1./(float(i)*0.2+1.))*(0.8+usin(t)*0.1))*0.2;
        // else color.b += ellipse(p, offset, vec2(1./(float(i)*0.2+1.))*(0.8+usin(t)*0.1))*0.2;
        color += ellipse(p, offset, vec2(1./(float(i)*0.2+1.))*(0.8+usin(t)*0.1))*0.2;
      }
      gl_FragColor = vec4(color, 1.);
    }
    else{
      gl_FragColor = texture2D(buff, uv)*0.4;
      // post processing
      // color = texture2D(buff, uv).rgb;



      if(sn[0]<0.){
        uv *= 0.9;
      }
      if(sn[1]<0.){
        if(abs(p.y+random(vec2(tl, 0.))*2.-1.)<0.3) uv.x *= 0.6;
      }
      if(sn[2]<0.){
        if(abs(p.x+0.8)<0.3) uv.y -= 0.3;
      }
      if(sn[3]<-0.6){
        uv = fract(uv*10.);
      }
      if(sn[6]<-0.2){
        uv = (rotate(tl*20.)*(uv*2.-1.)+1.)/2.;
      }

      // color *= 1./length(p);
      if(sn[4]<0.) {
        float w = 0.02;
        float cw = 1.8;
        color.r = texture2D(buff,uv+vec2(-w,0.)).r*cw;
        color.g = texture2D(buff,uv+vec2(0.,0.)).r*cw;
        color.b = texture2D(buff,uv+vec2(w,0.)).r*cw;
      }else{
        color = texture2D(buff, uv).rgb;
      }
      if(sn[5]<0.15) color = 1.-color;
      // color = texture2D(buff, uv).rgb;
      gl_FragColor.rgb += color*0.75;
    }
}
