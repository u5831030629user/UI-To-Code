import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, Download, Loader2, Code2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CodeDisplayProps {
  code: string;
  isGenerating: boolean;
  language: string;
}

export const CodeDisplay = ({ code, isGenerating, language }: CodeDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Code copied!",
        description: "The generated code has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const extension = language === 'jsx' ? 'jsx' : 'html';
    const filename = `generated-ui.${extension}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code downloaded!",
      description: `File saved as ${filename}`,
    });
  };

  if (isGenerating) {
    return (
      <Card className="h-96 bg-surface border-card-border flex items-center justify-center">
        <div className="text-center">
          <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
          </div>
          <h3 className="text-lg font-semibold mb-2">AI is analyzing your image</h3>
          <p className="text-muted-foreground">
            Converting your UI design into production-ready code...
          </p>
        </div>
      </Card>
    );
  }

  if (!code) {
    return (
      <Card className="h-96 bg-surface border-card-border flex items-center justify-center">
        <div className="text-center">
          <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No code generated yet</h3>
          <p className="text-muted-foreground">
            Upload an image and click "Generate Code" to see the AI-generated code here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-surface border-card-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-card-border bg-surface-secondary">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-primary" />
          <span className="font-semibold">Generated Code</span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-muted-foreground hover:text-foreground"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <div className="max-h-96 overflow-auto code-block">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: 'hsl(var(--code-bg))',
              fontSize: '0.875rem',
              lineHeight: '1.6',
            }}
            showLineNumbers={true}
            lineNumberStyle={{
              color: 'hsl(var(--muted-foreground))',
              paddingRight: '1rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </Card>
  );
};