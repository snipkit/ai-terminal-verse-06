
#!/bin/bash

set -e

# Enhanced Cross-Platform Rust Build Script for Warp Terminal
# Supports Windows, macOS, Linux with optimization and packaging

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="workflow-cli"
BUILD_DIR="target"
DIST_DIR="dist"
PACKAGE_DIR="packages"
VERSION=$(grep '^version' workflow-cli/Cargo.toml | sed 's/.*"\(.*\)".*/\1/')

# Target platforms with metadata
declare -A TARGETS=(
    ["x86_64-unknown-linux-gnu"]="linux-x64"
    ["aarch64-unknown-linux-gnu"]="linux-arm64"
    ["x86_64-pc-windows-gnu"]="windows-x64"
    ["x86_64-apple-darwin"]="macos-x64"
    ["aarch64-apple-darwin"]="macos-arm64"
)

# Print functions
print_header() {
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}           ${PURPLE}Warp Terminal Cross-Platform Builder${NC}           ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${PURPLE}[SUCCESS]${NC} $1"
}

# Show help
show_help() {
    print_header
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -t, --targets TARGETS     Comma-separated list of target platforms"
    echo "                            Available: ${!TARGETS[@]}"
    echo "  -o, --optimize            Enable maximum optimization"
    echo "  -p, --package             Create distribution packages"
    echo "  -c, --clean               Clean before building"
    echo "  -v, --verbose             Verbose output"
    echo "  -j, --jobs JOBS           Number of parallel jobs"
    echo "  --strip                   Strip debug symbols"
    echo "  --upx                     Compress with UPX"
    echo "  --install-deps            Install build dependencies"
    echo "  -h, --help                Show this help"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Build for all platforms"
    echo "  $0 -t linux-x64,windows-x64         # Build specific targets"
    echo "  $0 --optimize --package --strip      # Optimized build with packaging"
    echo "  $0 --install-deps                    # Install required dependencies"
    echo ""
    echo "Target Platforms:"
    for target in "${!TARGETS[@]}"; do
        echo "  ${TARGETS[$target]} -> $target"
    done
}

# Install build dependencies
install_dependencies() {
    print_step "Installing build dependencies..."
    
    # Install Rust if not present
    if ! command -v rustc >/dev/null 2>&1; then
        print_info "Installing Rust..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source ~/.cargo/env
    fi
    
    # Install cross-compilation targets
    print_info "Installing cross-compilation targets..."
    for target in "${!TARGETS[@]}"; do
        print_info "Installing target: $target"
        rustup target add $target
    done
    
    # Platform-specific dependencies
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command -v brew >/dev/null 2>&1; then
            print_warn "Homebrew not found. Please install it for optimal experience."
        else
            brew install mingw-w64 || true
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get >/dev/null 2>&1; then
            sudo apt-get update
            sudo apt-get install -y gcc-mingw-w64 gcc-aarch64-linux-gnu
        elif command -v yum >/dev/null 2>&1; then
            sudo yum install -y mingw64-gcc mingw32-gcc
        fi
    fi
    
    # Install optional tools
    if ! command -v upx >/dev/null 2>&1; then
        print_warn "UPX not found. Install it for binary compression."
    fi
    
    print_success "Dependencies installed successfully!"
}

# Clean build artifacts
clean_build() {
    print_step "Cleaning build artifacts..."
    rm -rf $BUILD_DIR $DIST_DIR $PACKAGE_DIR
    cd workflow-cli
    cargo clean
    cd ..
}

# Setup build environment
setup_environment() {
    print_step "Setting up build environment..."
    
    # Create directories
    mkdir -p $DIST_DIR $PACKAGE_DIR
    
    # Set optimization flags
    export CARGO_PROFILE_RELEASE_CODEGEN_UNITS=1
    export CARGO_PROFILE_RELEASE_LTO=true
    export CARGO_PROFILE_RELEASE_PANIC=abort
    export CARGO_PROFILE_RELEASE_OPT_LEVEL=3
    
    if [ "$OPTIMIZE" = true ]; then
        export RUSTFLAGS="-C target-cpu=native -C link-arg=-s"
    fi
}

# Build for specific target
build_target() {
    local target=$1
    local platform_name=${TARGETS[$target]}
    
    print_step "Building for $platform_name ($target)..."
    
    cd workflow-cli
    
    # Determine binary name and extension
    local binary_name="workflow"
    if [[ $target == *"windows"* ]]; then
        binary_name="workflow.exe"
    fi
    
    # Build command
    local build_cmd="cargo build --release --target $target --locked"
    if [ -n "$JOBS" ]; then
        build_cmd="$build_cmd --jobs $JOBS"
    fi
    if [ "$VERBOSE" = true ]; then
        build_cmd="$build_cmd --verbose"
    fi
    
    # Execute build
    print_info "Executing: $build_cmd"
    if eval $build_cmd; then
        print_success "✓ Build completed for $platform_name"
        
        # Copy binary to dist
        local binary_source="target/$target/release/$binary_name"
        local binary_dest="../$DIST_DIR/workflow-$platform_name"
        if [[ $target == *"windows"* ]]; then
            binary_dest+=".exe"
        fi
        
        if [ -f "$binary_source" ]; then
            cp "$binary_source" "$binary_dest"
            
            # Get binary size
            local size=$(stat -f%z "$binary_dest" 2>/dev/null || stat -c%s "$binary_dest" 2>/dev/null || echo "unknown")
            print_info "Binary size: $size bytes"
            
            # Strip if requested
            if [ "$STRIP_BINARY" = true ] && [[ $target != *"windows"* ]]; then
                if command -v strip >/dev/null 2>&1; then
                    strip "$binary_dest"
                    local new_size=$(stat -f%z "$binary_dest" 2>/dev/null || stat -c%s "$binary_dest" 2>/dev/null || echo "unknown")
                    print_info "Stripped size: $new_size bytes"
                fi
            fi
            
            # Compress with UPX if requested
            if [ "$USE_UPX" = true ]; then
                if command -v upx >/dev/null 2>&1; then
                    upx --best --lzma "$binary_dest" 2>/dev/null || true
                    local upx_size=$(stat -f%z "$binary_dest" 2>/dev/null || stat -c%s "$binary_dest" 2>/dev/null || echo "unknown")
                    print_info "UPX compressed size: $upx_size bytes"
                fi
            fi
            
        else
            print_error "Binary not found at $binary_source"
            cd ..
            return 1
        fi
    else
        print_error "✗ Build failed for $platform_name"
        cd ..
        return 1
    fi
    
    cd ..
}

