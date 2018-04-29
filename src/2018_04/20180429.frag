/*{
  pixelRatio : 1.,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

vec3 op(vec3 p){
  vec3 q = p;
  vec3 c = vec3(4.);
  q = mod(q, c)-0.5*c;
  return q;
}

float wireBox(vec3 p, vec3 b){
  float d[12];

  d[0] = length(max(abs(p-vec3(-b.x,b.y,0.))-vec3(0.03,0.03,b.z), 0.));
  d[1] = length(max(abs(p-vec3(0.,b.y,b.z))-vec3(b.x,0.03,0.03), 0.));
  d[2] = length(max(abs(p-vec3(b.x,b.y,0.))-vec3(0.03,0.03,b.z), 0.));
  d[3] = length(max(abs(p-vec3(0.,b.y,-b.z))-vec3(b.x,0.03,0.), 0.));
  d[4] = length(max(abs(p-vec3(-b.x,-b.y,0.))-vec3(0.03,0.03,b.z), 0.));
  d[5] = length(max(abs(p-vec3(0.,-b.y,b.z))-vec3(b.x,0.03,0.03), 0.));
  d[6] = length(max(abs(p-vec3(b.x,-b.y,0.))-vec3(0.03,0.03,b.z), 0.));
  d[7] = length(max(abs(p-vec3(0.,-b.y,-b.z))-vec3(b.x,0.03,0.), 0.));
  d[8] = length(max(abs(p-vec3(-b.x,0.,b.z))-vec3(0.03,b.y,0.03), 0.));
  d[9] = length(max(abs(p-vec3(b.x,0.,b.z))-vec3(0.03,b.y,0.03), 0.));
  d[10] = length(max(abs(p-vec3(b.x,0.,-b.z))-vec3(0.03,b.y,0.03), 0.));
  d[11] = length(max(abs(p-vec3(-b.x,0.,-b.z))-vec3(0.03,b.y,0.03), 0.));
  return min(d[0],min(d[1],min(d[2],min(d[3],min(d[4],min(d[5],min(d[6],min(d[7],min(d[8],min(d[9],min(d[10],d[11])))))))))));
}

float df(in vec3 p, out float d){
  float n = 0.;

  p.xy *= rotate(time);
  p.yz *= rotate(time);

  float d0 = length(p)-.5;// sphere
  // float d1 = length(max(abs(p)-vec3(0.4), 0.));// box
  float d1 = wireBox(p, vec3(0.4));

  if(d0<d1){
    n = 0.;
    d = d0;
  }else{
    n = 1.;
    d = d1;
  }
  return n;
}

void main(){
  float t = mod(time, 600.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec3 camPos = vec3(0., 0., t);
  vec3 dir = vec3(p, 1.);
  dir.yz *= rotate(time*0.2);
  dir.zx *= rotate(time*0.1);

  float id;
  float d = 0.;
  int i;
  bool b = true;
  for(int i=0;i<32;i++){
    vec3 cur = op(camPos + d*dir);
    float tmp;
    id = df(cur, tmp);
    tmp *= 0.6;
    if(tmp<0.001) {
      b = false;
      break;
    }
    d += tmp;
  }
  vec3 intersect_p = op(camPos + d*dir);
  vec3 base;
  if(b) base = vec3(0.);
  else{
    if(id<1.) base = vec3(0.5);
    else base = vec3(.1,0.2,.8);
  }

  float intersect_d;
  df(intersect_p, intersect_d);
  color += (1. - vec3(d*0.03) + intersect_d) * base;

  gl_FragColor = vec4(color, 1.);
}
