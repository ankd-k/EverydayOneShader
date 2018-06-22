/*{
  "IMPORTED":{
    "img":{
      "PATH": "img.png",
    },
  },
}*/
precision mediump float;

uniform vec2 resolution;

uniform sampler2D img;

const float PI = 3.14159265359;

void main(){
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec4 tex = texture2D(img, uv);
    gl_FragColor = tex;
    // gl_FragColor *= 2.-length(p);
}
