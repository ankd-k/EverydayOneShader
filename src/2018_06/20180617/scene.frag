/*{
  "pixelRatio": 1.,
  "frameskip": 2.,
  "vertexCount": 1000000,
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
      TARGET: "sceneTexture",
      "BLEND": "ADD",
    },
  ]
}*/

precision mediump float;
varying vec4 v_color;

uniform float time;

void main(){
  // gl_FragColor = vec4(1.)-v_color;
  gl_FragColor = v_color;
}
