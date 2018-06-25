/*{
    audio: true,
    "vertexCount": 12000.,
    "vertexMode": "TRIANGLESS",

    "PASSES":[
      {
        fs: "camera.frag",
        TARGET: "cameraTexture",
        FLOAT: true,
      },
      {
        vs : "20180623.vert",
        "BLEND": "ADD",
        TARGET: "sceneTexture",
      },
      {

      },
    ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D backbuffer;

uniform int PASSINDEX;
uniform sampler2D sceneTexture;

const float PI = 3.14159265359;

varying vec4 v_color;

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  if(PASSINDEX==0){

  }else if(PASSINDEX==1){
    gl_FragColor = v_color*vec4(color, 1.);
  }else{
    uv = uv.x<0.25 ? uv.yx :
         uv.x<0.75 ? vec2((uv.x-0.25)*2., uv.y) : uv.yx;
    // uv.x = abs(uv.x-0.5);
    // uv.y = abs(uv.y-0.5);
    // uv = abs(uv-0.5);
    // uv = vec2(length(p), atan(uv.y, uv.x));
    // gl_FragColor = 1.-texture2D(sceneTexture,uv);
    gl_FragColor = texture2D(sceneTexture,uv);
    gl_FragColor *= pow(clamp(1./length(p), 0., 1.), 3.);
    // color.r += sin(uv.x*11.+t*20.);
    // color.g += sin(uv.x*12.+t*30.);
    // color.b += sin(uv.x*13.+t*40.);
    // gl_FragColor.rgb *= color;
    // gl_FragColor.rgb *= vec3(0.2, 0.6, 0.9);
    // gl_FragColor += texture2D(backbuffer, uv)*0.5;
  }
}
