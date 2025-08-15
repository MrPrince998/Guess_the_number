export const BaseURL = import.meta.env.VITE_REACT_BACKEND_URL;
const UserDetail = localStorage.getItem("user");
export const UserDetails = UserDetail ? JSON.parse(UserDetail) : null;
