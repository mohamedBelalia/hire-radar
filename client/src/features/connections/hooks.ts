import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        onError: (error: any) => {
            // Extract error message from axios error
            const message = error.response?.data?.error || "Failed to send request";
            toast.error(message);
        },
    });
}
