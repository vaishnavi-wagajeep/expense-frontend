import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    Name: "",
    Email: "",
    Budget: ""
  });

  const token = localStorage.getItem("token");

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProfile(res.data);
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [token]);

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // ---------------- UPDATE PROFILE ----------------
  const updateProfile = async () => {
    try {
      await axios.put(
        "http://localhost:5000/user/profile",
        {
          name: profile.Name,
          budget: profile.Budget
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  return (
    <div className="profile-container">

      <h2>👤 User Profile</h2>

      <div className="profile-card">

        <label>Name</label>
        <input
          name="Name"
          value={profile.Name || ""}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          value={profile.Email || ""}
          disabled
        />

        <label>Budget</label>
        <input
          name="Budget"
          type="number"
          value={profile.Budget || ""}
          onChange={handleChange}
        />

        <button onClick={updateProfile}>
          Update Profile
        </button>

      </div>

    </div>
  );
}

export default Profile;