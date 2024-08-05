import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
const User = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users');
        setLoadedUsers(responseData.Users);
      } catch(err) {}
    };
    fetchUsers(); 
  }, [sendRequest]);
      
  return (
    <React.Fragment>
        {isLoading && <div className="center"><LoadingSpinner /></div>}
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
    </React.Fragment>
  );
};

export default User;