import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArtPopup } from '../../components/ArtPopup';
import { BorderedButton } from '../../components/BorderedButton';
import { EditProfilePopup } from '../../components/EditProfilePopup';
import { FriendsPopup } from '../../components/FriendsPopup';
import { SharePopup } from '../../components/SharePopup';
import SampleImg from '../../assets/arts/ukiyo.jpg';
import SampleImg2 from '../../assets/arts/almondtree.jpg';
import './ProfilePage.css';

// Import Badge Assets
import Streak1 from '../../assets/badges/streak-1.png';
import Streak5 from '../../assets/badges/streak-5.png';
import Streak10 from '../../assets/badges/streak-10.png';
import Streak30 from '../../assets/badges/streak-30.png';
import Streak90 from '../../assets/badges/streak-90.png';
import Streak365 from '../../assets/badges/streak-365.png';

/**
 * ProfilePage Component
 * 
 * Displays the user's profile information including:
 * - Avatar, username, bio
 * - Streak count
 * - Recent posts (artworks)
 * - Achievements
 * - Friends list
 * 
 */

// Map the DB 'iconURL' string to the imported asset
const BADGE_MAP = {
  'streak-1': Streak1,
  'streak-5': Streak5,
  'streak-10': Streak10,
  'streak-30': Streak30,
  'streak-90': Streak90,
  'streak-365': Streak365,
};

