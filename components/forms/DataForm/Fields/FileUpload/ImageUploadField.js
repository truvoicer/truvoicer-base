import React, {createRef, useEffect, useState} from 'react';
import {useDropzone} from "react-dropzone";
import Image from "react-bootstrap/Image";
import NextImage from "next/image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import ReactCrop from "react-image-crop";
import {Button} from "react-bootstrap";
import {getAcceptedFileExtString, getAcceptedMimeTypesObject, isNotEmpty} from "../../../../../library/utils";

function ImageUploadField({
    dataImageSrc,
    name,
    description = null,
    showDropzone = true,
    imageCropper = false,
    imageCropperWidth = 150,
    imageCropperHeight = 150,
    circularCrop= false,
    dropzoneMessage = 'Drop image here',
    acceptedFileTypesMessage = '(Only image files are accepted)',
    callback,
    arrayFieldIndex = false,
    allowedFileTypes = [],
    value = null
}) {
    const [model, setModal] = useState(false);
    const [imageSrc, setImageSrc] = useState(dataImageSrc || value || "https://via.placeholder.com/150");
    const imageRef = createRef();
    const [croppedImage, setCroppedImage] = useState(null);
    const [image, setImage] = useState({});
    const defaultImageCrop = {
        unit: 'px',
        width: imageCropperWidth,
        height: imageCropperHeight,
    }
    const defaultAllowedFileTypes = [
        {
            mime_type: "image/jpg",
            extension: "jpg"
        },
        {
            mime_type: "image/jpeg",
            extension: "jpeg"
        },
        {
            mime_type: "image/png'",
            extension: "png"
        },
    ]
    const [imageCrop, setImageCrop] = useState(defaultImageCrop);
    function getAllowedFileTypes() {
        if (allowedFileTypes.length === 0) {
            return defaultAllowedFileTypes;
        }
        return allowedFileTypes;
    }
    const handleModalClose = () => {
        setModal(false);
    }

    const onSelectFile = (acceptedFiles) => {
        const getFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setImage(getFiles.length > 0 ? getFiles[0] : {});
        if (imageCropper) {
            setModal(true)
            return;
        }
        setImageSrc(getFiles[0]?.preview);
        callback(name, getFiles[0], arrayFieldIndex)
    };

    // If you setState the crop in here you should return false.
    const onImageLoaded = async (image) => {
        const crop = {...defaultImageCrop, ...{x: 0, y: 0}}
        if (image?.target && crop.width && crop.height) {
            const croppedImageObject = await getCroppedImg(
                image.target,
                crop,
                image.type
            );
            setCroppedImage(croppedImageObject)
        }
    };

    const onCropComplete = crop => {
        makeClientCrop(crop);
    };

    const onCropChange = (crop, percentCrop) => {
        setImageCrop(crop)
    };

    const makeClientCrop = async (crop) => {
        if (imageRef?.current && crop.width && crop.height) {
            const croppedImageObject = await getCroppedImg(
                imageRef.current,
                crop,
                image.type
            );
            setCroppedImage(croppedImageObject)
        }
    }

    const getCroppedImg = (image, crop, type) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                resolve({
                    blob: blob,
                    url: window.URL.createObjectURL(blob)
                });
            }, type);
        });
    }
    const cropSubmitHandler = (e) => {
        if (croppedImage === null) {
            return;
        }
        let blob = croppedImage.blob;
        setImageSrc(croppedImage.url);

        const fileName = `${name}.${image.type.replace("image/", "")}`
        blob.name = fileName;

        const file = new File([blob], fileName, {type: image.type})
        callback(name, file, arrayFieldIndex)
        setModal(false);
    }

    const {getRootProps, getInputProps, open} = useDropzone({
        accept: getAcceptedMimeTypesObject(getAllowedFileTypes()),
        maxFiles: 1,
        onDrop: onSelectFile
    });
    useEffect(() => {
        if (isNotEmpty(value) && !(value instanceof File)) {
            setImageSrc(value);
        }
    }, [value]);


    return (
        <section className={'form--file-upload form--file-upload--image'}>
            <Row className={"align-items-center"}>
                <Col sm={12} md={3} lg={3} >
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input {...getInputProps()} />
                        <img src={imageSrc} />
                    </div>
                </Col>
                <Col sm={12} md={9} lg={9}>
                    {showDropzone
                        ?
                        <div className={"dropzone-area"}>
                            {dropzoneMessage &&
                                <p>{dropzoneMessage}</p>
                            }
                            {acceptedFileTypesMessage &&
                                <em>{`${getAcceptedFileExtString(getAllowedFileTypes(), acceptedFileTypesMessage)}`}</em>
                            }
                        </div>
                        :
                        <>
                            <input {...getInputProps()} />
                            <button type="button" onClick={open}>
                                Browse
                            </button>
                        </>
                    }
                </Col>
            </Row>
            <Modal
                show={model}
                onHide={handleModalClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                size="md"
                centered
            >
                {image && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Image Cropper
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col sm={12} md={6} lg={6}>
                                    <ReactCrop
                                        crop={imageCrop}
                                        ruleOfThirds
                                        onComplete={onCropComplete}
                                        onChange={onCropChange}
                                        maxWidth={150}
                                        maxHeight={150}
                                        circularCrop={circularCrop}
                                        // imageStyle={{
                                        //     height: "300px"
                                        // }}
                                    >

                                        <NextImage ref={imageRef} width={200} height={200} src={image.preview}
                                                   onLoad={onImageLoaded} alt="Preview" style={{maxWidth: "100%"}}/>
                                    </ReactCrop>
                                </Col>
                                <Col sm={12} md={6} lg={6}>
                                    <p>
                                        Cropping instructions
                                    </p>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={cropSubmitHandler}
                            >
                                Crop Image
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </section>
    );
}

export default ImageUploadField;
