/*{
    "vertexCount": 1000.,
    "vertexMode": "LINES",

    "PASSES":[
      {
        "fs": "camera.frag",
        "TARGET": "cameraTexture",
        "FLOAT": true,
      },
      {

      },
    ],

}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D spectrum;

uniform sampler2D cameraTexture;
mat4 getCameraMatrix(float mode){
  if(mode<0.4){
    vec4 v0 = texture2D(cameraTexture, vec2(0., mode));
    vec4 v1 = texture2D(cameraTexture, vec2(0.25, mode));
    vec4 v2 = texture2D(cameraTexture, vec2(0.5, mode));
    vec4 v3 = texture2D(cameraTexture, vec2(0.75, mode));
    return mat4(
        v0.x, v0.y, v0.z, v0.w,
        v1.x, v1.y, v1.z, v1.w,
        v2.x, v2.y, v2.z, v2.w,
        v3.x, v3.y, v3.z, v3.w
    );
  }
  else return mat4(0.);
}
vec3 getCameraElement(float mode, float mv){
  float y = mv<0.5 ? 0.4 : 0.5;
  return texture2D(cameraTexture, vec2(mode, y)).rgb;
}


varying vec4 v_color;

const float PI = 3.14159265359;

void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    pos.x = sin(vertexId*0.513274+t);
    pos.y = sin(vertexId*1.5676+t);
    pos.z = sin(vertexId+t);

    float freq = texture2D(spectrum, vec2(0.)).r;

    gl_Position = getCameraMatrix(0.) * vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(freq*0.5);
}
