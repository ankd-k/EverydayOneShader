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

    vec3 newVelocity = velocity.xyz;

    // for(int i=0;i<1000;i++){
    //   float fi = float(i);
    //   vec2 st = vec2(
    //       mod(fi, resolution.x)/resolution.x,
    //       floor(fi/resolution.x)/resolution.y
    //     );
    //   vec4 target = texture2D(positionTexture, st);
    //   newVelocity += target.xyz - position.xyz;
    // }

    bool inArea = uv.x<(mod(vertexCount, resolution.x)/resolution.x) && uv.y<(floor(vertexCount/resolution.x)/resolution.y);
    // inArea = true;
    gl_FragColor = vec4(normalize(newVelocity), (inArea ? 1. : 0.));
    // gl_FragColor = vec4(normalize(newVelocity), 1.);
  }


}
