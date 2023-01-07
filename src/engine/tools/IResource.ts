
interface IResource {
    create: () => void;
    bind: () => void;
    unbind: () => void;
    destroy: () => void;
}

export default IResource;