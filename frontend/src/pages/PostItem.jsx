import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Upload, Send, ImagePlus, Tag, DollarSign, FileText, Layers } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CATEGORIES = ["Electronics", "Books", "Furniture", "Clothing", "Sports", "Other"];

function PostItem() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [modalPhone, setModalPhone] = useState("");

  const navigate = useNavigate();
  const { currentUser, userData, isBlocked } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    if (isBlocked) {
      toast.error("Your account has been blocked. Contact the admin.");
      return;
    }

    if (!userData?.phone) {
      setShowPhoneModal(true);
      return;
    }

    await executePostItem();
  }

  async function executePostItem(phoneToSave = null) {
    setSubmitting(true);

    try {
      if (phoneToSave) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { phone: phoneToSave });
      }

      // 1) Rate-limit check: max 2 items per 24 hours
      const q = query(
        collection(db, "items"),
        where("sellerId", "==", currentUser.uid)
      );
      const snap = await getDocs(q);
      const limitTime = Date.now() - 24 * 60 * 60 * 1000;
      let count24h = 0;

      snap.forEach(doc => {
        const data = doc.data();
        if (data.createdAt && typeof data.createdAt.toMillis === 'function') {
          if (data.createdAt.toMillis() >= limitTime) {
            count24h++;
          }
        }
      });

      if (count24h >= 2) {
        toast.error("Daily limit reached: You can only list 2 items per 24 hours.");
        setSubmitting(false);
        return;
      }

      let finalImageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'duds5cijd');

        const res = await fetch('https://api.cloudinary.com/v1_1/duds5cijd/image/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (data.secure_url) {
          finalImageUrl = data.secure_url;
        } else {
          toast.error("Image upload failed: " + (data.error?.message || 'Unknown error'));
          setSubmitting(false);
          return;
        }
      }

      const newItem = {
        title,
        price: Number(price),
        description,
        category: category || "Other",
        image: finalImageUrl,
        status: "available",
        sellerId: currentUser.uid, // Added sellerId
        sellerName: currentUser.displayName || "IITD Student", // Added sellerName
        sellerEmail: currentUser.email, // Added sellerEmail
        createdAt: serverTimestamp() // Changed to serverTimestamp
      };

      await addDoc(collection(db, "items"), newItem);
      toast.success("Item listed successfully!");
      navigate("/marketplace");
    } catch (error) {
      toast.error("Failed to list item. Try again.");
      setSubmitting(false);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="post-item">
      <div className="post-item-header">
        <h1>
          List a <span className="gradient-text">New Item</span>
        </h1>
        <p>Fill in the details and your item will be live in seconds.</p>
      </div>

      {isBlocked && (
        <div style={{
          backgroundColor: "rgba(248, 113, 113, 0.15)",
          border: "1px solid var(--danger)",
          color: "var(--danger)",
          padding: "var(--space-md)",
          borderRadius: "var(--radius-md)",
          marginBottom: "var(--space-xl)",
          fontWeight: "600",
          textAlign: "center"
        }}>
          You have been blocked from using the PeerMart services. You cannot list new items. Contact the admin for more information.
        </div>
      )}

      <form onSubmit={handleSubmit} className="post-item-form">
        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="post-title">
              <Tag size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Item Title
            </label>
            <input
              type="text"
              id="post-title"
              placeholder="e.g. MacBook Air M2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-price">
              <DollarSign size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Price (₹)
            </label>
            <input
              type="number"
              id="post-price"
              placeholder="e.g. 45000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-category">
              <Layers size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Category
            </label>
            <select
              id="post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="post-description">
              <FileText size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Description
            </label>
            <textarea
              id="post-description"
              placeholder="Describe your item — condition, age, reason for selling..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isBlocked || submitting || !title.trim() || !price || !category || !description.trim() || !imageFile}
          >
            {submitting ? (
              <>
                <span style={{
                  width: "18px", height: "18px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block"
                }}></span>
                Posting...
              </>
            ) : (
              <>
                <Send size={18} />
                List Item
              </>
            )}
          </button>
        </div>

        <div className="image-upload-area">
          <label style={{
            fontSize: "var(--font-sm)",
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            <ImagePlus size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
            Item Photo
          </label>
          <div className={`image-dropzone ${imagePreview ? "has-image" : ""}`}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="preview-img" />
            ) : (
              <>
                <div className="dropzone-icon">
                  <Upload size={24} />
                </div>
                <p>Click to upload a photo</p>
                <p style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
                  PNG, JPG up to 5MB
                </p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="post-image"
            />
          </div>
          {imagePreview && (
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                fontSize: "var(--font-sm)",
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }}
            >
              Remove Photo
            </button>
          )}
        </div>
      </form>

      {/* Phone Number Modal */}
      {showPhoneModal && (
        <div className="reserve-modal-overlay">
          <div className="reserve-modal">
            <h2 className="reserve-modal-title">Missing Phone Number</h2>
            <p className="reserve-modal-subtitle">We need a contact number to list your item. It will be saved to your profile automatically.</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (modalPhone.replace(/\D/g, '').length !== 10) {
                 toast.error("Please enter a valid 10-digit phone number");
                 return;
              }
              setShowPhoneModal(false);
              await executePostItem(modalPhone);
            }}>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Phone Number (10 digits)</label>
                <input 
                  type="tel" 
                  value={modalPhone} 
                  onChange={(e) => setModalPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required 
                />
              </div>
              <div className="edit-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowPhoneModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save & Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostItem;