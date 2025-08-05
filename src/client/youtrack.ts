import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  YouTrackApiConfig,
  YouTrackApiResponse,
  YouTrackListResponse,
  YouTrackUser,
  YouTrackProject,
  YouTrackIssue,
  YouTrackIssueComment,
  YouTrackIssueAttachment,
  YouTrackWorkItem,
  YouTrackAgileBoard,
  YouTrackSprint,
  YouTrackTag,
  YouTrackUserGroup,
  YouTrackCustomField,
  YouTrackCreateIssueRequest,
  YouTrackUpdateIssueRequest,
  YouTrackCreateCommentRequest,
  YouTrackCreateWorkItemRequest,
  YouTrackCreateProjectRequest,
  YouTrackSearchOptions,
  YouTrackPaginationOptions,
  YouTrackError
} from '../types/index.js';

export class YouTrackClient {
  private client: AxiosInstance;
  private config: YouTrackApiConfig;

  constructor(config: YouTrackApiConfig) {
    this.config = {
      timeout: 30000,
      maxRetries: 3,
      debug: false,
      ...config
    };

    this.client = axios.create({
      baseURL: `${this.config.baseUrl}/api`,
      timeout: this.config.timeout,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...(this.config.token && { Authorization: `Bearer ${this.config.token}` }),
        // Cloudflare Access headers
        ...(process.env.CF_ACCESS_CLIENT_ID && { 'CF-Access-Client-Id': process.env.CF_ACCESS_CLIENT_ID }),
        ...(process.env.CF_ACCESS_CLIENT_SECRET && { 'CF-Access-Client-Secret': process.env.CF_ACCESS_CLIENT_SECRET })
      }
    });

