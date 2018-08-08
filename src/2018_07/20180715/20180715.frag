/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

float ease_in(float x, float n){
  return pow(x, n);
}

float ease_out(float x, float n){
  return 1.0-pow(1.0-x, n);
}

float ease_inout(float x, float n){
  float x2 = x*2.0;
  return x2<1. ?
    ease_in(x2, n)*0.5 :
    ease_out(x2-1., n)*0.5+0.5;
}

float ease_outin(float x, float n){
  float x2 = x*2.0;
  return x2<1. ?
    ease_out(x2, n)*0.5 :
    ease_in(x2-1., n)*0.5+0.5;
}


float lengthN(vec2 v, float n){
  vec2 tmp = pow(abs(v), vec2(n));
  return pow(tmp.x+tmp.y, 1./n);
}

mat2 rotate(float r){
  return mat2(cos(r), -sin(r), sin(r), cos(r));
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.14414)))*43123.8976);
}

vec3 opRep(vec3 p, vec3 c){
  return mod(p, c)-0.5*c;
}

float df(vec3 p){
  float r = 0.9;
  vec3 q = opRep(p, vec3(2.));
  return length(q)-r;
}

bool castRay(inout vec3 ro, inout vec3 rd){
  float mind = 0.;
  float maxd = 20.;
  float d = mind;
  for(int i=0;i<32;i++){
    float tmp = df(ro + rd*d);
    if(tmp<0.0001){
      rd = d*rd;
      return true;
    }
    if(d>maxd) return false;
    d += tmp;
  }
  return false;
}

void main(){
  float t = mod(time*2., 10.);
  float tl = floor(t);
  float tl2 = floor(t*2.);
  float tl_1 = floor(t*10.)/10.;
  float tf = fract(t);
  float tf2 = fract(t*2.);


  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);


  float pct = ease_inout(tf, 4.);
  float c;
  float r = 0.8;

  if(mod(tl, 2.)<1.) {
    p *= 2.;
    p = fract(p);
    p = p*2.-1.;
  }
  // if(mod(t*2., 2.)<1.) p *= rotate(PI*0.25);

  vec3 camPos = vec3(0., 0., tl);
  vec3 dir = normalize(vec3(p, 1.));

  if(castRay(camPos, dir)){
    vec3 iq = camPos + dir;
    // color += vec3(0.03*length(dir)) + df(iq+0.1);
  }else{
    if(tl<1.){
      r = random(vec2(tl))*(1.-pct) + random(vec2(tl+1.))*pct;
      c = (lengthN(p/r, 2.*(1.-pct) + 1.*pct));
    } else if(tl<2.){
      r = random(vec2(tl))*(1.-pct) + random(vec2(tl+1.))*pct;
      c = (lengthN(p/r, 1.*(1.-pct) + 5.*pct));
    } else if(tl<3.){
      r = random(vec2(tl))*(1.-pct) + random(vec2(tl+1.))*pct;
      c = (lengthN(p/r, 5.*(1.-pct) + .5*pct));
    } else if(tl<4.){
      r = random(vec2(tl))*(1.-pct) + random(vec2(tl+1.))*pct;
      c = (lengthN(p/r, .5*(1.-pct) + 6.*pct));
    } else if(tl<5.){
      r = random(vec2(tl))*(1.-pct) + random(vec2(tl+1.))*pct;
      c = (lengthN(p/r, 6.*(1.-pct) + 0.08*pct));
    } else if(tl<6.){
      r = random(vec2(tl))*(1.-pct) + random(vec2(tl+1.))*pct;
      c = (lengthN(p/r, 0.08*(1.-pct) + 4.*pct));
    } else if(tl<7.){
      r = random(vec2(tl))*(1.-pct) + random(vec2(tl+1.))*pct;
      c = (lengthN(p/r, 4.*(1.-pct) + 1.*pct));
    } else if(tl<8.){
      r = random(vec2(tl))*(1.-pct) + random(vec2(tl+1.))*pct;
      c = (lengthN(p/r, 1.*(1.-pct) + .3*pct));
    } else if(tl<9.){
      r = random(vec2(tl))*(1.-pct) + random(vec2(tl+1.))*pct;
      c = (lengthN(p/r, 0.3*(1.-pct) + 8.*pct));
    } else {
      r = random(vec2(tl))*(1.-pct) + random(vec2(tl+1.))*pct;
      c = (lengthN(p/r, 8.*(1.-pct) + 2.*pct));
    }

    color += smoothstep(1., 0.95, c);

  }
  p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  color = 1.-color;
  color *= pow(clamp(1.2/length(p), 0., 0.95), 4.);

  gl_FragColor = vec4(color, 1.);
}
