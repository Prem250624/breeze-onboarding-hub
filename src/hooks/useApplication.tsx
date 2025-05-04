
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export type ApplicationStatus = "pending" | "under_review" | "interview_scheduled" | "selected" | "rejected";

interface ApplicationData {
  status?: ApplicationStatus;
  has_agreed_to_terms?: boolean;
  interview_date?: string | null;
  admin_notes?: string | null;
}

export const useApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchApplication = async () => {
    if (!user?.id) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    return data;
  };

  const applicationQuery = useQuery({
    queryKey: ["application", user?.id],
    queryFn: fetchApplication,
    enabled: !!user?.id,
  });

  const updateApplication = useMutation({
    mutationFn: async (applicationData: ApplicationData) => {
      if (!user?.id) throw new Error("User not authenticated");

      const updateData = {
        ...applicationData,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("applications")
        .update(updateData)
        .eq("user_id", user.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", user?.id] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error updating application",
        description: error.message || "An error occurred while saving your application status.",
      });
    },
  });

  return {
    application: applicationQuery.data,
    isLoading: applicationQuery.isLoading,
    isError: applicationQuery.isError,
    error: applicationQuery.error,
    updateApplication: updateApplication.mutate,
    isUpdating: updateApplication.isPending,
  };
};
