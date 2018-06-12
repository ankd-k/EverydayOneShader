/*{
    "vertexCount": 36.,
    "vertexMode": "TRIANGLES",

    "PASSES":[
      {
        "fs": "camera.frag",
        "TARGET": "cameraTexture",
        "FLOAT": true,
      },
      {

      },
    ],

    "midi": true,
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D midi;

uniform int PASSINDEX;
uniform sampler2D cameraTexture;

varying vec4 v_color;
varying vec3 v_position;
varying vec3 v_normal;

const float PI = 3.14159265359;

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

vec3 cube(in float i, in vec3 p, in float r){
  vec3 res = vec3(0.);

  //
  float planeId = mod(i, 6.);// 平面内のid
  float planeNum = floor(i/6.);
  //
  vec4 index =
    planeNum<1. ? vec4(0.,1.,2.,3.) :// top
    planeNum<2. ? vec4(0.,1.,5.,4.):// front
    planeNum<3. ? vec4(1.,2.,6.,5.):// right
    planeNum<4. ? vec4(2.,3.,7.,6.):// back
    planeNum<5. ? vec4(3.,0.,4.,7.):// left
                  vec4(4.,5.,6.,7.);// bottom
  //
  float vi =
    planeId<1. ? index.x :
    planeId<2. ? index.y :
    planeId<3. ? index.z :
    planeId<4. ? index.z :
    planeId<5. ? index.w :
                 index.x ;

  res =
    vi<1. ? vec3(1., 1., 1.) :
    vi<2. ? vec3(1., 1., -1.) :
    vi<3. ? vec3(-1., 1., -1.) :
    vi<4. ? vec3(-1., 1., 1.) :
    vi<5. ? vec3(1., -1., 1.) :
    vi<6. ? vec3(1., -1., -1.) :
    vi<7. ? vec3(-1., -1., -1.) :
           vec3(-1., -1., 1.) ;

  res *= r;

  return res;
}


void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    pos = cube(vertexId, vec3(0.), 0.5);
    v_position = pos;
    v_normal = normalize(pos);


    gl_Position = getCameraMatrix() * vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(1.);
}
