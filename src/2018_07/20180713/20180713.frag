/*{
vertexCount :1800000.,
vertexMode: 'POINTS',
frameskip: 1.,

PASSES:[
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
#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D sceneTexture;
uniform sampler2D backbuffer;

uniform sampler2D basePosTexture;

const float PI = 3.14159265359;

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  float w = 0.012;
  vec4 scene;
  scene.r = texture2D(sceneTexture, uv-vec2(w*cos(time), w*cos(time*2.))).r;
  scene.g = texture2D(sceneTexture, uv).g;
  scene.b = texture2D(sceneTexture, uv+vec2(w*cos(time), w*sin(time*2.))).b;
  scene.a = texture2D(sceneTexture, uv).a;
  vec4 back;
  back.r = texture2D(backbuffer, uv-vec2(w*cos(time), w*sin(time*2.))).r;
  back.g = texture2D(backbuffer, uv).g;
  back.b = texture2D(backbuffer, uv+vec2(w*cos(time), w*cos(time*2.))).b;
  back.a = texture2D(backbuffer, uv).a;

  scene = texture2D(sceneTexture, uv);
  back = texture2D(backbuffer, uv);

  vec4 res = scene + back*0.7;
  // res = pow(res, vec4(10.));
  // res.xyz = normalize(res.xyz);

  // if(dFdx(res.x))
  vec4 bg = vec4(0., 0.0, 0.01, 1.);
  gl_FragColor = res + bg;
  // gl_FragColor = vec4(1.-(dFdx(res)+dFdy(res)));
  // gl_FragColor = length(res.xyz) < 0.9 ? vec4(0.) : res;
}
