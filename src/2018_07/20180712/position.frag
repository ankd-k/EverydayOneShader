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

const float PI = 3.14159265359;

float random(vec2 n){
  return fract(sin(dot(n+vec2(0.01), vec2(12.9898, 4.1414)))*43213.9879);
}

vec4 reset(){
  float theta = 2.*PI*random(gl_FragCoord.xy+vec2(time*0.3457, time*0.4591));
  float phi = PI*random(gl_FragCoord.xy+vec2(time*0.2834, time*0.6971)) - PI*0.5;
  float r = random(gl_FragCoord.xy+vec2(time*0.0185, time*0.9853));
  vec3 pos;
  pos.x = r * cos(phi)*cos(theta);
  pos.y = r * sin(phi);
  pos.z = r * cos(phi)*sin(theta);

  float life = 600.*random(gl_FragCoord.xy + vec2(time));
  return vec4(pos, life);
}

// float df(vec3 p){
//   return length(p) - ;
// }



void main(){
  if(FRAMEINDEX==0){
    gl_FragColor = reset();
  }else{
    vec2 uv = gl_FragCoord.xy/resolution;
    vec4 position = texture2D(positionTexture, uv);
    vec4 velocity = texture2D(velocityTexture, uv);

    float speed = 0.09;
    vec4 newPosition;
    float newLife = position.w-1.;
    newPosition = newLife>0. ? vec4(position.xyz + speed*velocity.xyz, newLife) : reset();

    float r = 0.5+random(gl_FragCoord.xy)*0.6;
    if(0. < length(newPosition.xyz) - r){
    // if(0. < length(max(abs(newPosition.xyz)-r, 0.)) ){
      newPosition.xyz = normalize(newPosition.xyz) * r;
    }
    gl_FragColor = newPosition;
  }
}
