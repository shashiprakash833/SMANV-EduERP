from rest_framework.permissions import BasePermission

class IsSuperAdmin(BasePermission):
    """Allows access only to Super Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'super_admin' or request.user.is_superuser)
        )

class IsOrganizationAdmin(BasePermission):
    """Allows access only to Organization Admins or Super Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ['org_admin', 'super_admin']
        )

class IsStaffMember(BasePermission):
    """Allows access only to Staff members or Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ['staff', 'org_admin', 'super_admin']
        )

class IsStudent(BasePermission):
    """Allows access only to Students."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'student'
        )

class IsParent(BasePermission):
    """Allows access only to Parents."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'parent'
        )

class IsFinanceUser(BasePermission):
    """Allows access only to Finance & HR or Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ['finance', 'org_admin', 'super_admin']
        )

class IsOrganizationActive(BasePermission):
    """Verifies that the user's organization is active."""
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        if not request.user.organization:
            return True
        return request.user.organization.status == 'active'
