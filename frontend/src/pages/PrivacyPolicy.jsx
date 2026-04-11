import React from 'react';
import { Lock, ChevronRight, Shield, Users, RefreshCw, Database, AlertTriangle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const GRIEVANCE_EMAIL = "peermartiitd@gmail.com";
const EFFECTIVE_DATE = "April 1, 2025";

const sections = [
  {
    icon: <Users size={18} color="var(--accent-primary)" />,
    title: "1. Information We Collect",
    body: `PeerMart collects only the minimum data necessary to operate the marketplace. Through your IITD institutional login (OAuth 2.0), we receive your full name, institutional email address, entry number, department, year of study, and hostel affiliation. You may additionally provide a phone number, which is required only when placing a reservation. We also store data you generate on the platform: item listings (title, description, category, price, images), reservation records, completed transaction history, reports submitted against listings, and any queries or feedback you send to the administration. Device identifiers, IP addresses, and browser metadata are not directly collected by PeerMart.`
  },
  {
    icon: <Database size={18} color="var(--accent-primary)" />,
    title: "2. How Your Data Is Stored",
    body: `All user data is stored on Google Firebase (Firestore & Firebase Authentication), a cloud-based database service operated by Google LLC and governed by Google's data processing terms. Images uploaded as part of item listings are hosted on Cloudinary, a cloud media service. Payment processing is handled exclusively by Razorpay, a PCI-DSS Level 1 compliant payment gateway. PeerMart does not store any card numbers, bank account details, or sensitive payment credentials on its servers. Data is transmitted over HTTPS using TLS encryption. Firebase enforces role-based security rules that restrict read/write access to authenticated users and authorised administrators.`
  },
  {
    icon: <Shield size={18} color="var(--accent-primary)" />,
    title: "3. How Your Information Is Used",
    body: `Your information is used solely to facilitate peer-to-peer transactions within the IITD campus. When a reservation is confirmed, the buyer's name, email, and phone number are shared with the seller, and the seller's contact details are shared with the buyer, to enable direct coordination for the in-person exchange. Platform administrators may access user profiles, listings, reservations, and completed orders strictly for the purposes of dispute resolution, content moderation, Terms enforcement, and platform health monitoring. Your data is never used for advertising, marketing, profiling, or any commercial purpose.`
  },
  {
    icon: <Lock size={18} color="var(--accent-primary)" />,
    title: "4. Third-Party Sharing",
    body: `PeerMart does not sell, rent, lease, or trade your personal information to any third party. The only external services that receive limited data are: (a) Razorpay — receives the reservation amount and an anonymised order reference; (b) Cloudinary — receives image files uploaded for listings; (c) Google Firebase/Firestore — stores all platform data as the infrastructure provider. We do not share your data with advertisers, analytics brokers, or any other commercial entities. If required by a court order or applicable Indian law, we may disclose data to competent authorities.`
  },
  {
    icon: <RefreshCw size={18} color="var(--accent-primary)" />,
    title: "5. Data Retention & Account Deletion",
    body: `You may delete your PeerMart account at any time from the Account Settings section of your Profile page. Deleting your account will immediately remove your personal profile, all active listings, and any active reservations. Completed transaction records may be retained for up to 90 days as required for grievance resolution and institutional record-keeping. To request manual deletion of specific data or your complete account data, raise a request using the "Raise an Issue" feature in your Profile, or email us at peermartiitd@gmail.com with the subject line "Data Deletion Request." We will process your request within 30 days in accordance with applicable law.`
  },
  {
    icon: <Shield size={18} color="var(--accent-primary)" />,
    title: "6. Admin & Platform Visibility",
    body: `Platform administrators have read access to user profiles, listings, reservations, and completed orders for the purposes described above. Messages sent through "Raise an Issue" and feedback submitted through the Feedback page are visible exclusively to administrators and are kept confidential. Standard users cannot view each other's contact information except in the context of a confirmed reservation. All administrator access is logged.`
  },
  {
    icon: <AlertTriangle size={18} color="var(--accent-primary)" />,
    title: "7. Compliance — Indian Law",
    body: `This Privacy Policy is published in compliance with the Information Technology Act, 2000 (IT Act), the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (IT Rules 2011), and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. As an intermediary platform, PeerMart observes due diligence obligations including publishing a Privacy Policy, Terms of Service, and a Grievance Redressal Mechanism. Our Grievance Officer can be contacted at: peermartiitd@gmail.com. Grievances will be acknowledged within 24 hours and resolved within 30 days.`
  }
];

function PrivacyPolicy() {
  return (
    <div className="marketplace" style={{ maxWidth: '860px', margin: '0 auto', minHeight: 'calc(100vh - 80px)' }}>
      <div className="marketplace-header" style={{ textAlign: "left", marginBottom: "var(--space-xl)" }}>
        <h1><span className="gradient-text">Privacy Policy</span></h1>
        <p>
          Effective Date: <strong>{EFFECTIVE_DATE}</strong> &nbsp;|&nbsp; Platform: PeerMart (peermart.vercel.app) &nbsp;|&nbsp; Operated by: Mayank Chauhan, IIT Delhi
        </p>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          We are committed to being transparent about how your data is collected, used, and protected. This policy is published in compliance with the <strong>IT Act 2000</strong> and <strong>IT Rules 2011</strong>.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {sections.map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: 'var(--space-lg) var(--space-xl)', background: 'var(--bg-darker)', borderBottom: '1px solid var(--border-subtle)' }}>
              {s.icon}
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.title}</h2>
            </div>
            <div style={{ padding: 'var(--space-xl)' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grievance Officer Card */}
      <div style={{ marginTop: 'var(--space-2xl)', background: 'rgba(244,163,0,0.06)', border: '1px solid rgba(244,163,0,0.25)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Mail size={18} color="var(--accent-primary)" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Grievance Officer</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '14px' }}>
          In accordance with the <strong>IT Act 2000</strong> and <strong>IT Rules 2011</strong>, a Grievance Officer has been designated for this platform. If you have a complaint regarding your personal data, content removal, or any other matter, please contact:
        </p>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>Mayank Chauhan</p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>IIT Delhi, New Delhi — 110016</p>
          <a href={`mailto:${GRIEVANCE_EMAIL}`} style={{ color: 'var(--accent-primary)', fontSize: '13px', marginTop: 2 }}>{GRIEVANCE_EMAIL}</a>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Grievances acknowledged within 24 hours · Resolved within 30 days</p>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
        <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex' }}>
          Back to Home <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
