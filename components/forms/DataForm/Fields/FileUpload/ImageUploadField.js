import React, {useEffect, useState} from 'react';
import {useDropzone} from "react-dropzone";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import ReactCrop from "react-image-crop";
import {Button} from "react-bootstrap";
import {getAcceptedFileExtString, getAcceptedMimeTypesString, isNotEmpty} from "../../../../../library/utils";

function ImageUploadField({
                              dataImageSrc,
                              name,
                              description = null,
                              showDropzone = true,
                              dropzoneMessage = null,
                              acceptedFilesMessage = null,
                              callback,
                              arrayFieldIndex = false,
                              value = null
                          }) {
    const [model, setModal] = useState(false);
    const [imageSrc, setImageSrc] = useState(dataImageSrc || value || "https://via.placeholder.com/150");
    const [imageRef, setImageRef] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [image, setImage] = useState({});
    const defaultImageCrop = {
        unit: 'px',
        width: 150,
        height: 150,
    }
    const [imageCrop, setImageCrop] = useState(defaultImageCrop);
    const allowedFileTypes = [
        {
            mime_type: "'image/jpg",
            extension: "jpg"
        },
        {
            mime_type: "'image/jpeg",
            extension: "jpeg"
        },
        {
            mime_type: "image/png'",
            extension: "png"
        },
    ]

    const handleModalClose = () => {
        setModal(false);
    }

    const onSelectFile = (acceptedFiles) => {
        const getFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setImage(getFiles.length > 0 ? getFiles[0] : {});
        setModal(true)
    };

    // If you setState the crop in here you should return false.
    const onImageLoaded = async (image) => {
        setImageRef(image)
        const crop = {...defaultImageCrop, ...{x: 0, y: 0}}
        const croppedImageObject = await getCroppedImg(
            image,
            crop,
            image.type
        );
        setCroppedImage(croppedImageObject)
    };

    const onCropComplete = crop => {
        makeClientCrop(crop);
    };

    const onCropChange = (crop, percentCrop) => {
        setImageCrop(crop)
    };

    const makeClientCrop = async (crop) => {
        if (imageRef && crop.width && crop.height) {
            const croppedImageObject = await getCroppedImg(
                imageRef,
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
        // console.log(ctx.toDa)
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
        accept: getAcceptedMimeTypesString(allowedFileTypes),
        maxFiles: 1,
        onDrop: onSelectFile
    });
    useEffect(() => {
        if (isNotEmpty(value) && !(value instanceof File)) {
            setImageSrc(value);
        }
    }, [value]);

    return (
        <section>
            <Row className={"align-items-center"}>
                <Col sm={12} md={3} lg={3}>
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input {...getInputProps()} />
                        <Image src={imageSrc} roundedCircle/>
                    </div>
                </Col>
                <Col sm={12} md={9} lg={9}>
                    {showDropzone
                        ?
                        <div className={"dropzone-area"}>
                            {dropzoneMessage &&
                            <p>{dropzoneMessage}</p>
                            }
                            {acceptedFilesMessage &&
                            <em>{`(${getAcceptedFileExtString(allowedFileTypes, acceptedFilesMessage)}`}</em>
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
                                        src={image.preview}
                                        crop={imageCrop}
                                        ruleOfThirds
                                        onImageLoaded={onImageLoaded}
                                        onComplete={onCropComplete}
                                        onChange={onCropChange}
                                        maxWidth={150}
                                        maxHeight={150}
                                        circularCrop={true}
                                        // imageStyle={{
                                        //     height: "300px"
                                        // }}
                                    />
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