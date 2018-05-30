/*{
    "vertexCount": 12000.,
    "vertexMode": "LINES",

    "PASSES": [
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

varying vec4 v_color;

uniform int PASSINDEX;
uniform sampler2D cameraTexture;

const float PI = 3.14159265359;

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

float ease_in(float x){
  return pow(x, 5.);
}

float ease_out(float x){
  return 1.-pow(1.-x, 5.);
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43123.9878);
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
    float t = mod(time * 1.2, 60.);
    float tl = floor(t);
    float tf = fract(t);
    vec3 pos = vec3(0.);


    float id = floor(vertexId/6.);

    vec3 p = vec3(random(vec2(id, tl)), random(vec2(id, tl+1.)), random(vec2(id, tl+2.)))*2.-1.;
    p *= 3.;
    // p.xy *= 2.;

    float theta = t;

    float r = 0.8*random(vec2((id+tl)*10.,1.));
    r *= ease_in(clamp(tf*2., 0., 1.));

    pos.xy = rotate(theta+mod(vertexId, 3.)*PI/3.*2.)*vec2(r, 0.)+p.xy;
    pos.z = p.z;

    // pos.x *= resolution.y/resolution.x;
    gl_Position = getCameraMatrix() * vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(1.);
}
