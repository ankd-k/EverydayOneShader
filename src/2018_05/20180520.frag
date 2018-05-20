/*{
  "PASSES":[
    {
      "TARGET": "rmTexture",
    },
    {

    },
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D rmTexture;

const float PI = 3.14159265359;

float usin(float x){
	return 0.5+0.5*sin(x);
}

mat2 rotate(float r){
	return mat2(cos(r), -sin(r), sin(r), cos(r));
}

float random(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float ease_in(float x){
  return pow(x, 5.0);
}

float ease_out(float x){
  return 1.0-pow(1.0-x, 5.0);
}

float ease_inout(float x){
  float x2 = x*2.0;
  float ret = 0.;
  if(x2<1.0){
    ret = ease_in(x2)*0.5;
  }else{
    ret = 0.5*(1.0+ease_out(x2-1.0));
  }
  return ret;
}


// ray marching

float dfUBox(vec3 p, vec3 b){
  return length(max(abs(p)-b, 0.));
}

float dfSBox(vec3 p, vec3 b){
  vec3 d = abs(p)-b;
  return min(max(d.x, max(d.y,d.z)), 0.) + length(max(d, 0.));
}

// vec2 opU(vec2 d1, vec2 d2){
//
// }

vec3 opRep(vec3 p, vec3 c){
  return mod(p - 0.5*c, c)-.5*c;
}
vec3 opRepN(vec3 p, vec3 c){
  return floor((p-0.5*c) / c);
}

float df(vec3 p, out vec3 col){
	vec3 c = vec3(4., 2., 4.);
  vec3 q = opRep(p, c);
	vec3 n = opRepN(p, c);

  float frame = max(dfSBox(q, vec3(2.,1.,0.06)), -dfSBox(q, vec3(1.,0.8,.8)));

	float x;
	x = ease_out(clamp(fract(time*0.125+step(mod(n.z, 2.), 0.)*0.5)*2.-1., 0., 1.));

	float doorL = max(dfSBox(q+vec3(1.+x,0.,0.), vec3(1.,0.9,0.02)), -dfSBox(q+vec3(.1+x,0.,0.1), vec3(0.04,0.08,0.2)));
	float doorR = max(dfSBox(q-vec3(1.+x,0.,0.), vec3(1.,0.9,0.02)), -dfSBox(q-vec3(.1+x,0.,0.1), vec3(0.04,0.08,0.2)));
	float door = min(doorL, doorR);

	float hole = 10.;
	float paper = 10.;
	for(int i=0;i<4;i++){
		for(int j = 0;j<3;j++){
		 	hole = min(hole, dfSBox(q+vec3(.35+float(j)*0.25+x,.6-float(i)*0.4,0.), vec3(0.08,0.12,0.022)));
			hole = min(hole, dfSBox(q-vec3(.35+float(j)*0.25+x,.6-float(i)*0.4,0.), vec3(0.08,0.12,0.022)));
			paper = min(paper, dfSBox(q+vec3(.35+float(j)*0.25+x,.6-float(i)*0.4,0.0), vec3(0.08,0.12,0.01)));
			paper = min(paper, dfSBox(q-vec3(.35+float(j)*0.25+x,.6-float(i)*0.4,0.0), vec3(0.08,0.12,0.01)));
		}
	}

	float res;
	door = max(door, -hole);
	res = min(door, paper);
	res = min(res, frame);

	if(frame<door){
		col = vec3(0.14,0.08,0.04);
	}else{
		if(door<paper) col = vec3(0.7,0.355,0.1);
		else col = vec3(1.);
	}

	return res;
}

float df(vec3 p){
	vec3 col;
	return df(p, col);
}

//



void main(){
    float t = mod(time, 600.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    if(PASSINDEX == 0){// ray marching
      vec3 camPos = vec3(0., 0., t+1.5);
      vec3 dir = (vec3(p, 1.));
			dir.xy *= rotate(t*0.2);

      float d = 0.;
      for(int i=0;i<24;i++){
        float tmp = df(camPos + d*dir);
        if(tmp<0.001) break;
        d += tmp;
      }
      vec3 ip = camPos + d*dir;
			df(ip, color);
      color += (vec3(0.03*d)+df(ip+0.1));
      gl_FragColor = vec4(color, 1.);
    }
    else{// post effects
			vec2 st = abs(p);
			gl_FragColor = texture2D(rmTexture, uv);

			// gl_FragColor.rgb = 1.-gl_FragColor.rgb;

			gl_FragColor *= 1.3-length(p)*0.8;
			gl_FragColor *= 1.+usin((t*PI*0.5+2.))*0.5/length(p);

    }


}
