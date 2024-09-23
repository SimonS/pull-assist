# Define variables
SRC_DIR := src
DIST_DIR := dist

all: clean build copy

build:
	pnpm run build

test:
	pnpm test

copy:
	mkdir -p $(DIST_DIR)
	cp $(SRC_DIR)/manifest.json $(DIST_DIR)/manifest.json
	cp $(SRC_DIR)/*.html $(DIST_DIR)
	cp $(SRC_DIR)/*.css $(DIST_DIR)
	mkdir -p $(DIST_DIR)/icons
	cp -r $(SRC_DIR)/icons/* $(DIST_DIR)/icons/

clean:
	rm -rf $(DIST_DIR)

watch:
	pnpm run watch

.PHONY: all build copy clean watch
