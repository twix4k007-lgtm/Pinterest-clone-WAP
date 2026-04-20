import React, { useState, useEffect } from 'react';
import './PinModal.css';

const PinModal = ({ pin, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Mock loading initial comments
  useEffect(() => {
    // Generate some fake initial comments based on the pin's ID
    const mockComments = [
      { id: 1, text: "This is absolutely stunning! Love the lighting.", user: "photo_lover", avatar: "https://ui-avatars.com/api/?name=PL&background=random" },
      { id: 2, text: "Cannot wait to try this out myself.", user: "creative_mind", avatar: "https://ui-avatars.com/api/?name=CM&background=random" },
      { id: 3, text: "Where was this taken? The composition is perfect.", user: "wanderer", avatar: "https://ui-avatars.com/api/?name=W&background=random" },
    ];
    // Randomize slightly
    setComments(mockComments.slice(0, (pin.id % 3) + 1));
  }, [pin.id]);

  // Handle clicking outside the modal content
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('pin-modal-overlay')) {
      onClose();
    }
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      text: commentText,
      user: "Current User",
      avatar: "https://ui-avatars.com/api/?name=CU&background=000&color=fff"
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

  if (!pin) return null;

  return (
    <div className="pin-modal-overlay" onClick={handleBackdropClick}>
      <button className="pin-modal-close-btn" onClick={onClose} aria-label="Close modal">
        ✕
      </button>

      <div className="pin-modal-content">
        <div className="pin-modal-left">
          <img src={pin.image} alt={pin.title} className="pin-modal-image" />
        </div>

        <div className="pin-modal-right">
          <div className="pin-modal-header">
            <div className="pin-modal-actions">
              <button className="icon-btn" aria-label="Share">↗</button>
              <button className="icon-btn" aria-label="More">⋯</button>
            </div>
            <button 
              className={`save-btn ${isSaved ? 'saved' : ''}`}
              onClick={() => setIsSaved(!isSaved)}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>

          <div className="pin-modal-scrollable">
            <h1 className="pin-modal-title">{pin.title}</h1>
            <p className="pin-modal-description">
              A detailed view showcasing the visual beauty of {pin.title}. 
              This pin contains diverse tags such as {pin.tags ? pin.tags.join(', ') : 'inspiration'} 
              and has captured the attention of many enthusiasts across the platform.
            </p>

            <div className="pin-modal-author">
              <img 
                src={`https://ui-avatars.com/api/?name=${pin.author || 'User'}&background=random`} 
                alt="author avatar" 
                className="author-avatar" 
              />
              <div className="author-info">
                <span className="author-name">{pin.author || 'Anonymous'}</span>
                <span className="author-followers">{Math.floor(Math.random() * 10) + 1}k followers</span>
              </div>
              <button className="follow-btn">Follow</button>
            </div>

            <div className="pin-modal-comments-section">
              <h3 className="comments-heading">Comments ({comments.length})</h3>
              
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">No comments yet. Add one to start the conversation.</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="comment-item">
                      <img src={c.avatar} alt="user avatar" className="comment-avatar" />
                      <div className="comment-body">
                        <span className="comment-author">{c.user}</span>
                        <span className="comment-text">{c.text}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="pin-modal-footer">
            <p className="interaction-stats">
              <span className="likes-count">
                <b>{pin.likes + (isLiked ? 1 : 0)}</b> likes
              </span>
              <button 
                className={`like-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                {isLiked ? '♥ Liked' : '♡ Like'}
              </button>
            </p>
            <form className="comment-input-area" onSubmit={handlePostComment}>
              <img 
                src="https://ui-avatars.com/api/?name=CU&background=000&color=fff" 
                alt="Current user" 
                className="current-user-avatar" 
              />
              <input 
                type="text" 
                placeholder="Add a comment" 
                className="comment-input"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              {commentText.trim() && (
                <button type="submit" className="post-comment-btn">Post</button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
