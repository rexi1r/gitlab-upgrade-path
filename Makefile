.PHONY: all
all: data web

GENERATED_FILES = ruby/index.json ruby/releases.js ruby/notes.js ruby/path.json ruby/deprecations.json ruby/background_migrations.js

.PHONY: data
data: $(GENERATED_FILES)
	@echo "Data already generated"

$(GENERATED_FILES):
	. ./scripts/build_helpers.sh && collect_data

.PHONY: web
web: $(GENERATED_FILES)
	@./setup.sh
	. ./scripts/build_helpers.sh && generate_web

.PHONY: clean
clean:
	rm -rf $(GENERATED_FILES) build/
