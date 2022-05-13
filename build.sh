#!/bin/sh

alias esbuild="npx esbuild"

esbuild --target=chrome70 --outfile=dist/index.esm.js --format=esm src/index.js
esbuild --target=node14 --outfile=dist/index.js --format=cjs src/index.js