
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ChevronDown, ChevronUp, RefreshCw, Download } from "lucide-react";

interface LogItem {
  message: string;
  timestamp: string;
  type: 'info' | 'error' | 'warning' | 'success' | 'api';
}

interface LogPanelProps {
  logs: LogItem[];
  title?: string;
  onClearLogs?: () => void;
}

export function LogPanel({ logs, title = "API Data Logs", onClearLogs }: LogPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollAreaRef.current && isExpanded) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [logs, isExpanded]);
  
  // Download logs as JSON
  const handleDownloadLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `temp-humidity-logs-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };
  
  // Get log type color
  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'api': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Filter logs by type
  const filteredLogs = filter 
    ? logs.filter(log => log.type === filter)
    : logs;
  
  return (
    <Card className="shadow-sm border border-gray-200 mb-8">
      <CardHeader className="px-4 py-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge variant="outline" className="ml-2">
            {logs.length} entries
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Filter buttons */}
          <div className="flex gap-1 mr-2">
            <Badge 
              variant="outline" 
              className={`cursor-pointer ${filter === 'info' ? 'bg-gray-100' : ''}`}
              onClick={() => setFilter(filter === 'info' ? null : 'info')}
            >
              Info
            </Badge>
            <Badge 
              variant="outline" 
              className={`cursor-pointer ${filter === 'api' ? 'bg-blue-100' : ''}`}
              onClick={() => setFilter(filter === 'api' ? null : 'api')}
            >
              API
            </Badge>
            <Badge 
              variant="outline" 
              className={`cursor-pointer ${filter === 'error' ? 'bg-red-100' : ''}`}
              onClick={() => setFilter(filter === 'error' ? null : 'error')}
            >
              Errors
            </Badge>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={handleDownloadLogs}
            title="Download logs"
          >
            <Download size={14} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={() => onClearLogs?.()}
            title="Clear logs"
          >
            <X size={14} />
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="px-4 py-0 pb-4">
          <ScrollArea ref={scrollAreaRef} className="h-64 w-full">
            <div className="space-y-1 pt-2">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500">
                  No logs available
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`text-xs p-1.5 rounded ${getLogTypeColor(log.type)} font-mono mb-1 whitespace-pre-wrap`}
                  >
                    <span className="opacity-75">[{log.timestamp}]</span> {log.message}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
