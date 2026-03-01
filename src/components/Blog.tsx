import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
}

const WRITINGS_DATABASE_ID = "29ec274a65fc8125ac34e5e90e3c7ea6";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-notion-inspiration', {
          body: { 
            databaseId: WRITINGS_DATABASE_ID,
            filterProperty: 'Status',
            filterValue: 'Published'
          }
        });

        if (error) throw error;
        setPosts(data.inspirations || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id="blog" className="min-h-screen px-6 md:px-12 py-20 pb-32 md:pb-20">
      <div className="mx-auto max-w-3xl w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-muted-foreground">#</span>
            Writings
          </h2>
          <p className="text-sm text-muted-foreground">
            Thoughts on design, development, and building great things
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-8">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No blog posts found</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="block"
              >
                <Card 
                  className="group hover:shadow-sm transition-all duration-200 cursor-pointer border-border bg-card rounded-[20px]"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold mb-2 group-hover:text-foreground/80 transition-colors">
                          {post.title}
                        </CardTitle>
                        {post.description && (
                          <CardDescription className="text-sm text-muted-foreground leading-relaxed mb-2">
                            {post.description}
                          </CardDescription>
                        )}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
