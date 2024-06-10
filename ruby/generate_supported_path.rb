#!/usr/bin/env ruby

# ============================================================
# Helper to Create JS array of all versions
# ============================================================
require 'yaml'
require 'json'
require 'labclient'

client = LabClient::Client.new(url: 'https://gitlab.com', token: '')

project = 'gitlab-org/gitlab'

# Collect ugprade_path.yml

list = YAML.safe_load(client.files.show(project, 'config/upgrade_path.yml', :master, :raw).data)

result = list.map { |e| "flux.dispatch('version/add',#{e.to_json})" }

output = <<~RESULT
  import flux from "@aust/react-flux";

  #{result.join("\n")}
RESULT

File.write('versions.js', output)
