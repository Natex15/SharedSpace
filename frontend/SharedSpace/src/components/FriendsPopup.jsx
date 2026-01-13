// For the friends popup.
import './FriendsPopup.css';                             // Import CSS.
import React, { useState, useEffect } from 'react';

// ____________________________________________________________________________________________________

const BASE_URL = 'http://localhost:5000'

function authHeaders() {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };
};

async function getFriends() {
    const res = await fetch(`${BASE_URL}/api/users/friends`, {
        headers: authHeaders()
    });

    return res.json();
};

async function getPendingRequests() {
    const res = await fetch(`${BASE_URL}/api/users/friends/pending`, {
        headers: authHeaders()
    });

    return res.json();
};

async function sendFriendRequest(friendId) {
    const res = await fetch(`${BASE_URL}/api/users/friends/request`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ friendId }),
    });

    return res.json();
};

async function acceptRequest(friendId) {
    const res = await fetch(`${BASE_URL}/api/users/friends/accept`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ friendId })
    });

    return res.json();
};

async function declineRequest(friendId) {
    const res = await fetch(`${BASE_URL}/api/users/friends/decline`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ friendId })
    });

    return res.json();
};

async function removeFriend(friendId) {
    const res = await fetch(`${BASE_URL}/api/users/friends/remove`, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ friendId })
    });

    return res.json();
};

async function getOutgoingRequests() {
    const res = await fetch(`${BASE_URL}/api/users/friends/outgoing`, {
        headers: authHeaders()
    });

    return res.json();
};

async function cancelOutgoingRequest(requestId) {
    const res = await fetch(`${BASE_URL}/api/users/friends/cancel`, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ requestId })
    });

    return res.json();
};

