#!/usr/bin/env ruby

# ============================================================
# Helper to Create JS array of all Alerts
# ============================================================
require 'yaml'
require 'json'

list = YAML.safe_load_file '../alerts.yml'

# src/util/deprecations.js
File.write('alerts.js', "const alerts = #{list.to_json}\nexport default alerts;")
