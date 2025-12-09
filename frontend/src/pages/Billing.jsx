import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({ patientId: '', items: [{ description: '', cost: 0, qty: 1 }] });
  const [message, setMessage] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('http://localhost:4400/api/bills');
      setBills(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const addItem = () => setForm(prev => ({ ...prev, items: [...prev.items, { description: '', cost: 0, qty: 1 }] }));

  const changeItem = (idx, key, value) => {
    const items = [...form.items];
    items[idx][key] = key === 'cost' || key === 'qty' ? Number(value) : value;
    setForm({ ...form, items });
  };

  const createBill = async (e) => {
    e.preventDefault();
    try {
      await api.post('http://localhost:4400/api/bills', form);
      setMessage('Bill created');
      setForm({ patientId: '', items: [{ description: '', cost: 0, qty: 1 }] });
      load();
    } catch (err) {
      console.error(err);
      setMessage('Create failed');
    }
  };

  const pay = async (billId) => {
    const amount = prompt('Amount to pay (number)');
    if (!amount) return;
    try {
      await api.post(`http://localhost:4400/api/bills/${billId}/pay`, { amount: Number(amount), method: 'online' });
      setMessage('Payment recorded');
      load();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Pay failed');
    }
  };

  return (
    <div>
      <h2>Billing</h2>

      <form onSubmit={createBill} style={{ border: '1px solid #eee', padding: 12, marginBottom: 12 }}>
        <input placeholder="Patient ID" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required />
        <div style={{ marginTop: 8 }}>
          {form.items.map((it, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input placeholder="Desc" value={it.description} onChange={e => changeItem(idx, 'description', e.target.value)} />
              <input placeholder="Cost" type="number" value={it.cost} onChange={e => changeItem(idx, 'cost', e.target.value)} style={{ width: 120 }} />
              <input placeholder="Qty" type="number" value={it.qty} onChange={e => changeItem(idx, 'qty', e.target.value)} style={{ width: 80 }} />
            </div>
          ))}
        </div>
        <div>
          <button type="button" onClick={addItem}>Add item</button>
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">Create Bill</button>
        </div>
      </form>

      {message && <div>{message}</div>}

      <div>
        <h3>Recent bills</h3>
        <table style={{ width: '100%' }}>
          <thead>
            <tr><th>Patient</th><th>Total</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {bills.map(b => (
              <tr key={b._id}>
                <td>{b.patientId}</td>
                <td>{b.total?.toFixed?.(2) ?? b.total}</td>
                <td>{b.status}</td>
                <td>
                  <button onClick={() => pay(b._id)}>Pay</button>
                </td>
              </tr>
            ))}
            {bills.length === 0 && <tr><td colSpan="4">No bills</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