export function FriendsPopup({ isOpen, onClose }) {

    // State for tab and search query.
    const [activeTab, setActiveTab] = useState('Friend List');                     // State for active tab.
    const [searchQuery, setSearchQuery] = useState('');                            // State for search query.
    const [statusMessage, setStatusMessage] = useState('');                        // State for messages.
    const [searchResults, setSearchResults] = useState([])                         // State for search queries.
    const [friendsList, setFriendsList] = useState([])                             // State for friends.
    const [friendRequests, setFriendRequests] = useState([])                       // State for friend requests.
    const [outgoingRequests, setOutgoingRequests] = useState([])                   // State for outgoing friend requests.

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/api/users/findByUsername`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ username: searchQuery })
            });
            console.log("Search response status:", response.status);
            const data = await response.json();
            
            setSearchResults(Array.isArray(data) ? data : [data]);
        } catch (err) {
            console.error("Error - unable to search:", err);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        async function loadData() {
            try {
                const friends = await getFriends();
                const requests = await getPendingRequests();
                const outgoing = await getOutgoingRequests();

                setFriendsList(friends);
                setFriendRequests(requests);
                setOutgoingRequests(outgoing);
            } catch (err) {
                console.error("Error loading data:", err);
            }
        };

        loadData()
    }, [isOpen])

    // Function to handle sending friend requests.
    const handleAddFriend = async (userId) => {
        try {
            const res = await sendFriendRequest(userId);
            const updatedOutgoing = await getOutgoingRequests();

            setOutgoingRequests(updatedOutgoing);
            console.log("Sent friend request:", userId);

            if (res.message === "Already friends.") {
                setStatusMessage("You’re already friends with this user.");
            } else if (res.message === "Request pending.") {
                setStatusMessage("You’ve already sent a friend request to this user.");
            } else if (res.message === "Friend request sent.") {
                setStatusMessage("Friend request sent!");
            } else {
                setStatusMessage("Something unexpected happened.");
            }
        } catch (err) {
            console.error("Error - Not able to friend request:", err);
        }
    };

    // Function handling accepted friend requests.
    const handleAcceptRequest = async (id) => {
        try {
            await acceptRequest(id);
            const updatedFriends = await getFriends();
            const updatedRequests = await getPendingRequests();

            setFriendsList(updatedFriends);
            setFriendRequests(updatedRequests);
        } catch (err) {
            console.error("Error - not able to accept request:", err);
        }
    };

    // Function handling declined friend requests.
    const handleDeclineRequest = async (id) => {
        try {
            await declineRequest(id);
            const updatedRequests = await getPendingRequests();

            setFriendRequests(updatedRequests);
        } catch (err) {
            console.error("Error - Not able to decline request:", err);
        }
    };

    // Function handling removed friends.
    const handleRemoveFriend = async (id) => {
        try {
            await removeFriend(id);
            const updatedFriends = await getFriends();

            setFriendsList(updatedFriends);
        } catch (err) {
            console.error("Error - Not able to remove friend:", err);
        }
    };

    // Function handling removed outgoing friend requests.
    const handleRemoveOutgoingRequest = async (id) => {
        try {
            await cancelOutgoingRequest(id);
            const updatedOutgoing = await getOutgoingRequests();

            setOutgoingRequests(updatedOutgoing);
        } catch (err) {
            console.error("Error - Not able to cancel outgoing request:", err);
        }
    };

    // Function to reset search query every tab change.
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchQuery('');
    };

    // Render popup if open.
    if (!isOpen) return null;

    // Function for header.
    const renderHeader = () => {

        // Placeholders for search bar.
        let placeholder = "Search List";
        if (activeTab === "Friend Requests") placeholder = "Search Requests";
        if (activeTab === "Add Friend") placeholder = "Search Outgoing";

        return (
            <div className="friends-header">

                {/* Header text and search bar. */}
                <div className="title-search">
                    <h1>Friends</h1> 
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}  
                        />
                    </div>
                </div>

                {/* Tab buttons. */}
                <div className="tabs">
                    <button
                        className={activeTab === 'Friend List' ? 'active' : ''}
                        onClick={() => setActiveTab('Friend List')}
                    >
                        Friend List
                    </button>
                    <button
                        className={activeTab === 'Friend Requests' ? 'active' : ''}
                        onClick={() => setActiveTab('Friend Requests')}
                    >
                        Friend Requests
                    </button>
                    <button
                        className={activeTab === 'Add Friend' ? 'active' : ''}
                        onClick={() => setActiveTab('Add Friend')}
                    >
                        Add Friend
                    </button>
                </div>
            </div>
        );
    };

    // Function for body.
    const renderContent = () => {
        if (activeTab === 'Friend List') {

            // Show friends' usernames containing search query.
            const filteredFriends = friendsList.filter(friend => 
                friend.username.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
                <div className="friends-content-list">
                    {filteredFriends.map((friend, index) => (
                        <div key={friend._id} className={`friend-row ${index % 2 === 0 ? 'even' : 'odd'}`}>                       {/* Class name for styling. */}
                            <div className="friend-info">
                                <img src={friend.profilePicture || "/defaultAvatar.png"} alt={friend.username} className="row-avatar" />
                                <span className="row-username">{friend.username}</span>
                            </div>
                            <button className="action-btn remove-btn" onClick={() => handleRemoveFriend(friend._id)}>✖</button>  {/* Button to remove friend. */}
                        </div>
                    ))}
                </div>
            );
        } else if (activeTab === 'Friend Requests') {

            // Show friend requests' usernames containing search query.
            const filteredRequests = friendRequests.filter(friend => 
                friend.username.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
                <div className="friends-content-list">
                    {filteredRequests.map((req, index) => (
                        <div key={req._id} className={`request-row ${index % 2 === 0 ? 'even' : 'odd'}`}>                             {/* Class name for styling. */}
                            <div className="friend-info">
                                <img src={req.profilePicture || "/defaultAvatar.png"} alt={req.username} className="row-avatar" />
                                <span className="row-username">{req.username}</span>
                            </div>
                            <div className="action-group">
                                <button className="action-btn accept-btn" onClick={() => handleAcceptRequest(req._id)}>✔</button>    {/* Button to accept request. */}
                                <button className="action-btn decline-btn" onClick={() => handleDeclineRequest(req._id)}>✖</button>  {/* Button to decline request. */}
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else if (activeTab === 'Add Friend') {

            // Show outgoing friend requests' usernames containing search query.
            return (
                <div className="add-friend-container">
                    <div className="add-friend-top">
                        <h2>Add a new friend today!</h2>
                        <form className="users-search" onSubmit={handleSearch}>
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search Users"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        </form>

                        {statusMessage && <p className="status-message">{statusMessage}</p>}
                    </div>

                    <div className="friends-content-list">
                        {Array.isArray(searchResults) && searchResults.length > 0 ? (
                            searchResults.map((user, index) => (
                            <div key={`${user._id || index}`} className={`friend-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                <div className="friend-info">
                                <img src={user.profilePicture || "/defaultAvatar.png"} alt={user.username} className="row-avatar" />
                                <span className="row-username">{user.username}</span>
                                </div>
                                <button className="action-btn add-btn" onClick={() => handleAddFriend(user._id)}>
                                ✚
                                </button>
                            </div>
                            ))
                        ) : (
                            <p className = "status-message" p>No users found.</p>
                        )}
                    </div>
                </div>
            );
        }
    };

    // To be rendered.
    return (
        <div className="friends-popup-overlay" onClick={onClose}>
            <div className="friends-popup-container" onClick={(e) => e.stopPropagation()}>
                {renderHeader()}                {/* Popup header. */}
                <div className="friends-body">
                    {renderContent()}           {/* Popup body. */}
                </div> 
            </div>
        </div>
    );
}