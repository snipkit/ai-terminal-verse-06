.PHONY: build clean install test cross-build help optimize validate-export

# Default target
all: build

# Build optimized release binary
build:
	@echo "Building optimized release binary..."
	@./scripts/build.sh release

# Build fast release binary
build-fast:
	@echo "Building fast release binary..."
	@./scripts/build.sh fast

# Maximum optimization build
optimize:
	@echo "Building with maximum optimizations..."
	@./scripts/optimize-build.sh --clean --strip --upx

# Size-optimized build
build-size:
	@echo "Building size-optimized binary..."
	@./scripts/optimize-build.sh --profile release-size --clean --strip

# Speed-optimized build
build-speed:
	@echo "Building speed-optimized binary..."
	@./scripts/optimize-build.sh --profile release-speed --clean

# Validate and export workflows
validate-export:
	@echo "Validating and exporting all workflows..."
	@chmod +x ./scripts/validate-export.sh
	@./scripts/validate-export.sh

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@./scripts/build.sh clean
	@rm -rf ./dist

# Install cross-compilation targets
install-targets:
	@echo "Installing cross-compilation targets..."
	@./scripts/cross-build.sh install

# Cross-platform build
cross-build:
	@echo "Building for all platforms..."
	@./scripts/cross-build.sh all

# Build for specific target
cross-build-linux:
	@./scripts/cross-build.sh x86_64-unknown-linux-gnu

cross-build-windows:
	@./scripts/cross-build.sh x86_64-pc-windows-gnu

cross-build-macos:
	@./scripts/cross-build.sh x86_64-apple-darwin

cross-build-macos-arm:
	@./scripts/cross-build.sh aarch64-apple-darwin

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
benchmark:
	@echo "Running benchmark build..."
	@time ./scripts/optimize-build.sh --clean --verbose

# Show help
help:
	@echo "Available targets:"
	@echo "  build           - Build optimized release binary"
	@echo "  build-fast      - Build fast release binary"
	@echo "  optimize        - Build with maximum optimizations (strip + UPX)"
	@echo "  build-size      - Build size-optimized binary"
	@echo "  build-speed     - Build speed-optimized binary"
	@echo "  validate-export - Validate and export all workflows to ./dist/"
	@echo "  clean           - Clean build artifacts"
	@echo "  install-targets - Install cross-compilation targets"
	@echo "  cross-build     - Build for all platforms"
	@echo "  cross-build-*   - Build for specific platform"
	@echo "  test            - Run tests"
	@echo "  check           - Run code quality checks"
	@echo "  fmt             - Format code"
	@echo "  install         - Install binary locally"
	@echo "  benchmark       - Run benchmark build"
	@echo "  help            - Show this help"
