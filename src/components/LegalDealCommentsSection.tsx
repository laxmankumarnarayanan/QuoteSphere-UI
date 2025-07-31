import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Send } from 'lucide-react';

interface LegalComment {
  commentId: string;
  assignmentId: string;
  dealId: string;
  commentText: string;
  createdBy: string;
  createdDateTime: string;
  lastUpdatedBy: string;
  lastUpdatedDateTime: string;
}

interface LegalDealCommentsSectionProps {
  dealId: string;
  assignmentId: string;
  readOnly?: boolean;
}

const LegalDealCommentsSection: React.FC<LegalDealCommentsSectionProps> = ({
  dealId,
  assignmentId,
  readOnly = false
}) => {
  const [comments, setComments] = useState<LegalComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    console.log('LegalDealCommentsSection: assignmentId =', assignmentId);
    fetchComments();
  }, [assignmentId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      console.log('Fetching comments for assignment:', assignmentId);
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/legal-deal-comments/assignment/${assignmentId}`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Comments data:', data);
        setComments(data);
      } else {
        console.error('Failed to fetch comments, status:', response.status);
        // Don't set error for 404, just show empty state
        if (response.status !== 404) {
          setError('Failed to fetch comments');
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Don't set error for network issues, just show empty state
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch('https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/legal-deal-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: assignmentId,
          dealId: dealId,
          commentText: newComment.trim(),
          createdBy: 'laxman.narayanan@fractalhive.com',
          lastUpdatedBy: 'laxman.narayanan@fractalhive.com'
        }),
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments([savedComment, ...comments]); // Add new comment at the top
        setNewComment('');
        setShowAddForm(false);
      } else {
        setError('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Error adding comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api/legal-deal-comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment.commentId !== commentId));
      } else {
        setError('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Error deleting comment');
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          <span className="ml-2">Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Legal Comments (Assignment ID: {assignmentId})
        </h3>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-600 text-sm">
            <strong>Note:</strong> Backend endpoints for Legal Comments are not deployed yet. 
            The form below will be functional once the backend is updated.
          </p>
        </div>

        {!readOnly && (
          <div className="mb-6">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Comment
              </button>
            ) : (
              <form onSubmit={handleAddComment} className="bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                    rows={4}
                    placeholder="Enter your comment here..."
                    required
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewComment('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments found</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.commentId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-brand-600" />
                      <span className="font-medium text-gray-900">{comment.createdBy}</span>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(comment.createdDateTime)}
                      </span>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {comment.commentText}
                    </div>
                    {comment.lastUpdatedBy !== comment.createdBy && (
                      <div className="mt-2 text-xs text-gray-500">
                        Last updated by {comment.lastUpdatedBy} on {formatDateTime(comment.lastUpdatedDateTime)}
                      </div>
                    )}
                  </div>
                  {!readOnly && (
                    <button
                      onClick={() => handleDeleteComment(comment.commentId)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { LegalDealCommentsSection }; 