/*{
  "camera": true,
  // "server": 8000,
  "audio": true,
}*/
precision mediump float;
#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D camera;

uniform sampler2D samples;
uniform sampler2D spectrum;

uniform sampler2D backbuffer;

const float PI = 3.14159265359;

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    for(int i=0;i<6;i++){
      uv = abs(uv*2.-1.);
      uv *= rotate(t*0.5);
      uv = abs(uv);
      float n = mod(float(i), 3.);
      n<1. ? color.r += texture2D(camera, uv).r :
      n<2. ? color.b += texture2D(camera, uv).g :
              color.g += texture2D(camera, uv).b;
      // color += texture2D(camera, uv).rgb;
    }
    color *= .7;

    color = pow(color, vec3(5.));

    // float freq = texture2D(spectrum, abs(uv*2.-1.)).r*0.1;
    // float gray = max(color.r, max(color.g, color.b));
    // color = vec3(gray);
    // color = vec3(pow(gray, 5.));

    gl_FragColor = vec4(color, 1.);
}
