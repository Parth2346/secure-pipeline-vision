import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  FileText, 
  Database,
  Shield,
  Zap
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onStatusChange: (status: 'idle' | 'running' | 'completed' | 'error') => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onStatusChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type === 'text/csv' || file.type === 'application/json' || file.name.endsWith('.csv') || file.name.endsWith('.json');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid Files",
        description: "Some files were rejected. Only CSV/JSON files under 50MB are allowed.",
        variant: "destructive",
      });
    }

    setFiles(validFiles);
    if (validFiles.length > 0) {
      validateFiles(validFiles);
    }
  }, [toast]);

  const validateFiles = (filesToValidate: File[]) => {
    const results = filesToValidate.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'valid',
      securityCheck: Math.random() > 0.1 ? 'passed' : 'warning',
      estimatedRows: Math.floor(Math.random() * 10000) + 100,
      columns: Math.floor(Math.random() * 20) + 5
    }));
    setValidationResults(results);
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    onStatusChange('running');
    
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsUploading(false);
    onStatusChange('completed');
    toast({
      title: "Upload Complete",
      description: `${files.length} file(s) uploaded and validated successfully.`,
      variant: "default",
    });
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    const newResults = validationResults.filter((_, i) => i !== index);
    setValidationResults(newResults);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Secure File Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">CSV or JSON files (MAX 50MB)</p>
              </div>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                accept=".csv,.json"
                onChange={handleFileSelect}
              />
            </Label>
          </div>

          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Selected Files</h3>
                <Button 
                  onClick={simulateUpload} 
                  disabled={isUploading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {isUploading ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Secure Upload
                    </>
                  )}
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading and validating...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Validation Results */}
      {validationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              File Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {validationResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center space-x-4">
                    <File className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">{result.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(result.size)} • ~{result.estimatedRows} rows • {result.columns} columns
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={result.securityCheck === 'passed' ? 'default' : 'secondary'}
                      className={result.securityCheck === 'passed' ? 'bg-gradient-risk-low' : 'bg-gradient-risk-medium'}
                    >
                      {result.securityCheck === 'passed' ? (
                        <><CheckCircle className="h-3 w-3 mr-1" />Secure</>
                      ) : (
                        <><AlertTriangle className="h-3 w-3 mr-1" />Review</>
                      )}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {validationResults.some(r => r.securityCheck === 'warning') && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Some files require security review. Please ensure all data sources are trusted before proceeding.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;