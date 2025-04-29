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
import CommentItem from "../components/CommentItem";
import StarSelector from "../../shared/components/UIElements/StarSelector";
import AverageRating from "../../shared/components/UIElements/AverageRating";

const PlaceDetails = () => {
    const auth = useContext(AuthContext);
    const { pid } = useParams(); // Get the place ID from the URL
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [placeDetails, setPlaceDetails] = useState(null);
    const [comments, setComments] = useState([]);
    const [openRep, setOpenRep] = useState(null);
    const [replyText, setReplyText] = useState({});
    const [rating, setRating] = useState(0);
    const [formState, inputHandler] = useForm(
        {
          text: {
            value: "",
            isValid: false
          }
        }, false
    );
    useEffect(() => {
        if (comments.length === 0) return;
      
        const hash = window.location.hash;
        if (hash) {
          const el = document.querySelector(hash);
          if (el) {
            setTimeout(() => {
              el.scrollIntoView({ behavior: 'smooth' });
            }, 500); // slight delay to ensure element is mounted
          }
        }
    }, [comments]);
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

    const handleRatingSubmit = async (event) => {
        event.preventDefault();

        if (rating === 0) {
            alert('Please select a rating before submitting!');
            return;
        }

        console.log(auth.userId, pid, rating, auth.token);

        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/places/${pid}/like`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                },
                body: JSON.stringify({
                    userId: auth.userId,
                    rating
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to submit rating.');
            }

            alert('Thanks for your rating!');
            setRating(0);

        } catch (err) {
            console.log(err);
            alert('Something went wrong.', err);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/comments/${commentId}`, {
                method: "DELETE",
            });
        
            if (!response.ok) throw new Error("Failed to delete comment");
        
            // Remove the deleted comment from state
            setComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleRepBox = (openReplyBox) => {
        setOpenRep(openReplyBox);
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
                        <div className="flex center">
                            <GallerySlider thumb images={placeDetails.images}></GallerySlider>
                        </div>
                        <h1>{placeDetails.title}</h1>
                        <AverageRating averageRating={placeDetails.averageRating}></AverageRating>
                        <p>{placeDetails.desc}</p>
                        <hr/>
                        {auth.isLoggedIn && <form onSubmit={handleRatingSubmit}>
                            <StarSelector onRatingChange={setRating} />
                            <Button text type="submit">Submit</Button>
                            <hr/>
                        </form>}
                    </div>
                    <div className="comments-list">
                        {comments.map((comment) => (
                            <div key={comment._id} id={`comment-${comment._id}`}>
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    userId={auth.userId}
                                    onDel={handleDelete}
                                    onRep={handleRepBox}
                                />
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
                                {auth.isLoggedIn && openRep === comment._id && <div className="reply-section">
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
