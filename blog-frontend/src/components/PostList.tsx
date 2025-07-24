import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, User, Calendar, Eye } from 'lucide-react';
import { postsApi, Post } from '@/lib/api';
import { useFlash } from '@/contexts/FlashContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState({ current_page: 1, total_pages: 1, total_count: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addMessage } = useFlash();

  useEffect(() => {
    setLoading(true);
    postsApi.getAll(page)
      .then((data) => {
        setPosts(data.posts);
        setMeta(data.meta);
      })
      .catch(() => addMessage('error', 'Failed to fetch posts'))
      .finally(() => setLoading(false));
  }, [page, addMessage]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first blog post.
          </p>
          <Link to="/posts/new">
            <Button>Create First Post</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Latest Posts</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </Badge>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl hover:text-primary transition-colors">
                  <Link to={`/posts/${post.id}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <Link to={`/posts/${post.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.user.name}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">
                {post.body.length > 150 
                  ? `${post.body.substring(0, 150)}...` 
                  : post.body
                }
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-2 mt-4 justify-center">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(1)}
        >First</button>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >Previous</button>
        {Array.from({ length: meta.total_pages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setPage(i + 1)}
          >{i + 1}</button>
        ))}
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= meta.total_pages}
          onClick={() => setPage(page + 1)}
        >Next</button>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= meta.total_pages}
          onClick={() => setPage(meta.total_pages)}
        >Last</button>
      </div>
    </div>
  );
};

export default PostList;