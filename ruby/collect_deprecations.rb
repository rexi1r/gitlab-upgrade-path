#!/usr/bin/env ruby

# ============================================================
# Helper to Create JS array of all versions
# ============================================================
require 'labclient'
require 'sem_version'

client = LabClient::Client.new(url: 'https://gitlab.com', token: '')

project = 'gitlab-org/gitlab'

# Collect Root
tree = client.repository.tree(project, ref: :master, path: 'data/deprecations')

# Convert into YAML
list = tree.select { |x| x.name.include? 'yml' }.flat_map do |file|
  puts "Collecting File #{file.name}"
  YAML.safe_load(
    client.files.show(project, file.path, :master, :raw).data,
    permitted_classes: [Date]
  )
end

index = {}

# Format
list.each do |dep|
  major, minor = dep['removal_milestone'].split('.').map(&:to_i)
  values = dep.slice('body', 'issue_url', 'documentation_url', 'title', 'removal_milestone', 'breaking_change')

  values['major'] = major
  values['minor'] = minor

  index[major] ||= {}
  index[major][minor] ||= []
  index[major][minor].push values
end

# src/util/deprecations.js
File.write('deprecations.js', "const deprecations = #{index.to_json}\nexport default deprecations;")
