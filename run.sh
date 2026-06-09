#!/usr/bin/env bash
pushd ~/Documents/code/Morin_Website #切至该目录
python -m http.server 8000
popd #切回
