/*{
  "PASSES":[
    {
      "fs": "./generic.frag",
      "TARGET": "genericTexture",
    },
    {
      "fs": "./perlin.frag",
      "TARGET": "perlinTexture",
    },
    {
      "fs": "./simplex.frag",
      "TARGET": "simplexTexture",
    },
    {
      "fs": "./otherNoise.frag",
      "TARGET": "otherTexture",
    },
    {}
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

uniform int PASSINDEX;
uniform sampler2D genericTexture;
uniform sampler2D perlinTexture;
uniform sampler2D simplexTexture;
uniform sampler2D otherTexture;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    gl_FragColor =
      mouse.y<0.25 ? texture2D(genericTexture, uv) :
      mouse.y<0.50 ? texture2D(perlinTexture, uv) :
      mouse.y<0.75 ? texture2D(simplexTexture, uv) : texture2D(otherTexture, uv);
}
