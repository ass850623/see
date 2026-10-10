import {readFile,writeFile,mkdir,readdir,stat} from 'node:fs/promises';
import {createReadStream,createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const {ZipFile}=require('yazl');const asar=require('@electron/asar');
const root=process.cwd(),dir=path.join(root,'dist/win-unpacked'),archive=path.join(dir,'resources/app.asar');
const pkg=JSON.parse(await readFile('package.json','utf8'));const packed=JSON.parse(asar.extractFile(archive,'package.json'));
if(pkg.version!==packed.version)throw Error('Packaged version mismatch; rebuild Windows first');
const source=await readdir(root);const expected=source.filter(f=>(f.endsWith('.mjs')&&!f.endsWith('.test.mjs'))||['index.html','game.js','chapter-ui.js','style.css'].includes(f));
for(const file of expected){if(!asar.extractFile(archive,file).equals(await readFile(file)))throw Error('Packaged source is stale: '+file);}
for(const file of await readdir('desktop'))if(file.endsWith('.cjs')&&!asar.extractFile(archive,'desktop/'+file).equals(await readFile('desktop/'+file)))throw Error('Packaged desktop source is stale: '+file);
for(const file of await readdir('assets'))if(file.endsWith('.png')&&!asar.extractFile(archive,'assets/'+file).equals(await readFile('assets/'+file)))throw Error('Packaged art is stale: '+file);
const exe=await readFile(path.join(dir,'VoicesOfTheMist.exe'));const offset=exe.readUInt32LE(0x3c);if(exe.toString('ascii',0,2)!=='MZ'||exe.toString('ascii',offset,offset+4)!=='PE\0\0'||exe.readUInt16LE(offset+4)!==0x8664)throw Error('Expected Windows x64 executable');
const commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();const runtimeInfo=JSON.parse(asar.extractFile(archive,'desktop/build-info.json'));if(runtimeInfo.sourceCommit!==commit)throw Error('Runtime build commit is stale; rebuild Windows first');const dirty=Boolean(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim());
async function hash(file){const h=createHash('sha256');for await(const chunk of createReadStream(file))h.update(chunk);return h.digest('hex');}
async function files(folder,prefix=''){const out=[];for(const entry of await readdir(folder,{withFileTypes:true})){const rel=prefix+entry.name;if(entry.isDirectory())out.push(...await files(path.join(folder,entry.name),rel+'/'));else if(entry.isFile())out.push(rel);else throw Error('Unsupported package entry: '+rel);}return out.sort();}
const artifacts=await files(dir);const entries=[];for(const file of artifacts)entries.push({path:file,bytes:(await stat(path.join(dir,file))).size,sha256:await hash(path.join(dir,file))});
const info={formatVersion:1,product:'霧海之聲',version:pkg.version,sourceCommit:commit,sourceDirty:dirty,builtAtUtc:new Date().toISOString(),target:'windows-x64',content:'第一章開發試玩版，非完整 70 小時作品',windowsRuntimeStatus:'未驗收',steamUploadStatus:'未上傳',files:entries};
const kit=path.join(root,'dist/windows-playtest-kit');await mkdir(kit,{recursive:true});await writeFile(path.join(kit,'BUILD-INFO.json'),JSON.stringify(info,null,2)+'\n');
const notes=['START-HERE.txt','WINDOWS-CHECKLIST.md','acceptance-record.csv'];for(const file of notes)await writeFile(path.join(kit,file),await readFile(path.join(root,'docs/windows-playtest',file)));
const target=path.join(root,'dist/VoicesOfTheMist-Windows-test.zip');const zip=new ZipFile();const writing=pipeline(zip.outputStream,createWriteStream(target));for(const file of artifacts)zip.addFile(path.join(dir,file),'VoicesOfTheMist/'+file);for(const file of ['BUILD-INFO.json',...notes])zip.addFile(path.join(kit,file),'VoicesOfTheMist/'+file);zip.end();await writing;
await writeFile(target+'.sha256',await hash(target)+'  '+path.basename(target)+'\n');console.log(`Windows kit verified and packaged: ${artifacts.length} game files; source ${commit.slice(0,7)}${dirty?' (uncommitted changes recorded)':''}. Windows runtime remains untested.`);
