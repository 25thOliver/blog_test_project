import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, User, Calendar } from 'lucide-react';
import { commentsApi, Comment } from '@/lib/api';
import { useFlash } from '@/contexts/FlashContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CommentListProps {
  comments: Comment[];
  postId: number;
  onCommentDeleted: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, postId, onCommentDeleted }) => {
  const { addMessage } = useFlash();
  const [deletingComments, setDeletingComments] = useState<Set<number>>(new Set());

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setDeletingComments(prev => new Set(prev).add(commentId));

    try {
      await commentsApi.delete(postId, commentId);
      addMessage('success', 'Comment deleted successfully');
      onCommentDeleted();
    } catch (error) {
      addMessage('error', 'Failed to delete comment');
      console.error('Error deleting comment:', error);
    } finally {
      setDeletingComments(prev => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="max-w-sm mx-auto">
          <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No comments yet</h3>
          <p className="text-muted-foreground">
            Be the first to share your thoughts on this post.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{comment.user.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(comment.id)}
                disabled={deletingComments.has(comment.id)}
                className="ml-4 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommentList;