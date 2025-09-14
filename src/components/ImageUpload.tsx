import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (imageDataUrl: string) => void;
  onGenerateCode: () => void;
  isGenerating: boolean;
  selectedFramework: string;
  onFrameworkChange: (framework: string) => void;
}

export const ImageUpload = ({
  onImageUpload,
  onGenerateCode,
  isGenerating,
  selectedFramework,
  onFrameworkChange,
}: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      onImageUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card className="p-0 overflow-hidden bg-surface border-card-border">
        <div
          className={`upload-zone ${isDragOver ? 'dragover' : ''} ${
            imagePreview ? 'p-0' : 'p-8'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={imagePreview ? undefined : handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Uploaded UI mockup"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClick}
                  className="bg-background/90 backdrop-blur-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload UI Image</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Drag and drop an image or click to browse. Supports PNG, JPG, WEBP files.
              </p>
              <Button className="gradient-primary">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Framework Selection */}
      <Card className="p-6 bg-surface border-card-border">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Output Framework</label>
            <Select value={selectedFramework} onValueChange={onFrameworkChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="html-tailwind">HTML with Tailwind CSS</SelectItem>
                <SelectItem value="react-tailwind">React Component with Tailwind CSS</SelectItem>
                <SelectItem value="html-css">HTML with inline CSS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={onGenerateCode}
            disabled={!imagePreview || isGenerating}
            className="w-full gradient-primary text-primary-foreground font-semibold py-3"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                AI is analyzing the image...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Code
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};