#!/bin/bash

# YouTrack MCP Server - Examples and Testing Script

set -e

echo "🚀 YouTrack MCP Server Examples and Tests"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}➤${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Test npx installation
test_npx() {
    print_step "Testing npx installation..."
    
    echo "Running: npx youtrack-mcp --help"
    if npx youtrack-mcp --help; then
        print_success "npx installation works!"
    else
        print_error "npx test failed"
        return 1
    fi
}

# Test global installation
test_global() {
    print_step "Testing global installation..."
    
    print_step "Installing globally..."
    if npm install -g youtrack-mcp; then
        print_success "Global installation successful"
    else
        print_error "Global installation failed"
        return 1
    fi
    
    print_step "Testing global command..."
    if youtrack-mcp --help; then
        print_success "Global command works!"
    else
        print_error "Global command test failed"
        return 1
    fi
}

# Test with mock configuration
test_configuration() {
    print_step "Testing configuration options..."
    
    echo "Testing with --help flag:"
    npx youtrack-mcp --help
    
    echo ""
    echo "Testing with --version flag:"
    npx youtrack-mcp --version
    
    echo ""
    print_warning "Note: Actual connection tests require valid YouTrack credentials"
    echo "Example connection test:"
    echo "YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud \\"
    echo "YOUTRACK_TOKEN=your-token \\"
    echo "npx youtrack-mcp"
    
    print_success "Configuration tests completed"
}

# Generate Claude Desktop configuration
generate_claude_config() {
    print_step "Generating Claude Desktop configuration examples..."
    
    # Create config directory if it doesn't exist
    CONFIG_DIR="./claude-configs"
    mkdir -p "$CONFIG_DIR"
    
    # npx configuration
    cat > "$CONFIG_DIR/claude-desktop-npx.json" << 'EOF'
{
  "mcpServers": {
    "youtrack": {
      "command": "npx",
             "args": ["youtrack-mcp"],
      "env": {
        "YOUTRACK_BASE_URL": "https://your-instance.youtrack.cloud",
        "YOUTRACK_TOKEN": "your-permanent-token"
      }
    }
  }
}
EOF

    # Global installation configuration
    cat > "$CONFIG_DIR/claude-desktop-global.json" << 'EOF'
{
  "mcpServers": {
    "youtrack": {
      "command": "youtrack-mcp",
      "env": {
        "YOUTRACK_BASE_URL": "https://your-instance.youtrack.cloud",
        "YOUTRACK_TOKEN": "your-permanent-token"
      }
    }
  }
}
EOF

    # Development configuration
    cat > "$CONFIG_DIR/claude-desktop-dev.json" << 'EOF'
{
  "mcpServers": {
    "youtrack": {
      "command": "node",
      "args": ["/absolute/path/to/youtrack-mcp/build/index.js"],
      "env": {
        "YOUTRACK_BASE_URL": "https://your-instance.youtrack.cloud",
        "YOUTRACK_TOKEN": "your-permanent-token",
        "YOUTRACK_DEBUG": "true"
      }
    }
  }
}
EOF

    print_success "Configuration examples created in ./claude-configs/"
    echo "  📁 claude-desktop-npx.json - For npx usage"
    echo "  📁 claude-desktop-global.json - For global installation"
    echo "  📁 claude-desktop-dev.json - For development setup"
}

# Test Docker setup
test_docker() {
    print_step "Testing Docker setup..."
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker not installed, skipping Docker tests"
        return 0
    fi
    
    print_step "Building Docker image..."
    if docker build -t youtrack-mcp-test .; then
        print_success "Docker image built successfully"
    else
        print_error "Docker build failed"
        return 1
    fi
    
    print_step "Testing Docker container..."
    if docker run --rm youtrack-mcp-test --help; then
        print_success "Docker container works!"
    else
        print_error "Docker container test failed"
        return 1
    fi
    
    # Cleanup
    docker rmi youtrack-mcp-test
}

# Example usage scenarios
show_examples() {
    print_step "Usage Examples"
    echo ""
    echo "🔧 Installation Options:"
      echo "  npx youtrack-mcp                    # Zero installation"
  echo "  npm install -g youtrack-mcp         # Global install"
    echo ""
    echo "🚀 Running the Server:"
    echo "  # With environment variables"
    echo "  YOUTRACK_BASE_URL=https://instance.youtrack.cloud \\"
    echo "  YOUTRACK_TOKEN=your-token \\"
    echo "  youtrack-mcp"
    echo ""
    echo "  # With CLI arguments"
    echo "  youtrack-mcp --base-url https://instance.youtrack.cloud --token your-token"
    echo ""
    echo "🔍 Testing & Debugging:"
    echo "  youtrack-mcp --help                               # Show help"
    echo "  youtrack-mcp --version                            # Show version"
    echo "  youtrack-mcp --debug                              # Enable debug mode"
    echo ""
    echo "🎯 Claude Desktop Integration:"
    echo "  Copy configuration from ./claude-configs/ to:"
    echo "  macOS: ~/Library/Application Support/Claude/claude_desktop_config.json"
    echo "  Windows: %APPDATA%/Claude/claude_desktop_config.json"
    echo ""
}

# Main execution
main() {
    case "${1:-all}" in
        "prerequisites")
            check_prerequisites
            ;;
        "npx")
            check_prerequisites
            test_npx
            ;;
        "global")
            check_prerequisites
            test_global
            ;;
        "config")
            test_configuration
            ;;
        "claude")
            generate_claude_config
            ;;
        "docker")
            test_docker
            ;;
        "examples")
            show_examples
            ;;
        "all")
            check_prerequisites
            test_npx
            test_configuration
            generate_claude_config
            show_examples
            print_success "All tests completed!"
            ;;
        *)
            echo "Usage: $0 [prerequisites|npx|global|config|claude|docker|examples|all]"
            echo ""
            echo "Commands:"
            echo "  prerequisites  - Check if Node.js and npm are installed"
            echo "  npx           - Test npx installation"
            echo "  global        - Test global installation"
            echo "  config        - Test configuration options"
            echo "  claude        - Generate Claude Desktop configurations"
            echo "  docker        - Test Docker setup"
            echo "  examples      - Show usage examples"
            echo "  all           - Run all tests (default)"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 