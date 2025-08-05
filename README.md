# YouTrack MCP Server

A comprehensive Model Context Protocol (MCP) server for YouTrack integration, providing extensive tools for issue tracking, project management, workflow automation, and team collaboration.

## Features

### 🎯 Issue Management
- **CRUD Operations**: Create, read, update, and delete issues
- **Advanced Search**: Search issues with complex filters and queries
- **Bulk Operations**: Update multiple issues at once
- **Issue Linking**: Manage relationships between issues
- **Comments & Attachments**: Full support for issue discussions and file attachments
- **Work Items**: Track time and work logs

### 📊 Project Management
- **Project Operations**: List, create, and manage projects
- **Custom Fields**: Define and manage custom field schemas
- **Versions & Milestones**: Track releases and project milestones
- **Components**: Organize issues by components/modules

### 👥 User & Team Management
- **User Operations**: List users, groups, and permissions
- **Team Collaboration**: Manage team assignments and roles
- **Notifications**: Handle user notifications and subscriptions

### 🔄 Workflow & Automation
- **Workflow States**: Manage issue states and transitions
- **Custom Workflows**: Define and execute custom workflows
- **Automation Rules**: Set up automated actions and triggers

### 📈 Analytics & Reporting
- **Reports**: Generate various project and issue reports
- **Statistics**: Get project statistics and metrics
- **Time Tracking**: Comprehensive time tracking and reporting

### 🏃‍♂️ Agile Features
- **Agile Boards**: Manage Kanban and Scrum boards
- **Sprints**: Create and manage sprint cycles
- **Burndown Charts**: Track progress with visual charts

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- YouTrack instance (Cloud or On-Premise)  
- YouTrack API token or credentials

### 🚀 **Lightweight Installation Options** (Avoid Heavy node_modules)

#### Option 1: **npx** (Zero Installation - Recommended)
```bash
# Run directly without installing anything locally
npx youtrack-mcp

# Test the installation
npx youtrack-mcp --help

# With environment variables
YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud \
YOUTRACK_TOKEN=your-token \
npx youtrack-mcp
```

#### Option 2: **Global Installation** (Install Once, Use Everywhere)
```bash
# Install globally from npm (only ~2MB)
npm install -g youtrack-mcp

# Test the installation
youtrack-mcp --help

# Run with environment variables
YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud \
YOUTRACK_TOKEN=your-token \
youtrack-mcp
```

#### Option 3: **Using pnpm** (70% less disk usage)
```bash
# Install pnpm globally (one time setup)
npm install -g pnpm

# Clone and install with pnpm
git clone https://github.com/youtrack-mcp/youtrack-mcp.git
cd youtrack-mcp
pnpm install
pnpm run build
```

#### Option 4: **Docker Container** (Zero local dependencies)
```bash
docker run -d --name youtrack-mcp \
  -e YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud \
  -e YOUTRACK_TOKEN=your-token \
  ghcr.io/youtrack-mcp/youtrack-mcp:latest
```

### Traditional Installation (Heavy node_modules)
```bash
git clone https://github.com/youtrack-mcp/youtrack-mcp.git
cd youtrack-mcp
npm install
npm run build
```

### Claude Desktop Integration

Add to your `claude_desktop_config.json`:
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

#### **Option 1: npx (Zero Installation - Recommended)**
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

#### **Option 2: Global Installation**
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

#### **Option 3: Local Development Build**
```json
{
  "mcpServers": {
    "youtrack": {
      "command": "node",
      "args": ["/path/to/youtrack-mcp/build/index.js"],
      "env": {
        "YOUTRACK_BASE_URL": "https://your-instance.youtrack.cloud",
        "YOUTRACK_TOKEN": "your-permanent-token"
      }
    }
  }
}
```

#### **Option 4: Docker Container**
```json
{
  "mcpServers": {
    "youtrack": {
      "command": "docker",
      "args": ["exec", "youtrack-mcp", "node", "build/index.js"],
      "env": {}
    }
  }
}
```

## Configuration

### Authentication Methods

#### Permanent Token (Recommended)
```env
YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud
YOUTRACK_TOKEN=your-permanent-token
```

To create a permanent token:
1. Go to YouTrack → Profile → Account Security → Tokens
2. Click "New Token"
3. Set appropriate permissions and scope
4. Copy the generated token

#### Username/Password (Not Recommended)
```env
YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud
YOUTRACK_USERNAME=your-username
YOUTRACK_PASSWORD=your-password
```

### Advanced Configuration

```env
# Performance
YOUTRACK_REQUEST_TIMEOUT=30000
YOUTRACK_MAX_RETRIES=3
YOUTRACK_DEFAULT_PAGE_SIZE=50
YOUTRACK_MAX_PAGE_SIZE=100

# Caching
YOUTRACK_ENABLE_CACHE=true
YOUTRACK_CACHE_TTL=300

# Debugging
YOUTRACK_DEBUG=true
```

## Available Tools

### Issue Management

