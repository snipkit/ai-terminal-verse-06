
# Warp Terminal Repository Structure

This document provides a detailed overview of the Warp terminal project repository structure, explaining the purpose and contents of each directory.

## 📁 Root Directory Structure

```
warp/
├── .github/                    # GitHub-specific configurations
├── .trunk/                     # Code quality and build configurations
├── .warp/                      # User-specific configurations
├── commands.dev/               # Commands.dev website implementation
├── keysets/                    # Keyboard shortcut configurations
├── scripts/                    # Utility and build scripts
├── src/                        # Main application source code
├── static/                     # Static assets and resources
├── themes/                     # Terminal themes and color schemes
├── workflows/                  # Command workflows and automation
├── package.json                # Node.js dependencies
├── Cargo.toml                  # Rust workspace configuration
├── vite.config.ts              # Frontend build configuration
└── README.md                   # Project documentation
```

## 📂 Directory Details

### `.github/` - GitHub Integration
GitHub-specific configuration files for project management and automation.

**Contents:**
- `workflows/` - CI/CD pipeline definitions
  - `ci.yaml` - Continuous integration workflow
  - `publish.yaml` - Release and publishing automation
- `ISSUE_TEMPLATE/` - Issue templates for bug reports and feature requests
- `PULL_REQUEST_TEMPLATE.md` - Pull request guidelines

**Purpose:** Automates testing, building, and releasing while standardizing community contributions.

### `.trunk/` - Code Quality & Build Configuration
Development tooling configuration for code quality enforcement.

**Contents:**
- `trunk.yaml` - Main trunk configuration
- Code formatting rules
- Linting configurations
- Build optimization settings

**Purpose:** Ensures consistent code style, quality, and build processes across the development team.

### `.warp/` - User Personalization
User-specific configurations and local customizations.

**Contents:**
- `workflows/` - Personal workflow definitions
- Local configuration overrides
- User-specific keybindings
- Custom theme modifications

**Purpose:** Allows users to personalize their Warp experience without affecting global settings.

### `commands.dev/` - Website Implementation
Source code for the Commands.dev website that showcases Warp workflows.

**Contents:**
- `components/` - React components for the website
- `pages/` - Next.js page components
- `lib/` - Utility functions and data processing
- `public/` - Static assets (images, icons, etc.)
- `styles/` - CSS and styling files

**Purpose:** Provides a web interface for browsing and searching Warp workflows.

### `keysets/` - Keyboard Configurations
Keyboard shortcut and keybinding definitions for different user preferences.

**Contents:**
- `default-warp-keybindings.yaml` - Default key mappings
- `emacs.yaml` - Emacs-style keybindings
- `trunk.yaml` - Trunk-specific shortcuts
- `config/` - Configuration templates and examples

**Purpose:** Enables users to customize keyboard shortcuts to match their preferred editing style.

### `scripts/` - Utility Scripts
Development and maintenance scripts for various project tasks.

**Contents:**
- Build automation scripts
- Theme generation utilities
- Validation and testing tools
- Cross-platform compilation helpers

**Purpose:** Automates repetitive development tasks and maintains project consistency.

### `src/` - Main Application Source
Core React/TypeScript application source code.

**Contents:**
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and helpers
- `pages/` - Application pages and routes
- `types/` - TypeScript type definitions

**Purpose:** Contains the main application logic and user interface components.

### `static/` - Static Resources
Static assets and resources used by the application.

**Contents:**
- `css/` - Stylesheets and CSS files
- `js/` - JavaScript utilities and libraries
- Images, icons, and other static assets

**Purpose:** Houses static files that don't require processing during the build.

### `themes/` - Visual Customization
Comprehensive theming system with multiple theme collections.

**Contents:**
- `base16/` - Base16 color scheme implementations (200+ themes)
- `standard/` - Popular themes from other terminals
- `warp_bundled/` - Official Warp themes with backgrounds
- `special_edition/` - Holiday and event-specific themes
- `scripts/` - Theme preview generation tools
- `types.ts` - TypeScript definitions for themes

**Key Features:**
- **Background Support:** Many themes include custom background images
- **Preview Generation:** Automated SVG preview creation
- **Color Schemes:** Support for dark, light, and high-contrast themes
- **Community Contributions:** Easy theme submission process

### `workflows/` - Command Automation
The core productivity feature of Warp - workflow definitions and management tools.

**Structure:**
```
workflows/
├── specs/                      # YAML workflow definitions
│   ├── git/                    # Git-related workflows
│   ├── docker/                 # Docker command workflows
│   ├── kubernetes/             # K8s management workflows
│   ├── android/                # Android development tools
│   └── [category]/             # Other workflow categories
├── workflow-cli/               # Rust CLI tool for workflow management
├── workflow-processor/         # TypeScript generation tools
├── scripts/                    # Build and validation scripts
└── Makefile                    # Build automation
```

**Categories Include:**
- **Git Operations:** Branch management, merging, rebasing
- **Container Management:** Docker and Kubernetes commands
- **Package Managers:** npm, yarn, pip, brew, etc.
- **Cloud Platforms:** AWS, GCP, Azure CLI commands
- **Development Tools:** Testing, building, deployment
- **System Administration:** File manipulation, system monitoring

**Workflow Features:**
- **Parameterization:** Dynamic command generation with user inputs
- **Validation:** Syntax checking and testing
- **Search & Discovery:** Searchable command database
- **Cross-Platform:** Support for bash, zsh, fish shells

## 🛠️ Build System

The project uses a multi-language build system:

- **Rust:** For the workflow CLI tool and performance-critical components
- **TypeScript/Node.js:** For the web interface and workflow processing
- **Python:** For theme preview generation
- **Make:** For build automation and task coordination

## 🎯 Development Workflow

1. **Themes:** Add YAML theme files and run preview generation
2. **Workflows:** Create YAML workflow definitions and validate
3. **Keybindings:** Modify YAML keyset files for custom shortcuts
4. **Components:** Add React components to src/components/
5. **Testing:** Use the built-in validation and testing tools

## 📚 Documentation

Each directory contains specific README files with detailed information about:
- File formats and specifications
- Contribution guidelines
- Usage examples
- Development setup instructions

This structure enables a highly customizable, community-driven terminal experience while maintaining code quality and ease of contribution.
