/*{
  "glslify": true,

  "pixelRatio": 0.5,
  "vertexCount": 1000000.,
  "vertexMode": "POINTS",

  "PASSES":[
    {
      "vs": "./20180413_03.vert",
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

uniform int PASSINDEX;
uniform sampler2D vertTexture;

varying vec4 v_color;

vec2 rand2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}
float noise(vec2 p){
	vec2 i = floor(p);
	vec2 f = fract(p);

	vec2 u = f * f * f * (10.0 + f * (-15.0 + 6.0 * f));

	return mix( mix( dot( rand2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
									 dot( rand2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
							mix( dot( rand2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
									 dot( rand2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main(){
  float t = mod(time*1., 600.);
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec3 color = vec3(0.);

  if(PASSINDEX==0){
    // gl_FragColor = v_color;
  }else{
    if(noise(vec2(t*2.,0.))<0.0) gl_FragColor = texture2D(vertTexture, uv);
    else gl_FragColor = texture2D(vertTexture, uv*0.8+vec2(0.1)+vec2(0., sin(uv.x*10.+t)*0.1));
    gl_FragColor.rgb = vec3(1.)-gl_FragColor.rgb;
    color += 1.2-length(p*0.6);
    gl_FragColor *= vec4(color, 1.);
    // if(noise(vec2(t*2., 0.))<0.) gl_FragColor.rgb = vec3(1.)-gl_FragColor.rgb;
    // gl_FragColor = vec4(1.,1.,0.,1.);
  }
}
