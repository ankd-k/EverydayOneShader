/*{
    "vertexCount": 900.,
    "vertexMode": "TRINANGLES",

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

uniform int PASSINDEX;
uniform sampler2D cameraTexture;

varying vec4 v_color;

const float PI = 3.14159265359;

mat2 rotate( float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

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

void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    float triId = floor(vertexId/3.);
    float triNum = mod(vertexId, 3.);

    float wN = 10.;

    float l = 4./wN;
    float r = l/sqrt(3.);
    float h = sqrt(3.)*l/2.;
    vec2 n = vec2(mod(triId, wN), floor(triId/wN));

    bool b = mod(n.y, 2.)<1.;

    vec3 center;
    if(b){
      center.x = (n.x+0.5)*l;
      // center.x = (mod(triId, n.x)+0.5)*l;
      center.y = r/2. + h*floor(n.y/2.);
    }else{
      center.x = (n.x+1.)*l;
      // center.x = (mod(triId, n.x)+1.)*l;
      center.y = r + h*floor(n.y/2.);
    }
    if(mod(n.y,4.)<2.) center.x -= 2.;
    else center.x -= 2.+l/2.;
    center.y -= 1.;
    center.z = sin(t*2. + triId);


    pos = center;
    pos.xy += rotate(2.*PI/3.*triNum + (b ? 0. : PI))*vec2(0., r);

    gl_Position = getCameraMatrix() * vec4(pos, 1.);
    gl_PointSize = 1.;

    v_color = b ? vec4(1.) : vec4(vec3(0.2),1.);
}
