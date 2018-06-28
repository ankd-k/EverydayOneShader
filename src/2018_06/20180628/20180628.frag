/*{
  frameskip: 1,
  vertexMode: "TRIANGLES",
  PASSES: [
  {
    fs: 'mtl.frag',
    TARGET: 'material',
  },
  {
    MODEL: {
      PATH: 'deer.obj',
    },
    vs: '20180628.vert',
    fs: '20180628.frag',
    TARGET: 'pass1',
    BLEND: 'ADD',
  }, {
  }],
}*/
precision mediump float;
uniform float time;
uniform int PASSINDEX;

uniform sampler2D material;

uniform sampler2D pass1;
uniform sampler2D backbuffer;
uniform vec2 resolution;
varying vec2 vUv;

varying vec4 v_color;
varying float vObjectId;
// varying vec3 vPosition;
// varying vec3 vNormal;

vec2 rot(in vec2 p, in float t) {
  float s = sin(t);
  float c = cos(t);
  return mat2(s, c, -c, s) * p;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  // vec3 n = vPosition;// error!
  // vec2 tmp = vUv;

  if(PASSINDEX == 1){
    gl_FragColor = texture2D(material, vUv);
    // vec3 eyePos;
    // eyePos.xz = rot(vec2(1., 0.), time*0.2);
    // eyePos.y = 0.;
    // vec3 eyeDir = -1.*eyePos;
    // vec3 invEye = eyeDir;
    // vec3 lightDir = normalize(vec3(1.));
    // vec3 invLight = lightDir;
    // vec3 halfV = normalize(invLight + invEye);
    // float diff = clamp(dot(invLight, vNormal), 0., 1.);
    // float spec = pow(clamp(dot(halfV, vNormal), 0., 1.), 20.);
    // gl_FragColor.rgb = gl_FragColor.rgb*diff + spec + vec3(0.3);
  }
  else if (PASSINDEX == 2) {
    gl_FragColor = texture2D(pass1, uv)*1.2;
    if(gl_FragColor.a < 0.1) gl_FragColor += texture2D(material, uv)*0.3;
    vec3 c = vec3(sin(time*0.924)*0.2, sin(time*0.737), sin(0.819));
    gl_FragColor.rgb += texture2D(backbuffer, uv).rgb*c*0.7;
  }
}
