import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
    const placeId = useParams().placeId;
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        desc: {
            value: '',
            isValid: false
        }
    }, false);

    useEffect(() => {
      const fetchPlace = async () => {
        try {
          const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
          setLoadedPlace(responseData.place);
          setFormData({
            title: {
              value: responseData.place.title,
              isValid: true
            },
            desc: {
                value: responseData.place.desc,
                isValid: true
            }
          }, true);
        } catch(err) {
          console.log(err);
        }
      };
      fetchPlace();
    }, [sendRequest, placeId, setFormData]);

    const updatesubmitHandler = async event => {
      event.preventDefault();
      console.log(formState.inputs);
      try {
        await sendRequest(`http://localhost:5000/api/places/${placeId}`, 'PATCH', 
          JSON.stringify({
            title: formState.inputs.title.value,
            desc: formState.inputs.description.value
          }),
          {
            'Content-type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );
        history.push(`/${auth.userId}/places`);
      } catch(err) {}
    };

    if(!loadedPlace && !error) {
      return (
        <div>
          <Card>
            <h2>Could Not Find any place!</h2>
          </Card>
        </div>
      );
    }

    return (
      <React.Fragment>
        {isLoading && <div className="center"><LoadingSpinner /></div>}
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && loadedPlace && <form className="place-form" onSubmit={updatesubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialisValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.desc}
            initialisValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>}
      </React.Fragment>
    );
};

export default UpdatePlace;