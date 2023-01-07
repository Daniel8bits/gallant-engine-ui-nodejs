import RazorInterfaceCore from '@interface-core/RazorInterfaceCore';
import { useSelector } from '@store/Root.store'

function useGameCore(): RazorInterfaceCore {
  const razor = useSelector(state => state.razor.razor);
  return razor?.getGameCore() as RazorInterfaceCore;
}

export default useGameCore