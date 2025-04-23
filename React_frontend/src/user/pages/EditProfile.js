import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const EditProfile = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const uid = auth.userId;
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedUser, setLoadedUser] = useState();
    const [formState, inputHandler, setFormData] = useForm({
        image: {
            value: null,
            isValid: false
        },
        name: {
            value: '',
            isValid: false
        },
        email: {
            value: '',
            isValid: false
        }
    }, false);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/users/${uid}`);
          setLoadedUser(responseData.user);
          setFormData({
            image: {
                value: responseData.user.image,
                isValid: true
            },
            name: {
              value: responseData.user.name,
              isValid: true
            },
            email: {
                value: responseData.user.email,
                isValid: true
            }
          }, true);
        } catch(err) {
          console.log(err);
        }
      };
      fetchUser();
    }, [sendRequest, uid, setFormData]);

    const updatesubmitHandler = async event => {
      event.preventDefault();
      try {
        const formData = new FormData();
        formData.append('image', formState.inputs.image.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('email', formState.inputs.email.value);
        await sendRequest(process.env.REACT_APP_BACKEND_URL + `/users/${uid}`, 'PATCH', 
          formData
        );
        history.push(`/users/${auth.userId}`);
      } catch(err) {}
    };

    if(!loadedUser && !error) {
      return (
        <div>
          <Card>
            <h2>Could Not Find any User!</h2>
          </Card>
        </div>
      );
    }

    return (
      <React.Fragment>
        {isLoading && <div className="center"><LoadingSpinner /></div>}
        <ErrorModal error={error} onClear={clearError} />
        <Card className="card-default">
        {!isLoading && loadedUser && <form className="user-form" onSubmit={updatesubmitHandler}>
            <ImageUpload user profUrl={`${process.env.REACT_APP_ASSETS_URL}/${loadedUser.image}`} center id="image" onInput={inputHandler} />
            <Input
                id="name"
                element="input"
                type="text"
                label="Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid Name."
                onInput={inputHandler}
                initialValue={loadedUser.name}
                initialisValid={true}
            />
            <Input
                id="email"
                element="input"
                label="Email"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email."
                onInput={inputHandler}
                initialValue={loadedUser.email}
                initialisValid={true}
            />
            <Button type="submit" disabled={!formState.isValid}>
                Update Profile
            </Button>
        </form>}
        </Card>
      </React.Fragment>
    );
};

export default EditProfile;