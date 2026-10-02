import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, MapPin, Plus, Trash2, Shield, Check } from 'lucide-react';
import { authService } from '../services/authService.js';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const UserProfile = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMessage, setProfileMessage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // New Address State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileMessage(null);
      await authService.updateProfile({ name, phone });
      await refreshUser();
      setProfileMessage({ type: 'success', text: 'Royal profile updated successfully' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await authService.addAddress(newAddress);
      await refreshUser();
      setShowAddressModal(false);
      setNewAddress({
        fullName: user?.name || '',
        phone: user?.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      try {
        await authService.deleteAddress(addressId);
        await refreshUser();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-12 px-4 sm:px-8 max-w-5xl mx-auto">
      <SEOHead title="My Royal Account" />

      <div className="border-b border-gold/20 pb-6 mb-10">
        <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-zinc-100 font-semibold">
          Royal Patron Account
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your personal credentials and residences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Settings */}
        <div className="p-6 bg-noir-card border border-gold/20 space-y-5 h-fit">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <User className="w-4 h-4 text-gold" />
            <h3 className="font-serif text-sm uppercase tracking-wider text-gold font-semibold">
              Profile Credentials
            </h3>
          </div>

          {profileMessage && (
            <div
              className={`p-3 text-xs ${
                profileMessage.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
            >
              {profileMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                Patron Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-noir/50 border border-zinc-900 p-2.5 text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                Phone Contact
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91..."
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
              />
            </div>

            <button type="submit" disabled={savingProfile} className="w-full btn-gold py-2.5 text-xs">
              {savingProfile ? 'Updating...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Address Book */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 bg-noir-card border border-gold/20 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-sm uppercase tracking-wider text-gold font-semibold">
                  Saved Residences & Addresses
                </h3>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="btn-outline-gold py-1.5 px-3 text-[10px] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Residence</span>
              </button>
            </div>

            {user?.addresses?.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">
                No delivery residences saved yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.addresses?.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-4 bg-noir border border-gold/15 relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-zinc-200">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-gold/20 text-gold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {addr.addressLine1}
                        {addr.addressLine2 && `, ${addr.addressLine2}`}
                        <br />
                        {addr.city}, {addr.state} - {addr.postalCode}
                        <br />
                        Phone: {addr.phone}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="mt-4 text-[10px] text-zinc-500 hover:text-red-400 self-end flex items-center gap-1 uppercase tracking-wider"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-noir-card border border-gold/40 p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg text-gold uppercase tracking-wider font-semibold">
              Add New Residence
            </h3>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  className="bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
                <input
                  type="tel"
                  required
                  placeholder="Contact Phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <input
                type="text"
                required
                placeholder="Address Line 1 (Villa/Flat, Street)"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
              />

              <input
                type="text"
                placeholder="Address Line 2 (Landmark)"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
                <input
                  type="text"
                  required
                  placeholder="PIN Code"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  className="bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2 px-5 text-xs">
                  Save Residence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
