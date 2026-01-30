import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { type ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
    requireApproval?: boolean;
}

const ProtectedRoute = ({ children, allowedRoles, requireApproval = false }: ProtectedRouteProps) => {
    const user = authService.getCurrentUser();

    // If not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        switch (user.role) {
            case 'STUDENT':
                if (allowedRoles.includes('INSTRUCTOR')) {
                    return <Navigate to="/instructor/apply" replace />;
                }
                return <Navigate to="/dashboard" replace />;
            case 'INSTRUCTOR':
                // Check if instructor is approved
                if (user.isApproved) {
                    return <Navigate to="/instructor" replace />;
                } else {
                    return <Navigate to="/instructor/apply" replace />;
                }
            case 'ADMIN':
                return <Navigate to="/admin" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    // For instructor routes, check approval status
    if (requireApproval && user.role === 'INSTRUCTOR' && !user.isApproved) {
        return <Navigate to="/instructor/apply" replace />;
    }

    // User is authorized
    return <>{children}</>;
};

export default ProtectedRoute;
