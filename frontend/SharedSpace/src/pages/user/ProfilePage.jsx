import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArtPopup } from '../../components/ArtPopup';
import { BorderedButton } from '../../components/BorderedButton';
import { EditProfilePopup } from '../../components/EditProfilePopup';
import { FriendsPopup } from '../../components/FriendsPopup';
import { SharePopup } from '../../components/SharePopup';
import { DeleteConfirmPopup } from '../../components/DeleteConfirmPopup';
import toast from 'react-hot-toast';
import SampleImg from '../../assets/arts/ukiyo.jpg';
import SampleImg2 from '../../assets/arts/almondtree.jpg';
import './ProfilePage.css';
import API_BASE_URL from '../../apiConfig';

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
        const meResponse = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!meResponse.ok) throw new Error("Failed to fetch /me");
        const meData = await meResponse.json();
        const userId = meData._id;

        const userResponse = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
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

        const artworksResponse = await fetch(`${API_BASE_URL}/api/artworks/my`, {
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDeleteSelected = () => {
    if (selectedPosts.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    const deletePromise = (async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/artworks/delete-multiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedPosts }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      // Refresh posts
      setUser(prev => ({
        ...prev,
        posts: prev.posts.filter(post => !selectedPosts.includes(post.id)),
      }));
      setIsSelectionMode(false);
      setSelectedPosts([]);
      return response;
    })();

    toast.promise(deletePromise, {
      loading: 'Deleting posts...',
      success: 'Posts deleted successfully!',
      error: (err) => `Failed to delete: ${err.message}`,
    });
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
      const response = await fetch(`${API_BASE_URL}/api/users/update`, {
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
        id={activeArt?.id}
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

      <DeleteConfirmPopup
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        count={selectedPosts.length}
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
                <div className="streak-pill">
                  <div className="streak-flame">🔥</div>
                  <div className="streak-count-num">{user.streakCount}</div>
                </div>
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