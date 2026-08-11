import { useState } from 'react';
import { motion } from 'motion/react';
import { History, Search, Filter, Download, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAppStore } from '../../store/AppStore';
import { toast } from 'sonner@2.0.3';

export function ActivityLog() {
  const { activityLogs } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Details', 'Type'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.details,
        log.type
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Activity log exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-48 rounded-xl overflow-hidden glass-effect border border-border"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1554224311-beee910c1025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXIlMjBub3RlYm9vayUyMGpvdXJuYWx8ZW58MXx8fHwxNzYwNDM3MjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-8 h-8 text-[#d4af37]" />
            <h1 className="neon-text">Activity Log & Audit Trail</h1>
          </div>
          <p className="text-muted-foreground">
            Complete history of all system activities and changes
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Activities', value: activityLogs.length, color: '#d4af37' },
          {
            label: 'Info',
            value: activityLogs.filter(l => l.type === 'info').length,
            color: '#3b82f6',
          },
          {
            label: 'Success',
            value: activityLogs.filter(l => l.type === 'success').length,
            color: '#10b981',
          },
          {
            label: 'Warnings',
            value: activityLogs.filter(l => l.type === 'warning').length,
            color: '#f59e0b',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-border">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl mt-2" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="glass-effect border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportLogs}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="glass-effect border-border">
        <CardContent className="p-6">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No activity logs found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log, index) => {
                const { date, time } = formatTimestamp(log.timestamp);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex gap-4 p-4 rounded-lg glass-effect hover:neon-glow transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColor(log.type)}`}>
                        {getIcon(log.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#d4af37]">{log.action}</span>
                            <Badge variant="outline" className="text-xs">
                              {log.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>By {log.user}</span>
                            <span>•</span>
                            <span>{date} at {time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
