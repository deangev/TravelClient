import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';

export default function ImageUpload(props) {
    const classes = useStyles();
    const [files, setFiles] = useState()

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            const reader = new FileReader();
            reader.readAsDataURL(acceptedFiles[0]);
            reader.onloadend = () => {
                props.setFile(reader.result)
            }
        }
    });

    useEffect(() => () => {
        files?.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <div {...getRootProps({ className: 'dropzone' })}>
            <div className={classes.container}>
                <input {...getInputProps()} />
                {files?.length ? files.map(file => (
                    <div className={classes.thumb} key={file.name}>
                        <div className={classes.thumbInner}>
                            <img
                                alt="upload"
                                src={file.preview}
                                className={classes.img}
                            />
                        </div>
                    </div>
                )) : (
                    <div style={{ width: '100%' }}>
                        <p style={{ textAlign: 'center' }}>Drag & drop an image here, or click to select one.</p>
                    </div>
                )
                }
            </div>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: 15,
        marginBottom: 10,
        borderRadius: 10,
        border: '1px solid #f50057',
        height: 200,
        width: 300,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        '& *': {
            marginBottom: '0 !important',
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        }
    },
    thumb: {
        display: 'inline-flex',
        height: '100%',
    },
    thumbInner: {
        display: 'flex',
        width: '100%',
        overflow: 'hidden',
    },
    img: {
        display: 'block',
        width: '100%',
        height: '100%',
        borderRadius: 10,
    }
}))