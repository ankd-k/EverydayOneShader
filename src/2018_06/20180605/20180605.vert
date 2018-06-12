/*{
    "vertexCount": 12000.,
    "vertexMode": "TRIANGLES",

    "audio": true,

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

uniform sampler2D cameraTexture;

uniform sampler2D spectrum;

varying vec4 v_color;

const float PI = 3.14159265359;

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}
float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898,4.1414)))*43213.9798);
}
float random(float n){
  return random(vec2(n, 0.));
}
vec3 random3(vec2 n){
  return vec3(
      random(n+vec2(0., 0.)),
      random(n+vec2(0., 1.)),
      random(n+vec2(0., 2.))
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

vec3 triangle(float vId, vec3 center, float r, vec3 angle){
  vec3 res = center;
  res.xy += rotate(vId * (2.*PI/3.)) * vec2(0., r);

  res.xy *= rotate(angle.z);
  res.yz *= rotate(angle.x);
  res.zx *= rotate(angle.y);

  return res;
}
vec3 triangle(float vId, vec3 center, float r, float rot){
  vec3 res = center;
  res.xy += rotate(vId * (2.*PI/3.) + rot) * vec2(0., r);
  return res;
}

void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    float freq[10];
    for(int i=0;i<10;i++){
      freq[i] = texture2D(spectrum, vec2(float(i)*0.1, 0.)).r;
    }

    float triN = floor(vertexId / 3.);
    float triI = mod(vertexId, 3.);

    // vec3 center = vec3(random(vec2(triN, 0.)), random(vec2(triN, 1.)), 0.);
    vec3 center = random3(vec2(triN, 1000.));
    center.xy += vec2(sin(time*1.156+triN), sin(time*1.8756+triN))*0.1;
    float n = mod(triN, 10.);
    float r = 0.2*(
      n<1. ? freq[0] :
      n<2. ? freq[1] :
      n<3. ? freq[2] :
      n<4. ? freq[3] :
      n<5. ? freq[4] :
      n<6. ? freq[5] :
      n<7. ? freq[6] :
      n<8. ? freq[7] :
      n<9. ? freq[8] : freq[9])*n*0.1;

    pos = triangle(triI, center, r, time+triN);
    pos.xy = pos.xy* 2.-1.;
    pos.xy *= rotate(time*0.2);

    pos.z = n*0.2;

    gl_Position = getCameraMatrix()*vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(pos.z);
    // v_color = texture2D(cameraTexture, (pos.xy+1.)*0.5);
}
