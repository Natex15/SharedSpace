import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SharePopup.css';
import { BorderedButton } from './BorderedButton';

export function SharePopup({ trigger, setTrigger }) {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState('File Name 1');
    const [isPublic, setIsPublic] = useState(true);
    const [description, setDescription] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    if (!trigger) return null;

    const handleClose = () => {
        setTrigger(false);
        setFiles([]);
        setFileName('File Name 1');
        setIsPublic(true);
        setDescription('');
        setIsDragging(false);
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (files.length === 0) {
            alert('Please select at least one file to upload');
            return;
        }

        const formData = new FormData();

        files.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });

        formData.append('fileName', fileName);
        formData.append('isPublic', isPublic);
        formData.append('description', description);

        console.log('Saving files:', {
            files: files.map(f => f.name),
            fileName,
            isPublic,
            description
        });

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

                <h2 className="share-title">Upload Files</h2>

                <form onSubmit={handleSave}>
                    <div
                        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {files.length > 0 ? (
                            <div className="file-preview">
                                <p className="file-count">{files.length} file(s) selected:</p>
                                <ul className="file-list">
                                    {files.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="drop-zone-content">
                                <p>Drag and drop files here</p>
                                <p>or</p>
                                <button
                                    type="button"
                                    className="browse-button"
                                    onClick={handleBrowseClick}
                                >
                                    Browse to upload files
                                </button>
                            </div>
                        )}

                        <input
                            id="file-input"
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className="form-fields">

                        <div className="form-group">
                            <label htmlFor="file-name">File/s:</label>
                            <input
                                id="file-name"
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                className="file-name-input"
                                placeholder="File Name 1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Privacy Status</label>
                            <div className="toggle-container">
                                <span className="toggle-label">
                                    Posted as {isPublic ? 'public' : 'private'}
                                </span>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="description-textarea"
                                rows="4"
                                placeholder="Enter description..."
                            />
                        </div>
                    </div>

                    <div className="button-group">
                        <BorderedButton
                            message="Save"
                            size="pink"
                            onClick={handleSave}
                        />
                        <BorderedButton
                            message="Close"
                            size="pink"
                            onClick={handleClose}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