| Tool | Description |
|------|-------------|
| `youtrack_list_issues` | List issues with filtering and pagination |
| `youtrack_get_issue` | Get detailed issue information |
| `youtrack_create_issue` | Create a new issue |
| `youtrack_update_issue` | Update existing issue |
| `youtrack_delete_issue` | Delete an issue |
| `youtrack_search_issues` | Advanced issue search with query syntax |
| `youtrack_add_comment` | Add comment to an issue |
| `youtrack_get_comments` | Get all comments for an issue |
| `youtrack_update_comment` | Update existing comment |
| `youtrack_delete_comment` | Delete a comment |
| `youtrack_add_attachment` | Add file attachment to issue |
| `youtrack_get_attachments` | Get all attachments for an issue |
| `youtrack_link_issues` | Create links between issues |
| `youtrack_get_issue_links` | Get all links for an issue |

### Project Management

| Tool | Description |
|------|-------------|
| `youtrack_list_projects` | List all accessible projects |
| `youtrack_get_project` | Get detailed project information |
| `youtrack_create_project` | Create a new project |
| `youtrack_update_project` | Update project settings |
| `youtrack_delete_project` | Delete a project |
| `youtrack_get_project_custom_fields` | Get custom fields for project |
| `youtrack_add_project_custom_field` | Add custom field to project |
| `youtrack_list_project_versions` | List project versions/releases |
| `youtrack_create_project_version` | Create new version/release |

### User Management

| Tool | Description |
|------|-------------|
| `youtrack_list_users` | List all users |
| `youtrack_get_user` | Get user details |
| `youtrack_get_current_user` | Get current authenticated user |
| `youtrack_list_groups` | List user groups |
| `youtrack_get_group` | Get group details |
| `youtrack_list_roles` | List available roles |

### Workflow Management

| Tool | Description |
|------|-------------|
| `youtrack_get_workflow_states` | Get available workflow states |
| `youtrack_get_workflow_transitions` | Get possible state transitions |
| `youtrack_apply_workflow_command` | Apply workflow command to issue |
| `youtrack_get_issue_commands` | Get available commands for issue |

### Time Tracking

| Tool | Description |
|------|-------------|
| `youtrack_add_work_item` | Add time tracking entry |
| `youtrack_get_work_items` | Get work items for issue |
| `youtrack_update_work_item` | Update work item |
| `youtrack_delete_work_item` | Delete work item |
| `youtrack_get_time_tracking_report` | Generate time tracking report |

### Reports & Analytics

| Tool | Description |
|------|-------------|
| `youtrack_get_project_statistics` | Get project statistics |
| `youtrack_get_issue_statistics` | Get issue-related statistics |
| `youtrack_generate_report` | Generate custom reports |
| `youtrack_get_burndown_data` | Get burndown chart data |

### Agile & Boards

| Tool | Description |
|------|-------------|
| `youtrack_list_agile_boards` | List all agile boards |
| `youtrack_get_agile_board` | Get agile board details |
| `youtrack_create_agile_board` | Create new agile board |
| `youtrack_update_agile_board` | Update agile board |
| `youtrack_list_sprints` | List sprints for board |
| `youtrack_create_sprint` | Create new sprint |
| `youtrack_update_sprint` | Update sprint details |

## Usage Examples

### Creating an Issue
```
Create a new bug report with title "Login button not working" in project "WEB" with high priority
```

### Searching Issues
```
Find all open issues assigned to john.doe in the mobile project created in the last 30 days
```

### Project Management
```
List all projects and show their current status and team members
```

### Time Tracking
```
Add 2 hours of development work to issue WEB-123 with description "Implemented login validation"
```

### Workflow Management
```
Move issue WEB-123 to "In Progress" state and assign it to jane.smith
```

## Development

### Testing Installation
```bash
# Run comprehensive tests
./examples.sh

# Test specific components
./examples.sh npx        # Test npx installation
./examples.sh global     # Test global installation  
./examples.sh claude     # Generate Claude configs
./examples.sh docker     # Test Docker setup
```

### Building
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Watch Mode
```bash
npm run watch
```

### Testing
```bash
npm test
npm run test:npx      # Test npx functionality
npm run test:global   # Test global installation
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Debugging with MCP Inspector
```bash
npm run inspector
```

## API Documentation

This MCP server follows YouTrack's REST API structure. For detailed API reference, visit:
- [YouTrack REST API Documentation](https://www.jetbrains.com/help/youtrack/devportal/youtrack-rest-api.html)
- [YouTrack API Reference](https://www.jetbrains.com/help/youtrack/devportal/rest-api-reference.html)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/youtrack-mcp/youtrack-mcp/issues)
- **Documentation**: [API Documentation](https://www.jetbrains.com/help/youtrack/devportal/)
- **Community**: [Discussions](https://github.com/youtrack-mcp/youtrack-mcp/discussions)

## Acknowledgments

- [JetBrains YouTrack](https://www.jetbrains.com/youtrack/) for the excellent issue tracking platform
- [Model Context Protocol](https://modelcontextprotocol.io/) for the standardized integration framework
- [Anthropic Claude](https://claude.ai/) for AI assistant integration 