import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";

export default function Notice() {
  const [showNotice, setShowNotice] = useState(true);

  if (!showNotice) return null;

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="py-2 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Info className="h-4 w-4 mr-2 text-blue-500" />
          <CardTitle className="text-sm font-medium text-blue-700">Notice</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowNotice(false)}
          className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <p className="text-sm text-blue-600">
          This version of the PDF Quiz Generator uses a text-based approach to generate questions rather than analyzing the PDF content directly. 
          This ensures better compatibility with free AI models. The questions are still challenging and educational!
        </p>
      </CardContent>
    </Card>
  );
}