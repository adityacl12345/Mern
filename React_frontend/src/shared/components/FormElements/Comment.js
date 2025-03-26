import React, { useState } from 'react';

import Button from './Button';
// The Comment component
const Comment = ({ addComment }) => {
  const [comment, setComment] = useState('');

  // Handle comment submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      addComment(comment);
      setComment(''); // Clear the input after submission
    }
  };

  return (
    <div className="comment-section">
      <form className='place-form' onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
        />
        <Button type="submit">Post Comment</Button>
      </form>
    </div>
  );
};

export default Comment;