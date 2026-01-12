import React, { useState } from 'react';
import { ArtPopup } from '../../components/ArtPopup';
import { BorderedButton } from '../../components/BorderedButton';
import { EditProfilePopup } from '../../components/EditProfilePopup';
import SampleImg from '../../assets/arts/ukiyo.jpg';
import SampleImg2 from '../../assets/arts/almondtree.jpg';
import './ProfilePage.css';

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

export function ProfilePage() {
  const [user, setUser] = useState({
    username: "Feesha",
    bio: "gah",
    streakCount: 12,
    avatar: SampleImg,
    posts: [
      { img: SampleImg },
      { img: SampleImg2 },
      { img: SampleImg },
      { img: SampleImg2 },
      { img: SampleImg },
      { img: SampleImg2 },
      { img: SampleImg },
      { img: SampleImg2 },
      { img: SampleImg },
      { img: SampleImg2 },
      { img: SampleImg },
      { img: SampleImg2 },
      { img: SampleImg },
      { img: SampleImg2 },
    ],
    achievements: [
      { id: 1, icon: "🎨" },
      { id: 2, icon: "🔥" },
      { id: 3, icon: "🏆" },
      { id: 4, icon: "💎" },
      { id: 5, icon: "⭐" },
      { id: 6, icon: "🚀" },
    ],
    friends: [
      { id: 1, name: "Angus", avatar: SampleImg2 },
      { id: 2, name: "Francis", avatar: SampleImg },
      { id: 3, name: "James", avatar: SampleImg2 },
      { id: 4, name: "Nathan", avatar: SampleImg },
      { id: 5, name: "Shamel", avatar: SampleImg2 },
      { id: 3, name: "Vince", avatar: SampleImg2 },
      { id: 4, name: "Yvan", avatar: SampleImg },
    ]
  });

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

  /**
   * Updates the user state with new data from the EditProfilePopup.
   * updatedData - The new user data (username, bio, etc.)
   */
  const handleSaveProfile = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  return (
    <div className="profile-page">
      {/* Artwork Detail Popup */}
      <ArtPopup
        trigger={activeArt != null}
        setTrigger={() => setActiveArt(null)}
        img={activeArt?.img}
      />

      {/* Edit Profile Modal */}
      <EditProfilePopup
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        user={user}
        onSave={handleSaveProfile}
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
              <h2 className="sidebar-title">Recent Posts</h2>

              <div className="posts-scroll">
                <div className="posts-grid">
                  {user.posts.map((post, i) => (
                    <div
                      key={i}
                      className="post-card"
                      onClick={() => setActiveArt(post)}
                    >
                      <img src={post.img} alt="" />
                    </div>
                  ))}
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
                  {paginatedAchievements.map(ach => (
                    <span key={ach.id} className="achievement-icon">
                      {ach.icon}
                    </span>
                  ))}
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
                  to="/friends"
                  message="View All"
                  size="purple"
                />
              </div>

              <div className="friends-list">
                {user.friends.map(friend => (
                  <div key={friend.id} className="friend-item">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="friend-avatar"
                    />
                    <span>{friend.name}</span>
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