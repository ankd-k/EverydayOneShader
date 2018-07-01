/*{
    "vertexCount": 720.,
    "vertexMode": "TRIANGLES",

    "PASSES":[a
      {
        fs: 'camera.frag',
        TARGET: 'cameraTexture',
        FLOAT: true,
      },
      {
        vs: '20180701.vert',
        // BLEND: 'ADD',
      },
    ],
}*/precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

varying vec4 v_color;
varying vec3 v_position;
varying vec3 v_normal;


void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  // gl_FragColor = vec4(color, 1.);
  // gl_FragColor = v_color;


  // カメラの位置と注視点を用いて視線を算出
  vec3 eyePosition = vec3(cos(t), -1., sin(t));
  vec3 eyeDirection = (v_position -1.0 * eyePosition);
  // 視線ベクトルを逆行列で修正
  vec3 invEye = normalize(vec4(eyeDirection, 1.0)).xyz;
  vec3 dest = vec3(0.);
  for(int i=0;i<3;i++){
    float fi = float(i);
    // ライトベクトルを逆行列で修正
    vec3 lightPosition = vec3(sin(t*fi));
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
  gl_FragColor += vec4(dest, v_color.a);
}
