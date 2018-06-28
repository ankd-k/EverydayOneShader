/*{
  "pixelRatio": 1.,
  "frameskip": 1,
  "vertexCount": 1500000.,
  "vertexMode": "POINTS",

  "PASSES": [
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

    vec4 scene = texture2D(sceneTexture, uv);
    // gl_FragColor = texture2D(sceneTexture, uv);
    gl_FragColor = vec4(0.95);
    // gl_FragColor.rgb -= scene.rgb;
    gl_FragColor -= scene;

    // gl_FragColor.a = scene.a;
    // gl_FragColor = scene;
    gl_FragColor *= clamp(1./length(p), 0., 1.2);
}
