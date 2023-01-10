import GallantInterfaceCore from "@interface-core/GallantInterfaceCore";
import Gallant from 'gallant-engine/dist/src/core/Gallant'
import produce from "immer";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import create from "zustand";

export const GallantEngine = atom<Gallant, Gallant>(
  get => get(GallantEngine), 
  (get, set, update) => set(GallantEngine, update)
)

export const GallantCore = atom(new GallantInterfaceCore())

export function useGallantConfig() {
  const [engine, setEngine] = useAtom<Gallant, Gallant, void>(GallantEngine)
  const [core] = useAtom(GallantCore)

  const init = useCallback((canvas: HTMLCanvasElement) => {
    const engine = new Gallant(core, canvas)
    setEngine(engine)
  }, [])

  const start = useCallback(() => {
    if(engine && !engine.isStarted()) {
      engine.start()
    }
  }, [engine])

  return { init, start }
}

export function useGameCore() {
  const [core] = useAtom(GallantCore)
  return core
}

export enum EGallantResources {
  VAO,
  SHADER
}

interface IResourcesObserver {
  keys: string[];
  observing: boolean
}

type CameraTransformType = {
  translation: [number, number, number],
  rotation: [number, number, number],
}

interface GallantObserverState {
  resources: IResourcesObserver[],
  scenes: {
    name: string, 
    entities: string[],
    cameras: string[]
  }[],
  selected: {
    entity: string, 
    camera: string
  },
  camera: {
    target: string,
    transform: CameraTransformType,
    lockedIn: string
  }

  createObserver: (payload: {resource: EGallantResources}) => void
  updateObserver: (payload: {resource: EGallantResources, keys: string[]}) => void
  addEntity: (payload: {entities: string[]}) => void
  selectEntity: (payload: {entity: string}) => void
  addCamera: (payload: {cameras: string[]}) => void
  selectCamera: (payload: {camera: string}) => void
  updateCamera: (payload: {translation: [number, number, number], rotation: [number, number, number]}) => void
  targetCamera: (payload: {camera: string}) => void
  lockCamera: (payload: {camera: string}) => void
}

type Setter = (partial: GallantObserverState | Partial<GallantObserverState> | ((state: GallantObserverState) => GallantObserverState), replace?: boolean) => void

const action = <T>(set: Setter, callback: (state: GallantObserverState, payload: T) => void) => {
  return (payload: T) => set(produce<GallantObserverState>((state) => callback(state, payload)))
}

export const useGallantStore = create<GallantObserverState>((set) => ({

  gallant: null,
  resources: [
    {
      keys: [],
      observing: false,
    }
  ],
  scenes: [{
    name: 'unique scene',
    entities: [],
    cameras: []
  }],
  selected: {
    entity: null,
    camera: null
  },
  camera: {
    target: null,
    transform: {
      translation: [0, 0, 0],
      rotation: [0, 0, 0],
    },
    lockedIn: null
  },

  // ==============
  createObserver: action<{resource: EGallantResources}>(set, (draft, payload) => {
    draft.resources[payload.resource].observing = true
  }),
  updateObserver: action<{resource: EGallantResources, keys: string[]}>(set, (draft, payload) => {
    draft.resources[payload.resource].keys = [...payload.keys]
  }),
  addEntity: action<{entities: string[]}>(set, (draft, payload) => {
    draft.scenes[0].entities = [...payload.entities]
  }),
  selectEntity: action<{entity: string}>(set, (draft, payload) => {
    draft.selected.entity = payload.entity
  }),
  addCamera: action<{cameras: string[]}>(set, (draft, payload) => {
    draft.scenes[0].cameras = [...payload.cameras]
  }),
  selectCamera: action<{camera: string}>(set, (draft, payload) => {
    draft.selected.camera = payload.camera
  }),
  updateCamera: action<{translation: [number, number, number], rotation: [number, number, number]}>(set, (draft, payload) => {
    draft.camera.transform.translation = [...payload.translation]
    draft.camera.transform.rotation = [...payload.rotation]
  }),
  targetCamera: action<{camera: string}>(set, (draft, payload) => {
    draft.camera.target = payload.camera
  }),
  lockCamera: action<{camera: string}>(set, (draft, payload) => {
    draft.camera.lockedIn = payload.camera
  })
}))

export const GallantStore = useGallantStore.getState()