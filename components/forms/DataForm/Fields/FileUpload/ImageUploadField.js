import React, {useState} from 'react';
import {useDropzone} from "react-dropzone";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import ReactCrop from "react-image-crop";
import {Button} from "react-bootstrap";

function ImageUploadField({dataImageSrc, name, callback, arrayFieldIndex = false}) {
    const [model, setModal] = useState(false);
    const [imageSrc, setImageSrc] = useState(dataImageSrc || "https://via.placeholder.com/150");
    const [imageRef, setImageRef] = useState(null);
    const [croppedImageSrc, setCroppedImageSrc] = useState(null);
    const [image, setImage] = useState({});
    const [imageCrop, setImageCrop] = useState({
        unit: 'px',
        width: 150,
        height: 150,
    });

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
    };

    const onCropComplete = crop => {
        makeClientCrop(crop);
    };

    const onCropChange = (crop, percentCrop) => {
        setImageCrop(crop)
    };

    const makeClientCrop = async (crop) => {
        if (imageRef && crop.width && crop.height) {
            console.log(imageRef)
            const croppedImageUrl = await getCroppedImg(
                imageRef,
                crop,
                'newFile.jpeg'
            );
            setCroppedImageSrc(croppedImageUrl)
        }
    }

    const getCroppedImg = (image, crop, fileName) => {
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
                blob.name = fileName;
                // window.URL.revokeObjectURL(this.fileUrl);
                let fileUrl;
                fileUrl = window.URL.createObjectURL(blob);
                resolve(fileUrl);
            }, 'image/jpeg');
        });
    }
    const cropSubmitHandler = (e) => {
        setImageSrc(croppedImageSrc);
        callback(name, croppedImageSrc, arrayFieldIndex)
        setModal(false);
    }

    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/jpeg, image/png',
        maxFiles: 1,
        onDrop: onSelectFile
    });

    return (
        <section>
            <Row className={"align-items-center"}>
                <Col sm={12} md={3} lg={3}>
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <Image src={imageSrc} roundedCircle />
                    </div>
                </Col>
                <Col sm={12} md={9} lg={9}>
                    <p>Drag 'n' drop some files here, or click to select files</p>
                    <em>(Only *.jpeg and *.png images will be accepted)</em>
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
                                    imageStyle={{
                                        height: "300px"
                                    }}
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