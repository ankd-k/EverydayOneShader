/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define PI 3.14159265359

mat2 rotate(float theta){
  return mat2(
      cos(theta), -sin(theta),
      sin(theta), cos(theta)
    );
}

float dFunc(vec3 p){
  float r = 0.15;
  float d1 = length(p)-r;

  return d1;
}

vec3 op(vec3 p){
  vec3 q = p;
  float c = .5;
  q = mod(p, c*2.)-c; // rep
  return q;
}

vec3 getNormal(vec3 p) {
	vec2 d = vec2(0.001, 0.0);
	return normalize(
		vec3(
			dFunc(p + d.xyy) - dFunc(p - d.xyy),
			dFunc(p + d.yxy) - dFunc(p - d.yxy),
			dFunc(p + d.yyx) - dFunc(p - d.yyx)
		)
	);
}

float rand(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43758.98798);
}

float easeIn(float x){
  return pow(x, 2.);
}
float easeOut(float x){
  return 1.-pow(1.-x, 14.);
}

void main(){
  float t = mod(time*0.25, 60.);
  float tf = fract(t);
  float tl = floor(t);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec3 camPos = vec3(0., 0., t);
  vec3 dir = vec3(p, 1);

  // dir.xz *= rotate(t);
  float pct = easeOut(tf);
  float r1, r2, r;
  r1 = rand(vec2(tl, 0.));
  r2 = rand(vec2(tl+1., 0.));
  r = r1*(1.-pct) + r2*pct;
  dir.xy *= rotate(r*2.*PI);
  r1 = rand(vec2(tl, 1.));
  r2 = rand(vec2(tl+1., 1.));
  r = r1*(1.-pct) + r2*pct;
  dir.yz *= rotate(r*2.*PI);
  r1 = rand(vec2(tl, 2.));
  r2 = rand(vec2(tl+1., 2.));
  r = r1*(1.-pct) + r2*pct;
  dir.zx *= rotate(r*2.*PI);


  float d = 0.;
  for(int i=0;i<256;i++){
    vec3 cur = camPos + dir*d;
    cur = op(cur);
    float tmp = dFunc(cur)*0.4;
    if(tmp<0.01) break;
    d += tmp;
  }
  vec3 intersectP = op(camPos + dir*d);

  vec3 lightDir = normalize(vec3(1.,0.,0.));
  lightDir.xz *= rotate(t);


  color += vec3(d * 0.03)+dFunc(intersectP);
  vec3 normal = getNormal(intersectP);
  float diff = clamp(dot(lightDir, normal), 0.2, 1.);
  color += diff * vec3(.2, .5, 1.);
  // color += getNormal(intersectP);

  gl_FragColor = vec4(color, 1.);
}
