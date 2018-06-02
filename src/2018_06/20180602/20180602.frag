/*{
  "vertexCount": 3600.,
  "vertexMode": "TRIANGLES",

  "PASSES": [
    {
      "fs": "camera.frag",
      "TARGET": "cameraTexture",
      "FLOAT": true,
    },
    {
      "vs": "./scene.vert",
      "fs": "./scene.frag",
      "TARGET": "sceneTexture",
    },
    {
      "TARGET": "blurTexture",
    },
    {
      "vs": "./scene.vert",
      "fs": "./position.frag",
      "TARGET": "positionTexture",
      "FLOAT": true,
    },
    {

    },
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

uniform int PASSINDEX;
uniform sampler2D sceneTexture;
uniform sampler2D blurTexture;
uniform sampler2D positionTexture;

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  return color;
}

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
    float t = mod(time, 600.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    if(PASSINDEX==0){// scene
      // do nothing
    }else if(PASSINDEX == 2){// blur
      gl_FragColor = blur13(sceneTexture, uv, resolution, vec2(1.2));
    }else if(PASSINDEX == 3){// depth
      // do nothing
    }else{// render
      vec4 blur = texture2D(blurTexture, uv);
      vec4 scene = texture2D(sceneTexture, uv);

      float thr = 0.2+((clamp(usin(time*0.5)*3., .5, 2.5)-.5)/2.)*0.5;
      thr = 0.2+usin(0.5*time*2.*PI)*0.8;
      float l = abs(texture2D(positionTexture, uv).z-thr);
      gl_FragColor = mix(scene, blur, clamp(l*3., 0., 1.));
    }

}
