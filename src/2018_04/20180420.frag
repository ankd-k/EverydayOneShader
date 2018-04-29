/*{
  
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define PI 3.14159265359

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

float dFunc(vec3 p){
  float r = .2;
  float d1 = length(p)-r;

  vec2 t = vec2(1., .1);
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  float d2 = length(q)-t.y;

  vec3 q2 = p;
  q2.xy = rotate(PI*.5)*p.xy;
  q = vec2(length(q2.xz)-t.x, q2.y);
  float d3 = length(q)-t.y;

  return min(min(d1, d2), d3);
}

vec3 opRep(vec3 p, vec3 c){
  vec3 q = mod(p, c)-0.5*c;
  return q;
}

vec3 op(vec3 p){
  vec3 q = p;
  q = opRep(q, vec3(2.));
  return q;
}


vec3 getNormal(vec3 p) {
	vec2 d = vec2(0.01, 0.0);
	return normalize(
		vec3(
			dFunc(p + d.xyy) - dFunc(p - d.xyy),
			dFunc(p + d.yxy) - dFunc(p - d.yxy),
			dFunc(p + d.yyx) - dFunc(p - d.yyx)
		)
	);
}

void main(){
  float t = mod(time, 600.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  float speed = 1.;

  vec3 camPos = vec3(0., 0., t);
  vec3 dir = vec3(p, 1.);
  dir.xy *= rotate(time*0.2);
  dir.yz *= rotate(time*0.4);

  float d = 0.;
  for(int i=0;i<32;i++){
    vec3 cur = op(dir*d + camPos);// current pos
    float tmp = dFunc(cur)*0.6;
    if(tmp<0.01) break;
    d += tmp;
  }
  vec3 intersect_p = op(d*dir + camPos);

  color += vec3(d*0.03) + dFunc(intersect_p);


  gl_FragColor = vec4(color, 1.);
}
