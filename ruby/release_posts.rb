#!/usr/bin/env ruby

# ============================================================
# Helper to Collect Release Posts
# ============================================================
require "labclient"
require "sem_version"

client = LabClient::Client.new(url: "https://gitlab.com", token: "")
file = client.files.show("gitlab-com/www-gitlab-com", "data/release_post_managers.yml", :master, :raw)
releases = YAML.load(file)["releases"]

# Convert to Usable
index = {}
releases.each do |release|
  version = SemVersion.new(release["version"] + ".0")
  next unless version.major >= 12 # Trim to 12

  date = release["date"].gsub("-", "/")
  version_blob = release["version"].gsub(".", "-")
  index[release["version"]] = "https://about.gitlab.com/releases/#{date}/gitlab-#{version_blob}-released/"
end

# src/util/releases
File.write("releases.js", "const releases = #{index.to_json}\nexport default releases;")
