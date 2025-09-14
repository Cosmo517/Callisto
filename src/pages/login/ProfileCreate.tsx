import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileCreate() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: "",
    profile_picture: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const success = await invoke<boolean>("tauri_create_user", {
        username: userInfo.username,
        profilePicture: userInfo.profile_picture,
      });

      if (success) {
        console.log("User created!");
        setUserInfo({ username: "", profile_picture: "" });
      } else {
        console.log("Username already exists.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const returnToSelect = () => {
    navigate("/profiles");
  };

  return (
    <main className="w-full grid justify-items-center">
      <div className="text-off-white text-xl p-5">Create your user profile</div>
      <form
        className="grid grid-cols-1 justify-items-center"
        onSubmit={createProfile}
      >
        <input
          type="text"
          id="username"
          name="username"
          value={userInfo.username}
          required
          placeholder="Username"
          onChange={handleChange}
          className="bg-primary border border-r-1 border-secondary text-off-white pl-1 placeholder:text-secondary focus:outline-none focus:border-accent-1 focus:ring-0 transition-colors"
        />
        <button
          type="submit"
          id="profileCreation"
          className="bg-primary w-40 text-lg rounded-md cursor-pointer mt-5 text-off-white hover:bg-accent-2"
          onClick={() => console.log("test")}
        >
          Create
        </button>
      </form>

      <button
        id="profileCreation"
        className="bg-primary w-40 text-lg rounded-md cursor-pointer mt-20 text-off-white hover:bg-accent-2"
        onClick={returnToSelect}
      >
        Return to select
      </button>
    </main>
  );
}

export default ProfileCreate;
