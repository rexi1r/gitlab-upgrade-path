#!/usr/bin/env ruby

# ============================================================
# Helper to Create JS array of all versions
# ============================================================
require 'yaml'
require 'json'
require 'labclient'

# https://about.gitlab.com/support/statement-of-support/#version-support
# "we support the current major version and previous two major versions only"

client = LabClient::Client.new(url: 'https://gitlab.com', token: '')

project = 'gitlab-org/gitlab'

list = YAML.safe_load(client.files.show(project, 'config/upgrade_path.yml', :master, :raw).data)

# Version Index
index = JSON.parse File.read('index.json')

# Find Latest Patch Version for Minor Steps
all = list.map do |step|
  # Ignore Future Versions
  next unless index.find { |v| step['major'] == v['major'] && step['minor'] == v['minor'] }

  index.find { |v| step['major'] == v['major'] && step['minor'] == v['minor'] }['version']
end.compact

# Add Very Latest
all.push index.first['version']

# Supported Versions List
supported = index.map { |v| v['major'] }.uniq[0..1]

# Find Latest Patch Version for Minor Steps
supported_path = list.map do |step|
  next unless supported.include? step['major']

  # Ignore Future Versions
  next unless index.find { |v| step['major'] == v['major'] && step['minor'] == v['minor'] }

  index.find { |v| step['major'] == v['major'] && step['minor'] == v['minor'] }['version']
end.compact

result = {
  supported: supported_path.compact,
  all: all
}

File.write('path.json', result.to_json)
