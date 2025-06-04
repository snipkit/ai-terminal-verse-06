
#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

SPECS_DIR="workflows/specs"
DIST_DIR="./dist"
WORKFLOW_CLI_DIR="workflows/workflow-cli"

# Create dist directory
mkdir -p "$DIST_DIR/workflows"
mkdir -p "$DIST_DIR/exports"

print_step "Building workflow CLI binary..."
cd "$WORKFLOW_CLI_DIR"
cargo build --release
cd ../..

# Copy binary to dist
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    cp "$WORKFLOW_CLI_DIR/target/release/workflow.exe" "$DIST_DIR/"
    BINARY_NAME="workflow.exe"
else
    cp "$WORKFLOW_CLI_DIR/target/release/workflow" "$DIST_DIR/"
    BINARY_NAME="workflow"
fi

print_info "Binary copied to $DIST_DIR/$BINARY_NAME"

print_step "Validating workflows..."
"./$DIST_DIR/$BINARY_NAME" validate --dir "$SPECS_DIR"

print_step "Exporting workflows..."
workflow_count=0
error_count=0

# Export individual workflows
for yaml_file in $(find "$SPECS_DIR" -name "*.yaml" -o -name "*.yml"); do
    filename=$(basename "$yaml_file")
    
    print_info "Processing: $filename"
    
    # Copy to exports directory
    cp "$yaml_file" "$DIST_DIR/exports/"
    
    # Validate YAML syntax
    if command -v yamllint >/dev/null 2>&1; then
        if yamllint "$yaml_file" >/dev/null 2>&1; then
            print_info "✓ $filename - Valid YAML"
        else
            print_warn "⚠ $filename - YAML syntax warnings"
        fi
    fi
    
    ((workflow_count++))
done

# Generate workflow collection JSON
print_step "Generating workflow collection..."
cd workflows/workflow-processor
cargo run --release
cd ../..

if [ -f "workflows/workflow-processor/generated/workflows.ts" ]; then
    cp "workflows/workflow-processor/generated/workflows.ts" "$DIST_DIR/"
    print_info "✓ Generated TypeScript definitions"
fi

if [ -f "workflows/workflow-processor/generated/search-index.json" ]; then
    cp "workflows/workflow-processor/generated/search-index.json" "$DIST_DIR/"
    print_info "✓ Generated search index"
fi

print_step "Export Summary:"
echo "  Workflows processed: $workflow_count"
echo "  Binary: $DIST_DIR/$BINARY_NAME"
echo "  Exports: $DIST_DIR/exports/"
echo "  Generated files: $DIST_DIR/"

print_info "All workflows validated and exported successfully!"
