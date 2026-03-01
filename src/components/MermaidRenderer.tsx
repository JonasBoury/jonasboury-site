import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
}

// Initialize mermaid with theme settings
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#14b8a6',
    primaryTextColor: '#fff',
    primaryBorderColor: '#0d9488',
    lineColor: '#6b7280',
    secondaryColor: '#1e293b',
    tertiaryColor: '#334155',
    quadrant1Fill: '#14b8a6',
    quadrant2Fill: '#3b82f6',
    quadrant3Fill: '#ef4444',
    quadrant4Fill: '#f59e0b',
    quadrant1TextFill: '#fff',
    quadrant2TextFill: '#fff',
    quadrant3TextFill: '#fff',
    quadrant4TextFill: '#fff',
  },
  securityLevel: 'loose',
});

const MermaidRenderer = ({ chart }: MermaidRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart || !containerRef.current) return;

      try {
        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-sm text-destructive">
        <strong>Diagram Error:</strong> {error}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="my-6 p-4 rounded-lg bg-muted/50 overflow-x-auto flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidRenderer;
