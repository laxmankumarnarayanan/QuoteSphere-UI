import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, MessageSquare } from 'lucide-react';
import { creditDealCommentsService, CreditDealComments } from '../services/creditDealCommentsService';

interface CreditDealCommentsSectionProps {
  dealId: string;
  assignmentId: string;
  readOnly?: boolean;
}

export const CreditDealCommentsSection: React.FC<CreditDealCommentsSectionProps> = ({
  dealId,
  assignmentId,
  readOnly = false
}) => {
  const [comments, setComments] = useState<CreditDealComments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    commentText: ''
  });

  useEffect(() => {
    loadComments();
  }, [dealId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const data = await creditDealCommentsService.getCommentsByAssignmentId(assignmentId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.commentText.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      setIsSaving(true);

      const commentData = {
        assignmentId,
        dealId,
        commentText: formData.commentText,
        lastUpdatedBy: 'laxman.narayanan@fractalhive.com'
      };

      if (editingId) {
        // Update existing comment
        const updated = await creditDealCommentsService.updateComment(editingId, commentData);
        setComments(prev => prev.map(comment => comment.commentId === editingId ? updated : comment));
        setEditingId(null);
      } else {
        // Create new comment
        const created = await creditDealCommentsService.createComment({
          ...commentData,
          createdBy: 'laxman.narayanan@fractalhive.com'
        });
        setComments(prev => [...prev, created]);
        setIsAdding(false);
      }

      // Reset form
      setFormData({
        commentText: ''
      });
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Failed to save comment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (comment: CreditDealComments) => {
    setEditingId(comment.commentId);
    setFormData({
      commentText: comment.commentText || ''
    });
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await creditDealCommentsService.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.commentId !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      commentText: ''
    });
  };

  return (
    <div className="border border-brand-200 rounded-lg bg-brand-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-900">Credit Risk Comments</h3>
        {!readOnly && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-3 py-1.5 text-sm font-semibold text-white rounded-lg shadow-md border border-transparent bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:bg-brand-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Comment
          </button>
        )}
      </div>

      {/* Add Comment Form */}
      {(isAdding || editingId) && !readOnly && (
        <div className="mb-6 p-4 border border-brand-200 rounded-lg bg-white">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Comment *</label>
            <textarea
              value={formData.commentText}
              onChange={(e) => handleInputChange('commentText', e.target.value)}
              className="w-full px-3 py-2 border border-brand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows={4}
              placeholder="Enter your comment"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md border border-transparent bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:bg-brand-500"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Update' : 'Save'}
                </>
              )}
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center px-4 py-2 text-sm font-semibold text-brand-700 bg-white border border-brand-300 rounded-lg shadow-sm hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 ease-in-out"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-brand-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-brand-600">No comments added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.commentId} className="flex items-start justify-between p-3 border border-brand-200 rounded-lg bg-white">
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-brand-900 whitespace-pre-wrap">{comment.commentText}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-brand-500">
                      <span>By: {comment.createdBy}</span>
                      <span>Created: {comment.createdDateTime ? new Date(comment.createdDateTime).toLocaleDateString() : 'N/A'}</span>
                      {comment.lastUpdatedDateTime && comment.lastUpdatedDateTime !== comment.createdDateTime && (
                        <span>Updated: {new Date(comment.lastUpdatedDateTime).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {!readOnly && (
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="p-2 text-brand-600 hover:text-brand-800 hover:bg-brand-100 rounded-md transition-colors"
                    title="Edit Comment"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(comment.commentId)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 