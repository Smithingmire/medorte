import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { FileText, Download, Plus, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', description: '', file: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await api.get('/patients/records');
      setRecords(data);
    } catch (error) {
      toast.error('Failed to fetch records');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      return toast.error("Please select a file to upload");
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', uploadData.file);
      const uploadRes = await api.post('/upload', formData);
      const fileUrl = uploadRes.data.fileUrl;

      await api.post('/patients/records', {
        title: uploadData.title,
        description: uploadData.description,
        fileUrl,
        recordType: 'Report'
      });

      toast.success('Record uploaded successfully');
      setShowModal(false);
      setUploadData({ title: '', description: '', file: null });
      fetchRecords();
    } catch (error) {
      toast.error('Failed to upload record');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1F2933]">Medical Records</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Upload Record
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {records.map(record => (
          <Card key={record._id}>
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-50 text-[#3A86FF] rounded-md">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1F2933]">{record.title}</h3>
                  <p className="text-sm text-[#6B7280]">{new Date(record.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-sm text-[#6B7280] flex-1 mb-4 leading-relaxed">{record.description}</p>
              <div className="text-xs text-[#6B7280] mb-4">
                Uploaded by: {record.uploadedBy?.name} ({record.uploadedBy?.role})
              </div>
              <a 
                href={`http://localhost:5000${record.fileUrl}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-[#E5E7EB] text-sm font-medium rounded-md text-[#1F2933] bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" /> View Document
              </a>
            </CardContent>
          </Card>
        ))}
        {records.length === 0 && (
          <div className="col-span-full">
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-12 text-center bg-white">
              <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-[#3A86FF]" />
              </div>
              <p className="text-[#6B7280]">No medical records found. Upload one to get started.</p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-md m-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-1 text-[#1F2933]">Upload Medical Record</h2>
              <p className="text-sm text-[#6B7280] mb-5">Add a new document to your medical history</p>
              <form onSubmit={handleUpload} className="space-y-4">
                <Input 
                  label="Title" 
                  required 
                  placeholder="E.g., Blood Test Results"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                />
                
                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-1">Description</label>
                  <textarea 
                    className="block w-full rounded-md border border-[#E5E7EB] bg-white focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20 sm:text-sm px-3 py-2 transition-colors duration-200 placeholder:text-gray-400" 
                    rows="3"
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-1">Document File</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#E5E7EB] border-dashed rounded-lg cursor-pointer hover:bg-blue-50/30 hover:border-[#3A86FF] transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-[#6B7280]" />
                      <div className="flex text-sm text-[#6B7280] justify-center">
                        <label className="relative cursor-pointer rounded-md font-medium text-[#3A86FF] hover:text-[#2b6fdc] transition-colors">
                          <span>{uploadData.file ? uploadData.file.name : "Upload a file"}</span>
                          <input type="file" className="sr-only" required accept="image/*,.pdf" onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})} />
                        </label>
                      </div>
                      {!uploadData.file && <p className="text-xs text-[#6B7280]">PNG, JPG, PDF up to 10MB</p>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)} disabled={uploading}>Cancel</Button>
                  <Button type="submit" isLoading={uploading}>Upload</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
