import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { CodeDisplay } from "@/components/CodeDisplay";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string>("html-tailwind");

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setGeneratedCode(""); // Clear previous code when new image is uploaded
  };

  const handleGenerateCode = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image first to generate code.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // For now, we'll simulate the API call - will implement Supabase Edge Function next
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Mock generated code based on framework
      const mockCode = getMockCode(selectedFramework);
      setGeneratedCode(mockCode);
      
      toast({
        title: "Code generated successfully!",
        description: "Your UI has been converted to code.",
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getMockCode = (framework: string) => {
    switch (framework) {
      case "html-tailwind":
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated UI</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-6">
        <div class="bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Welcome</h1>
            <p class="text-gray-600 mb-6">This is your generated UI component.</p>
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                Get Started
            </button>
        </div>
    </div>
</body>
</html>`;
      
      case "react-tailwind":
        return `import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome</h1>
          <p className="text-gray-600 mb-6">This is your generated UI component.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedComponent;`;
      
      case "html-css":
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated UI</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
        }
        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 24px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 16px;
        }
        .description {
            color: #666;
            margin-bottom: 24px;
        }
        .button {
            background-color: #3b82f6;
            color: white;
            padding: 8px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
        }
        .button:hover {
            background-color: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1 class="title">Welcome</h1>
            <p class="description">This is your generated UI component.</p>
            <button class="button">Get Started</button>
        </div>
    </div>
</body>
</html>`;
      
      default:
        return "// Generated code will appear here...";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground text-xl font-bold">✨</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">UI Vision Coder</h1>
              <p className="text-muted-foreground text-sm">From Image to Code with AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 h-full">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Upload UI Image</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Upload a screenshot or mockup of the UI you want to convert to code
              </p>
            </div>
            
            <ImageUpload
              onImageUpload={handleImageUpload}
              onGenerateCode={handleGenerateCode}
              isGenerating={isGenerating}
              selectedFramework={selectedFramework}
              onFrameworkChange={setSelectedFramework}
            />
          </div>

          {/* Right Column - Generated Code */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Generated Code</h2>
              <p className="text-muted-foreground text-sm mb-4">
                AI-generated code based on your uploaded image
              </p>
            </div>
            
            <CodeDisplay
              code={generatedCode}
              isGenerating={isGenerating}
              language={selectedFramework.includes('react') ? 'jsx' : 'html'}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;