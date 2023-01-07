import Razor from '@engine/core/Razor';
import RazorInterfaceCore from '@interface-core/RazorInterfaceCore';
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface IRazorPayload {
  gameCore: RazorInterfaceCore;
  canvas: HTMLCanvasElement;
}


interface RazorStoreState {
  razor: Razor
}

const initialState: RazorStoreState = {
  razor: null
}

const RazorStore = createSlice({
  name: 'razor',
  initialState,
  reducers: {
    init: (state: RazorStoreState, action: PayloadAction<IRazorPayload>) => {
      debugger
      if(!state.razor) {
        state.razor = new Razor(action.payload.gameCore, action.payload.canvas)
      }
    },
    start: (state: RazorStoreState) => {
      if(state.razor && !state.razor.isStarted()) {
        state.razor.start()
      }
    }
  }
  
})

export type RazorState = typeof initialState
export const RazorActions = {...RazorStore.actions}
export default RazorStore.reducer