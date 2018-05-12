precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int FRAMEINDEX;
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;

const float PI = 3.14159265359;

float rand(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43123.9878);
}

void main(){
    vec2 uv = gl_FragCoord.xy/resolution;
    if(FRAMEINDEX==0){// init velocity
        float angle = rand(uv)*2.*PI;
        vec3 vec = normalize(vec3(cos(angle), sin(angle), rand(uv)*2.-1.))*0.02;
        gl_FragColor = vec4(vec, 1.);
        return ;
    }

    vec4 position = texture2D(positionTexture, uv);
    vec4 velocity = texture2D(velocityTexture, uv);


    float theta = mod(time, 2.*PI)*1.;
    float A = 1.;
    float a = 1.;
    float alpha = 0.;
    float B = 1.;
    float b = 1.;
    float beta = 0.;
    float C = 1.;
    float c = 2.;
    float gamma = 0.;

    float x = A*cos(a*theta + alpha);
    float y = B*sin(b*theta + beta);
    float z = C*sin(c*theta + gamma);
    // z = 0.;
    vec3 p = normalize(vec3(x,y,z))*.5;

    vec3 angle = p-position.xyz;
    float power = position.w;
    vec3 newVelocity = velocity.xyz + normalize(angle)*power;
    newVelocity *= .999;
    // newVelocity *= 1./length(newVelocity);

    gl_FragColor = vec4(newVelocity, 0.);
}
