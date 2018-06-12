/*{
  "pixelRatio": 1,
  "frameskip": 1,
  "vertexCount": 800000,
  "vertexMode": "POINTS",
  "PASSES": [
    {
      fs: "./velocity.frag",
      TARGET: "velocityTexture",
      FLOAT: true,
    },
    {
      fs: "./position.frag",
      TARGET: "positionTexture",
      FLOAT: true,
    },
	{
		fs: "./camera.frag",
		TARGET:"cameraTexture",
		FLOAT: true,
	},
    {
      vs: "./scene.vert",
      fs: "./scene.frag",
      TARGET: "sceneTexture",
      BLEND: "ADD",
    },
    {
    }
  ]
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D sceneTexture;
uniform sampler2D cameraTexture;

uniform sampler2D backbuffer;

float rand1D(float n) {
	return fract(sin(n * 43758.5453123));
}

float noise(float n){
	float i = floor(n);
	float f = fract(n);

	float u = f * f * f * (10.0 + f * (-15.0 + 6.0 * f));

	return mix(rand1D(i), rand1D(i+1.), u);
}

mat4 getEyeMatrix(){
    vec4 v0 = texture2D(cameraTexture, vec2(0.,0.5));
    vec4 v1 = texture2D(cameraTexture, vec2(0.25,0.5));
    vec4 v2 = texture2D(cameraTexture, vec2(0.5,0.5));
    vec4 v3 = texture2D(cameraTexture, vec2(0.75,0.5));
    return mat4(
        v0.x, v0.y, v0.z, v0.w,
        v1.x, v1.y, v1.z, v1.w,
        v2.x, v2.y, v2.z, v2.w,
        v3.x, v3.y, v3.z, v3.w
    );
}


void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    color.rgb = texture2D(sceneTexture, uv).rgb;
    float lenC = length(color);

    color *= vec3(0.5, 0.3, 0.2);
    color += lenC*1.2*vec3(0.9, 0.2, 0.);
    gl_FragColor = vec4(color, 1.);
    gl_FragColor += texture2D(backbuffer, uv)*0.8;
    // gl_FragColor.rgb *= clamp(2./length(p+vec2(0., .5)), 0., 1.);
    gl_FragColor.rgb *= 1.1-length(p*.8+vec2(0., .3))*0.2;
}
