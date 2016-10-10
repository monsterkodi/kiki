#!/usr/bin/env bash

rm -rf dist app/js app/css app/bin app/sound app/img app/*.html app/node_modules
cp -r js css bin sound *.html app
mkdir app/img
cp img/glow.png app/img/glow.png
cd app && npm install
cd ..
