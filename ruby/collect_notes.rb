#!/usr/bin/env ruby

# ============================================================
# Helper to Create JS array of all versions
# ============================================================
require "labclient"
require "sem_version"

client = LabClient::Client.new(url: "https://gitlab.com", token: "")

project = "gitlab-com/www-gitlab-com"

# Collect Root
tree = client.repository.tree(project, ref: :master, path: "data/release_posts")

# Filter
dirs = tree.map(&:name).reject { |x| x.include? "yml" }
dirs.delete "unreleased"

index = dirs.each_with_object({}) do |dir, idx|
  idx[dir] ||= []
  tree = client.repository.tree(project, ref: :master, path: "data/release_posts/#{dir}")
  tree.select { |x| x.name.include? "upgrade" }.map do |file|
    output = YAML.load client.files.show(project, file.path, :master, :raw)
    idx[dir].push output.dig("upgrade", "description")&.split("\n")
  end

  idx
end

# Compact
index.transform_values!(&:compact).transform_values!(&:flatten)

# src/util/notes.js
File.write("notes.js", "const notes = #{index.to_json}\nexport default notes;")
