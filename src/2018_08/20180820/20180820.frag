/*{
    "vertexCount": 30.,
    "vertexMode": "TRIANGLES",
    "PASSES":[
      {
        fs: 'camera.frag',
        TARGET: 'cameraTexture',
        FLOAT: true,
      },
      {
        fs: 'scenes/scene1.frag',
        TARGET: 'sceneTex1',
      },
      {
        fs: 'scenes/scene2.frag',
        TARGET: 'sceneTex2',
      },
      {
        fs: 'scenes/scene3.frag',
        TARGET: 'sceneTex3',
      },
      {
        fs: 'scenes/scene4.frag',
        TARGET: 'sceneTex4',
      },
      {
        fs: 'scenes/scene5.frag',
        TARGET: 'sceneTex5',
      },
      {
        fs: '20180820.frag',
        vs: 'panel.vert',
        BLEND: 'ADD',
      },
    ],
}*/
precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D vertTexture;

varying vec4 v_color;
varying vec3 v_position;
varying vec2 v_uv;
varying float v_panel;

uniform sampler2D sceneTex1;
uniform sampler2D sceneTex2;
uniform sampler2D sceneTex3;
uniform sampler2D sceneTex4;
uniform sampler2D sceneTex5;

const float PI = 3.14159265359;

void main(){
  float t = mod(time*1.2, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);

  if(PASSINDEX==6){
    gl_FragColor = v_color;
    gl_FragColor *=
    v_panel<1. ? texture2D(sceneTex1, v_uv) :
    v_panel<2. ? texture2D(sceneTex2, v_uv) :
    v_panel<3. ? texture2D(sceneTex3, v_uv) :
    v_panel<4. ? texture2D(sceneTex4, v_uv) :
    texture2D(sceneTex5, v_uv) ;
    // gl_FragColor *= 0.2;
  }
}
