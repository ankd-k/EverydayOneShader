/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define PI 3.14159265359

float usin(float x){
    return (sin(x)+1.)*.5;
}
float ucos(float x){
    return (cos(x)+1.)*.5;
}

mat2 rotate(float r){
    return mat2(
        cos(r), -sin(r),
        sin(r), cos(r)
    );
}

float ease_in(float x, float n){
    return pow(x, n);
}
float ease_in(float x){
  return ease_in(x, 5.);
}

float ease_out(float x, float n){
  return 1.0-pow(1.0-x, n);
}
float ease_out(float x){
    return ease_out(x, 5.);
}

float ease_inout(float x, float n){
  float x2 = x*2.0;
  float ret = 0.;
  if(x2<1.0){
    ret = ease_in(x2, n)*0.5;
  }else{
    ret = 0.5*(1.0+ease_out(x2-1.0, n));
  }
  return ret;
}
float ease_inout(float x){
    return ease_inout(x, 5.);
}

float lengthN(vec2 v, float n)
{
  vec2 tmp = pow(abs(v), vec2(n));
  return pow(tmp.x+tmp.y, 1.0/n);
}

float lineN(vec2 v, float n, float r){
    float w = 0.02;
    float y = lengthN(v, n);
    return smoothstep(r-w, r, y) - smoothstep(r, r+w, y);
}

float rand(vec2 v){
    return fract(sin(dot(v, vec2(12.9898, 4.1414)))*43123.9878);
}

void main(){
    float t = mod(time*1.2, 600.);
    float tr = fract(t);
    float tl = floor(t);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.1);


    for(int i=0;i<5;i++) {
        for(int j=0;j<3;j++){
            float theta = t*1.4 + float(i)*0.6;
            float thm = mod(theta, 2.*PI);
            float thl = theta - thm;
            float phi = theta + PI*0.1*float(2-j);
            float phm = mod(phi, 2.*PI);
            float phl = phi - phm;
            float r1 = (float(j)*2.+1.)*0.1 * sin(theta);
            float r2 = (float(j)*2.+1.)*0.1 * sin(theta+PI);
            // theta += PI*0.5*float(j);
            color += 0.4*lineN(rotate(-ease_in(usin(phi))*10.)*(p + vec2(float(i-2)*0.75, rand(vec2(float(i)+thl, 0.)))), 1., r1);
            color += 0.4*lineN(rotate(-ease_in(usin(phi+PI))*10.)*(p - vec2(float(i-2)*0.75, rand(vec2(float(i)+thl, 0.)))), 1., r2);
        }
    }


    t *= 12.;
    tr = fract(t);
    tl = floor(t);
    for(int i=0;i<5;i++){
        color += 0.2*lineN(p+vec2(rand(vec2(tl,0.+float(i)))*2.-1., rand(vec2(tl,1.+float(i)))*2.-1.), 1., 0.01*ease_out(tr, 2.));
    }

    color *= 2.-length(p);

    gl_FragColor = vec4(color, 1.);
}
