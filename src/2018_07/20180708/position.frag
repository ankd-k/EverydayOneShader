/*{
vertexCount : 100.,
vertexMode: 'POINTS',

PASSES:[
  {
    fs : 'camera.frag',
    TARGET : 'cameraTexture',
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



uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;

uniform int FRAMEINDEX;

const float PI = 3.14159265359;


float getCell(vec3 p){
  float n = 20.;
  return 0.;
}

vec4 reset(){
  return vec4(0.);
}

/*
  position
  xyz = pos.xyz
  w = index of cell
*/
void main(){
  if(FRAMEINDEX==0){
    gl_FragColor = reset();
  }else{
    vec2 uv = gl_FragCoord.xy/resolution;
    vec4 position = texture2D(positionTexture, uv);
    vec4 velocity = texture2D(velocityTexture, uv);
    float speed = 0.03;
    vec3 newPosition = position.xyz + speed*velocity.xyz;
    gl_FragColor = vec4(newPosition, 1.);
  }
}
