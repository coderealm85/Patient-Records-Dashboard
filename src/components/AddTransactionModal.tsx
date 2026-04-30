import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AddTransactionModal = ({ isOpen, onClose, onAdd }: AddTransactionModalProps) => {
  const [formData, setFormData] = useState({
    patient: '',
    service: '',
    amount: '',
    status: 'Pending',
    method: 'Credit Card',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAdd(formData);
    setIsSubmitting(false);
    setFormData({ patient: '', service: '', amount: '', status: 'Pending', method: 'Credit Card' });
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
          
          <h2 className="text-2xl font-extrabold text-[#072635] mb-6">New Invoice</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-2">Patient Name</label>
              <input 
                required
                value={formData.patient}
                onChange={e => setFormData({...formData, patient: e.target.value})}
                className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                placeholder="e.g. Emily Williams"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-2">Service</label>
              <input 
                required
                value={formData.service}
                onChange={e => setFormData({...formData, service: e.target.value})}
                className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                placeholder="e.g. Annual Checkup"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-2">Amount</label>
                <input 
                  required
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                  placeholder="e.g. $150.00"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
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
                <span>Create Invoice</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTransactionModal;
