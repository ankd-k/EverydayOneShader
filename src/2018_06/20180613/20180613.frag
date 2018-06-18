/*{
  "vertexCount": 9000.,
  "vertexMode": "LINE_STRIP",

  "PASSES":[
    {
      // "vs": "20180613.vert",
      "fs": "20180613.frag",
      "BLEND": "ADD",
      "TARGET": "buff",
    },
    {

    },
  ],


  "IMPORTED":{
    "img":{
      "PATH": "./data/ashita_honki.png",
    },
  },
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D img;

uniform int PASSINDEX;
uniform sampler2D buff;

varying vec4 v_color;

const float PI = 3.14159265359;


float ease_in(float x, float n){
  return pow(x, n);
}
float ease_out(float x, float n){
  return 1.-pow(1.-x, n);
}
float ease_inout(float x, float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*ease_in(x2, n) : 0.5+0.5*ease_out(x2-1., n);
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}



void main(){
    float t = mod(time*0.25, 60.);
    float tf = fract(t);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.01);

    if(PASSINDEX==0){
      // gl_FragColor = v_color;
      // gl_FragColor = vec4(vec3(sin(uv.y*5176.657)*sin(t*467.2327+46774.126)), 1.);
      gl_FragColor = vec4(1.);
      gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(3.));
      gl_FragColor.rgb *= texture2D(img, uv*vec2(1.2,2.)-vec2(0.12, 0.65)).rgb+0.001;

    }else{
      float pct = ease_inout(tf, 4.);
      float pct2 = 1.-pct;
      uv.y = abs(uv.y*2.-1.)-(-1.+0.5*pct);
      uv.y *= 0.8;
      if(snoise(vec2(t*10.))<-0.1)uv.y += sin(snoise(vec2(uv.x*20., t*40.)))*0.25;
      if(p.y<0.) {
        uv.x -= abs(p.y*0.3);
        uv.x += sin(tf*20.+uv.y*35.+uv.x*35.)*0.01;
      }
      vec4 res = texture2D(buff, uv) * (p.y<0.?0.2:1.);
      res.a = 1.;
      vec4 res2 = 1.-res;
      res2.a = 1.;
      gl_FragColor = pct2*res + pct*res2;
      gl_FragColor *= pct;

    }
}
