import { z } from 'zod';
import { YouTrackClient } from '../client/youtrack.js';
import { YouTrackToolResult } from '../types/index.js';

// Tool schemas for validation
export const ListIssuesSchema = z.object({
  project: z.string().optional(),
  query: z.string().optional(),
  assignee: z.string().optional(),
  state: z.string().optional(),
  priority: z.string().optional(),
  skip: z.number().optional().default(0),
  top: z.number().optional().default(50),
  fields: z.string().optional()
});

export const GetIssueSchema = z.object({
  issueId: z.string(),
  fields: z.string().optional()
});

export const CreateIssueSchema = z.object({
  project: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.string().optional(),
  type: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const UpdateIssueSchema = z.object({
  issueId: z.string(),
  summary: z.string().optional(),
  description: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.string().optional(),
  state: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const SearchIssuesSchema = z.object({
  query: z.string(),
  skip: z.number().optional().default(0),
  top: z.number().optional().default(50),
  fields: z.string().optional()
});

export const AddCommentSchema = z.object({
  issueId: z.string(),
  text: z.string(),
  usesMarkdown: z.boolean().optional().default(false)
});

export const UpdateCommentSchema = z.object({
  issueId: z.string(),
  commentId: z.string(),
  text: z.string(),
  usesMarkdown: z.boolean().optional().default(false)
});

export const DeleteCommentSchema = z.object({
  issueId: z.string(),
  commentId: z.string()
});

export const AddWorkItemSchema = z.object({
  issueId: z.string(),
  duration: z.union([z.number(), z.string()]),
  description: z.string().optional(),
  date: z.number().optional(),
  type: z.string().optional()
});

export const UpdateWorkItemSchema = z.object({
  issueId: z.string(),
  workItemId: z.string(),
  duration: z.union([z.number(), z.string()]).optional(),
  description: z.string().optional(),
  date: z.number().optional(),
  type: z.string().optional()
});

export const DeleteWorkItemSchema = z.object({
  issueId: z.string(),
  workItemId: z.string()
});

export const ListProjectsSchema = z.object({
  skip: z.number().optional().default(0),
  top: z.number().optional().default(50),
  fields: z.string().optional()
});

export const GetProjectSchema = z.object({
  projectId: z.string(),
  fields: z.string().optional()
});

export const CreateProjectSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  description: z.string().optional(),
  leader: z.string().optional()
});

export const UpdateProjectSchema = z.object({
  projectId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  leader: z.string().optional(),
  archived: z.boolean().optional()
});

export const DeleteProjectSchema = z.object({
  projectId: z.string()
});

export const ListUsersSchema = z.object({
  query: z.string().optional(),
  skip: z.number().optional().default(0),
  top: z.number().optional().default(50),
  fields: z.string().optional()
});

export const GetUserSchema = z.object({
  userId: z.string(),
  fields: z.string().optional()
});

export const ListGroupsSchema = z.object({
  skip: z.number().optional().default(0),
  top: z.number().optional().default(50),
  fields: z.string().optional()
});

export const GetGroupSchema = z.object({
  groupId: z.string(),
  fields: z.string().optional()
});

export const ApplyCommandSchema = z.object({
  issueId: z.string(),
  command: z.string(),
  comment: z.string().optional()
});

export const ListAgileBoardsSchema = z.object({
  skip: z.number().optional().default(0),
  top: z.number().optional().default(50),
  fields: z.string().optional()
});

export const GetAgileBoardSchema = z.object({
  boardId: z.string(),
  fields: z.string().optional()
});

export const CreateAgileBoardSchema = z.object({
  name: z.string(),
  projects: z.array(z.string())
});

export const ListSprintsSchema = z.object({
  boardId: z.string(),
  skip: z.number().optional().default(0),
  top: z.number().optional().default(50),
  fields: z.string().optional()
});

export class YouTrackTools {
  constructor(private client: YouTrackClient) {}

  // Issue Management Tools
  async listIssues(params: z.infer<typeof ListIssuesSchema>): Promise<YouTrackToolResult> {
    try {
      const options = {
        skip: params.skip,
        top: params.top,
        fields: params.fields,
        ...(params.query && { query: params.query })
      };

      // Build query string based on filters
      const filters = [];
      if (params.project) filters.push(`project: ${params.project}`);
      if (params.assignee) filters.push(`assignee: ${params.assignee}`);
      if (params.state) filters.push(`state: ${params.state}`);
      if (params.priority) filters.push(`priority: ${params.priority}`);

      if (filters.length > 0 && !params.query) {
        options.query = filters.join(' and ');
      }

      const issues = await this.client.listIssues(options);
      return {
        success: true,
        data: issues,
        message: `Found ${issues.length} issues`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to list issues'
      };
    }
  }

  async getIssue(params: z.infer<typeof GetIssueSchema>): Promise<YouTrackToolResult> {
    try {
      const issue = await this.client.getIssue(params.issueId, params.fields);
      return {
        success: true,
        data: issue,
        message: `Retrieved issue ${issue.idReadable}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get issue'
      };
    }
  }

  async createIssue(params: z.infer<typeof CreateIssueSchema>): Promise<YouTrackToolResult> {
    try {
      const issueData = {
        project: { id: params.project },
        summary: params.summary,
        ...(params.description && { description: params.description }),
        ...(params.assignee && { assignee: { id: params.assignee } }),
        ...(params.priority && { priority: { id: params.priority } }),
        ...(params.type && { type: { id: params.type } }),
        ...(params.tags && { tags: params.tags.map(tag => ({ id: tag })) })
      };

      const issue = await this.client.createIssue(issueData);
      return {
        success: true,
        data: issue,
        message: `Created issue ${issue.idReadable}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create issue'
      };
    }
  }

  async updateIssue(params: z.infer<typeof UpdateIssueSchema>): Promise<YouTrackToolResult> {
    try {
      const updateData: any = {};
      if (params.summary) updateData.summary = params.summary;
      if (params.description) updateData.description = params.description;
      if (params.assignee) updateData.assignee = { id: params.assignee };
      if (params.priority) updateData.priority = { id: params.priority };
      if (params.state) updateData.state = { id: params.state };
      if (params.tags) updateData.tags = params.tags.map(tag => ({ id: tag }));

      const issue = await this.client.updateIssue(params.issueId, updateData);
      return {
        success: true,
        data: issue,
        message: `Updated issue ${issue.idReadable}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update issue'
      };
    }
  }

  async deleteIssue(params: { issueId: string }): Promise<YouTrackToolResult> {
    try {
      await this.client.deleteIssue(params.issueId);
      return {
        success: true,
        message: `Deleted issue ${params.issueId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete issue'
      };
    }
  }

  async searchIssues(params: z.infer<typeof SearchIssuesSchema>): Promise<YouTrackToolResult> {
    try {
      const issues = await this.client.searchIssues(params.query, {
        skip: params.skip,
        top: params.top,
        fields: params.fields
      });
      return {
        success: true,
        data: issues,
        message: `Found ${issues.length} issues matching "${params.query}"`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to search issues'
      };
    }
  }

  // Comment Management Tools
  async getComments(params: { issueId: string; skip?: number; top?: number }): Promise<YouTrackToolResult> {
    try {
      const comments = await this.client.getIssueComments(params.issueId, {
        skip: params.skip || 0,
        top: params.top || 50
      });
      return {
        success: true,
        data: comments,
        message: `Retrieved ${comments.length} comments for issue ${params.issueId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get comments'
      };
    }
  }

  async addComment(params: z.infer<typeof AddCommentSchema>): Promise<YouTrackToolResult> {
    try {
      const comment = await this.client.addComment(params.issueId, {
        text: params.text,
        usesMarkdown: params.usesMarkdown
      });
      return {
        success: true,
        data: comment,
        message: `Added comment to issue ${params.issueId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add comment'
      };
    }
  }

  async updateComment(params: z.infer<typeof UpdateCommentSchema>): Promise<YouTrackToolResult> {
    try {
      const comment = await this.client.updateComment(params.issueId, params.commentId, {
        text: params.text,
        usesMarkdown: params.usesMarkdown
      });
      return {
        success: true,
        data: comment,
        message: `Updated comment ${params.commentId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update comment'
      };
    }
  }

  async deleteComment(params: z.infer<typeof DeleteCommentSchema>): Promise<YouTrackToolResult> {
    try {
      await this.client.deleteComment(params.issueId, params.commentId);
      return {
        success: true,
        message: `Deleted comment ${params.commentId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete comment'
      };
    }
  }

  // Attachment Management Tools
  async getAttachments(params: { issueId: string; skip?: number; top?: number }): Promise<YouTrackToolResult> {
    try {
      const attachments = await this.client.getIssueAttachments(params.issueId, {
        skip: params.skip || 0,
        top: params.top || 50
      });
      return {
        success: true,
        data: attachments,
        message: `Retrieved ${attachments.length} attachments for issue ${params.issueId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get attachments'
      };
    }
  }

  // Work Item Management Tools
  async getWorkItems(params: { issueId: string; skip?: number; top?: number }): Promise<YouTrackToolResult> {
    try {
      const workItems = await this.client.getWorkItems(params.issueId, {
        skip: params.skip || 0,
        top: params.top || 50
      });
      return {
        success: true,
        data: workItems,
        message: `Retrieved ${workItems.length} work items for issue ${params.issueId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get work items'
      };
    }
  }

  async addWorkItem(params: z.infer<typeof AddWorkItemSchema>): Promise<YouTrackToolResult> {
    try {
      const workItem = await this.client.addWorkItem(params.issueId, {
        duration: params.duration,
        ...(params.description && { description: params.description }),
        ...(params.date && { date: params.date }),
        ...(params.type && { type: { id: params.type } })
      });
      return {
        success: true,
        data: workItem,
        message: `Added work item to issue ${params.issueId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add work item'
      };
    }
  }

  async updateWorkItem(params: z.infer<typeof UpdateWorkItemSchema>): Promise<YouTrackToolResult> {
    try {
      const updateData: any = {};
      if (params.duration !== undefined) updateData.duration = params.duration;
      if (params.description) updateData.description = params.description;
      if (params.date) updateData.date = params.date;
      if (params.type) updateData.type = { id: params.type };

      const workItem = await this.client.updateWorkItem(params.issueId, params.workItemId, updateData);
      return {
        success: true,
        data: workItem,
        message: `Updated work item ${params.workItemId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update work item'
      };
    }
  }

  async deleteWorkItem(params: z.infer<typeof DeleteWorkItemSchema>): Promise<YouTrackToolResult> {
    try {
      await this.client.deleteWorkItem(params.issueId, params.workItemId);
      return {
        success: true,
        message: `Deleted work item ${params.workItemId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete work item'
      };
    }
  }

  // Project Management Tools
  async listProjects(params: z.infer<typeof ListProjectsSchema>): Promise<YouTrackToolResult> {
    try {
      const projects = await this.client.listProjects({
        skip: params.skip,
        top: params.top,
        fields: params.fields
      });
      return {
        success: true,
        data: projects,
        message: `Retrieved ${projects.length} projects`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to list projects'
      };
    }
  }

  async getProject(params: z.infer<typeof GetProjectSchema>): Promise<YouTrackToolResult> {
    try {
      const project = await this.client.getProject(params.projectId, params.fields);
      return {
        success: true,
        data: project,
        message: `Retrieved project ${project.shortName}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get project'
      };
    }
  }

  async createProject(params: z.infer<typeof CreateProjectSchema>): Promise<YouTrackToolResult> {
    try {
      const projectData = {
        name: params.name,
        shortName: params.shortName,
        ...(params.description && { description: params.description }),
        ...(params.leader && { leader: { id: params.leader } })
      };

      const project = await this.client.createProject(projectData);
      return {
        success: true,
        data: project,
        message: `Created project ${project.shortName}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create project'
      };
    }
  }

  async updateProject(params: z.infer<typeof UpdateProjectSchema>): Promise<YouTrackToolResult> {
    try {
      const updateData: any = {};
      if (params.name) updateData.name = params.name;
      if (params.description) updateData.description = params.description;
      if (params.leader) updateData.leader = { id: params.leader };
      if (params.archived !== undefined) updateData.archived = params.archived;

      const project = await this.client.updateProject(params.projectId, updateData);
      return {
        success: true,
        data: project,
        message: `Updated project ${project.shortName}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update project'
      };
    }
  }

  async deleteProject(params: z.infer<typeof DeleteProjectSchema>): Promise<YouTrackToolResult> {
    try {
      await this.client.deleteProject(params.projectId);
      return {
        success: true,
        message: `Deleted project ${params.projectId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete project'
      };
    }
  }

  async getProjectCustomFields(params: { projectId: string; fields?: string }): Promise<YouTrackToolResult> {
    try {
      const customFields = await this.client.getProjectCustomFields(params.projectId, params.fields);
      return {
        success: true,
        data: customFields,
        message: `Retrieved ${customFields.length} custom fields for project ${params.projectId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get project custom fields'
      };
    }
  }

  // User Management Tools
  async getCurrentUser(params: { fields?: string }): Promise<YouTrackToolResult> {
    try {
      const user = await this.client.getCurrentUser(params.fields);
      return {
        success: true,
        data: user,
        message: `Retrieved current user ${user.login}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get current user'
      };
    }
  }

  async listUsers(params: z.infer<typeof ListUsersSchema>): Promise<YouTrackToolResult> {
    try {
      const users = await this.client.listUsers({
        query: params.query,
        skip: params.skip,
        top: params.top,
        fields: params.fields
      });
      return {
        success: true,
        data: users,
        message: `Retrieved ${users.length} users`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to list users'
      };
    }
  }

  async getUser(params: z.infer<typeof GetUserSchema>): Promise<YouTrackToolResult> {
    try {
      const user = await this.client.getUser(params.userId, params.fields);
      return {
        success: true,
        data: user,
        message: `Retrieved user ${user.login}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user'
      };
    }
  }

  async listGroups(params: z.infer<typeof ListGroupsSchema>): Promise<YouTrackToolResult> {
    try {
      const groups = await this.client.listGroups({
        skip: params.skip,
        top: params.top,
        fields: params.fields
      });
      return {
        success: true,
        data: groups,
        message: `Retrieved ${groups.length} groups`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to list groups'
      };
    }
  }

  async getGroup(params: z.infer<typeof GetGroupSchema>): Promise<YouTrackToolResult> {
    try {
      const group = await this.client.getGroup(params.groupId, params.fields);
      return {
        success: true,
        data: group,
        message: `Retrieved group ${group.name}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get group'
      };
    }
  }

  // Workflow Management Tools
  async getIssueCommands(params: { issueId: string }): Promise<YouTrackToolResult> {
    try {
      const commands = await this.client.getAvailableCommands(params.issueId);
      return {
        success: true,
        data: commands,
        message: `Retrieved available commands for issue ${params.issueId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get issue commands'
      };
    }
  }

  async applyWorkflowCommand(params: z.infer<typeof ApplyCommandSchema>): Promise<YouTrackToolResult> {
    try {
      const result = await this.client.applyCommand(params.issueId, params.command, params.comment);
      return {
        success: true,
        data: result,
        message: `Applied command "${params.command}" to issue ${params.issueId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to apply workflow command'
      };
    }
  }

  // Agile Board Management Tools
  async listAgileBoards(params: z.infer<typeof ListAgileBoardsSchema>): Promise<YouTrackToolResult> {
    try {
      const boards = await this.client.listAgileBoards({
        skip: params.skip,
        top: params.top,
        fields: params.fields
      });
      return {
        success: true,
        data: boards,
        message: `Retrieved ${boards.length} agile boards`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to list agile boards'
      };
    }
  }

  async getAgileBoard(params: z.infer<typeof GetAgileBoardSchema>): Promise<YouTrackToolResult> {
    try {
      const board = await this.client.getAgileBoard(params.boardId, params.fields);
      return {
        success: true,
        data: board,
        message: `Retrieved agile board ${board.name}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get agile board'
      };
    }
  }

  async createAgileBoard(params: z.infer<typeof CreateAgileBoardSchema>): Promise<YouTrackToolResult> {
    try {
      const boardData: any = {
        name: params.name,
        projects: params.projects.map(projectId => ({ id: projectId }))
      };

      const board = await this.client.createAgileBoard(boardData);
      return {
        success: true,
        data: board,
        message: `Created agile board ${board.name}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create agile board'
      };
    }
  }

  async updateAgileBoard(params: { boardId: string; name?: string; projects?: string[] }): Promise<YouTrackToolResult> {
    try {
      const updateData: any = {};
      if (params.name) updateData.name = params.name;
      if (params.projects) updateData.projects = params.projects.map(projectId => ({ id: projectId }));

      const board = await this.client.updateAgileBoard(params.boardId, updateData);
      return {
        success: true,
        data: board,
        message: `Updated agile board ${board.name}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update agile board'
      };
    }
  }

  // Sprint Management Tools
  async listSprints(params: z.infer<typeof ListSprintsSchema>): Promise<YouTrackToolResult> {
    try {
      const sprints = await this.client.listSprints(params.boardId, {
        skip: params.skip,
        top: params.top,
        fields: params.fields
      });
      return {
        success: true,
        data: sprints,
        message: `Retrieved ${sprints.length} sprints for board ${params.boardId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to list sprints'
      };
    }
  }

  async getSprint(params: { boardId: string; sprintId: string; fields?: string }): Promise<YouTrackToolResult> {
    try {
      const sprint = await this.client.getSprint(params.boardId, params.sprintId, params.fields);
      return {
        success: true,
        data: sprint,
        message: `Retrieved sprint ${sprint.name}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get sprint'
      };
    }
  }

  async createSprint(params: { boardId: string; name: string; goal?: string; start?: number; finish?: number }): Promise<YouTrackToolResult> {
    try {
      const sprintData = {
        name: params.name,
        ...(params.goal && { goal: params.goal }),
        ...(params.start && { start: params.start }),
        ...(params.finish && { finish: params.finish })
      };

      const sprint = await this.client.createSprint(params.boardId, sprintData);
      return {
        success: true,
        data: sprint,
        message: `Created sprint ${sprint.name}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create sprint'
      };
    }
  }

  async updateSprint(params: { boardId: string; sprintId: string; name?: string; goal?: string; start?: number; finish?: number; archived?: boolean }): Promise<YouTrackToolResult> {
    try {
      const updateData: any = {};
      if (params.name) updateData.name = params.name;
      if (params.goal) updateData.goal = params.goal;
      if (params.start) updateData.start = params.start;
      if (params.finish) updateData.finish = params.finish;
      if (params.archived !== undefined) updateData.archived = params.archived;

      const sprint = await this.client.updateSprint(params.boardId, params.sprintId, updateData);
      return {
        success: true,
        data: sprint,
        message: `Updated sprint ${sprint.name}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update sprint'
      };
    }
  }

  // Utility Tools
  async ping(): Promise<YouTrackToolResult> {
    try {
      const isConnected = await this.client.ping();
      return {
        success: isConnected,
        message: isConnected ? 'YouTrack connection successful' : 'YouTrack connection failed'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to ping YouTrack'
      };
    }
  }

  async getServerInfo(): Promise<YouTrackToolResult> {
    try {
      const serverInfo = await this.client.getServerInfo();
      return {
        success: true,
        data: serverInfo,
        message: 'Retrieved YouTrack server information'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get server info'
      };
    }
  }

  // Statistics and Reporting Tools
  async getProjectStatistics(params: { projectId: string }): Promise<YouTrackToolResult> {
    try {
      const statistics = await this.client.getProjectStatistics(params.projectId);
      return {
        success: true,
        data: statistics,
        message: `Retrieved statistics for project ${params.projectId}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get project statistics'
      };
    }
  }

  async generateReport(params: { reportType: string; parameters?: any }): Promise<YouTrackToolResult> {
    try {
      const report = await this.client.generateReport(params.reportType, params.parameters);
      return {
        success: true,
        data: report,
        message: `Generated report of type ${params.reportType}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to generate report'
      };
    }
  }
} 