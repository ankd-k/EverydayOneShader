/*{
  'audio': true,
}*/

precision highp float;
uniform vec2  resolution;
uniform vec2  mouse;
uniform float time;
uniform sampler2D backbuffer;

uniform float volume;

const float PI = 3.1415926;
#define AA 2

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}
mat2 rotate(in float r){
    return mat2(cos(r), -sin(r), sin(r), cos(r));
}
float usin(in float x){
    return 0.5+0.5*sin(x);
}
float gray(in vec3 color){
    return dot(color, vec3(0.299, 0.587, 0.114));
}

float sdSphere(in vec3 p, in float r){
    return length(p) - r;
}
float sdBox(in vec3 p, in vec3 b){
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.) + length(max(d, 0.));
}

vec3 opRep(in vec3 p, in vec3 c){
    return mod(p, c) - 0.5*c;
}

float sdObj(in vec3 p){
    vec3 q = p;
    q.xy *= rotate(q.z*PI*0.05+time*0.1);
    q = opRep(q, vec3(5.0));
    // q.z
    q.xy *= rotate(q.z*PI+time);
    return sdBox(q, vec3(2.5, 0.1, 2.5));
}

vec2 map(in vec3 p){
    vec2 res = vec2(0.0);
    vec3 q = p;

    res = vec2(sdObj(q), 1.);
    return res;
}

vec3 calcNormal(in vec3 p){
    vec2 e = vec2(1.0, -1.0) * 0.00001;
    return normalize(vec3(
            e.xyy*map(p+e.xyy).x +
            e.yxy*map(p+e.yxy).x +
            e.yyx*map(p+e.yyx).x +
            e.xxx*map(p+e.xxx).x
        ));
}

mat3 lookAt(in vec3 eye, in vec3 tar, in float r){
    vec3 cw = normalize(tar - eye);
    vec3 cp = vec3(sin(r), cos(r), 0.);
    vec3 cu = normalize(cross(cp, cw));
    vec3 cv = normalize(cross(cw, cu));
    return mat3(cu,cv,cw);
}

vec2 castRay(in vec3 ro, in vec3 rd){
    float minD=0.0, maxD = 50.0;
    float d=minD, m=0.0;

    for(int i=0;i<32;i++){
        vec3 pos = ro + rd*d;
        vec2 tmp = map(pos);
        if(tmp.x<0.0000001 || 50.0<tmp.x) break;
        d += tmp.x*0.6;
        m = tmp.y;
    }
    if(50.0<d) m = -1.0;

    return vec2(d, m);
}

vec3 render(in vec3 ro, in vec3 rd){
    vec2 res = castRay(ro, rd);
    float d = res.x;
    float m = res.y;

    vec3 pos = ro + rd * d;
    vec3 nor = calcNormal(pos);

    vec3 lightDir = normalize(vec3(cos(time), 1., sin(time)));

    vec3 color = vec3(0.);
    if(m==1.){
        color += clamp(dot(lightDir, nor), 0., 1.);
        // float g = gray(color);
        // color = hsv(0.5+0.1*sin(time*0.5)+g*(0.4+usin(time*0.001)), 1.0, 1.0);
        // color *= exp(-0.03*d);
        // color += usin(d+time*20.0);
    }else {
        color = vec3(0.0);
    }


    return color;
}

void main(){

    vec3 eye = vec3(0., 0., time);
    vec3 tar = eye-vec3(0., 0., -1.);

    vec3 color = vec3(0.);
    for(int i=0;i<AA;i++){
        for(int j=0;j<AA;j++){
            vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
            p += vec2(float(i), float(j))/resolution;
            vec3 dir = normalize(lookAt(eye, tar, time*0.4+0.2*sin(time*0.8)) * vec3(p, 1.0));
            dir = normalize(vec3(dir.xy, sqrt(max(dir.z*dir.z - dot(dir.xy, dir.xy)*0.2, 0.))));

            color += render(eye, dir);
        }
    }
    color /= float(AA*AA);

    float blur = 0.05*sin(time*0.2);
    color *= 0.2+blur;
    color += (0.8+blur)*texture2D(backbuffer, gl_FragCoord.xy/resolution).rgb;
    color = vec3(volume/255.0);
    gl_FragColor = vec4(color, 1.0);
}
