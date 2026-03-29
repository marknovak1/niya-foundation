import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Shield, ShieldCheck, User, UserPlus, UserMinus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/i18n";

type AppRole = "admin" | "moderator" | "user";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: AppRole[];
}

interface UserManagementProps {
  isAdmin: boolean;
  isModerator?: boolean;
}

export function UserManagement({ isAdmin, isModerator = false }: UserManagementProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>("moderator");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      toast.error("Failed to fetch users");
      setLoading(false);
      return;
    }

    // Fetch all roles
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      toast.error("Failed to fetch roles");
      setLoading(false);
      return;
    }

    // Map roles to users
    const usersWithRoles: UserProfile[] = (profiles || []).map((profile) => ({
      ...profile,
      roles: (roles || [])
        .filter((r) => r.user_id === profile.user_id)
        .map((r) => r.role as AppRole),
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const manageRole = async (targetUserId: string, role: AppRole, action: "add" | "remove") => {
    setActionLoading(`${targetUserId}-${role}-${action}`);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-user-roles`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            targetUserId,
            role,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchUsers();
      } else {
        toast.error(result.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (targetUserId: string, userName: string) => {
    setActionLoading(`${targetUserId}-delete`);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-user-roles`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "delete_user",
            targetUserId,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(`User "${userName}" deleted successfully`);
        fetchUsers();
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "moderator":
        return "default";
      default:
        return "secondary";
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-3 w-3" />;
      case "moderator":
        return <Shield className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t.admin.users.title}
        </CardTitle>
        <CardDescription>
          {t.admin.users.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.contacts.name}</TableHead>
                <TableHead>{t.admin.contacts.email}</TableHead>
                <TableHead>{t.admin.contacts.date}</TableHead>
                <TableHead>{t.admin.users.role}</TableHead>
                <TableHead>{t.admin.common.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || "-"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant={getRoleBadgeVariant(role)}
                              className="flex items-center gap-1"
                            >
                              {getRoleIcon(role)}
                              {t.admin.users.roles[role as keyof typeof t.admin.users.roles]}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">-</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <>
                            <Select
                              value={selectedRole}
                              onValueChange={(value) => setSelectedRole(value as AppRole)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">{t.admin.users.roles.admin}</SelectItem>
                                <SelectItem value="moderator">{t.admin.users.roles.moderator}</SelectItem>
                                <SelectItem value="user">{t.admin.users.roles.user}</SelectItem>
                              </SelectContent>
                            </Select>
                            {!user.roles.includes(selectedRole) ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => manageRole(user.user_id, selectedRole, "add")}
                                disabled={actionLoading === `${user.user_id}-${selectedRole}-add`}
                              >
                                {actionLoading === `${user.user_id}-${selectedRole}-add` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserPlus className="h-4 w-4" />
                                )}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => manageRole(user.user_id, selectedRole, "remove")}
                                disabled={actionLoading === `${user.user_id}-${selectedRole}-remove`}
                              >
                                {actionLoading === `${user.user_id}-${selectedRole}-remove` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserMinus className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </>
                        )}
                        {/* Delete button: admins can delete non-admins, moderators can delete non-admins */}
                        {(isAdmin || isModerator) && !user.roles.includes("admin") && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                disabled={actionLoading === `${user.user_id}-delete`}
                              >
                                {actionLoading === `${user.user_id}-delete` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t.admin.users.deleteUser}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t.admin.users.deleteUserConfirm}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t.admin.common.cancel}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUser(user.user_id, user.full_name || user.email)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {t.admin.common.delete}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        {!isAdmin && !isModerator && (
                          <span className="text-sm text-muted-foreground">{t.admin.users.viewOnly}</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
