precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int FRAMEINDEX;

uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;

const float PI = 3.14159265359;
const float PI2 = PI*2.;

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898,4.1414)))*43123.9897);
}

vec4 reset(){
  vec2 p = gl_FragCoord.st / resolution * 100.;
  float s =  sin(p.y * PI);
  float x =  cos(p.x * PI2 + p.y) * s;
  float y = -cos(p.y * PI + p.x);
  float z =  sin(p.x * PI2 + p.y) * s;
  vec4 res;
  res.xyz = normalize(vec3(x, y, z)) * .1;
  res.w = floor(random(p)*1000.);
  return res;
}

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    if(FRAMEINDEX==0){
      gl_FragColor = reset();
    }else{
      vec2 uv = gl_FragCoord.xy / resolution;
      vec4 position = texture2D(positionTexture, uv);

      float life = position.w-1.;
      if(life<0.){
        gl_FragColor = reset();
        return;
      }

      vec4 velocity = texture2D(velocityTexture, uv);
      float speed = 0.03;

      vec3 newPosition = position.xyz + velocity.xyz * speed;
      gl_FragColor = vec4(newPosition, life);
    }
}
