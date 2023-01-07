import Razor from "./Razor"

export const Keys = {
    KEY_0: 'Digit0',
    KEY_1: 'Digit1',
    KEY_2: 'Digit2',
    KEY_3: 'Digit3',
    KEY_4: 'Digit4',
    KEY_5: 'Digit5',
    KEY_6: 'Digit6',
    KEY_7: 'Digit7',
    KEY_8: 'Digit8',
    KEY_9: 'Digit9',

    KEY_A: 'KeyA',
    KEY_B: 'KeyB',
    KEY_C: 'KeyC',
    KEY_D: 'KeyD',
    KEY_E: 'KeyE',
    KEY_F: 'KeyF',
    KEY_G: 'KeyG',
    KEY_H: 'KeyH',
    KEY_I: 'KeyI',
    KEY_J: 'KeyJ',
    KEY_K: 'KeyK',
    KEY_L: 'KeyL',
    KEY_M: 'KeyM',
    KEY_N: 'KeyN',
    KEY_O: 'KeyO',
    KEY_P: 'KeyP',
    KEY_Q: 'KeyQ',
    KEY_R: 'KeyR',
    KEY_S: 'KeyS',
    KEY_T: 'KeyT',
    KEY_U: 'KeyU',
    KEY_V: 'KeyV',
    KEY_X: 'KeyX',
    KEY_W: 'KeyW',
    KEY_Y: 'KeyY',
    KEY_Z: 'KeyZ',

    KEY_SPACE: 'Space',
    KEY_ESCAPE: 'Escape',
    KEY_ENTER: 'Enter',
    KEY_BACKSPACE: 'Backspace',
    KEY_INSERT: 'Insert',
    KEY_DELETE: 'Delete',

    KEY_ALT_L: 'AltLeft',
    KEY_ALT_R: 'AltRight',
    KEY_CTRL_L: 'ControlLeft',
    KEY_CTRL_R: 'ControlRight',
    KEY_SHIFT_L: 'ShiftLeft',
    KEY_SHIFT_R: 'ShiftRight',

    KEY_UP: 'ArrowUp',
    KEY_DOWN: 'ArrowDown',
    KEY_LEFT: 'ArrowLeft',
    KEY_RIGHT: 'ArrowRight',

    KEY_HOME: 'Home',
    KEY_END: 'End',
    KEY_PAGEUP: 'PageUp',
    KEY_PAGEDOWN: 'PageDown',

    KEY_BACKQUOTE: 'Backquote',
    KEY_MINUS: 'Minus',
    KEY_EQUAL: 'Equal',
    KEY_BRACKET_L: 'Bracketleft',
    KEY_BRACKET_R: 'BracketRight',
    KEY_BACKSLASH: 'Backslash',
    KEY_SEMICOLON: 'Semicolon',
    KEY_QUOTE: 'Quote',
    KEY_COMMA: 'Comma',
    KEY_PERIOD: 'Period',
    KEY_SLASH: 'Slash',
}


class InputManager {


    private static _mouseButtons: [boolean, boolean, boolean]
    private static _currentMousePosition: [number, number]
    private static _previousMousePosition: [number, number]
    private static _mouseMovement: [number, number]

    private static _keys: Map<string, boolean>

    private static _shouldDebug: boolean

    public static init() {
        InputManager._keys = new Map<string, boolean>()
        Object.keys(Keys).forEach((key: string) => {
            InputManager._keys.set(key, false)
        })
        window.addEventListener('keydown', InputManager.onKeyDown)
        window.addEventListener('keyup', InputManager.onKeyUp)
        InputManager._mouseButtons = [false, false, false]
        InputManager._currentMousePosition = [0, 0]
        InputManager._previousMousePosition = [0, 0]
        InputManager._mouseMovement = [0, 0]
        window.addEventListener('mousedown', InputManager.onMouseDown)
        window.addEventListener('mouseup', InputManager.onMouseUp)
        window.addEventListener('mousemove', InputManager.onMouseMove)

        this._shouldDebug = false
    }

    // KEYBOARD EVENTS

    public static isKeyPressed(key: string): boolean {
        return InputManager._keys.get(key)
    }

    private static onKeyDown(event: KeyboardEvent): void {
        if(Razor.FOCUSED){
            event.stopPropagation()
            event.preventDefault()
            InputManager._keys.set(event.code, true)
        }
    }

    private static onKeyUp(event: KeyboardEvent): void {
        if(Razor.FOCUSED){
            event.stopPropagation()
            event.preventDefault()
            InputManager._keys.set(event.code, false)
        }
    }

    public static update() {

        InputManager._mouseMovement[0] = InputManager._currentMousePosition[0] - InputManager._previousMousePosition[0]
        InputManager._mouseMovement[1] = InputManager._currentMousePosition[1] - InputManager._previousMousePosition[1]
        InputManager._previousMousePosition[0] = InputManager._currentMousePosition[0]
        InputManager._previousMousePosition[1] = InputManager._currentMousePosition[1]

    }

    // MOUSE EVENTS

    public static isMouseLeft(): boolean { 
        return InputManager._mouseButtons[0]
    }

    public static isMouseMiddle(): boolean { 
        return InputManager._mouseButtons[1]
    }

    public static isMouseRight(): boolean { 
        return InputManager._mouseButtons[2]
    }

    public static getMouseX(): number {
        return InputManager._currentMousePosition[0]
    }

    public static getMouseY(): number {
        return InputManager._currentMousePosition[1]
    }

    public static getMouseDX(): number {
        return InputManager._mouseMovement[0]
    }

    public static getMouseDY(): number {
        return InputManager._mouseMovement[1]
    }

    private static onMouseDown(event: MouseEvent): void {
        event.stopPropagation()
        event.preventDefault()
        InputManager._mouseButtons[event.button] = Razor.IS_MOUSE_INSIDE
    }

    private static onMouseUp(event: MouseEvent): void {
        if(Razor.IS_MOUSE_INSIDE){
            event.stopPropagation()
            event.preventDefault()
            InputManager._mouseButtons[event.button] = false
        }
    }

    private static onMouseMove(event: MouseEvent): void {
        if(Razor.IS_MOUSE_INSIDE){
            event.stopPropagation()
            event.preventDefault()

            InputManager._currentMousePosition[0] = event.offsetX
            InputManager._currentMousePosition[1] = event.offsetY
    
            if(InputManager._shouldDebug) {
                console.log(`offset:  ${event.offsetX}X ${event.offsetY}Y`);
                console.log(`client:  ${event.clientX}X ${event.clientY}Y`);
                console.log(`screen:  ${event.screenX}X ${event.screenY}Y`);
            }
        }
    }

    public static setDebug(value: boolean) {
        InputManager._shouldDebug = value
    }

    public static shouldDebug() {
        return InputManager._shouldDebug
    }

}

export default InputManager