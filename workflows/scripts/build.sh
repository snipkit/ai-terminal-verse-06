#!/bin/bash

set -e

# Change to workspace root
cd "$(dirname "$0")/../.."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="workflow-cli"
BUILD_DIR="target"
DIST_DIR="dist"

# Print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Clean previous builds
clean_build() {
    print_info "Cleaning previous build artifacts..."
    rm -rf $BUILD_DIR
    rm -rf $DIST_DIR
    mkdir -p $DIST_DIR
}

# Build optimized release binary
build_release() {
    print_info "Building optimized release binary..."
    cd workflows/workflow-cli
    cargo build --release --locked
    cd ../..
    
    # Copy binary to dist directory
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        cp workflows/workflow-cli/target/release/workflow.exe $DIST_DIR/
    else
        cp workflows/workflow-cli/target/release/workflow $DIST_DIR/
    fi
    
    print_info "Binary built successfully!"
}

# Build fast release (less optimization, faster compile)
build_fast() {
    print_info "Building fast release binary..."
    cd workflows/workflow-cli
    cargo build --profile release-fast --locked
    cd ../..
    
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        cp workflows/workflow-cli/target/release-fast/workflow.exe $DIST_DIR/workflow-fast.exe
    else
        cp workflows/workflow-cli/target/release-fast/workflow $DIST_DIR/workflow-fast
    fi
    
    print_info "Fast binary built successfully!"
}

# Main execution
main() {
    case "${1:-release}" in
        "clean")
            clean_build
            ;;
        "fast")
            clean_build
            build_fast
            ;;
        "release")
            clean_build
            build_release
            ;;
        "both")
            clean_build
            build_fast
            build_release
            ;;
        *)
            print_error "Usage: $0 [clean|fast|release|both]"
            exit 1
            ;;
    esac
    
    print_info "Build completed! Binaries available in $DIST_DIR/"
}

main "$@"
