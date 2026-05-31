export const nestedCommentsTypesCode = `export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}`;

export const nestedCommentsUtilsCode = `import { Comment } from './types';

/**
 * Recursive tree search and insert helper (LLD Algorithm)
 * Appends a reply comment into a target node ID
 */
export const insertComment = (
  tree: Comment[],
  parentId: string,
  newComment: Comment
): Comment[] => {
  return tree.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        replies: [newComment, ...node.replies], // Append at head of replies
      };
    }
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: insertComment(node.replies, parentId, newComment),
      };
    }
    return node;
  });
};

/**
 * Recursive tree search and update helper
 * Modifies the content of a specific node
 */
export const updateComment = (
  tree: Comment[],
  commentId: string,
  newText: string
): Comment[] => {
  return tree.map((node) => {
    if (node.id === commentId) {
      return {
        ...node,
        text: newText,
      };
    }
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: updateComment(node.replies, commentId, newText),
      };
    }
    return node;
  });
};

/**
 * Recursive tree search and delete helper
 * Prunes a comment and all of its recursive subtree
 */
export const deleteCommentNode = (
  tree: Comment[],
  commentId: string
): Comment[] => {
  // Filter out the deleted comment at this level
  const filtered = tree.filter((node) => node.id !== commentId);
  
  // Recursively apply to child node subtrees
  return filtered.map((node) => {
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: deleteCommentNode(node.replies, commentId),
      };
    }
    return node;
  });
};`;

export const nestedCommentNodeComponentCode = `import React, { useState } from 'react';
import { Comment } from './types';

interface CommentNodeProps {
  comment: Comment;
  onReply: (parentId: string, text: string) => void;
  onEdit: (commentId: string, text: string) => void;
  onDelete: (commentId: string) => void;
}

export const CommentNode: React.FC<CommentNodeProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
}) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onEdit(comment.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <div className="comment-node-card">
      <div className="comment-meta">
        <strong>{comment.author}</strong>
        <span>{comment.timestamp}</span>
      </div>

      {isEditing ? (
        <div className="edit-box">
          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
          <button onClick={handleEditSubmit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <p className="comment-body">{comment.text}</p>
      )}

      {/* Recursive rendering of Replies subtree */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies-nest">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};`;
