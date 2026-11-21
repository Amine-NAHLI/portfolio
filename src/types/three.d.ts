/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "three" {
  export interface Object3D {
    isMesh?: boolean;
    material?: any;
    position: any;
    scale: any;
    rotation: any;
    add(child: any): void;
    traverse(callback: (child: Object3D) => void): void;
    [key: string]: any;
  }

  export type Group = Object3D;
  export type Mesh = Object3D;
  export type AnimationClip = any;
  export type AnimationMixer = any;
  export type MeshStandardMaterial = any;
  export type Scene = any;
  export type PerspectiveCamera = any;
  export type WebGLRenderer = any;
  export type AmbientLight = any;
  export type DirectionalLight = any;
  export type PointLight = any;
  export type Box3 = any;
  export type Vector3 = any;
  export type Clock = any;

  export const Scene: any;
  export const PerspectiveCamera: any;
  export const WebGLRenderer: any;
  export const SRGBColorSpace: any;
  export const ACESFilmicToneMapping: any;
  export const AmbientLight: any;
  export const DirectionalLight: any;
  export const PointLight: any;
  export const Group: any;
  export const AnimationMixer: any;
  export const Box3: any;
  export const Vector3: any;
  export const Clock: any;
  export const MathUtils: any;
  export const Color: any;

  const three: any;
  export default three;
}

declare module "three/examples/jsm/loaders/GLTFLoader.js" {
  export class GLTFLoader {
    constructor();
    load(
      url: string,
      onLoad: (gltf: any) => void,
      onProgress?: (xhr: any) => void,
      onError?: (error: any) => void
    ): void;
  }
}