    // Add request interceptor for basic auth if username/password provided
    if (this.config.username && this.config.password) {
      this.client.interceptors.request.use(config => {
        const auth = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
        config.headers.Authorization = `Basic ${auth}`;
        return config;
      });
    }

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (this.config.debug) {
          console.error('YouTrack API Error:', error.response?.data || error.message);
        }
        throw error;
      }
    );
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    params?: any
  ): Promise<YouTrackApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        method,
        url,
        data,
        params
      });

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>
      };
    } catch (error: any) {
      const errorData = error.response?.data as YouTrackError;
      throw new Error(
        errorData?.error_description || 
        errorData?.error || 
        error.message || 
        'Unknown YouTrack API error'
      );
    }
  }

  // User Management
  async getCurrentUser(fields?: string): Promise<YouTrackUser> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<YouTrackUser>('GET', '/users/me', undefined, params);
    return response.data;
  }

  async getUser(userId: string, fields?: string): Promise<YouTrackUser> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<YouTrackUser>('GET', `/users/${userId}`, undefined, params);
    return response.data;
  }

  async listUsers(options?: YouTrackSearchOptions): Promise<YouTrackUser[]> {
    const response = await this.request<YouTrackUser[]>('GET', '/users', undefined, options);
    return response.data;
  }

  async listGroups(options?: YouTrackPaginationOptions): Promise<YouTrackUserGroup[]> {
    const response = await this.request<YouTrackUserGroup[]>('GET', '/groups', undefined, options);
    return response.data;
  }

  async getGroup(groupId: string, fields?: string): Promise<YouTrackUserGroup> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<YouTrackUserGroup>('GET', `/groups/${groupId}`, undefined, params);
    return response.data;
  }

  // Project Management
  async listProjects(options?: YouTrackSearchOptions): Promise<YouTrackProject[]> {
    const response = await this.request<YouTrackProject[]>('GET', '/admin/projects', undefined, options);
    return response.data;
  }

  async getProject(projectId: string, fields?: string): Promise<YouTrackProject> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<YouTrackProject>('GET', `/admin/projects/${projectId}`, undefined, params);
    return response.data;
  }

  async createProject(projectData: YouTrackCreateProjectRequest): Promise<YouTrackProject> {
    const response = await this.request<YouTrackProject>('POST', '/admin/projects', projectData);
    return response.data;
  }

  async updateProject(projectId: string, projectData: Partial<YouTrackCreateProjectRequest>): Promise<YouTrackProject> {
    const response = await this.request<YouTrackProject>('POST', `/admin/projects/${projectId}`, projectData);
    return response.data;
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.request('DELETE', `/admin/projects/${projectId}`);
  }

  async getProjectCustomFields(projectId: string, fields?: string): Promise<YouTrackCustomField[]> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<YouTrackCustomField[]>(
      'GET', 
      `/admin/projects/${projectId}/customFields`, 
      undefined, 
      params
    );
    return response.data;
  }

  // Issue Management
  async listIssues(options?: YouTrackSearchOptions): Promise<YouTrackIssue[]> {
    const response = await this.request<YouTrackIssue[]>('GET', '/issues', undefined, options);
    return response.data;
  }

  async getIssue(issueId: string, fields?: string): Promise<YouTrackIssue> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<YouTrackIssue>('GET', `/issues/${issueId}`, undefined, params);
    return response.data;
  }

  async createIssue(issueData: YouTrackCreateIssueRequest): Promise<YouTrackIssue> {
    const response = await this.request<YouTrackIssue>('POST', '/issues', issueData);
    return response.data;
  }

  async updateIssue(issueId: string, issueData: YouTrackUpdateIssueRequest): Promise<YouTrackIssue> {
    const response = await this.request<YouTrackIssue>('POST', `/issues/${issueId}`, issueData);
    return response.data;
  }

  async deleteIssue(issueId: string): Promise<void> {
    await this.request('DELETE', `/issues/${issueId}`);
  }

  async searchIssues(query: string, options?: YouTrackPaginationOptions): Promise<YouTrackIssue[]> {
    const params = { query, ...options };
    const response = await this.request<YouTrackIssue[]>('GET', '/issues', undefined, params);
    return response.data;
  }

  // Issue Comments
  async getIssueComments(issueId: string, options?: YouTrackPaginationOptions): Promise<YouTrackIssueComment[]> {
    const response = await this.request<YouTrackIssueComment[]>(
      'GET', 
      `/issues/${issueId}/comments`, 
      undefined, 
      options
    );
    return response.data;
  }

  async addComment(issueId: string, commentData: YouTrackCreateCommentRequest): Promise<YouTrackIssueComment> {
    const response = await this.request<YouTrackIssueComment>(
      'POST', 
      `/issues/${issueId}/comments`, 
      commentData
    );
    return response.data;
  }

  async updateComment(
    issueId: string, 
    commentId: string, 
    commentData: Partial<YouTrackCreateCommentRequest>
  ): Promise<YouTrackIssueComment> {
    const response = await this.request<YouTrackIssueComment>(
      'POST', 
      `/issues/${issueId}/comments/${commentId}`, 
      commentData
    );
    return response.data;
  }

  async deleteComment(issueId: string, commentId: string): Promise<void> {
    await this.request('DELETE', `/issues/${issueId}/comments/${commentId}`);
  }

  // Issue Attachments
  async getIssueAttachments(issueId: string, options?: YouTrackPaginationOptions): Promise<YouTrackIssueAttachment[]> {
    const response = await this.request<YouTrackIssueAttachment[]>(
      'GET', 
      `/issues/${issueId}/attachments`, 
      undefined, 
      options
    );
    return response.data;
  }

  async addAttachment(issueId: string, file: Buffer, filename: string): Promise<YouTrackIssueAttachment> {
    const formData = new FormData();
    formData.append('file', new Blob([file]), filename);
    
    const response = await this.client.post(`/issues/${issueId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  // Work Items (Time Tracking)
  async getWorkItems(issueId: string, options?: YouTrackPaginationOptions): Promise<YouTrackWorkItem[]> {
    const response = await this.request<YouTrackWorkItem[]>(
      'GET', 
      `/issues/${issueId}/timeTracking/workItems`, 
      undefined, 
      options
    );
    return response.data;
  }

  async addWorkItem(issueId: string, workItemData: YouTrackCreateWorkItemRequest): Promise<YouTrackWorkItem> {
    const response = await this.request<YouTrackWorkItem>(
      'POST', 
      `/issues/${issueId}/timeTracking/workItems`, 
      workItemData
    );
    return response.data;
  }

  async updateWorkItem(
    issueId: string, 
    workItemId: string, 
    workItemData: Partial<YouTrackCreateWorkItemRequest>
  ): Promise<YouTrackWorkItem> {
    const response = await this.request<YouTrackWorkItem>(
      'POST', 
      `/issues/${issueId}/timeTracking/workItems/${workItemId}`, 
      workItemData
    );
    return response.data;
  }

  async deleteWorkItem(issueId: string, workItemId: string): Promise<void> {
    await this.request('DELETE', `/issues/${issueId}/timeTracking/workItems/${workItemId}`);
  }

  // Agile Boards
  async listAgileBoards(options?: YouTrackPaginationOptions): Promise<YouTrackAgileBoard[]> {
    const response = await this.request<YouTrackAgileBoard[]>('GET', '/agiles', undefined, options);
    return response.data;
  }

  async getAgileBoard(boardId: string, fields?: string): Promise<YouTrackAgileBoard> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<YouTrackAgileBoard>('GET', `/agiles/${boardId}`, undefined, params);
    return response.data;
  }

  async createAgileBoard(boardData: Partial<YouTrackAgileBoard>): Promise<YouTrackAgileBoard> {
    const response = await this.request<YouTrackAgileBoard>('POST', '/agiles', boardData);
    return response.data;
  }

  async updateAgileBoard(boardId: string, boardData: Partial<YouTrackAgileBoard>): Promise<YouTrackAgileBoard> {
    const response = await this.request<YouTrackAgileBoard>('POST', `/agiles/${boardId}`, boardData);
    return response.data;
  }

  // Sprints
  async listSprints(boardId: string, options?: YouTrackPaginationOptions): Promise<YouTrackSprint[]> {
    const response = await this.request<YouTrackSprint[]>(
      'GET', 
      `/agiles/${boardId}/sprints`, 
      undefined, 
      options
    );
    return response.data;
  }

  async getSprint(boardId: string, sprintId: string, fields?: string): Promise<YouTrackSprint> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<YouTrackSprint>(
      'GET', 
      `/agiles/${boardId}/sprints/${sprintId}`, 
      undefined, 
      params
    );
    return response.data;
  }

  async createSprint(boardId: string, sprintData: Partial<YouTrackSprint>): Promise<YouTrackSprint> {
    const response = await this.request<YouTrackSprint>('POST', `/agiles/${boardId}/sprints`, sprintData);
    return response.data;
  }

  async updateSprint(
    boardId: string, 
    sprintId: string, 
    sprintData: Partial<YouTrackSprint>
  ): Promise<YouTrackSprint> {
    const response = await this.request<YouTrackSprint>(
      'POST', 
      `/agiles/${boardId}/sprints/${sprintId}`, 
      sprintData
    );
    return response.data;
  }

  // Tags
  async listTags(options?: YouTrackSearchOptions): Promise<YouTrackTag[]> {
    const response = await this.request<YouTrackTag[]>('GET', '/tags', undefined, options);
    return response.data;
  }

  async getTag(tagId: string, fields?: string): Promise<YouTrackTag> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<YouTrackTag>('GET', `/tags/${tagId}`, undefined, params);
    return response.data;
  }

  // Custom Fields
  async listCustomFields(options?: YouTrackPaginationOptions): Promise<YouTrackCustomField[]> {
    const response = await this.request<YouTrackCustomField[]>('GET', '/admin/customFieldSettings/customFields', undefined, options);
    return response.data;
  }

  async getCustomField(fieldId: string, fields?: string): Promise<YouTrackCustomField> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<YouTrackCustomField>(
      'GET', 
      `/admin/customFieldSettings/customFields/${fieldId}`, 
      undefined, 
      params
    );
    return response.data;
  }

  // Issue Commands & Workflow
  async applyCommand(issueId: string, command: string, comment?: string): Promise<any> {
    const data = { 
      query: command,
      ...(comment && { comment })
    };
    const response = await this.request('POST', `/issues/${issueId}/execute`, data);
    return response.data;
  }

  async getAvailableCommands(issueId: string): Promise<any[]> {
    const response = await this.request<any[]>('GET', `/issues/${issueId}/execute`);
    return response.data;
  }

  // Reports and Statistics
  async getProjectStatistics(projectId: string): Promise<any> {
    const response = await this.request('GET', `/admin/projects/${projectId}/statistics`);
    return response.data;
  }

  async generateReport(reportType: string, params?: any): Promise<any> {
    const response = await this.request('POST', `/reports/${reportType}`, params);
    return response.data;
  }

  // Utility Methods
  async ping(): Promise<boolean> {
    try {
      await this.request('GET', '/users/me');
      return true;
    } catch {
      return false;
    }
  }

  async getServerInfo(): Promise<any> {
    const response = await this.request('GET', '/config');
    return response.data;
  }
} 