/*{
"pixelRatio": 1.,
"frameskip": 1,
"vertexCount": 9000,
"vertexMode": "TRIANGLES",
"PASSES": [
  {
    fs: "./velocity.frag",
    TARGET: "velocityTexture",
    FLOAT: true,
  },
  {
    fs: "./position.frag",
    TARGET: "positionTexture",
    FLOAT: true,
  },
  {
    fs: "./camera.frag",
    TARGET: "cameraTexture",
    FLOAT: true,
  },
  {
    "vs": "./scene.vert",
    TARGET: "sceneTexture",
    BLEND: "ADD",
  }
]
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec4 v_color;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    // gl_FragColor = vec4(1.);
    gl_FragColor = v_color*.3;
}
