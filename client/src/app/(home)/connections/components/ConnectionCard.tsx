"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Connection } from "@/types";
import { MessageSquare, UserMinus, Loader2 } from "lucide-react";
import Link from "next/link";
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
} from "@/components/ui/alert-dialog";
import { useRemoveConnection } from "@/features/connections/hooks";

interface ConnectionCardProps {
  connection: Connection;
}

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const { user } = connection;
  const removeConnection = useRemoveConnection();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeConnection.mutateAsync(connection.id);
    } catch {
      setIsRemoving(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border border-border/50 bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
            <AvatarImage src={user.image || undefined} alt={user.full_name} />
            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
              {user.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="font-bold text-lg leading-tight truncate max-w-[200px]">
              {user.full_name}
            </h3>
            <p className="text-sm text-primary font-medium">
              {user.headLine || user.role || "Professional"}
            </p>
            {user.bio && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2 h-8 px-2">
                {user.bio}
              </p>
            )}
          </div>

          <div className="flex gap-2 w-full pt-2">
            <Button asChild variant="outline" className="flex-1 h-9 gap-2">
              <Link href={`/messages/${user.id}`}>
                <MessageSquare className="h-4 w-4" />
                Message
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserMinus className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove connection?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove{" "}
                    <strong>{user.full_name}</strong> from your connections?
                    They will no longer be able to message you directly across
                    some channels.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemove}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
