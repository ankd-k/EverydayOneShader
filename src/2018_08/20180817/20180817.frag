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
        fs: '20180817.frag',
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

const float PI = 3.14159265359;

void main(){
  float t = mod(time*1.2, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);

  if(PASSINDEX==0){

  }else if(PASSINDEX==1){
    gl_FragColor = v_color;
    gl_FragColor *= step(0.5, fract(length(v_position*10.)+t));
    gl_FragColor *=
      v_panel<1. ? vec4(1., 0., 0., 1.) :
      v_panel<2. ? vec4(0., 1., 0., 1.) :
      v_panel<3. ? vec4(0., 0., 1., 1.) :
      v_panel<4. ? vec4(1., 1., 0., 1.) :
                   vec4(0., 1., 1., 1.) ;
  }
}
