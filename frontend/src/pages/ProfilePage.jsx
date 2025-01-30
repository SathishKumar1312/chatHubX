import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Edit, Mail, Pen, User, X } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfilePic, updateUserName, deleteUser, isDeleting } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [editText, setEditText] = useState(false);
  const [disable, setDisable] = useState(false);
  const [deleteButtonState, setDeleteButtonState] = useState(false)

  useEffect(() => {
    if (newUsername.trim() === authUser.fullName) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [newUsername, authUser.fullName]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfilePic({ profilePic: base64Image });
    };
  };

  const handleTextUpdate = async()=>{
    if(newUsername.trim() === ""){
      toast.error("Please enter a new username");
    }
    else{
      await updateUserName(newUsername.trim());
      setEditText(false);
      setNewUsername("");
      }
  }

  const handleDelete = async()=> {
    await deleteUser();
    setDeleteButtonState(false)
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              {editText ? (
                <>
                  <input
                    type="text"
                    id="fullName"
                    className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                    placeholder="Enter the user name"
                    value={newUsername}
                    onChange={(e)=>setNewUsername(e.target.value)}
                    disabled={isUpdatingProfile}
                  />
                  <button className="btn btn-accent" disabled={disable} onClick={()=>{handleTextUpdate()}}><Pen className="w-4 h-4" />Update</button>
                  <button className="btn btn-primary ms-3" onClick={()=>setEditText(false)}><X className="w-4 h-4" />Cancel</button>
                </>
              ) : (
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex flex-row align-middle justify-between">
                {authUser?.fullName}
                <button onClick={()=>{setEditText(true); setNewUsername(authUser.fullName)}}><Edit className="w-4 h-4" /></button>
              </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-3">
              <button className="btn btn-primary" disabled={isDeleting} onClick={()=>{setDeleteButtonState(true)}}>Delete your Profile</button>
              {deleteButtonState &&
              <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                            <svg className="size-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                          </div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-base font-semibold text-gray-900" id="modal-title">Deactivate account</h3>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p>
                            </div>
                          </div>
                        </div>Name
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button" onClick={handleDelete} disabled={isDeleting} className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto">Deactivate</button>
                        <button type="button" onClick={()=>{setDeleteButtonState(false)}} disabled={isDeleting} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto" >Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
