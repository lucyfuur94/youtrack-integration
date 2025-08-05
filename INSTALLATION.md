# YouTrack MCP Server - Installation Guide

Multiple installation options to suit different needs and preferences.

## 🚀 **Quick Start Options**

### **Option 1: npx (Zero Installation - Recommended)**

Run directly without installing anything locally:

```bash
# Run directly from npm registry
npx youtrack-mcp

# Test the installation
npx youtrack-mcp --help

# With your YouTrack configuration
YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud \
YOUTRACK_TOKEN=your-permanent-token \
npx youtrack-mcp
```

**Benefits:**
- ✅ **0MB local disk usage**
- ✅ Always runs latest version
- ✅ No maintenance required
- ✅ Perfect for CI/CD environments

### **Option 2: Global Installation (Install Once, Use Everywhere)**

Install globally and use as a system command:

```bash
# Install globally from npm
npm install -g youtrack-mcp

# Test the installation
youtrack-mcp --help

# Run with your configuration
YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud \
YOUTRACK_TOKEN=your-permanent-token \
youtrack-mcp
```

**Benefits:**
- ✅ **~2MB total disk usage**
- ✅ Fast startup (no download)
- ✅ Works offline after installation
- ✅ System-wide availability

## 🔧 **Claude Desktop Configuration**

### **For npx (Recommended)**
```json
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
```

### **For Global Installation**
```json
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
```

## 🎯 **One-Line Setup**

### **macOS/Linux**
```bash
# Install globally and configure Claude Desktop
npm install -g youtrack-mcp && \
echo '{
  "mcpServers": {
    "youtrack": {
      "command": "youtrack-mcp",
      "env": {
        "YOUTRACK_BASE_URL": "https://your-instance.youtrack.cloud",
        "YOUTRACK_TOKEN": "your-permanent-token-here"
      }
    }
  }
}' > ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### **Windows**
```powershell
# Install globally
npm install -g youtrack-mcp

# Then manually configure Claude Desktop at:
# %APPDATA%/Claude/claude_desktop_config.json
```

## 🏢 **Enterprise & Team Setups**

### **Docker Container**
```bash
# Build and run in container
docker build -t youtrack-mcp .
docker run -d --name youtrack-mcp \
  -e YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud \
  -e YOUTRACK_TOKEN=your-token \
  youtrack-mcp
```

### **Package Management with pnpm**
```bash
# For teams preferring pnpm
npm install -g pnpm
git clone https://github.com/youtrack-mcp/youtrack-mcp.git
cd youtrack-mcp
pnpm install  # 70% smaller than npm
pnpm run build
```

## 🔍 **Verification & Testing**

### **Test Your Installation**
```bash
# For npx
npx youtrack-mcp --help

# For global install
youtrack-mcp --help

# Test connection
youtrack-mcp --base-url https://your-instance.youtrack.cloud --token your-token
```

### **Debug Connection Issues**
```bash
# Enable debug mode
youtrack-mcp --debug --base-url https://your-instance.youtrack.cloud --token your-token

# Or with environment variables
DEBUG=* YOUTRACK_DEBUG=true npx youtrack-mcp
```

## 📊 **Installation Comparison**

| Method | Local Disk | Network | Startup Speed | Offline | Maintenance |
|--------|------------|---------|---------------|---------|-------------|
| **npx** | 0MB | Required first run | Medium | No | None |
| **Global** | ~2MB | None after install | Fast | Yes | Version updates |
| **Docker** | ~50MB | Build time only | Medium | Yes | Image updates |
| **Local Dev** | ~150MB | Clone + install | Fast | Yes | Full maintenance |

## 🚨 **Troubleshooting**

### **Common Issues**

**"Command not found":**
```bash
# Check Node.js version (18+ required)
node --version

# Check npm/npx availability
npx --version
```

**"Permission denied":**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Or use npx instead of global install
npx youtrack-mcp
```

**"Connection refused":**
```bash
# Verify YouTrack URL
curl https://your-instance.youtrack.cloud/api/users/me \
  -H "Authorization: Bearer your-token"

# Test with debug mode
youtrack-mcp --debug --base-url https://your-instance.youtrack.cloud --token your-token
```

### **Network/Proxy Issues**
```bash
# Configure npm proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Or set environment variables
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

## 🎯 **Best Practices**

### **For Individual Users**
- ✅ Use **npx** for occasional use
- ✅ Use **global install** for frequent use
- ✅ Store credentials in environment variables
- ✅ Test with `--help` before configuring Claude

### **For Teams/Organizations**
- ✅ Use **Docker** for consistent environments
- ✅ Use **global install** on shared development machines
- ✅ Document configuration in team wiki
- ✅ Use environment-specific configurations

### **For CI/CD**
- ✅ Use **npx** for build pipelines
- ✅ Cache npm registry for faster builds
- ✅ Use specific version pins: `npx @youtrack-mcp/youtrack-mcp@1.0.0`

## 📝 **Configuration Templates**

### **Development Environment**
```bash
# .env file
YOUTRACK_BASE_URL=https://dev-youtrack.company.com
YOUTRACK_TOKEN=dev-token-here
YOUTRACK_DEBUG=true
```

### **Production Environment**
```bash
# .env file
YOUTRACK_BASE_URL=https://youtrack.company.com
YOUTRACK_TOKEN=prod-token-here
YOUTRACK_DEBUG=false
YOUTRACK_REQUEST_TIMEOUT=60000
```

## 🔗 **Next Steps**

After installation:
1. 📖 Read the [Usage Guide](README.md#usage-examples)
2. 🔧 Configure your [IDE Integration](README.md#claude-desktop-integration)
3. 🎯 Explore [Available Tools](README.md#available-tools)
4. 💬 Join the [Community Discussions](https://github.com/youtrack-mcp/youtrack-mcp/discussions)

---

**Choose the installation method that best fits your workflow and environment!** 