/*{
    "osc": 5000,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// uniform sampler2D osc_mousex;
// uniform sampler2D osc_mousey;
uniform sampler2D osc_test;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    float x = texture2D(osc_test, vec2(0.,0.)).x;
    float y = texture2D(osc_test, vec2(0.5,0.)).x;

    // gl_FragColor = texture2D(osc_test, uv);
    gl_FragColor = vec4(vec3(x,y,0.), 1.);
}
