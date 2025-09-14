import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../common/UserContext";

type User = {
  id: number;
  username: string;
  profile_picture?: string;
};

function ProfileSelect() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [userProfiles, setUserProfiles] = useState<User[]>([]);

  useEffect(() => {
    invoke<User[]>("tauri_get_all_users")
      .then((data) => setUserProfiles(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const profileSelected = (profile: User) => {
    // Using hardcoded values for now
    setUser({
      id: profile.id.toString(),
      username: profile.username,
      profile_picture: "",
    });

    console.log({
      id: profile.id.toString(),
      username: profile.username,
      profile_picture: "",
    });

    navigate("/library");
  };

  const returnToOnboard = () => {
    navigate("/");
  };

  const createProfile = () => {
    // use this to create a profile
    navigate("/create");
  };

  return (
    <main className="w-full grid justify-items-center">
      <div className="text-off-white text-xl p-5">Select a User Profile</div>
      <div className="grid grid-cols-1">
        {userProfiles.map((user) => (
          <button
            id={user.username}
            key={user.id}
            className="bg-primary w-40 text-lg rounded-md cursor-pointer m-2 text-off-white hover:bg-accent-2"
            onClick={() => profileSelected(user)}
          >
            {user.username}
          </button>
        ))}
      </div>
      <div>
        <button
          id="profileCreation"
          className="bg-primary w-40 text-lg rounded-md cursor-pointer mt-10 m-2 text-off-white hover:bg-accent-2"
          onClick={createProfile}
        >
          Create a profile
        </button>
      </div>
      <div>
        <button
          id="returnToOnboard"
          className="bg-primary w-40 text-lg rounded-md cursor-pointer m-2 text-off-white hover:bg-accent-2"
          onClick={returnToOnboard}
        >
          Return to onboard
        </button>
      </div>
    </main>
  );
}

export default ProfileSelect;
