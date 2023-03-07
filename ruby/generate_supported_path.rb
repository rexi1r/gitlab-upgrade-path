#!/usr/bin/env ruby

# ============================================================
# Helper to Create JS array of all versions
# ============================================================
require 'yaml'
require 'json'

list = YAML.safe_load_file '../upgrade-path.yml'

result = list.map { |e| "flux.dispatch('version/add',#{e.to_json})" }

output = <<~RESULT
  import flux from "@aust/react-flux";

  #{result.join("\n")}
RESULT

File.write('versions.js', output)
