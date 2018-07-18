/*{
    'vertexCount': 1000.,
    'vertexMode': 'POINTS',
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;

varying vec4 v_color;
varying float v_id;

const float PI = 3.14159265359;

void main(){
  // float t = mod(time, 60.);
  vec2 uv = vec2(
      mod(vertexId, resolution.x) / resolution.x,
      floor(vertexId / resolution.x) / (resolution.y)
  );
  uv = uv*2.-1.;
  uv.y += 1./resolution.y;
  // uv.y += 0.01;

  gl_Position = vec4(uv, 0., 1.);
  gl_PointSize = 1.;
  v_color = vec4(1.);
}
