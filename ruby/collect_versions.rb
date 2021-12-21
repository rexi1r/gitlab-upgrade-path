#!/usr/bin/env ruby

# ============================================================
# Helper to Create JS array of all versions
# ============================================================
require "labclient"
require "sem_version"

client = LabClient::Client.new(url: "https://gitlab.com", token: "")
all = client.projects.show("gitlab-org/gitlab").tags(search: "-ee$", per_page: 100).auto_paginate; :ok # 13s
all.select! { |x| x.name =~ /^v(\d+)\.(\d+)\.(\d+)-ee$/ }; :ok # Filter by Valid Version

all.map! { |x| SemVersion.new x.name.scan(/^v(.*)-ee$/).flatten.first }; :ok # Convert to SemVer

# 12 or Higher
all.select! { |x| x.major >= 12 }

# List of all Versions
index = all.sort.reverse.uniq.map do |version|
  { version: version.to_s, major: version.major, minor: version.minor }
end

targets = index.each_with_object({}) do |version, targets|
  idx = version.slice(:major, :minor).values.join(".")
  targets[idx] ||= version # Default to current

  target = SemVersion.new targets.dig(idx, :version)  # Easier Access

  targets[idx] = version if target < SemVersion.new(version[:version])
end

# Minor Version Targets
output = {
  index: index,
  targets: targets.values,
}

# src/util/all
File.write("all.js", "const versions = #{output.to_json}\nexport default versions;")
