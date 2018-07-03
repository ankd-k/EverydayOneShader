/*{
  frameskip: 1,
  vertexMode: "TRIANGLES",
  PASSES: [
    {
      fs: 'height.frag',
      TARGET: 'heightTexture',
      FLOAT: true,
    },
    {
      MODEL: {
        PATH: 'deer.obj',
        BLEND : 'ADD',
      },
      vs: '20180703.vert',
    }
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D heightTexture;

const float PI = 3.14159265359;

varying vec4 v_color;
varying vec3 v_position;
varying vec3 v_normal;

// float threshold(float value, float w){
//   return smoothstep()
// }

vec4 slice(float value, float threshold, float w, vec3 surfNorm){
  float v = smoothstep(threshold, threshold+w, value);
  // v = 1.-v;
  return v * v_color;
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  // カメラの位置と注視点を用いて視線を算出
  vec3 eyePosition = vec3(cos(t), -1., sin(t))*2.;
  vec3 eyeDirection = (v_position -1.0 * eyePosition);
  // 視線ベクトルを逆行列で修正
  vec3 invEye = normalize(vec4(eyeDirection, 1.0)).xyz;
  vec3 dest = vec3(0.);
  for(int i=0;i<1;i++){
    float fi = float(i);
    // ライトベクトルを逆行列で修正
    vec3 lightPosition = vec3(sin(t*fi*0.2), sin(t*fi*0.3), sin(t*fi*0.4));
    vec3 lightDirection = vec3(v_position - lightPosition);
    vec3 invLight = normalize(vec4(lightDirection, 1.0)).xyz;
    // ハーフベクトルを算出
    vec3 halfVector = normalize(invLight + invEye);
    // 拡散光の強度を算出
    float diff = clamp(dot(invLight, v_normal), 0.1, 1.0);
    // 反射光の強度を算出
    float spec = pow(clamp(dot(halfVector, v_normal), 0.0, 1.0), 20.0);
    // 最終出力カラー
    vec3 ambientColor = vec3(0.03);
    dest += v_color.rgb * diff + spec + ambientColor.rgb;
  }

  // gl_FragColor = vec4(color, 1.);
  // float value = v_position.x;
  // float w = 0.04;

  // color = slice(value, 0., w, vec3(1., 0., 0.)).rgb;

  // dest *= slice(value, 0., w, vec3(1., 0., 0.)).rgb;

  gl_FragColor = vec4(dest, 1.);
}
