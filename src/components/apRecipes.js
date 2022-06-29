/*eslint-disable eqeqeq*/
import React, { useState, useRef } from 'react';
import HeaderAp from './apHeader';
import BasicInput from './apInput';
import axios from 'axios';
import Webcam from "react-webcam";
import { motion } from "framer-motion"

const Receipe = (props) => {
    const [inputValue, setInputValue] = useState({ theName: '', ingredients: '', instructions: '' });
    const { ingredients, instructions, theName } = inputValue;
    const [upd, setUpd] = useState(false);
    const [updated, setUpdate] = useState(false);
    const [file, setFile] = useState('')
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [imgU, setImgUpd] = useState(false);
    const [warn, setWarn] = useState(false);
    const [web, setWeb] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const [imageUpload, setImgUpload] = useState(false);
    const webcamRef = useRef(null);
    const inputFileRef = useRef();
    const [uploadT, setUploadP] = useState(0);

    const goBack = () => {
        props.backk(true);
    }

    const fileSelected = e => {
        setFile(e.target.files[0]);
        setImgUpload(false);
        setWeb(false)
        setImgSrc(null);
    }

    const act = () => {
        let nam;

        if (inputValue.theName) {
            nam = inputValue.theName;
        } else if (props.recipe[0] != undefined) {
            nam = props.recipe[0].NAME;
        }

        return props.display == 'add' ? 'Add Recipe' : nam;
    }

    const details = {
        cloud_name: "doahdwsqv",
        api_key: "541172485413837",
        api_secret: "CKwlZyuuGlOUG9OVFMskDnIuhCM",
        upload: "https://api.cloudinary.com/v1_1/doahdwsqv/upload",
        folder: 'foodi'
    }

    const handleSave = async e => {
        e.preventDefault();
        let imgUpdt = false;

        // Check if all values are filled in. 
        if (theName == '' || ingredients == '' || instructions == '') {
            return setMessage('Please fill in all fields');
        }

        if (file != '' || imgSrc != null) {
            imgUpdt = true;
        }
        if (upd) {
            if (imgUpdt) {
                let formData;

                if (imgSrc !== null) {
                    // Camera Image Upload
                    formData = new FormData();
                    formData.append('file', imgSrc);
                } else {
                    // Gallery Image Upload
                    formData = new FormData();
                    formData.append('file', file);
                }

                formData.append('api_key', details.api_key);
                formData.append('folder', details.folder);
                formData.append('upload_preset', 'rkg8ctfb');

                try {

                    await axios.post(details.upload, formData, {
                        onUploadProgress: ProgressEvent => {
                            setUploadP(parseInt(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)))
                            setTimeout(() => setUploadP(0), 3000);
                        }
                    })
                        .then((res) => {
                            const { secure_url } = res.data;

                            setUploadedFile({ secure_url });
                            setImgUpd(true);

                            axios.post('https://foodeii.herokuapp.com/api/update/recipe', { values: inputValue, recipeID: props.recipe[0].ID, img: secure_url, })
                        })
                        .catch((err) => {
                            console.log(err);
                        })

                } catch (err) {
                    if (err.response.status === 500) {
                        console.log('There was an problem with the server')
                        return setMessage('There was an problem with the server')
                    } else {
                        console.log(err.response.data.msg);
                    }

                    let dt = err.response.data.msg;

                    return setMessage(dt.toString())
                }

            } else {
                axios.post('https://foodeii.herokuapp.com/api/update/recipe', { values: inputValue, recipeID: props.recipe[0].ID })
            }

            setUpd(false);
            setUpdate(true);

        } else {
            let formData;

            if (imgSrc !== null) {
                // Camera Image Upload
                formData = new FormData();
                formData.append('file', imgSrc);
            } else {
                // Gallery Image Upload
                formData = new FormData();
                formData.append('file', file);
            }

            formData.append('api_key', details.api_key);
            formData.append('folder', details.folder);
            formData.append('upload_preset', 'rkg8ctfb');

            try {
                await axios.post(details.upload, formData, {
                    onUploadProgress: ProgressEvent => {
                        setUploadP(parseInt(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)))
                        setTimeout(() => setUploadP(0), 3000);
                    }
                })
                    .then((res) => {
                        const { secure_url } = res.data;

                        axios.post('https://foodeii.herokuapp.com/api/insertRecipe', { values: inputValue, userID: props.userID, img: secure_url }).then((response) => {
                            goBack();
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            } catch (err) {
                if (err.response.status === 500) {
                    console.log('There was an problem with the server')
                } else {
                    console.log(err.response.data.msg);
                }

                console.log(err);
                return
            }
            goBack();
        }
    }

    const handleCancel = () => {
        setUpd(false);
        setUpdate(true);
    }

    const handleDelete = async () => {
        if (warn) {
            await axios.delete('https://foodeii.herokuapp.com/api/delete/rec', { data: { id: props.recipe[0].ID } }).then((response) => {
                goBack();
            })
        } else {
            setWarn(true);
            alert('You will not be able to restore this recipe after deleting.')
        }
    }

    const handleUpdate = (e) => {

        setUpd(true);

        if (updated) {
            setInputValue((prev) => ({
                ...prev,
                theName: inputValue.theName,
                ingredients: inputValue.ingredients,
                instructions: inputValue.instructions,
            }));
        } else {
            setInputValue((prev) => ({
                ...prev,
                theName: props.recipe[0].NAME,
                ingredients: props.recipe[0].INGREDIENTS,
                instructions: props.recipe[0].INSTRUCTIONS,
            }));
        }
    }

    const breakLines1 = (data, v) => {
        let arr = data.split('\n');

        var filtered = arr.filter(function (el) {
            return el != '';
        });

        return filtered.map((val, u) => <li className={v ? 'not-li' : 'li'} key={u}>{val}</li>)
    }

    const breakLines = (data, v) => {
        let arr = data.split(/\r?\n/);

        var filtered = arr.filter(function (el) {
            return el != '';
        });

        return filtered.map((val, u) => <li className={v ? 'not-li' : 'li'} key={u}>{val}</li>)
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        setInputValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setImgUpload(true);
        setFile('');
    }

    const container = {
        hidden: { opacity: 0, x: -100 },
        show: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring', damping: 10, stifness: 100, duration: 1
            }
        }
    }

    const videoConstraints = {
        facingMode: "environment"
      };

    return (
        <>
            <HeaderAp title={act()} goBack={goBack} />

            {props.display == 'add' || (props.display == 'show' && upd) ?

                <motion.div variants={container} initial="hidden" animate="show" >
                    <input type='file' ref={inputFileRef} name='fil' id='fil' onChange={fileSelected} />

                    <div className='flex-inline'>

                        <button className="cssbuttons-io-button btn-save" onClick={() => setWeb(true)}> Camera
                            <div className="icon">
                                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                            </div>
                        </button>

                        <button className="cssbuttons-io-button btn-save" onClick={() => inputFileRef.current.click()}> Gallery
                            <div className="icon">
                                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                            </div>
                        </button>
                    </div>

                    <div className='images-cont'>
                        {web ?
                            <div className='image-preview image-both'>
                                <h3>Preview</h3>
                                <div className='relative'>
                                    <svg onClick={capture} xmlns="http://www.w3.org/2000/svg" id="svg_1" enableBackground="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><circle cx="256" cy="256" fill="#32bea6" r="256" /><path d="m406 335.508c0 27.091-22.031 49.122-49.123 49.122h-201.751c-27.09 0-49.126-22.033-49.126-49.122v-130.978c0-27.091 22.036-49.117 49.126-49.117h27.906c6.887 0 12.501-5.615 12.501-12.501v-4.839c0-16.933 13.765-30.705 30.699-30.705h59.539c16.935 0 30.699 13.771 30.699 30.705v4.839c0 6.885 5.616 12.501 12.501 12.501h27.906c27.091 0 49.123 22.025 49.123 49.117zm-149.998-156.366c-46.663 0-84.626 37.964-84.626 84.626 0 46.665 37.964 84.626 84.626 84.626s84.626-37.961 84.626-84.626c0-46.662-37.964-84.626-84.626-84.626zm0 149.251c35.637 0 64.625-28.985 64.625-64.625 0-35.637-28.988-64.625-64.625-64.625s-64.625 28.988-64.625 64.625c-.001 35.64 28.987 64.625 64.625 64.625z" fill="#fff" /></g></svg>
                                    <Webcam videoConstraints={videoConstraints} screenshotFormat="image/jpeg" ref={webcamRef} />
                                </div>
                            </div>
                            : null}

                        <div className='image-use image-both'>
                            {imgSrc || file ? <h3>Upload Preview</h3> : null}
                            {imgSrc && (<img src={imgSrc} alt="Preview of your camera" />)}
                            {file && (<img src={URL.createObjectURL(file)} alt="Preview of your camera" />)}
                        </div>
                    </div>

                    <BasicInput disp='inp' label="Name" name='theName' value={theName} onChange={handleChange} />
                    <BasicInput disp='text' placeholder="1 Line per Ingredient" label="Ingredients" name='ingredients' value={ingredients} onChange={handleChange} />
                    <BasicInput disp='text' placeholder="1 Line per Instruction" label="Instructions" name='instructions' value={instructions} onChange={handleChange} />

                    <p className='warning-message'>{message}</p>

                    {uploadT > 0 ? <p>{uploadT}%</p> : null}

                    <div className='flex-inline'>
                        <button className="cssbuttons-io-button btn-save" onClick={handleSave}> Save Recipe
                            <div className="icon">
                                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                            </div>
                        </button>


                        {upd ? <button className="cssbuttons-io-button btn-delete" onClick={handleCancel}> Cancel
                            <div className="icon">
                                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                            </div>
                        </button> : null}
                    </div>
                </motion.div>

                :

                <motion.div className="recipe-view" variants={container} initial="hidden" animate="show" >
                    <div className="recipe-half">
                        {updated && imgU ?
                            <img className='recipe-img' src={uploadedFile.secure_url} alt="dashboard" />
                            :
                            <img className='recipe-img' src={props.recipe[0].IMAGE} alt="dashboard" />
                        }
                    </div>

                    <div className="recipe-half">
                        <div className='recipe-relative'>
                            <h2 className='noMT text-center'>Ingredients</h2>

                            <ul>
                                {updated ?
                                    breakLines1(inputValue.ingredients, false)
                                    :
                                    breakLines(props.recipe[0].INGREDIENTS, false)
                                }

                            </ul>

                            <div className='recipe-glass'></div>
                        </div>

                        <div className='recipe-relative'>
                            <h2 className='noMT text-center'>Instructions</h2>
                            <ol>
                                {updated ?
                                    breakLines1(inputValue.instructions, true)
                                    :
                                    breakLines(props.recipe[0].INSTRUCTIONS, true)
                                }
                            </ol>

                            <div className='recipe-glass'></div>
                        </div>
                    </div>

                    <div className='flex-inline'>
                        <button className="cssbuttons-io-button btn-edit" onClick={handleUpdate}> Edit
                            <div className="icon">
                                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                            </div>
                        </button>

                        <button className="cssbuttons-io-button btn-delete" onClick={handleDelete}> Delete
                            <div className="icon">
                                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                            </div>
                        </button>
                    </div>
                </motion.div>
            }
        </>
    )


}

export default Receipe;