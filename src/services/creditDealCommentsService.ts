const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net';

export interface CreditDealComments {
  commentId: string;
  assignmentId: string;
  dealId: string;
  commentText: string;
  createdBy: string;
  createdDateTime: string;
  lastUpdatedBy: string;
  lastUpdatedDateTime: string;
}

export const creditDealCommentsService = {
  async getAllComments(): Promise<CreditDealComments[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async getCommentById(commentId: string): Promise<CreditDealComments> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-comments/${commentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching comment:', error);
      throw error;
    }
  },

  async getCommentsByDealId(dealId: string): Promise<CreditDealComments[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-comments/deal/${dealId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments by deal ID');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments by deal ID:', error);
      throw error;
    }
  },

  async getCommentsByAssignmentId(assignmentId: string): Promise<CreditDealComments[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-comments/assignment/${assignmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments by assignment ID');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments by assignment ID:', error);
      throw error;
    }
  },

  async createComment(commentData: Omit<CreditDealComments, 'commentId' | 'createdDateTime' | 'lastUpdatedDateTime'>): Promise<CreditDealComments> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        throw new Error('Failed to create comment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  async updateComment(commentId: string, commentData: Partial<CreditDealComments>): Promise<CreditDealComments> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  async deleteComment(commentId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit-deal-comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
}; 