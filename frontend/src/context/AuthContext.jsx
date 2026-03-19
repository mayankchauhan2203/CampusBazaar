import { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  deleteUser
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name) {
    if (!email.endsWith("@iitd.ac.in")) {
      return { success: false, error: "not-iitd" };
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      toast.success("Account created successfully! You are now logged in.");
      return { success: true };
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already registered.");
      } else {
        toast.error("Failed to create account. Try a stronger password.");
      }
      return { success: false, error: error.message };
    }
  }

  async function login(email, password) {
    if (!email.endsWith("@iitd.ac.in")) {
      return { success: false, error: "not-iitd" };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully logged in!");
      return { success: true };
    } catch (error) {
      toast.error("Invalid email or password.");
      return { success: false, error: error.message };
    }
  }

  function logout() {
    return signOut(auth);
  }

  async function deleteAccount() {
    if (!currentUser) return { success: false, error: "No active user" };
    
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userDocRef);
    } catch (e) {
      console.warn("Could not delete Firestore doc:", e);
    }
    
    try {
      const photoRef = ref(storage, `avatars/${currentUser.uid}`);
      await deleteObject(photoRef);
    } catch (e) {
      console.warn("Could not delete Storage avatar:", e);
    }

    try {
      await deleteUser(currentUser);
      toast.success("Account deleted successfully. We're sorry to see you go!");
      return { success: true };
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error("For security, you must have logged in recently to delete your account.");
        await signOut(auth);
        return { success: false, error: "requires-recent-login", forceLogout: true };
      } else {
        toast.error(`Failed to delete account: ${error.message}`);
      }
      return { success: false, error: error.message };
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.email.endsWith("@iitd.ac.in")) {
          signOut(auth);
          setCurrentUser(null);
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    deleteAccount,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
