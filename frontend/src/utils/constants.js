// utils/constants.js

export const THEME = {
  primary: '#8C52FF',
  primaryDark: '#3A2200',
  secondary: '#5C4016',
  lightBg: '#FDEBD0',
  cardBg: '#FFF1D1',
  accent: '#E67E22',
  textDark: '#8C52FF',
  textLight: '#FFFFFF',
  gray: '#6B7280',
  borderLight: '#FFF1D1',
};

export const COMPLAINT_CATEGORIES = [
  'Water Department',
  'Electricity Department',
  'Road Department',
  'Sanitation Department',
  'Transport Department',
  'Municipal Corporation',
  'Public Health',
  'Education Department'
];

export const CATEGORY_DISPLAY_NAMES = {
  'Water Department': '💧 Water Supply',
  'Electricity Department': '⚡ Electricity',
  'Road Department': '🛣️ Roads & Potholes',
  'Sanitation Department': '🗑️ Garbage & Cleanliness',
  'Transport Department': '🚌 Public Transport',
  'Municipal Corporation': '🏛️ Municipal Services',
  'Public Health': '🏥 Public Health',
  'Education Department': '📚 Education'
};

export const USER_ROLES = {
  CITIZEN: 'citizen',
  DEPARTMENT: 'department',
  SOLVER: 'solver'
};

export const STATUS_COLORS = {
  'pending': 'bg-yellow-100 text-yellow-800 border-yellow-400',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-400',
  'assigned': 'bg-purple-100 text-purple-800 border-purple-400',
  'rejected': 'bg-red-100 text-red-800 border-red-400',
  'resolved': 'bg-green-100 text-green-800 border-green-400',
  'completed': 'bg-emerald-100 text-emerald-800 border-emerald-400',
  'escalated': 'bg-orange-100 text-orange-800 border-orange-400'
};

export const STATUS_DISPLAY = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'assigned': 'Assigned',
  'rejected': 'Rejected',
  'resolved': 'Resolved',
  'completed': 'Completed',
  'escalated': 'Escalated'
};

export const DEFAULT_STATUS = 'pending';
export const DEFAULT_ROLE = 'citizen';

// 🔥 NEW: Priority Levels
export const PRIORITY_LEVELS = {
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
  EMERGENCY: 'EMERGENCY'
};

// 🔥 NEW: Priority Colors
export const PRIORITY_COLORS = {
  'NORMAL': 'bg-blue-100 text-blue-800 border-blue-300',
  'HIGH': 'bg-orange-100 text-orange-800 border-orange-300',
  'CRITICAL': 'bg-red-100 text-red-800 border-red-300 animate-pulse',
  'EMERGENCY': 'bg-purple-100 text-purple-800 border-purple-300'
};

// 🔥 NEW: Escalation Levels
export const ESCALATION_LEVELS = {
  1: 'Primary Department',
  2: 'Intermediate Level 1',
  3: 'Intermediate Level 2',
  4: 'Final Level - State Administration'
};

// 🔥 NEW: Department Hierarchy
export const DEPARTMENT_HIERARCHY = {
  'Water Department': { level: 1, next: 'Water Board' },
  'Water Board': { level: 2, next: 'Municipal Corporation' },
  'Municipal Corporation': { level: 3, next: 'State Administration' },
  'State Administration': { level: 4, next: null },
  
  'Electricity Department': { level: 1, next: 'Electricity Board' },
  'Electricity Board': { level: 2, next: 'Power Corporation' },
  'Power Corporation': { level: 3, next: 'State Administration' },
  
  'Road Department': { level: 1, next: 'PWD' },
  'PWD': { level: 2, next: 'Municipal Corporation' },
  
  'Sanitation Department': { level: 1, next: 'Municipal Ward Office' },
  'Municipal Ward Office': { level: 2, next: 'Municipal Corporation' }
};

export const API_MESSAGES = {
  SUCCESS: 'success',
  ERROR: 'error',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed'
};

export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  MAX_VIDEO_SIZE: 50 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime']
};

export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_WITH_TIME: 'dd MMM yyyy, hh:mm:ss a',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

export default {
  THEME,
  COMPLAINT_CATEGORIES,
  CATEGORY_DISPLAY_NAMES,
  USER_ROLES,
  STATUS_COLORS,
  STATUS_DISPLAY,
  DEFAULT_STATUS,
  DEFAULT_ROLE,
  PRIORITY_LEVELS,
  PRIORITY_COLORS,
  ESCALATION_LEVELS,
  DEPARTMENT_HIERARCHY,
  API_MESSAGES,
  FILE_LIMITS,
  DATE_FORMATS,
  PAGINATION
};