/*{
  "vertexCount": 10000.,
  "vertexMode": "POINTS",

  "audio": true,

  "PASSES":[
    {
    "fs": "camera.frag",
    "TARGET": "cameraTexture",
    "FLOAT": true,
    },
    {
      "vs": "sub.vert",
      "BLEND": "ADD",
    },
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D cameraTexture;
mat4 getCameraMatrix(){
    vec4 v0 = texture2D(cameraTexture, vec2(0.));
    vec4 v1 = texture2D(cameraTexture, vec2(0.25,0.));
    vec4 v2 = texture2D(cameraTexture, vec2(0.5,0.));
    vec4 v3 = texture2D(cameraTexture, vec2(0.75,0.));
    return mat4(
        v0.x, v0.y, v0.z, v0.w,
        v1.x, v1.y, v1.z, v1.w,
        v2.x, v2.y, v2.z, v2.w,
        v3.x, v3.y, v3.z, v3.w
    );
}

const float PI = 3.14159265359;

varying vec4 v_color;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = v_color.rgb * 0.2;
    gl_FragColor = vec4(color, 1.);
}
