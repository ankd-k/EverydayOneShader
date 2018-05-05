/*{
    "frameskip": 1.,

    "vertexCount": 6000,
    "vertexMode": "LINE_LOOP",

    "PASSES":[
        {
            "vs": "./20180505.vert",
            "TARGET": "vertTexture",
        },
        {

        },
    ]
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec4 v_color;

uniform int PASSINDEX;
uniform sampler2D vertTexture;


void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    if(PASSINDEX == 0){
    }else{
        // vec2 p = (gl_FragCoord.xy*2.-resolution)/max(resolution.x, resolution.y);
        // gl_FragColor = texture2D(vertTexture, abs(p));
        gl_FragColor = texture2D(vertTexture, uv);
        gl_FragColor.rgb *= clamp(.6/length(p), 0., 2.);
    }
}
