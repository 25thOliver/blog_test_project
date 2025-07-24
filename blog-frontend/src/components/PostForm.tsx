import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { postsApi, usersApi, User, Post } from '@/lib/api';
import { useFlash } from '@/contexts/FlashContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addMessage } = useFlash();
  const isEditing = Boolean(id);

  const [post, setPost] = useState<Post | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    user_id: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users for selection
        const usersData = await usersApi.getAll();
        setUsers(usersData);

        // If editing, fetch the post
        if (isEditing && id) {
          const postData = await postsApi.getById(parseInt(id));
          setPost(postData);
          setFormData({
            title: postData.title,
            body: postData.body,
            user_id: postData.user.id.toString(),
          });
        }
      } catch (error) {
        addMessage('error', isEditing ? 'Failed to fetch post' : 'Failed to fetch users');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing, addMessage]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Body is required';
    }

    if (!formData.user_id) {
      newErrors.user_id = 'Author is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const postData = {
        title: formData.title.trim(),
        body: formData.body.trim(),
        user_id: parseInt(formData.user_id),
      };

      let savedPost: Post;
      
      if (isEditing && id) {
        savedPost = await postsApi.update(parseInt(id), postData);
        addMessage('success', 'Post updated successfully');
      } else {
        savedPost = await postsApi.create(postData);
        addMessage('success', 'Post created successfully');
      }

      navigate(`/posts/${savedPost.id}`);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Map server errors to fields if possible
        const serverErrors = error.response.data.errors;
        const newErrors: Record<string, string> = {};
        serverErrors.forEach((msg: string) => {
          if (msg.toLowerCase().includes('title')) newErrors.title = msg;
          else if (msg.toLowerCase().includes('body')) newErrors.body = msg;
          else if (msg.toLowerCase().includes('user')) newErrors.user_id = msg;
        });
        setErrors(newErrors);
      } else {
        addMessage('error', isEditing ? 'Failed to update post' : 'Failed to create post');
      }
      console.error('Error saving post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(isEditing ? `/posts/${id}` : '/posts')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isEditing ? 'Back to Post' : 'Back to Posts'}
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter post title..."
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_id">Author</Label>
              <Select
                value={formData.user_id}
                onValueChange={(value) => handleInputChange('user_id', value)}
              >
                <SelectTrigger className={errors.user_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select an author..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.user_id && (
                <p className="text-sm text-destructive">{errors.user_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Content</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="Write your post content here..."
                rows={12}
                className={errors.body ? 'border-destructive' : ''}
              />
              {errors.body && (
                <p className="text-sm text-destructive">{errors.body}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                type="submit" 
                disabled={submitting}
                className="min-w-[120px]"
              >
                {submitting 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update Post' : 'Create Post')
                }
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(isEditing ? `/posts/${id}` : '/posts')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostForm;