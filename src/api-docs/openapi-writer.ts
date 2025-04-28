import fs from 'node:fs';
import path from 'node:path';
import { stringify } from 'yaml';
import { openApiDoc } from './openapi-generator';

// Convert OpenAPI doc to YAML
const yamlDoc = stringify(openApiDoc);
const scriptDir = path.resolve(__dirname);
// Write to YAML file
fs.writeFileSync(`${scriptDir}/openapi.yaml`, yamlDoc);
console.log('OpenAPI document generated in YAML format');

// Convert OpenAPI doc to JSON
const jsonDoc = JSON.stringify(openApiDoc, null, 2);
// Write to JSON file
fs.writeFileSync(`${scriptDir}/openapi.json`, jsonDoc);
console.log('OpenAPI document generated in JSON format');
