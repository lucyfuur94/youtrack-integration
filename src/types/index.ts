// Core YouTrack entity types
export interface YouTrackUser {
  id: string;
  login: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
  ringId?: string;
  guest?: boolean;
  online?: boolean;
  banned?: boolean;
  tags?: YouTrackTag[];
  savedQueries?: YouTrackSavedQuery[];
  profiles?: {
    general?: YouTrackGeneralUserProfile;
    notifications?: YouTrackNotificationUserProfile;
    timeTracking?: YouTrackTimeTrackingUserProfile;
  };
}

export interface YouTrackProject {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  leader?: YouTrackUser;
  createdBy?: YouTrackUser;
  updatedBy?: YouTrackUser;
  created: number;
  updated: number;
  archived?: boolean;
  fromEmail?: string;
  replyToEmail?: string;
  template?: boolean;
  iconUrl?: string;
  issues?: YouTrackIssue[];
  customFields?: YouTrackProjectCustomField[];
  team?: YouTrackUser[];
  versions?: YouTrackVersionBundle[];
}

export interface YouTrackIssue {
  id: string;
  idReadable: string;
  created: number;
  updated: number;
  resolved?: number;
  numberInProject: number;
  project: YouTrackProject;
  summary: string;
  description?: string;
  reporter?: YouTrackUser;
  updater?: YouTrackUser;
  draftOwner?: YouTrackUser;
  permittedGroup?: YouTrackUserGroup;
  watchers?: YouTrackUser[];
  voters?: YouTrackUser[];
  comments?: YouTrackIssueComment[];
  attachments?: YouTrackIssueAttachment[];
  visibility?: YouTrackVisibilitySettings;
  votes: number;
  commentsCount: number;
  tags?: YouTrackTag[];
  links?: YouTrackIssueLink[];
  externalIssue?: YouTrackExternalIssue;
  customFields?: YouTrackIssueCustomField[];
  workItems?: YouTrackWorkItem[];
}

export interface YouTrackIssueComment {
  id: string;
  created: number;
  updated: number;
  text: string;
  textPreview: string;
  author?: YouTrackUser;
  issue?: YouTrackIssue;
  parentComment?: YouTrackIssueComment;
  replies?: YouTrackIssueComment[];
  deleted: boolean;
  visibility?: YouTrackVisibilitySettings;
  attachments?: YouTrackIssueAttachment[];
}

export interface YouTrackIssueAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  extension: string;
  charset?: string;
  mimeType: string;
  metaData?: string;
  draft: boolean;
  removed: boolean;
  base64Content?: string;
  author?: YouTrackUser;
  created: number;
  updated: number;
  comment?: YouTrackIssueComment;
  issue?: YouTrackIssue;
  visibility?: YouTrackVisibilitySettings;
  thumbnailURL?: string;
}

export interface YouTrackWorkItem {
  id: string;
  date: number;
  duration: YouTrackDurationValue;
  description?: string;
  text?: string;
  textPreview?: string;
  type?: YouTrackWorkItemType;
  creator?: YouTrackUser;
  author?: YouTrackUser;
  created: number;
  updated: number;
  usesMarkdown?: boolean;
  issue?: YouTrackIssue;
  visibility?: YouTrackVisibilitySettings;
}

export interface YouTrackWorkItemType {
  id: string;
  name: string;
  autoAttached: boolean;
}

export interface YouTrackDurationValue {
  id: string;
  minutes: number;
  presentation: string;
}

export interface YouTrackIssueLink {
  id: string;
  direction: 'OUTWARD' | 'INWARD' | 'BOTH';
  linkType: YouTrackIssueLinkType;
  issues: YouTrackIssue[];
  trimmedIssues: YouTrackIssue[];
}

export interface YouTrackIssueLinkType {
  id: string;
  name: string;
  localizedName?: string;
  sourceToTarget: string;
  localizedSourceToTarget?: string;
  targetToSource: string;
  localizedTargetToSource?: string;
  directed: boolean;
  aggregation: boolean;
  readOnly: boolean;
}

export interface YouTrackTag {
  id: string;
  name: string;
  query?: string;
  color?: YouTrackFieldStyle;
  untagOnResolve: boolean;
  updateableBy?: YouTrackUserGroup;
  visibleFor?: YouTrackUserGroup;
  owner?: YouTrackUser;
  issues?: YouTrackIssue[];
}

export interface YouTrackUserGroup {
  id: string;
  name: string;
  description?: string;
  ringId?: string;
  usersCount: number;
  icon?: string;
  allUsersGroup: boolean;
  teamGroup: boolean;
  autoJoin: boolean;
}

