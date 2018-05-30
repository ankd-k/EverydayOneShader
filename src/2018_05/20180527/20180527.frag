/*{
  pixelRatio : 1.,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D backbuffer;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

vec2 hash( in vec2 x )  // replace this by something better
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    x = x*k + k.yx;
    return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}
// return gradient noise (in x) and its derivatives (in yz)
vec3 noised( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );

#if 0
    // quintic interpolation
    vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
    vec2 du = 30.0*f*f*(f*(f-2.0)+1.0);
#else
    // cubic interpolation
    vec2 u = f*f*(3.0-2.0*f);
    vec2 du = 6.0*f*(1.0-f);
#endif

    vec2 ga = hash( i + vec2(0.0,0.0) );
    vec2 gb = hash( i + vec2(1.0,0.0) );
    vec2 gc = hash( i + vec2(0.0,1.0) );
    vec2 gd = hash( i + vec2(1.0,1.0) );

    float va = dot( ga, f - vec2(0.0,0.0) );
    float vb = dot( gb, f - vec2(1.0,0.0) );
    float vc = dot( gc, f - vec2(0.0,1.0) );
    float vd = dot( gd, f - vec2(1.0,1.0) );

    return vec3( va + u.x*(vb-va) + u.y*(vc-va) + u.x*u.y*(va-vb-vc+vd),   // value
                 ga + u.x*(gb-ga) + u.y*(gc-ga) + u.x*u.y*(ga-gb-gc+gd) +  // derivatives
                 du * (u.yx*(va-vb-vc+vd) + vec2(vb,vc) - va));
}

float terrain( in vec2 p )
{
  // return cos(p.x)*sin(p.y);
    float a = 0.0;
    float b = 0.8;
    vec2  d = vec2(0.0, 0.0);
    mat2 m = mat2(0.8,-0.6,0.6,0.8);
    for( int i=0; i<5; i++ )
    {
        vec3 n = noised(p*.25);
        d += n.yz;
        a += b*n.x/(1.0+dot(d,d));
        b *= 0.5;
        p = m*p*2.0;
    }
    return a*2.;
}

vec2 opU(vec2 a, vec2 b){
  return a.x<b.x ? a : b;
}

vec2 dfTerrain(vec3 p){
  vec2 mountain = vec2(terrain(p.xz), 1.);
  vec2 rake = vec2(0.1, 2.);
  return opU(rake, mountain) + vec2(p.y, 0.);
}

vec2 df(vec3 p){
  vec3 q = p;
  return dfTerrain(p);
}

float castRay(inout vec3 camPos, inout vec3 dir, out vec3 ip){
  float d = 0.;
  for(int i=0;i<38;i++){
    vec2 tmp = df(camPos + dir*d);
    if(tmp.x<0.02){
      ip = camPos + dir*d;
      dir = dir*d;
      return tmp.y;
    }
    d += tmp.x;
  }
  return -1.;
}

vec3 applyFog( in vec3  rgb,      // original color of the pixel
               in float dist, // camera to point distance
               in vec3  rayDir,   // camera to point vector
               in vec3  sunDir,  // sun light direction
               in vec3  rayOri)
{
    float b = 6.0*(0.8+0.1*sin(time));
    float c = .2;
    // float fogAmount = 1.0 - exp( -dist*b );
    float fogAmount = c * exp(-rayOri.y*b) * (1.0-exp( -dist*rayDir.y*b ))/rayDir.y;
    float sunAmount = max( dot( rayDir, sunDir ), 0.0 );
    vec3  fogColor  = mix( vec3(0.5,0.6,0.7), // bluish
                           vec3(1.0,0.9,0.7), // yellowish
                           pow(sunAmount,8.0) );
    fogColor = vec3(0.5,0.6,0.7);
    return mix( rgb, fogColor, fogAmount );
}

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    p *= 1.;

    vec3 camPos =  vec3(0., 1., t*0.5);
    // camPos.y = -terrain(camPos.xz)+0.2;
    vec3 dir = normalize(vec3(p, 1.));
    dir.yz *= rotate(0.3);

    vec3 ip;
    float d;
    float res = castRay(camPos, dir, ip);// raymarching loop
    if(-1.<res) {
      if(res==1.){
        color += vec3(d*0.03)+df(ip+0.4).x;
      }else{
        color += vec3(0.4,0.5,0.8);
      }
      color *= color;
      color = applyFog(color, length(dir), normalize(dir), normalize(vec3(0.4)), camPos);
      // color *= 1.6-length(dir)*0.1;
    }else{
      color += vec3(.01);
      color += mix(vec3(0.8,0.9,1.0), vec3(0.2,0.4,0.8), p.y);
    }



    gl_FragColor = vec4(color, 1.);
    // gl_FragColor += texture2D(backbuffer, uv)*0.999;
}
