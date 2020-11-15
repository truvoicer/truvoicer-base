import React, {useState} from 'react';
import {useDropzone} from "react-dropzone";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function FileUploadField({name, callback, arrayFieldIndex = false}) {
    const [uploadedFile, setUploadedFile] = useState({});

    const onSelectFile = (acceptedFiles) => {
        const getFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        const getFile = getFiles.length > 0 ? getFiles[0] : {};
        setUploadedFile(getFile);
        callback(name, getFile, arrayFieldIndex)
    };

    const {getRootProps, getInputProps} = useDropzone({
        accept: 'application/msword, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        maxFiles: 1,
        onDrop: onSelectFile
    });

    return (
        <section>
            <Row className={"align-items-center"}>
                <Col sm={12} md={9} lg={9}>
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                        <em>(Only *.jpeg and *.png images will be accepted)</em>
                    </div>
                </Col>
            </Row>
        </section>
    );
}

export default FileUploadField;