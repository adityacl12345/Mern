import React, { useEffect, useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';

import Button from './Button';

import './ImageUpload.css';

const ImageUpload = props => {
    const [files, setFiles] = useState([]);
    const [prevUrls, setPrevUrls] = useState([]);
    const [isValid, setIsValid] = useState(false);
    const filePickRef = useRef();

    useEffect(() => {
        if(!files || files.length === 0) {
            return;
        }
        const fileReaders = [];
        const imagePreviews = [];

        files.forEach((file, i) => {
            const reader = new FileReader();
            fileReaders.push(reader);

            reader.onload = () => {
                imagePreviews[i] = reader.result;
                if (imagePreviews.length === files.length) {
                    setPrevUrls([...imagePreviews]);
                }
            };

            reader.readAsDataURL(file);
        });
    },[files]);

    const pickedHandler = async (event) => {
        let selectedFiles = Array.from(event.target.files);
        let fileIsValid = selectedFiles.length > 0;

        if (!props.multiple) {
            selectedFiles = selectedFiles.slice(0,1);
        }

        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1024,
            useWebWorker: true
        };
        try {
            const compressedFiles = await Promise.all(
                selectedFiles.map(file => imageCompression(file, options))
            );
    
            setFiles(selectedFiles);
            setIsValid(fileIsValid);
            props.onInput(
                props.id, 
                props.multiple ? compressedFiles : compressedFiles[0], 
                fileIsValid 
            );
        } catch (error) {
            console.error('Image compression error:', error);
            setIsValid(false);
            props.onInput(props.id, null, false);
        }   
    };
    const pickImgHandler = () => {
        filePickRef.current.click();
    }
    return (
        <div className='form-control'>
            <input id={props.id} ref={filePickRef} type='file' style={{display: 'none'}} accept='.jpg,.png,.jpeg' onChange={pickedHandler} multiple={props.multiple}/>
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {!prevUrls.length && !props.profUrl && props.user && <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/images/default.png`} alt='Preview'/>}
                    {!prevUrls.length && !props.profUrl && props.place && <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/images/default-place.png`} alt='Preview'/>}
                    {props.profUrl && <img src={props.profUrl} alt='Profile'/>}
                    {prevUrls.map((url, index) => (
                        <img key={index} src={url} alt={`Preview ${index}`} />
                    ))}
                </div>
                <Button type="button" onClick={pickImgHandler}>{props.multiple ? "Pick Images" : "Pick Image"}</Button>
            </div>
        </div>
    );
};

export default ImageUpload;