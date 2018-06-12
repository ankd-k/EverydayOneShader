/*{
    "pixelRatio": .5,
    "vertexCount": 800.,
    "vertexMode": "LINES",

    "PASSES": [
      {
        "fs": "camera.frag",
        "TARGET": "cameraTexture",
        "FLOAT": true,
      },
      {
        "vs": "20180607.vert",
        "fs": "20180607.frag",
        "TARGET": "buff",
      },
      {
      }
    ],
}*/precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec4 v_color;

uniform int PASSINDEX;
uniform sampler2D buff;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}

#define AA 3
void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(1.);

    if(PASSINDEX == 1){
      color.r += usin(uv.x*5.2+sin(t*2.4)*2.5);
      color.g += usin(uv.y*7.5+t*3.9);
      color.b += usin(uv.x*9.8+t*4.7);

      gl_FragColor = v_color;
      gl_FragColor.rgb *= color;
    }
    else if(PASSINDEX == 2){
      vec2 resStep = 1./resolution;
      vec4 fc = vec4(0.);
      for(int u=0;u<AA;u++){
        for(int v=0;v<AA;v++){
          vec2 offset = (vec2(float(u),float(v))-vec2(floor(float(AA)/2.)+1.)) * resStep;
          vec2 uv = gl_FragCoord.xy/resolution + offset;
          fc += texture2D(buff, uv);
        }
      }
      fc /= float(AA*AA);
      gl_FragColor = fc;
      gl_FragColor.rgb *= clamp(1./(length(p)*1.), 0., 1.);
    }
}
