/*{
    "audio" : true,
    "keyboard": true,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform float volume;
uniform sampler2D spectrum;

#define PI 3.14159265359

uniform sampler2D backbuffer;
uniform sampler2D key;

mat2 rotate(float r){
    return mat2(
            cos(r), -sin(r),
            sin(r), cos(r)
        );
}
float lengthN(vec2 p, float n){
    vec2 tmp = pow(abs(p), vec2(n));
    return pow(tmp.x+tmp.y, 1./n);
}

float rand(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 78.233)))*43758.5453);
}

float getKey(){
    return
        texture2D(key, vec2(65./256.)).r>0. ? 65. :
        texture2D(key, vec2(66./256.)).r>0. ? 66. :
        texture2D(key, vec2(67./256.)).r>0. ? 67. :
        texture2D(key, vec2(68./256.)).r>0. ? 68. :
        texture2D(key, vec2(69./256.)).r>0. ? 69. :
        texture2D(key, vec2(70./256.)).r>0. ? 70. :
        texture2D(key, vec2(71./256.)).r>0. ? 71. :
        texture2D(key, vec2(72./256.)).r>0. ? 72. :
        texture2D(key, vec2(73./256.)).r>0. ? 73. :
        texture2D(key, vec2(74./256.)).r>0. ? 74. :
        texture2D(key, vec2(75./256.)).r>0. ? 75. :
        texture2D(key, vec2(76./256.)).r>0. ? 76. :
        texture2D(key, vec2(77./256.)).r>0. ? 77. :
        texture2D(key, vec2(78./256.)).r>0. ? 78. :
        texture2D(key, vec2(79./256.)).r>0. ? 79. :
        texture2D(key, vec2(80./256.)).r>0. ? 80. :
        texture2D(key, vec2(81./256.)).r>0. ? 81. :
        texture2D(key, vec2(82./256.)).r>0. ? 82. :
        texture2D(key, vec2(83./256.)).r>0. ? 83. :
        texture2D(key, vec2(84./256.)).r>0. ? 84. :
        texture2D(key, vec2(85./256.)).r>0. ? 85. :
        texture2D(key, vec2(86./256.)).r>0. ? 86. :
        texture2D(key, vec2(87./256.)).r>0. ? 87. :
        texture2D(key, vec2(88./256.)).r>0. ? 88. :
        texture2D(key, vec2(89./256.)).r>0. ? 89. :
        texture2D(key, vec2(90./256.)).r>0. ? 90. : -1.;
}

void main(){
    float t = mod(time, 600.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 p3 = vec3(p,0.);
    vec3 color = vec3(0.);

    //
    for(int i=0;i<9;i++){
        float theta = mod(t*0.5+float(i+1)*2.*PI/9., 2.*PI);
        float x = sin(theta*7.+0.23);
        float y = sin(theta*4.)*.75;

        // float freq = texture2D(spectrum, vec2(float(i)*0.015,0.)).r;
        // freq = 0.5;
        // freq = freq*freq*freq*freq;
        // color += 0.03*volume/255./length(p-vec2(x,y));
        color += 0.03/length(p-vec2(x,y));
    }

    p3.xy *= rotate(t*0.2);
    float w = getKey()<0. ? 10. : 10.+getKey()-64.;//aaaaaaaaaaaaaaaaaaa
    color *= step(sin(lengthN(p3.xy, 1.)*w*(1.)),-0.5);
    // color *= step(sin(lengthN(p3.xy, 1.)*10.*(volume/255.+1.)),-0.5);

    gl_FragColor = vec4(color, 1.);
    // gl_FragColor.rgb += texture2D(backbuffer, uv).rgb*0.4;
}
