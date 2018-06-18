precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D spectrum;
uniform sampler2D samples;

const float PI = 3.14159265359;

float circle(vec2 p, vec2 offset, float r){
  return 1.-smoothstep(r-0.05, r, length(p-offset));
}

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
    vec3 color = vec3(0.01);

    p *= rotate(t);

    color += uv.x<0.5 ? texture2D(spectrum, uv).rgb :
                        texture2D(spectrum, 1.-uv).rgb;
    color *= 1.-abs(p).y;



    p = vec2(length(p), atan(p.x,p.y));

    color += texture2D(spectrum, abs(p)*vec2(0.5,1.8)).rgb;

    float freq = texture2D(spectrum, abs(p)*vec2(0.5,1.8)).r;
    color += smoothstep(freq, freq-0.04, abs(p).y) * vec3(1., 0.2, 0.1);



    gl_FragColor = vec4(color, 1.);
}
