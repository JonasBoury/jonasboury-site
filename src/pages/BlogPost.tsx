import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NotionBlockRenderer } from "@/components/NotionBlockRenderer";

interface NotionPage {
  properties: any;
  [key: string]: any;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<NotionPage | null>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        console.log("Fetching Notion page:", slug);
        
        const { data, error: functionError } = await supabase.functions.invoke('fetch-notion-page', {
          body: { pageId: slug }
        });

        if (functionError) {
          console.error("Function error:", functionError);
          throw new Error(functionError.message);
        }

        if (data?.error) {
          console.error("API error:", data.error);
          throw new Error(data.error);
        }

        console.log("Successfully loaded page data");
        setPage(data.page);
        setBlocks(data.blocks);
      } catch (err: any) {
        console.error("Error loading blog post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlogPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || (!loading && !page)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {error || "Blog post not found"}
          </p>
          <Link to="/#blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to extract text from Notion rich text
  const getPlainText = (richText: any[]) => {
    if (!richText || !Array.isArray(richText)) return "";
    return richText.map((text) => text.plain_text).join("");
  };

  // Extract page title
  const pageTitle = page?.properties?.Name?.title 
    ? getPlainText(page.properties.Name.title)
    : "Untitled";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 md:px-12 py-12 md:py-20">
        <Link to="/#blog" className="inline-block mb-8">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <article>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            {pageTitle}
          </h1>
          
          <NotionBlockRenderer blocks={blocks} />
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
