import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./stylesheets/UploadPage.css";
import BlurpleBackground from "./BlurpleBackground";
import Button from "./Button";
import Spacer from "./Spacer";
import Center from "./Center";
import Twemoji from "react-twemoji";

function UploadPage() {
    const [error, setError] = React.useState(null);

    const onDrop = useCallback(files => {
        setError(null);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onabort = () => setError("File reading was aborted");
            reader.onerror = () => setError("Error reading files!");
            reader.onload = () => {
                let json;
                try {
                    json = JSON.parse(reader.result);
                } catch(e) {
                    setError("Your file is not valid JSON. Try exporting again.");
                    return;
                }
                
            };
            reader.readAsText(file);
        });
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <div id="upload-page" className="rails">
            <BlurpleBackground>
                <Center><h1>Upload Messages</h1></Center>
                <Spacer height="50px" />
                <h2>1. Export your messages</h2>
                <Spacer height="30px" />
                <p>
                    To use Discord Roulette, you need an archive of your server's
                    messages in JSON format. You can get this via a handy tool I made.
                </p>
                <p>
                    Export as many channels as you want to use. "Export basic subset of data" is fine.
                </p>
                <Spacer height="30px" />
                <Center>
                    <a className="nostyle" href="https://discord-exporter-web.web.app/" target="_blank" rel="noopener noreferrer">
                        <Button content="Visit Discord Exporter" emoji="🌎" />
                    </a>
                </Center>
                
                <Spacer height="50px" />
                <h2>2. Upload your messages</h2>
                <Spacer height="30px" />
                <p>Select one or more files to upload.</p>
                <Spacer height="30px" />
                {
                    error && (
                        <>
                            <p className="error">{error}</p>
                            <Spacer height="30px" />
                        </>
                    )
                }
                <div id="file-drop-zone" className={isDragActive ? "active" : ""} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Twemoji>💻</Twemoji>
                    <h2>Drop files here</h2>
                </div>
            </BlurpleBackground>
        </div>
    );
}

export default UploadPage;