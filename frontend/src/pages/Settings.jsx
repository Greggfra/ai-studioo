import { motion } from 'framer-motion';
import { User, Mail, Shield, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, userData } = useAuthStore();

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast.success('Profilo aggiornato!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Impostazioni</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestisci il tuo profilo e le preferenze
          </p>
        </div>

        {/* Profile Section */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold">Profilo</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nome completo
              </label>
              <input
                type="text"
                defaultValue={user?.displayName}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email}
                className="input-field"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                L'email non può essere modificata
              </p>
            </div>

            <button type="submit" className="btn-primary">
              Salva Modifiche
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold">Informazioni Account</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Piano:</span>
              <span className="font-medium">{userData?.plan === 'free' ? 'Gratuito' : 'Pro'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Crediti:</span>
              <span className="font-medium">{userData?.credits || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Provider:</span>
              <span className="font-medium capitalize">{userData?.provider || 'Email'}</span>
            </div>
          </div>

          <button className="btn-primary mt-6">
            Upgrade a Pro
          </button>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Zona Pericolosa
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Una volta eliminato l'account, tutti i tuoi dati verranno rimossi permanentemente.
          </p>

          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            Elimina Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
