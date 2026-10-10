export const settingsKey='mist-settings-v1';
export const defaultSettings={version:1,fontScale:1,contrast:false};
export function decodeSettings(raw){try{const s=JSON.parse(raw);return s&&s.version===1&&[1,1.15,1.3].includes(s.fontScale)&&typeof s.contrast==='boolean'?{version:1,fontScale:s.fontScale,contrast:s.contrast}:null;}catch{return null;}}