export function ProfilePage() {
  const location = useLocation();
  const [user, setUser] = useState({
    username: "",
    bio: "",
    streakCount: 0,
    profilePicture: "",
    posts: [],
    achievements: [],
    friends: []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const meResponse = await fetch('http://localhost:3000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!meResponse.ok) throw new Error("Failed to fetch /me");
        const meData = await meResponse.json();
        const userId = meData._id;

        const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("Fetched user data:", userData);

          setUser(prev => ({
            ...prev,
            username: userData.username,
            bio: userData.bio || "",
            streakCount: userData.streakCount,
            profilePicture: userData.profilePicture,
            avatar: userData.profilePicture || SampleImg,
            friends: userData.friends || [],
            achievements: userData.badges || [],
          }));
        }

        const artworksResponse = await fetch('http://localhost:3000/api/artworks/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (artworksResponse.ok) {
          const artworks = await artworksResponse.json();
          const posts = artworks.map(artwork => ({
            img: artwork.imageURL,
            id: artwork._id,
            title: artwork.title,
            description: artwork.description,
            uploadDate: artwork.uploadDate
          }));
          setUser(prev => ({
            ...prev,
            posts: posts,
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // State for the currently selected artwork to display in the popup
  const [activeArt, setActiveArt] = useState(null);

  // ACHIEVEMENT PAGINATION LOGIC
  const ACHIEVEMENTS_PER_PAGE = 3;
  const [achievementPage, setAchievementPage] = useState(0);

  // Calculate the maximum page index
  const maxAchievementPage = Math.ceil(
    user.achievements.length / ACHIEVEMENTS_PER_PAGE
  ) - 1;

  // Slice the achievements array to get only the items for the current page
  const paginatedAchievements = user.achievements.slice(
    achievementPage * ACHIEVEMENTS_PER_PAGE,
    achievementPage * ACHIEVEMENTS_PER_PAGE + ACHIEVEMENTS_PER_PAGE
  );

  // EDIT PROFILE LOGIC
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFriendsPopup, setShowFriendsPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  // SELECTION & DELETE LOGIC
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedPosts([]); // Clear selection when toggling
  };

  const handleSelectPost = (postId) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    } else {
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPosts.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedPosts.length} post(s)?`)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/artworks/delete-multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedPosts }),
      });

      if (response.ok) {
        // Refresh posts
        setUser(prev => ({
          ...prev,
          posts: prev.posts.filter(post => !selectedPosts.includes(post.id)),
        }));
        setIsSelectionMode(false);
        setSelectedPosts([]);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete posts: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting posts:', error);
    }
  };

  // For friend request notifications to navigate directly to friends popup
  useEffect(() => {
    if (location.state?.openFriendsTab) {
      setShowFriendsPopup(true);

      // Clean up the state so it doesn't re-open on every refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  /**
   * Updates the user state with new data from the EditProfilePopup.
   * updatedData - The new user data (username, bio, etc.)
   */
  const handleSaveProfile = async (updatedData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(prev => ({
          ...prev,
          username: updatedUser.username,
          bio: updatedUser.bio,
          profilePicture: updatedUser.profilePicture,
          avatar: updatedUser.profilePicture || SampleImg,
        }));
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };


  return (
    <div className="profile-page">
      {/* Artwork Detail Popup */}
      <ArtPopup
        trigger={activeArt != null}
        setTrigger={() => setActiveArt(null)}
        img={activeArt?.img}
        date={activeArt?.uploadDate ? new Date(activeArt.uploadDate).toLocaleDateString() : ''}
        desc={activeArt?.description || ''}
        author={user.username}
        authorImg={user.avatar}
      />

      {/* Edit Profile Modal */}
      <EditProfilePopup
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      {/* Friends List/Requests/Add Popup */}
      <FriendsPopup
        isOpen={showFriendsPopup}
        onClose={() => setShowFriendsPopup(false)}
      />

      {/* Share Artwork Popup */}
      <SharePopup
        trigger={showSharePopup}
        setTrigger={setShowSharePopup}
      />

      {/* HEADER SECTION */}
      <div className="profile-header">
        <div className="profile-info-container">
          <div className="profile-identity">
            <div className="profile-avatar">
              <img src={user.avatar} alt={user.username} />
            </div>

            <div className="profile-details">
              <div className="profile-names">
                <h1>{user.username}</h1>
                <BorderedButton
                  onClick={() => setShowEditProfile(true)}
                  message="Edit Profile"
                  size="purple"
                />
              </div>

              <p className="profile-bio">{user.bio}</p>
            </div>
          </div>

          <div className="profile-streak streak-card">
            <div className="streak-grid">
              <div className="streak-label">
                <h2>Current<br />Streak</h2>
              </div>

              <div className="streak-value">
                <h2>{user.streakCount}</h2>
              </div>
            </div>
          </div>

        </div>
      </div>


      <div className="profile-layout">
        {/* MAIN */}
        <div className="profile-main">

          {/* RECENT POSTS */}
          <div className="card-shadow">
            <div className="sidebar-card">
              <div className="sidebar-title-row">
                <h2 className="sidebar-title">Recent Posts</h2>
                <div className="profile-actions">
                  {isSelectionMode ? (
                    <>
                      <BorderedButton
                        onClick={handleDeleteSelected}
                        message={`Delete (${selectedPosts.length})`}
                        size="purple"
                        disabled={selectedPosts.length === 0}
                      />
                      <BorderedButton
                        onClick={toggleSelectionMode}
                        message="Cancel"
                        size="purple"
                      />
                    </>
                  ) : (
                    <>
                      <BorderedButton
                        onClick={toggleSelectionMode}
                        message="Select"
                        size="purple"
                      />
                      <BorderedButton
                        onClick={() => setShowSharePopup(true)}
                        message="Share"
                        size="purple"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="posts-scroll">
                <div className="posts-grid">
                  {user.posts.map((post, i) => {
                    const isSelected = selectedPosts.includes(post.id);
                    return (
                      <div
                        key={i}
                        className={`post-card ${isSelectionMode ? 'selection-mode' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (isSelectionMode) {
                            handleSelectPost(post.id);
                          } else {
                            setActiveArt(post);
                          }
                        }}
                      >
                        <img src={post.img} alt={post.title} />
                        {isSelectionMode && (
                          <div className="post-selection-overlay">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="profile-sidebar">
          {/* ACHIEVEMENTS */}
          <div className="card-shadow">
            <div className="sidebar-card">
              <h2 className="sidebar-title">Achievements</h2>

              <div className="achievements-wrapper">
                {/* Previous Page Button */}
                <button
                  className="achievements-arrow"
                  disabled={achievementPage === 0}
                  onClick={() => setAchievementPage(p => p - 1)}
                >
                  ‹
                </button>

                {/* Achievement Icons */}
                <div className="achievements-list">
                  {paginatedAchievements.map(ach => {
                    const imgSrc = BADGE_MAP[ach.iconURL] || ach.iconURL;

                    return (
                      <div key={ach._id} className="achievement-item" title={ach.badgeName}>
                        <img src={imgSrc} alt={ach.badgeName} className="achievement-img" />
                      </div>
                    );
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  className="achievements-arrow"
                  disabled={achievementPage === maxAchievementPage}
                  onClick={() => setAchievementPage(p => p + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* FRIENDS */}
          <div className="card-shadow">
            <div className="sidebar-card">
              <div className="sidebar-title-row">
                <h2 className="sidebar-title">Friends</h2>

                <BorderedButton
                  onClick={() => setShowFriendsPopup(true)}
                  message="View All"
                  size="purple"
                />
              </div>

              <div className="friends-list">
                {user.friends.map(friend => (
                  <div key={friend._id} className="friend-item">
                    <img
                      src={friend.profilePicture || "/defaultAvatar.png"}
                      alt={friend.username}
                      className="friend-avatar"
                    />
                    <span className="friends-list-username">{friend.username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}