/*{
    audio: true,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;


uniform float volume;
uniform sampler2D samples;
uniform sampler2D spectrum;

#define PI 3.14159265359

float usin(float x){
    return (sin(x)+1.)*.5;
}

mat2 rotate(float r){
    return mat2(
            cos(r), -sin(r),
            sin(r), cos(r)
        );
}

float dfSphere(vec3 p, float r){
    return length(p)-r;
}
float dfUBox(vec3 p, vec3 b){
    return length(max(abs(p-b),0.));
}
float dfSBox(vec3 p, vec3 b){
    vec3 d = abs(p)-b;
    return min(max(d.x, max(d.y, d.z)), 0.) + length(max(d, 0.));
}

vec3 opRep(vec3 p){
    vec3 c = vec3(1.);
    return mod(p, c)-c*.5;
    return mod(p-c*.5, c)-c*.5;
}
vec3 opRepNum(vec3 p){
    vec3 c = vec3(1.);
    return floor((p)/c);
    return floor((p+c*.5)/c);
}

float df(vec3 p){
    float freq[10];
    freq[0] = texture2D(spectrum, vec2(0.0)).r;
    freq[1] = texture2D(spectrum, vec2(0.1)).r;
    freq[2] = texture2D(spectrum, vec2(0.2)).r;
    freq[3] = texture2D(spectrum, vec2(0.3)).r;
    freq[4] = texture2D(spectrum, vec2(0.4)).r;
    freq[5] = texture2D(spectrum, vec2(0.5)).r;
    freq[5] = texture2D(spectrum, vec2(0.5)).r;
    freq[6] = texture2D(spectrum, vec2(0.6)).r;
    freq[7] = texture2D(spectrum, vec2(0.7)).r;
    freq[8] = texture2D(spectrum, vec2(0.8)).r;
    freq[9] = texture2D(spectrum, vec2(0.9)).r;



    vec3 q = opRep(p);
    vec3 n = opRepNum(p);
    // vec3 num = mod(n, 10.);
    float num = mod(n.x+n.y+n.z, 10.);
    float f = num<1.?freq[0]:
            num<2.?freq[1]:
            num<3.?freq[2]:
            num<4.?freq[3]:
            num<5.?freq[4]:
            num<6.?freq[5]:
            num<7.?freq[6]:
            num<8.?freq[7]:
            num<9.?freq[8]:freq[9];

    float s = dfSphere(q, 0.01 + f*f*f*1.);

    float num2 = mod(n.x+n.z, 2.);
    float a = num2<1.?1.:-1.;
    float w = pow(f,4.)*20.;
    float sbox = dfSBox(q-vec3(0.,0.,a*.5), vec3(0.001, 0.001, .5));
    sbox = min(sbox, dfSBox(q-vec3(a*.5,0.,0.), vec3(.5, 0.001, 0.001)));
    // sbox = min(sbox, dfSBox(q, vec3(0.001, 1., 0.001)));
    // return s;
    return min(sbox, s);
}

vec3 getNormal(vec3 p){
    vec2 d = vec2(0.001, 0.);
    return normalize(vec3(
            df(p+d.xyy)-df(p-d.xyy),
            df(p+d.yxy)-df(p-d.yxy),
            df(p+d.yyx)-df(p-d.yyx)
        ));
}


void main(){
    float t = mod(time, 600.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    // get spectrum


    vec3 camPos = vec3(10.*sin(t*.1),-10.*sin(t*.2),t*2.);
    vec3 dir = vec3(p, 1.);
    // dir.yz *= rotate(PI*0.5);
    t *= 0.1;
    dir.xy *= rotate(t);
    dir.yz *= rotate(t);
    dir.zx *= rotate(t);

    float d = 0.;
    for(int i=0;i<64;i++){
        float tmp = df(camPos + d*dir)*0.6;
        if(tmp<0.01)break;
        d += tmp;
    }
    vec3 ip = camPos + d*dir;

    // color += 1.-(vec3(0.03*d) + df(ip+0.1));
    // color *= 1./d*2.;

    vec3 normal = getNormal(ip);
    // color = normal;

    vec3 lightDir = normalize(vec3(1.));

    mat4 modelMat = mat4(1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.);
    mat4 invMatrix = mat4(1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.);
    vec3 invLight  = normalize(invMatrix * vec4(lightDir, 0.0)).xyz;
    vec3 invEye    = normalize(invMatrix * vec4(dir, 0.0)).xyz;
    vec3 halfLE    = normalize(invLight + invEye);
    vec4 ambientColor = vec4(vec3(0.1),1.);
    float diffuse   = clamp(dot(normal, invLight), 0.0, 1.0);
    float specular  = pow(clamp(dot(normal, halfLE), 0.0, 1.0), 1.);
    vec4  destColor = vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;
    // float attenuation = 1./ (1. + 20.*pow(length(lightPos-(modelMat*vec4(pos, 0.)).xyz), 2.));
    color += destColor.rgb;
    color *= 1./d*volume/255.*8.;
    color *= 1.-vec3(usin(p.x*0.5 + t*3.7), usin(p.y*0.3 + t*2.5), usin(0.7 + t*4.3));

    gl_FragColor = vec4(color, 1.);
}
