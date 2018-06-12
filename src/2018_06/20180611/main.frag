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
    "vs": "main.vert",
  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

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

const float PI = 3.14159265359;

varying vec4 v_color;
varying vec3 v_pos;
varying vec3 v_normal;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);
    gl_FragColor = vec4(0.);

    vec3 lightPos = vec3(cos(t), sin(t*2.1),sin(t))*10.;
    vec3 lightDir = (v_pos - lightPos);
    float diff = clamp(dot(normalize(lightDir), v_normal), 0.05, 1.);
    float specular = 0.;
    gl_FragColor += v_color * vec4(vec3(diff), 1.) + vec4(vec3(specular), 1.);
    if(gl_FragColor.rgb!=vec3(0.)) gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(0.4545));
}
