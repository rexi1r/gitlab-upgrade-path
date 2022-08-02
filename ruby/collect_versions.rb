#!/usr/bin/env ruby

# rubocop:disable Lint/Void, Style/Semicolon

# ============================================================
# Helper to Create JS array of all versions
# ============================================================
require 'labclient'
require 'sem_version'

client = LabClient::Client.new(url: 'https://gitlab.com', token: '')
all = client.projects.show('gitlab-org/gitlab').tags(search: '-ee$', per_page: 100).auto_paginate; :ok # 13s
all.select! { |x| x.name =~ /^v(\d+)\.(\d+)\.(\d+)-ee$/ }; :ok # Filter by Valid Version

# Format / Uniq Only
all.map! { |x| x.name.scan(/^v(.*)-ee$/).flatten.first }.uniq!

# Convert to SemVer
all.map! { |x| SemVersion.new x }; :ok

# 8 or Higher
all.select! { |x| x.major >= 8 }

# List of all Versions
index = all.sort.reverse.uniq.map do |version|
  { version: version.to_s, major: version.major, minor: version.minor }
end

targets = index.each_with_object({}) do |version, targets_build|
  idx = version.slice(:major, :minor).values.join('.')
  targets_build[idx] ||= version # Default to current

  target = SemVersion.new targets_build.dig(idx, :version) # Easier Access

  targets_build[idx] = version if target < SemVersion.new(version[:version])
end

# Filter Patches below 13
index.select! do |version|
  if version[:major] > 13
    true
  else
    targets["#{version[:major]}.#{version[:minor]}"] == version
  end
end

# Minor Version Targets
output = {
  index: index,
  targets: targets.values
}

# src/util/all
File.write('all.js', "const versions = #{output.to_json}\nexport default versions;")
