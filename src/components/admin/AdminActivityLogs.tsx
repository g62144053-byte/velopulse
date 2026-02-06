import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Activity, Loader2, RefreshCw, ShieldPlus, ShieldMinus, UserCog } from 'lucide-react';
import { format } from 'date-fns';

const LOGS_PER_PAGE = 15;

interface ActivityLog {
  id: string;
  actor_id: string;
  action: string;
  target_user_id: string | null;
  target_user_name: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  actor_name?: string;
}

export const AdminActivityLogs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [actionFilter]);

  const fetchLogs = async () => {
    try {
      // Fetch activity logs
      const { data: logsData, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;

      // Fetch actor names from profiles
      const actorIds = [...new Set((logsData || []).map(l => l.actor_id))];
      
      let actorNames: Record<string, string> = {};
      if (actorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', actorIds);
        
        (profiles || []).forEach(p => {
          actorNames[p.user_id] = p.full_name || 'Unknown';
        });
      }

      const logsWithActors: ActivityLog[] = (logsData || []).map(log => ({
        id: log.id,
        actor_id: log.actor_id,
        action: log.action,
        target_user_id: log.target_user_id,
        target_user_name: log.target_user_name,
        details: log.details as Record<string, unknown> | null,
        created_at: log.created_at,
        actor_name: actorNames[log.actor_id] || 'Unknown',
      }));

      setLogs(logsWithActors);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activity logs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'role_added':
        return <ShieldPlus className="h-4 w-4 text-primary" />;
      case 'role_removed':
        return <ShieldMinus className="h-4 w-4 text-destructive" />;
      case 'bulk_role_added':
        return <UserCog className="h-4 w-4 text-primary" />;
      case 'bulk_role_removed':
        return <UserCog className="h-4 w-4 text-destructive" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'role_added':
        return <Badge variant="outline" className="border-primary/50 text-primary">Role Added</Badge>;
      case 'role_removed':
        return <Badge variant="destructive">Role Removed</Badge>;
      case 'bulk_role_added':
        return <Badge variant="outline" className="border-primary/50 text-primary">Bulk Add</Badge>;
      case 'bulk_role_removed':
        return <Badge variant="destructive">Bulk Remove</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  const getActionDescription = (log: ActivityLog) => {
    const details = log.details as Record<string, unknown> | null;
    const role = (details?.role as string) || 'unknown';
    const targetName = log.target_user_name || 'Unknown user';
    const bulkCount = details?.bulk_count as number | undefined;

    switch (log.action) {
      case 'role_added':
        return `Added ${role} role to ${targetName}`;
      case 'role_removed':
        return `Removed ${role} role from ${targetName}`;
      case 'bulk_role_added':
        return `Added ${role} role to ${bulkCount} user(s)`;
      case 'bulk_role_removed':
        return `Removed ${role} role from ${bulkCount} user(s)`;
      default:
        return log.action;
    }
  };

  const filteredLogs = logs.filter(log => {
    if (actionFilter === 'all') return true;
    return log.action === actionFilter;
  });

  const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + LOGS_PER_PAGE);

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
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>Track admin actions and role changes</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              fetchLogs();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="role_added">Role Added</SelectItem>
              <SelectItem value="role_removed">Role Removed</SelectItem>
              <SelectItem value="bulk_role_added">Bulk Role Added</SelectItem>
              <SelectItem value="bulk_role_removed">Bulk Role Removed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {logs.length === 0
                ? 'No activity logs yet.'
                : 'No logs match your filter criteria.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {getActionIcon(log.action)}
                      </TableCell>
                      <TableCell>
                        {getActionBadge(log.action)}
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        {getActionDescription(log)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {log.actor_name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{log.actor_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(startIndex + LOGS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length} logs
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
