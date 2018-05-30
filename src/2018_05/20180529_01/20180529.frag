/*{

  "vertexCount": 1200.,
  "vertexMode": "LINES",

  "PASSES": [
    {
      "fs": "camera.frag",
      "TARGET": "cameraTexture",
      "FLOAT": true,
    },
    {
      "vs":"1.vert",
      "TARGET": "vTexture",
    },
    {

    },
  ],

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D cameraTexture;
uniform sampler2D vTexture;
const float PI = 3.14159265359;

varying vec4 v_color;

float ease_in(float x){
  return pow(x, 5.);
}

float ease_out(float x){
  return 1.-pow(1.-x, 1.5);
}

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
    float t = mod(time*0.7, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = texture2D(vTexture, uv).rgb;

    p *= 5.;
    vec2 pl = floor(p);
    vec2 pf = fract(p);


    // t += pl.y*0.05;

    float ts = clamp(fract(t)*2.-1., 0., 1.);
    float tg = clamp(fract(t)*2., 0., 1.);

    float xs = ease_in(ts)*2.-1.;
    float xg = ease_out(tg)*2.-1.;

    float n = step(xs, uv.x*2.-1.) * step(uv.x*2.-1., xg);
    vec3 c = vec3(n);

    color = 1.-abs(color-n);

    p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    color = 1.-abs(color - clamp((0.1+1.5*usin(t))/length(p), 0., 1.));
    gl_FragColor = vec4(color, 1.);
}
