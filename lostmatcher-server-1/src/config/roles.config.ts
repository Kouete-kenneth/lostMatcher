export type Role = 'user' | 'moderator' | 'admin';

const userPermissions = [
    'createLostReport',      // Submit a report for a lost item
    'createFoundReport',     // Submit a report for a found item
    'viewMatches',           // View matched items
    'updateOwnReport',       // Update their own reports
    'deleteOwnReport'        // Delete their own reports
];

const moderatorPermissions = [
    ...userPermissions,
    'reviewReports',         // Review and verify reports
    'resolveMatches',        // Mark matches as resolved
    'manageComments'         // Moderate comments on reports
];

const adminPermissions = [
    ...moderatorPermissions,
    'manageUsers',           // Manage user accounts
    'manageAllReports',      // Edit/delete any report
    'viewStatistics'         // View app statistics and analytics
];

const allRoles: Record<Role, string[]> = {
    user: userPermissions,
    moderator: moderatorPermissions,
    admin: adminPermissions
};

const roles: Role[] = Object.keys(allRoles) as Role[];
const roleRights: Map<Role, string[]> = new Map(Object.entries(allRoles) as [Role, string[]][]);

const getPermissions = (role: Role): string[] => {
    return allRoles[role];
};

export { roles, roleRights, getPermissions };
