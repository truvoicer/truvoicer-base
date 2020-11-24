import React, {useState} from 'react';
import {useDropzone} from "react-dropzone";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {isNotEmpty} from "../../../../../library/utils";

function FileUploadField({name, callback, arrayFieldIndex = false, value = null, allowedFileTypes = null}) {
    const [uploadedFile, setUploadedFile] = useState({});

    const getAcceptedMimeTypes = () => {
        if (allowedFileTypes === null) {
            return '';
        }
        return allowedFileTypes.map(type => type.mime_type).join(", ");
    }
    const getAcceptedFileExtensions = () => {
        if (allowedFileTypes === null) {
            return '';
        }
        return allowedFileTypes.map(type => type.extension).join(", ");
    }

    const onSelectFile = (acceptedFiles) => {
        const getFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        const getFile = getFiles.length > 0 ? getFiles[0] : {};
        setUploadedFile(getFile);
        callback(name, getFile, arrayFieldIndex)
    };

    const {getRootProps, getInputProps} = useDropzone({
        accept: getAcceptedMimeTypes(),
        maxFiles: 1,
        onDrop: onSelectFile
    });
    return (
        <section>
            <Row className={"align-items-center"}>
                <Col sm={12} md={7} lg={7}>
                    <>
                        {isNotEmpty(value) && <>Saved File: <a href={value} target={"_blank"}>Click here to
                            download</a></>}
                        <div {...getRootProps({className: 'dropzone'})}>

                            <div className={"dropzone-area"}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                                <em>{`(Only ${getAcceptedFileExtensions()}  images will be accepted)`}</em>
                            </div>
                        </div>
                    </>
                </Col>
            </Row>
        </section>
    );
}

export default FileUploadField;