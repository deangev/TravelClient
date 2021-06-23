import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone';

export default function EditImage({ setFile, image }) {
    const classes = useStyles()
    const [files, setFiles] = useState([])
    
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            const reader = new FileReader();
            reader.readAsDataURL(acceptedFiles[0]);
            reader.onloadend = () => {
                setFile(reader.result)
            }
        }
    });

    return (
        <div {...getRootProps({ className: 'dropzone' })} style={{ cursor: 'pointer' }}>
            {files && (
                <div className={classes.media} key={files[0]?.name}>
                    <img
                        alt="upload"
                        src={files[0]?.preview || image}
                        className={classes.img}
                    />
                    <input {...getInputProps()} />
                </div>
            )}
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    media: {
        height: 200,
        width: 300,
        borderRadius: 10,
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        }
    },
    img: {
        display: 'block',
        width: '100%',
        height: '100%',
        borderRadius: 10,
        border: '1px solid #f50057'

    },
}))