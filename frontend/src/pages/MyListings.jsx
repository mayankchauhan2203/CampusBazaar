import { collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, PlusCircle, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function MyListings() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

              <div style={{ padding: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)' }}>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
