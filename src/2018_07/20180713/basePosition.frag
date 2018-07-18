/*{
"PASSES":[
{
  fs : 'camera.frag',
  TARGET : 'cameraTexture',
  FLOAT : true,
},
{
  fs : 'basePosition.frag',
  TARGET : 'baseaPosTexture',
  FLOAT : true,
},
{
  fs : 'position.frag',
  TARGET : 'positionTexture',
  FLOAT : true,
},
{
  vs : 'velocity.vert',
  fs : 'velocity.frag',
  TARGET : 'velocityTexture',
  FLOAT : true,
},
{
  vs : 'scene.vert',
  fs : 'scene.frag',
},
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform float vertexCount;

uniform sampler2D basePosTexture;
uniform sampler2D positionTexture;

uniform int FRAMEINDEX;

const float PI = 3.14159265359;

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.98989, 4.14114)))*43216.4897);
}

vec4 reset(){
  // float n = 10.;
  float id = gl_FragCoord.x+resolution.x*gl_FragCoord.y;
  float m = mod(id, 1.);
  m = 1.;
  vec3 pos;
  pos.x = random(vec2(m, time*1.5674));
  pos.y = random(vec2(m, time*1.2387));
  pos.z = random(vec2(m, time*2.9216));
  pos.xyz = vec3(
    random(gl_FragCoord.xy),
    random(gl_FragCoord.xy),
    random(gl_FragCoord.xy)
  );
  return vec4(pos, 1.);
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  if(FRAMEINDEX==0){
    gl_FragColor = reset();
  }else{
    vec4 position = texture2D(positionTexture, uv);
    // gl_FragColor = reset();
    gl_FragColor = position.w<0. ? reset() : texture2D(basePosTexture, uv);
  }
}
