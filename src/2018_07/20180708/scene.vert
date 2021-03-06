/*{
vertexCount : 100000.,
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

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

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

uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;

varying vec4 v_color;

const float PI = 3.14159265359;

void main(){
  vec2 uv = vec2(
      mod(vertexId, resolution.x) / resolution.x,
      floor(vertexId / resolution.x) / resolution.y
  );

  vec4 position = texture2D(positionTexture, uv);
  vec4 velocity = texture2D(velocityTexture, uv);

  gl_Position = getCameraMatrix() * vec4(position.xyz, 1);
  // gl_PointSize = pointSize * max(position.w * 1.25, 0.75);
  gl_PointSize = 1.0;

  v_color = vec4(1.);
}
