'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Toast from './components/Toast';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const VoiceInput = ({ onTextReceived, targetLanguage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);
        
        try {
          const uploadResponse = await fetch('/api/upload-audio', {
            method: 'POST',
            body: formData
          });
          
          const { audioUrl } = await uploadResponse.json();
          
          const response = await fetch('/api/voice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ audioUrl })
          });
          
          const { text } = await response.json();
          onTextReceived(text);
        } catch (error) {
          console.error('Error processing voice:', error);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`p-2 rounded-full ${
        isRecording 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-purple-600 hover:bg-purple-700'
      } transition-colors`}
      title={isRecording ? 'Stop Recording' : 'Start Recording'}
    >
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isRecording ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M16 8l-8 8m0-8l8 8" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        )}
      </svg>
    </button>
  );
};

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageTargetLanguage, setImageTargetLanguage] = useState('es');
  const [translatedImageText, setTranslatedImageText] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const languages = [
    { code: 'en', name: 'English (American)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'it', name: 'Italian (Italiano)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'ko', name: 'Korean (한국어)' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'bn', name: 'Bengali (বাংলা)' },
    { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
    { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
    { code: 'ms', name: 'Malay (Bahasa Melayu)' },
    { code: 'th', name: 'Thai (ไทย)' },
    { code: 'tr', name: 'Turkish (Türkçe)' }
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          targetLanguage,
        }),
      });
      
      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageTranslate = async () => {
    if (!selectedImage) return;
    
    setIsImageLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imagePreview,
          targetLanguage: imageTargetLanguage,
        }),
      });
      
      const data = await response.json();
      setTranslatedImageText(data.translatedText);
    } catch (error) {
      console.error('Image translation error:', error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const speakTranslation = () => {
    if (!translatedText) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLanguage;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAudio(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioTranslate = async () => {
    if (!selectedAudio) return;
    
    setIsAudioLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', selectedAudio);
      formData.append('targetLanguage', targetLanguage);
      
      const response = await fetch('/api/translate-audio', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Audio translation error:', error);
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden flex items-center justify-center">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => {
          const randomOpacity = Math.random() < 0.5 ? 'opacity-20' : 'opacity-30';
          const animationDuration = `${Math.random() * 8 + 2}s`;
          const animationDelay = `${Math.random() * 5}s`;
          const top = `${Math.random() * 100}%`;
          const left = `${Math.random() * 100}%`;
          
          return (
            <div 
              key={i}
              className={`absolute w-1 h-1 bg-white rounded-full ${randomOpacity} animate-pulse`}
              style={{
                top,
                left,
                animationDuration,
                animationDelay
              }}
            />
          );
        })}
      </div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-[30rem] h-[30rem] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-[25rem] h-[25rem] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-pink-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 backdrop-blur-[2px] bg-black/5 z-0"></div>

      <div className="relative z-10 w-full px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_50px_rgba(124,58,237,0.15)] border border-gray-800 overflow-hidden relative">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
            
            <div className="flex mb-8 bg-gray-800/50 rounded-xl p-1.5 max-w-xs mx-auto">
              <button 
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === 'text' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>Text</span>
              </button>
              <button 
                onClick={() => setActiveTab('image')}
                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === 'image' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Image</span>
              </button>
              <button
                onClick={() => setActiveTab('voice')}
                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === 'voice'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.414a5 5 0 001.414 1.414m2.828 2.828a9 9 0 002.828 2.828" />
                </svg>
                <span>Voice</span>
              </button>
            </div>

            <div className={`transition-all duration-500 ${activeTab === 'text' ? 'opacity-100' : 'opacity-0 absolute -z-10 -translate-x-full'}`}>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="relative flex-1 max-w-xs">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full appearance-none bg-gray-800/70 text-white rounded-xl px-5 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-700/50"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <VoiceInput onTextReceived={setInputText} targetLanguage={targetLanguage} />
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-300"></div>
                  <div className="relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter text to translate..."
                      className="w-full h-40 bg-gray-800/70 text-white rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-700/50 hover:border-purple-500/30 transition-colors resize-none"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <span className="text-gray-400 text-xs">
                        {inputText.length}/1000
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200 group-disabled:opacity-40"></div>
                  <div className="relative px-6 py-3.5 bg-gray-900 rounded-xl leading-none flex items-center justify-center gap-2 group-hover:bg-gray-800 transition duration-200">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-medium text-white">Translating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <span className="font-medium text-white">Translate Text</span>
                      </>
                    )}
                  </div>
                </button>

                {translatedText && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden"
                  >
                    <div className="px-5 py-3 border-b border-gray-700/50 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Translation
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={speakTranslation}
                          disabled={isSpeaking}
                          className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            copyToClipboard(translatedText);
                            triggerConfetti();
                          }}
                          className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-white text-lg">{translatedText}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className={`transition-all duration-500 ${activeTab === 'image' ? 'opacity-100' : 'opacity-0 absolute -z-10 translate-x-full'}`}>
              <div className="space-y-6">
                <div className="flex justify-end">
                  <div className="relative">
                    <select
                      value={imageTargetLanguage}
                      onChange={(e) => setImageTargetLanguage(e.target.value)}
                      className="appearance-none bg-gray-800/70 text-white rounded-xl px-5 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center w-full">
                  <label className="w-full relative group cursor-pointer">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-300"></div>
                    <div className="relative flex flex-col items-center px-6 py-8 bg-gray-800/70 text-white rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-colors">
                      <svg className="w-12 h-12 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-medium">Drop your image here or click to browse</p>
                      <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG and GIF</p>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  </label>
                </div>

                {imagePreview && (
                  <div className="relative rounded-xl overflow-hidden border border-gray-700/50 animate-fade-in">
                    <div className="relative w-full h-64">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-full hover:bg-black/80 transition-colors"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleImageTranslate}
                  disabled={isImageLoading || !selectedImage}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200 group-disabled:opacity-40"></div>
                  <div className="relative px-6 py-3.5 bg-gray-900 rounded-xl leading-none flex items-center justify-center gap-2 group-hover:bg-gray-800 transition duration-200">
                    {isImageLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-medium text-white">Translating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <span className="font-medium text-white">Translate Image</span>
                      </>
                    )}
                  </div>
                </button>

                {translatedImageText && (
                  <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden animate-fade-in">
                    <div className="px-5 py-3 border-b border-gray-700/50 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Translation Complete
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => copyToClipboard(translatedImageText)}
                          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 bg-gray-800/50 px-2.5 py-1 rounded-lg text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-white">{translatedImageText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`transition-all duration-500 ${activeTab === 'voice' ? 'opacity-100' : 'opacity-0 absolute -z-10'}`}>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="relative flex-1 max-w-xs">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full appearance-none bg-gray-800/70 text-white rounded-xl px-5 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-700/50"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-center w-full">
                  <label className="w-full relative group cursor-pointer">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-300"></div>
                    <div className="relative flex flex-col items-center px-6 py-8 bg-gray-800/70 text-white rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-colors">
                      <svg className="w-12 h-12 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <p className="font-medium">Drop your audio file here or click to browse</p>
                      <p className="text-sm text-gray-400 mt-1">Supports MP3, WAV, and OGG</p>
                      <input type="file" className="hidden" accept="audio/*" onChange={handleAudioUpload} />
                    </div>
                  </label>
                </div>

                {audioPreview && (
                  <div className="relative rounded-xl overflow-hidden border border-gray-700/50 animate-fade-in">
                    <audio controls className="w-full">
                      <source src={audioPreview} type={selectedAudio.type} />
                      Your browser does not support the audio element.
                    </audio>
                    <button 
                      onClick={() => {
                        setSelectedAudio(null);
                        setAudioPreview(null);
                      }}
                      className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-full hover:bg-black/80 transition-colors"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleAudioTranslate}
                  disabled={isAudioLoading || !selectedAudio}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200 group-disabled:opacity-40"></div>
                  <div className="relative px-6 py-3.5 bg-gray-900 rounded-xl leading-none flex items-center justify-center gap-2 group-hover:bg-gray-800 transition duration-200">
                    {isAudioLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-medium text-white">Translating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <span className="font-medium text-white">Translate Audio</span>
                      </>
                    )}
                  </div>
                </button>

                {translatedText && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden"
                  >
                    <div className="px-5 py-3 border-b border-gray-700/50 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Translation
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={speakTranslation}
                          disabled={isSpeaking}
                          className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            copyToClipboard(translatedText);
                            triggerConfetti();
                          }}
                          className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-white text-lg">{translatedText}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">© 2024 Universal Translator</p>
          </div>
        </div>
      </div>

      {showCopyToast && (
        <Toast
          message="Text copied to clipboard!"
          type="success"
          onClose={() => setShowCopyToast(false)}
        />
      )}

    </main>
  );
}
