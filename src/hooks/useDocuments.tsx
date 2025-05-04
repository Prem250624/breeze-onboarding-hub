
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { DocumentType, DocumentStatus } from "@/contexts/OnboardingContext";

export const useDocuments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!user?.id) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;
    return data;
  };

  const documentsQuery = useQuery({
    queryKey: ["documents", user?.id],
    queryFn: fetchDocuments,
    enabled: !!user?.id,
  });

  const uploadDocument = useMutation({
    mutationFn: async ({ type, file }: { type: DocumentType; file: File }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Upload file to storage
      const folderPath = `${user.id}/${type}`;
      const filePath = `${folderPath}/${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('onboarding_documents')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Update document status in database
      const { data, error: updateError } = await supabase
        .from("documents")
        .update({
          status: 'uploaded',
          filename: file.name,
          upload_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("type", type)
        .select();

      if (updateError) throw updateError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", user?.id] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error uploading document",
        description: error.message || "An error occurred while uploading your document.",
      });
    },
  });

  const updateDocumentStatus = useMutation({
    mutationFn: async ({ type, status, notes }: { type: DocumentType; status: DocumentStatus; notes?: string }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("documents")
        .update({
          status,
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("type", type)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", user?.id] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error updating document status",
        description: error.message || "An error occurred while updating document status.",
      });
    },
  });

  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    isError: documentsQuery.isError,
    error: documentsQuery.error,
    uploadDocument: uploadDocument.mutate,
    isUploading: uploadDocument.isPending,
    updateDocumentStatus: updateDocumentStatus.mutate,
    isUpdating: updateDocumentStatus.isPending,
  };
};
