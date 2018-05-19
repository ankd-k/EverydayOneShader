precision highp float;

uniform int FRAMEINDEX;
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const float PI = 3.14159265359;
const float PI2 = PI*2.;


float rand(vec2 n){
    return fract(sin(dot(n, vec2(12.9898,4.1414)))*43123.9897);
}


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



vec3 reset() {
    vec2 p = gl_FragCoord.xy / resolution * 100.;// p.x:theta, p.y:phi
    float s =  sin(p.y * PI);
    float x =  cos(p.x * PI2 + p.y) * s;
    float y = -cos(p.y * PI + p.x);
    float z =  sin(p.x * PI2 + p.y) * s;
    return normalize(vec3(x, y, z)) * 1.;
}

void main(){
    vec2 uv = gl_FragCoord.xy/resolution;
    if(FRAMEINDEX == 0){//init position
            vec3 newPosition = reset();
            float power = 0.;
            gl_FragColor = vec4(newPosition, power);
            return;
    }

    vec4 position = texture2D(positionTexture, uv);
    vec4 velocity = texture2D(velocityTexture, uv);

    vec3 newPosition = position.xyz + velocity.xyz;
    if(1.5<newPosition.y){
      newPosition = vec3(rand(newPosition.xy), rand(newPosition.yz), rand(newPosition.zx))*2.-1.;
      newPosition *= 0.8;
      // newPosition = reset();
    }
    // float power = noise2D(uv+vec2(mod(time,600.),0.))*0.1;
    float power = 0.01;
    gl_FragColor = vec4(newPosition, power);

}
