#!/usr/bin/env bash

set -e

collect_data() {
	cd ruby
	bundle install

	echo "Collecting all tags in gitlab-org/gitlab in index.json..."
	bundle exec collect_versions.rb
	echo "Downloading all release post data to releases.js..."
	bundle exec release_posts.rb
	echo "Downloading all release notes data to notes.js..."
	bundle exec collect_notes.rb
	echo "Generating upgrade path using upgrade-path.yml to versions.js..."
	bundle exec generate_supported_path.rb
	echo "Generating JSON upgrade path to path.json..."
	bundle exec create_json_upgrade_path.rb
	echo "Generating JSON deprecations to deprecations.json..."
	bundle exec collect_deprecations.rb
	echo "Generating JSON alerts to alert.json..."
	bundle exec create_json_alerts.rb
}

generate_web() {
	yarn install
	echo "Generating Web pages..."
	if [[ -n "$CI" ]]; then
		yarn build
	else
		yarn build-localhost
		echo ""
		echo "You should now be able to view the page locally starting a Web server:"
		echo ""
		echo "ruby -run -e httpd build -p 8000"
		echo ""
		echo "Then visit http://localhost:8000 in your browser."
	fi
}
