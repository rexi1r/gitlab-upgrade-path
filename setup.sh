#!/bin/bash

cp ruby/all.js src/util
cp ruby/releases.js src/util

# Helper to remove the need for manual entries
list='src/util/versions.js'
echo '' > $list 
for i in $(ls src/versions); do echo "import \"versions/$i\"" >> $list ; done