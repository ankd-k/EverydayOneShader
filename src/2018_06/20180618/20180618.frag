/*{
  "pixelRatio": 1.,
  "frameskip": 2,
  "vertexCount": 1000.,
  "vertexMode": "POINTS",

  "PASSES": [
    {
      fs: "img.frag",
      TARGET: "imgTexture",
    },
    {
      fs: "camera.frag",
      TARGET: "cameraTexture",
      FLOAT: true,
    },
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
      "vs": "./scene.vert",
      "fs": "./scene.frag",
      TARGET: "sceneTexture",
      "BLEND": "ADD",
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

const float PI = 3.14159265359;

void main(){
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);

    vec4 scene = texture2D(sceneTexture, uv)*0.8;
    // gl_FragColor = texture2D(sceneTexture, uv);
    gl_FragColor = vec4(0.95);
    // gl_FragColor.rgb -= scene.rgb;
    gl_FragColor -= scene;
    // gl_FragColor = scene;

    gl_FragColor *= clamp(1./length(p), 0., 1.);
}
