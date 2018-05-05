/*{
    audio: true,

}*/
precision mediump float;

#define PI 3.14159265359

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// sound
uniform float volume;
uniform sampler2D samples;
uniform sampler2D spectrum;

float random(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43123.9878);
}

mat2 rotate(float r){
    return mat2(
            cos(r), -sin(r),
            sin(r), cos(r)
        );
}

//easing-------------------------------------------------------------------------------------------------
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
//easing-------------------------------------------------------------------------------------------------

float dfSphere(vec3 p, float r){
    return length(p)-r;
}
float dfUBox(vec3 p, vec3 b){
    return length(max(abs(p)-b, 0.));
}
float dfSBox(vec3 p, vec3 b){
    vec3 d = abs(p)-b;
    return min(max(d.x, max(d.y, d.z)), 0.)+ length(max(d, 0.));
}


vec3 opRep(vec3 p){
    vec3 c = vec3(2.);
    // return mod(p-c*.5, c) - c*.5;
    return mod(p, c) - c*.5;
}
vec3 opRepL(vec3 p){
    vec3 c = vec3(2.);
    return floor(p/c);
}


float df(vec3 p){
    float t = mod(time*0.25, 600.);
    float tr = fract(t);
    float tl = floor(t);
    vec3 camPos = vec3(0., 0.1, t*10.);

    float spe0 = texture2D(spectrum, vec2(0.6,0.)).r;
    float spe1 = texture2D(spectrum, vec2(0.4,0.)).r;
    float spe2 = texture2D(spectrum, vec2(0.2,0.)).r;
    float spe3 = texture2D(spectrum, vec2(0.4,0.)).r;
    float spe4 = texture2D(spectrum, vec2(0.6,0.)).r;

    vec3 q = p;

    float speBox0 = dfSBox(q-camPos-vec3(-1., 0., 1.4-1.5*volume/255.), vec3(0.05, 2.*spe0, 0.05));
    // float speBox1 = dfUBox(p-camPos-vec3(-.5, 0., 1.4-1.5*volume/255.), vec3(0.05, 2.*spe1, 0.05));
    // float speBox2 = dfUBox(p-camPos-vec3(0., 0., 1.4-1.5*volume/255.), vec3(0.05, 2.*spe2, 0.05));
    // float speBox3 = dfUBox(p-camPos-vec3(.5, 0., 1.4-1.5*volume/255.), vec3(0.05, 2.*spe3, 0.05));
    // float speBox4 = dfUBox(p-camPos-vec3(1., 0., 1.4-1.5*volume/255.), vec3(0.05, 2.*spe4, 0.05));

    // float speBox = min(speBox0, min(speBox1, min(speBox2, min(speBox3, speBox4))));
    // float speBox = speBox0;

    q = opRep(p);
    // q.xy *= rotate(sign(p.x)*time);
    // q.yz *= rotate(sign(p.y)*time);
    float ubox = dfUBox(q, vec3(0.01, 0.01, 0.8));
    // return speBox0;
    // return min(ubox, speBox);
    return ubox;
}


void main(){
    float t = mod(time*0.25, 600.);
    float tr = fract(t);
    float tl = floor(t);

    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    vec3 camPos = vec3(0., 0.1, t*10.);
    vec3 dir = vec3(p, 1.);
    float start = random(vec2(tl, 0.));
    float goal = random(vec2(tl+1., 0.));
    float pct = ease_inout(clamp(tr*3., 0., 1.));
    float rot = (1.-pct)*start + pct*goal;
    rot *=  2.*PI;
    dir.xy *= rotate(rot*1.6);
    dir.yz *= rotate(rot*.4);
    dir.zx *= rotate(-rot*1.5);

    float d = 0.;
    for(int i=0;i<64;i++){
        float tmp = df(camPos + d*dir)*0.4;
        if(tmp<0.01)break;
        d += tmp;
    }
    vec3 ip = camPos + d*dir;
    vec3 repIp = opRep(ip);
    vec3 repIpL = opRepL(ip);
    float id = random(vec2(dot(repIpL.xy, repIpL.yz),dot(repIpL.yz,repIpL.zx)));

    color += 1.-(vec3(0.003*d)+df(ip+0.1));
    color *= 1./d*.2;
    vec3 lightPos = opRep(ip+vec3(0.,0.,  1.5*(ease_inout(fract(t*2.+id*1.75))*2.-1.)));// ease_inout(tr)*
    // vec3 lightPos = opRep(ip+vec3(0.,0., t*16.+id*1.75));// ease_inout(tr)*
    color *= lightPos.z * id * 10.;
    // color *= volume/255.;

    gl_FragColor = vec4(color, 1.);
}
