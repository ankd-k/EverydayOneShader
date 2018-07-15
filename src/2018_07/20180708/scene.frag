/*{
vertexCount : 100000.,
vertexMode: 'POINTS',

PASSES:[
  {
    fs : 'camera.frag',
    TARGET : 'cameraTexture',
    FLOAT : true,
  },
  {
    fs : 'position.frag',
    TARGET : 'positionTexture',
    FLOAT : true,
  },
  {
    // vs : 'velocity.vert',
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
  gl_FragColor = v_color;
}
