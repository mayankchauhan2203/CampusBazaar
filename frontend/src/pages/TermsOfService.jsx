import React from 'react';
import { FileText, ChevronRight, AlertTriangle, Shield, Users, Scale, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const GRIEVANCE_EMAIL = "peermartiitd@gmail.com";
const EFFECTIVE_DATE = "April 1, 2025";

const sections = [
  {
    icon: <Shield size={16} color="var(--accent-primary)" />,
    title: "1. Platform Overview & Nature of Service",
    body: `PeerMart is a peer-to-peer campus marketplace designed exclusively for verified students of IIT Delhi. The platform acts as a neutral intermediary under Section 2(w) of the Information Technology Act, 2000, providing a digital noticeboard that connects buyers and sellers. PeerMart does not own, warehouse, inspect, or physically handle any listed items. It does not participate in, guarantee, or mediate the actual exchange of goods. All transactions are conducted directly between consenting students in person on campus. PeerMart's role is solely to facilitate discovery and initial contact.`
  },
  {
    icon: <Users size={16} color="var(--accent-primary)" />,
    title: "2. User Eligibility",
    body: `Access to PeerMart is restricted exclusively to current students of IIT Delhi. Registration is performed through the official IITD institutional OAuth login, which verifies your institutional identity. By creating an account and using this platform, you confirm that: (a) you are a currently enrolled student of IIT Delhi; (b) all information you provide is accurate and complete; and (c) you will use the platform in good faith and in compliance with these Terms. Former students and non-IITD users are not permitted to use this platform.`
  },
  {
    icon: <FileText size={16} color="var(--accent-primary)" />,
    title: "3. Listings & Prohibited Content",
    body: `Users may list any second-hand goods that are legally owned by them and permissible under IITD norms. The following are strictly prohibited on PeerMart: (a) illegal items, stolen goods, or items of unknown origin; (b) counterfeit, fake, or replica products of any kind; (c) weapons, explosives, or hazardous materials; (d) prescription drugs, substances, or alcohol; (e) financial instruments, coupons, or digital currency; (f) items that infringe on intellectual property rights; (g) any content that is misleading, fraudulent, or misrepresented in the listing. PeerMart reserves the right to remove any listing that violates these restrictions without prior notice.`
  },
  {
    icon: <AlertTriangle size={16} color="var(--accent-primary)" />,
    title: "4. Platform Conduct & Enforcement",
    body: `To maintain the integrity of the marketplace, each user is limited to 2 new listings and 2 new reservations per 24-hour period. The following conduct may result in account suspension, restriction, or permanent banning: submitting false or misleading reports; repeatedly reserving items without completing the transaction; posting fraudulent or duplicate listings; harassment or threatening other users; circumventing platform restrictions through any technical means. Enforcement decisions are made by platform administrators at their sole discretion and are final.`
  },
  {
    title: "5. Reservation Fee & Refund Policy",
    custom: true
  },
  {
    icon: <Scale size={16} color="var(--accent-primary)" />,
    title: "6. Limitation of Liability & Disclaimer",
    body: `PeerMart is an intermediary platform and expressly disclaims liability for: (a) the quality, safety, legality, or condition of any listed item; (b) the accuracy of any listing description or images; (c) any loss, damage, or harm arising from in-person transactions between users; (d) disputes between buyers and sellers; (e) failure of a transaction to complete for any reason. As an intermediary under the IT Act 2000, PeerMart is not liable for user-generated content (listings) as long as it acts in accordance with its due diligence obligations. PeerMart does not make any representations or warranties — express or implied — regarding the platform's fitness for any particular purpose, availability, or error-free operation. Use of this platform is at your own risk.`
  },
  {
    icon: <Shield size={16} color="var(--accent-primary)" />,
    title: "7. Dispute Resolution",
    body: `Disputes arising directly between a buyer and seller regarding the quality, quantity, or condition of items are the primary responsibility of those parties to resolve in person. PeerMart may assist in mediating disputes involving the reservation fee at the discretion of the platform administrators. To initiate a dispute or request a refund, the affected user must: (1) use the "Raise an Issue" feature in their Profile page, providing full details of the situation; or (2) email the Grievance Officer at peermartiitd@gmail.com with the subject "Dispute Resolution Request." All disputes are reviewed by a platform administrator and resolved at our discretion. Decisions regarding refund eligibility are final. These Terms shall be governed by the laws of India. Disputes not resolved by the platform shall be subject to the jurisdiction of the courts of New Delhi.`
  },
  {
    icon: <FileText size={16} color="var(--accent-primary)" />,
    title: "8. Account Suspension & Termination",
    body: `Platform administrators reserve the right to suspend, block, or permanently delete any account at any time if these Terms are violated, without prior notice. You may also delete your account voluntarily from the Account Settings section of your Profile, which will remove your profile, active listings, and active reservations. Completed transaction records may be retained for up to 90 days for grievance and audit purposes before being removed.`
  },
  {
    icon: <Scale size={16} color="var(--accent-primary)" />,
    title: "9. Applicable Law & Intermediary Status",
    body: `PeerMart operates as an intermediary under Section 2(w) of the Information Technology Act, 2000, and complies with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. As a condition of such intermediary status, PeerMart: (a) publishes this Terms of Service and a Privacy Policy; (b) informs users not to host or transmit unlawful content; (c) removes unlawful content upon receipt of a valid complaint or government/court order; (d) does not knowingly host content that is grossly harmful, obscene, defamatory, or in violation of Indian law; and (e) maintains a Grievance Redressal Officer. Additionally, as real monetary transactions occur between students, the Consumer Protection Act, 2019 applies to the extent that PeerMart makes no false or misleading representations about its services, discloses its fee structure clearly, and maintains a published grievance mechanism accessible to all users.`
  }
];

function TermsOfService() {
  return (
    <div className="marketplace" style={{ maxWidth: '860px', margin: '0 auto', minHeight: 'calc(100vh - 80px)' }}>
      <div className="marketplace-header" style={{ textAlign: "left", marginBottom: "var(--space-xl)" }}>
        <h1><span className="gradient-text">Terms of Service</span></h1>
        <p>
          Effective Date: <strong>{EFFECTIVE_DATE}</strong> &nbsp;|&nbsp; Platform: PeerMart (peermart.vercel.app) &nbsp;|&nbsp; Operated by: Mayank Chauhan, IIT Delhi
        </p>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          These terms govern your use of PeerMart. By accessing or using the platform, you agree to be bound by these Terms. Compliance with the <strong>IT Act 2000</strong>, <strong>IT Rules 2021</strong>, and <strong>Consumer Protection Act 2019</strong> is observed.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {sections.map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: 'var(--space-lg) var(--space-xl)', background: 'var(--bg-darker)', borderBottom: '1px solid var(--border-subtle)' }}>
              {s.icon ?? <FileText size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />}
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.1px' }}>{s.title}</h2>
            </div>
            <div style={{ padding: 'var(--space-xl)' }}>
              {s.custom ? (
                <>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-md)', marginTop: 0 }}>
                    A platform fee of <strong style={{ color: 'var(--text-primary)' }}>3% of the item price</strong> (maximum <strong style={{ color: 'var(--text-primary)' }}>₹30</strong>) is charged at the time of reservation, processed securely through Razorpay. This fee constitutes the cost of the reservation service and is separate from the item price paid directly to the seller. Listing items on PeerMart is entirely free of charge.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                    <div style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}>
                      <p style={{ margin: '0 0 6px 0', fontWeight: 700, fontSize: '13px', color: '#4ade80' }}>✓ Eligible for Refund</p>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        The seller is unresponsive after the reservation; the item is not available or significantly different from the listing; the item is damaged or misrepresented; or any other situation where the transaction fails due to no fault of the buyer.
                      </p>
                    </div>
                    <div style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}>
                      <p style={{ margin: '0 0 6px 0', fontWeight: 700, fontSize: '13px', color: 'var(--danger)' }}>✗ Not Eligible for Refund</p>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        The buyer does not show up; the buyer changes their mind after reserving; the buyer cancels after the seller has prepared for the exchange; or any other situation where the failure is attributable to the buyer's actions.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(244,163,0,0.05)', border: '1px solid rgba(244,163,0,0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}>
                    <AlertTriangle size={15} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      To request a refund, use the <strong>"Raise an Issue"</strong> feature in your Profile page or email <a href={`mailto:${GRIEVANCE_EMAIL}`} style={{ color: 'var(--accent-primary)' }}>{GRIEVANCE_EMAIL}</a>. Refund decisions are made at the sole discretion of PeerMart administrators after reviewing the case. This process is the Grievance Redressal Mechanism as required under the <strong>Consumer Protection Act, 2019</strong>.
                    </p>
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grievance Officer Card */}
      <div style={{ marginTop: 'var(--space-2xl)', background: 'rgba(244,163,0,0.06)', border: '1px solid rgba(244,163,0,0.25)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <PhoneCall size={18} color="var(--accent-primary)" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Designated Grievance Officer</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 12px', fontSize: '14px' }}>
          In accordance with Rule 3(2) of the <strong>IT (Intermediary Guidelines) Rules, 2021</strong> and the <strong>Consumer Protection Act, 2019</strong>, a Grievance Officer is available to address complaints from users regarding the platform and its services.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>Mayank Chauhan</p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>IIT Delhi, Hauz Khas, New Delhi — 110016</p>
          <a href={`mailto:${GRIEVANCE_EMAIL}`} style={{ color: 'var(--accent-primary)', fontSize: '13px', marginTop: 2 }}>{GRIEVANCE_EMAIL}</a>
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Complaints will be acknowledged within 24 hours and resolved within 30 days.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          Back to Home <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default TermsOfService;
