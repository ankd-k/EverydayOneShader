/*{
    "vertexCount": 1000.,
    "vertexMode": "LINES",
    "pixelRatio": 0.5,

    "PASSES":[
        {
            "vs" : "./20180510_01.vert",
            "TARGET": "vertTexture",
            BLEND : "ADD",
        },
        {
            BLEND : "ADD",
        },
    ]
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D vertTexture;


vec2 rand2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise2D(vec2 p){
	vec2 i = floor(p);
	vec2 f = fract(p);

	vec2 u = f * f * f * (10.0 + f * (-15.0 + 6.0 * f));

	return mix( mix( dot( rand2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
									 dot( rand2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
							mix( dot( rand2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
									 dot( rand2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}


void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    if(PASSINDEX == 0){
    }else {
        if(0.05<noise2D(vec2(t*4.,0.))){
            vec2 st = ((uv*2.-1.))*0.65-vec2(0.3,0.);
            st = (st+1.)*.5;
            gl_FragColor = texture2D(vertTexture, st);
            gl_FragColor.rgb = 1.-gl_FragColor.bgr;
            float tHigh = t*1000.;
            float a = step(-.9, sin(p.y*15.6+tHigh)+sin(p.y*8.3+tHigh) );
            // if(a==0.) gl_FragColor.rgb = gl_FragColor.rgb;
            gl_FragColor *= a;
        }else{
            gl_FragColor = texture2D(vertTexture, uv);
        }
    }

}
