import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Edit, Trash2, User, Calendar, MessageCircle } from 'lucide-react';
import { postsApi, Post, commentsApi, Comment, PaginatedResponse } from '@/lib/api';
import { useFlash } from '@/contexts/FlashContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { addMessage } = useFlash();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsMeta, setCommentsMeta] = useState({ current_page: 1, total_pages: 1, total_count: 0 });
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [hasShownNotFound, setHasShownNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const data = await postsApi.getById(parseInt(id));
        setPost(data);
        setHasShownNotFound(false); // Reset if post is found
      } catch (error) {
        if (!hasShownNotFound) {
          addMessage('error', 'Failed to fetch post');
          setHasShownNotFound(true);
        }
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, addMessage, hasShownNotFound]);

  useEffect(() => {
    if (!post) return;
    setCommentsLoading(true);
    commentsApi.getAll(post.id, commentsPage)
      .then((data) => {
        setComments(data.comments);
        setCommentsMeta(data.meta);
      })
      .catch(() => addMessage('error', 'Failed to fetch comments'))
      .finally(() => setCommentsLoading(false));
  }, [post, commentsPage, addMessage]);

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsApi.delete(post.id);
      addMessage('success', 'Post deleted successfully');
      navigate('/posts');
    } catch (error) {
      addMessage('error', 'Failed to delete post');
      console.error('Error deleting post:', error);
    }
  };

  const refreshPost = async () => {
    if (!id) return;
    
    try {
      const data = await postsApi.getById(parseInt(id));
      setPost(data);
      setHasShownNotFound(false); // Reset if post is found
    } catch (error) {
      if (!hasShownNotFound) {
        addMessage('error', 'Failed to refresh post');
        setHasShownNotFound(true);
      }
      console.error('Error refreshing post:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-24 mb-4"></div>
          <Card>
            <CardHeader>
              <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Post not found</h2>
        <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist.</p>
        <Link to="/posts">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/posts">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Link to={`/posts/${post.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl leading-tight">{post.title}</CardTitle>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>By {post.user.name}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose prose-gray max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {post.body}
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">
            Comments ({post.comments.length})
          </h3>
        </div>

        <CommentForm postId={post.id} onCommentAdded={refreshPost} />
        {commentsLoading ? (
          <div>Loading comments...</div>
        ) : (
          <>
            <CommentList comments={comments} postId={post.id} onCommentDeleted={refreshPost} />
            <div className="flex gap-2 mt-2 justify-center">
              <button
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                disabled={commentsPage <= 1}
                onClick={() => setCommentsPage(1)}
              >First</button>
              <button
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                disabled={commentsPage <= 1}
                onClick={() => setCommentsPage(commentsPage - 1)}
              >Previous</button>
              {Array.from({ length: commentsMeta.total_pages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-2 py-1 rounded ${commentsPage === i + 1 ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  onClick={() => setCommentsPage(i + 1)}
                >{i + 1}</button>
              ))}
              <button
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                disabled={commentsPage >= commentsMeta.total_pages}
                onClick={() => setCommentsPage(commentsPage + 1)}
              >Next</button>
              <button
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                disabled={commentsPage >= commentsMeta.total_pages}
                onClick={() => setCommentsPage(commentsMeta.total_pages)}
              >Last</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;