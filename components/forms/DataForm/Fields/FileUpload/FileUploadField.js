import React, {useState} from 'react';
import {useDropzone} from "react-dropzone";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {getAcceptedFileExtString, getAcceptedMimeTypesString, isNotEmpty} from "../../../../../library/utils";

function FileUploadField({
                             name,
                             description = null,
                             showDropzone = true,
                             dropzoneMessage = null,
                             acceptedFilesMessage = null,
                             callback,
                             arrayFieldIndex = false,
                             value = null,
                             allowedFileTypes = null
                         }) {
    const [, setUploadedFile] = useState({});

    const onSelectFile = (acceptedFiles) => {
        const getFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        const getFile = getFiles.length > 0 ? getFiles[0] : {};
        setUploadedFile(getFile);
        callback(name, getFile, arrayFieldIndex)
    };

    const {getRootProps, getInputProps, open} = useDropzone({
        accept: getAcceptedMimeTypesString(allowedFileTypes),
        maxFiles: 1,
        onDrop: onSelectFile
    });
    return (
        <section>
            <Row className={"align-items-center"}>
                <Col sm={12} md={12} lg={12}>
                    <>
                        {isNotEmpty(value) && !value instanceof File && (
                            <>
                                Saved File:
                                <a href={value} target={"_blank"}>Click here to download</a>
                            </>
                        )}
                        <div {...getRootProps({className: 'dropzone'})}>
                            {showDropzone
                                ?
                                <div className={"dropzone-area"}>
                                    <input {...getInputProps()} />
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
                        </div>
                    </>
                </Col>
            </Row>
        </section>
    );
}

export default FileUploadField;