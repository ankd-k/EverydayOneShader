/*{
vertexCount :800000.,
vertexMode: 'POINTS',
frameskip: 1.,

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
    // vs : 'velocity.vert',
    fs : 'velocity.frag',
    TARGET : 'velocityTexture',
    FLOAT : true,
  },
  {
    vs : 'scene.vert',
    fs : 'scene.frag',
    BLEND: 'ADD',
    TARGET: 'sceneTexture',
  },
  {

  }
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D sceneTexture;
uniform sampler2D backbuffer;

const float PI = 3.14159265359;

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  float w = 0.001;
  vec4 scene;
  scene.r = texture2D(sceneTexture, uv-w).r;
  scene.g = texture2D(sceneTexture, uv).g;
  scene.b = texture2D(sceneTexture, uv+w).b;
  scene.a = texture2D(sceneTexture, uv).a;
  vec4 back;
  back.r = texture2D(backbuffer, uv-w).r;
  back.g = texture2D(backbuffer, uv).g;
  back.b = texture2D(backbuffer, uv+w).b;
  back.a = texture2D(backbuffer, uv).a;

  vec4 res = scene + back*0.8;

  gl_FragColor = scene;
  // gl_FragColor = vec4(color, 1.);
}
