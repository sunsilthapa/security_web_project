// src/components/UpdateProfile.js
import React, { Fragment, useState, useEffect } from 'react';
import Loader from '../layout/Loader/Loader';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loadUser, updateProfile } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';
import axios from 'axios';
import "./UpdateProfile.css";

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.user);
    const { error, isUpdated, loading } = useSelector((state) => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState("Profile.png");
    const [csrfToken, setCsrfToken] = useState("");

    const updateProfileSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("avatar", avatar);

        dispatch(updateProfile(myForm, csrfToken));
    };

    const updateProfileDataChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };

        reader.readAsDataURL(e.target.files[0]);
    };

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const { data } = await axios.get('http://localhost:4000/api/v1/csrf-token');
            setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();

        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Profile Updated Successfully");
            dispatch(loadUser());
            navigate("/account");
            dispatch({ type: UPDATE_PROFILE_RESET });
        }
    }, [dispatch, error, alert, navigate, user, isUpdated]);

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title="Update Profile" />
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h2 className='updateProfileHeading'>Update Profile</h2>
                            <form
                                className="updateProfileForm"
                                encType="multipart/form-data"
                                onSubmit={updateProfileSubmit}
                            >
                                <div className="updateProfileName">
                                    <FaceIcon />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="updateProfileEmail">
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div id="updateProfileImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={updateProfileDataChange}
                                    />
                                </div>
                                <input type="submit" value="Update" className="updateProfileBtn" />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default UpdateProfile;


// import React, { Fragment , useState,useEffect } from 'react'
// import Loader from '../layout/Loader/Loader'
// import "./UpdateProfile.css"
// import MailOutlineIcon from "@material-ui/icons/MailOutline"
// import FaceIcon from "@material-ui/icons/Face"
// import { useDispatch,useSelector } from 'react-redux'
// import { clearErrors ,loadUser,updateProfile} from '../../actions/userAction'
// import { useAlert } from 'react-alert'
// import { useNavigate } from 'react-router-dom';
// import { UPDATE_PROFILE_RESET } from '../../constants/userConstants'
// import MetaData from '../layout/MetaData'
// import axios from 'axios'


// const UpdateProfile = () => {
//     const dispatch = useDispatch();
//     const alert = useAlert();
//     const navigate = useNavigate();


//     const { user } = useSelector((state) => state.user);
//     const { error,isUpdated ,loading } = useSelector((state) => state.profile);



//     const [name, setName] = useState("")
//     const [email, setEmail] = useState("")
//     const [avatar, setAvatar] = useState();
//     const [avatarPreview, setAvatarPreview] = useState("Profile.png");
//     const [csrfToken, setCsrfToken] = useState("");


//     const updateProfileSubmit = (e) => {
//         e.preventDefault();
    
//         const myForm = new FormData();
    
//         myForm.set("name", name);
//         myForm.set("email", email);
//         myForm.set("avatar", avatar);
//         dispatch(updateProfile(myForm));
//       };
    
//       const updateProfileDataChange = (e) => {
//         const reader = new FileReader();

//         reader.onload = () => {
//           if (reader.readyState === 2) {
//             setAvatarPreview(reader.result);
//             setAvatar(reader.result);
//           }
//         };
    
//         reader.readAsDataURL(e.target.files[0]);
//       };
    
    
//       useEffect(() => {
//         if (user) {
//           setName(user.name);
//           setEmail(user.email);
//           setAvatarPreview(user.avatar.url);
//         }
    
//         if (error) {
//           alert.error(error);
//           dispatch(clearErrors());
//         }
    
//         if (isUpdated) {
//           alert.success("Profile Updated Successfully");
//           dispatch(loadUser());
    
//           navigate("/account");
    
//           dispatch({
//             type: UPDATE_PROFILE_RESET,
//           });
//         }
//     fetchCsrfToken();
//       }, [dispatch, error, alert, navigate, user, isUpdated]);
    

//                 // Fetch CSRF token
//     const fetchCsrfToken = async () => {
//       const { data } = await axios.get(
//         "http://localhost:4000/api/v1/csrf-token"
//       );
//       setCsrfToken(data.csrfToken);
//       console.log("CSRF token :", data.csrfToken);
//     };
//   return (
//     <Fragment>
//         {loading ? <Loader/> :(
//             <Fragment>
//             <MetaData title="Update Profile"/>
//                 <div className="updateProfileContainer">
//                   <div className="updateProfileBox">
//                     <h2 className='updateProfileHeading'>Update Profile{csrfToken}</h2>
//                   <form
//                       className="updateProfileForm"
//                       encType="multipart/form-data"
//                       onSubmit={updateProfileSubmit}
//                     >
//                       <div className="updateProfileName">
//                         <FaceIcon />
//                         <input
//                           type="text"
//                           placeholder="Name"
//                           required
//                           name="name"
//                           value={name}
//                           onChange={(e)=>setName(e.target.value)}
//                         />
//                       </div>
//                       <div className="updateProfileEmail">
//                         <MailOutlineIcon />
//                         <input
//                           type="email"
//                           placeholder="Email"
//                           required
//                           name="email"
//                           value={email}
//                           onChange={(e)=>setEmail(e.target.value)}
//                         />
//                       </div>
//                       <div id="updateProfileImage">
//                   <img src={avatarPreview} alt="Avatar Preview" />
//                   <input
//                     type="file"
//                     name="avatar"
//                     accept="image/*"
//                     onChange={updateProfileDataChange}
//                   />
//                 </div>
//                       <input type="submit" value="Update" className="updateProfileBtn" />
//                     </form>
//                    </div>
//                 </div>
//         </Fragment>
//         )}
//     </Fragment>
//   )
// }

// export default UpdateProfile