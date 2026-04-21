import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { register as registerApi } from '../api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '', second_name: '', last_name: '', second_last_name: '',
    phone: '', email: '', identification_type_id: 1, identification_number: '',
    password: '', role_id: 3
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerApi(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-primary rounded-2xl mb-3">
            <GraduationCap className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-sm text-neutral-600">Plataforma de electivas CUL</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Primer nombre *</label>
              <input className="input" value={form.first_name} onChange={set('first_name')} required />
            </div>
            <div>
              <label className="label">Segundo nombre</label>
              <input className="input" value={form.second_name} onChange={set('second_name')} />
            </div>
            <div>
              <label className="label">Primer apellido *</label>
              <input className="input" value={form.last_name} onChange={set('last_name')} required />
            </div>
            <div>
              <label className="label">Segundo apellido *</label>
              <input className="input" value={form.second_last_name} onChange={set('second_last_name')} required />
            </div>
            <div>
              <label className="label">Tipo de identificación *</label>
              <select className="input" value={form.identification_type_id} onChange={set('identification_type_id')}>
                <option value={1}>Cédula</option>
                <option value={2}>Tarjeta de identidad</option>
                <option value={3}>Cédula de extranjería</option>
                <option value={4}>Pasaporte</option>
              </select>
            </div>
            <div>
              <label className="label">Número de identificación *</label>
              <input className="input" value={form.identification_number} onChange={set('identification_number')} required />
            </div>
            <div>
              <label className="label">Teléfono *</label>
              <input className="input" value={form.phone} onChange={set('phone')} required />
            </div>
            <div>
              <label className="label">Correo *</label>
              <input className="input" type="email" value={form.email} onChange={set('email')} required />
            </div>
            <div className="col-span-2">
              <label className="label">Contraseña *</label>
              <input className="input" type="password" value={form.password} onChange={set('password')} required minLength={6} />
            </div>
          </div>

          {error && (
            <div className="text-sm text-danger bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Link to="/login" className="text-sm text-primary hover:underline">Volver al login</Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
