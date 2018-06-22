/*{
"PASSES":[
  {
    "TARGET": "buff",
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
uniform sampler2D buff;

const float PI = 3.14159265359;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    if(PASSINDEX==0){
      uv = uv*10.;
      uv = floor(uv);

      color = (mod(uv.x+uv.y, 2.)<1.) ? vec3(0.9) : vec3(0.1);
      gl_FragColor = vec4(color, 1.);
    }else{
      vec2 m = mouse*2.-1.;
      p = uv*2.-1.;
      float dx = sin(uv.y*100.*2.*PI+t)*0.05;
      float dy = sin(uv.x*100.*2.*PI+t)*0.05;
      vec2 d = vec2(dx, dy)*clamp(1.*(0.2-length(p-m)), 0., 1.);
      uv += d;
      gl_FragColor = texture2D(buff, uv);
    }

}
