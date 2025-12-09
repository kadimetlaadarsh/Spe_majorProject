import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';

export default function Appointments() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    scheduledAt: '',
    durationMinutes: 30,
    reason: ''
  });
  const [message, setMessage] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('http://localhost:4300/api/appointments');
      setList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      await api.post('http://localhost:4300/api/appointments', payload);
      setMessage('Appointment created');
      setForm({ patientId: '', doctorId: '', scheduledAt: '', durationMinutes: 30, reason: '' });
      load();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Create failed');
    }
  };

  return (
    <div>
      <h2>Appointments</h2>

      <form onSubmit={submit} style={{ border: '1px solid #eee', padding: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Patient ID" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required />
          <input placeholder="Doctor ID" value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })} required />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} required />
          <input type="number" placeholder="Duration (minutes)" value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: Number(e.target.value) })} style={{ width: 160 }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <input placeholder="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">Create Appointment</button>
        </div>
      </form>

      {message && <div>{message}</div>}

      <div>
        <h3>Upcoming</h3>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>When</th><th>Patient</th><th>Doctor</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a._id}>
                <td>{new Date(a.scheduledAt).toLocaleString()}</td>
                <td>{a.patientId}</td>
                <td>{a.doctorId}</td>
                <td>{a.status}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="4">No appointments</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
