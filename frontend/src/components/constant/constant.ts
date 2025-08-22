export const BaseURL = import.meta.env.VITE_REACT_BACKEND_URL;
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getMySecretCode = () => {
  try {
    const code = localStorage.getItem("mySecretCode");
    return code ? code : null;
  } catch {
    return null;
  }
}
