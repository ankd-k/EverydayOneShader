/*{
  "vertexCount": 3600.,
  "vertexMode": "TRIANGLES",

  "PASSES": [
    {
      "fs": "camera.frag",
      "TARGET": "cameraTexture",
      "FLOAT": true,
    },
    {
      "vs": "./20180601.vert",
      // "vs": "./combination.vert",
    },
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

varying vec4 v_color;
varying vec3 v_position;
varying vec3 v_normal;

void main(){
    float t = mod(time, 600.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);


    for(int i=0;i<3;i++){
      float fi = float(i);
      vec3 lightPos = vec3(sin(t*0.1+fi),sin(t*0.3+fi),sin(t*0.5+fi));
      vec3 lightDir = normalize(-lightPos);
      i<1 ? color.r += clamp(dot(lightDir,v_normal), 0.05, 1.):
      i<2 ? color.g += clamp(dot(lightDir,v_normal), 0.05, 1.):
            color.b += clamp(dot(lightDir,v_normal), 0.05, 1.);

    }

    gl_FragColor = vec4(vec3(0.5),1.);
    gl_FragColor.rgb = color;
}
