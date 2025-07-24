import React, { useEffect, useState } from 'react';
import { MessageSquarePlus, ChevronDown, ChevronUp } from 'lucide-react';
import { commentsApi, usersApi, User } from '@/lib/api';
import { useFlash } from '@/contexts/FlashContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const { addMessage } = useFlash();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    body: '',
    user_id: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [newUserErrors, setNewUserErrors] = useState<Record<string, string>>({});
  const [addingUser, setAddingUser] = useState(false);
  const [userAddStatus, setUserAddStatus] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await usersApi.getAll();
        setUsers(usersData);
      } catch (error) {
        addMessage('error', 'Failed to fetch users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [addMessage]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.body.trim()) {
      newErrors.body = 'Comment body is required';
    }

    if (!formData.user_id) {
      newErrors.user_id = 'Please select a user';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      await commentsApi.create(postId, {
        body: formData.body.trim(),
        user_id: parseInt(formData.user_id),
        post_id: postId,
      });

      setFormData({ body: '', user_id: '' });
      addMessage('success', 'Comment added successfully');
      onCommentAdded();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Map server errors to fields if possible
        const serverErrors = error.response.data.errors;
        const newErrors: Record<string, string> = {};
        serverErrors.forEach((msg: string) => {
          if (msg.toLowerCase().includes('body')) newErrors.body = msg;
          else if (msg.toLowerCase().includes('user')) newErrors.user_id = msg;
        });
        setErrors(newErrors);
      } else {
        addMessage('error', 'Failed to add comment');
      }
      console.error('Error adding comment:', error);
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

  const handleNewUserChange = (field: string, value: string) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
    if (newUserErrors[field]) {
      setNewUserErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateNewUser = () => {
    const errors: Record<string, string> = {};
    if (!newUser.name.trim()) errors.name = 'Name is required';
    if (!newUser.email.trim()) errors.email = 'Email is required';
    setNewUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserAddStatus('');
    if (!validateNewUser()) return;
    setAddingUser(true);
    try {
      const user = await usersApi.create({ name: newUser.name.trim(), email: newUser.email.trim() });
      // Force a fresh fetch of users to bypass cache
      const usersData = await usersApi.getAll(true);
      setUsers(usersData);
      setFormData(prev => ({ ...prev, user_id: user.id.toString() }));
      setShowNewUser(false);
      setNewUser({ name: '', email: '' });
      setNewUserErrors({});
      setUserAddStatus('success');
      addMessage('success', 'User added successfully');
    } catch (error: any) {
      setUserAddStatus('error');
      if (error.response && error.response.data && error.response.data.errors) {
        const serverErrors = error.response.data.errors;
        const errors: Record<string, string> = {};
        serverErrors.forEach((msg: string) => {
          if (msg.toLowerCase().includes('name')) errors.name = msg;
          else if (msg.toLowerCase().includes('email')) errors.email = msg;
        });
        setNewUserErrors(errors);
      } else {
        addMessage('error', 'Failed to add user');
      }
    } finally {
      setAddingUser(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <MessageSquarePlus className="h-5 w-5" />
          <span>Add a Comment</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment-user">Comment as</Label>
            <Select
              value={formData.user_id}
              onValueChange={(value) => handleInputChange('user_id', value)}
            >
              <SelectTrigger className={errors.user_id ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select your name..." />
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
            <button
              type="button"
              className="text-xs text-primary underline mt-1 flex items-center gap-1"
              onClick={() => setShowNewUser(v => !v)}
            >
              {showNewUser ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />} Add new user
            </button>
            {showNewUser && (
              <div className="mt-2 p-3 border rounded bg-muted space-y-2">
                <div>
                  <Label htmlFor="new-user-name">Name</Label>
                  <Input
                    id="new-user-name"
                    value={newUser.name}
                    onChange={e => handleNewUserChange('name', e.target.value)}
                    placeholder="Enter your name"
                    className={newUserErrors.name ? 'border-destructive' : ''}
                  />
                  {newUserErrors.name && <p className="text-xs text-destructive">{newUserErrors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="new-user-email">Email</Label>
                  <Input
                    id="new-user-email"
                    value={newUser.email}
                    onChange={e => handleNewUserChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className={newUserErrors.email ? 'border-destructive' : ''}
                  />
                  {newUserErrors.email && <p className="text-xs text-destructive">{newUserErrors.email}</p>}
                </div>
                <Button
                  type="button"
                  onClick={handleAddUser}
                  disabled={addingUser}
                  className="min-w-[100px]"
                >
                  {addingUser ? 'Adding...' : 'Add User'}
                </Button>
                {userAddStatus === 'success' && (
                  <p className="text-green-600 text-sm">User added successfully!</p>
                )}
                {userAddStatus === 'error' && (
                  <p className="text-destructive text-sm">Failed to add user. Please try again.</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment-body">Your comment</Label>
            <Textarea
              id="comment-body"
              value={formData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className={errors.body ? 'border-destructive' : ''}
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={submitting}
            className="min-w-[120px]"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentForm;