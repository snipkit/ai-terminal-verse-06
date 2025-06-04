
# Workflow CLI

A command-line tool for managing workflows written in Rust.

## Features

- List and filter workflows by tags
- Run workflows with custom arguments
- Create new workflows interactively
- Validate workflow YAML files
- Cross-platform support (Windows, macOS, Linux)

## Building

### Prerequisites

- Rust 1.70+ installed
- Git (optional, for build metadata)

### Quick Build

```bash
# From the workflows directory
make build
```

### Build Options

```bash
# Fast build (less optimization, faster compile)
make build-fast

# Clean build artifacts
make clean

# Run tests
make test

# Check code quality
make check

# Format code
make fmt
```

### Cross-Platform Building

```bash
# Install cross-compilation targets
make install-targets

# Build for all platforms
make cross-build

# Build for specific platforms
make cross-build-linux
make cross-build-windows
make cross-build-macos
make cross-build-macos-arm
```

### Manual Building

```bash
cd workflow-cli

# Debug build
cargo build

# Release build
cargo build --release

# Fast release build
cargo build --profile release-fast

# Cross-platform build
cargo build --release --target x86_64-unknown-linux-gnu
```

## Build Profiles

- **debug**: Development build with debug symbols
- **release**: Fully optimized build with LTO and stripped symbols
- **release-fast**: Optimized build with faster compilation

## Usage

```bash
# List all workflows
workflow list

# List workflows by tag
workflow list --tag git

# Run a workflow
workflow run "deploy-to-production" --args env=staging --args branch=main

# Create a new workflow
workflow create --output my-workflow.yaml

# Validate workflows
workflow validate --dir specs/
```

## Build Artifacts

Build artifacts are placed in:
- `dist/` - Single-platform builds
- `dist/cross-platform/` - Cross-platform builds with archives

## Development

```bash
# Run in development mode
cargo run -- list

# Run tests
cargo test

# Run with specific log level
RUST_LOG=debug cargo run -- list
```
