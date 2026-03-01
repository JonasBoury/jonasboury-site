import React from "react";

interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
}

interface NotionBlockRendererProps {
  blocks: NotionBlock[];
}

export const NotionBlockRenderer: React.FC<NotionBlockRendererProps> = ({ blocks }) => {
  const renderRichText = (richTextArray: any[]) => {
    if (!richTextArray || !Array.isArray(richTextArray)) return null;
    
    return richTextArray.map((text, index) => {
      let content = text.plain_text;
      
      if (text.annotations) {
        if (text.annotations.bold) {
          content = <strong key={index}>{content}</strong>;
        }
        if (text.annotations.italic) {
          content = <em key={index}>{content}</em>;
        }
        if (text.annotations.code) {
          content = <code key={index} className="px-1 py-0.5 bg-muted rounded text-sm">{content}</code>;
        }
        if (text.annotations.strikethrough) {
          content = <s key={index}>{content}</s>;
        }
        if (text.annotations.underline) {
          content = <u key={index}>{content}</u>;
        }
      }
      
      if (text.href) {
        return (
          <a key={index} href={text.href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        );
      }
      
      return <span key={index}>{content}</span>;
    });
  };

  const renderBlock = (block: NotionBlock) => {
    const { type, id } = block;
    const value = block[type];

    switch (type) {
      case "paragraph":
        return (
          <p key={id} className="mb-4 text-foreground leading-relaxed">
            {renderRichText(value?.rich_text)}
          </p>
        );

      case "heading_1":
        return (
          <h1 key={id} className="text-4xl font-bold mb-6 mt-8 text-foreground">
            {renderRichText(value?.rich_text)}
          </h1>
        );

      case "heading_2":
        return (
          <h2 key={id} className="text-3xl font-bold mb-4 mt-6 text-foreground">
            {renderRichText(value?.rich_text)}
          </h2>
        );

      case "heading_3":
        return (
          <h3 key={id} className="text-2xl font-semibold mb-3 mt-5 text-foreground">
            {renderRichText(value?.rich_text)}
          </h3>
        );

      case "bulleted_list_item":
        return (
          <li key={id} className="ml-6 mb-2 text-foreground list-disc">
            {renderRichText(value?.rich_text)}
          </li>
        );

      case "numbered_list_item":
        return (
          <li key={id} className="ml-6 mb-2 text-foreground list-decimal">
            {renderRichText(value?.rich_text)}
          </li>
        );

      case "code":
        return (
          <pre key={id} className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto">
            <code className="text-sm">{renderRichText(value?.rich_text)}</code>
          </pre>
        );

      case "quote":
        return (
          <blockquote key={id} className="border-l-4 border-primary pl-4 italic mb-4 text-muted-foreground">
            {renderRichText(value?.rich_text)}
          </blockquote>
        );

      case "divider":
        return <hr key={id} className="my-8 border-border" />;

      case "image":
        const imageUrl = value?.file?.url || value?.external?.url;
        const caption = value?.caption ? renderRichText(value.caption) : null;
        return (
          <figure key={id} className="my-6">
            <img 
              src={imageUrl} 
              alt={caption?.toString() || "Image"} 
              className="rounded-lg w-full"
            />
            {caption && (
              <figcaption className="text-sm text-muted-foreground text-center mt-2">
                {caption}
              </figcaption>
            )}
          </figure>
        );

      case "callout":
        return (
          <div key={id} className="bg-muted/50 border-l-4 border-primary p-4 rounded-r-lg mb-4">
            {renderRichText(value?.rich_text)}
          </div>
        );

      case "toggle":
        return (
          <details key={id} className="mb-4">
            <summary className="cursor-pointer font-semibold text-foreground mb-2">
              {renderRichText(value?.rich_text)}
            </summary>
          </details>
        );

      default:
        return (
          <div key={id} className="mb-4 text-muted-foreground">
            Unsupported block type: {type}
          </div>
        );
    }
  };

  return (
    <div className="notion-content">
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
};
