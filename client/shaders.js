function loadShaders(){
    BABYLON.Effect.ShadersStore["t1VertexShader"] =
        "precision highp float;" + "\r\n" +

        "attribute vec3 position;" + "\r\n" +
        "attribute vec3 normal;" + "\r\n" +
        "attribute vec2 uv;" + "\r\n" +

        "varying vec2 vUV;" + "\r\n" +

        "varying vec3 vNormal;" + "\r\n" +

        "uniform mat4 worldViewProjection;" + "\r\n" +

        "void main(void) {" + "\r\n" +
        "    gl_Position = worldViewProjection * vec4(position, 1.0);" + "\r\n" +
        "    vNormal = normal;" + "\r\n" +
        "    vUV = uv;" + "\r\n" +
        "}" + "\r\n";

    BABYLON.Effect.ShadersStore["t1FragmentShader"] =
        "precision highp float;" + "\r\n" +

        "varying vec2 vUV;" + "\r\n" +

        "varying vec3 vNormal;" + "\r\n" +

        "uniform sampler2D t0Sampler;" + "\r\n" +

        "uniform vec3 sunVector;" + "\r\n" +

        "void main(void) {" + "\r\n" +
        "    vec3 color = texture2D(t0Sampler, vUV).rgb;" + "\r\n" +
        "    gl_FragColor = vec4(color * (max(0., dot(sunVector, vNormal)) * 0.6 + 0.4), 1.0);" + "\r\n" +
        "}" + "\r\n";

    BABYLON.Effect.ShadersStore["t2VertexShader"] =
        "precision highp float;" + "\r\n" +

        "attribute vec3 position;" + "\r\n" +
        "attribute vec3 normal;" + "\r\n" +
        "attribute vec2 uv;" + "\r\n" +
        "attribute vec2 uv2;" + "\r\n" +

        "varying vec2 vUV;" + "\r\n" +
        "varying float vA;" + "\r\n" +

        "varying vec3 vNormal;" + "\r\n" +

        "uniform mat4 worldViewProjection;" + "\r\n" +

        "void main(void) {" + "\r\n" +
        "    gl_Position = worldViewProjection * vec4(position, 1.0);" + "\r\n" +
        "    vNormal = normal;" + "\r\n" +
        "    vUV = uv;" + "\r\n" +
        "    vA = uv2.x;" + "\r\n" +
        "}" + "\r\n";

    BABYLON.Effect.ShadersStore["t2FragmentShader"] =
        "precision highp float;" + "\r\n" +

        "varying vec2 vUV;" + "\r\n" +
        "varying float vA;" + "\r\n" +

        "varying vec3 vNormal;" + "\r\n" +

        "uniform sampler2D t0Sampler;" + "\r\n" +
        "uniform sampler2D t1Sampler;" + "\r\n" +

        "uniform vec3 sunVector;" + "\r\n" +

        "void main(void) {" + "\r\n" +
        "    vec3 p0 = texture2D(t0Sampler, vUV).rgb;" + "\r\n" +
        "    vec3 p1 = texture2D(t1Sampler, vUV).rgb;" + "\r\n" +
        "    vec3 color = p0 * (1.0f - vA) + p1 * vA;" + "\r\n" +
        "    gl_FragColor = vec4(color * (max(0., dot(sunVector, vNormal)) * 0.6 + 0.4), 1.0);" + "\r\n" +
        "}" + "\r\n";

    BABYLON.Effect.ShadersStore["t3VertexShader"] =
        "precision highp float;" + "\r\n" +

        "attribute vec3 position;" + "\r\n" +
        "attribute vec3 normal;" + "\r\n" +
        "attribute vec2 uv;" + "\r\n" +
        "attribute vec2 uv2;" + "\r\n" +

        "varying vec2 vUV;" + "\r\n" +
        "varying float vA;" + "\r\n" +
        "varying float vB;" + "\r\n" +

        "varying vec3 vNormal;" + "\r\n" +

        "uniform mat4 worldViewProjection;" + "\r\n" +

        "void main(void) {" + "\r\n" +
        "    gl_Position = worldViewProjection * vec4(position, 1.0);" + "\r\n" +
        "    vNormal = normal;" + "\r\n" +
        "    vUV = uv;" + "\r\n" +
        "    vA = uv2.x;" + "\r\n" +
        "    vB = uv2.y;" + "\r\n" +
        "}" + "\r\n";

    BABYLON.Effect.ShadersStore["t3FragmentShader"] =
        "precision highp float;" + "\r\n" +

        "varying vec2 vUV;" + "\r\n" +
        "varying float vA;" + "\r\n" +
        "varying float vB;" + "\r\n" +

        "varying vec3 vNormal;" + "\r\n" +

        "uniform sampler2D t0Sampler;" + "\r\n" +
        "uniform sampler2D t1Sampler;" + "\r\n" +
        "uniform sampler2D t2Sampler;" + "\r\n" +

        "uniform vec3 sunVector;" + "\r\n" +

        "void main(void) {" + "\r\n" +
        "    vec3 p0 = texture2D(t0Sampler, vUV).rgb;" + "\r\n" +
        "    vec3 p1 = texture2D(t1Sampler, vUV).rgb;" + "\r\n" +
        "    vec3 p2 = texture2D(t2Sampler, vUV).rgb;" + "\r\n" +
        "    vec3 pt = p0 * (1.0f - vA) + p1 * vA;" + "\r\n" +
        "    vec3 color = pt * (1.0f - vB) + p2 * vB;" + "\r\n" +
        "    gl_FragColor = vec4(color * (max(0., dot(sunVector, vNormal)) * 0.6 + 0.4), 1.0);" + "\r\n" +
        "}" + "\r\n";
}