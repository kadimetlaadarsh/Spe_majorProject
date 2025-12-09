import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the Medical ERP. Use the links below to navigate.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12 }}>
        <Link to="/patients" style={{ padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>Patients</Link>
        <Link to="/prescriptions" style={{ padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>Prescriptions</Link>
        <Link to="/appointments" style={{ padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>Appointments</Link>
        <Link to="/billing" style={{ padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>Billing</Link>
      </div>
    </div>
  );
}
