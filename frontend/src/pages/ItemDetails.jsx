import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Package, ShoppingCart, CheckCircle, User, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        const itemSnap = await getDoc(doc(db, "items", id));
        if (itemSnap.exists()) {
          setItem({ id: itemSnap.id, ...itemSnap.data() });
        } else {
          toast.error("Item not found");
          navigate("/marketplace");
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
        toast.error("Failed to load item details");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id, navigate]);

  async function handleReserve() {
    if (!userData?.phone) {
      toast.error("Please add your phone number in Profile before reserving an item.");
      navigate("/profile");
      return;
    }

    try {
      const itemRef = doc(db, "items", item.id);
      await updateDoc(itemRef, {
        status: "reserved",
        reservedBy: currentUser.uid,
        reservedByName: currentUser.displayName || "IITD Student",
        reservedByEmail: currentUser.email,
      });

      // Anonymous notification for seller
      await addDoc(collection(db, "notifications"), {
        recipientId: item.sellerId,
        type: "reservation_anonymous",
        itemId: item.id,
        itemTitle: item.title,
        itemPrice: item.price,
        read: false,
        createdAt: serverTimestamp(),
      });

      toast.success("Item reserved successfully!");
      // Update local state to reflect reservation
      setItem(prev => ({ ...prev, status: "reserved" }));
    } catch (error) {
      console.error("Error reserving item:", error);
      toast.error("Failed to reserve item");
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="marketplace" style={{ maxWidth: "1000px", margin: "0 auto", padding: "var(--space-xl) var(--space-md)" }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "16px", marginBottom: "var(--space-lg)", padding: 0 }}
      >
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "var(--space-xl)", background: "var(--bg-card)", padding: "var(--space-xl)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
        
        {/* Image Card */}
        <div style={{ width: "100%", height: "400px", background: "var(--bg-dark)", borderRadius: "var(--radius-md)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {item.image ? (
            <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Package size={80} color="var(--text-muted)" />
          )}
          <span className={`product-card-badge ${item.status === "available" ? "badge-available" : "badge-reserved"}`} style={{ position: "absolute", top: "16px", right: "16px" }}>
            {item.status === "available" ? "Available" : "Reserved"}
          </span>
        </div>

        {/* Details Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div>
            <span style={{ fontSize: "14px", color: "var(--accent-primary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
              {item.category}
            </span>
            <h1 style={{ margin: "8px 0", fontSize: "2.5rem", lineHeight: "1.2" }}>{item.title}</h1>
            <div style={{ fontSize: "2rem", color: "var(--text-primary)", fontWeight: "bold", margin: "16px 0" }}>
              ₹{Math.round(item.price * 1.08)}
            </div>
          </div>

          <div style={{ background: "var(--bg-darker)", padding: "var(--space-lg)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", minHeight: "150px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>Description</h3>
            <p style={{ margin: 0, color: "var(--text-primary)", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
              {item.description || "No description provided by the seller."}
            </p>
          </div>

          <div style={{ marginTop: "auto", paddingTop: "var(--space-lg)" }}>
            {item.sellerId === currentUser?.uid ? (
              <button className="buy-btn" disabled style={{ width: "100%", padding: "16px", background: "var(--bg-darker)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                <User size={20} />
                This is your listing
              </button>
            ) : item.status === "available" ? (
              <button
                className="btn btn-primary"
                onClick={handleReserve}
                style={{ width: "100%", padding: "16px", fontSize: "1.1rem", display: "flex", justifyContent: "center", gap: "8px" }}
              >
                <ShoppingCart size={20} />
                Reserve Now
              </button>
            ) : (
              <button className="buy-btn buy-btn-reserved" disabled style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }}>
                <CheckCircle size={20} />
                Reserved
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
