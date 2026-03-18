import { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
  deleteUser,
  updatePassword
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
      // Create account
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Add name to profile
      await updateProfile(result.user, { displayName: name });
      
      // Send verification email
      await sendEmailVerification(result.user);
      
      // Sign out immediately so they are forced to verify before entering the app
      // await signOut(auth);
      
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
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      // TEMPORARILY DISABLED: IITD emails often block automated Firebase verification emails
      // if (!result.user.emailVerified) {
      //   await signOut(auth);
      //   toast.error("Please verify your email address before logging in.");
      //   return { success: false, error: "unverified" };
      // }

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
    
    // 1. Delete Firestore user document (Best effort)
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userDocRef);
    } catch (e) {
      console.warn("Could not delete Firestore doc (likely security rules):", e);
    }
    
    // 2. Delete Profile Photo from Storage (Best effort)
    try {
      const photoRef = ref(storage, `avatars/${currentUser.uid}`);
      await deleteObject(photoRef);
    } catch (e) {
      console.warn("Could not delete Storage avatar:", e);
    }

    // 3. Delete Auth Account
    try {
      await deleteUser(currentUser);
      
      toast.success("Account deleted successfully. We're sorry to see you go!");
      return { success: true };
    } catch (error) {
      console.error("Auth deletion error:", error);
      if (error.code === 'auth/requires-recent-login') {
        toast.error("For security, you must have logged in recently to delete your account. Redirecting...");
        await signOut(auth); // Force log out
        return { success: false, error: "requires-recent-login", forceLogout: true };
      } else {
        toast.error(`Failed to delete account: ${error.message}`);
      }
      return { success: false, error: error.message };
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Validate IITD domain & verification state dynamically
      if (user) {
        if (!user.email.endsWith("@iitd.ac.in")) {
          signOut(auth);
          setCurrentUser(null);
        // } else if (!user.emailVerified) {
        //   // If they are cached as logged in but never verified
        //   setCurrentUser(null);
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

  async function changeUserPassword(newPassword) {
    if (!currentUser) return { success: false, error: "No active user" };
    try {
      await updatePassword(currentUser, newPassword);
      toast.success("Password changed successfully!");
      return { success: true };
    } catch (error) {
      console.error("Password change error:", error);
      if (error.code === 'auth/requires-recent-login') {
        toast.error("For security, you must have logged in recently to change your password. Redirecting...");
        await signOut(auth); // Force log out
        return { success: false, error: "requires-recent-login", forceLogout: true };
      } else {
        toast.error(`Failed to change password: ${error.message}`);
      }
      return { success: false, error: error.message };
    }
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    deleteAccount,
    changeUserPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
