/*{
  "vertexCount": 12000.,
  "vertexMode": "TRIANGLES",

  "audio": true,

  "PASSES":[
    {
      "fs": "camera.frag",
      "TARGET": "cameraTexture",
      "FLOAT": true,
    },
    {
      "vs": "20180605.vert",
      "fs": "20180605.frag",
      "BLEND": "ADD",
    },
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D cameraTexture;

varying vec4 v_color;

const float PI = 3.14159265359;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    // vec3 color = vec3(0.);

    if(PASSINDEX==0){
    }else{
      // gl_FragColor = vec4(color, 1.);
      gl_FragColor = v_color;
      // gl_FragColor = texture2D(cameraTexture, uv);
    }
    // gl_FragColor = v_color;
}
