/*{
  "pixelRatio": 1.,
  "frameskip": 2.,
  "vertexCount": 1000,
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
      TARGET: "sceneTexture",
      "BLEND": "ADD",
    },
  ]
}*/

precision mediump float;
varying vec4 v_color;

uniform float time;

uniform sampler2D imgTexture;

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

void main(){
  // gl_FragColor = vec4(1.)-v_color;
  // gl_FragColor = v_color;
  vec2 p = gl_PointCoord*2.-1.;
  p *= rotate(time);
  p = (p+1.)*0.5;
  vec4 color = texture2D(imgTexture, p);
  if(color.a < 1.0){
    // gl_FragColor = vec4(1.,0.,0.,1.);
    discard;
  }else{
    gl_FragColor = color * v_color;
    // gl_FragColor.a = 0.5;
  }
}
