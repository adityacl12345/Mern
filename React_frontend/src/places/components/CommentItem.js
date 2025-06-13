import React, { useContext, useState } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";

const CommentItem = ({comment, userId, onDel, isReplyBoxOpen, onToggleReply}) => {
    const auth = useContext(AuthContext);
    const [likes, setLikes] = useState(comment.likes.length);
    const [likedByUser, setLikedByUser] = useState(comment.likes.includes(userId));
    
    const toggleLike = async (commentId) => {
        try {
            const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/comments/like/${commentId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }
            setLikes(data.likes);
            setLikedByUser((prev) => !prev);
        } catch (err) {
            console.error('Like failed:', err);
        }
    };
    
    return (
        <div className="comment-header flex">
            <div className="avatar">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/${comment.userImg}`} alt={comment.userName}></img>
            </div>
            <div className="user-details">
                <strong>{comment.userName}</strong>&nbsp;&nbsp;
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
                <br />
                {comment.text}
                <div className="comment-actions">
                     {auth.isLoggedIn && (
                        <Button size="small" text onClick={onToggleReply}>
                            {isReplyBoxOpen ? "Cancel" : "Reply"}
                        </Button>
                    )}
                    {auth.isLoggedIn && auth.userId === comment.userId && <Button size="small" text onClick={() => onDel(comment._id)}>Delete</Button>}
                    {auth.isLoggedIn && <Button size="small" text onClick={() => toggleLike(comment._id)}>
                        <span role="img" aria-label="like">{likedByUser ? '❤️' : '🤍'}{likes}</span>
                    </Button>}
                    {!auth.isLoggedIn && <span role="img" aria-label="like">❤️ {likes}</span>}
                </div>
            </div>
        </div>
    );
}

export default CommentItem;