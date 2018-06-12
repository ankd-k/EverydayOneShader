/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

//------------------------------------
// 	<https://www.shadertoy.com/view/MdX3Rr>
//	by inigo quilez
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);
float fbm( in vec2 p ){
    float f = 0.0;
    f += 0.5000*snoise( p ); p = m2*p*2.02;
    f += 0.2500*snoise( p ); p = m2*p*2.03;
    f += 0.1250*snoise( p ); p = m2*p*2.01;
    f += 0.0625*snoise( p );

    return f/0.9375;
}
//------------------------------------

float cloudCircle(in vec2 p, in vec2 offset, in float r, in float seed){
  vec2 v = p-offset;
  float l = length(v);
  float res = r/l;
  res = pow(res, 1.);
  res = clamp(res, 0., .9);
  // return res;
  float f = (fbm(p*3.)+1.)*0.3;

  res = mix(res*f, res-(f*.9), res);

  // return res;
  return clamp(res, 0., 1.);
}

float circle(in vec2 p, in vec2 offset, in float r){
  return 1.-smoothstep(r, r+0.006, length(p-offset));
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43123.98790);
}

float line(vec2 _st,vec2 _p1,vec2 _p2){
  float weight = 0.1;
  float a = (_p1.y-_p2.y)/(_p1.x-_p2.x);
  float b = _p1.y-a*_p1.x;
  float y = a*_st.x+b;// y=ax+b
  float x = (_st.y-b)/a;// x=(y-b)/a

  float res = smoothstep(y-weight,y,_st.y)-smoothstep(y,y+weight,_st.y) +
              smoothstep(x-weight,x,_st.x)-smoothstep(x,x+weight,_st.x);

  return res<0.001 ? 0. : circle(_st, vec2(x,y), 0.01*fbm(vec2(x,y)));
}


void main(){
    float t = mod(time, 600.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.6);

    color -= fbm(uv)*0.2;
    for(int i=0;i<5;i++){
      float fi = float(i+1);
      vec2 offset = vec2(sin(t*0.18324*fi), sin(t*0.378961+fi))*(0.4+fi*0.2);
      float radius = (0.5+sin(t*0.5218)*0.05)/fi;
      color -= cloudCircle(p, offset, radius, t);
    }

    for(int i=0;i<10;i++){
      float fi = float(i);

      float x1 = sin(t*0.2587321+fi);
      float y1 = sin(t*0.1783435+fi);
      vec2 p1 = vec2(x1, y1);

      float x2 = sin(t*0.0146720+fi);
      float y2 = sin(t*0.341657+fi);
      vec2 p2 = vec2(x2, y2);

      color += line(p, p1, p2)*0.4;
    }

    for(int i=0;i<250;i++){
      float fi = float(i);
      float r = sin(fi*1.381+t*0.1)*3.;
      vec2 pos = vec2(0.);
      pos.x = r*cos(fi*0.1+t*0.158);
      pos.y = r*sin(fi*0.1+t*0.237);
      color += circle(p, pos, 0.0001);
    }

    gl_FragColor = vec4(color, 1.);
}
