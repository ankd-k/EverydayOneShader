/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define PI 3.14159265359

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
  float t = mod(time*0.5, 10.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  // p = abs(p);
  vec2 polar = vec2(length(p), atan(p.x/p.y)*t);
  polar = abs(polar);
  float c = sin(length(polar*50.0)*0.2);
  c += 1.5-length(p);
  color.r = c;
  color.g = c*(1.0-sin(abs(p.y)));
  // color = vec3(1.);
  color *= (noise(polar*100.*(vec2(2.3*noise(vec2(p.y, t*0.2)),4.7*noise(vec2(p.x, t*0.7))))));
  // color.b = abs(p.x);

  gl_FragColor = vec4(color, 1.);
}
