import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FilePlus, Plus } from 'lucide-react';

const Prescriptions = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/doctors/appointments');
      setAppointments(data.filter(a => ['Accepted', 'Completed'].includes(a.status)));
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctors/prescriptions', {
        patientId: selectedAppt.patient._id,
        appointmentId: selectedAppt._id,
        medicines: medicines.filter(m => m.name),
        notes,
      });
      toast.success('Prescription created successfully');
      setShowModal(false);
      setMedicines([{ name: '', dosage: '', frequency: '', duration: '' }]);
      setNotes('');
    } catch (error) {
      toast.error('Failed to create prescription');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2933]">Manage Prescriptions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map(app => (
          <Card key={app._id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-[#3A86FF] font-bold text-sm">
                  {app.patient?.name?.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg text-[#1F2933]">{app.patient?.name}</h3>
              </div>
              <p className="text-sm text-[#6B7280] mb-1">Date: {new Date(app.date).toLocaleDateString()}</p>
              <p className="text-sm text-[#6B7280] mb-4">Reason: {app.reason}</p>
              
              <Button 
                className="w-full" 
                onClick={() => { setSelectedAppt(app); setShowModal(true); }}
              >
                <FilePlus className="w-4 h-4 mr-2"/>
                Write Prescription
              </Button>
            </CardContent>
          </Card>
        ))}
        {appointments.length === 0 && <p className="text-[#6B7280] col-span-full text-center py-8">No active appointments available for prescriptions.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader className="bg-gray-50 sticky top-0 border-b border-[#E5E7EB] z-10">
              <CardTitle>Write Prescription for {selectedAppt?.patient?.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 mt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[#1F2933] mb-3">Medicines</h4>
                  {medicines.map((med, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 mb-3 items-end">
                      <Input 
                        placeholder="Medicine Name" 
                        value={med.name} 
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} 
                        required 
                      />
                      <Input 
                        placeholder="Dosage (e.g., 500mg)" 
                        value={med.dosage} 
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} 
                      />
                      <Input 
                        placeholder="Frequency (e.g., 1-0-1)" 
                        value={med.frequency} 
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)} 
                      />
                      <Input 
                        placeholder="Duration (e.g., 5 days)" 
                        value={med.duration} 
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)} 
                      />
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm" onClick={handleAddMedicine} className="mt-2 text-[#3A86FF]">
                    <Plus className="w-4 h-4 mr-1" /> Add Another Medicine
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-1">Additional Notes</label>
                  <textarea 
                    className="block w-full rounded-md border border-[#E5E7EB] bg-white focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20 sm:text-sm px-3 py-2 transition-colors duration-200 placeholder:text-gray-400" 
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit">Complete Prescription</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
