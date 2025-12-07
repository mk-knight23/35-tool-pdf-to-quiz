"use client";

import { FileText } from "lucide-react";

type PdfPreviewProps = {
  file: File;
};

export default function PdfPreview({ file }: PdfPreviewProps) {
  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
      <FileText className="h-8 w-8 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{file.name}</p>
        <p className="text-sm text-muted-foreground">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
    </div>
  );
}
