#!/usr/bin/env bash

PLUGINS="ruby nodejs yarn shfmt"

for name in $PLUGINS
do
    asdf plugin add $name
done

asdf install
