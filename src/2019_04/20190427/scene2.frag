/*{

}*/
precision highp float;

// basic
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform int FRAMEINDEX;
// audio
uniform float volume;
uniform sampler2D samples;
uniform sampler2D spectrum;
// midi
uniform sampler2D midi;
uniform sampler2D note;

const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;
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



float sdSphere(in vec3 p, in float r){
    return length(p) - r;
}
float sdBox(in vec3 p, in vec3 b){
    vec3 d = abs(p) - b;
    return length(max(d, 0.)) + min(max(d.x, max(d.y, d.z)), 0.);
}
float sdPlane(in vec3 p, in float h){
    return p.y - h;
}

vec3 opRep(in vec3 p, in vec3 c){
    return mod(p, c)-0.5*c;
}


vec2 opU(in vec2 d1, in vec2 d2){
    return d1.x<d2.x ? d1 : d2;
}

vec2 map(in vec3 p){
    vec2 res = vec2(sdPlane(p, -50.0), 0.0);
    res = opU(res, vec2(sdSphere(p, 0.5), 1.0));
    vec3 q = p;
    q = opRep(q, vec3(2.0));
    q.x = abs(q.x);
    res = opU(res, vec2(sdBox(q-vec3(1.0, 0., 0.), vec3(0.1, 1.0, 0.4)), 2.0));
    res = opU(res, vec2(sdBox(q-vec3(1.0, 0.5, 0.), vec3(0.1, 0.125, 1.0)), 2.0));
    q.xy = rotate(PI/6.0)*q.xy;
    res = opU(res, vec2(sdBox(q, vec3(1.0,0.1,0.5)), 2.0));
    return res;
}

vec2 castRay(in vec3 ro, in vec3 rd){
    float minD = 0.0;
    float maxD = 100.0;
    float threshold = 0.00001;

    float d=minD, m=-1.0;
    for(int i=0;i<100;i++){
        vec3 pos = ro+rd*d;
        vec2 tmp = map(pos);
        if(tmp.x<threshold || maxD<tmp.x) break;
        d += tmp.x*0.5;
        m = tmp.y;
    }
    if(maxD<d) m = -1.0;
    return vec2(d, m);
}



vec3 calcNormal(in vec3 p){
    vec2 e = vec2(1.0, -1.0)*0.00001;
    return normalize(vec3(
            e.xyy * map(p+e.xyy).x +
            e.yxy * map(p+e.yxy).x +
            e.yyx * map(p+e.yyx).x +
            e.xxx * map(p+e.xxx).x
        ));
}


vec3 render(in vec3 ro, in vec3 rd) {
    vec2 res = castRay(ro, rd);
    float d = res.x;
    float m = res.y;

    vec3 pos = ro + rd*d;
    vec3 nor = calcNormal(pos);

    vec3 lightPos = ro - vec3(0., .2, mix(-1.0, -10.0, usin(time)));
    vec3 lightDir = normalize(lightPos - pos);//vec3(1.0, 1.0, 1.0);
    //lightDir = normalize(vec3(1.0));

    vec3 color = vec3(0.3, 0.4, 0.5);
    if(m==0.0){
        color = vec3(clamp(dot(lightDir, nor), 0., 1.));
    }else if(m==1.0){
        color = vec3(clamp(dot(lightDir, nor), 0., 1.));
    }else if(m==2.0){
        color = vec3(clamp(dot(lightDir, nor), 0., 1.));
    }
    color *= exp(-0.1*d);

    return color;
}


mat3 lookAt(in vec3 eye, in vec3 tar, in float rot){
    vec3 cw = normalize(tar - eye);
    vec3 cp = vec3(sin(rot), cos(rot), 0.);
    vec3 cu = normalize(cross(cp, cw));
    vec3 cv = normalize(cross(cw, cu));
    return mat3(cu, cv, cw);
}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 color = vec3(0.);

    vec3 eye = vec3(1., 0.2, time);//10.0*time
    vec3 tar = eye + vec3(0., -0.2+0.3*sin(time*0.4), 1.);
    vec3 dir = normalize(lookAt(eye, tar, 0.2*sin(time*0.2+sin(time*0.3))) * vec3(p, 1.0));

    color = render(eye, dir);

    gl_FragColor = vec4(color, 1.0);
}
