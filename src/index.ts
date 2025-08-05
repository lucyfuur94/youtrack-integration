#!/usr/bin/env node

import dotenv from 'dotenv';
import { YouTrackMCPServer } from './server.js';
import { YouTrackApiConfig } from './types/index.js';

// Load environment variables
dotenv.config();

// CLI argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    help?: boolean;
    version?: boolean;
    debug?: boolean;
    baseUrl?: string;
    token?: string;
    username?: string;
    password?: string;
  } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--version':
      case '-v':
        options.version = true;
        break;
      case '--debug':
        options.debug = true;
        break;
      case '--base-url':
        options.baseUrl = args[++i];
        break;
      case '--token':
        options.token = args[++i];
        break;
      case '--username':
        options.username = args[++i];
        break;
      case '--password':
        options.password = args[++i];
        break;
      default:
        if (arg.startsWith('--')) {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        }
    }
  }

  return options;
}

function showHelp() {
  console.log(`
YouTrack MCP Server v1.0.0

A comprehensive Model Context Protocol (MCP) server for YouTrack integration.

USAGE:
  youtrack-mcp [OPTIONS]
  npx @youtrack-mcp/youtrack-mcp [OPTIONS]

OPTIONS:
  --help, -h              Show this help message
  --version, -v           Show version information
  --debug                 Enable debug logging
  --base-url <url>        YouTrack instance URL
  --token <token>         YouTrack permanent token
  --username <user>       YouTrack username (alternative to token)
  --password <pass>       YouTrack password (alternative to token)

ENVIRONMENT VARIABLES:
  YOUTRACK_BASE_URL       YouTrack instance URL (required)
  YOUTRACK_TOKEN          YouTrack permanent token
  YOUTRACK_USERNAME       YouTrack username (if not using token)
  YOUTRACK_PASSWORD       YouTrack password (if not using token)
  YOUTRACK_DEBUG          Enable debug logging (true/false)
  YOUTRACK_REQUEST_TIMEOUT Request timeout in milliseconds (default: 30000)
  YOUTRACK_MAX_RETRIES    Maximum retry attempts (default: 3)

EXAMPLES:
  # Using npx (no installation required)
  npx youtrack-mcp

  # Using global installation
  npm install -g youtrack-mcp
  youtrack-mcp

  # With environment variables
  YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud \\
  YOUTRACK_TOKEN=your-token \\
  youtrack-mcp

  # With CLI arguments
  youtrack-mcp --base-url https://your-instance.youtrack.cloud --token your-token

CLAUDE DESKTOP CONFIGURATION:
  Add to ~/.config/Claude/claude_desktop_config.json:
  
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

MORE INFORMATION:
  Documentation: https://github.com/youtrack-mcp/youtrack-mcp
  Issues: https://github.com/youtrack-mcp/youtrack-mcp/issues
  License: MIT
`);
}

function showVersion() {
  console.log('YouTrack MCP Server v1.0.0');
}

async function main() {
  const options = parseArgs();

  // Handle help and version
  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (options.version) {
    showVersion();
    process.exit(0);
  }

  // Validate required environment variables or CLI args
  const baseUrl = options.baseUrl || process.env.YOUTRACK_BASE_URL;
  if (!baseUrl) {
    console.error('❌ Error: YouTrack base URL is required');
    console.error('   Set YOUTRACK_BASE_URL environment variable or use --base-url flag');
    console.error('   Example: --base-url https://your-instance.youtrack.cloud');
    console.error('');
    console.error('   Run "youtrack-mcp --help" for more information');
    process.exit(1);
  }

  // Check for authentication
  const token = options.token || process.env.YOUTRACK_TOKEN;
  const username = options.username || process.env.YOUTRACK_USERNAME;
  const password = options.password || process.env.YOUTRACK_PASSWORD;

  if (!token && (!username || !password)) {
    console.error('❌ Error: Authentication is required');
    console.error('   Either provide:');
    console.error('   - YOUTRACK_TOKEN environment variable or --token flag');
    console.error('   - Both YOUTRACK_USERNAME and YOUTRACK_PASSWORD environment variables');
    console.error('     or --username and --password flags');
    console.error('');
    console.error('   Run "youtrack-mcp --help" for more information');
    process.exit(1);
  }

  try {
    // Build configuration
    const config: YouTrackApiConfig = {
      baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
      timeout: parseInt(process.env.YOUTRACK_REQUEST_TIMEOUT || '30000'),
      maxRetries: parseInt(process.env.YOUTRACK_MAX_RETRIES || '3'),
      debug: options.debug || process.env.YOUTRACK_DEBUG === 'true',
      ...(token ? { token } : { username, password })
    };

    // Log startup information (but not sensitive data)
    if (config.debug) {
      console.error('🚀 Starting YouTrack MCP Server...');
      console.error(`📍 YouTrack URL: ${config.baseUrl}`);
      console.error(`🔐 Authentication: ${token ? 'Token' : 'Username/Password'}`);
      console.error(`⏱️  Timeout: ${config.timeout}ms`);
      console.error(`🔄 Max Retries: ${config.maxRetries}`);
      console.error(`🐛 Debug Mode: ${config.debug ? 'enabled' : 'disabled'}`);
      console.error('');
    }

    // Create and start the server
    const server = new YouTrackMCPServer(config);
    await server.run();
  } catch (error: any) {
    console.error('❌ Failed to start YouTrack MCP Server:', error.message);
    if (options.debug || process.env.YOUTRACK_DEBUG === 'true') {
      console.error('📋 Stack trace:', error.stack);
    }
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   - Verify your YouTrack URL is correct and accessible');
    console.error('   - Check your authentication credentials');
    console.error('   - Ensure you have network connectivity');
    console.error('   - Run with --debug for more detailed error information');
    console.error('');
    console.error('   Run "youtrack-mcp --help" for configuration help');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
}); 