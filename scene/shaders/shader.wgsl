struct VertexInput {
    @location(0) position: vec3f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
    @location(3) worldPos: vec3f,
}

struct FragmentInput {
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
    @location(3) worldPos: vec3f
}

struct FragmentOutput {
    @location(0) color: vec4f,
}

struct CameraUniforms {
    viewMatrix: mat4x4f,
    projectionMatrix: mat4x4f,
}

struct ModelUniforms {
    modelMatrix: mat4x4f,
    normalMatrix: mat3x3f,
}

struct MaterialUniforms {
    baseFactor: vec4f,
}

struct LightUniforms {
    color: vec3f,
    direction: vec3f,
    position: vec3f,
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms; // camera

@group(1) @binding(0) var<uniform> model: ModelUniforms; // model uniforms

@group(2) @binding(0) var<uniform> material: MaterialUniforms;
@group(2) @binding(1) var baseTexture: texture_2d<f32>;
@group(2) @binding(2) var baseSampler: sampler;                 // skupina 2 zza materiale

@group(3) @binding(0) var<uniform> light: LightUniforms;

@vertex
fn vertex(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    let worldPos = model.modelMatrix * vec4(input.position, 1);
    output.position = camera.projectionMatrix * camera.viewMatrix * worldPos;
    output.texcoords = input.texcoords;
    output.normal = model.normalMatrix * input.normal;
    output.worldPos = worldPos.xyz;

    return output;
}

@fragment
fn fragment(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;

    let N = normalize(input.normal);

    let lightDir = normalize(light.position - input.worldPos);
    let lambert = max(dot(N, lightDir), 0.0);

    let intensityFactor = 0.1;  //  light brighter/dimmer
    let pointLight = lambert * light.color * intensityFactor;


    let baseColor = textureSample(baseTexture, baseSampler, input.texcoords) * material.baseFactor;
    let ambientLight = vec3f(0.005, 0.001, 0);

    let finalPointColor = baseColor.rgb * (pointLight / pow(length(light.position - input.worldPos), 2));
    let finalColor = finalPointColor + ambientLight;


    //let diffuseLight = basecolor * vec4(lambert * light.color, 1);
    //output.color = diffuseLight + ambientLight;
    output.color =vec4(finalColor,1);

    return output;
}
