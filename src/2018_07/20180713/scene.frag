/*{
vertexCount : 1000000.,
vertexMode: 'POINTS',

PASSES:[
  {
    fs : 'camera.frag',
    TARGET : 'cameraTexture',
    FLOAT : true,
  },
  // {
  //   fs : 'basePosition.frag',
  //   TARGET : 'baseaPosTexture',
  //   FLOAT : true,
  // },
  {
    fs : 'position.frag',
    TARGET : 'positionTexture',
    FLOAT : true,
  },
  {
    fs : 'velocity.frag',
    TARGET : 'velocityTexture',
    FLOAT : true,
  },
  {
    vs : 'scene.vert',
    fs : 'scene.frag',
    BLEND: 'ADD',
  },
],
}*/
precision mediump float;

varying vec4 v_color;

void main(){
  gl_FragColor = v_color*0.9;
}
