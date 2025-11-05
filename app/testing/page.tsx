"use client";

import { useSocket } from "@/contexts/SocketContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function RealTimeUserDashboard() {
  const { isConnected, newUsers } = useSocket();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Recent Registrations
              <Badge 
                variant={isConnected ? "default" : "secondary"}
                className={isConnected ? "bg-green-500" : "bg-gray-500"}
              >
                {isConnected ? "Live" : "Offline"}
              </Badge>
            </CardTitle>
            <CardDescription>
              New users appear here in real-time without page refresh
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {newUsers.length} new
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {newUsers.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="text-muted-foreground mb-2">No recent registrations</div>
            <div className="text-sm text-muted-foreground">
              New users will appear here automatically
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto p-2">
            {newUsers.map((userData, index) => (
              <div
                key={`${userData.user.id}-${index}`}
                className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(userData.user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {userData.user.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(userData.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userData.user.email}
                  </p>
                </div>
                
                <Badge variant="secondary" className="ml-auto">
                  New
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}