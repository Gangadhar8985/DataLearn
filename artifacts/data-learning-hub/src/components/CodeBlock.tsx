import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export default function CodeBlock({ code, language = "sql", title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-xl overflow-hidden border border-border shadow-sm", className)} data-testid="code-block">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
          </div>
          {title && <span className="text-xs text-muted-foreground font-medium ml-1">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          {language && (
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{language}</span>
          )}
          <button
            data-testid="button-copy-code"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      {/* Code */}
      <div className="bg-card p-5 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed text-foreground whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
