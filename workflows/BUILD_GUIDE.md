
# Warp Terminal Cross-Platform Build Guide

This guide explains how to build Warp Terminal binaries for multiple platforms using the enhanced build system.

## 🚀 Quick Start

```bash
# Install dependencies
make install-deps

# Build for all platforms
make cross-build

# Create release packages
make release
```

## 📋 Prerequisites

### Required Tools
- **Rust** (1.70+) - Install via [rustup](https://rustup.rs/)
- **Git** - For version metadata
- **Make** - Build automation

### Optional Tools
- **UPX** - Binary compression (reduces size by 50-70%)
- **Platform-specific toolchains** (automatically installed)

### Platform-Specific Requirements

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install gcc-mingw-w64 gcc-aarch64-linux-gnu

# CentOS/RHEL
sudo yum install mingw64-gcc mingw32-gcc
```

**macOS:**
```bash
# Install via Homebrew
brew install mingw-w64
```

**Windows:**
```bash
# Install via chocolatey
choco install mingw
```

## 🛠️ Build Commands

### Basic Builds

```bash
# Standard optimized build
make build

# Fast development build
make build-fast

# Maximum optimization
make optimize

# Size-optimized build
make build-size

# Speed-optimized build
make build-speed
```

### Cross-Platform Builds

```bash
# Build for all platforms
make cross-build

# Platform-specific builds
make cross-build-linux    # Linux x64 + ARM64
make cross-build-windows  # Windows x64
make cross-build-macos    # macOS x64 + ARM64

# Fast cross-build (no optimization)
make cross-build-fast
```

### Release Builds

```bash
# Full release with packaging
make release

# Platform-specific packages
make package-linux
make package-windows
make package-macos
```

## 🎯 Advanced Usage

### Custom Target Selection

```bash
# Build specific targets
./scripts/cross-platform-build.sh -t linux-x64,windows-x64

# With optimization
./scripts/cross-platform-build.sh -t macos-arm64 --optimize --strip
```

### Build Options

```bash
# Available options
--optimize          # Maximum optimization
--package          # Create distribution packages
--clean            # Clean before building
--strip            # Strip debug symbols
--upx              # Compress with UPX
--verbose          # Verbose output
--jobs N           # Parallel build jobs
```

### Examples

```bash
# Development build
./scripts/cross-platform-build.sh -t linux-x64 --verbose

# Production build
./scripts/cross-platform-build.sh --clean --optimize --package --strip --upx

# CI/CD build
./scripts/cross-platform-build.sh -t linux-x64,windows-x64 --optimize --package
```

## 📦 Build Artifacts

### Directory Structure

```
workflows/
├── dist/                       # Built binaries
│   ├── workflow-linux-x64
│   ├── workflow-windows-x64.exe
│   └── workflow-macos-arm64
└── packages/                   # Distribution packages
    ├── warp-workflow-cli-v0.1.0-linux-x64.tar.gz
    ├── warp-workflow-cli-v0.1.0-windows-x64.zip
    ├── warp-workflow-cli-v0.1.0-macos-arm64.tar.gz
    └── checksums.sha256
```

### Package Contents

Each package includes:
- Compiled binary
- README.md
- LICENSE
- PACKAGE_INFO.txt (build metadata)

## 🎛️ Build Profiles

### Release (Default)
- **Optimization:** Maximum (`opt-level = 3`)
- **LTO:** Full link-time optimization
- **Panic:** Abort (smaller binary)
- **Debug:** Stripped
- **Use Case:** Production releases

### Release-Fast
- **Optimization:** High (`opt-level = 3`)
- **LTO:** Thin (faster compilation)
- **Use Case:** Development with performance testing

### Release-Size
- **Optimization:** Size (`opt-level = "s"`)
- **LTO:** Thin
- **Use Case:** Minimal binary size

### Release-Speed
- **Optimization:** Speed (`opt-level = 3`)
- **LTO:** Thin
- **Codegen Units:** 16 (parallel compilation)
- **Use Case:** Maximum runtime performance

## 🎯 Target Platforms

| Platform | Target Triple | Binary Name | Package Format |
|----------|---------------|-------------|----------------|
| Linux x64 | `x86_64-unknown-linux-gnu` | `workflow-linux-x64` | `.tar.gz` |
| Linux ARM64 | `aarch64-unknown-linux-gnu` | `workflow-linux-arm64` | `.tar.gz` |
| Windows x64 | `x86_64-pc-windows-gnu` | `workflow-windows-x64.exe` | `.zip` |
| macOS x64 | `x86_64-apple-darwin` | `workflow-macos-x64` | `.tar.gz` |
| macOS ARM64 | `aarch64-apple-darwin` | `workflow-macos-arm64` | `.tar.gz` |

## 🔧 Optimization Techniques

### Binary Size Reduction
1. **Rust Optimization:** LTO, codegen-units=1, panic=abort
2. **Symbol Stripping:** Remove debug symbols
3. **UPX Compression:** 50-70% size reduction
4. **Target-specific flags:** CPU-native optimizations

### Build Speed Improvement
1. **Parallel Jobs:** Use all CPU cores
2. **Thin LTO:** Faster than full LTO
3. **Incremental Builds:** Cache unchanged code
4. **Target Selection:** Build only needed platforms

### Binary Performance
1. **CPU-native:** Target-specific optimizations
2. **Link-time Optimization:** Cross-module optimization
3. **Panic Abort:** Smaller, faster error handling
4. **Release Profile:** Maximum runtime optimization

## 🧪 Testing Builds

```bash
# Run tests
make test

# Code quality checks
make check

# Benchmark build performance
make benchmark

# Validate binary functionality
./dist/workflow-linux-x64 --version
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Cross-Platform Build
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: make install-deps
      - name: Build all platforms
        run: make cross-build
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: warp-binaries
          path: workflows/packages/*
```

## 🔍 Troubleshooting

### Common Issues

**Target not installed:**
```bash
# Install missing target
rustup target add x86_64-unknown-linux-gnu
```

**Linker errors:**
```bash
# Install platform toolchain
make install-deps
```

**Permission denied:**
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

**UPX compression fails:**
```bash
# Install UPX
# macOS: brew install upx
# Ubuntu: apt-get install upx
```

### Build Verification

```bash
# Check binary architecture
file dist/workflow-linux-x64

# Test binary functionality
./dist/workflow-linux-x64 --help

# Verify package integrity
sha256sum -c packages/checksums.sha256
```

## 📚 Additional Resources

- [Rust Cross-Compilation Guide](https://rust-lang.github.io/rustup/cross-compilation.html)
- [Cargo Build Configuration](https://doc.rust-lang.org/cargo/reference/config.html)
- [UPX Documentation](https://upx.github.io/)
- [GitHub Actions for Rust](https://github.com/actions-rs)

This build system provides a robust, automated way to create production-ready Warp Terminal binaries for all major platforms while maintaining optimal performance and minimal size.
