import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectionsApi } from "@/lib/api";
import { toast } from "sonner";

export function useSendConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: number) => connectionsApi.sendRequest(receiverId),
    onSuccess: () => {
      toast.success("Connection request sent!");
      // Invalidate random employers so the user doesn't show up again or status updates
      queryClient.invalidateQueries({ queryKey: ["random-employers"] });
      queryClient.invalidateQueries({ queryKey: ["connection-requests"] });
    },
    onError: (error: unknown) => {
      // Extract error message from axios error
      const err = error as { response?: { data?: { error?: string } } };
      const message = err.response?.data?.error || "Failed to send request";
      toast.error(message);
    },
  });
}

export function useConnectionRequests() {
  return useQuery({
    queryKey: ["connection-requests"],
    queryFn: () => connectionsApi.getAll(),
  });
}

export function useAcceptConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: number) => connectionsApi.accept(requestId),
    onSuccess: () => {
      toast.success("Connection accepted!");
      queryClient.invalidateQueries({ queryKey: ["connection-requests"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => toast.error("Failed to accept connection"),
  });
}

export function useRejectConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: number) => connectionsApi.reject(requestId),
    onSuccess: () => {
      toast.success("Connection rejected");
      queryClient.invalidateQueries({ queryKey: ["connection-requests"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => toast.error("Failed to reject connection"),
  });
}
