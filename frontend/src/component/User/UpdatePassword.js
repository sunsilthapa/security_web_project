// src/components/UpdatePassword.js
import React, { Fragment, useState, useEffect } from 'react';
import Loader from '../layout/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import "./UpdatePassword.css"
import { clearErrors, updatePassword } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import axios from 'axios';

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error, isUpdated, loading } = useSelector((state) => state.profile);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [csrfToken, setCsrfToken] = useState("");

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const { data } = await axios.get('http://localhost:4000/api/v1/csrf-token');
            setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Password Updated Successfully");
            navigate("/account");
            dispatch({ type: UPDATE_PASSWORD_RESET });
        }
    }, [dispatch, error, alert, isUpdated, navigate]);

    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        const passwords = { oldPassword, newPassword, confirmPassword };

        dispatch(updatePassword(passwords, csrfToken));
    };

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title="Change Password" />
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h2 className='updatePasswordHeading'>Update Password</h2>
                            <form className="updatePasswordForm" onSubmit={updatePasswordSubmit}>
                                <div className="loginPassword">
                                    <VpnKeyIcon />
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">
                                    <LockIcon />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <input type="submit" value="Change" className="updatePasswordBtn" />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default UpdatePassword;


// import React, { Fragment , useState,useEffect } from 'react'
// import Loader from '../layout/Loader/Loader'
// import "./UpdatePassword.css"
// import { useDispatch,useSelector } from 'react-redux'
// import { clearErrors ,updatePassword} from '../../actions/userAction'
// import { useAlert } from 'react-alert'
// import { useNavigate } from 'react-router-dom';
// import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants'
// import MetaData from '../layout/MetaData'
// import LockOpenIcon from "@material-ui/icons/LockOpen"
// import LockIcon from "@material-ui/icons/Lock"
// import VpnKeyIcon from "@material-ui/icons/VpnKey"
// const UpdatePassword = () => {
//     const dispatch = useDispatch();
//     const alert = useAlert();
//     const navigate = useNavigate();


//     const { error,isUpdated ,loading } = useSelector((state) => state.profile);



//     const [oldPassword, setOldPassword] = useState("")
//     const [newPassword, setNewPassword] = useState("")
//     const [confirmPassword, setConfirmPassword] = useState("")




//     const updatePasswordSubmit = (e) => {
//         e.preventDefault();
    
//         const myForm = new FormData();
    
//         myForm.set("oldPassword", oldPassword);
//         myForm.set("newPassword", newPassword);
//         myForm.set("confirmPassword", confirmPassword);


//         dispatch(updatePassword(myForm));
//       };
    
//       useEffect(() => {
    
//         if (error) {
//           alert.error(error);
//           dispatch(clearErrors());
//         }
    
//         if (isUpdated) {
//           alert.success("Profile Updated Successfully");
    
//           navigate("/account");
    
//           dispatch({
//             type: UPDATE_PASSWORD_RESET,
//           });
//         }
//       }, [dispatch, error, alert, navigate, isUpdated]);
    
//   return (
// <Fragment>
//         {loading ? <Loader/> :(
//             <Fragment>
//             <MetaData title="Change Password"/>
//                 <div className="updatePasswordContainer">
//                   <div className="updatePasswordBox">
//                     <h2 className='updatePasswordHeading'>Update Password</h2>
//                   <form
//                       className="updatePasswordForm"
//                       onSubmit={updatePasswordSubmit}
//                     >
//                      <div className="loginPassword">
//                     <VpnKeyIcon />
//                     <input
//                       type="password"
//                       placeholder="Old Password"
//                       required
//                       value={oldPassword}
//                       onChange={(e) => setOldPassword(e.target.value)}
//                     />
//                   </div>
//                   <div className="loginPassword">
//                     <LockOpenIcon />
//                     <input
//                       type="password"
//                       placeholder="New Password"
//                       required
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                     />
//                   </div>
//                   <div className="loginPassword">
//                     <LockIcon />
//                     <input
//                       type="password"
//                       placeholder="Confirm Password"
//                       required
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                     />
//                   </div>
                      
                     
                   
//                       <input type="submit" value="Change" className="updatePasswordBtn" />
//                     </form>
//                    </div>
//                 </div>
//         </Fragment>
//         )}
//     </Fragment>  )
// }

// export default UpdatePassword