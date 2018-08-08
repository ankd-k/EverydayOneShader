/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int FRAMEINDEX;

uniform sampler2D preTexture;

const float PI = 3.14159265359;

void main(){
  if(FRAMEINDEX==0){
    gl_FragColor = vec4(0.);
  }else{
    vec2 uv = gl_FragCoord.xy/resolution;
    gl_FragColor = texture2D(preTexture, uv);
  }
}
