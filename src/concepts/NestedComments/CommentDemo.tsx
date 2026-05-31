import React, { useState } from 'react';
import { Comment } from './types';
import { insertComment, updateComment, deleteCommentNode } from './utils';
import { MessageSquare, CornerDownRight, Edit2, Trash2, Reply, Send, Plus } from 'lucide-react';

// Pre-populated comments tree for rich initial experience
const initialComments: Comment[] = [
  {
    id: 'c1',
    author: 'Alex Rivera',
    text: 'What are the main LLD challenges of building a nested comment thread? Is it the state update or rendering performance?',
    timestamp: '1 hour ago',
    replies: [
      {
        id: 'c2',
        author: 'Sarah Chen',
        text: 'Both! Rendering performance suffers if you re-render the entire thread. You can optimize it by virtualizing the list or using memoized components.',
        timestamp: '45 mins ago',
        replies: [
          {
            id: 'c3',
            author: 'Alex Rivera',
            text: 'Ah, so utilizing React.memo on each individual CommentNode prevents cascading re-renders. That makes perfect sense!',
            timestamp: '30 mins ago',
            replies: []
          }
        ]
      },
      {
        id: 'c4',
        author: 'Marcus Vance',
        text: 'The biggest LLD hurdle is immutability during recursion. In Redux or React state, mutating nested arrays is a nightmare unless you use clean recursive state helpers.',
        timestamp: '40 mins ago',
        replies: []
      }
    ]
  },
  {
    id: 'c5',
    author: 'Elena Rostova',
    text: 'I highly recommend using depth limitations (e.g. stopping nested indentation at depth 5) and collapsing the rest into a flat view to avoid layout breakage on mobile screen widths!',
    timestamp: '2 hours ago',
    replies: []
  }
];

export const CommentDemo: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [rootInput, setRootInput] = useState('');
  const [logs, setLogs] = useState<{ text: string; time: string }[]>([]);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ text: message, time }, ...prev].slice(0, 10));
  };

  const handleAddRootComment = () => {
    if (!rootInput.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      author: 'Guest Instructor',
      text: rootInput,
      timestamp: 'Just now',
      replies: []
    };
    setComments([newComment, ...comments]);
    setRootInput('');
    addLog(`Root level: Created comment node "${newComment.id}"`);
  };

  const handleReply = (parentId: string, text: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      author: 'Guest Instructor',
      text,
      timestamp: 'Just now',
      replies: []
    };
    setComments((prevTree) => insertComment(prevTree, parentId, newComment));
    addLog(`Recursion: Appended node "${newComment.id}" under parent "${parentId}"`);
  };

  const handleEdit = (commentId: string, text: string) => {
    setComments((prevTree) => updateComment(prevTree, commentId, text));
    addLog(`Recursion: Edited content of node "${commentId}"`);
  };

  const handleDelete = (commentId: string) => {
    setComments((prevTree) => deleteCommentNode(prevTree, commentId));
    addLog(`Recursion: Pruned node "${commentId}" and all its children`);
  };

  return (
    <div className="playground-container" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
      {/* Thread Rendering Area */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Recursive Comments Thread</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Represents infinite deep nesting capabilities. Observe thread alignment grids below.</p>
        </div>

        {/* Input box for new Root comments */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem' }}>
          <MessageSquare size={18} style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }} />
          <textarea
            value={rootInput}
            onChange={(e) => setRootInput(e.target.value)}
            placeholder="Write a root comment to launch a new discussion thread..."
            rows={2}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
              width: '100%',
              resize: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button onClick={handleAddRootComment} className="btn-primary" style={{ alignSelf: 'flex-end', padding: '0.4rem 0.8rem' }}>
            <Send size={12} />
          </button>
        </div>

        {/* Dynamic recursive thread wrapper */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {comments.map((comment) => (
            <CommentNodeComponent
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              depth={0}
            />
          ))}
        </div>
      </div>

      {/* Recurse Traversal Debugger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* LLD Mechanics Info Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.4)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recursive Depth Metrics
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Algorithm Complexity:</span>
              <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>O(N) Traversal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Component Structure:</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Self-referential Trees</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Immutable State Flow:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Deep Mapping Spreads</span>
            </div>
          </div>
        </div>

        {/* Traversal console logs */}
        <div className="glass-panel" style={{
          flex: 1,
          background: '#040711',
          padding: '1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
        }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
            &gt; recursion_traversal.sh
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '240px' }}>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '4rem' }}>
                Waiting for comment operations...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>{' '}
                  <span style={{ color: 'var(--accent-purple)' }}>[TreeUpdate]</span> {log.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- RECURSIVE NODE COMPONENT --- */
interface CommentNodeProps {
  comment: Comment;
  onReply: (parentId: string, text: string) => void;
  onEdit: (commentId: string, text: string) => void;
  onDelete: (commentId: string) => void;
  depth: number;
}

const CommentNodeComponent: React.FC<CommentNodeProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  depth,
}) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText('');
    setShowReplyBox(false);
  };

  const handleEditSubmit = () => {
    if (!editText.trim()) return;
    onEdit(comment.id, editText);
    setIsEditing(false);
  };

  // Get a colored avatar based on the author's name
  const getAvatarChar = (name: string) => name.charAt(0);
  const getAvatarBg = (name: string) => {
    const chars = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    const hues = [280, 200, 150, 320, 45, 0];
    return `hsl(${hues[chars % hues.length]}, 70%, 40%)`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      marginTop: depth > 0 ? '0.75rem' : '1rem',
    }}>
      {/* Individual Comment Box */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.02)',
          borderLeft: depth > 0 ? '2px solid rgba(168, 85, 247, 0.3)' : '1px solid var(--border-color)',
          transition: 'all var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = depth > 0 ? 'rgba(168, 85, 247, 0.3)' : 'var(--border-color)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
        }}
      >
        {/* Comment Header Meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: getAvatarBg(comment.author),
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {getAvatarChar(comment.author)}
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{comment.author}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comment.timestamp}</span>
          </div>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            ID: {comment.id}
          </span>
        </div>

        {/* Comment Body / Edit View */}
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                resize: 'vertical',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
              <button onClick={() => setIsEditing(false)} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Cancel</button>
              <button onClick={handleEditSubmit} className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>Save Changes</button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{comment.text}</p>
        )}

        {/* Interactive Action Triggers */}
        {!isEditing && (
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.5rem' }}>
            <button
              onClick={() => {
                setShowReplyBox(!showReplyBox);
                setReplyText('');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                transform: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Reply size={12} />
              Reply
            </button>

            <button
              onClick={() => {
                setIsEditing(true);
                setEditText(comment.text);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                transform: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-purple)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Edit2 size={12} />
              Edit
            </button>

            <button
              onClick={() => onDelete(comment.id)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                transform: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        )}

        {/* Collapsible Expandable Reply Box inside comments */}
        {showReplyBox && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.6rem' }}>
            <CornerDownRight size={14} style={{ color: 'var(--accent-cyan)', marginTop: '0.4rem' }} />
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.author}...`}
              rows={2}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                resize: 'none',
                outline: 'none',
              }}
            />
            <button onClick={handleReplySubmit} className="btn-primary" style={{ alignSelf: 'flex-end', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
              <Plus size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Recursive Render replies under visual Thread Lines */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{
          paddingLeft: '1.5rem',
          marginLeft: '0.75rem',
          borderLeft: '1px dashed rgba(255, 255, 255, 0.08)',
        }}>
          {comment.replies.map((reply) => (
            <CommentNodeComponent
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
