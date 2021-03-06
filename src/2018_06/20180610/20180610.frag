/*{
  "vertexCount": 99.,
  "vertexMode": "TRIANGLES",

"PASSES":[
  {
    "vs": "20180610.vert",
    "BLEND": "ADD",
  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec4 v_color;

const float PI = 3.14159265359;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(1.);

    // gl_FragColor = vec4(color, 1.);
    gl_FragColor += v_color;

    gl_FragColor *= clamp(1./length(p), 0., 1.);
}
