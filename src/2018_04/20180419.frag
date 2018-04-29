/*{
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D vertTexture;


mat2 rotate(float theta){
  return mat2(
      cos(theta), -sin(theta),
      sin(theta), cos(theta)
    );
}

// 2d distance field
float lengthN(vec2 v, float n){
  vec2 tmp = pow(abs(v), vec2(n));
  return pow(tmp.x+tmp.y, 1./n);
}

// tile fragment
float tile(vec2 p){
  float n = 1.;
  vec2 p2 = mod(p*n*4., n*2.)-n;
  return sin(lengthN(p2, n)*16.*sin(time*0.5));
}

vec2 trans(vec2 p){
  float height = abs(sin(time*0.2));
  p *= rotate(time*0.1);
  p = abs(p);
  float r = height/p.y;
  return vec2(p.x*r, r);
}

void main(){
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  color += tile(trans(p)+vec2(0., fract(time)));
  color *= 1./(abs(trans(p).y));

  gl_FragColor = vec4(color, 1.);

}
