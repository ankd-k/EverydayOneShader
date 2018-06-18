/*{
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

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
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

const float PI = 3.14159265359;

float dfBox(in vec3 p, vec3 b){
  return length(max(abs(p)-b, 0.));
}

float df(in vec3 p){
  p += sin(p.x+time);
  return length(p)-0.5;
}

bool castRay(in vec3 ro, in vec3 rd, out vec3 iq){
  float dmin = 0.0;
  float dmax = 200.;

  float d = dmin;
  for(int i=0;i<32;i++){
    float tmp = df(ro + rd*d);
    if(tmp<0.001){
      iq = ro + rd*d;
      return true;
    }
    if(dmax<d) return false;
    d += tmp;
  }
  return false;
}

vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        df(p + vec3(  d, 0.0, 0.0)) - df(p + vec3( -d, 0.0, 0.0)),
        df(p + vec3(0.0,   d, 0.0)) - df(p + vec3(0.0,  -d, 0.0)),
        df(p + vec3(0.0, 0.0,   d)) - df(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    if(PASSINDEX==0){
    }else{
      vec3 camPos = getCameraElement(0., 0.5);
      vec3 dir = normalize((getCameraMatrix(0.2) * vec4(vec3(p, 2.), 1.)).xyz);

      camPos = vec3(0., 0., -2.+sin(t))*2.;
      dir = normalize(vec3(p, 2.));

      vec3 iq;
      if(castRay(camPos, dir, iq)){
        vec3 normal = getNormal(iq);
        vec3 lightPos = vec3(cos(t), -0.5, sin(t));
        vec3 lightDir = iq-lightPos;
        color += clamp(dot(normal, lightDir), 0.05, 1.0);
        gl_FragColor = vec4(color, 1.);
      }else{
        gl_FragColor = vec4(0.);
      }
    }
}
