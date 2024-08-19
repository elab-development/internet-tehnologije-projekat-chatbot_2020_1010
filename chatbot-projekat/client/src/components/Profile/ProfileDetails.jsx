import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/posts";
import useGif from "../../hooks/useGif"; // Import the custom hook
import "./ProfileDetails.css";

export default function ProfileDetails() {
  const [profile, setProfile] = useState({ bio: "", avatar: "" });
  const { user, token } = useAuth();
  const { gifUrl, loading: gifLoading, error: gifError } = useGif("Technology");

  // Fetch profile data
  const getProfile = async () => {
    try {
      const response = await api.get(`/profiles/${user.id}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="profile-container">
      <img src={profile.avatar} alt="Avatar" className="profile-avatar" />
      <div className="profile-info">
        <div className="profile-name">{user.name}</div>
        <div className="profile-label">Bio</div>
        <p className="profile-bio">{profile.bio}</p>
        <div className="profile-label">Gender</div>
        <p className="profile-bio">{user.gender}</p>
        <div className="profile-label">Email</div>
        <p className="profile-email">{user.email}</p>
      </div>
      <div className="gif-box">
        <div className="profile-name">GIF of the day:</div>
        {gifLoading ? (
          <p>Loading GIF...</p>
        ) : gifError ? (
          <p>Error loading GIF: {gifError.message}</p>
        ) : (
          gifUrl && <img src={gifUrl} alt="Random AI GIF" className="gif-image" />
        )}
      </div>
    </div>
  );
}
