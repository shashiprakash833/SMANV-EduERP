from apps.common.permissions import IsStaffMember, IsOrganizationAdmin

class CanManageStudents(IsStaffMember):
    """Permits staff or org admins to manage student records."""
    pass
