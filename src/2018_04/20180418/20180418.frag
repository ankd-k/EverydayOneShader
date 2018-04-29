/*{

  "vertexCount": 1500.,
  "vertexMode": "LINES",

  "PASSES": [
    {
      "vs": "./20180418_03.vert",
      "TARGET": "vertTexture",
    },
    {

    },
  ]
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D vertTexture;

varying vec4 v_color;

void main(){
  float t = mod(time, 10.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  if(PASSINDEX==0){
    // gl_FragColor = v_color;
  }else{
    gl_FragColor = texture2D(vertTexture, uv);
    gl_FragColor *= 1.4-length(p);

  }

}
