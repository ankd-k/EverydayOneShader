/*{

}*/
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

// map() mean distance function
// calculate distance to object from p
float map(in vec3 p) {
  // most simply distance function is Sphere.
  float r = 0.5;
  return length(p) - r;
}

// to do lighting, calc normal at ray position;
vec3 calcNormal(in vec3 p) {
  vec2 e = vec2(1.0, -1.0) * 0.0001;
  return normalize(
      e.xyy * map(p+e.xyy) +
      e.yxy * map(p+e.yxy) +
      e.yyx * map(p+e.yyx) +
      e.xxx * map(p+e.xxx)
    );
}

void main(){
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  // define camera position and direction
  // it's named 'ray origin' and 'ray direction' -> 'ro' and 'rd'
  vec3 ro = vec3(0., 0., 1.);
  vec3 rd = normalize(vec3(p, -1.0));

  // start raymarching loop
  float d = 0.0;// distance from camera
  for(int i=0;i<32;i++){
    float tmp = map(ro + rd*d);
    if(tmp<0.00001 || 10.0 < tmp) break;// if distance is enough short or too long, end loop
    d += tmp;
  }

  vec3 pos = ro + rd*d;// this 'pos' is true ray position
  vec3 nor = calcNormal(pos);

  // define light direction
  vec3 ld = vec3(1.0);



  color += clamp(dot(nor, ld), 0., 1.);

  gl_FragColor = vec4(color, 1.);
}
