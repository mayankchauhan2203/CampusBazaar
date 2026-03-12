import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px",
      backgroundColor: "#222",
      color: "white"
    }}>
      <h2>CampusBazaar</h2>

      <div style={{display:"flex", gap:"20px"}}>
        <Link to="/" style={{color:"white"}}>Home</Link>
        <Link to="/marketplace" style={{color:"white"}}>Marketplace</Link>
        <Link to="/post-item" style={{color:"white"}}>Post Item</Link>
        <Link to="/profile" style={{color:"white"}}>Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;