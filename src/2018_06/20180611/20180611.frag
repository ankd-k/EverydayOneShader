/*{
  "audio": true,
  "vertexCount": 600.,
  "vertexMode": "TRIANGLES",

"PASSES":[
  {
    "fs": "camera.frag",
    "TARGET": "cameraTexture",
    "FLOAT": true,
  },
  {
    "fs": "back.frag",
    "TARGET": "backTexture",
  },
  {
    "fs": "main.frag",
    "vs": "main.vert",
    "TARGET": "mainTexture",
  },
  {
    "fs": "sub.frag",
    "vs": "sub.vert",
    "TARGET": "subTexture",
    "BLEND": "ADD",
  },
  {
    "fs" : "scene.frag",
    "TARGET": "sceneTexture",
  },
  {

  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D sceneTexture;

uniform float volume;
uniform sampler2D spectrum;

const float PI = 3.14159265359;

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

float circle(vec2 p, vec2 offset, float r){
  return smoothstep(r-0.04, r, length(p-offset));
}

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    vec4 main = texture2D(sceneTexture, uv);
    vec4 blur = blur13(sceneTexture, uv, resolution, vec2(10.));
    gl_FragColor = mix(blur, main, clamp(1./length(p*1.5), 0., 1.));
    gl_FragColor = pow(gl_FragColor, vec4(3.));
    // gl_FragColor *= clamp(1.-length(p*0.4), 0.1, 0.8);
    // gl_FragColor = blur;
}
