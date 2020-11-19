$ts_files = @(Get-ChildItem "./src/*.ts")
tsc --outDir ./src/js --module commonjs --moduleResolution node @ts_files
browserify ./src/js/main.js -s main -o web/main.js