import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BorderedButton } from './BorderedButton';
import toast from 'react-hot-toast';
import './EditProfilePopup.css';

/**
* EditProfilePopup Component
* 
* A modal form that allows users to update their profile information.
* 
* isOpen - Controls visibility of the popup
* onClose - Callback to close the popup
* user - Current user data to populate the form
* onSave - Callback function to save updated profile data
*/
export function EditProfilePopup({ isOpen, onClose, user, onSave }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        password: '',
        confirmPassword: '',
        profilePicture: null
    });
    const [previewURL, setPreviewURL] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Update form data when the user prop changes or popup opens
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || '',
                bio: user.bio || '',
                password: '',
                confirmPassword: '',
                profilePicture: null
            }));
            setPreviewURL(user.avatar || null);
            setShowDeleteConfirm(false);
        }
    }, [user, isOpen]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle file changes
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profilePicture: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewURL(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const token = localStorage.getItem('token');
        let profilePictureURL = '';

        // Upload profile picture if selected
        if (formData.profilePicture) {
            const formDataUpload = new FormData();
            formDataUpload.append('file', formData.profilePicture);

            try {
                const uploadResponse = await fetch('http://localhost:3000/api/artworks/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formDataUpload,
                });

                if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json();
                    profilePictureURL = uploadData.imageURL;
                } else {
                    toast.error('Failed to upload profile picture');
                    return;
                }
            } catch (error) {
                console.error('Upload error:', error);
                toast.error('Error uploading profile picture');
                return;
            }
        }

        // Prepare data object, only including password if it was changed
        const dataToSave = {
            username: formData.username,
            bio: formData.bio,
            ...(formData.password ? { password: formData.password } : {}),
            ...(profilePictureURL ? { profilePicture: profilePictureURL } : {})
        };

        onSave(dataToSave);
        onClose();
    };

    const handleDeleteAccount = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDeleteAccount = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/users/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                toast.success('Account deleted successfully');
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                localStorage.removeItem('userType');
                onClose();
                navigate('/');
                window.location.reload();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Delete account error:', error);
            toast.error('Error deleting account');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="edit-popup-overlay" onClick={onClose}>
            <div className="edit-popup-container" onClick={(e) => e.stopPropagation()}>
                <div className="edit-header">
                    <h2>Edit Profile</h2>
                </div>
                <div className="edit-body">
                    <form onSubmit={handleSubmit}>
                        <div className="edit-profile-preview">
                            <div className="preview-circle">
                                {previewURL ? (
                                    <img src={previewURL} alt="Preview" />
                                ) : (
                                    <div className="no-preview">?</div>
                                )}
                            </div>
                            <div className="preview-label">Profile Preview</div>
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Profile Picture</label>
                            <div className="file-input-wrapper">
                                <input
                                    type="file"
                                    id="profilePic"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className="form-divider">
                            <span>Account Security</span>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Verify new password"
                                    disabled={!formData.password}
                                />
                            </div>
                        </div>
                        <div className="form-divider delete-divider">
                            <span>Account Deletion</span>
                        </div>
                        <div className="delete-section">
                            {!showDeleteConfirm ? (
                                <>
                                    <p className="delete-warning">Warning: Deleting your account is permanent and cannot be undone.</p>
                                    <button
                                        type="button"
                                        className="delete-account-btn"
                                        onClick={handleDeleteAccount}
                                    >
                                        Delete My Account
                                    </button>
                                </>
                            ) : (
                                <div className="delete-confirmation">
                                    <p className="delete-confirmation-text">Are you sure? This will delete your artworks, friends, and streaks.</p>
                                    <div className="delete-confirm-buttons">
                                        <button
                                            type="button"
                                            className="confirm-delete-btn"
                                            onClick={confirmDeleteAccount}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="cancel-delete-btn"
                                            onClick={() => setShowDeleteConfirm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="edit-popup-buttons">
                            <BorderedButton message="Save Changes" size="pink" type="submit" onClick={() => { }} />
                            <BorderedButton message="Cancel" size="pink" onClick={onClose} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}