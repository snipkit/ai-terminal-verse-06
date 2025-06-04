
#!/bin/bash

set -e

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
PROFILE="release"
TARGET=""
FEATURES=""
JOBS=""

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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${PURPLE}[SUCCESS]${NC} $1"
}

# Show help
show_help() {
    echo -e "${CYAN}Optimized Rust Build Script${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -p, --profile PROFILE    Build profile (release, release-fast, debug) [default: release]"
    echo "  -t, --target TARGET      Target triple for cross-compilation"
    echo "  -f, --features FEATURES  Comma-separated list of features to enable"
    echo "  -j, --jobs JOBS          Number of parallel jobs"
    echo "  -c, --clean              Clean before building"
    echo "  -s, --strip              Strip symbols from binary"
    echo "  -u, --upx                Compress binary with UPX"
    echo "  -v, --verbose            Verbose output"
    echo "  -h, --help               Show this help"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Default optimized release build"
    echo "  $0 --clean --strip --upx             # Clean build with maximum optimization"
    echo "  $0 --target x86_64-unknown-linux-gnu # Cross-compile for Linux"
    echo "  $0 --features serde,tokio --jobs 8   # Build with specific features and parallel jobs"
}

# Parse command line arguments
CLEAN=false
STRIP_BINARY=false
USE_UPX=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--profile)
            PROFILE="$2"
            shift 2
            ;;
        -t|--target)
            TARGET="$2"
            shift 2
            ;;
        -f|--features)
            FEATURES="$2"
            shift 2
            ;;
        -j|--jobs)
            JOBS="$2"
            shift 2
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -s|--strip)
            STRIP_BINARY=true
            shift
            ;;
        -u|--upx)
            USE_UPX=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
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

# Set environment variables for optimization
export CARGO_PROFILE_RELEASE_CODEGEN_UNITS=1
export CARGO_PROFILE_RELEASE_LTO=true
export CARGO_PROFILE_RELEASE_PANIC=abort
export CARGO_PROFILE_RELEASE_OPT_LEVEL=3

# Additional optimization flags
export RUSTFLAGS="-C target-cpu=native -C link-arg=-s"

# Set verbose flag
if [ "$VERBOSE" = true ]; then
    VERBOSE_FLAG="--verbose"
else
    VERBOSE_FLAG=""
fi

# Clean if requested
if [ "$CLEAN" = true ]; then
    print_step "Cleaning previous build artifacts..."
    rm -rf $BUILD_DIR
    rm -rf $DIST_DIR
    cd workflows/workflow-cli
    cargo clean $VERBOSE_FLAG
    cd ../..
fi

# Create dist directory
mkdir -p $DIST_DIR

# Check if target is available for cross-compilation
if [ -n "$TARGET" ]; then
    print_step "Checking if target $TARGET is installed..."
    if ! rustup target list --installed | grep -q "$TARGET"; then
        print_warn "Target $TARGET not installed. Installing..."
        rustup target add $TARGET
    fi
fi

# Build command construction
print_step "Preparing build command..."
BUILD_CMD="cargo build --profile $PROFILE --locked"

if [ -n "$TARGET" ]; then
    BUILD_CMD="$BUILD_CMD --target $TARGET"
    BINARY_PATH="workflows/workflow-cli/target/$TARGET/$PROFILE"
else
    BINARY_PATH="workflows/workflow-cli/target/$PROFILE"
fi

if [ -n "$FEATURES" ]; then
    BUILD_CMD="$BUILD_CMD --features $FEATURES"
fi

if [ -n "$JOBS" ]; then
    BUILD_CMD="$BUILD_CMD --jobs $JOBS"
fi

if [ "$VERBOSE" = true ]; then
    BUILD_CMD="$BUILD_CMD --verbose"
fi

# Display build information
print_info "Build Configuration:"
echo "  Profile: $PROFILE"
echo "  Target: ${TARGET:-native}"
echo "  Features: ${FEATURES:-default}"
echo "  Jobs: ${JOBS:-auto}"
echo "  Clean: $CLEAN"
echo "  Strip: $STRIP_BINARY"
echo "  UPX: $USE_UPX"
echo ""

# Measure build time
print_step "Starting optimized build..."
START_TIME=$(date +%s)

cd workflows/workflow-cli

# Execute build
print_info "Executing: $BUILD_CMD"
if eval $BUILD_CMD; then
    END_TIME=$(date +%s)
    BUILD_TIME=$((END_TIME - START_TIME))
    print_success "Build completed in ${BUILD_TIME}s"
else
    print_error "Build failed!"
    exit 1
fi

# Determine binary name and extension
if [[ "$TARGET" == *"windows"* ]] || [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    BINARY_NAME="workflow.exe"
else
    BINARY_NAME="workflow"
fi

# Copy binary to dist
BINARY_SOURCE="$BINARY_PATH/$BINARY_NAME"
BINARY_DEST="../../$DIST_DIR/$BINARY_NAME"

if [ -f "$BINARY_SOURCE" ]; then
    cp "$BINARY_SOURCE" "$BINARY_DEST"
    print_success "Binary copied to $DIST_DIR/"
else
    print_error "Binary not found at $BINARY_SOURCE"
    exit 1
fi

cd ../..

# Get binary size before optimization
ORIGINAL_SIZE=$(stat -f%z "$DIST_DIR/$BINARY_NAME" 2>/dev/null || stat -c%s "$DIST_DIR/$BINARY_NAME" 2>/dev/null || echo "unknown")

# Strip binary if requested
if [ "$STRIP_BINARY" = true ]; then
    print_step "Stripping binary symbols..."
    if command -v strip >/dev/null 2>&1; then
        strip "$DIST_DIR/$BINARY_NAME"
        print_success "Binary stripped"
    else
        print_warn "strip command not found, skipping symbol stripping"
    fi
fi

# Compress with UPX if requested
if [ "$USE_UPX" = true ]; then
    print_step "Compressing binary with UPX..."
    if command -v upx >/dev/null 2>&1; then
        upx --best --lzma "$DIST_DIR/$BINARY_NAME"
        print_success "Binary compressed with UPX"
    else
        print_warn "UPX not found, skipping compression"
        print_info "Install UPX with: brew install upx (macOS) or apt-get install upx (Ubuntu)"
    fi
fi

# Get final binary size
FINAL_SIZE=$(stat -f%z "$DIST_DIR/$BINARY_NAME" 2>/dev/null || stat -c%s "$DIST_DIR/$BINARY_NAME" 2>/dev/null || echo "unknown")

# Display build summary
print_success "Build Summary:"
echo "  Binary: $DIST_DIR/$BINARY_NAME"
echo "  Original size: $ORIGINAL_SIZE bytes"
echo "  Final size: $FINAL_SIZE bytes"
if [ "$ORIGINAL_SIZE" != "unknown" ] && [ "$FINAL_SIZE" != "unknown" ]; then
    REDUCTION=$((ORIGINAL_SIZE - FINAL_SIZE))
    PERCENTAGE=$((REDUCTION * 100 / ORIGINAL_SIZE))
    echo "  Size reduction: $REDUCTION bytes ($PERCENTAGE%)"
fi
echo "  Build time: ${BUILD_TIME}s"

# Verify binary works
print_step "Verifying binary..."
if "./$DIST_DIR/$BINARY_NAME" --version >/dev/null 2>&1; then
    print_success "Binary verification passed"
else
    print_warn "Binary verification failed - binary may not be functional"
fi

print_success "Optimized build completed successfully!"
