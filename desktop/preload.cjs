const {contextBridge,ipcRenderer}=require('electron');
function call(channel,...args){const result=ipcRenderer.sendSync(channel,...args);if(!result?.ok)throw new Error(result?.error||'Desktop storage unavailable');return result;}
contextBridge.exposeInMainWorld('mistDesktop',{backup:key=>call('mist:backup',key),read:key=>call('mist:read',key),write:(key,value)=>call('mist:write',key,value),fullscreen:value=>call('mist:fullscreen',value)});
