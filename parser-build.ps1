pegjs -o ./src/parser.ts ./src/parser.pegjs
Add-Content ./src/parser.ts 'export = module.exports'