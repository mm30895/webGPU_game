import { vec3, mat4, vec4 } from 'glm';

import * as WebGPU from 'engine/WebGPU.js';

import { Camera, Model } from 'engine/core.js';

import {
    getLocalModelMatrix,
    getGlobalViewMatrix,
    getGlobalModelMatrix,
    getProjectionMatrix,

    getModels,
} from 'engine/core/SceneUtils.js';

import { BaseRenderer } from 'engine/renderers/BaseRenderer.js';

import {Light} from "./Light.js"

const vertexBufferLayout = {
    arrayStride: 32,
    attributes: [
        {
            name: 'position',
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3',
        },
        {
            name: 'texcoords',
            shaderLocation: 1,
            offset: 12,
            format: 'float32x2',
        },
        {
            name: 'normal',
            shaderLocation: 2,
            offset: 20,
            format: 'float32x3'
        }
    ],
};

export class Renderer extends BaseRenderer {

    constructor(canvas) {
        super(canvas);
    }

    async initialize() {
        await super.initialize();

        this.modelBindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {},
                },
            ],
        });

        this.cameraBindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {},
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    texture: {
                      sampleType: 'depth',
                    },
                  },
                  {
                    binding: 2,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    sampler: {
                      type: 'comparison',
                    },
                },
            ],
        });

        this.lightBindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {},
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'depth' },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: { type: 'comparison' },
                },
            ],
        });

        this.materialBindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {},
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {},
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
            ],
        });

        const code = await fetch(new URL('./shaders/shader.wgsl', import.meta.url))
            .then(response => response.text());
        const module = this.device.createShaderModule({ code: code });
        const codeShadow = await fetch(new URL('./shaders/shadowShader.wgsl', import.meta.url))
            .then(response => response.text());
        const moduleShadow = this.device.createShaderModule({ code: codeShadow });

        this.pipeline = await this.device.createRenderPipelineAsync({
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this.cameraBindGroupLayout,
                    this.modelBindGroupLayout,
                    this.materialBindGroupLayout,
                    this.lightBindGroupLayout,
                ],
            }),
            vertex: {
                module: module,
                buffers: [ vertexBufferLayout ],
            },
            fragment: {
                module: module,
                targets: [{ format: this.format }],
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
        });
        this.shadowPipeline = await this.device.createRenderPipelineAsync({
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this.cameraBindGroupLayout,
                    this.modelBindGroupLayout,
                ],
            }),
            vertex: {
                module: moduleShadow,
                buffers: [ vertexBufferLayout ],
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
        });
        this.shadowDepthTexture = this.device.createTexture({
            size: [2048, 2048],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float'
        });
        this.shadowDepthTextureView = this.shadowDepthTexture.createView()
        this.shadowSampler = this.device.createSampler({ compare: 'less' })

        this.recreateDepthTexture();
    }

    recreateDepthTexture() {
        this.depthTexture?.destroy();
        this.depthTexture = this.device.createTexture({
            format: 'depth24plus',
            size: [this.canvas.width, this.canvas.height],
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
    }

    prepareNode(node) {
        if (this.gpuObjects.has(node)) {
            return this.gpuObjects.get(node);
        }

        const modelUniformBuffer = this.device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const modelBindGroup = this.device.createBindGroup({
            layout: this.modelBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: modelUniformBuffer } },
            ],
        });

        const gpuObjects = { modelUniformBuffer, modelBindGroup };
        this.gpuObjects.set(node, gpuObjects);
        return gpuObjects;
    }

    prepareCamera(camera) {
        
        if (this.gpuObjects.has(camera)) {
            
            return this.gpuObjects.get(camera);
        }

        const cameraUniformBuffer = this.device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        if (camera && typeof camera === 'object') {
            console.error('camera object:', camera);
        } else {
            console.error('Invalid camera object:', camera);
        }

        const cameraBindGroup = this.device.createBindGroup({
            layout: this.cameraBindGroupLayout,
            entries: [
                    { binding: 0, resource: { buffer: cameraUniformBuffer } },
                    { binding: 1, resource: this.shadowDepthTextureView },
                    { binding: 2, resource: this.shadowSampler },
                ], 
        });

        const gpuObjects = { cameraUniformBuffer, cameraBindGroup };
        this.gpuObjects.set(camera, gpuObjects);
        return gpuObjects;
    }

    prepareTexture(texture) {
        if (this.gpuObjects.has(texture)) {
            return this.gpuObjects.get(texture);
        }

        const { gpuTexture } = this.prepareImage(texture.image); // ignore sRGB
        const { gpuSampler } = this.prepareSampler(texture.sampler);

        const gpuObjects = { gpuTexture, gpuSampler };
        this.gpuObjects.set(texture, gpuObjects);
        return gpuObjects;
    }

    prepareMaterial(material) {
        if (this.gpuObjects.has(material)) {
            return this.gpuObjects.get(material);
        }

        const baseTexture = this.prepareTexture(material.baseTexture);

        const materialUniformBuffer = this.device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const materialBindGroup = this.device.createBindGroup({
            layout: this.materialBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: materialUniformBuffer } },
                { binding: 1, resource: baseTexture.gpuTexture.createView() },
                { binding: 2, resource: baseTexture.gpuSampler },
            ],
        });

        const gpuObjects = { materialUniformBuffer, materialBindGroup };
        this.gpuObjects.set(material, gpuObjects);
        return gpuObjects;
    }
    prepareLight(light){
        if (this.gpuObjects.has(light)) {
            return this.gpuObjects.get(light);
        }

        const lightUniformBuffer = this.device.createBuffer({
            size: 64+64+48,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const lightDepthTexture = this.device.createTexture({
            format: 'depth24plus',
            size: light.resolution,
            usage:
                GPUTextureUsage.RENDER_ATTACHMENT |
                GPUTextureUsage.TEXTURE_BINDING,
        });
        const lightDepthSampler = this.device.createSampler({
            minFilter: 'linear',
            magFilter: 'linear',
            compare: 'less',
        });

        const lightBindGroup = this.device.createBindGroup({
            layout: this.lightBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: lightUniformBuffer } },
                { binding: 1, resource: lightDepthTexture.createView() },
                { binding: 2, resource: lightDepthSampler },
            ],
        });

        const gpuObjects = {
            lightUniformBuffer,
            lightBindGroup,
            lightDepthTexture,
            lightDepthSampler,
        };
        this.gpuObjects.set(light, gpuObjects);
        return gpuObjects;
    }

    render(scene, camera) {
        this.renderShadows(scene);
        this.renderColor(scene, camera);
    }
    renderShadows(scene) {
        const lights = scene.filter(node => node.getComponentOfType(Light));
        //console.log("light" , lights)
        for (const light of lights) {
            const lightComponent = light.getComponentOfType(Light);
            const { lightDepthTexture } = this.prepareLight(lightComponent);

            const encoder = this.device.createCommandEncoder();
            this.renderPass = encoder.beginRenderPass({
                colorAttachments: [],
                depthStencilAttachment: {
                    view: lightDepthTexture.createView(),
                    depthClearValue: 1,
                    depthLoadOp: 'clear',
                    depthStoreOp: 'store',
                },
            });
            this.renderPass.setPipeline(this.shadowPipeline);
// ///
// const lightViewMatrix = getGlobalViewMatrix(light);
// const lightProjectionMatrix = lightComponent.perspectiveMatrix;
// const lightColor = vec3.scale(vec3.create(), lightComponent.color, 1 / 255);
// const lightPosition = mat4.getTranslation(vec3.create(), getGlobalModelMatrix(light));
// let vecDir = vec4.set(vec4.create(),0,0,-1,1)
// let lightDirection = vec4.transformQuat(vec4.create(), vecDir, getGlobalRotation(light))
// lightDirection = vec3.fromValues(lightDirection[0], lightDirection[1], lightDirection[2])
// const lightAttenuation = vec3.clone(lightComponent.attenuation);
// const { lightUniformBuffer, lightBindGroup } = this.prepareLight(lightComponent);
// this.device.queue.writeBuffer(lightUniformBuffer, 0, lightViewMatrix);
// this.device.queue.writeBuffer(lightUniformBuffer, 64, lightProjectionMatrix);
// this.device.queue.writeBuffer(lightUniformBuffer, 128, lightColor);
// this.device.queue.writeBuffer(lightUniformBuffer, 128+16, lightPosition);
// this.device.queue.writeBuffer(lightUniformBuffer, 128+32, lightAttenuation);
// this.device.queue.writeBuffer(lightUniformBuffer, 128+48, lightDirection);
// this.device.queue.writeBuffer(lightUniformBuffer, 128+60, new Float32Array([lightComponent.intensity, lightComponent.ambient, lightComponent.fi]));
// this.shadowPass.setBindGroup(0, lightBindGroup);
// ///
            const cameraComponent = light.getComponentOfType(Camera);
            const viewMatrix = getGlobalViewMatrix(light);
            const projectionMatrix = getProjectionMatrix(light);
            const lightPosition = mat4.getTranslation(vec3.create(), getGlobalModelMatrix(light));
            const { cameraUniformBuffer, cameraBindGroup } = this.prepareCamera(cameraComponent);
            this.device.queue.writeBuffer(cameraUniformBuffer, 0, viewMatrix);
            this.device.queue.writeBuffer(cameraUniformBuffer, 64, projectionMatrix);
            this.renderPass.setBindGroup(0, cameraBindGroup);
            
            this.renderNode(scene);

            this.renderPass.end();
            this.device.queue.submit([encoder.finish()]);
        }
    }
    renderColor(scene, camera) {
        if (this.depthTexture.width !== this.canvas.width || this.depthTexture.height !== this.canvas.height) {
            this.recreateDepthTexture();
        }

        const encoder = this.device.createCommandEncoder();
        this.renderPass = encoder.beginRenderPass({
            colorAttachments: [
                {
                    view: this.context.getCurrentTexture().createView(),
                    clearValue: [1, 1, 1, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                }
            ],
            depthStencilAttachment: {
                view: this.depthTexture.createView(),
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'discard',
            },
        });
        this.renderPass.setPipeline(this.pipeline);

        const cameraComponent = camera.getComponentOfType(Camera);
        const viewMatrix = getGlobalViewMatrix(camera);
        const projectionMatrix = getProjectionMatrix(camera);
        const cameraPosition = mat4.getTranslation(vec3.create(), getGlobalModelMatrix(camera));
        const { cameraUniformBuffer, cameraBindGroup } = this.prepareCamera(cameraComponent);
        this.device.queue.writeBuffer(cameraUniformBuffer, 0, viewMatrix);
        this.device.queue.writeBuffer(cameraUniformBuffer, 64, projectionMatrix);
        this.renderPass.setBindGroup(0, cameraBindGroup);

        const light = scene.find(node => node.getComponentOfType(Light));
        const lightComponent = light.getComponentOfType(Light);
        const lightViewMatrix = getGlobalViewMatrix(light);
        const lightProjectionMatrix = getProjectionMatrix(light);
        const lightPosition = mat4.getTranslation(vec3.create(), getGlobalModelMatrix(light));
        const { lightUniformBuffer, lightBindGroup } = this.prepareLight(lightComponent);
        this.device.queue.writeBuffer(lightUniformBuffer, 0, lightViewMatrix);
        this.device.queue.writeBuffer(lightUniformBuffer, 64, lightProjectionMatrix);
        this.device.queue.writeBuffer(lightUniformBuffer, 128, lightPosition);
        this.renderPass.setBindGroup(3, lightBindGroup);

        this.renderLight(camera);
        for (const child of scene.children) {
            if (child.visible) {
                this.renderNode(child);
            }
        }
        const cameraLight = camera.children[2];
        for (const child of camera.children) {
            if (child.visible && child !== cameraLight) {
                this.renderNode(child);
            }
        }
        this.renderNode(scene);

        this.renderPass.end();
        this.device.queue.submit([encoder.finish()]);
    }

    renderLight(node) {
        const lightComponent = node.getComponentOfType(Light);
        if (lightComponent) {
            const { lightUniformBuffer, lightBindGroup } = this.prepareLight(lightComponent);
            const LightUniformsValues = new ArrayBuffer(48);
            const LightUniformsViews = {
                color: new Float32Array(LightUniformsValues, 0, 3),
                direction: new Float32Array(LightUniformsValues, 16, 3),
                position: new Float32Array(LightUniformsValues, 32, 3),
            };
    
            LightUniformsViews.color.set(lightComponent.color);
            LightUniformsViews.direction.set(lightComponent.direction);
            LightUniformsViews.position.set(lightComponent.position);
    
            // Write the light uniform data to the buffer and bind to renderpass
            this.device.queue.writeBuffer(lightUniformBuffer, 0, LightUniformsValues);
            this.renderPass.setBindGroup(3, lightBindGroup);
        }
    
        // process children
        for (const child of node.children) {
            this.renderLight(child);
        }
    }
    

    renderNode(node, modelMatrix = mat4.create()) {
        if(node.visible) {
            const localMatrix = getLocalModelMatrix(node);
            modelMatrix = mat4.multiply(mat4.create(), modelMatrix, localMatrix);
            const normalMatrix = mat4.normalFromMat4(mat4.create(), modelMatrix);
    
            const { modelUniformBuffer, modelBindGroup } = this.prepareNode(node);
            this.device.queue.writeBuffer(modelUniformBuffer, 0, modelMatrix);
            this.device.queue.writeBuffer(modelUniformBuffer, 64, normalMatrix);
            this.renderPass.setBindGroup(1, modelBindGroup);
    
            for (const model of node.getComponentsOfType(Model)) {
                this.renderModel(model);
            }
    
            for (const child of node.children) {
                this.renderNode(child, modelMatrix);
            }
        }
    }

    renderModel(model) {
        for (const primitive of model.primitives) {
            this.renderPrimitive(primitive);
        }
    }

    renderPrimitive(primitive) {
        const { materialUniformBuffer, materialBindGroup } = this.prepareMaterial(primitive.material);
        this.device.queue.writeBuffer(materialUniformBuffer, 0, new Float32Array([
            ...primitive.material.baseFactor,
        ]));
        this.renderPass.setBindGroup(2, materialBindGroup);

        const { vertexBuffer, indexBuffer } = this.prepareMesh(primitive.mesh, vertexBufferLayout);
        this.renderPass.setVertexBuffer(0, vertexBuffer);
        this.renderPass.setIndexBuffer(indexBuffer, 'uint32');

        this.renderPass.drawIndexed(primitive.mesh.indices.length);
    }
    

    
    

}
