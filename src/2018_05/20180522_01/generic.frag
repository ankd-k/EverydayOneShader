/*{
  "keyboard": true,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D key;

float getKey(){
  float res =
        // number
        texture2D(key, vec2(48./256.)).r>0. ? 48. :
        texture2D(key, vec2(49./256.)).r>0. ? 49. :
        texture2D(key, vec2(50./256.)).r>0. ? 50. :
        texture2D(key, vec2(51./256.)).r>0. ? 51. :
        texture2D(key, vec2(52./256.)).r>0. ? 52. :
        texture2D(key, vec2(53./256.)).r>0. ? 53. :
        texture2D(key, vec2(54./256.)).r>0. ? 54. :
        texture2D(key, vec2(55./256.)).r>0. ? 55. :
        texture2D(key, vec2(56./256.)).r>0. ? 56. :
        texture2D(key, vec2(57./256.)).r>0. ? 57. : //
        // // alphabet LARGE
        texture2D(key, vec2(65./256.)).r>0. ? 65. : -1.;//
        // texture2D(key, vec2(66./256.)).r>0. ? 66. :
        // texture2D(key, vec2(67./256.)).r>0. ? 67. :
        // texture2D(key, vec2(68./256.)).r>0. ? 68. :
        // texture2D(key, vec2(69./256.)).r>0. ? 69. :
        // texture2D(key, vec2(70./256.)).r>0. ? 70. :
        // texture2D(key, vec2(71./256.)).r>0. ? 71. :
        // texture2D(key, vec2(72./256.)).r>0. ? 72. :
        // texture2D(key, vec2(73./256.)).r>0. ? 73. :
        // texture2D(key, vec2(74./256.)).r>0. ? 74. :
        // texture2D(key, vec2(75./256.)).r>0. ? 75. :
        // texture2D(key, vec2(76./256.)).r>0. ? 76. :
        // texture2D(key, vec2(77./256.)).r>0. ? 77. :
        // texture2D(key, vec2(78./256.)).r>0. ? 78. :
        // texture2D(key, vec2(79./256.)).r>0. ? 79. :
        // texture2D(key, vec2(80./256.)).r>0. ? 80. :
        // texture2D(key, vec2(81./256.)).r>0. ? 81. :
        // texture2D(key, vec2(82./256.)).r>0. ? 82. :
        // texture2D(key, vec2(83./256.)).r>0. ? 83. :
        // texture2D(key, vec2(84./256.)).r>0. ? 84. :
        // texture2D(key, vec2(85./256.)).r>0. ? 85. :
        // texture2D(key, vec2(86./256.)).r>0. ? 86. :
        // texture2D(key, vec2(87./256.)).r>0. ? 87. :
        // texture2D(key, vec2(88./256.)).r>0. ? 88. :
        // texture2D(key, vec2(89./256.)).r>0. ? 89. :
        // texture2D(key, vec2(90./256.)).r>0. ? 90. : -1.;

  return res;
}

const float PI = 3.14159265359;
//----------------------------------------------------------------------------------------------



float randA(float n){return fract(sin(n) * 43758.5453123);}

float randB(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noiseA1(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(randA(fl), randA(fl + 1.0), fc);
}

float noiseA2(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(randB(b), randB(b + d.yx), f.x), mix(randB(b + d.xy), randB(b + d.yy), f.x), f.y);
}

//--------------
float noiseB(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);

	float res = mix(
		mix(randB(ip),randB(ip+vec2(1.0,0.0)),u.x),
		mix(randB(ip+vec2(0.0,1.0)),randB(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}
//--------------

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noiseC(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}
//--------------

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noiseD1(float x) {
	float i = floor(x);
	float f = fract(x);
	float u = f * f * (3.0 - 2.0 * f);
	return mix(hash(i), hash(i + 1.0), u);
}

float noiseD2(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);

	// Four corners in 2D of a tile
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));

	// Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// This one has non-ideal tiling properties that I'm still tuning
float noise(vec3 x) {
	const vec3 step = vec3(110, 241, 171);

	vec3 i = floor(x);
	vec3 f = fract(x);

	// For performance, compute the base input to a 1D hash from the integer part of the argument and the
	// incremental change to the 1D based on the 3D -> 1D wrapping
    float n = dot(i, step);

	vec3 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}
//--------------


//----------------------------------------------------------------------------------------------
const float interbal = 1.;
const float modeNum = 6.;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    float mode;

    float wise = 1./modeNum;

    // float k = getKey();
    // // gl_FragColor = texture2D(key, uv); 111112343211111
    // if(47.<k && k<58.) mode = k-48.;
    color +=
       mouse.x<wise*1. ? noiseA1(uv.x*20.) :
       mouse.x<wise*2. ? noiseA2(uv*20.) :
       mouse.x<wise*3. ? noiseB(uv*20.) :
       mouse.x<wise*4. ? noiseC(vec3(uv*20., 0.)) :
       mouse.x<wise*5. ? noiseD1(uv.x*20.) :
       mouse.x<wise*6. ? noiseD2(uv*20.) : -1.;

    gl_FragColor = vec4(color, 1.);
}
//
