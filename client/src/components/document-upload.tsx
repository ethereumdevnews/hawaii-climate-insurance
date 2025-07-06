import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image, Trash2, Eye } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  customerId: number | null;
}

export default function DocumentUpload({ customerId }: DocumentUploadProps) {
  const [documentType, setDocumentType] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', customerId],
    queryFn: () => apiRequest(`/api/customers/${customerId}/documents`, { on401: "returnNull" }),
    enabled: !!customerId
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: string }) => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('customerId', customerId?.toString() || '');
      formData.append('documentType', type);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', customerId] });
      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded and processed.",
      });
      setUploadProgress(0);
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (documentId: number) => 
      apiRequest(`/api/documents/${documentId}`, { 
        method: 'DELETE',
        on401: "returnNull" 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', customerId] });
      toast({
        title: "Document deleted",
        description: "The document has been successfully removed.",
      });
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!documentType) {
      toast({
        title: "Select document type",
        description: "Please select a document type before uploading.",
        variant: "destructive",
      });
      return;
    }

    if (!customerId) {
      toast({
        title: "Customer required",
        description: "Please create a customer profile first.",
        variant: "destructive",
      });
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setUploadProgress(25);
      uploadMutation.mutate({ file, type: documentType });
    }
  }, [documentType, customerId, uploadMutation, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      processing: "default",
      processed: "default",
      failed: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  if (!customerId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-neutral-500">Please create a customer profile to upload documents.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="property_deed">Property Deed</SelectItem>
                <SelectItem value="damage_report">Damage Report</SelectItem>
                <SelectItem value="insurance_form">Insurance Form</SelectItem>
                <SelectItem value="photo">Photo/Image</SelectItem>
                <SelectItem value="inspection_report">Inspection Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-neutral-300 hover:border-primary hover:bg-neutral-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
            {isDragActive ? (
              <p className="text-neutral-600">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-neutral-600 mb-2">
                  Drag & drop a document here, or click to select
                </p>
                <p className="text-sm text-neutral-500">
                  Supports PDF, images, and text documents (max 10MB)
                </p>
              </div>
            )}
          </div>

          {uploadMutation.isPending && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading and processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-neutral-500">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-neutral-500">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(doc.mimeType)}
                    <div>
                      <p className="font-medium">{doc.originalName}</p>
                      <div className="flex items-center space-x-2 text-sm text-neutral-500">
                        <span>{doc.documentType}</span>
                        <span>•</span>
                        <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        {getStatusBadge(doc.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.analysis && (
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}