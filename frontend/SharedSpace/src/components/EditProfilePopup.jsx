import React, { useState, useEffect } from 'react';
import { BorderedButton } from './BorderedButton';
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
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        password: '',
        confirmPassword: '',
        profilePicture: null
    });

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
        }
    }, [user, isOpen]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle file changes
    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, profilePicture: e.target.files[0] }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
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
                    alert('Failed to upload profile picture');
                    return;
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Error uploading profile picture');
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

    // Handle account deletion
    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3000/api/users/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            // Clear auth data
            localStorage.removeItem('token');

            alert('Your account has been deleted.');

            // Redirect to login or landing page
            window.location.href = '/login';

        } catch (error) {
            console.error(error);
            alert('Error deleting account.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="edit-popup-overlay" onClick={onClose}>
            <div className="edit-popup-container" onClick={(e) => e.stopPropagation()}>
                <div className="edit-header">
                    <h2>Edit Profile</h2>
                    <BorderedButton
                        message="Delete Account"
                        size="pink"
                        onClick={handleDeleteAccount}
                        className="delete-account-topright"
                    />
                </div>
                <div className="edit-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password (optional)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                disabled={!formData.password}
                            />
                        </div>
                        <div className="edit-popup-buttons">
                            <BorderedButton
                                message="Save Changes"
                                size="pink"
                                type="submit"
                                onClick={() => {}}
                            />
                            <BorderedButton
                                message="Cancel"
                                size="pink"
                                onClick={onClose}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
