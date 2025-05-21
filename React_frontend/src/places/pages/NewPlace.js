import React, { useContext, useEffect, useRef, useState } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import './NewPlace.css';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHistory } from 'react-router-dom';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [placeImages, setPlaceImages] = useState([]);

  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      desc: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
    }, false
  );

  // Attach Google Autocomplete
  useEffect(() => {
    if (!window.google || !addressInputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(addressInputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'in' } // Change to your desired country code
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        inputHandler('address', place.formatted_address, true);
      }
    });
  }, [inputHandler]);

  const handleImagesInput = (id, files, isValid) => {
    if (isValid) {
      setPlaceImages(files);
    }
  };

  const submitHandler = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', formState.inputs.title.value);
    formData.append('desc', formState.inputs.desc.value);
    formData.append('address', formState.inputs.address.value);
    placeImages.forEach(img => formData.append('images', img));
    console.log(formData);
    try {
      await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places', 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      });
      history.push('/');
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {isLoading && <div className="center"><LoadingSpinner /></div>}
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={submitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="desc"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <div className="form-control">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            ref={addressInputRef}
            placeholder="Search for a location"
          />
        </div>
        {/* <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        /> */}
        <ImageUpload place multiple id="images" onInput={handleImagesInput} />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
