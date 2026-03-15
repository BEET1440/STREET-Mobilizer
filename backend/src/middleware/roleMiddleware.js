/**
 * Role-Based Access Control (RBAC) Middleware
 * Defines which roles can perform which actions.
 */

const ROLES = {
  ADMIN: 'admin',
  FIELD_OFFICER: 'field_officer',
  SOCIAL_WORKER: 'social_worker',
  NGO_ADMIN: 'ngo_admin',
  GOV_AGENT: 'gov_agent',
  SHELTER_STAFF: 'shelter_staff',
  HOSPITAL_STAFF: 'hospital_staff',
};

// Define permissions for each role
const PERMISSIONS = {
  [ROLES.ADMIN]: ['read', 'write', 'update', 'delete', 'view_audit', 'add_intervention'],
  [ROLES.NGO_ADMIN]: ['read', 'write', 'update', 'view_audit', 'add_intervention'],
  [ROLES.FIELD_OFFICER]: ['read', 'write'],
  [ROLES.SOCIAL_WORKER]: ['read', 'update', 'add_intervention'],
  [ROLES.GOV_AGENT]: ['read', 'view_audit'],
  [ROLES.SHELTER_STAFF]: ['read', 'add_intervention'],
  [ROLES.HOSPITAL_STAFF]: ['read', 'add_intervention'],
};

/**
 * Middleware to check if user has required permission
 * @param {string} requiredPermission 
 */
exports.authorize = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    const userPermissions = PERMISSIONS[req.user.role] || [];
    
    if (userPermissions.includes(requiredPermission) || req.user.role === ROLES.ADMIN) {
      next();
    } else {
      res.status(403).json({ 
        message: `Permission denied. Your role (${req.user.role}) does not have '${requiredPermission}' access.` 
      });
    }
  };
};

exports.ROLES = ROLES;
