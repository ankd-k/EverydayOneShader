/*{
  "pixelRatio": 1.,
  "frameskip": 1.,
  "vertexCount": 1000000.,
  "vertexMode": "POINTS",

  "PASSES": [
    {
      fs: "camera.frag",
      TARGET: "cameraTexture",
      FLOAT: true,
    },
    {
      vs: './velocity.vert',
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
      "vs": "./scene.vert",
      "fs": "./scene.frag",
      TARGET: "sceneTexture",
      "BLEND": "ADD",
    },
    {

    },
  ],

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D sceneTexture;
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;

const float PI = 3.14159265359;

void main(){
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);


    gl_FragColor =
    (uv.x<0.5 ? (
        uv.y<0.5 ? texture2D(positionTexture, uv*2.) :
                   texture2D(velocityTexture, uv*2.-vec2(0., 1.))
                ):(
                  texture2D(sceneTexture, uv*vec2(2., 1.) - vec2(1., 0.))
        // uv.y<0.5 ? texture2D(sceneTexture, uv*2.-vec2(1.,0.)) :
        //             vec4(0.)
                )
    );

    // vec4 scene = texture2D(sceneTexture, uv);
    // gl_FragColor = scene;
}
