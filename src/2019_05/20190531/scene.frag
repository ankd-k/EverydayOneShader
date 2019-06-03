/*{
  pixelRatio: 4.0,
  frameskip: 1.0,
}*/
// Protean clouds by nimitz (twitter: @stormoid)
// https://www.shadertoy.com/view/3l23Rh
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
// Contact the author for other licensing options
/*
  Technical details:

  The main volume noise is generated from a deformed periodic grid,
   which can produce a large range of noise-like patterns at very cheap evaluation cost.
  Allowing for multiple fetches of volume gradient computation for improved lighting.

  To further accelerate marching,
   since the volume is smooth,
   more than half the density information isn't used to rendering or shading
   but only as an underlying volume distance to determine dynamic step size.
  by carefully selecting an equation (polynomial for speed) to step as a function of overall density (not necessarialy rendered)
   the visual results can be the same as a naive implementation with ~40% increase in rendering performance.

  Since the dynamic marching step size is even less uniform due to steps not being rendered at all the fog is evaluated as the difference of the fog integral at each rendered step.
*/
precision highp float;

// basic
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform int FRAMEINDEX;
// audio
uniform float volume;
uniform sampler2D samples;
uniform sampler2D spectrum;
// midi
uniform sampler2D midi;
uniform sampler2D note;

const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;

mat2 rotate(in float r) {
  float c=cos(r), s=sin(r);
  return mat2(c, -s, s, c);
}

const mat3 m3 = mat3(
    0.33338, 0.56034, -0.71817,
    -0.87887, 0.32651, -0.15323,
    0.15162, 0.69596, 0.61339
  ) * 1.93;
float mag2(in vec2 p) { return dot(p, p); }
float linstep(in float mn, in float mx, in float x) { return clamp((x-mn)/(mx-mn), 0., 1.); }
float prm1 = 0.0;
vec2 bsMo = vec2(0.);

vec2 disp(float t) { return vec2(sin(t*0.22*1.), cos(t*0.175)*1.)*2.0; }

vec2 map(in vec3 p) {
  vec3 q = p;
  q.xy -= disp(q.z).xy;
  p.xy *= rotate(sin(p.z + time)*(0.1 + prm1*0.05) + time*0.09);
  float cl = mag2(q.xy);

  float d = 0.;
  p *= 0.61;
  float z = 1.0;
  float trk = 1.0;
  float dspAmp = 0.1 + prm1*0.2;

  for(int i=0;i<8;i++) {
    p += sin(p.zxy * 0.75 * trk + time*trk*0.8) * dspAmp;
    d -= abs(dot(cos(p), sin(p.zxy))*z);
    z *= 0.57;
    trk *= 1.4;
    p = p*m3;
  }
  d = abs(d + prm1*3.0) + prm1*0.3 -2.5 + bsMo.y;
  return vec2(d + cl*.2 + 0.25, cl);
}

vec4 render(in vec3 ro, in vec3 rd, in float time) {
  vec4 rez = vec4(0.);
  const float ldst = 8.0;
  vec3 lpos = vec3(disp(time + ldst)*0.5, time + ldst);
  float t = 1.5;
  float fogT = 0.;

  // marching loop
  for(int i=0;i<100;i++) {
    if(rez.a > 0.93) break;

    vec3 pos = ro + rd*t;
    vec2 mpv = map(pos);
    float den = clamp(mpv.x - 0.3, 0., 1.)*1.12;
    float dn = clamp(mpv.x + 2., 0., 3.);

    vec4 col = vec4(0.);
    if(mpv.x>0.6) {
      col = vec4(sin(vec3(5., 0.4, 0.2) + mpv.y*0.1 + sin(pos.z*0.4)*0.5 + 1.8)*0.5+0.5, 0.08);
      col *= den*den*den;
      col.rgb *= linstep(4., -2.5, mpv.x) * 2.3;
      float dif = clamp((den - map(pos+0.8).x)/9., 0.001, 1.);
      dif += clamp((den - map(pos + 0.35).x)/2.5, 0.001, 1.);
      col.xyz *= den*(vec3(0.005, 0.045, 0.075) + 1.5*vec3(0.033, 0.07, 0.03)*dif);
    }

    float fogC = exp(t*0.2-2.2);
    col.rgba += vec4(0.06, 0.11, 0.11, 0.1)*clamp(fogC-fogT, 0., 1.);
    fogT = fogC;
    rez = rez + col*(1.-rez.a);
    t += clamp(0.5 - dn*dn*0.05, 0.09, 0.3);
  }
  return clamp(rez, 0.0, 1.0);
}

float getsat(in vec3 c) {
  float mn = min(c.x, min(c.y, c.z));
  float mx = max(c.x, max(c.y, c.z));
  return (mx-mn)/(mx+1e-7);// 1e-7 -> avoid to devide by 0
}

vec3 iLerp(in vec3 a, in vec3 b, in float x) {
  vec3 ic = mix(a, b, x) + vec3(1e-6, 0., 0.);
  float sd = abs(getsat(ic) - mix(getsat(a), getsat(b), x));
  vec3 dir = normalize(vec3(2.*ic.x-ic.y-ic.z, 2.*ic.y-ic.x-ic.z, 2.*ic.z-ic.x-ic.y));
  float lgt = dot(vec3(1.), ic);
  float ff = dot(dir, normalize(ic));
  ic += 1.5*dir*sd*ff*lgt;
  return clamp(ic, 0., 1.);
}

mat3 lookAt(in vec3 eye, in vec3 tar, in float r) {
  vec3 cz = normalize(tar - eye);
  vec3 cp = vec3(sin(r), cos(r), 0.0);
  vec3 cx = normalize(cross(cp, cz));
  vec3 cy = normalize(cross(cz, cx));
  return mat3(cx, cy, cz);
}

void main(){
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy-0.5*resolution)/min(resolution.x, resolution.y);
  bsMo = (mouse.xy - 0.5*resolution.xy)/min(resolution.x, resolution.y);// (bs?) mouse position

  // ray origin
  float t = time * 3.0;
  vec3 ro = vec3(0., 0., t);
  ro += vec3(sin(time)*0.5, sin(time*1.0), 0.);
  float dspAmp = 0.85;
  // ro.xy += disp(ro.z)*dspAmp;

  // ray direction
  float tgtDst = 1.5;
  vec3 target = normalize(ro - vec3(disp(time + tgtDst)*dspAmp, t+tgtDst));
  vec3 rd = lookAt(ro, target, 0.) * normalize(vec3(p, -1.0));
  rd.xy *= rotate(-disp(t + 3.5).x*0.2 + bsMo.x);

  prm1 = smoothstep(-1.4, 1.4, sin(time* 1.3));

  vec4 scn = render(ro, rd, time);

  vec3 col = scn.rgb;
  col = iLerp(col.bgr, col.rgb, clamp(1. - prm1, 0.05, 1.0));

  col = pow(col, vec3(0.55, 0.65, 0.6)) * vec3(1., 0.97, 0.9);// bright (gamma or some type like that?)

  col *= pow(16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), 0.12)*0.7 + 0.3;// Vign

  gl_FragColor = vec4(col, 1.);
}
