import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';

export default function Prescriptions() {
  const [list, setList] = useState([]);
  const [newPres, setNewPres] = useState({
    patientId: '',
    items: [{ medicine: '', dosage: '', durationDays: 5 }]
  });
  const [message, setMessage] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('http://localhost:4500/api/prescriptions');
      setList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddItem = () => {
    setNewPres(prev => ({ ...prev, items: [...prev.items, { medicine: '', dosage: '', durationDays: 5 }] }));
  };

  const handleChangeItem = (idx, key, value) => {
    const items = [...newPres.items];
    items[idx][key] = value;
    setNewPres({ ...newPres, items });
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      const payload = { patientId: newPres.patientId, items: newPres.items, notes: newPres.notes };
      const res = await api.post('http://localhost:4500/api/prescriptions', payload);
      setMessage('Prescription created');
      setList(prev => [res.data, ...prev]);
      setNewPres({ patientId: '', items: [{ medicine: '', dosage: '', durationDays: 5 }], notes: '' });
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Create failed');
    }
  };

  return (
    <div>
      <h2>Prescriptions</h2>

      <form onSubmit={create} style={{ marginBottom: 12, border: '1px solid #eee', padding: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="Patient ID" value={newPres.patientId} onChange={e => setNewPres({ ...newPres, patientId: e.target.value })} required />
        </div>

        {newPres.items.map((it, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input placeholder="Medicine" value={it.medicine} onChange={e => handleChangeItem(idx, 'medicine', e.target.value)} required />
            <input placeholder="Dosage" value={it.dosage} onChange={e => handleChangeItem(idx, 'dosage', e.target.value)} />
            <input placeholder="Duration (days)" type="number" value={it.durationDays} onChange={e => handleChangeItem(idx, 'durationDays', e.target.value)} style={{ width: 140 }} />
          </div>
        ))}

        <div>
          <button type="button" onClick={handleAddItem}>Add item</button>
        </div>

        <div style={{ marginTop: 8 }}>
          <textarea placeholder="Notes" value={newPres.notes || ''} onChange={e => setNewPres({ ...newPres, notes: e.target.value })} />
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit">Create Prescription</button>
        </div>
        {message && <div style={{ marginTop: 8 }}>{message}</div>}
      </form>

      <div>
        <h3>Recent Prescriptions</h3>
        <ul>
          {list.map(p => (
            <li key={p._id}>
              <strong>{p.patientId}</strong> — {p.items.length} items — {new Date(p.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
