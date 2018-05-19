/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

float ease_in(float x){
  return pow(x, 5.0);
}

float ease_out(float x){
  float ret = 1.0-pow(1.0-x, 4.0);
  return 0.995<ret ? 1. : ret;
}

float ease_inout(float x){
  float x2 = x*2.0;
  if(x2<1.0){
    return ease_in(x2)*0.5;
  }else{
    return 0.5*(1.0+ease_out(x2-1.0));
  }
}



void main(){
    float t = mod(time*0.5, 60.);
    float tf = fract(t);
    float tl = floor(t);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    p *= 2.;
    p = fract(p)*2.-1.;


    float n = 1.;
    float x = ease_out(fract(tf)*n)*2.-1.;
    color += step(x, p.x)*x;
    // color += smoothstep(x, x-0.02, p.x);
    float y = ease_out(fract(tf+0.25)*n)*2.-1.;
    color += step(y, p.y)*y;

    x = ease_out(fract(tf+0.5)*n)*2.-1.;
    color += (1.-step(-x, p.x))*x;
    y = ease_out(fract(tf+0.75)*n)*2.-1.;
    color += (1.-step(-y, p.y))*y;


    gl_FragColor = vec4(color, 1.);
}
