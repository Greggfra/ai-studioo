import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth Functions
export const authService = {
  // Register with email and password
  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Send email verification
      await sendEmailVerification(user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      });
      
      // Create user document in Firestore with unverified status
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL || null,
        provider: 'email',
        emailVerified: false,
        createdAt: serverTimestamp(),
        credits: 100, // Free credits iniziali
        plan: 'free'
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Login with email and password
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (!user.emailVerified && user.providerData[0].providerId === 'password') {
        throw new Error('EMAIL_NOT_VERIFIED');
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Login with Google
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      // If new user, create document
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'google',
          createdAt: serverTimestamp(),
          credits: 100,
          plan: 'free'
        });
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  },

  // Get current user data from Firestore
  async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
};

// Chat Functions
export const chatService = {
  // Create new conversation
  async createConversation(userId, title = 'Nuova Conversazione') {
    try {
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        userId,
        title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return conversationRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get user conversations
  async getUserConversations(userId) {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Add message to conversation
  async addMessage(conversationId, message) {
    try {
      await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        ...message,
        createdAt: serverTimestamp()
      });
      
      // Update conversation timestamp
      await updateDoc(doc(db, 'conversations', conversationId), {
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },

  // Get conversation messages
  async getMessages(conversationId) {
    try {
      const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Delete conversation
  async deleteConversation(conversationId) {
    try {
      await deleteDoc(doc(db, 'conversations', conversationId));
    } catch (error) {
      throw error;
    }
  }
};

// Projects Service (for images, videos, presentations)
export const projectsService = {
  // Create new project
  async createProject(userId, type, data) {
    try {
      const projectRef = await addDoc(collection(db, 'projects'), {
        userId,
        type, // 'image', 'video', 'presentation'
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return projectRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get user projects
  async getUserProjects(userId, type = null) {
    try {
      let q;
      if (type) {
        q = query(
          collection(db, 'projects'),
          where('userId', '==', userId),
          where('type', '==', type),
          orderBy('updatedAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'projects'),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        );
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Update project
  async updateProject(projectId, data) {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },

  // Delete project
  async deleteProject(projectId) {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      throw error;
    }
  }
};

// Storage Functions
export const storageService = {
  // Upload file
  async uploadFile(path, file) {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw error;
    }
  }
};

export default app;
