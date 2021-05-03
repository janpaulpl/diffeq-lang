echo 'Building parser...'
pegjs -o ./src/parser.ts ./src/parser.pegjs
"import types = require(`"./types`");`nimport expr = require(`"./expr`");`n" + (Get-Content ./src/parser.ts -Raw) + 'export = module.exports;' |
	Set-Content ./src/parser.ts
#Add-Content ./src/parser.ts 