export interface YouTrackCustomField {
  id: string;
  name: string;
  localizedName?: string;
  fieldType: YouTrackFieldType;
  isPublic: boolean;
  readOnly: boolean;
  autoAttached: boolean;
  ordinal: number;
  aliases?: string;
  fieldDefaults?: YouTrackCustomFieldDefaults;
  hasRunningJob: boolean;
  isUpdateable: boolean;
  instances?: YouTrackProjectCustomField[];
}

export interface YouTrackProjectCustomField {
  id: string;
  field: YouTrackCustomField;
  project: YouTrackProject;
  canBeEmpty: boolean;
  emptyFieldText?: string;
  ordinal: number;
  isPublic: boolean;
  hasRunningJob: boolean;
  bundle?: YouTrackBundle;
}

export interface YouTrackIssueCustomField {
  id: string;
  name: string;
  value?: any;
  projectCustomField: YouTrackProjectCustomField;
}

export interface YouTrackFieldType {
  id: string;
  presentation: string;
  valueType: string;
}

export interface YouTrackBundle {
  id: string;
  isUpdateable: boolean;
  values?: YouTrackBundleElement[];
}

export interface YouTrackBundleElement {
  id: string;
  name: string;
  description?: string;
  ordinal: number;
  color?: YouTrackFieldStyle;
  isResolved?: boolean;
  owner?: YouTrackUser;
  released?: boolean;
  archived?: boolean;
  releaseDate?: number;
  localizedName?: string;
}

export interface YouTrackVersionBundle extends YouTrackBundle {
  versions?: YouTrackVersionBundleElement[];
}

export interface YouTrackVersionBundleElement extends YouTrackBundleElement {
  released: boolean;
  archived: boolean;
  releaseDate?: number;
}

export interface YouTrackFieldStyle {
  id: string;
  background: string;
  foreground: string;
}

export interface YouTrackSavedQuery {
  id: string;
  name: string;
  query: string;
  owner?: YouTrackUser;
  visibleFor?: YouTrackUserGroup;
  updateableBy?: YouTrackUserGroup;
  issues?: YouTrackIssue[];
}

export interface YouTrackAgileBoard {
  id: string;
  name: string;
  favorite: boolean;
  projects: YouTrackProject[];
  createdBy?: YouTrackUser;
  updatedBy?: YouTrackUser;
  created: number;
  updated: number;
  columns?: YouTrackBoardColumn[];
  sprints?: YouTrackSprint[];
  currentSprint?: YouTrackSprint;
  sprintsSettings?: YouTrackSprintsSettings;
  estimationField?: YouTrackCustomField;
  originalEstimationField?: YouTrackCustomField;
  orphansAtTheTop: boolean;
  hideOrphansSwimlane: boolean;
  trimSwimlanes: boolean;
  columnSettings?: YouTrackColumnSettings;
}

export interface YouTrackBoardColumn {
  id: string;
  collapsed: boolean;
  isVisible: boolean;
  ordinal: number;
  parent?: YouTrackBoardColumn;
  presentation: string;
  fieldValues?: YouTrackBundleElement[];
}

export interface YouTrackSprint {
  id: string;
  name: string;
  goal?: string;
  start?: number;
  finish?: number;
  archived: boolean;
  isDefault: boolean;
  board?: YouTrackAgileBoard;
  issues?: YouTrackIssue[];
  unresolvedIssuesCount: number;
  previousSprint?: YouTrackSprint;
}

export interface YouTrackSprintsSettings {
  disableSprints: boolean;
  hideSubtasksOfCards: boolean;
  cardOnSeveralSprints: boolean;
  explicitQuery?: string;
  sprintSyncField?: YouTrackCustomField;
  defaultSprint?: YouTrackSprint;
}

export interface YouTrackColumnSettings {
  field?: YouTrackCustomField;
  columns?: YouTrackBoardColumn[];
}

export interface YouTrackExternalIssue {
  id: string;
  name: string;
  url?: string;
  key?: string;
}

export interface YouTrackVisibilitySettings {
  id: string;
  permittedGroups?: YouTrackUserGroup[];
  permittedUsers?: YouTrackUser[];
}

export interface YouTrackNotificationUserProfile {
  id: string;
  emailNotifications: boolean;
  jabberNotifications: boolean;
  mentionNotifications: boolean;
  duplicateClusterNotifications: boolean;
  mailboxIntegration: boolean;
  usePlainTextEmails: boolean;
  emailForTags?: string;
}

