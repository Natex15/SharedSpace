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
        confirmPassword: ''
    });

    // Update form data when the user prop changes or popup opens
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || '',
                bio: user.bio || '',
                password: '',
                confirmPassword: ''
            }));
        }
    }, [user, isOpen]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        // Prepare data object, only including password if it was changed
        const dataToSave = {
            username: formData.username,
            bio: formData.bio,
            ...(formData.password ? { password: formData.password } : {})
        };

        onSave(dataToSave);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="edit-popup-overlay">
            <div className="edit-popup">
                <h2>Edit Profile</h2>
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
                        <BorderedButton message="Save Changes" size="pink" type="submit" onClick={() => {}} />
                        <BorderedButton message="Cancel" size="pink" onClick={onClose} />
                    </div>
                </form>
            </div>
        </div>
    );
}