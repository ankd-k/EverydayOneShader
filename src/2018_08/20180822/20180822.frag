/*{
    pixelRatio: 2.,
    "vertexCount": 2160.,
    "vertexMode": "TRIANGLES",
    "PASSES":[
      {
        fs: 'camera.frag',
        TARGET: 'cameraTexture',
        FLOAT: true,
      },
      {
        fs: '20180822.frag',
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

highp float random(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}
float random(float n){
  return random(vec2(n, 0.));
}
vec3 random3(float n){
  return vec3(
      random(n + 0.0),
      random(n + 10.0),
      random(n + 100.0)
    );
}

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
  float t = mod(time*1.2, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);

  gl_FragColor = v_color;
  uv = v_uv;
  float panelId = random(v_panel*0.03468438);

  for(int i=0;i<5;i++){
    uv.x += 0.2*sin(uv.y*13.82*panelId + time*1.859*panelId + sin(uv.x*2.35*panelId + time*panelId + sin(uv.x*panelId + time*0.412)));
    uv.y += 0.3*sin(uv.x*17.82*panelId + time*2.959*panelId + sin(uv.y*4.98*panelId + time*0.247));
  }
  vec3 color = vec3(0.);

  color.r = sin(uv.x*.5 + uv.y*.69 + 50.*panelId);
  color.g = sin(uv.x*2.5 + uv.y*.49 + 30.*panelId);
  color.b = sin(uv.x*1.5 + uv.y*.89 + 80.*panelId);
  gl_FragColor.rgb *= color;
}
