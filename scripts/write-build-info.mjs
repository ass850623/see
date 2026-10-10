import {execFileSync} from 'node:child_process';import {writeFile} from 'node:fs/promises';
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();const sourceDirty=Boolean(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim());await writeFile('desktop/build-info.json',JSON.stringify({sourceCommit,sourceDirty})+'\n');
