Remove-Item -R ./src/js -ErrorAction Ignore
$ts_files = @(Get-ChildItem "./src/*.ts")
echo 'Compiling TypeScript...'
tsc --outDir ./src/js --module commonjs --moduleResolution node --noImplicitUseStrict @ts_files
echo 'Browserifying everything...'
browserify ./src/js/main.js -s main -o ./web/main.js