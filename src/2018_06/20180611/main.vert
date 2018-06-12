/*{
    "vertexCount": 36.,
    "vertexMode": "TRIANGLES",

    "PASSES":[
      {
        "fs": "camera.frag",
        "TARGET": "cameraTexture",
        "FLOAT": true,
      },
      {

      },
    ],
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D cameraTexture;
mat4 getCameraMatrix(){
    vec4 v0 = texture2D(cameraTexture, vec2(0.));
    vec4 v1 = texture2D(cameraTexture, vec2(0.25,0.));
    vec4 v2 = texture2D(cameraTexture, vec2(0.5,0.));
    vec4 v3 = texture2D(cameraTexture, vec2(0.75,0.));
    return mat4(
        v0.x, v0.y, v0.z, v0.w,
        v1.x, v1.y, v1.z, v1.w,
        v2.x, v2.y, v2.z, v2.w,
        v3.x, v3.y, v3.z, v3.w
    );
}

varying vec4 v_color;
varying vec3 v_pos;
varying vec3 v_normal;

const float PI = 3.14159265359;

vec3 cube(in float i, in vec3 p, in float r, out vec3 normal){
  vec3 res = vec3(0.);

  //
  float planeId = mod(i, 6.);// 平面内のid
  float planeNum = floor(i/6.);
  //
  vec4 index =
    planeNum<1. ? vec4(0.,1.,2.,3.) :// top
    planeNum<2. ? vec4(0.,1.,5.,4.):// front
    planeNum<3. ? vec4(1.,2.,6.,5.):// right
    planeNum<4. ? vec4(2.,3.,7.,6.):// back
    planeNum<5. ? vec4(3.,0.,4.,7.):// left
                  vec4(4.,5.,6.,7.);// bottom
  //
  float vi =
    planeId<1. ? index.x :
    planeId<2. ? index.y :
    planeId<3. ? index.z :
    planeId<4. ? index.z :
    planeId<5. ? index.w :
                 index.x ;

  res =
    vi<1. ? vec3(1., 1., 1.) :
    vi<2. ? vec3(1., 1., -1.) :
    vi<3. ? vec3(-1., 1., -1.) :
    vi<4. ? vec3(-1., 1., 1.) :
    vi<5. ? vec3(1., -1., 1.) :
    vi<6. ? vec3(1., -1., -1.) :
    vi<7. ? vec3(-1., -1., -1.) :
           vec3(-1., -1., 1.) ;

  res *= 0.5*r;

  normal =
    planeNum<1. ? vec3(0., 1., 0.) :// top
    planeNum<2. ? vec3(0., 0., 1.):// front
    planeNum<3. ? vec3(1., 0., 0.):// right
    planeNum<4. ? vec3(0., 0., -1.):// back
    planeNum<5. ? vec3(-1., 0., 0.):// left
                  vec3(0., -1., 0.);// bottom

  return res;
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }

vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v)
{
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


void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    pos = cube(vertexId, vec3(0.), 1., v_normal);

    pos += snoise(pos+vec3(t))*0.1;

    v_pos = pos;

    gl_Position = getCameraMatrix() * vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(1.);
}
