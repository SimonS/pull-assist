# Define variables
SRC_DIR := src
DIST_DIR := dist

all: clean build copy

build:
	pnpm tsc

copy:
	mkdir -p $(DIST_DIR)
	cp $(SRC_DIR)/manifest.json $(DIST_DIR)/manifest.json
	cp $(SRC_DIR)/popup.html $(DIST_DIR)/popup.html
	cp $(SRC_DIR)/popup.css $(DIST_DIR)/popup.css
	mkdir -p $(DIST_DIR)/icons
	cp -r $(SRC_DIR)/icons/* $(DIST_DIR)/icons/

clean:
	rm -rf $(DIST_DIR)

watch:
	pnpm tsc -w

.PHONY: all build copy clean watch
