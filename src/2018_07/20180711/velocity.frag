/*{
vertexCount : 100.,
vertexMode: 'POINTS',

PASSES:[
  {
    fs : 'camera.frag',
    TARGET : 'cameraTexture',
    FLOAT : true,
  },
  {
    fs : 'position.frag',
    TARGET : 'positionTexture',
    FLOAT : true,
  },
  {
    vs : 'velocity.vert',
    fs : 'velocity.frag',
    TARGET : 'velocityTexture',
    FLOAT : true,
  },
  {
    vs : 'scene.vert',
    fs : 'scene.frag',
  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;

uniform int FRAMEINDEX;

varying vec4 v_color;
varying float v_id;
uniform float vertexCount;

const float PI = 3.14159265359;

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43213.9678);
}
vec3 random3(vec2 n){
  return vec3(
      random(n + vec2(8.567416, 1.16576))*2.-1.,
      random(n + vec2(28.892416, 85.34571))*2.-1.,
      random(n + vec2(69.0974657, 73.57984))*2.-1.
    );
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
vec3 snoise3(vec3 v){
  return vec3(
      snoise(v + vec3(18.2539, 1.467432, 81.45743)),
      snoise(v + vec3(45.465741, 394.46571, 7.365759)),
      snoise(v + vec3(5.316987112, 95.45974,2.1972823))
    );
}


vec4 reset(){
  return vec4(normalize(random3(gl_FragCoord.xy/resolution)), 1.);
}

/*
  velocity
  xyz : velocity vector
  w : -
*/
void main(){
  if(FRAMEINDEX==0){
    gl_FragColor = reset();
  }else{
    vec2 uv = gl_FragCoord.xy/resolution;
    vec4 position = texture2D(positionTexture, uv);
    vec4 velocity = texture2D(velocityTexture, uv);

    vec3 newVelocity = velocity.xyz + snoise3(position.xyz*2.+time*0.5)*0.5;// - vec3(0., 0.4, 0.);

    // if(1.<length(position.xyz)) newVelocity = -position.xyz;


    bool inArea = uv.x<(mod(vertexCount, resolution.x)/resolution.x) && uv.y<(floor(vertexCount/resolution.x)/resolution.y);
    gl_FragColor = vec4(normalize(newVelocity), (inArea ? 1. : 0.));
  }


}
