import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  Image as ImageIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  Paperclip,
} from 'lucide-react';
import { GradeLevel, Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGrade: GradeLevel | 'All';
  selectedSubject?: string;
  language?: Language;
}

type TutorMode = 'general' | 'simple' | 'examples' | 'practice' | 'hints' | 'summary';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  subject?: string;
  imageUrl?: string;
  mode?: TutorMode;
}

const QUICK_PROMPTS = [
  { label: '🧬 Biology: Genetics & Punnett Squares', subject: 'Biology', prompt: 'Explain Mendelian genetics, monohybrid crosses, and step-by-step Punnett square probability for Grade 11 Biology.' },
  { label: '⚛️ Physics: Newton\'s Laws & Vectors', subject: 'Physics', prompt: 'Break down Newton\'s 3 Laws of Motion and vector resolution with step-by-step formulas for secondary physics.' },
  { label: '🏛️ History: Battle of Adwa (1896)', subject: 'History', prompt: 'Detail the strategic milestones, leadership of Emperor Menelik II & Empress Taytu, and global anti-colonial significance of the Battle of Adwa.' },
  { label: '🧬 Biology: Photosynthesis vs Respiration', subject: 'Biology', prompt: 'Compare Light-dependent/Calvin cycle reactions with Glycolysis and Krebs cycle with ATP balances.' },
  { label: '⚛️ Physics: Electromagnetism & Induction', subject: 'Physics', prompt: 'Explain Faraday\'s law of electromagnetic induction, Lenz\'s law, and right-hand rules with calculation examples.' },
  { label: '🏛️ History: Ancient Aksumite Civilization', subject: 'History', prompt: 'Summarize the rise, trade networks (Adulis), coinage, Ge\'ez script, and monuments of the Aksumite Empire.' },
  { label: '📐 Mathematics: Calculus Derivatives', subject: 'Mathematics', prompt: 'Explain Power, Product, Quotient, and Chain rules for derivatives with 3 step-by-step worked examples.' },
  { label: '🧪 Chemistry: Chemical Equilibrium', subject: 'Chemistry', prompt: 'Explain Le Chatelier\'s principle with temperature, pressure, and concentration shifts, using the Haber process.' },
];

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  selectedGrade,
  selectedSubject = 'Mathematics',
  language = 'en',
}) => {
  const [subject, setSubject] = useState<string>(selectedSubject);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(language);
  const [tutorMode, setTutorMode] = useState<TutorMode>('general');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Photo / Image Upload State
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; previewUrl: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Microphone Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Text to Speech State
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const initialGreeting = language === 'am'
    ? `👋 ሰላም! እኔ **የእዮኤል እንዳለ በለጠ የኤአይ አስጠኚ** ነኝ። ለ9ኛ-12ኛ ክፍል ተማሪዎች የትምህርት ጥያቄዎችን፣ የፎቶ እና የድምጽ ጥያቄዎችን ለመመለስ ተዘጋጅቻለሁ።

ዛሬ በምን ላግዝዎ?
- 🧬 **ባዮሎጂ (Biology)**: ጀነቲክስ፣ ሴሉላር ሪስፒሬሽን፣ የሰውነት አካላት
- ⚛️ **ፊዚክስ (Physics)**: ቬክተር፣ ኒውተን ህጎች፣ ኤሌክትሮማግኔቲዝም
- 🏛️ **ታሪክ (History)**: የአድዋ ድል፣ የአክሱም ስልጣኔ፣ የዓለም ታሪክ
- 📷 **ፎቶ አስገባ**: የቤት ስራ ወይም የፈተና ጥያቄ ፎቶ አንስተው በመጫን ማብራሪያ ይጠይቁ!
- 🎙️ **ድምጽ**: ማይክራፎን ተጠቅመው በቀጥታ በድምጽ ይጠይቁ!`
    : language === 'om'
    ? `👋 Akkam jirtu! Ani **Barsiisaa AI Eyoel Endale Belete** dha. Barattoota kutaa 9–12tiif gaaffilee barnootaa, suuraafi sagalee deebisuuf qophiidha.

Har'a maaliin isin gargaaru?
- 🧬 **Baayoloojii (Biology)**: Jiineetiksii, qorannoo seelii
- ⚛️ **Fiiziksii (Physics)**: Seera Niwutanii, Elektiroomaagineetizimii
- 🏛️ **Seenaa (History)**: Injifannoo Adwaa, Mootummaa Aksum
- 📷 **Suuraa Ol-fe'aa**: Gaaffii kitaabaa suuraan kaasanii deebii argadhaa!
- 🎙️ **Sagalee**: Maaykiroofooniin kallattiin gaafadhaa!`
    : `👋 Greetings! I am **Eyoel Endale Belete AI Study Tutor**, your multimodal academic assistant for Grade 9–12 secondary curricula.

How can I assist your studies today?
- 🧬 **Biology**: Genetics, Cellular Respiration, Organ systems, Ecology
- ⚛️ **Physics**: Mechanics, Kinematics, Electromagnetism, Quantum physics
- 🏛️ **History**: Adwa Victory, Aksumite Civilization, World Wars & Horn of Africa
- 📷 **Photo Upload**: Upload a picture of any textbook question or diagram for step-by-step breakdown!
- 🎙️ **Voice / Mic**: Tap the microphone to speak your question directly!`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'am' ? 'am-ET' : 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type or upload photos!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Could not start recognition:', e);
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage({
        data: result,
        mimeType: file.type,
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    const imageToSend = selectedImage;

    if ((!textToSend.trim() && !imageToSend) || isLoading) return;

    // Stop speech recognition if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim() || 'Please analyze this uploaded photo/problem:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject,
      imageUrl: imageToSend?.previewUrl,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputQuery('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend || `Please provide a ${tutorMode} breakdown for ${subject}:`,
          subject: subject,
          grade: selectedGrade === 'All' ? 'Grade 12' : selectedGrade,
          mode: tutorMode,
          language: currentLanguage,
          image: imageToSend ? { data: imageToSend.data, mimeType: imageToSend.mimeType } : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || 'Here is the step-by-step academic explanation:';

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      // Fallback offline assistance
      const fallbackReply = language === 'am'
        ? `### 💡 የትምህርት ማብራሪያ: ${subject}
ጥያቄዎ: "${textToSend || 'የተጫነ ፎቶ'}"

1. **ዋና ፅንሰ-ሀሳብ**: በ **${subject}** ስርዓተ-ትምህርት ውስጥ ቁልፍ ቀመሮችንና ቃላትን ይመልከቱ።
2. **ደረጃ በደረጃ ልምምድ**: በ **9-12ኛ ክፍል የልምምድ ፈተናዎች** እውቀትዎን ይፈትሹ።
3. **ማስታወሻ**: በቅንብሮች (Settings) ውስጥ የGemini API Key በማስገባት ቅጽበታዊ የፎቶ እና የድምጽ ትንተና ማግኘት ይችላሉ!`
        : `### 💡 Academic Study Insight: ${subject}
Regarding your query: "${textToSend || 'Uploaded photo query'}"

1. **Fundamental Rule**: Review the corresponding unit notes in the **Curriculum** section to reinforce core formulas, diagrams, and definitions.
2. **Key Strategy**: Practice active recall by taking the **Grade 9–12 Practice Quizzes**.
3. **Exam Tip**: In national exam problems, identify all given parameters and units before solving!`;

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner speech
    const cleanText = text.replace(/[#*`_$-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleResetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingMsgId(null);
    setSelectedImage(null);
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#111112] rounded-3xl max-w-3xl w-full border border-[#2D2D30] shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[780px] relative text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D2D30] bg-[#0E0E10] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059] flex items-center justify-center text-black font-bold shadow-md shadow-[#C5A059]/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                  EYOEL ENDALE BELETE AI
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Multimodal AI
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Grade 9–12 Biology, Physics, History & STEM Multimodal Tutor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1A1A1C] transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1A1A1C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subject, Grade, & Language Bar */}
        <div className="px-4 py-2.5 bg-[#161618] border-b border-[#2D2D30] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.filterBySubject}:
            </span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-3 py-1 rounded-lg bg-[#1A1A1C] border border-[#2D2D30] text-xs font-semibold text-[#C5A059] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="Biology">🧬 Biology</option>
              <option value="Physics">⚛️ Physics</option>
              <option value="History">🏛️ History</option>
              <option value="Mathematics">📐 Mathematics</option>
              <option value="Chemistry">🧪 Chemistry</option>
              <option value="English">📚 English Language</option>
              <option value="Information Technology">💻 Information Technology</option>
              <option value="Geography">🌍 Geography</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[#1A1A1C] p-0.5 rounded-lg border border-[#2D2D30]">
            <button
              type="button"
              onClick={() => setCurrentLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentLanguage === 'en' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setCurrentLanguage('am')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentLanguage === 'am' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              አማርኛ
            </button>
            <button
              type="button"
              onClick={() => setCurrentLanguage('om')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentLanguage === 'om' ? 'bg-[#C5A059] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Oromoo
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-slate-400 text-xs">
            <span>
              {currentLanguage === 'am' ? 'ክፍል:' : currentLanguage === 'om' ? 'Kutaa:' : 'Grade:'} <strong className="text-white">{selectedGrade}</strong>
            </span>
          </div>
        </div>

        {/* Pedagogical Study Mode Selector */}
        <div className="px-4 py-2 bg-[#121214] border-b border-[#2D2D30] overflow-x-auto flex items-center gap-1.5 scrollbar-thin shrink-0">
          <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider shrink-0 mr-1">
            {currentLanguage === 'am' ? 'የጥናት ዘዴ:' : currentLanguage === 'om' ? 'Akkaataa Qo\'annoo:' : 'Study Mode:'}
          </span>

          <button
            type="button"
            onClick={() => setTutorMode('general')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              tutorMode === 'general'
                ? 'bg-[#C5A059] text-black border-[#C5A059]'
                : 'bg-[#1A1A1C] text-slate-300 border-[#2D2D30] hover:border-slate-500'
            }`}
          >
            💬 {currentLanguage === 'am' ? 'አጠቃላይ ጥናት' : currentLanguage === 'om' ? 'Waliigala' : 'General'}
          </button>

          <button
            type="button"
            onClick={() => {
              setTutorMode('simple');
              handleSendMessage(`Please explain ${subject} concepts simply with everyday analogies and zero confusing jargon.`);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              tutorMode === 'simple'
                ? 'bg-[#C5A059] text-black border-[#C5A059]'
                : 'bg-[#1A1A1C] text-slate-300 border-[#2D2D30] hover:border-slate-500'
            }`}
            title="Get simple, intuitive explanations"
          >
            💡 {currentLanguage === 'am' ? 'ቀላል ማብራሪያ' : currentLanguage === 'om' ? 'Ibsa Salphaa' : 'Simple Explanation'}
          </button>

          <button
            type="button"
            onClick={() => {
              setTutorMode('examples');
              handleSendMessage(`Give me 2-3 real-world practical examples and exam problems for ${subject}.`);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              tutorMode === 'examples'
                ? 'bg-[#C5A059] text-black border-[#C5A059]'
                : 'bg-[#1A1A1C] text-slate-300 border-[#2D2D30] hover:border-slate-500'
            }`}
            title="Get real-world and national exam examples"
          >
            🔍 {currentLanguage === 'am' ? 'ምሳሌዎች' : currentLanguage === 'om' ? 'Fakkeenya' : 'Examples'}
          </button>

          <button
            type="button"
            onClick={() => {
              setTutorMode('practice');
              handleSendMessage(`Generate 3 high-yield practice multiple-choice questions for Grade 12 ${subject} with answer keys.`);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              tutorMode === 'practice'
                ? 'bg-[#C5A059] text-black border-[#C5A059]'
                : 'bg-[#1A1A1C] text-slate-300 border-[#2D2D30] hover:border-slate-500'
            }`}
            title="Generate practice questions"
          >
            📝 {currentLanguage === 'am' ? 'የልምምድ ጥያቄዎች' : currentLanguage === 'om' ? 'Gaaffilee Shaakalaa' : 'Practice Questions'}
          </button>

          <button
            type="button"
            onClick={() => {
              setTutorMode('hints');
              handleSendMessage(`Give me Socratic hints and guiding clues to solve my next ${subject} problem (don't give direct answers yet).`);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              tutorMode === 'hints'
                ? 'bg-[#C5A059] text-black border-[#C5A059]'
                : 'bg-[#1A1A1C] text-slate-300 border-[#2D2D30] hover:border-slate-500'
            }`}
            title="Get hints instead of direct answers"
          >
            🧩 {currentLanguage === 'am' ? 'ፍንጮች ብቻ (Hints)' : currentLanguage === 'om' ? 'Qajeelfama (Hints)' : 'Hints Only'}
          </button>

          <button
            type="button"
            onClick={() => {
              setTutorMode('summary');
              handleSendMessage(`Provide a comprehensive high school lesson summary for ${subject} with key formulas and terms.`);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              tutorMode === 'summary'
                ? 'bg-[#C5A059] text-black border-[#C5A059]'
                : 'bg-[#1A1A1C] text-slate-300 border-[#2D2D30] hover:border-slate-500'
            }`}
            title="Summarize lesson"
          >
            📑 {currentLanguage === 'am' ? 'ማጠቃለያ' : currentLanguage === 'om' ? 'Cuunfaa' : 'Summarize'}
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#0E0E10]">
          {messages.map((msg) => {
            const isAI = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-black flex items-center justify-center shrink-0 mt-1 font-bold text-sm">
                    E
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 relative group ${
                    isAI
                      ? 'bg-[#1A1A1C] border border-[#2D2D30] text-slate-200 shadow-md'
                      : 'bg-[#C5A059] text-black font-medium shadow-md'
                  }`}
                >
                  {/* Uploaded Image Thumbnail in user message */}
                  {msg.imageUrl && (
                    <div className="mb-2 overflow-hidden rounded-xl border border-black/20 max-w-xs">
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded student homework"
                        className="w-full h-auto max-h-48 object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                  <div className="flex items-center justify-between text-[10px] opacity-60 pt-1 border-t border-current/10">
                    <span>{msg.timestamp}</span>
                    {isAI && (
                      <div className="flex items-center gap-3">
                        {/* TTS Audio Speak Button */}
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className="hover:opacity-100 flex items-center gap-1 text-[#C5A059]"
                          title="Read aloud"
                        >
                          {speakingMsgId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                              <span className="text-rose-400">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:opacity-100 flex items-center gap-1"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-lg bg-[#2D2D30] text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-black flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#1A1A1C] border border-[#2D2D30] rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
                <span>
                  {language === 'am' ? 'የኤአይ አስጠኚ መልስዎን እያዘጋጀ ነው...' : language === 'om' ? 'Barsiisaan AI deebii keessan qopheessaa jira...' : 'AI Tutor is analyzing your question & formulating step-by-step answer...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Selected Image Preview Pill */}
        {selectedImage && (
          <div className="px-4 py-2 bg-[#18181A] border-t border-[#2D2D30] flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <img
                src={selectedImage.previewUrl}
                alt="Selected preview"
                className="w-10 h-10 object-cover rounded-lg border border-[#C5A059]"
                referrerPolicy="no-referrer"
              />
              <div className="text-xs">
                <span className="font-semibold text-white block">Photo Attached</span>
                <span className="text-[10px] text-slate-400">Ready to analyze question or diagram</span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Remove photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Listening Voice Indicator */}
        {isListening && (
          <div className="px-4 py-2 bg-rose-950/40 border-t border-rose-800 text-rose-300 flex items-center justify-between animate-pulse text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="font-bold">Listening to your voice... (እየሰማሁ ነው)</span>
            </div>
            <button
              onClick={toggleListening}
              className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] uppercase"
            >
              Stop
            </button>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#161618] border-t border-[#2D2D30] overflow-x-auto flex gap-2 shrink-0 scrollbar-thin">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSubject(qp.subject);
                handleSendMessage(qp.prompt);
              }}
              className="px-3 py-1.5 rounded-full bg-[#1A1A1C] hover:bg-[#2D2D30] border border-[#2D2D30] hover:border-[#C5A059] text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors flex items-center gap-1.5"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Photo and Microphone */}
        <div className="p-3 sm:p-4 bg-[#0E0E10] border-t border-[#2D2D30]">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Photo Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 sm:p-3 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] hover:border-[#C5A059] text-slate-300 hover:text-[#C5A059] transition-colors shrink-0 flex items-center gap-1"
              title="Upload photo of question, diagram, or homework"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden md:inline text-[11px] font-semibold">Photo</span>
            </button>

            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 sm:p-3 rounded-xl border transition-colors shrink-0 flex items-center gap-1 ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-500 animate-bounce'
                  : 'bg-[#1A1A1C] border-[#2D2D30] hover:border-[#C5A059] text-slate-300 hover:text-[#C5A059]'
              }`}
              title={isListening ? 'Stop voice recording' : 'Speak question with microphone'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="hidden md:inline text-[11px] font-semibold">Mic</span>
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask any question about Grade 9–12 ${subject}, or upload photo/speak...`}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-2xl bg-[#1A1A1C] border border-[#2D2D30] text-white text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] placeholder:text-slate-500"
            />

            <button
              type="submit"
              disabled={(!inputQuery.trim() && !selectedImage) || isLoading}
              className="p-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#C5A059] hover:bg-[#d8b168] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg shadow-[#C5A059]/20 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
