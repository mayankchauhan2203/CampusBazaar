import { collection, getDocs, getDoc, doc, deleteDoc, query, where, updateDoc, addDoc, serverTimestamp, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, PlusCircle, Trash2, Tag, X, User, Mail, Phone, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function generateOrderNumber() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randPart = Math.random().toString(36).toUpperCase().slice(2, 7);
  return `PM-${datePart}-${randPart}`;
}

function MyListings() {
  const { currentUser, userData } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchMyItems();
    }
  }, [currentUser]);

  async function fetchMyItems() {
    setLoading(true);
    try {
      const q = query(collection(db, "items"), where("sellerId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by createdAt descending locally (since we might not have a composite index set up yet)
      data.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      setItems(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your listings");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to permanently delete this listing?")) {
      try {
        await deleteDoc(doc(db, "items", id));
        toast.success("Listing deleted successfully!");
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        toast.error("Failed to delete listing");
      }
    }
  }

  async function openBuyerDetails(item) {
    if (!item.reservedBy) {
      toast.error("Could not find buyer info.");
      return;
    }
    try {
      const userRef = doc(db, "users", item.reservedBy);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setSelectedBuyer({
          name: data.name || item.reservedByName || "Unknown",
          email: data.email || item.reservedByEmail || "Private",
          phone: data.phone || item.reservedByPhone || "Not provided"
        });
      } else {
        setSelectedBuyer({
          name: item.reservedByName || "Unknown",
          email: item.reservedByEmail || "Private",
          phone: item.reservedByPhone || "Not provided",
        });
      }
      setShowBuyerModal(true);
    } catch (e) {
      toast.error("Failed to load buyer details.");
    }
  }

  async function handleMarkComplete(item) {
    if (!window.confirm("Mark this transaction as complete? This finalises the sale.")) return;
    try {
      await updateDoc(doc(db, "items", item.id), { status: "sold" });

      const orderNumber = generateOrderNumber();
      await addDoc(collection(db, "completedOrders"), {
        orderNumber,
        itemId: item.id,
        itemTitle: item.title,
        itemPrice: item.price,
        itemImage: item.image || null,
        itemCategory: item.category || null,
        sellerId: currentUser.uid,
        sellerName: currentUser.displayName || "Unknown",
        sellerEmail: currentUser.email || "N/A",
        sellerPhone: userData?.phone || "N/A",
        sellerEntryNumber: userData?.entry_number || "",
        buyerId: item.reservedBy || null,
        buyerName: item.reservedByName || "Unknown",
        buyerEmail: item.reservedByEmail || "N/A",
        buyerPhone: item.reservedByPhone || "N/A",
        buyerEntryNumber: "",
        completedAt: serverTimestamp(),
      });

      setItems(prev => prev.filter(i => i.id !== item.id));
      toast.success(`Done! Transaction #${orderNumber} marked as complete.`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark as complete");
    }
  }



  return (
    <div className="marketplace" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="marketplace-header" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
        <h1>
          My <span className="gradient-text">Listings</span>
        </h1>
        <p>Manage all the items you are currently selling.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <p className="items-count" style={{ margin: 0 }}>
          {items.length} active listing{items.length !== 1 && "s"}
        </p>
        <Link to="/post-item" className="btn btn-primary" style={{ display: "inline-flex", padding: '8px 16px' }}>
          <PlusCircle size={16} />
          New Listing
        </Link>
      </div>

      {loading && (
        <div className="loading-grid">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-body">
                <div className="skeleton-line w-60 h-lg"></div>
                <div className="skeleton-line w-80"></div>
                <div className="skeleton-line h-btn"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <Tag size={32} />
          </div>
          <h3>No listings yet</h3>
          <p>You haven't posted any items for sale.</p>
          <Link to="/post-item" className="btn btn-primary" style={{ display: "inline-flex" }}>
            <PlusCircle size={18} />
            Post your first item
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="my-listings-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {items.map((item) => (
            <div key={item.id} className="listing-list-item" style={{ 
              display: 'flex', 
              background: 'var(--bg-card)', 
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              alignItems: 'center'
            }}>
              <div style={{ width: '120px', height: '120px', flexShrink: 0, borderRight: '1px solid var(--border-subtle)' }}>
                {item.image ? (
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-darker)', color: 'var(--text-muted)' }}>
                    <Package size={32} />
                  </div>
                )}
              </div>
              
              <div style={{ padding: 'var(--space-lg)', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{item.title}</h3>
                  <span className={`product-card-badge ${item.status === "available" ? "badge-available" : "badge-reserved"}`} style={{ position: 'static', margin: 0 }}>
                    {item.status === "available" ? "Active" : "Reserved"}
                  </span>
                </div>
                <div className="price" style={{ fontSize: '1.1rem' }}>₹{item.price}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Category: {item.category}</p>
              </div>

              <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', justifyContent: 'center' }}>
                {item.status === 'reserved' ? (
                  <>
                    <button 
                      onClick={() => openBuyerDetails(item)}
                      style={{ padding: '8px 12px', background: 'var(--accent-gradient)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                    >
                      Buyer Details
                    </button>
                    <button 
                      onClick={() => handleMarkComplete(item)}
                      style={{ padding: '8px 12px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.25)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                    >
                      Mark Complete
                    </button>

                  </>
                ) : (
                  <button 
                    onClick={() => handleDelete(item.id)}
                    style={{ 
                      padding: '8px', 
                      background: 'rgba(248, 113, 113, 0.1)', 
                      color: 'var(--danger)', 
                      border: '1px solid rgba(248, 113, 113, 0.2)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete Listing"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buyer Details Modal */}
      {showBuyerModal && selectedBuyer && (
        <div className="reserve-modal-overlay">
          <div className="reserve-modal" style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-md)' }}>
              <h2 className="reserve-modal-title" style={{ margin: 0, fontSize: '1.25rem' }}>Buyer Details</h2>
              <button 
                onClick={() => setShowBuyerModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--bg-darker)', padding: '10px', borderRadius: '50%', color: 'var(--text-secondary)' }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</div>
                  <div style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: '500' }}>{selectedBuyer.name || "Unknown"}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--bg-darker)', padding: '10px', borderRadius: '50%', color: 'var(--text-secondary)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</div>
                  <div style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: '500' }}>{selectedBuyer.email || "Private"}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--bg-darker)', padding: '10px', borderRadius: '50%', color: 'var(--accent-primary)' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</div>
                  <div style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: '500' }}>{selectedBuyer.phone || "Not provided"}</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(244, 163, 0, 0.05)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px inset var(--border-subtle)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ShieldAlert size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Coordinate a safe meeting place on campus before completing the transaction. 
              </p>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default MyListings;
