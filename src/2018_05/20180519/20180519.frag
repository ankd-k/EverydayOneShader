/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.144159265359;

float rand(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43123.9878);
}

float ease_in(float x){
  return pow(x, 5.0);
}

float ease_out(float x){
  return 1.0-pow(1.0-x, 5.0);
}

float ease_inout(float x){
  float x2 = x*2.0;
  float ret = 0.;
  if(x2<1.0){
    ret = ease_in(x2)*0.5;
  }else{
    ret = 0.5*(1.0+ease_out(x2-1.0));
  }
  return ret;
}

void main(){
    float t = mod(time, 60.);
    float tr = fract(t);
    float tl = floor(t);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    float xIn, xOut;
    vec3 colorx = vec3(0.);
    for(int i=0;i<4;i++){
      xIn = ease_in(fract(tr+float(i)/4.*cos(t)));
      xOut = ease_out(fract(tr+float(i)/4.*cos(t)));
      vec3 tmpColor = vec3(0.);
      tmpColor += step(xIn, uv.x);
      tmpColor -= step(xOut, uv.x);
      tmpColor *= step(float(i)/4.,uv.y) - step(float(i+1)/4., uv.y);
      colorx += tmpColor;
    }

    float yIn, yOut;
    vec3 colory = vec3(0.);
    for(int i=0;i<8;i++){
      yIn = ease_in(fract(tr+float(i)/4.*sin(t*0.5)));
      yOut = ease_out(fract(tr+float(i)/4.*sin(t*0.5)));
      vec3 tmpColor = vec3(0.);
      tmpColor += step(yIn, uv.y);
      tmpColor -= step(yOut, uv.y);
      tmpColor *= step(float(i)/8.,uv.x) - step(float(i+1)/8., uv.x);
      colory += tmpColor;
    }

    color = colorx * colory;
    // color = colory;

    gl_FragColor = vec4(color, 1.);
}
