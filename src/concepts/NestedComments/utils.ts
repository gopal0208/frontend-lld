import { Comment } from './types';

export const insertComment = (
  tree: Comment[],
  parentId: string,
  newComment: Comment
): Comment[] => {
  return tree.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        replies: [newComment, ...node.replies],
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

export const deleteCommentNode = (
  tree: Comment[],
  commentId: string
): Comment[] => {
  const filtered = tree.filter((node) => node.id !== commentId);
  return filtered.map((node) => {
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: deleteCommentNode(node.replies, commentId),
      };
    }
    return node;
  });
};
