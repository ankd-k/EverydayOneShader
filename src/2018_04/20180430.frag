/*{
  pixelRatio : 1.,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float usin(float x){
  return (sin(x)+1.)*0.5;
}

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

float box(vec3 p, vec3 b){
  vec3 d = abs(p) - b;
  return min(max(d.x, max(d.y, d.z)),0.) + length(max(d, 0.));
}

float wireBox2(vec3 p, vec3 b){
  float d[4];
  d[0] = box(p, b);
  d[1] = box(p, b*vec3(1.2,0.8,0.8));
  d[2] = box(p, b*vec3(0.8,1.2,0.8));
  d[3] = box(p, b*vec3(0.8,0.8,1.2));
  return max(d[0], -min(d[1],min(d[2],d[3])));
  // return min(d[1], min(d[2], d[3]));
}

float sign2(float x){
  return sign(x)==0. ? 1.:sign(x);
}

float df(in vec3 p, out float n){
  vec3 q;
  vec3 pl = floor(p);
  float v = sign2(pl.x);
  vec3 c = vec3(1.5);
  q = mod(p, c) - c*.5;

  q.zx *= rotate(v*time*1.);
  float d0 = length(q)-.1 + usin(time)*0.15*sin(20.*q.x)*sin(30.*q.y)*sin(40.*q.z);// sphere

  float d1;
  // q.xy *= rotate(v*time);
  // q.yz *= rotate(v*time);
  d1 = wireBox2(q, vec3(0.2));
  // q.xy *= rotate(v*time);
  q.zx *= rotate(-2.*v*time*1.);
  // q.yz *= rotate(v*time);
  d1 = min(d1, wireBox2(q, vec3(0.3)));
  // p.xy *= rotate(time);
  // p.yz *= rotate(time);
  // d1 = min(d1, wireBox2(p, vec3(0.6)));

  float d = min(d0, d1);
  n = 0.;
  return d;
}

float df(in vec3 p){
  float tmp;
  return df(p, tmp);
}

vec3 getNormal(vec3 p){
  vec2 d = vec2(0.001, 0.);
  return normalize(vec3(
      df(p + d.xyy) - df(p - d.xyy),
      df(p + d.yxy) - df(p - d.yxy),
      df(p + d.yyx) - df(p - d.yyx)
    ));
}


void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  // vec3 camPos = vec3(sin(t)*0.7, 0., sin(t)*0.3)*10.;
  vec3 camPos = vec3(0.,t*0.2,-t*0.4);
  vec3 dir = vec3(p, -1.);
  // dir.yz *= rotate(time*0.2);
  // dir.zx *= rotate(time*0.1);

  float id;
  float d = 0.;
  bool b = true;
  for(int i=0;i<32;i++){
    vec3 cur = camPos + d*dir;
    float tmp = df(cur, id);
    tmp *= 0.5;
    if(tmp<0.001) {
      b = false;
      break;
    }
    d += tmp;
  }
  vec3 intersect_p = camPos + d*dir;

  color += (vec3(d*0.03) + df(intersect_p, id));

  vec3 normal = getNormal(intersect_p);

  vec3 lightPos = camPos+vec3(1.,1.,1.);
  vec3 lightDir = normalize(vec3(1.,1.,1.));

  mat4 invMatrix = mat4(1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.);
  vec3 invLight  = normalize(invMatrix * vec4(lightDir, 0.0)).xyz;
  vec3 invEye    = normalize(invMatrix * vec4(dir, 0.0)).xyz;
  vec3 halfLE    = normalize(invLight + invEye);

  vec4 ambientColor = vec4(vec3(0.01),1.);
  float diffuse   = clamp(dot(normal, invLight), 0.0, 1.0);
  float specular  = pow(clamp(dot(normal, halfLE), 0.0, 1.0), 100.);
  vec4  destColor = vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;
  color += destColor.rgb;

  gl_FragColor = vec4(color, 1.);
}
