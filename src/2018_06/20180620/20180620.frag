/*{
    "vertexCount": 10000.,
    "vertexMode": "TRIANGLES",

    "PASSES":[
      {
        fs: "camera.frag",
        TARGET: "cameraTexture",
        FLOAT: true,
      },
      {
        vs: "20180620.vert",

      },
    ],
}*/precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

varying vec4 v_color;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(1.);

    // gl_FragColor = vec4(color, 1.);
    gl_FragColor = v_color*4.;

    // color.r = sin(uv.x*20.847+uv.y*104.494723+t*4.2489);
    // color.g = sin(uv.x*10.847+t*4.2489);
    // color.b = sin(uv.x*20.847+t*4.2489);
    // gl_FragColor.rgb *= color;
}
