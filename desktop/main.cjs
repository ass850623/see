const {app,BrowserWindow,protocol,net,session,Menu,ipcMain}=require('electron');
const path=require('node:path');
const {createStore}=require('./save-store.cjs');
const {pathToFileURL}=require('node:url');
protocol.registerSchemesAsPrivileged([{scheme:'mist',privileges:{standard:true,secure:true,supportFetchAPI:true}}]);
app.setName('Voices of the Mist');
// Keep this name stable across releases so local saves survive upgrades.
app.setPath('userData',path.join(app.getPath('appData'),'voices-of-the-mist'));
const single=app.requestSingleInstanceLock();
let window;
if(!single)app.quit();
else {
app.on('second-instance',()=>{if(window){if(window.isMinimized())window.restore();window.focus();}});
app.whenReady().then(async()=>{
 const {decodeSave}=await import('../engine.mjs');const {decodeSettings}=await import('../settings.mjs');
 const store=createStore(path.join(app.getPath('userData'),'saves'),(key,raw)=>Boolean(key==='mist-settings-v1'?decodeSettings(raw):decodeSave(raw)));
 for(const [channel,action] of [['mist:quit',()=>{setImmediate(()=>app.quit());return {};}],['mist:backup',key=>store.backup(key)],['mist:read',key=>store.read(key)],['mist:write',(key,value)=>{store.write(key,value);return {};}],['mist:fullscreen',value=>{if(value!==null&&typeof value!=='boolean')throw new Error('Invalid fullscreen value');window.setFullScreen(value===null?!window.isFullScreen():value);return {};}]] )ipcMain.on(channel,(event,...args)=>{try{if(event.sender!==window?.webContents||event.senderFrame?.url!=='mist://game/')throw new Error('Invalid sender');event.returnValue={ok:true,...action(...args)};}catch(error){event.returnValue={ok:false,error:error.message};}});

 protocol.handle('mist',request=>{const url=new URL(request.url);if(url.host!=='game'||request.method!=='GET')return new Response('Not found',{status:404});let file;try{file=decodeURIComponent(url.pathname);}catch{return new Response('Not found',{status:404});}if(file==='/')file='/index.html';const root=path.resolve(__dirname,'..');const target=path.resolve(root,'.'+file);if(!target.startsWith(root+path.sep)||!(/\.(html|css|js|mjs|png)$/.test(target))||file.includes('/desktop/')||file.includes('/node_modules/')||file.includes('/scripts/'))return new Response('Not found',{status:404});return net.fetch(pathToFileURL(target).href);});
 session.defaultSession.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
 Menu.setApplicationMenu(null);
 function create(){window=new BrowserWindow({width:1280,height:800,minWidth:640,minHeight:480,title:'霧海之聲',backgroundColor:'#0b1722',autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true}});window.webContents.setWindowOpenHandler(()=>({action:'deny'}));window.webContents.on('will-navigate',(event,url)=>{if(url!=='mist://game/')event.preventDefault();});window.webContents.on('before-input-event',(event,input)=>{if(input.type==='keyDown'&&input.key==='F11'){window.setFullScreen(!window.isFullScreen());event.preventDefault();}if(input.type==='keyDown'&&input.key==='Escape'&&window.isFullScreen())window.setFullScreen(false);});window.loadURL('mist://game/');window.on('closed',()=>{window=null;});}
 create();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)create();});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
}
