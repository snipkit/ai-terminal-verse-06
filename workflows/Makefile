
.PHONY: build clean install test cross-build help optimize validate-export package

# Default target
all: build

# Configuration
VERSION := $(shell grep '^version' workflow-cli/Cargo.toml | sed 's/.*"\(.*\)".*/\1/')
BUILD_SCRIPT := ./scripts/cross-platform-build.sh

# Make the build script executable
$(BUILD_SCRIPT):
	chmod +x $(BUILD_SCRIPT)

# Build optimized release binary
build: $(BUILD_SCRIPT)
	@echo "Building optimized release binary..."
	@./scripts/build.sh release

# Build fast release binary
build-fast: $(BUILD_SCRIPT)
	@echo "Building fast release binary..."
	@./scripts/build.sh fast

# Maximum optimization build
optimize: $(BUILD_SCRIPT)
	@echo "Building with maximum optimizations..."
	@./scripts/optimize-build.sh --clean --strip --upx

# Size-optimized build
build-size: $(BUILD_SCRIPT)
	@echo "Building size-optimized binary..."
	@./scripts/optimize-build.sh --profile release-size --clean --strip

# Speed-optimized build
build-speed: $(BUILD_SCRIPT)
	@echo "Building speed-optimized binary..."
	@./scripts/optimize-build.sh --profile release-speed --clean

# Cross-platform builds
cross-build: $(BUILD_SCRIPT)
	@echo "Building for all platforms..."
	@$(BUILD_SCRIPT) --optimize --package

cross-build-linux: $(BUILD_SCRIPT)
	@echo "Building for Linux platforms..."
	@$(BUILD_SCRIPT) -t linux-x64,linux-arm64 --optimize

cross-build-windows: $(BUILD_SCRIPT)
	@echo "Building for Windows..."
	@$(BUILD_SCRIPT) -t windows-x64 --optimize

cross-build-macos: $(BUILD_SCRIPT)
	@echo "Building for macOS..."
	@$(BUILD_SCRIPT) -t macos-x64,macos-arm64 --optimize

# Quick cross-build without optimization
cross-build-fast: $(BUILD_SCRIPT)
	@echo "Fast cross-platform build..."
	@$(BUILD_SCRIPT)

# Release build with full optimization and packaging
release: $(BUILD_SCRIPT)
	@echo "Creating release build..."
	@$(BUILD_SCRIPT) --clean --optimize --package --strip --upx

# Install build dependencies
install-deps: $(BUILD_SCRIPT)
	@echo "Installing build dependencies..."
	@$(BUILD_SCRIPT) --install-deps

# Validate and export workflows
validate-export:
	@echo "Validating and exporting all workflows..."
	@chmod +x ./scripts/validate-export.sh
	@./scripts/validate-export.sh

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@./scripts/build.sh clean
	@rm -rf ./dist ./packages

# Run tests
test:
	@echo "Running tests..."
	@cd workflow-cli && cargo test

# Check code quality
check:
	@echo "Running cargo check..."
	@cd workflow-cli && cargo check
	@echo "Running clippy..."
	@cd workflow-cli && cargo clippy -- -D warnings
	@echo "Checking formatting..."
	@cd workflow-cli && cargo fmt -- --check

# Format code
fmt:
	@echo "Formatting code..."
	@cd workflow-cli && cargo fmt

# Install binary locally
install:
	@echo "Installing binary..."
	@cd workflow-cli && cargo install --path .

# Benchmark build
benchmark: $(BUILD_SCRIPT)
	@echo "Running benchmark build..."
	@time $(BUILD_SCRIPT) --clean --verbose

# Development commands
dev-setup: install-deps
	@echo "Setting up development environment..."
	@cd workflow-cli && cargo build

# Create distribution packages for specific platforms
package-linux: $(BUILD_SCRIPT)
	@$(BUILD_SCRIPT) -t linux-x64,linux-arm64 --package

package-windows: $(BUILD_SCRIPT)
	@$(BUILD_SCRIPT) -t windows-x64 --package

package-macos: $(BUILD_SCRIPT)
	@$(BUILD_SCRIPT) -t macos-x64,macos-arm64 --package

# Show help
help:
	@echo "Available targets:"
	@echo ""
	@echo "Basic Builds:"
	@echo "  build           - Build optimized release binary"
	@echo "  build-fast      - Build fast release binary"
	@echo "  optimize        - Build with maximum optimizations (strip + UPX)"
	@echo "  build-size      - Build size-optimized binary"
	@echo "  build-speed     - Build speed-optimized binary"
	@echo ""
	@echo "Cross-Platform Builds:"
	@echo "  cross-build     - Build for all platforms (optimized + packaged)"
	@echo "  cross-build-fast- Fast cross-platform build"
	@echo "  cross-build-*   - Build for specific platform group"
	@echo "  release         - Full release build with packaging"
	@echo ""
	@echo "Platform-Specific Packaging:"
	@echo "  package-linux   - Create Linux packages"
	@echo "  package-windows - Create Windows packages"
	@echo "  package-macos   - Create macOS packages"
	@echo ""
	@echo "Development:"
	@echo "  install-deps    - Install build dependencies"
	@echo "  dev-setup       - Setup development environment"
	@echo "  test            - Run tests"
	@echo "  check           - Run code quality checks"
	@echo "  fmt             - Format code"
	@echo "  install         - Install binary locally"
	@echo ""
	@echo "Utilities:"
	@echo "  validate-export - Validate and export workflows"
	@echo "  clean           - Clean build artifacts"
	@echo "  benchmark       - Run benchmark build"
	@echo "  help            - Show this help"
	@echo ""
	@echo "Examples:"
	@echo "  make cross-build           # Build for all platforms"
	@echo "  make cross-build-linux     # Build for Linux only"
	@echo "  make release               # Create full release"
	@echo "  make dev-setup             # Setup development environment"
