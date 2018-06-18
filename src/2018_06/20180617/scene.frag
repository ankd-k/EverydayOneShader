/*{
  "pixelRatio": 2.,
  "frameskip": 2,
  "vertexCount": 500000,
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
    }
  ]
}*/

precision mediump float;
varying vec4 v_color;

void main(){
  gl_FragColor = v_color;
}
