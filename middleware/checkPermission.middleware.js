import { permissions } from '../utils/permissions.js';

export const checkPermission = (action) => {
    return (req, res, next) => {
        console.log("in checkPermission middleware");

        const role = req.userRole; // from verifyToken


        if (!role) {
            // return res.status(403).json({ success: false, message: "Role not found in token" });
            return res.status(403).json({ success: false, message: "Unathorized- Role not found in token!" });

        }

        const allowedActions = permissions[role];
        console.log("allowedActions--", allowedActions);

        if (!allowedActions || !allowedActions.includes(action)) {
            return res.status(403).json({ success: false, message: `Access denied: ${role} cannot perform ${action}` })
        }

        next();
    };
};