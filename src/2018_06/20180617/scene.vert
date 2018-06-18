/*{
    vertexCount: 1000,
    vertexMode: 'POINTS',
}*/
precision mediump float;
uniform sampler2D cameraTexture;
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform vec2 resolution;
attribute float vertexId;
uniform float vertexCount;
uniform float time;
uniform vec3 mouseButtons;
const float pointSize = 2.0;
varying vec4 v_color;

const vec4 globalColor = vec4(.3, .4, .8, 0.7);

mat4 getCameraMatrix(){
    vec4 v0 = texture2D(cameraTexture, vec2(0.));
    vec4 v1 = texture2D(cameraTexture, vec2(0.25,0.));
    vec4 v2 = texture2D(cameraTexture, vec2(0.5,0.));
    vec4 v3 = texture2D(cameraTexture, vec2(0.75,0.));
    return mat4(
        v0.x, v0.y, v0.z, v0.w,
        v1.x, v1.y, v1.z, v1.w,
        v2.x, v2.y, v2.z, v2.w,
        v3.x, v3.y, v3.z, v3.w
    );
}

void main(){
    vec2 uv = vec2(
        mod(vertexId, resolution.x) / resolution.x,
        floor(vertexId / resolution.x) / resolution.y
    );

    vec4 position = texture2D(positionTexture, uv);
    vec4 velocity = texture2D(velocityTexture, uv);

    gl_Position = getCameraMatrix() * vec4(position.xyz, 1);
    // gl_PointSize = pointSize * max(position.w * 1.25, 0.75);
    gl_PointSize = 1.0;

    v_color = globalColor;
}
