import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import Card from "../../shared/components/UIElements/Card";

import "./PlaceDetails.css";
import GallerySlider from "../../shared/components/UIElements/GallerySlider";

const PlaceDetails = () => {
    const auth = useContext(AuthContext);
    const { pid } = useParams(); // Get the place ID from the URL
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [placeDetails, setPlaceDetails] = useState(null);
    const [comments, setComments] = useState([]);
    const [replyText, setReplyText] = useState({});
    const [openReplyBox, setOpenReplyBox] = useState(null);
    const [formState, inputHandler] = useForm(
        {
          text: {
            value: "",
            isValid: false
          }
        }, false
    );
    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/${pid}`);
                setPlaceDetails(responseData.place);
            } catch(err) {
                console.log(err);
            }
        };
        
        fetchPlaceDetails();
    }, [sendRequest, pid]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/comments/place/${pid}`);
                setComments(responseData.comments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    }, [sendRequest, pid])

    // Function to add a new comment
    /* const addComment = async (newComment) => {
        try {
            const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/comments', 'POST', JSON.stringify({
                userId: auth.userId,
                text: newComment,
                createdAt: Date.now
            }), {
                Authorization: 'Bearer ' + auth.token
            });
            setComments([...comments, responseData.comment]);
        } catch (error) {

          console.error('Error adding comment:', error);
        }
    }; */

    const toggleReplyBox = (commentId) => {
        setOpenReplyBox((prevId) => (prevId === commentId ? null : commentId));
    };
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/comments', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ placeId: pid, userId: auth.userId, text: formState.inputs.text.value }),
            });
            const data = await response.json();
            setComments((prevcomments) => [ ...prevcomments, data.comment]);
        } catch(err) {
            console.log(err);
        }
    };

    const handleReplySubmit = async (commentId) => {
        const reply = replyText[commentId];
        const user = auth.userId;
        if (!reply) return;
    
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/comments/${commentId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user, reply }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Reply failed");
        
            // Update replies in state
            setComments((prev) =>
                prev.map((c) =>
                c._id === commentId ? { ...c, replies: data.replies } : c
                )
            );
    
            setReplyText((prev) => ({ ...prev, [commentId]: "" }));
        } catch (err) {
            console.error("Error adding reply:", err);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/comments/${commentId}`, {
                method: "DELETE",
            });
        
            if (!response.ok) throw new Error("Failed to delete comment");
        
            // ✅ Remove the deleted comment from state
            setComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    if (!placeDetails) {
        return <div>Loading...</div>;
    }

    return (
        <React.Fragment>
            {isLoading && <div className="center"><LoadingSpinner /></div>}
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && <div className="place-details-container">
                <Card>
                    <div className="place-details-main">
                        <h1 className="center">{placeDetails.title}</h1>
                        <div className="flex center">
                            <GallerySlider thumb images={placeDetails.images}></GallerySlider>
                        </div>
                        <p>{placeDetails.desc}</p>
                        {/* Add any other details */}
                    </div>
                    <hr/>
                    <div className="comments-list">
                        {comments.map((comment) => (
                            <div key={comment._id}>
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
                                            {auth.isLoggedIn && <Button size="small" text onClick={() => toggleReplyBox(comment._id)}>
                                                {openReplyBox === comment._id ? "Cancel" : "Reply"}
                                            </Button>}
                                            {auth.isLoggedIn && auth.userId === comment.userId && <Button size="small" text onClick={() => handleDelete(comment._id)}>Delete</Button>}
                                        </div>
                                    </div>
                                </div>
                                {/* Show replies */}
                                <ul className="reply-list">
                                    {comment.replies?.map((r, i) => (
                                        <li key={i} className="flex">
                                            <div className="avatar">
                                                <img src={`${process.env.REACT_APP_ASSETS_URL}/${r.userImg}`} alt={r.userName}></img>
                                            </div>
                                            <div className="user-details">
                                                <strong>{r.userName}</strong>
                                                &nbsp;&nbsp;
                                                <small>{new Date(r.createdAt).toLocaleString()}</small>
                                                <br />
                                                {r.reply}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {auth.isLoggedIn && openReplyBox === comment._id && <div className="reply-section">
                                    <form className='reply-form'>
                                        <textarea
                                        type="text"
                                        rows="3"
                                        placeholder="Your reply..."
                                        value={replyText[comment._id] || ""}
                                        onChange={(e) =>
                                            setReplyText({ ...replyText, [comment._id]: e.target.value })
                                        }
                                        />
                                        <Button size="small" text onClick={() => handleReplySubmit(comment._id)}>Reply</Button>
                                    </form>
                                </div>}
                            </div>
                        ))}
                    </div>
                    {auth.isLoggedIn && <div className="comment-section">
                        <form className='comment-form' onSubmit={handleSubmit}>
                            <Input
                            id="text"
                            element="textarea"
                            placeholder="Add your comment.."
                            validators={[VALIDATOR_MINLENGTH(3)]}
                            errorText="Please enter a valid comment."
                            onInput={inputHandler}
                            />
                            <Button type="submit" disabled={!formState.isValid}>Post Comment</Button>
                        </form>
                    </div>}
                </Card>
            </div>}
        </React.Fragment>
    );
};

export default PlaceDetails;
