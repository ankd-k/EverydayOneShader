/*{
    "PASSES":[
        {
            "TARGET": "buff"
        },
        {},
    ]
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D buff;

float rand(vec2 n){
    return fract(sin(dot(n, vec2(12.8989,4.1414)))*41234.89726);
}

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    if(PASSINDEX==0){
        vec2 q = p;
        q.x -= cos(t*1.3);
        q.x *= 10.;
        color += sin((q.x*t+t)*1.);

        color *= .2/length(p);
        gl_FragColor = vec4(color, 1.);
    }else{
        if(0.5<sin(sin(t))) {
            float tmp = floor(rand(vec2(t,0.))*10.)*0.1;
            tmp = tmp*2.-1.;
            uv.x += tmp;
        }
        gl_FragColor = texture2D(buff, uv)*((1.-0.5*rand(vec2(t,0.))/length(p))*vec4(0.,1.,0.,1.));
    }
}
