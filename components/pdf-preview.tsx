import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, AlertCircle, Image, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface PdfPreviewProps {
  file: File;
  maxHeight?: number;
}

export default function PdfPreview({ file, maxHeight = 200 }: PdfPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageCountVisible, setPageCountVisible] = useState<number>(1);

  useEffect(() => {
    const processPdf = async () => {
      if (!file) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Try to use the File API to get basic info about the PDF
        // This is a simple approach that doesn't require PDF.js worker
        
        // Try to get page count from file size heuristics (not 100% accurate)
        // Larger files tend to have more pages
        const fileSizeInKB = file.size / 1024;
        let estimatedPages = 1;
        
        // Very rough estimation: ~100KB per page
        if (fileSizeInKB > 5000) {
          estimatedPages = 20; // Large file
        } else if (fileSizeInKB > 2000) {
          estimatedPages = 10; // Medium file
        } else if (fileSizeInKB > 1000) {
          estimatedPages = 5; // Small file
        }
        
        // Display file information instead of actual content
        const fileInfo = `File: ${file.name}
Type: ${file.type}
Size: ${(file.size / 1024).toFixed(2)} KB
Estimated Pages: ${estimatedPages}
        
        PDF content preview is not available in this version of the application.
        The full content will be used for quiz generation.`;
        
        setPreviewText(fileInfo);
        setPageCount(estimatedPages);
        setPageCountVisible(1); // Show as 1 page for simplicity
        setLoading(false);
      } catch (err) {
        console.error('Error processing PDF:', err);
        setError('Failed to process PDF. Preview not available.');
        setLoading(false);
      }
    };

    processPdf();
  }, [file]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">PDF Preview</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Processing PDF...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">PDF Preview</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            PDF Preview
          </CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3 mr-1" />
            <span>{pageCountVisible} of {pageCount} pages</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          className="text-sm text-muted-foreground overflow-auto" 
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {previewText ? (
            <div className="whitespace-pre-wrap">
              {previewText}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Image className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No text content could be extracted</p>
              <p className="text-xs mt-1">This might be a scanned PDF or image-based document</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}