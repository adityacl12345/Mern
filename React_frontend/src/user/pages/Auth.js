import React, { useContext, useState } from "react";

import './Auth.css';

import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
          email: {
            value: '',
            isValid: false
          },
          password: {
            value: '',
            isValid: false
          }
        }, false
    );

    const onSwitchHandler = () => {
        if(!isLogin) {
            setFormData({ 
                ...formState.inputs, 
                name: undefined,
                image: undefined
            },
            formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false);
        }
        setIsLogin(prevMode => !prevMode);
    };
    
    const submitHandler = async event => {
        event.preventDefault();
        if(isLogin) {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + `/users/login`,
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-type': 'application/json'
                    }
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) {
                console.log(err);
            }           
        } else {
            try {
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email', formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/users/signup',
                    'POST',
                    formData
                );
                auth.login(responseData.userId, responseData.token);
            } catch(err) {
                console.log(err);
            }
        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}></ErrorModal>
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
                <h2>Login Required</h2>
                <hr/>
                <form className="place-form" onSubmit={submitHandler}>
                    {!isLogin && (
                        <Input 
                        id="name" 
                        element="input" 
                        type="text" 
                        label="Your Name" 
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Name is required!"
                        onInput={inputHandler}
                        />
                    )}
                    {!isLogin && <ImageUpload user center id="image" onInput={inputHandler} />}
                    <Input
                    id="email"
                    element="input"
                    type="email"
                    label="E-mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid email."
                    onInput={inputHandler}
                    />
                    <Input
                    id="password"
                    type="password"
                    element="input"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(8)]}
                    errorText="Please enter a valid password (at least 8 characters)."
                    onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>{isLogin ? "LOGIN" : "SIGNUP"}</Button>
                </form>
                <Button inverse onClick={onSwitchHandler}>{isLogin ? "SIGNUP" : "LOGIN"}</Button>
            </Card>
        </React.Fragment>
    );
};

export default Auth;