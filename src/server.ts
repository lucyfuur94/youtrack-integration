import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import { YouTrackClient } from './client/youtrack.js';
import { YouTrackTools } from './tools/index.js';
import { YouTrackApiConfig } from './types/index.js';
import * as schemas from './tools/index.js';

export class YouTrackMCPServer {
  private server: Server;
  private client: YouTrackClient;
  private tools: YouTrackTools;

  constructor(config: YouTrackApiConfig) {
    this.server = new Server(
      {
        name: 'youtrack-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.client = new YouTrackClient(config);
    this.tools = new YouTrackTools(this.client);

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Issue Management Tools
          {
            name: 'youtrack_list_issues',
            description: 'List issues with optional filtering and pagination',
            inputSchema: {
              type: 'object',
              properties: {
                project: { type: 'string', description: 'Filter by project short name or ID' },
                query: { type: 'string', description: 'YouTrack search query string' },
                assignee: { type: 'string', description: 'Filter by assignee login or ID' },
                state: { type: 'string', description: 'Filter by issue state' },
                priority: { type: 'string', description: 'Filter by priority' },
                skip: { type: 'number', description: 'Number of items to skip for pagination', default: 0 },
                top: { type: 'number', description: 'Maximum number of items to return', default: 50 },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              }
            }
          },
          {
            name: 'youtrack_get_issue',
            description: 'Get detailed information about a specific issue',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              },
              required: ['issueId']
            }
          },
          {
            name: 'youtrack_create_issue',
            description: 'Create a new issue',
            inputSchema: {
              type: 'object',
              properties: {
                project: { type: 'string', description: 'Project short name or ID' },
                summary: { type: 'string', description: 'Issue title/summary' },
                description: { type: 'string', description: 'Issue description' },
                assignee: { type: 'string', description: 'Assignee login or ID' },
                priority: { type: 'string', description: 'Priority name or ID' },
                type: { type: 'string', description: 'Issue type name or ID' },
                tags: { type: 'array', items: { type: 'string' }, description: 'List of tag names or IDs' }
              },
              required: ['project', 'summary']
            }
          },
          {
            name: 'youtrack_update_issue',
            description: 'Update an existing issue',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                summary: { type: 'string', description: 'Updated issue title/summary' },
                description: { type: 'string', description: 'Updated issue description' },
                assignee: { type: 'string', description: 'Updated assignee login or ID' },
                priority: { type: 'string', description: 'Updated priority name or ID' },
                state: { type: 'string', description: 'Updated state name or ID' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Updated list of tag names or IDs' }
              },
              required: ['issueId']
            }
          },
          {
            name: 'youtrack_delete_issue',
            description: 'Delete an issue',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' }
              },
              required: ['issueId']
            }
          },
          {
            name: 'youtrack_search_issues',
            description: 'Search issues using YouTrack query syntax',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'YouTrack search query (e.g., "assignee: me state: Open")' },
                skip: { type: 'number', description: 'Number of items to skip for pagination', default: 0 },
                top: { type: 'number', description: 'Maximum number of items to return', default: 50 },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              },
              required: ['query']
            }
          },

          // Comment Management Tools
          {
            name: 'youtrack_get_comments',
            description: 'Get all comments for an issue',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                skip: { type: 'number', description: 'Number of items to skip for pagination', default: 0 },
                top: { type: 'number', description: 'Maximum number of items to return', default: 50 }
              },
              required: ['issueId']
            }
          },
          {
            name: 'youtrack_add_comment',
            description: 'Add a comment to an issue',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                text: { type: 'string', description: 'Comment text' },
                usesMarkdown: { type: 'boolean', description: 'Whether the comment uses Markdown formatting', default: false }
              },
              required: ['issueId', 'text']
            }
          },
          {
            name: 'youtrack_update_comment',
            description: 'Update an existing comment',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                commentId: { type: 'string', description: 'Comment ID' },
                text: { type: 'string', description: 'Updated comment text' },
                usesMarkdown: { type: 'boolean', description: 'Whether the comment uses Markdown formatting', default: false }
              },
              required: ['issueId', 'commentId', 'text']
            }
          },
          {
            name: 'youtrack_delete_comment',
            description: 'Delete a comment',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                commentId: { type: 'string', description: 'Comment ID' }
              },
              required: ['issueId', 'commentId']
            }
          },

          // Attachment Management Tools
          {
            name: 'youtrack_get_attachments',
            description: 'Get all attachments for an issue',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                skip: { type: 'number', description: 'Number of items to skip for pagination', default: 0 },
                top: { type: 'number', description: 'Maximum number of items to return', default: 50 }
              },
              required: ['issueId']
            }
          },

          // Work Item Management Tools
          {
            name: 'youtrack_get_work_items',
            description: 'Get work items (time tracking entries) for an issue',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                skip: { type: 'number', description: 'Number of items to skip for pagination', default: 0 },
                top: { type: 'number', description: 'Maximum number of items to return', default: 50 }
              },
              required: ['issueId']
            }
          },
          {
            name: 'youtrack_add_work_item',
            description: 'Add a work item (time tracking entry) to an issue',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                duration: { type: ['number', 'string'], description: 'Duration in minutes (number) or time string (e.g., "2h 30m")' },
                description: { type: 'string', description: 'Work description' },
                date: { type: 'number', description: 'Work date as timestamp (default: current time)' },
                type: { type: 'string', description: 'Work item type name or ID' }
              },
              required: ['issueId', 'duration']
            }
          },
          {
            name: 'youtrack_update_work_item',
            description: 'Update an existing work item',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                workItemId: { type: 'string', description: 'Work item ID' },
                duration: { type: ['number', 'string'], description: 'Updated duration in minutes (number) or time string (e.g., "2h 30m")' },
                description: { type: 'string', description: 'Updated work description' },
                date: { type: 'number', description: 'Updated work date as timestamp' },
                type: { type: 'string', description: 'Updated work item type name or ID' }
              },
              required: ['issueId', 'workItemId']
            }
          },
          {
            name: 'youtrack_delete_work_item',
            description: 'Delete a work item',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                workItemId: { type: 'string', description: 'Work item ID' }
              },
              required: ['issueId', 'workItemId']
            }
          },

          // Project Management Tools
          {
            name: 'youtrack_list_projects',
            description: 'List all accessible projects',
            inputSchema: {
              type: 'object',
              properties: {
                skip: { type: 'number', description: 'Number of items to skip for pagination', default: 0 },
                top: { type: 'number', description: 'Maximum number of items to return', default: 50 },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              }
            }
          },
          {
            name: 'youtrack_get_project',
            description: 'Get detailed information about a specific project',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: { type: 'string', description: 'Project short name or ID' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              },
              required: ['projectId']
            }
          },
          {
            name: 'youtrack_create_project',
            description: 'Create a new project',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Project name' },
                shortName: { type: 'string', description: 'Project short name (used as prefix for issues)' },
                description: { type: 'string', description: 'Project description' },
                leader: { type: 'string', description: 'Project leader login or ID' }
              },
              required: ['name', 'shortName']
            }
          },
          {
            name: 'youtrack_update_project',
            description: 'Update an existing project',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: { type: 'string', description: 'Project short name or ID' },
                name: { type: 'string', description: 'Updated project name' },
                description: { type: 'string', description: 'Updated project description' },
                leader: { type: 'string', description: 'Updated project leader login or ID' },
                archived: { type: 'boolean', description: 'Whether the project should be archived' }
              },
              required: ['projectId']
            }
          },
          {
            name: 'youtrack_delete_project',
            description: 'Delete a project',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: { type: 'string', description: 'Project short name or ID' }
              },
              required: ['projectId']
            }
          },
          {
            name: 'youtrack_get_project_custom_fields',
            description: 'Get custom fields for a project',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: { type: 'string', description: 'Project short name or ID' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              },
              required: ['projectId']
            }
          },

          // User Management Tools
          {
            name: 'youtrack_get_current_user',
            description: 'Get current authenticated user information',
            inputSchema: {
              type: 'object',
              properties: {
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              }
            }
          },
          {
            name: 'youtrack_list_users',
            description: 'List users with optional search and pagination',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query for user names or logins' },
                skip: { type: 'number', description: 'Number of items to skip for pagination', default: 0 },
                top: { type: 'number', description: 'Maximum number of items to return', default: 50 },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              }
            }
          },
          {
            name: 'youtrack_get_user',
            description: 'Get detailed information about a specific user',
            inputSchema: {
              type: 'object',
              properties: {
                userId: { type: 'string', description: 'User login or ID' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              },
              required: ['userId']
            }
          },
          {
            name: 'youtrack_list_groups',
            description: 'List user groups',
            inputSchema: {
              type: 'object',
              properties: {
                skip: { type: 'number', description: 'Number of items to skip for pagination', default: 0 },
                top: { type: 'number', description: 'Maximum number of items to return', default: 50 },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              }
            }
          },
          {
            name: 'youtrack_get_group',
            description: 'Get detailed information about a specific group',
            inputSchema: {
              type: 'object',
              properties: {
                groupId: { type: 'string', description: 'Group name or ID' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              },
              required: ['groupId']
            }
          },

          // Workflow Management Tools
          {
            name: 'youtrack_get_issue_commands',
            description: 'Get available workflow commands for an issue',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' }
              },
              required: ['issueId']
            }
          },
          {
            name: 'youtrack_apply_workflow_command',
            description: 'Apply a workflow command to an issue',
            inputSchema: {
              type: 'object',
              properties: {
                issueId: { type: 'string', description: 'Issue ID (e.g., PROJECT-123)' },
                command: { type: 'string', description: 'Workflow command (e.g., "assignee me", "state Fixed")' },
                comment: { type: 'string', description: 'Optional comment to add with the command' }
              },
              required: ['issueId', 'command']
            }
          },

          // Agile Board Management Tools
          {
            name: 'youtrack_list_agile_boards',
            description: 'List all agile boards',
            inputSchema: {
              type: 'object',
              properties: {
                skip: { type: 'number', description: 'Number of items to skip for pagination', default: 0 },
                top: { type: 'number', description: 'Maximum number of items to return', default: 50 },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              }
            }
          },
          {
            name: 'youtrack_get_agile_board',
            description: 'Get detailed information about a specific agile board',
            inputSchema: {
              type: 'object',
              properties: {
                boardId: { type: 'string', description: 'Agile board ID' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              },
              required: ['boardId']
            }
          },
          {
            name: 'youtrack_create_agile_board',
            description: 'Create a new agile board',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Board name' },
                projects: { type: 'array', items: { type: 'string' }, description: 'List of project IDs to include in the board' }
              },
              required: ['name', 'projects']
            }
          },
          {
            name: 'youtrack_update_agile_board',
            description: 'Update an existing agile board',
            inputSchema: {
              type: 'object',
              properties: {
                boardId: { type: 'string', description: 'Agile board ID' },
                name: { type: 'string', description: 'Updated board name' },
                projects: { type: 'array', items: { type: 'string' }, description: 'Updated list of project IDs' }
              },
              required: ['boardId']
            }
          },

          // Sprint Management Tools
          {
            name: 'youtrack_list_sprints',
            description: 'List sprints for an agile board',
            inputSchema: {
              type: 'object',
              properties: {
                boardId: { type: 'string', description: 'Agile board ID' },
                skip: { type: 'number', description: 'Number of items to skip for pagination', default: 0 },
                top: { type: 'number', description: 'Maximum number of items to return', default: 50 },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              },
              required: ['boardId']
            }
          },
          {
            name: 'youtrack_get_sprint',
            description: 'Get detailed information about a specific sprint',
            inputSchema: {
              type: 'object',
              properties: {
                boardId: { type: 'string', description: 'Agile board ID' },
                sprintId: { type: 'string', description: 'Sprint ID' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' }
              },
              required: ['boardId', 'sprintId']
            }
          },
          {
            name: 'youtrack_create_sprint',
            description: 'Create a new sprint',
            inputSchema: {
              type: 'object',
              properties: {
                boardId: { type: 'string', description: 'Agile board ID' },
                name: { type: 'string', description: 'Sprint name' },
                goal: { type: 'string', description: 'Sprint goal' },
                start: { type: 'number', description: 'Sprint start date as timestamp' },
                finish: { type: 'number', description: 'Sprint end date as timestamp' }
              },
              required: ['boardId', 'name']
            }
          },
          {
            name: 'youtrack_update_sprint',
            description: 'Update an existing sprint',
            inputSchema: {
              type: 'object',
              properties: {
                boardId: { type: 'string', description: 'Agile board ID' },
                sprintId: { type: 'string', description: 'Sprint ID' },
                name: { type: 'string', description: 'Updated sprint name' },
                goal: { type: 'string', description: 'Updated sprint goal' },
                start: { type: 'number', description: 'Updated sprint start date as timestamp' },
                finish: { type: 'number', description: 'Updated sprint end date as timestamp' },
                archived: { type: 'boolean', description: 'Whether the sprint should be archived' }
              },
              required: ['boardId', 'sprintId']
            }
          },

          // Utility Tools
          {
            name: 'youtrack_ping',
            description: 'Test YouTrack connection',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'youtrack_get_server_info',
            description: 'Get YouTrack server information',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },

          // Statistics and Reporting Tools
          {
            name: 'youtrack_get_project_statistics',
            description: 'Get project statistics and metrics',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: { type: 'string', description: 'Project short name or ID' }
              },
              required: ['projectId']
            }
          },
          {
            name: 'youtrack_generate_report',
            description: 'Generate custom reports',
            inputSchema: {
              type: 'object',
              properties: {
                reportType: { type: 'string', description: 'Type of report to generate' },
                parameters: { type: 'object', description: 'Report-specific parameters' }
              },
              required: ['reportType']
            }
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: any;

        switch (name) {
          // Issue Management
          case 'youtrack_list_issues':
            result = await this.tools.listIssues(schemas.ListIssuesSchema.parse(args));
            break;
          case 'youtrack_get_issue':
            result = await this.tools.getIssue(schemas.GetIssueSchema.parse(args));
            break;
          case 'youtrack_create_issue':
            result = await this.tools.createIssue(schemas.CreateIssueSchema.parse(args));
            break;
          case 'youtrack_update_issue':
            result = await this.tools.updateIssue(schemas.UpdateIssueSchema.parse(args));
            break;
          case 'youtrack_delete_issue':
            result = await this.tools.deleteIssue(args as { issueId: string });
            break;
          case 'youtrack_search_issues':
            result = await this.tools.searchIssues(schemas.SearchIssuesSchema.parse(args));
            break;

          // Comment Management
          case 'youtrack_get_comments':
            result = await this.tools.getComments(args as { issueId: string; skip?: number; top?: number });
            break;
          case 'youtrack_add_comment':
            result = await this.tools.addComment(schemas.AddCommentSchema.parse(args));
            break;
          case 'youtrack_update_comment':
            result = await this.tools.updateComment(schemas.UpdateCommentSchema.parse(args));
            break;
          case 'youtrack_delete_comment':
            result = await this.tools.deleteComment(schemas.DeleteCommentSchema.parse(args));
            break;

          // Attachment Management
          case 'youtrack_get_attachments':
            result = await this.tools.getAttachments(args as { issueId: string; skip?: number; top?: number });
            break;

          // Work Item Management
          case 'youtrack_get_work_items':
            result = await this.tools.getWorkItems(args as { issueId: string; skip?: number; top?: number });
            break;
          case 'youtrack_add_work_item':
            result = await this.tools.addWorkItem(schemas.AddWorkItemSchema.parse(args));
            break;
          case 'youtrack_update_work_item':
            result = await this.tools.updateWorkItem(schemas.UpdateWorkItemSchema.parse(args));
            break;
          case 'youtrack_delete_work_item':
            result = await this.tools.deleteWorkItem(schemas.DeleteWorkItemSchema.parse(args));
            break;

          // Project Management
          case 'youtrack_list_projects':
            result = await this.tools.listProjects(schemas.ListProjectsSchema.parse(args));
            break;
          case 'youtrack_get_project':
            result = await this.tools.getProject(schemas.GetProjectSchema.parse(args));
            break;
          case 'youtrack_create_project':
            result = await this.tools.createProject(schemas.CreateProjectSchema.parse(args));
            break;
          case 'youtrack_update_project':
            result = await this.tools.updateProject(schemas.UpdateProjectSchema.parse(args));
            break;
          case 'youtrack_delete_project':
            result = await this.tools.deleteProject(schemas.DeleteProjectSchema.parse(args));
            break;
          case 'youtrack_get_project_custom_fields':
            result = await this.tools.getProjectCustomFields(args as { projectId: string; fields?: string });
            break;

          // User Management
          case 'youtrack_get_current_user':
            result = await this.tools.getCurrentUser(args as { fields?: string });
            break;
          case 'youtrack_list_users':
            result = await this.tools.listUsers(schemas.ListUsersSchema.parse(args));
            break;
          case 'youtrack_get_user':
            result = await this.tools.getUser(schemas.GetUserSchema.parse(args));
            break;
          case 'youtrack_list_groups':
            result = await this.tools.listGroups(schemas.ListGroupsSchema.parse(args));
            break;
          case 'youtrack_get_group':
            result = await this.tools.getGroup(schemas.GetGroupSchema.parse(args));
            break;

          // Workflow Management
          case 'youtrack_get_issue_commands':
            result = await this.tools.getIssueCommands(args as { issueId: string });
            break;
          case 'youtrack_apply_workflow_command':
            result = await this.tools.applyWorkflowCommand(schemas.ApplyCommandSchema.parse(args));
            break;

          // Agile Board Management
          case 'youtrack_list_agile_boards':
            result = await this.tools.listAgileBoards(schemas.ListAgileBoardsSchema.parse(args));
            break;
          case 'youtrack_get_agile_board':
            result = await this.tools.getAgileBoard(schemas.GetAgileBoardSchema.parse(args));
            break;
          case 'youtrack_create_agile_board':
            result = await this.tools.createAgileBoard(schemas.CreateAgileBoardSchema.parse(args));
            break;
          case 'youtrack_update_agile_board':
            result = await this.tools.updateAgileBoard(args as { boardId: string; name?: string; projects?: string[] });
            break;

          // Sprint Management
          case 'youtrack_list_sprints':
            result = await this.tools.listSprints(schemas.ListSprintsSchema.parse(args));
            break;
          case 'youtrack_get_sprint':
            result = await this.tools.getSprint(args as { boardId: string; sprintId: string; fields?: string });
            break;
          case 'youtrack_create_sprint':
            result = await this.tools.createSprint(args as { boardId: string; name: string; goal?: string; start?: number; finish?: number });
            break;
          case 'youtrack_update_sprint':
            result = await this.tools.updateSprint(args as { boardId: string; sprintId: string; name?: string; goal?: string; start?: number; finish?: number; archived?: boolean });
            break;

          // Utility Tools
          case 'youtrack_ping':
            result = await this.tools.ping();
            break;
          case 'youtrack_get_server_info':
            result = await this.tools.getServerInfo();
            break;

          // Statistics and Reporting
          case 'youtrack_get_project_statistics':
            result = await this.tools.getProjectStatistics(args as { projectId: string });
            break;
          case 'youtrack_generate_report':
            result = await this.tools.generateReport(args as { reportType: string; parameters?: any });
            break;

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        if (error instanceof McpError) {
          throw error;
        }

        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${error.message}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('YouTrack MCP server running on stdio');
  }
} 