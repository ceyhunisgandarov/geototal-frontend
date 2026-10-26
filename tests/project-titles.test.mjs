import test from 'node:test';
import assert from 'node:assert/strict';
import {localizedProjectName} from '../src/lib/localizedText.js';
for(const locale of ['az','en','ru','ky']) test(`Project name uses ${locale} translation`,()=>{
 const project={projectName:'AZ',projectNameEn:'EN',projectNameRu:'RU',projectNameKy:'KY'};
 assert.equal(localizedProjectName(project,locale),locale.toUpperCase());
});
test('Missing translation preserves existing project name',()=>assert.equal(localizedProjectName({projectName:'Hilton Baku'},'en'),'Hilton Baku'));
