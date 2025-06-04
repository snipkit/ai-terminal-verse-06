#!/bin/bash

set -e

# Change to workspace root
cd "$(dirname "$0")/../.."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Target platforms
TARGETS=(
    "x86_64-unknown-linux-gnu"      # Linux x64
    "x86_64-pc-windows-gnu"         # Windows x64
    "x86_64-apple-darwin"           # macOS x64
    "aarch64-apple-darwin"          # macOS ARM64
    "aarch64-unknown-linux-gnu"     # Linux ARM64
)

PROJECT_DIR="workflows/workflow-cli"
DIST_DIR="dist/cross-platform"

# Install required targets
install_targets() {
    print_info "Installing cross-compilation targets..."
    for target in "${TARGETS[@]}"; do
        print_info "Installing target: $target"
        rustup target add $target
    done
}

# Clean and prepare
prepare_build() {
    print_info "Preparing cross-platform build..."
    rm -rf $DIST_DIR
    mkdir -p $DIST_DIR
}

# Build for a specific target
build_target() {
    local target=$1
    print_info "Building for target: $target"
    
    # Build the project for the target from the project directory
    cd $PROJECT_DIR
    
    if cargo build --release --target $target --locked; then
        # Build successful, change back to workspace root
        cd ../..
        
        # Determine binary extension
        local binary_name="workflow"
        if [[ $target == *"windows"* ]]; then
            binary_name="workflow.exe"
        fi
        
        # Define source and destination paths relative to workspace root
        local src_path="$PROJECT_DIR/target/$target/release/$binary_name"
        local target_dir="$DIST_DIR/$target"
        local dest_path="$target_dir/$binary_name"
        
        # Create target-specific directory
        mkdir -p "$target_dir"
        
        # Copy binary
        cp "$src_path" "$dest_path"
        
        # Create archive
        cd "$DIST_DIR"
        if [[ $target == *"windows"* ]]; then
            zip -r "workflow-$target.zip" "$target/"
        else
            tar -czf "workflow-$target.tar.gz" "$target/"
        fi
        
        # Change back to workspace root from DIST_DIR
        cd ../..
        
        print_info "✓ Successfully built for $target"
    else
        print_error "✗ Failed to build for $target"
        # Ensure we are back at the workspace root on failure
        cd ../..
        return 1
    fi
    
    # Ensure we are at the workspace root after the build and copy
    # This cd is redundant if build was successful, but defensive on failure path
    cd "$(dirname "$0")/../.."
}

# Build for all targets
build_all() {
    local failed_targets=()
    
    for target in "${TARGETS[@]}"; do
        if ! build_target $target; then
            failed_targets+=($target)
        fi
    done
    
    # Summary
    print_info "Cross-platform build summary:"
    echo "Successfully built: $((${#TARGETS[@]} - ${#failed_targets[@]}))/${#TARGETS[@]} targets"
    
    if [ ${#failed_targets[@]} -gt 0 ]; then
        print_warn "Failed targets:"
        for target in "${failed_targets[@]}"; do
            echo "  - $target"
        done
    fi
    
    print_info "Build artifacts available in: $DIST_DIR/"
}

# Main execution
main() {
    case "${1:-all}" in
        "install")
            install_targets
            ;;
        "prepare")
            prepare_build
            ;;
        "all")
            prepare_build
            build_all
            ;;
        *)
            if [[ " ${TARGETS[@]} " =~ " $1 " ]]; then
                prepare_build
                build_target $1
            else
                print_error "Usage: $0 [install|prepare|all|<target>]"
                print_info "Available targets:"
                for target in "${TARGETS[@]}"; do
                    echo "  - $target"
                done
                exit 1
            fi
            ;;
    esac
}

main "$@"
