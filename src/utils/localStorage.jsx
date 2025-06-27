// src/utils/localStorage.js

export function saveUser(user, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  try {
    storage.setItem("user", JSON.stringify(user));
  } catch (err) {
    console.error("❌ Failed to save user:", err);
  }
}

export function getUser() {
  try {
    const fromLocal = localStorage.getItem("user");
    if (fromLocal) return JSON.parse(fromLocal);

    console.log("📦 fromLocal", fromLocal);
    
    const fromSession = sessionStorage.getItem("user");
    if (fromSession) return JSON.parse(fromSession);

    console.log("📦 fromSession", fromSession);

    return null;
  } catch (err) {
    console.error("❌ Failed to read user:", err);
    return null;
  }
}

export function clearUser() {
  try {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  } catch (err) {
    console.error("❌ Failed to clear user:", err);
  }
}
