.PHONY: all
all: data web

GENERATED_FILES = ruby/index.json ruby/releases.js ruby/notes.js ruby/path.json

$(GENERATED_FILES): upgrade-path.yml

.PHONY: data
data: $(GENERATED_FILES)
	@echo "Data already generated"

$(GENERATED_FILES): upgrade-path.yml
	. ./scripts/build_helpers.sh && collect_data

.PHONY: web
web: $(GENERATED_FILES)
	. ./scripts/build_helpers.sh && generate_web

.PHONY: clean
clean:
	rm -rf $(GENERATED_FILES) build/
