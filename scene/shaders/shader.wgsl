struct VertexInput {
    @location(0) position: vec3f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
    @location(4) worldPos: vec3f,
    //@location(3) shadowPosition: vec4f,
}

struct FragmentInput {
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
    @location(4) worldPos: vec3f,
    //@location(3) shadowPosition: vec4f,
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
    //viewMatrix: mat4x4f,
    //projectionMatrix: mat4x4f,
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms; // camera

@group(1) @binding(0) var<uniform> model: ModelUniforms; // model uniforms

@group(2) @binding(0) var<uniform> material: MaterialUniforms;
@group(2) @binding(1) var baseTexture: texture_2d<f32>;
@group(2) @binding(2) var baseSampler: sampler;                 // skupina 2 zza materiale

@group(3) @binding(0) var<uniform> light: LightUniforms;
//@group(3) @binding(1) var shadowTexture: texture_depth_2d;
//@group(3) @binding(2) var shadowSampler: sampler_comparison;

@vertex
fn vertex(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    let worldPos = model.modelMatrix * vec4(input.position, 1);
    output.position = camera.projectionMatrix * camera.viewMatrix * worldPos;
    //output.shadowPosition = light.projectionMatrix * light.viewMatrix *  vec4(input.position, 1.0);
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

    let intensityFactor = 200f;  //  light brighter/dimmer
    let pointLight = lambert * light.color * intensityFactor;


    let baseColor = textureSample(baseTexture, baseSampler, input.texcoords) * material.baseFactor;
    let baseColor2 = pow(baseColor, vec4f(2.2));
    let ambientLight = vec3f(0.0001, 0.0001, 0.0001);

    

    let finalPointColor = baseColor2.rgb * (pointLight / pow(distance(light.position, input.worldPos), 2));//popravi pow
    let ambientColor = baseColor2.rgb * ambientLight;
    let finalColor = finalPointColor + ambientColor;

    //fog
    let cameraPosition = light.position; 
    let fogColor = vec3f(0, 0, 0); 
    let distanceToCamera = distance(cameraPosition, input.worldPos);
    let fogStart = 1.0;
    let fogEnd = 120.0; 
    let fogFactor = clamp((distanceToCamera - fogStart) / (fogEnd - fogStart), 0.0, 1.0);

    let foggedColor = mix(finalColor, fogColor, fogFactor);

    //shadows
   // let shadowPosition = input.shadowPosition.xyz / input.shadowPosition.w;
   // let shadowTexcoords = shadowPosition.xy * vec2(0.5, -0.5) + 0.5;
   // let shadowFactor = textureSampleCompare(shadowTexture, shadowSampler, shadowTexcoords.xy, shadowPosition.z - 0.002);
//
   // let shadedColor = baseColor * vec4(vec3(lambert* shadowFactor), 1);

    // let diffuseLight = basecolor * vec4(lambert * light.color, 1);
    // output.color = diffuseLight + ambientLight;
    let gamma = vec4f(1/2.2); // gamma factor
    //output.color = vec4(pow(shadedColor.rgb, vec3(1 / 2.2)), shadedColor.a);
    output.color =  pow(vec4f(foggedColor,1), gamma);

    return output;
}
