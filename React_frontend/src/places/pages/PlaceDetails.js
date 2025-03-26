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

const PlaceDetails = () => {
    const auth = useContext(AuthContext);
    const { pid } = useParams(); // Get the place ID from the URL
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [placeDetails, setPlaceDetails] = useState(null);
    const [comments, setComments] = useState([]);
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
                        <h1>{placeDetails.title}</h1>
                        <img src={`${process.env.REACT_APP_ASSETS_URL}/${placeDetails.image}`} alt={placeDetails.title} />
                        <p>{placeDetails.desc}</p>
                        {/* Add any other details */}
                    </div>
                    <hr/>
                    <div className="comments-list">
                        {comments.map((comment) => (
                        <div key={comment._id}>
                            <strong>{comment.userName}</strong>: {comment.text}
                        </div>
                        ))}
                    </div>
                    {auth.isLoggedIn && <div className="comment-section">
                        <form className='place-form' onSubmit={handleSubmit}>
                            <Input
                            id="text"
                            label="Add a comment..."
                            element="textarea"
                            rows="3"
                            validators={[VALIDATOR_MINLENGTH(5)]}
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
