/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D backbuffer;

const float PI = 3.14159265359;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 voronoi( in vec2 x , in float seed) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    // first pass: regular voronoi
    vec2 mg, mr;
    float md = 8.0;
    for (int j= -1; j <= 1; j++) {
        for (int i= -1; i <= 1; i++) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = random2( n + g );
            o = 0.5 + 0.5*sin( seed + 6.2831*o );

            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d<md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    // second pass: distance to borders
    md = 8.0;
    for (int j= -2; j <= 2; j++) {
        for (int i= -2; i <= 2; i++) {
            vec2 g = mg + vec2(float(i),float(j));
            vec2 o = random2( n + g );
            o = 0.5 + 0.5*sin( seed + 6.2831*o );

            vec2 r = g + o - f;

            if ( dot(mr-r,mr-r)>0.00001 ) {
                md = min(md, dot( 0.5*(mr+r), normalize(r-mr) ));
            }
        }
    }
    return vec3(md, mr);
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414))));
}

float usin(float x){
  return 0.5+0.5*sin(x);
}
float ucos(float x){
  return 0.5+0.5*cos(x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){
  float t = mod(time, 600.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  float r = 0.08;

  vec2 pos;
  for(int i=0;i<50;i++){
    float fi = float(i+1);
    pos = (0.25+0.5*vec2(ucos(t),usin(t))) + r*vec2(cos(t*random(vec2(fi+1.))*1.01597), sin(t*random(vec2(fi+8.))*1.45971));
    pos = mouse + r*vec2(cos(100.*random(vec2(fi+1.))*10.01597), sin(100.*random(vec2(fi+8.))*1.45971));
    color += smoothstep(0.2, 1., 0.005+0.005*sin(fi+t)/length(uv-pos)) * hsv2rgb(vec3(random(vec2(fi*10.)), 0.5+0.5*random(vec2(fi+100.)), 1.));
  }
  vec4 bb = 1.-texture2D(backbuffer, uv);
  color += bb.rgb*0.98;

  color = 1.-color;
  gl_FragColor = vec4(color, 1.);
  // gl_FragColor = vec4(1.);
}
