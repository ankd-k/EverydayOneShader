/*{
    "vertexCount": 10000.,
    "vertexMode": "POINTS",

    "audio": true,

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

uniform float volume;
uniform sampler2D spectrum;

varying vec4 v_color;

const float PI = 3.14159265359;

void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    float freq[3];
    freq[0] = texture2D(spectrum, vec2(0., 0.)).r;
    freq[1] = texture2D(spectrum, vec2(0.1, 0.)).r;
    freq[2] = texture2D(spectrum, vec2(0.2, 0.)).r;

    pos.x = sin(t*0.5 + (vertexId+1.)*4.08345);
    pos.y = sin(t*0.5 + (vertexId+1.)*6.567);
    pos.z = sin(t*0.5 + (vertexId+1.)*9.8272);

    pos *= 5.;


    gl_Position = getCameraMatrix() * vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(1.);
}
