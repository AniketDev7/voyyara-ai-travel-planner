/**
 * JSON RTE Renderer
 * Converts Contentstack JSON RTE content to React components
 */

import React from 'react';

interface RTENode {
  type: string;
  content?: RTENode[];
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  attrs?: Record<string, any>;
}

interface RenderOptions {
  className?: string;
}

/**
 * Render inline text with formatting
 */
function renderText(node: RTENode): React.ReactNode {
  let text: React.ReactNode = node.text || '';
  
  if (node.bold) {
    text = <strong key={Math.random()}>{text}</strong>;
  }
  if (node.italic) {
    text = <em key={Math.random()}>{text}</em>;
  }
  if (node.underline) {
    text = <u key={Math.random()}>{text}</u>;
  }
  
  return text;
}

/**
 * Render a single RTE node
 */
function renderNode(node: RTENode, index: number): React.ReactNode {
  if (!node) return null;

  // Text node
  if (node.type === 'text' || node.text !== undefined) {
    return <React.Fragment key={index}>{renderText(node)}</React.Fragment>;
  }

  // Get children content
  const children = node.content?.map((child, i) => renderNode(child, i)) || null;

  switch (node.type) {
    case 'doc':
      return <div key={index}>{children}</div>;

    case 'paragraph':
      return <p key={index} className="mb-4 last:mb-0">{children}</p>;

    case 'heading':
      const level = node.attrs?.level || 2;
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      const headingClasses: Record<number, string> = {
        1: 'text-3xl font-bold mb-4',
        2: 'text-2xl font-bold mb-3',
        3: 'text-xl font-semibold mb-2',
        4: 'text-lg font-semibold mb-2',
        5: 'text-base font-semibold mb-1',
        6: 'text-sm font-semibold mb-1',
      };
      return (
        <HeadingTag key={index} className={headingClasses[level] || ''}>
          {children}
        </HeadingTag>
      );

    case 'bullet_list':
      return (
        <ul key={index} className="list-disc list-inside mb-4 space-y-1">
          {children}
        </ul>
      );

    case 'ordered_list':
      return (
        <ol key={index} className="list-decimal list-inside mb-4 space-y-1">
          {children}
        </ol>
      );

    case 'list_item':
      return <li key={index}>{children}</li>;

    case 'blockquote':
      return (
        <blockquote key={index} className="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-600">
          {children}
        </blockquote>
      );

    case 'code_block':
      return (
        <pre key={index} className="bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
          <code>{children}</code>
        </pre>
      );

    case 'horizontal_rule':
      return <hr key={index} className="my-6 border-gray-200" />;

    case 'hard_break':
      return <br key={index} />;

    case 'link':
      return (
        <a
          key={index}
          href={node.attrs?.href}
          target={node.attrs?.target || '_blank'}
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-800 underline"
        >
          {children}
        </a>
      );

    case 'image':
      return (
        <img
          key={index}
          src={node.attrs?.src}
          alt={node.attrs?.alt || ''}
          className="rounded-lg max-w-full h-auto my-4"
        />
      );

    default:
      // Unknown node type, render children if present
      return children ? <span key={index}>{children}</span> : null;
  }
}

/**
 * Main render function for JSON RTE content
 */
export function renderJsonRTE(content: any, options?: RenderOptions): React.ReactNode {
  if (!content) return null;

  // If it's already a string, just return it
  if (typeof content === 'string') {
    return <p className={options?.className}>{content}</p>;
  }

  // If it's a JSON RTE document
  if (content.type === 'doc' && content.content) {
    return (
      <div className={options?.className}>
        {content.content.map((node: RTENode, index: number) => renderNode(node, index))}
      </div>
    );
  }

  // If it's an array of nodes
  if (Array.isArray(content)) {
    return (
      <div className={options?.className}>
        {content.map((node: RTENode, index: number) => renderNode(node, index))}
      </div>
    );
  }

  return null;
}

/**
 * Simple text extraction from JSON RTE (for previews, meta descriptions)
 */
export function extractTextFromRTE(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;

  function extractFromNode(node: RTENode): string {
    if (node.text) return node.text;
    if (node.content) {
      return node.content.map(extractFromNode).join(' ');
    }
    return '';
  }

  if (content.type === 'doc' && content.content) {
    return content.content.map((node: RTENode) => extractFromNode(node)).join(' ').trim();
  }

  return '';
}

/**
 * Safe render function - handles strings, JSON RTE, or unknown objects
 * Use this for any field that might be plain text OR JSON RTE
 */
export function safeRenderContent(content: any, options?: RenderOptions): React.ReactNode {
  if (!content) return null;
  
  // Plain string - render directly
  if (typeof content === 'string') {
    return content;
  }
  
  // Number or boolean - convert to string
  if (typeof content === 'number' || typeof content === 'boolean') {
    return String(content);
  }
  
  // JSON RTE document structure
  if (typeof content === 'object') {
    // Check if it's a JSON RTE (has type: 'doc' or children array)
    if (content.type === 'doc' || content.children || content.content) {
      return renderJsonRTE(content, options);
    }
    
    // It's some other object - extract text or return placeholder
    const text = extractTextFromRTE(content);
    if (text) return text;
    
    // Last resort - don't render objects directly
    console.warn('Unable to render content:', content);
    return null;
  }
  
  return null;
}

