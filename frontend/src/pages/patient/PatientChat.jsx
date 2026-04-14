import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import io from 'socket.io-client';
import api from '../../utils/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const PatientChat = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socketURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    socketRef.current = io(socketURL);
    
    socketRef.current.on('connect', () => {
      if (user?._id) {
        socketRef.current.emit('join', user._id);
      }
    });

    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    const fetchMyDoctors = async () => {
      try {
        const { data } = await api.get('/patients/appointments');
        const validApps = data.filter(a => a && a.doctor);
        const uniqueDoctors = Array.from(new Set(validApps.map(a => a.doctor._id)))
          .map(id => validApps.find(a => a.doctor._id === id).doctor);
        setDoctors(uniqueDoctors);
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      }
    };
    fetchMyDoctors();

    return () => socketRef.current.disconnect();
  }, [user]);

  useEffect(() => {
    if (selectedDoctor) {
      api.get(`/messages/${selectedDoctor._id}`).then(({ data }) => {
        setMessages(data);
        scrollToBottom();
      });
    }
  }, [selectedDoctor]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedDoctor) return;

    socketRef.current.emit('sendMessage', {
      sender: user._id,
      receiver: selectedDoctor._id,
      text,
    });
    setText('');
  };

  return (
    <div className="flex h-[80vh] gap-4">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>My Doctors</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {doctors.map(doc => (
            <div 
              key={doc._id} 
              onClick={() => setSelectedDoctor(doc)}
              className={`p-4 border-b border-[#E5E7EB] cursor-pointer transition-colors duration-200 flex items-center gap-3 ${
                selectedDoctor?._id === doc._id 
                  ? 'bg-blue-50 border-l-2 border-l-[#3A86FF]' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-10 h-10 rounded-md bg-[#3A86FF] flex items-center justify-center text-white font-bold text-sm">
                {doc.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-[#1F2933]">Dr. {doc.name}</p>
                <p className="text-xs text-[#6B7280]">{doc.specialization}</p>
              </div>
            </div>
          ))}
          {doctors.length === 0 && <p className="p-4 text-[#6B7280] text-center text-sm">No active doctors</p>}
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col">
        {selectedDoctor ? (
          <>
            <CardHeader className="bg-gray-50 border-b border-[#E5E7EB]">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#3A86FF] flex items-center justify-center text-white font-bold text-xs">
                  {selectedDoctor.name.charAt(0)}
                </div>
                Chat with Dr. {selectedDoctor.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg, index) => {
                const isMe = msg.sender === user._id;
                return (
                  <div key={index} className={`flex w-max max-w-[70%] flex-col gap-2 rounded-lg px-4 py-2.5 text-sm ${
                    isMe 
                      ? 'ml-auto bg-[#3A86FF] text-white' 
                      : 'bg-gray-100 text-[#1F2933]'
                  }`}>
                    {msg.text}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-4 border-t border-[#E5E7EB] bg-gray-50">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="Type a message..." 
                  className="flex-1 m-0"
                />
                <Button type="submit">Send</Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#6B7280]">
            <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            Select a doctor to start chatting
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientChat;
