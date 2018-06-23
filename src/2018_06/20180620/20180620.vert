/*{
    "vertexCount": 10000.,
    "vertexMode": "POINTS",

    "PASSES":[
      {
        fs: "camera.frag",
        TARGET: "cameraTexture",
        FLOAT: true,
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

varying vec4 v_color;

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

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43123.9898);
}

vec3 mod289(vec3 x){
  return x-floor(x*(1.0/289.0))*289.0;
}
vec2 mod289(vec2 x){
  return x-floor(x*(1.0/289.0))*289.0;
}
vec3 permute(vec3 x){
  return mod289(((x*34.0)+1.0)*x);
}
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,
                        0.366025403784439,
                        -0.577350269189626,
                        0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}


void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    pos.x = random(vec2(vertexId, 0.));
    pos.y = random(vec2(vertexId, 1.));
    pos.z = random(vec2(vertexId, 2.));

    pos = pos*2.-1.;

    gl_Position = getCameraMatrix() * vec4(pos, 1.);
    gl_PointSize = 1.2;
    // v_color = vec4((snoise(vec2(t,vertexId))+1.)*0.5);
    v_color.r = (snoise(vec2(t,vertexId+0.))+0.)*0.5;
    v_color.g = (snoise(vec2(t,vertexId+1.))+0.)*0.5;
    v_color.b = (snoise(vec2(t,vertexId+2.))+0.)*0.5;
    v_color.a = 1.;
}
