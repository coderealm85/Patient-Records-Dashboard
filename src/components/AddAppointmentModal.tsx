import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AddAppointmentModal = ({ isOpen, onClose, onAdd }: AddAppointmentModalProps) => {
  const [formData, setFormData] = useState({
    patient: '',
    service: '',
    date: '',
    time: '',
    status: 'Scheduled'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAdd(formData);
    setIsSubmitting(false);
    setFormData({ patient: '', service: '', date: '', time: '', status: 'Scheduled' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl p-6 lg:p-8 w-full max-w-lg shadow-2xl relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-gray-50 text-[#072635] hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-extrabold text-[#072635] mb-6">New Appointment</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-2">Patient Name</label>
              <input 
                required
                value={formData.patient}
                onChange={e => setFormData({...formData, patient: e.target.value})}
                className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                placeholder="e.g. Jessica Taylor"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-2">Service</label>
              <input 
                required
                value={formData.service}
                onChange={e => setFormData({...formData, service: e.target.value})}
                className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                placeholder="e.g. General Checkup"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-2">Date</label>
                <input 
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-2">Time</label>
                <input 
                  type="time"
                  required
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 rounded-full text-sm font-bold text-[#707070] hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#01F0D0] rounded-full text-sm font-extrabold text-[#072635] hover:bg-[#01d9bc] shadow-lg shadow-[#01F0D0]/20 transition-all flex items-center space-x-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                <span>Schedule</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddAppointmentModal;
