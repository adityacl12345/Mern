import React, { useEffect, useRef, useState } from 'react';

import Button from './Button';

import './ImageUpload.css';



const ImageUpload = props => {
    const [file, setFile] = useState();
    const [prevUrl, setPrevUrl] = useState();
    const [isValid, setIsValid] = useState(false);
    const filePickRef = useRef();

    useEffect(() => {
        if(!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPrevUrl(fileReader.result)
        };
        fileReader.readAsDataURL(file);
    },[file]);

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
        if(event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false
        }
        props.onInput(props.id, pickedFile, fileIsValid )
    };
    const pickImgHandler = () => {
        filePickRef.current.click();
    }
    return (
        <div className='form-control'>
            <input id={props.id} ref={filePickRef} type='file' style={{display: 'none'}} accept='.jpg,.png,.jpeg' onChange={pickedHandler}/>
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {prevUrl && <img src={prevUrl} alt='Preview'/>}
                </div>
                <Button type="button" onClick={pickImgHandler}>Pick Image</Button>
            </div>
        </div>
    );
};

export default ImageUpload;