# Create distribution packages
create_packages() {
    print_step "Creating distribution packages..."
    
    cd $DIST_DIR
    
    for target in "${!TARGETS[@]}"; do
        local platform_name=${TARGETS[$target]}
        local binary_name="workflow-$platform_name"
        if [[ $target == *"windows"* ]]; then
            binary_name+=".exe"
        fi
        
        if [ -f "$binary_name" ]; then
            # Create package directory
            local package_name="warp-workflow-cli-v$VERSION-$platform_name"
            mkdir -p "../$PACKAGE_DIR/$package_name"
            
            # Copy files
            cp "$binary_name" "../$PACKAGE_DIR/$package_name/"
            cp "../README.md" "../$PACKAGE_DIR/$package_name/" 2>/dev/null || true
            cp "../LICENSE" "../$PACKAGE_DIR/$package_name/" 2>/dev/null || true
            
            # Create package info
            cat > "../$PACKAGE_DIR/$package_name/PACKAGE_INFO.txt" << EOF
Warp Workflow CLI v$VERSION
Platform: $platform_name
Target: $target
Built: $(date)
Binary: $binary_name
EOF
            
            # Create archive
            cd "../$PACKAGE_DIR"
            if [[ $target == *"windows"* ]]; then
                zip -r "$package_name.zip" "$package_name/"
                print_info "✓ Created $package_name.zip"
            else
                tar -czf "$package_name.tar.gz" "$package_name/"
                print_info "✓ Created $package_name.tar.gz"
            fi
            cd "../$DIST_DIR"
        fi
    done
    
    cd ..
}

# Generate checksums
generate_checksums() {
    print_step "Generating checksums..."
    
    cd $PACKAGE_DIR
    
    # Create checksums file
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum *.zip *.tar.gz > checksums.sha256 2>/dev/null || true
    elif command -v shasum >/dev/null 2>&1; then
        shasum -a 256 *.zip *.tar.gz > checksums.sha256 2>/dev/null || true
    fi
    
    cd ..
}

# Main build function
main_build() {
    local selected_targets=()
    
    if [ ${#BUILD_TARGETS[@]} -eq 0 ]; then
        # Build all targets if none specified
        for target in "${!TARGETS[@]}"; do
            selected_targets+=("$target")
        done
    else
        # Resolve platform names to targets
        for platform in "${BUILD_TARGETS[@]}"; do
            local found=false
            for target in "${!TARGETS[@]}"; do
                if [[ "${TARGETS[$target]}" == "$platform" ]] || [[ "$target" == "$platform" ]]; then
                    selected_targets+=("$target")
                    found=true
                    break
                fi
            done
            if [ "$found" = false ]; then
                print_error "Unknown target: $platform"
                exit 1
            fi
        done
    fi
    
    print_info "Building for targets: ${selected_targets[*]}"
    print_info "Version: $VERSION"
    echo ""
    
    local failed_targets=()
    local start_time=$(date +%s)
    
    for target in "${selected_targets[@]}"; do
        if ! build_target "$target"; then
            failed_targets+=("$target")
        fi
    done
    
    local end_time=$(date +%s)
    local total_time=$((end_time - start_time))
    
    # Create packages if requested
    if [ "$CREATE_PACKAGES" = true ]; then
        create_packages
        generate_checksums
    fi
    
    # Summary
    echo ""
    print_success "Build Summary:"
    echo "  Total time: ${total_time}s"
    echo "  Successful: $((${#selected_targets[@]} - ${#failed_targets[@]}))/${#selected_targets[@]} targets"
    
    if [ ${#failed_targets[@]} -gt 0 ]; then
        print_warn "Failed targets:"
        for target in "${failed_targets[@]}"; do
            echo "    - $target"
        done
    fi
    
    echo "  Artifacts: $DIST_DIR/"
    if [ "$CREATE_PACKAGES" = true ]; then
        echo "  Packages: $PACKAGE_DIR/"
    fi
}

# Parse command line arguments
BUILD_TARGETS=()
OPTIMIZE=false
CREATE_PACKAGES=false
CLEAN=false
VERBOSE=false
STRIP_BINARY=false
USE_UPX=false
JOBS=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--targets)
            IFS=',' read -ra BUILD_TARGETS <<< "$2"
            shift 2
            ;;
        -o|--optimize)
            OPTIMIZE=true
            shift
            ;;
        -p|--package)
            CREATE_PACKAGES=true
            shift
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -j|--jobs)
            JOBS="$2"
            shift 2
            ;;
        --strip)
            STRIP_BINARY=true
            shift
            ;;
        --upx)
            USE_UPX=true
            shift
            ;;
        --install-deps)
            install_dependencies
            exit 0
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
print_header

# Clean if requested
if [ "$CLEAN" = true ]; then
    clean_build
fi

# Setup environment
setup_environment

# Run main build
main_build

print_success "Cross-platform build completed successfully!"