export interface YouTrackGeneralUserProfile {
  id: string;
  star?: string;
  useAbsoluteDates: boolean;
  dateFieldFormat?: YouTrackDateFieldFormat;
  appearance?: YouTrackAppearanceSettings;
  naturalCommentsOrder: boolean;
  searchContext?: YouTrackUserSearchContext;
  timezone?: YouTrackTimeZoneSettings;
  locale?: YouTrackLocaleSettings;
}

export interface YouTrackTimeTrackingUserProfile {
  id: string;
  timeFormat?: YouTrackTimeFormat;
}

export interface YouTrackDateFieldFormat {
  datePattern: string;
  pattern: string;
  presentation: string;
}

export interface YouTrackAppearanceSettings {
  id: string;
  liteUi: boolean;
  naturalCommentsOrder: boolean;
  showSimilarIssues: boolean;
  useAbsoluteDates: boolean;
  showPropertiesOnTheLeft: boolean;
}

export interface YouTrackUserSearchContext {
  id: string;
  query?: string;
  folder?: YouTrackSavedQuery;
  pinned: boolean;
}

export interface YouTrackTimeZoneSettings {
  id: string;
  presentation: string;
  offset: number;
}

export interface YouTrackLocaleSettings {
  id: string;
  language: string;
  country?: string;
  locale: string;
}

export interface YouTrackTimeFormat {
  id: string;
  pattern: string;
  presentation: string;
}

export interface YouTrackCustomFieldDefaults {
  id: string;
  canBeEmpty: boolean;
  emptyFieldText?: string;
  isPublic: boolean;
}

// API Request/Response types
export interface YouTrackApiConfig {
  baseUrl: string;
  token?: string;
  username?: string;
  password?: string;
  timeout?: number;
  maxRetries?: number;
  debug?: boolean;
}

export interface YouTrackApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface YouTrackListResponse<T> {
  items: T[];
  hasMore?: boolean;
  skip?: number;
  top?: number;
  total?: number;
}

export interface YouTrackSearchRequest {
  query?: string;
  filter?: Record<string, any>;
  sort?: string[];
  skip?: number;
  top?: number;
  fields?: string;
}

export interface YouTrackCreateIssueRequest {
  project: string | { id: string };
  summary: string;
  description?: string;
  assignee?: string | { id: string };
  reporter?: string | { id: string };
  priority?: string | { id: string };
  type?: string | { id: string };
  state?: string | { id: string };
  fixVersion?: string | { id: string };
  affectedVersion?: string | { id: string };
  component?: string | { id: string };
  tags?: string[] | { id: string }[];
  customFields?: YouTrackCustomFieldUpdate[];
  visibility?: YouTrackVisibilitySettings;
  watchers?: string[] | { id: string }[];
}

export interface YouTrackUpdateIssueRequest {
  summary?: string;
  description?: string;
  assignee?: string | { id: string } | null;
  reporter?: string | { id: string };
  priority?: string | { id: string };
  type?: string | { id: string };
  state?: string | { id: string };
  fixVersion?: string | { id: string };
  affectedVersion?: string | { id: string };
  component?: string | { id: string };
  tags?: string[] | { id: string }[];
  customFields?: YouTrackCustomFieldUpdate[];
  visibility?: YouTrackVisibilitySettings;
  watchers?: string[] | { id: string }[];
}

export interface YouTrackCustomFieldUpdate {
  name: string;
  value: any;
}

export interface YouTrackCreateCommentRequest {
  text: string;
  usesMarkdown?: boolean;
  visibility?: YouTrackVisibilitySettings;
  replyTo?: string;
}

export interface YouTrackCreateWorkItemRequest {
  duration: number | string; // minutes or duration string like "1h 30m"
  date?: number; // timestamp
  description?: string;
  text?: string;
  type?: string | { id: string };
  usesMarkdown?: boolean;
  visibility?: YouTrackVisibilitySettings;
}

export interface YouTrackCreateProjectRequest {
  name: string;
  shortName: string;
  description?: string;
  leader?: string | { id: string };
  archived?: boolean;
  template?: boolean;
  fromEmail?: string;
  replyToEmail?: string;
}

export interface YouTrackError {
  error: string;
  error_description?: string;
  error_type?: string;
  localizedError?: string;
  localizedErrorDescription?: string;
}

// Tool-specific types for MCP
export interface YouTrackToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface YouTrackPaginationOptions {
  skip?: number;
  top?: number;
  fields?: string;
}

export interface YouTrackSearchOptions extends YouTrackPaginationOptions {
  query?: string;
  sort?: string;
} 