/*{
  "pixelRatio": 1.,
  "vertexCount": 1500.,
  "vertexMode": "LINES",
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec4 v_color;

#define PI 3.1415926535

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main(){
  float t = mod(time, 600.);
  vec3 pos = vec3(0.);

  float num = 5.;
  float count = vertexCount/num;


  float id = mod(vertexId, count)/count;
  float l = floor(vertexId/count);


  // float id = vertexId/vertexCount;
  id *= 200.*cos(t*0.7*(l+1.));

  float r = sin(t*0.37 * (l+1.)*PI*0.4);
  float tx = t * 0.7 * (l+1.)*0.48 + l * 1.2;
  float ty = t * 1.3 * (l+1.)*0.67 + l * .68;
  pos = r*vec3(cos(id*2.*PI+tx), sin(id*2.*PI+ty), 0.);


  gl_Position = vec4(pos, 1.);
  gl_Position.x *= resolution.y/resolution.x;
  gl_PointSize = 1.;

  v_color = vec4(vec3(0.1, 0.4, 0.9), 1.);

}
