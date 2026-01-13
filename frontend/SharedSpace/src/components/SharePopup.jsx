import './SharePopup.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BorderedButton } from './BorderedButton';

export function SharePopup({ trigger, setTrigger }) {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState('File Name 1');
    const [isPublic, setIsPublic] = useState(true);
    const [description, setDescription] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    if (!trigger) {
        return null;
    }

    const handleClose = () => {
        setTrigger(false);
        setFiles([]);
        setFileName('File Name 1');
        setDescription('');
        setIsPublic(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) return;

        for (const file of files) {
            try {
                // Upload file
                const formData = new FormData();
                formData.append('file', file);

                const uploadResponse = await fetch('http://localhost:3000/api/artworks/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    console.error('Upload failed');
                    continue;
                }

                const uploadData = await uploadResponse.json();
                const imageURL = uploadData.imageURL;

                // Create artwork
                const createResponse = await fetch('http://localhost:3000/api/artworks/create/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: fileName,
                        description: description,
                        imageURL: imageURL,
                        privacy: isPublic ? 'public' : 'private',
                        tags: []
                    }),
                });

                if (!createResponse.ok) {
                    console.error('Create artwork failed');
                }
            } catch (error) {
                console.error('Error sharing file:', error);
            }
        }

        // Update streak after sharing artwork
        try {
            await fetch('http://localhost:3000/api/users/streak', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error updating streak:', error);
        }

        handleClose();
        navigate('/home-posted');
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        if (selectedFiles.length === 1) {
            setFileName(selectedFiles[0].name);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);

        if (droppedFiles.length === 1) {
            setFileName(droppedFiles[0].name);
        }
    };

    const handleBrowseClick = () => {
        document.getElementById('file-input').click();
    };

    return (
        <div className="share-popup-overlay" onClick={handleClose}>
            <div className="share-popup-content" onClick={(e) => e.stopPropagation()}>

                <div className="popup-header">
                    <h2 className="popup-title">Upload Files</h2>
                </div>

                <form onSubmit={handleSave} className="popup-form">
                    <div className="upload-section">
                        <div
                            className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleBrowseClick}
                        >
                            <p className="upload-text">Drag and drop files here</p>
                            <p className="upload-subtext">or</p>
                            <p className="upload-subtext">Browse to upload files</p>

                            <input
                                id="file-input"
                                type="file"
                                className="file-input"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                        </div>

                        {files.length > 0 && (
                            <div className="file-preview">
                                {files.map((file, index) => (
                                    <div key={index} className="file-chip">
                                        <span>{file.name}</span>
                                        <button
                                            type="button"
                                            className="remove-file"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFiles(files.filter((_, i) => i !== index));
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="details-section">
                        <div className="form-group">
                            <label className="form-label">File/s:</label>
                            <input
                                type="text"
                                className="form-input"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="File Name 1"
                            />
                        </div>

                        <div className="privacy-toggle-container">
                            <label className="form-label">Privacy Status</label>
                            <div className="toggle-label" onClick={() => setIsPublic(!isPublic)}>
                                <div className={`toggle-switch ${isPublic ? 'active' : ''}`}>
                                    <div className={`toggle-slider ${isPublic ? 'active' : ''}`}></div>
                                </div>
                                <span className="toggle-text">
                                    {isPublic ? 'Posted as public' : 'Posted as private'}
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a description..."
                            />
                        </div>

                        <div className="popup-actions">
                            <BorderedButton
                                message='Save'
                                size='pink'
                                onClick={handleSave}
                            />
                            <BorderedButton
                                message='Close'
                                size='purple'
                                onClick={handleClose}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
