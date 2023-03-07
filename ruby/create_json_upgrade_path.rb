#!/usr/bin/env ruby

# ============================================================
# Helper to Create JS array of all versions
# ============================================================
require 'yaml'
require 'json'

# https://about.gitlab.com/support/statement-of-support/#version-support
# "we support the current major version and previous two major versions only"

list = YAML.safe_load_file '../upgrade-path.yml'

# Version Index
index = JSON.parse File.read('index.json')

# Find Latest Patch Version for Minor Steps
all = list.map do |step|
  index.find { |v| step['major'] == v['major'] && step['minor'] == v['minor'] }['version']
end

# Add Very Latest
all.push index.first['version']

# Supported Versions List
supported = index.map { |v| v['major'] }.uniq[0..1]

# Find Latest Patch Version for Minor Steps
supported_path = list.map do |step|
  next unless supported.include? step['major']

  index.find { |v| step['major'] == v['major'] && step['minor'] == v['minor'] }['version']
end

result = {
  supported: supported_path.compact,
  all: all
}

File.write('path.json', result.to_json)
