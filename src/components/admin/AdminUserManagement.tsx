import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users, Loader2, ShieldPlus, ShieldMinus, RefreshCw, Search, ChevronDown, Shield, UserCog } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const USERS_PER_PAGE = 10;

type AppRole = 'admin' | 'moderator' | 'user';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  email: string | null;
  roles: AppRole[];
}

export const AdminUserManagement = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [isSyncingEmails, setIsSyncingEmails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'moderator' | 'user'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<{ action: 'add' | 'remove'; role: AppRole } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  // Clear selection when page changes
  useEffect(() => {
    setSelectedUsers(new Set());
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      // Fetch all roles
      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (roleError) throw roleError;

      // Group roles by user
      const userRolesMap = new Map<string, AppRole[]>();
      (roles || []).forEach(r => {
        const existing = userRolesMap.get(r.user_id) || [];
        existing.push(r.role as AppRole);
        userRolesMap.set(r.user_id, existing);
      });

      const usersWithRoles = (profiles || []).map(profile => ({
        ...profile,
        roles: userRolesMap.get(profile.user_id) || [],
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addRole = async (userId: string, role: AppRole, userName: string) => {
    setUpdatingUserId(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast({
        title: "Role Added",
        description: `${userName || 'User'} is now a ${role}.`,
      });
      fetchUsers();
    } catch (error: any) {
      console.error('Error adding role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add role.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const removeRole = async (userId: string, role: AppRole, userName: string) => {
    setUpdatingUserId(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: "Role Removed",
        description: `${userName || 'User'} is no longer a ${role}.`,
      });
      fetchUsers();
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove role.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const syncEmails = async () => {
    setIsSyncingEmails(true);
    try {
      const { error } = await supabase.rpc('sync_profile_emails');

      if (error) throw error;

      toast({
        title: "Emails Synced",
        description: "User emails have been updated from authentication data.",
      });
      fetchUsers();
    } catch (error: any) {
      console.error('Error syncing emails:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sync emails.",
        variant: "destructive",
      });
    } finally {
      setIsSyncingEmails(false);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.size === 0) return;
    
    setIsBulkUpdating(true);
    const userIds = Array.from(selectedUsers);
    const { action, role } = bulkAction;

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const userId of userIds) {
        // Skip current user
        if (userId === currentUser?.id) continue;

        const user = users.find(u => u.user_id === userId);
        if (!user) continue;

        const hasRole = user.roles.includes(role);
        
        if (action === 'add' && !hasRole) {
          const { error } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role });
          if (error) errorCount++;
          else successCount++;
        } else if (action === 'remove' && hasRole) {
          const { error } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', userId)
            .eq('role', role);
          if (error) errorCount++;
          else successCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Bulk Action Complete",
          description: `${action === 'add' ? 'Added' : 'Removed'} ${role} role for ${successCount} user(s).${errorCount > 0 ? ` ${errorCount} failed.` : ''}`,
        });
      }

      setSelectedUsers(new Set());
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Bulk action failed.",
        variant: "destructive",
      });
    } finally {
      setIsBulkUpdating(false);
      setBulkDialogOpen(false);
      setBulkAction(null);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleAllOnPage = () => {
    const pageUserIds = paginatedUsers
      .filter(u => u.user_id !== currentUser?.id)
      .map(u => u.user_id);
    
    const allSelected = pageUserIds.every(id => selectedUsers.has(id));
    
    if (allSelected) {
      const newSelected = new Set(selectedUsers);
      pageUserIds.forEach(id => newSelected.delete(id));
      setSelectedUsers(newSelected);
    } else {
      const newSelected = new Set(selectedUsers);
      pageUserIds.forEach(id => newSelected.add(id));
      setSelectedUsers(newSelected);
    }
  };

  const getRoleBadge = (roles: AppRole[]) => {
    if (roles.includes('admin')) {
      return <Badge variant="default">Admin</Badge>;
    }
    if (roles.includes('moderator')) {
      return <Badge variant="outline" className="border-primary text-primary">Moderator</Badge>;
    }
    return <Badge variant="secondary">User</Badge>;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'admin' && user.roles.includes('admin')) ||
      (roleFilter === 'moderator' && user.roles.includes('moderator')) ||
      (roleFilter === 'user' && user.roles.length === 0);

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  const selectableOnPage = paginatedUsers.filter(u => u.user_id !== currentUser?.id);
  const allPageSelected = selectableOnPage.length > 0 && selectableOnPage.every(u => selectedUsers.has(u.user_id));
  const somePageSelected = selectableOnPage.some(u => selectedUsers.has(u.user_id));

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View all registered users and manage roles</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={syncEmails}
            disabled={isSyncingEmails}
          >
            {isSyncingEmails ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync Emails
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={(value: 'all' | 'admin' | 'moderator' | 'user') => setRoleFilter(value)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="moderator">Moderators</SelectItem>
              <SelectItem value="user">Users</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.size > 0 && (
          <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">
              {selectedUsers.size} user(s) selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isBulkUpdating}>
                  {isBulkUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => {
                  setBulkAction({ action: 'add', role: 'admin' });
                  setBulkDialogOpen(true);
                }}>
                  <ShieldPlus className="h-4 w-4 mr-2" />
                  Add Admin Role
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setBulkAction({ action: 'add', role: 'moderator' });
                  setBulkDialogOpen(true);
                }}>
                  <UserCog className="h-4 w-4 mr-2" />
                  Add Moderator Role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    setBulkAction({ action: 'remove', role: 'admin' });
                    setBulkDialogOpen(true);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <ShieldMinus className="h-4 w-4 mr-2" />
                  Remove Admin Role
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setBulkAction({ action: 'remove', role: 'moderator' });
                    setBulkDialogOpen(true);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Remove Moderator Role
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUsers(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        )}

        {/* Bulk Action Confirmation Dialog */}
        <AlertDialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {bulkAction?.action === 'add' ? 'Add' : 'Remove'} {bulkAction?.role} Role?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will {bulkAction?.action === 'add' ? 'add' : 'remove'} the{' '}
                <strong>{bulkAction?.role}</strong> role {bulkAction?.action === 'add' ? 'to' : 'from'}{' '}
                {selectedUsers.size} selected user(s). Your own account will be skipped.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkAction}
                className={bulkAction?.action === 'remove' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
              >
                {bulkAction?.action === 'add' ? 'Add Role' : 'Remove Role'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {users.length === 0
                ? 'No registered users yet.'
                : 'No users match your search criteria.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allPageSelected}
                        onCheckedChange={toggleAllOnPage}
                        aria-label="Select all users on page"
                        className={somePageSelected && !allPageSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => {
                    const isCurrentUser = user.user_id === currentUser?.id;
                    const isUpdating = updatingUserId === user.user_id;
                    const isSelected = selectedUsers.has(user.user_id);

                    return (
                      <TableRow key={user.id} className={isSelected ? 'bg-muted/50' : ''}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleUserSelection(user.user_id)}
                            disabled={isCurrentUser}
                            aria-label={`Select ${user.full_name || 'user'}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span>{user.full_name || 'Not provided'}</span>
                              {isCurrentUser && (
                                <span className="text-xs text-muted-foreground">(You)</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email || 'Not provided'}
                        </TableCell>
                        <TableCell>{user.phone || 'Not provided'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {getRoleBadge(user.roles)}
                            {user.roles.includes('admin') && user.roles.includes('moderator') && (
                              <Badge variant="outline" className="border-primary text-primary">Moderator</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {isCurrentUser ? (
                            <span className="text-xs text-muted-foreground">Cannot modify own role</span>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" disabled={isUpdating}>
                                  {isUpdating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <Shield className="h-4 w-4 mr-1" />
                                      Manage Roles
                                      <ChevronDown className="h-3 w-3 ml-1" />
                                    </>
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!user.roles.includes('admin') ? (
                                  <DropdownMenuItem onClick={() => addRole(user.user_id, 'admin', user.full_name || '')}>
                                    <ShieldPlus className="h-4 w-4 mr-2" />
                                    Add Admin
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => removeRole(user.user_id, 'admin', user.full_name || '')}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <ShieldMinus className="h-4 w-4 mr-2" />
                                    Remove Admin
                                  </DropdownMenuItem>
                                )}
                                {!user.roles.includes('moderator') ? (
                                  <DropdownMenuItem onClick={() => addRole(user.user_id, 'moderator', user.full_name || '')}>
                                    <UserCog className="h-4 w-4 mr-2" />
                                    Add Moderator
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => removeRole(user.user_id, 'moderator', user.full_name || '')}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <UserCog className="h-4 w-4 mr-2" />
                                    Remove Moderator
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(startIndex + USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {getPageNumbers().map((page, index) =>
                      page === 'ellipsis' ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
