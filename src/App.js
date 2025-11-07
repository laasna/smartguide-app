import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const SmartGuide = () => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [sessionData, setSessionData] = useState({
    language: null,
    gadgetType: null,
    usage: null,
    priority: null,
    experience: null,
    requirements: null,
    budget: null,
    brand: null,
    finalFeatures: null,
    step: 'greeting'
  });
  const [isTyping, setIsTyping] = useState(false);
  // const [inactivityTimer, setInactivityTimer] = useState(null); // Removed unused variable
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);

  const translations = {
    english: {
      greeting: "👋 Hey there! I'm SmartGuide, your AI shopping buddy! \n\nWhat can I help you find today? 😊\n\n**Language:** English | Hindi | Telugu | Spanish | German | French | Marathi",
      gadgetQuestion: "What kind of gadget are you planning to buy today? (phones, laptops, desktops, tablets, smartwatches, headphones, etc.)",
      usageQuestion: "Where will you mostly use it — work, study, gaming, travel, or entertainment?",
      priorityQuestion: "What's most important to you? Performance, battery life, camera quality, display, portability, or price?",
      experienceQuestion: "Are you a beginner, intermediate, or advanced user with technology?",
      requirementsQuestion: "Do you have specific requirements like RAM, storage, camera specs, or should I suggest the ideal configuration?",
      budgetQuestion: "Do you have a specific budget in mind, or should I recommend the best value option regardless of price?",
      lifestyleQuestion: "What's your lifestyle like? Are you always on-the-go, prefer premium experiences, love trying new tech, or focus on practical reliability?",
      finalQuestion: "Any specific features you absolutely need? (e.g., wireless charging, fingerprint scanner, specific ports, etc.)",
      analyzing: "Perfect! Let me analyze all your preferences and find the ideal gadget for you...",
      followUp: "How does this recommendation look? If you'd like something different, just tell me what you're looking for (different price range, brand, features, etc.) or say 'thank you' if you're satisfied!",
      helpMore: "I'm here to help! Tell me what you'd like to change about the recommendation, or ask for a completely different gadget type.",
      timeoutWarning: "Are you still there? I'll end our chat in 1 minute if there's no response.",
      timeoutMessage: "Thanks for using SmartGuide! Our chat has ended due to inactivity. Click 'Start New Chat' anytime for new recommendations.",
    },
    hindi: {
      greeting: "👋 नमस्ते! मैं SmartGuide हूं — आपका AI गैजेट एक्सपर्ट। आप टाइप कर सकते हैं या 🎤 वॉइस बटन का उपयोग कर सकते हैं! आप कौन सी भाषा का उपयोग करना चाहेंगे? (English, Hindi, Telugu, Spanish, German, French, Marathi)",
      gadgetQuestion: "आज आप किस प्रकार का गैजेट खरीदने की योजना बना रहे हैं? (फोन, लैपटॉप, डेस्कटॉप, टैबलेट, स्मार्टवॉच, हेडफोन, आदि)",
      usageQuestion: "आप इसका उपयोग मुख्यतः कहाँ करेंगे — काम, पढ़ाई, गेमिंग, यात्रा, या मनोरंजन?",
      priorityQuestion: "आपके लिए सबसे महत्वपूर्ण क्या है? प्रदर्शन, बैटरी लाइफ, कैमरा गुणवत्ता, डिस्प्ले, पोर्टेबिलिटी, या कीमत?",
      experienceQuestion: "क्या आप तकनीक के साथ शुरुआती, मध्यम, या उन्नत उपयोगकर्ता हैं?",
      requirementsQuestion: "क्या आपकी कोई विशिष्ट आवश्यकताएं हैं जैसे RAM, स्टोरेज, कैमरा स्पेक्स, या मुझे आदर्श कॉन्फ़िगरेशन सुझाना चाहिए?",
      budgetQuestion: "क्या आपका कोई विशिष्ट बजट है, या मुझे कीमत की परवाह किए बिना सबसे अच्छा विकल्प सुझाना चाहिए?",
      brandQuestion: "क्या आपका कोई पसंदीदा ब्रांड है, या आप किसी भी ब्रांड के लिए खुले हैं जो सबसे अच्छा मूल्य प्रदान करता है?",
      finalQuestion: "कोई विशिष्ट सुविधाएं जिनकी आपको बिल्कुल आवश्यकता है? (जैसे वायरलेस चार्जिंग, फिंगरप्रिंट स्कैनर, विशिष्ट पोर्ट, आदि)",
      analyzing: "बेहतरीन! मुझे आपकी सभी प्राथमिकताओं का विश्लेषण करने और आपके लिए आदर्श गैजेट खोजने दें...",
      followUp: "यह सिफारिश कैसी लग रही है? यदि आप कुछ अलग चाहते हैं, तो बस मुझे बताएं कि आप क्या खोज रहे हैं या यदि आप संतुष्ट हैं तो 'धन्यवाद' कहें!",
      helpMore: "मैं मदद के लिए यहाँ हूँ! मुझे बताएं कि आप सिफारिश के बारे में क्या बदलना चाहते हैं।",
      timeoutWarning: "क्या आप अभी भी यहाँ हैं? यदि कोई प्रतिक्रिया नहीं मिली तो मैं 1 मिनट में हमारी चैट समाप्त कर दूंगा।",
      timeoutMessage: "SmartGuide का उपयोग करने के लिए धन्यवाद! निष्क्रियता के कारण हमारी चैट समाप्त हो गई है।",
    },
    telugu: {
      greeting: "👋 హలో! నేను SmartGuide — మీ AI గాడ్జెట్ ఎక్స్‌పర్ట్. మీరు టైప్ చేయవచ్చు లేదా 🎤 వాయిస్ బటన్ ఉపయోగించవచ్చు! మీరు ఏ భాషను ఉపయోగించాలని అనుకుంటున్నారు? (English, Hindi, Telugu, Spanish, German, French, Marathi)",
      gadgetQuestion: "ఈరోజు మీరు ఎలాంటి గాడ్జెట్ కొనుగోలు చేయాలని అనుకుంటున్నారు? (ఫోన్లు, లాప్‌టాప్‌లు, డెస్క్‌టాప్‌లు, టాబ్లెట్‌లు, స్మార్ట్‌వాచ్‌లు, హెడ్‌ఫోన్‌లు, మొదలైనవి)",
      usageQuestion: "మీరు దీన్ని ఎక్కువగా ఎక్కడ ఉపయోగిస్తారు — పని, చదువు, గేమింగ్, ప్రయాణం, లేదా వినోదం?",
      priorityQuestion: "మీకు అత్యంత ముఖ్యమైనది ఏమిటి? పనితీరు, బ్యాటరీ జీవితం, కెమెరా నాణ్యత, డిస్‌ప్లే, పోర్టబిలిటీ, లేదా ధర?",
      experienceQuestion: "మీరు టెక్నాలజీతో ప్రారంభ, మధ్యస్థ, లేదా అధునాతన వినియోగదారులా?",
      requirementsQuestion: "మీకు RAM, స్టోరేజ్, కెమెరా స్పెక్స్ వంటి నిర్దిష్ట అవసరాలు ఉన్నాయా, లేదా నేను ఆదర్శ కాన్ఫిగరేషన్ సూచించాలా?",
      budgetQuestion: "మీకు నిర్దిష్ట బడ్జెట్ ఉందా, లేదా ధరతో సంబంధం లేకుండా నేను ఉత్తమ విలువ ఎంపికను సిఫార్సు చేయాలా?",
      brandQuestion: "మీకు ఇష్టమైన బ్రాండ్ ఉందా, లేదా ఉత్తమ విలువను అందించే ఏ బ్రాండ్‌కైనా మీరు సిద్ధంగా ఉన్నారా?",
      finalQuestion: "మీకు ఖచ్చితంగా అవసరమైన నిర్దిష్ట లక్షణాలు ఏవైనా ఉన్నాయా? (ఉదా. వైర్‌లెస్ చార్జింగ్, ఫింగర్‌ప్రింట్ స్కానర్, నిర్దిష్ట పోర్ట్‌లు, మొదలైనవి)",
      analyzing: "అద్భుతం! మీ అన్ని ప్రాధాన్యతలను విశ్లేషించి మీకు అనువైన గాడ్జెట్‌ను కనుగొననివ్వండి...",
      followUp: "ఈ సిఫార్సు ఎలా అనిపిస్తుంది? మీకు వేరేది కావాలంటే, మీరు ఏమి వెతుకుతున్నారో చెప్పండి లేదా మీరు సంతృప్తిగా ఉంటే 'ధన్యవాదాలు' అని చెప్పండి!",
      helpMore: "నేను సహాయం చేయడానికి ఇక్కడ ఉన్నాను! సిఫార్సు గురించి మీరు ఏమి మార్చాలనుకుంటున్నారో చెప్పండి।",
      timeoutWarning: "మీరు ఇంకా ఇక్కడ ఉన్నారా? ప్రతిస్పందన లేకపోతే నేను 1 నిమిషంలో మా చాట్‌ను ముగిస్తాను।",
      timeoutMessage: "SmartGuide ఉపయోగించినందుకు ధన్యవాదాలు! నిష్క్రియత కారణంగా మా చాట్ ముగిసింది।",
    },
    spanish: {
      greeting: "👋 ¡Hola! Soy SmartGuide — tu experto en gadgets con IA. ¡Puedes escribir o usar el botón de voz 🎤 para hablar conmigo! ¿Qué idioma te gustaría que use? (English, Hindi, Telugu, Spanish, German, French, Marathi)",
      gadgetQuestion: "¿Qué tipo de gadget planeas comprar hoy? (teléfonos, laptops, computadoras de escritorio, tablets, smartwatches, auriculares, etc.)",
      usageQuestion: "¿Dónde lo usarás principalmente — trabajo, estudio, gaming, viajes, o entretenimiento?",
      priorityQuestion: "¿Qué es más importante para ti? Rendimiento, duración de batería, calidad de cámara, pantalla, portabilidad, o precio?",
      experienceQuestion: "¿Eres un usuario principiante, intermedio, o avanzado con la tecnología?",
      requirementsQuestion: "¿Tienes requisitos específicos como RAM, almacenamiento, especificaciones de cámara, o debo sugerir la configuración ideal?",
      budgetQuestion: "¿Tienes un presupuesto específico en mente, o debo recomendar la mejor opción de valor sin importar el precio?",
      brandQuestion: "¿Tienes una marca preferida, o estás abierto a cualquier marca que ofrezca el mejor valor?",
      finalQuestion: "¿Alguna característica específica que necesites absolutamente? (ej. carga inalámbrica, escáner de huellas, puertos específicos, etc.)",
      analyzing: "¡Perfecto! Déjame analizar todas tus preferencias y encontrar el gadget ideal para ti...",
      followUp: "¿Cómo se ve esta recomendación? Si quieres algo diferente, solo dime qué estás buscando o di 'gracias' si estás satisfecho!",
      helpMore: "¡Estoy aquí para ayudar! Dime qué te gustaría cambiar sobre la recomendación.",
      timeoutWarning: "¿Sigues ahí? Terminaré nuestro chat en 1 minuto si no hay respuesta.",
      timeoutMessage: "¡Gracias por usar SmartGuide! Nuestro chat ha terminado debido a inactividad.",
    },
    german: {
      greeting: "👋 Hallo! Ich bin SmartGuide — Ihr KI-Gadget-Experte. Sie können tippen oder die 🎤 Sprachtaste verwenden! Welche Sprache möchten Sie verwenden? (English, Hindi, Telugu, Spanish, German, French, Marathi)",
      gadgetQuestion: "Welche Art von Gadget planen Sie heute zu kaufen? (Telefone, Laptops, Desktops, Tablets, Smartwatches, Kopfhörer, usw.)",
      usageQuestion: "Wo werden Sie es hauptsächlich verwenden — Arbeit, Studium, Gaming, Reisen oder Unterhaltung?",
      priorityQuestion: "Was ist für Sie am wichtigsten? Leistung, Akkulaufzeit, Kameraqualität, Display, Portabilität oder Preis?",
      experienceQuestion: "Sind Sie ein Anfänger, Fortgeschrittener oder Experte im Umgang mit Technologie?",
      requirementsQuestion: "Haben Sie spezifische Anforderungen wie RAM, Speicher, Kamera-Spezifikationen, oder soll ich die ideale Konfiguration vorschlagen?",
      budgetQuestion: "Haben Sie ein bestimmtes Budget im Kopf, oder soll ich die beste Werteoption unabhängig vom Preis empfehlen?",
      brandQuestion: "Haben Sie eine bevorzugte Marke, oder sind Sie offen für jede Marke, die den besten Wert bietet?",
      finalQuestion: "Gibt es spezifische Funktionen, die Sie unbedingt benötigen? (z.B. kabelloses Laden, Fingerabdruckscanner, spezifische Anschlüsse, usw.)",
      analyzing: "Perfekt! Lassen Sie mich alle Ihre Präferenzen analysieren und das ideale Gadget für Sie finden...",
      followUp: "Wie sieht diese Empfehlung aus? Wenn Sie etwas anderes möchten, sagen Sie mir einfach, wonach Sie suchen!",
      helpMore: "Ich bin hier, um zu helfen! Sagen Sie mir, was Sie an der Empfehlung ändern möchten.",
      timeoutWarning: "Sind Sie noch da? Ich beende unser Gespräch in 1 Minute, wenn keine Antwort kommt.",
      timeoutMessage: "Danke, dass Sie SmartGuide verwendet haben! Unser Chat wurde aufgrund von Inaktivität beendet.",
    },
    french: {
      greeting: "👋 Salut ! Je suis SmartGuide — votre expert en gadgets IA. Vous pouvez taper ou utiliser le bouton vocal 🎤 ! Quelle langue aimeriez-vous que j'utilise ? (English, Hindi, Telugu, Spanish, German, French, Marathi)",
      gadgetQuestion: "Quel type de gadget prévoyez-vous d'acheter aujourd'hui ? (téléphones, ordinateurs portables, ordinateurs de bureau, tablettes, montres connectées, écouteurs, etc.)",
      usageQuestion: "Où l'utiliserez-vous principalement — travail, études, gaming, voyage, ou divertissement ?",
      priorityQuestion: "Qu'est-ce qui est le plus important pour vous ? Performance, autonomie de batterie, qualité de caméra, écran, portabilité, ou prix ?",
      experienceQuestion: "Êtes-vous un utilisateur débutant, intermédiaire, ou avancé avec la technologie ?",
      requirementsQuestion: "Avez-vous des exigences spécifiques comme la RAM, le stockage, les spécifications de caméra, ou dois-je suggérer la configuration idéale ?",
      budgetQuestion: "Avez-vous un budget spécifique en tête, ou dois-je recommander la meilleure option de valeur quel que soit le prix ?",
      brandQuestion: "Avez-vous une marque préférée, ou êtes-vous ouvert à toute marque qui offre la meilleure valeur ?",
      finalQuestion: "Des fonctionnalités spécifiques dont vous avez absolument besoin ? (ex. charge sans fil, scanner d'empreintes, ports spécifiques, etc.)",
      analyzing: "Parfait ! Laissez-moi analyser toutes vos préférences et trouver le gadget idéal pour vous...",
      followUp: "Comment cette recommandation vous semble-t-elle ? Si vous voulez quelque chose de différent, dites-moi ce que vous cherchez !",
      helpMore: "Je suis là pour aider ! Dites-moi ce que vous aimeriez changer dans la recommandation.",
      timeoutWarning: "Êtes-vous toujours là ? Je vais terminer notre chat dans 1 minute s'il n'y a pas de réponse.",
      timeoutMessage: "Merci d'avoir utilisé SmartGuide ! Notre chat s'est terminé en raison d'inactivité.",
    },
    marathi: {
      greeting: "👋 नमस्कार! मी SmartGuide आहे — तुमचा AI गॅजेट तज्ञ. तुम्ही टाइप करू शकता किंवा 🎤 व्हॉइस बटन वापरू शकता! तुम्हाला कोणती भाषा वापरायची आहे? (English, Hindi, Telugu, Spanish, German, French, Marathi)",
      gadgetQuestion: "आज तुम्ही कोणत्या प्रकारचे गॅजेट खरेदी करण्याची योजना आहे? (फोन, लॅपटॉप, डेस्कटॉप, टॅब्लेट, स्मार्टवॉच, हेडफोन, इ.)",
      usageQuestion: "तुम्ही ते मुख्यतः कुठे वापराल — काम, अभ्यास, गेमिंग, प्रवास, किंवा मनोरंजन?",
      priorityQuestion: "तुमच्यासाठी सर्वात महत्वाचे काय आहे? कामगिरी, बॅटरी आयुष्य, कॅमेरा गुणवत्ता, डिस्प्ले, पोर्टेबिलिटी, किंवा किंमत?",
      experienceQuestion: "तुम्ही तंत्रज्ञानासह नवशिक्या, मध्यम, किंवा प्रगत वापरकर्ता आहात?",
      requirementsQuestion: "तुमच्याकडे RAM, स्टोरेज, कॅमेरा स्पेक्स सारख्या विशिष्ट आवश्यका आहेत, किंवा मी आदर्श कॉन्फिगरेशन सुचवू?",
      budgetQuestion: "तुमच्या मनात विशिष्ट बजेट आहे, किंवा मी किंमतीची पर्वा न करता सर्वोत्तम मूल्य पर्याय सुचवू?",
      brandQuestion: "तुमचा आवडता ब्रँड आहे, किंवा सर्वोत्तम मूल्य देणाऱ्या कोणत्याही ब्रँडसाठी तुम्ही तयार आहात?",
      finalQuestion: "तुम्हाला नक्कीच हवी असलेली काही विशिष्ट वैशिष्ट्ये? (उदा. वायरलेस चार्जिंग, फिंगरप्रिंट स्कॅनर, विशिष्ट पोर्ट, इ.)",
      analyzing: "उत्तम! मला तुमच्या सर्व प्राधान्यांचे विश्लेषण करू द्या आणि तुमच्यासाठी आदर्श गॅजेट शोधू द्या...",
      followUp: "ही शिफारस कशी वाटते? तुम्हाला काहीतरी वेगळे हवे असल्यास, तुम्ही काय शोधत आहात ते सांगा!",
      helpMore: "मी मदतीसाठी येथे आहे! शिफारशीबद्दल तुम्हाला काय बदलायचे आहे ते सांगा.",
      timeoutWarning: "तुम्ही अजूनही तिथे आहात का? प्रतिसाद न मिळाल्यास मी 1 मिनिटात आमची चॅट संपवीन.",
      timeoutMessage: "SmartGuide वापरल्याबद्दल धन्यवाद! निष्क्रियतेमुळे आमची चॅट संपली आहे.",
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const playSound = (type) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    switch (type) {
      case 'success':
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case 'message':
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
        break;
      default:
        break;
    }
  };

  const startVoiceInput = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      // Auto-stop after reasonable time
      let autoStopTimeout;
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        playSound('start');
        
        // Auto-stop after 10 seconds max
        autoStopTimeout = setTimeout(() => {
          recognitionInstance.stop();
        }, 10000);
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        playSound('success');
        
        // Clear auto-stop timeout since we got result
        if (autoStopTimeout) clearTimeout(autoStopTimeout);
        
        // Stop listening after getting result
        recognitionInstance.stop();
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        if (autoStopTimeout) clearTimeout(autoStopTimeout);
      };
      
      recognitionInstance.onerror = (event) => {
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
      };
      
      setRecognition(recognitionInstance);
    }

    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0 && sessionData.step === 'greeting') {
      const timer = setTimeout(() => {
        setMessages([{ type: 'bot', text: translations.english.greeting, timestamp: new Date() }]);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, sessionData.step, translations.english.greeting]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    playSound('message');
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text, timestamp: new Date() }]);
      setIsTyping(false);
      playSound('success');
    }, 1000);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
  };

  // Extract product information from user input dynamically - UNIVERSAL APPROACH
  const extractProductFromInput = (input) => {
    const lowerInput = input.toLowerCase();
    
    // UNIVERSAL DEVICE EXTRACTION - Accept ANY device the user mentions
    let specificProduct = null;
    
    // Clean the input to extract the actual product name
    let cleanedInput = input
      .replace(/\b(i want|show me|need|looking for|recommend|suggest|find|get me|buy|can you|please)\b/gi, '')
      .replace(/\b(a|an|the|some|any)\b/gi, '')
      .replace(/\b(please|thanks|thank you)\b/gi, '')
      .replace(/[?!.]/g, '')
      .trim();

    // PRIORITY 1: If the cleaned input looks like a product name, use it directly (UNIVERSAL APPROACH)
    if (cleanedInput && cleanedInput.length > 2) {
      // Capitalize first letter of each word for proper product name
      specificProduct = cleanedInput
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      console.log('🎯 UNIVERSAL EXTRACTION (PRIORITY):', input, '→', specificProduct);
      
      // Return immediately - don't let fallback logic override this!
      const cleanInput = specificProduct;
      
      // Detect device type
      let deviceType = 'phone';
      if (lowerInput.includes('headphone') || lowerInput.includes('earphone') || lowerInput.includes('earbuds') || lowerInput.includes('headset')) deviceType = 'headphones';
      else if (lowerInput.includes('laptop') || lowerInput.includes('notebook')) deviceType = 'laptop';
      else if (lowerInput.includes('tablet') || lowerInput.includes('ipad')) deviceType = 'tablet';
      else if (lowerInput.includes('desktop') || lowerInput.includes('pc')) deviceType = 'desktop';
      else if (lowerInput.includes('watch') || lowerInput.includes('smartwatch')) deviceType = 'smartwatch';
      else if (lowerInput.includes('phone') || lowerInput.includes('mobile') || lowerInput.includes('smartphone')) deviceType = 'phone';

      // Detect usage context
      let usage = 'general';
      if (lowerInput.includes('gaming') || lowerInput.includes('game')) usage = 'gaming';
      else if (lowerInput.includes('study') || lowerInput.includes('student') || lowerInput.includes('education')) usage = 'study';
      else if (lowerInput.includes('work') || lowerInput.includes('office') || lowerInput.includes('business')) usage = 'work';
      else if (lowerInput.includes('travel') || lowerInput.includes('portable')) usage = 'travel';

      // Detect priority
      let priority = 'performance';
      if (lowerInput.includes('cheap') || lowerInput.includes('budget') || lowerInput.includes('affordable') || lowerInput.includes('under')) priority = 'price';
      else if (lowerInput.includes('camera') || lowerInput.includes('photo') || lowerInput.includes('photography')) priority = 'camera';
      else if (lowerInput.includes('battery') || lowerInput.includes('long lasting')) priority = 'battery';

      return {
        productName: cleanInput,
        type: deviceType,
        usage: usage,
        priority: priority
      };
    }

    // PRIORITY 2: Fallback to specific brand detection only if no clear product name found
    if (!specificProduct || specificProduct.length < 3) {
      // iPhone detection with EXACT model matching
      if (lowerInput.includes('iphone') || lowerInput.includes('apple')) {
        // iPhone 16 series
        if (lowerInput.includes('16 pro max') || lowerInput.includes('16promax')) {
          specificProduct = 'iPhone 16 Pro Max';
        } else if (lowerInput.includes('16 pro') || lowerInput.includes('16pro')) {
          specificProduct = 'iPhone 16 Pro';
        } else if (lowerInput.includes('16 plus') || lowerInput.includes('16plus')) {
          specificProduct = 'iPhone 16 Plus';
        } else if (lowerInput.includes('16') && !lowerInput.includes('pro') && !lowerInput.includes('plus')) {
          specificProduct = 'iPhone 16';
        }
        // iPhone 15 series
        else if (lowerInput.includes('15 pro max') || lowerInput.includes('15promax')) {
          specificProduct = 'iPhone 15 Pro Max';
        } else if (lowerInput.includes('15 pro') || lowerInput.includes('15pro')) {
          specificProduct = 'iPhone 15 Pro';
        } else if (lowerInput.includes('15 plus') || lowerInput.includes('15plus')) {
          specificProduct = 'iPhone 15 Plus';
        } else if (lowerInput.includes('15') && !lowerInput.includes('pro') && !lowerInput.includes('plus')) {
          specificProduct = 'iPhone 15';
        }
        // iPhone 14 series
        else if (lowerInput.includes('14 pro max') || lowerInput.includes('14promax')) {
          specificProduct = 'iPhone 14 Pro Max';
        } else if (lowerInput.includes('14 pro') || lowerInput.includes('14pro')) {
          specificProduct = 'iPhone 14 Pro';
        } else if (lowerInput.includes('14 plus') || lowerInput.includes('14plus')) {
          specificProduct = 'iPhone 14 Plus';
        } else if (lowerInput.includes('14') && !lowerInput.includes('pro') && !lowerInput.includes('plus')) {
          specificProduct = 'iPhone 14';
        }
        // iPhone 13 series
        else if (lowerInput.includes('13 pro max') || lowerInput.includes('13promax')) {
          specificProduct = 'iPhone 13 Pro Max';
        } else if (lowerInput.includes('13 pro') || lowerInput.includes('13pro')) {
          specificProduct = 'iPhone 13 Pro';
        } else if (lowerInput.includes('13 mini') || lowerInput.includes('13mini')) {
          specificProduct = 'iPhone 13 Mini';
        } else if (lowerInput.includes('13') && !lowerInput.includes('pro') && !lowerInput.includes('mini')) {
          specificProduct = 'iPhone 13';
        }
        // iPhone 12 series
        else if (lowerInput.includes('12 pro max') || lowerInput.includes('12promax')) {
          specificProduct = 'iPhone 12 Pro Max';
        } else if (lowerInput.includes('12 pro') || lowerInput.includes('12pro')) {
          specificProduct = 'iPhone 12 Pro';
        } else if (lowerInput.includes('12 mini') || lowerInput.includes('12mini')) {
          specificProduct = 'iPhone 12 Mini';
        } else if (lowerInput.includes('12') && !lowerInput.includes('pro') && !lowerInput.includes('mini')) {
          specificProduct = 'iPhone 12';
        }
        // Generic iPhone requests
        else if (lowerInput.includes('latest') || lowerInput.includes('newest') || lowerInput.includes('new')) {
          specificProduct = 'iPhone 16 Pro';
        } else if (lowerInput.includes('iphone') && !lowerInput.match(/\d/)) {
          specificProduct = 'iPhone 16 Pro';
        }
      }
      // Samsung detection
      else if (lowerInput.includes('samsung') || lowerInput.includes('galaxy')) {
        if (lowerInput.includes('s24 ultra')) {
          specificProduct = 'Samsung Galaxy S24 Ultra';
        } else if (lowerInput.includes('s24 plus')) {
          specificProduct = 'Samsung Galaxy S24 Plus';
        } else if (lowerInput.includes('s24')) {
          specificProduct = 'Samsung Galaxy S24';
        } else if (lowerInput.includes('s23 ultra')) {
          specificProduct = 'Samsung Galaxy S23 Ultra';
        } else if (lowerInput.includes('s23 plus')) {
          specificProduct = 'Samsung Galaxy S23 Plus';
        } else if (lowerInput.includes('s23')) {
          specificProduct = 'Samsung Galaxy S23';
        } else if (lowerInput.includes('note')) {
          specificProduct = 'Samsung Galaxy Note 20 Ultra';
        } else if (lowerInput.includes('fold')) {
          specificProduct = 'Samsung Galaxy Z Fold 5';
        } else if (lowerInput.includes('flip')) {
          specificProduct = 'Samsung Galaxy Z Flip 5';
        } else if (lowerInput.includes('samsung') && !lowerInput.match(/s\d/)) {
          specificProduct = 'Samsung Galaxy S24';
        }
      }
      // Other brands - but accept any model user mentions
      else if (lowerInput.includes('motorola')) {
        specificProduct = cleanedInput || 'Motorola Edge 50 Pro';
      } else if (lowerInput.includes('nothing')) {
        specificProduct = cleanedInput || 'Nothing Phone 2';
      } else if (lowerInput.includes('oneplus')) {
        specificProduct = cleanedInput || 'OnePlus 12';
      } else if (lowerInput.includes('xiaomi')) {
        specificProduct = cleanedInput || 'Xiaomi 14';
      } else if (lowerInput.includes('realme')) {
        specificProduct = cleanedInput || 'Realme GT 6';
      } else if (lowerInput.includes('vivo')) {
        specificProduct = cleanedInput || 'Vivo V30 Pro';
      } else if (lowerInput.includes('oppo')) {
        specificProduct = cleanedInput || 'Oppo Reno 12 Pro';
      } else if (lowerInput.includes('google') || lowerInput.includes('pixel')) {
        specificProduct = cleanedInput || 'Google Pixel 8 Pro';
      } else if (lowerInput.includes('huawei')) {
        specificProduct = cleanedInput || 'Huawei P60 Pro';
      } else if (lowerInput.includes('honor')) {
        specificProduct = cleanedInput || 'Honor Magic 6 Pro';
      } else if (lowerInput.includes('asus')) {
        specificProduct = cleanedInput || 'ASUS ROG Phone 8';
      } else if (lowerInput.includes('sony')) {
        specificProduct = cleanedInput || 'Sony Xperia 1 VI';
      }
    }

    // Final cleanup - use the extracted product name
    const cleanInput = specificProduct || cleanedInput || input;

    // Detect device type (order matters - check specific terms first)
    let deviceType = 'phone'; // default
    if (lowerInput.includes('headphone') || lowerInput.includes('earphone') || lowerInput.includes('earbuds') || lowerInput.includes('headset')) deviceType = 'headphones';
    else if (lowerInput.includes('laptop') || lowerInput.includes('notebook')) deviceType = 'laptop';
    else if (lowerInput.includes('tablet') || lowerInput.includes('ipad')) deviceType = 'tablet';
    else if (lowerInput.includes('desktop') || lowerInput.includes('pc')) deviceType = 'desktop';
    else if (lowerInput.includes('watch') || lowerInput.includes('smartwatch')) deviceType = 'smartwatch';
    else if (lowerInput.includes('phone') || lowerInput.includes('mobile') || lowerInput.includes('smartphone')) deviceType = 'phone';

    // Detect usage context
    let usage = 'general';
    if (lowerInput.includes('gaming') || lowerInput.includes('game')) usage = 'gaming';
    else if (lowerInput.includes('study') || lowerInput.includes('student') || lowerInput.includes('education')) usage = 'study';
    else if (lowerInput.includes('work') || lowerInput.includes('office') || lowerInput.includes('business')) usage = 'work';
    else if (lowerInput.includes('travel') || lowerInput.includes('portable')) usage = 'travel';

    // Detect priority
    let priority = 'performance';
    if (lowerInput.includes('cheap') || lowerInput.includes('budget') || lowerInput.includes('affordable') || lowerInput.includes('under')) priority = 'price';
    else if (lowerInput.includes('camera') || lowerInput.includes('photo') || lowerInput.includes('photography')) priority = 'camera';
    else if (lowerInput.includes('battery') || lowerInput.includes('long lasting')) priority = 'battery';

    return {
      productName: cleanInput,
      type: deviceType,
      usage: usage,
      priority: priority
    };
  };

  // Dynamic product extraction and recommendation
  const handleQuickRequest = (input) => {
    const extractedProduct = extractProductFromInput(input);
    
    const quickData = {
      gadgetType: extractedProduct.type,
      usage: extractedProduct.usage || 'general',
      priority: extractedProduct.priority || 'performance',
      language: sessionData.language || 'english',
      requestedProduct: extractedProduct.productName,
      originalInput: input
    };

    return quickData;
  };

  // Generate dynamic recommendation with detailed specs for ANY product
  const generateDynamicRecommendation = (productName, deviceType, usage, priority) => {
    // Handle null or undefined productName
    if (!productName) {
      productName = 'iPhone 15 Pro'; // Default fallback
    }
    
    // Clean up the product name and extract meaningful parts
    let cleanProductName = productName
      .replace(/\b(phone|mobile|smartphone|laptop|tablet|desktop|pc)\b/gi, '')
      .replace(/\b(for|with|and|or|the|a|an)\b/gi, '')
      .trim();
    
    // Comprehensive product database with detailed specs
    const productDatabase = {
      // iPhone models (including iPhone 16 series)
      'iPhone 16 Pro Max': {
        name: 'iPhone 16 Pro Max',
        description: 'Latest iPhone with A18 Pro chip, advanced camera system, and cutting-edge AI features',
        specs: '📱 6.9" ProMotion OLED | 🧠 A18 Pro chip | 📸 48MP + 12MP + 12MP cameras | 🔋 4650mAh battery | 🤖 Next-gen AI photography',
        price: '₹1,69,900'
      },
      'iPhone 16 Pro': {
        name: 'iPhone 16 Pro',
        description: 'Latest Pro iPhone with A18 Pro chip, enhanced cameras, and advanced AI capabilities',
        specs: '📱 6.3" ProMotion OLED | 🧠 A18 Pro chip | 📸 48MP + 12MP + 12MP cameras | 🔋 3400mAh battery | 🤖 Advanced AI photography',
        price: '₹1,44,900'
      },
      'iPhone 16 Plus': {
        name: 'iPhone 16 Plus',
        description: 'Larger iPhone 16 with bigger display and enhanced battery life',
        specs: '📱 6.7" Super Retina XDR | 🧠 A18 chip | 📸 48MP + 12MP cameras | 🔋 4500mAh battery | 🤖 Smart HDR 6',
        price: '₹99,900'
      },
      'iPhone 16': {
        name: 'iPhone 16',
        description: 'Latest iPhone with A18 chip, improved cameras, and new AI features',
        specs: '📱 6.1" Super Retina XDR | 🧠 A18 chip | 📸 48MP + 12MP cameras | 🔋 3500mAh battery | 🤖 Smart HDR 6',
        price: '₹89,900'
      },
      'iPhone 15 Pro Max': {
        name: 'iPhone 15 Pro Max',
        description: 'Apple\'s flagship with A17 Pro chip, 48MP Pro camera system with 5x telephoto zoom, AI-powered computational photography, ProMotion 120Hz display, and titanium design',
        specs: '📱 6.7" ProMotion OLED | 🧠 A17 Pro chip | 📸 48MP + 12MP + 12MP cameras | 🔋 4441mAh battery | 🤖 Advanced AI photography',
        price: '₹1,59,900'
      },
      'iPhone 15 Pro': {
        name: 'iPhone 15 Pro',
        description: 'Pro iPhone with A17 Pro chip, 48MP camera system, AI-enhanced photography, and premium titanium build',
        specs: '📱 6.1" ProMotion OLED | 🧠 A17 Pro chip | 📸 48MP + 12MP + 12MP cameras | 🔋 3274mAh battery | 🤖 AI computational photography',
        price: '₹1,34,900'
      },
      'iPhone 15': {
        name: 'iPhone 15',
        description: 'Latest iPhone with Dynamic Island, 48MP camera, and USB-C connectivity',
        specs: '📱 6.1" Super Retina XDR | 🧠 A16 Bionic chip | 📸 48MP + 12MP cameras | 🔋 3349mAh battery | 🤖 Smart HDR 5',
        price: '₹79,900'
      },
      'iPhone 14 Pro': {
        name: 'iPhone 14 Pro',
        description: 'Previous generation Pro iPhone with A16 Bionic chip, 48MP camera system, and ProMotion display',
        specs: '📱 6.1" ProMotion OLED | 🧠 A16 Bionic chip | 📸 48MP + 12MP + 12MP cameras | 🔋 3200mAh battery | 🤖 Photographic Styles',
        price: '₹1,19,900'
      },
      'iPhone 15 Plus': {
        name: 'iPhone 15 Plus',
        description: 'Larger iPhone 15 with bigger display and longer battery life',
        specs: '📱 6.7" Super Retina XDR | 🧠 A16 Bionic chip | 📸 48MP + 12MP cameras | 🔋 4383mAh battery | 🤖 Smart HDR 5',
        price: '₹89,900'
      },
      'iPhone 14 Pro Max': {
        name: 'iPhone 14 Pro Max',
        description: 'Largest iPhone 14 Pro with massive display and exceptional battery life',
        specs: '📱 6.7" ProMotion OLED | 🧠 A16 Bionic chip | 📸 48MP + 12MP + 12MP cameras | 🔋 4323mAh battery | 🤖 Photographic Styles',
        price: '₹1,39,900'
      },
      'iPhone 14 Plus': {
        name: 'iPhone 14 Plus',
        description: 'Larger iPhone 14 with bigger screen and better battery life',
        specs: '📱 6.7" Super Retina XDR | 🧠 A15 Bionic chip | 📸 12MP + 12MP cameras | 🔋 4325mAh battery | 🤖 Computational photography',
        price: '₹79,900'
      },
      'iPhone 14': {
        name: 'iPhone 14',
        description: 'Reliable iPhone with A15 Bionic chip and excellent camera performance',
        specs: '📱 6.1" Super Retina XDR | 🧠 A15 Bionic chip | 📸 12MP + 12MP cameras | 🔋 3279mAh battery | 🤖 Computational photography',
        price: '₹69,900'
      },
      'iPhone 13 Pro Max': {
        name: 'iPhone 13 Pro Max',
        description: 'Previous generation Pro Max with excellent value and performance',
        specs: '📱 6.7" ProMotion OLED | 🧠 A15 Bionic chip | 📸 12MP + 12MP + 12MP cameras | 🔋 4352mAh battery | 🤖 Photographic Styles',
        price: '₹1,09,900'
      },
      'iPhone 13 Pro': {
        name: 'iPhone 13 Pro',
        description: 'Previous generation Pro iPhone with great cameras and performance',
        specs: '📱 6.1" ProMotion OLED | 🧠 A15 Bionic chip | 📸 12MP + 12MP + 12MP cameras | 🔋 3095mAh battery | 🤖 Photographic Styles',
        price: '₹99,900'
      },
      'iPhone 13': {
        name: 'iPhone 13',
        description: 'Excellent value iPhone with solid performance and cameras',
        specs: '📱 6.1" Super Retina XDR | 🧠 A15 Bionic chip | 📸 12MP + 12MP cameras | 🔋 3240mAh battery | 🤖 Computational photography',
        price: '₹59,900'
      },
      'iPhone 13 Mini': {
        name: 'iPhone 13 Mini',
        description: 'Compact iPhone with full flagship features in smaller size',
        specs: '📱 5.4" Super Retina XDR | 🧠 A15 Bionic chip | 📸 12MP + 12MP cameras | 🔋 2438mAh battery | 🤖 Computational photography',
        price: '₹54,900'
      },
      'iPhone 12 Pro Max': {
        name: 'iPhone 12 Pro Max',
        description: 'Large iPhone 12 Pro with excellent cameras and 5G connectivity',
        specs: '📱 6.7" Super Retina XDR | 🧠 A14 Bionic chip | 📸 12MP + 12MP + 12MP cameras | 🔋 3687mAh battery | 🤖 Night mode',
        price: '₹89,900'
      },
      'iPhone 12 Pro': {
        name: 'iPhone 12 Pro',
        description: 'iPhone 12 Pro with LiDAR scanner and pro cameras',
        specs: '📱 6.1" Super Retina XDR | 🧠 A14 Bionic chip | 📸 12MP + 12MP + 12MP cameras | 🔋 2815mAh battery | 🤖 Night mode',
        price: '₹79,900'
      },
      'iPhone 12': {
        name: 'iPhone 12',
        description: 'iPhone 12 with 5G connectivity and great performance',
        specs: '📱 6.1" Super Retina XDR | 🧠 A14 Bionic chip | 📸 12MP + 12MP cameras | 🔋 2815mAh battery | 🤖 Night mode',
        price: '₹49,900'
      },
      'iPhone 12 Mini': {
        name: 'iPhone 12 Mini',
        description: 'Compact iPhone 12 with 5G in a smaller form factor',
        specs: '📱 5.4" Super Retina XDR | 🧠 A14 Bionic chip | 📸 12MP + 12MP cameras | 🔋 2227mAh battery | 🤖 Night mode',
        price: '₹44,900'
      },
      
      // Samsung models
      'Samsung Galaxy S24 Ultra': {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Samsung\'s AI-powered flagship with 200MP camera, S Pen, and advanced Galaxy AI features',
        specs: '📱 6.8" Dynamic AMOLED 2X | 🧠 Snapdragon 8 Gen 3 | 📸 200MP + 50MP + 12MP + 10MP cameras | 🔋 5000mAh battery | 🤖 Galaxy AI with real-time translation',
        price: '₹1,29,999'
      },
      'Samsung Galaxy S24 Plus': {
        name: 'Samsung Galaxy S24 Plus',
        description: 'Larger Galaxy S24 with bigger display and enhanced battery life',
        specs: '📱 6.7" Dynamic AMOLED 2X | 🧠 Exynos 2400 | 📸 50MP + 12MP + 10MP cameras | 🔋 4900mAh battery | 🤖 Galaxy AI photo editing',
        price: '₹99,999'
      },
      'Samsung Galaxy S24': {
        name: 'Samsung Galaxy S24',
        description: 'Latest Galaxy with AI photography, enhanced performance, and smart features',
        specs: '📱 6.2" Dynamic AMOLED 2X | 🧠 Exynos 2400 | 📸 50MP + 12MP + 10MP cameras | 🔋 4000mAh battery | 🤖 Galaxy AI photo editing',
        price: '₹79,999'
      },
      'Samsung Galaxy S23 Ultra': {
        name: 'Samsung Galaxy S23 Ultra',
        description: 'Previous generation Ultra with S Pen and excellent cameras',
        specs: '📱 6.8" Dynamic AMOLED 2X | 🧠 Snapdragon 8 Gen 2 | 📸 200MP + 12MP + 10MP + 10MP cameras | 🔋 5000mAh battery | 🤖 Advanced AI photography',
        price: '₹1,09,999'
      },
      'Samsung Galaxy S23 Plus': {
        name: 'Samsung Galaxy S23 Plus',
        description: 'Larger Galaxy S23 with premium features and great performance',
        specs: '📱 6.6" Dynamic AMOLED 2X | 🧠 Snapdragon 8 Gen 2 | 📸 50MP + 12MP + 12MP cameras | 🔋 4700mAh battery | 🤖 AI scene optimization',
        price: '₹89,999'
      },
      'Samsung Galaxy S23': {
        name: 'Samsung Galaxy S23',
        description: 'Compact flagship with excellent performance and cameras',
        specs: '📱 6.1" Dynamic AMOLED 2X | 🧠 Snapdragon 8 Gen 2 | 📸 50MP + 12MP + 12MP cameras | 🔋 3900mAh battery | 🤖 AI scene optimization',
        price: '₹69,999'
      },
      'Samsung Galaxy Z Fold 5': {
        name: 'Samsung Galaxy Z Fold 5',
        description: 'Foldable flagship with tablet-sized inner display',
        specs: '📱 7.6" Foldable AMOLED | 🧠 Snapdragon 8 Gen 2 | 📸 50MP + 12MP + 10MP cameras | 🔋 4400mAh battery | 🤖 Flex mode AI',
        price: '₹1,54,999'
      },
      'Samsung Galaxy Z Flip 5': {
        name: 'Samsung Galaxy Z Flip 5',
        description: 'Compact foldable with larger cover screen',
        specs: '📱 6.7" Foldable AMOLED | 🧠 Snapdragon 8 Gen 2 | 📸 12MP + 12MP cameras | 🔋 3700mAh battery | 🤖 FlexCam AI',
        price: '₹99,999'
      },
      
      // OnePlus models
      'OnePlus 12': {
        name: 'OnePlus 12',
        description: 'Flagship OnePlus with Hasselblad cameras and ultra-fast charging',
        specs: '📱 6.82" LTPO AMOLED | 🧠 Snapdragon 8 Gen 3 | 📸 50MP + 64MP + 48MP Hasselblad cameras | 🔋 5400mAh battery | 🤖 AI scene recognition',
        price: '₹64,999'
      },
      
      // Google Pixel models
      'Google Pixel 8 Pro': {
        name: 'Google Pixel 8 Pro',
        description: 'Google\'s AI photography flagship with Magic Eraser and computational photography',
        specs: '📱 6.7" LTPO OLED | 🧠 Google Tensor G3 | 📸 50MP + 48MP + 48MP cameras | 🔋 5050mAh battery | 🤖 Advanced AI photography & Magic Eraser',
        price: '₹1,06,999'
      },
      
      // Motorola models
      'Motorola Edge 50 Pro': {
        name: 'Motorola Edge 50 Pro',
        description: 'Premium Motorola with flagship performance and clean Android experience',
        specs: '📱 6.7" pOLED Curved Display | 🧠 Snapdragon 7 Gen 3 | 📸 50MP + 13MP + 10MP cameras | 🔋 4500mAh battery | 🤖 Moto AI features',
        price: '₹35,999'
      },
      'Motorola G84 5G': {
        name: 'Motorola G84 5G',
        description: 'Mid-range Motorola with excellent value and clean Android',
        specs: '📱 6.5" pOLED Display | 🧠 Snapdragon 695 | 📸 50MP + 8MP cameras | 🔋 5000mAh battery | 🤖 Smart camera AI',
        price: '₹18,999'
      },
      
      // Nothing models
      'Nothing Phone 2': {
        name: 'Nothing Phone 2',
        description: 'Unique transparent design with Glyph interface and flagship performance',
        specs: '📱 6.7" LTPO OLED | 🧠 Snapdragon 8+ Gen 1 | 📸 50MP + 50MP cameras | 🔋 4700mAh battery | 🤖 Nothing OS with AI optimization',
        price: '₹44,999'
      },
      
      // Nokia models
      'Nokia G42 5G': {
        name: 'Nokia G42 5G',
        description: 'Reliable Nokia smartphone with pure Android and solid build quality',
        specs: '📱 6.56" HD+ Display | 🧠 Snapdragon 480+ | 📸 50MP + 2MP + 2MP cameras | 🔋 5000mAh battery | 🤖 AI-enhanced photography',
        price: '₹12,999'
      },
      'Nokia X30 5G': {
        name: 'Nokia X30 5G',
        description: 'Premium Nokia with flagship features and sustainable design',
        specs: '📱 6.43" AMOLED Display | 🧠 Snapdragon 695 | 📸 50MP + 13MP cameras | 🔋 4200mAh battery | 🤖 AI camera optimization',
        price: '₹36,999'
      },
      
      // Xiaomi models
      'Xiaomi 14': {
        name: 'Xiaomi 14',
        description: 'Xiaomi flagship with Leica cameras and powerful performance',
        specs: '📱 6.36" LTPO AMOLED | 🧠 Snapdragon 8 Gen 3 | 📸 50MP + 50MP + 50MP Leica cameras | 🔋 4610mAh battery | 🤖 AI photography suite',
        price: '₹54,999'
      },
      'Redmi Note 13 Pro': {
        name: 'Redmi Note 13 Pro',
        description: 'Excellent mid-range phone with great cameras and performance',
        specs: '📱 6.67" AMOLED Display | 🧠 Snapdragon 7s Gen 2 | 📸 200MP + 8MP + 2MP cameras | 🔋 5100mAh battery | 🤖 AI scene detection',
        price: '₹24,999'
      },
      
      // Realme models
      'Realme GT 6': {
        name: 'Realme GT 6',
        description: 'Performance-focused Realme with flagship features at great price',
        specs: '📱 6.74" LTPO AMOLED | 🧠 Snapdragon 8s Gen 3 | 📸 50MP + 8MP cameras | 🔋 5500mAh battery | 🤖 AI photography modes',
        price: '₹40,999'
      },
      
      // Vivo models
      'Vivo V30 Pro': {
        name: 'Vivo V30 Pro',
        description: 'Camera-focused Vivo with excellent selfie capabilities and AI features',
        specs: '📱 6.78" Curved AMOLED | 🧠 Dimensity 8200 | 📸 50MP + 50MP + 50MP cameras | 🔋 5000mAh battery | 🤖 AI portrait photography',
        price: '₹41,999'
      },
      
      // Oppo models
      'Oppo Reno 12 Pro': {
        name: 'Oppo Reno 12 Pro',
        description: 'Stylish Oppo with great cameras and AI-enhanced features',
        specs: '📱 6.7" Curved AMOLED | 🧠 Dimensity 7300 | 📸 50MP + 8MP + 2MP cameras | 🔋 5000mAh battery | 🤖 AI eraser and enhancement',
        price: '₹36,999'
      },
      
      // Laptops
      'MacBook Air M2': {
        name: 'MacBook Air M2',
        description: 'Ultra-thin laptop with Apple M2 chip and all-day battery life',
        specs: '💻 13.6" Liquid Retina | 🧠 Apple M2 chip | 💾 8GB RAM + 256GB SSD | 🔋 18-hour battery | 🤖 Neural Engine for AI tasks',
        price: '₹1,14,900'
      },
      'HP Pavilion 15': {
        name: 'HP Pavilion 15',
        description: 'Versatile laptop for everyday computing with good performance',
        specs: '💻 15.6" FHD IPS | 🧠 Intel Core i5 | 💾 8GB RAM + 512GB SSD | 🔋 8-hour battery | 🤖 Intel AI acceleration',
        price: '₹54,999'
      },
      
      // Headphones
      'Sony WH-1000XM5': {
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-canceling headphones with exceptional sound quality',
        specs: '🎧 Over-ear design | 🔇 Industry-leading noise cancellation | 🔋 30-hour battery | 🎵 Hi-Res Audio | 🤖 AI-powered sound optimization',
        price: '₹29,990'
      },
      'Apple AirPods Pro': {
        name: 'Apple AirPods Pro',
        description: 'Premium wireless earbuds with active noise cancellation',
        specs: '🎧 In-ear design | 🔇 Active noise cancellation | 🔋 6-hour battery | 🎵 Spatial Audio | 🤖 Adaptive EQ',
        price: '₹24,900'
      },
      'Bose QuietComfort 45': {
        name: 'Bose QuietComfort 45',
        description: 'Comfortable noise-canceling headphones for all-day listening',
        specs: '🎧 Over-ear design | 🔇 World-class noise cancellation | 🔋 24-hour battery | 🎵 Balanced sound | 🤖 Smart EQ',
        price: '₹32,900'
      },
      
      // Smartwatches
      'Apple Watch Series 10': {
        name: 'Apple Watch Series 10',
        description: 'Latest Apple Watch with advanced health monitoring and fitness tracking',
        specs: '⌚ 45mm Retina Display | 🏃 Advanced fitness tracking | ❤️ ECG & Blood Oxygen | 🔋 18-hour battery | 🤖 Siri & AI features',
        price: '₹46,900'
      },
      'Apple Watch Ultra 2': {
        name: 'Apple Watch Ultra 2',
        description: 'Rugged Apple Watch for extreme sports and adventures',
        specs: '⌚ 49mm Titanium case | 🏔️ Adventure-ready | 🏃 Precision GPS | 🔋 36-hour battery | 🤖 Advanced workout metrics',
        price: '₹89,900'
      },
      'Samsung Galaxy Watch 6': {
        name: 'Samsung Galaxy Watch 6',
        description: 'Premium Samsung smartwatch with comprehensive health tracking',
        specs: '⌚ 44mm Super AMOLED | 🏃 Advanced fitness tracking | ❤️ Health monitoring | 🔋 40-hour battery | 🤖 Galaxy AI integration',
        price: '₹32,999'
      },
      'Garmin Forerunner 965': {
        name: 'Garmin Forerunner 965',
        description: 'Professional running watch with advanced training metrics',
        specs: '⌚ AMOLED Display | 🏃 Advanced running dynamics | 📍 Multi-band GPS | 🔋 23-day battery | 🤖 Training AI coach',
        price: '₹64,990'
      },
      
      // Best phones by category (review-based recommendations)
      'best_overall_phone': {
        name: 'iPhone 15 Pro',
        description: 'Best overall smartphone with excellent cameras, performance, and build quality',
        specs: '📱 6.1" ProMotion OLED | 🧠 A17 Pro chip | 📸 48MP + 12MP + 12MP cameras | 🔋 3274mAh battery | 🤖 AI computational photography',
        price: '₹1,34,900'
      },
      'best_value_phone': {
        name: 'OnePlus 12R',
        description: 'Best value flagship with excellent performance and cameras',
        specs: '📱 6.78" LTPO AMOLED | 🧠 Snapdragon 8s Gen 3 | 📸 50MP + 8MP + 2MP cameras | 🔋 5500mAh battery | 🤖 AI photography modes',
        price: '₹42,999'
      },
      'best_camera_phone': {
        name: 'Google Pixel 8 Pro',
        description: 'Best camera phone with AI-powered photography and Magic Eraser',
        specs: '📱 6.7" LTPO OLED | 🧠 Google Tensor G3 | 📸 50MP + 48MP + 48MP cameras | 🔋 5050mAh battery | 🤖 Advanced AI photography & Magic Eraser',
        price: '₹1,06,999'
      },
      'best_budget_phone': {
        name: 'Redmi Note 13 Pro',
        description: 'Best budget phone with excellent cameras and performance',
        specs: '📱 6.67" AMOLED Display | 🧠 Snapdragon 7s Gen 2 | 📸 200MP + 8MP + 2MP cameras | 🔋 5100mAh battery | 🤖 AI scene detection',
        price: '₹24,999'
      }
    };
    
    // Try to find exact match in database first
    let productInfo = productDatabase[cleanProductName];
    
    // If not found, try to match by brand/type
    if (!productInfo) {
      const lowerName = cleanProductName.toLowerCase();
      const originalInput = productName.toLowerCase();
      
      // Check for specific iPhone models first
      if (originalInput.includes('iphone 16 pro max')) {
        productInfo = productDatabase['iPhone 16 Pro Max'];
      } else if (originalInput.includes('iphone 16 pro')) {
        productInfo = productDatabase['iPhone 16 Pro'];
      } else if (originalInput.includes('iphone 16 plus')) {
        productInfo = productDatabase['iPhone 16 Plus'];
      } else if (originalInput.includes('iphone 16')) {
        productInfo = productDatabase['iPhone 16'];
      } else if (originalInput.includes('iphone 15 pro max')) {
        productInfo = productDatabase['iPhone 15 Pro Max'];
      } else if (originalInput.includes('iphone 15 pro')) {
        productInfo = productDatabase['iPhone 15 Pro'];
      } else if (originalInput.includes('iphone 15 plus')) {
        productInfo = productDatabase['iPhone 15 Plus'];
      } else if (originalInput.includes('iphone 15')) {
        productInfo = productDatabase['iPhone 15'];
      } else if (originalInput.includes('iphone 14 pro max')) {
        productInfo = productDatabase['iPhone 14 Pro Max'];
      } else if (originalInput.includes('iphone 14 pro')) {
        productInfo = productDatabase['iPhone 14 Pro'];
      } else if (originalInput.includes('iphone 14 plus')) {
        productInfo = productDatabase['iPhone 14 Plus'];
      } else if (originalInput.includes('iphone 14')) {
        productInfo = productDatabase['iPhone 14'];
      } else if (originalInput.includes('iphone 13 pro max')) {
        productInfo = productDatabase['iPhone 13 Pro Max'];
      } else if (originalInput.includes('iphone 13 pro')) {
        productInfo = productDatabase['iPhone 13 Pro'];
      } else if (originalInput.includes('iphone 13 mini')) {
        productInfo = productDatabase['iPhone 13 Mini'];
      } else if (originalInput.includes('iphone 13')) {
        productInfo = productDatabase['iPhone 13'];
      } else if (originalInput.includes('iphone 12 pro max')) {
        productInfo = productDatabase['iPhone 12 Pro Max'];
      } else if (originalInput.includes('iphone 12 pro')) {
        productInfo = productDatabase['iPhone 12 Pro'];
      } else if (originalInput.includes('iphone 12 mini')) {
        productInfo = productDatabase['iPhone 12 Mini'];
      } else if (originalInput.includes('iphone 12')) {
        productInfo = productDatabase['iPhone 12'];
      } else if (lowerName.includes('iphone') || lowerName.includes('apple')) {
        productInfo = productDatabase['iPhone 15 Pro'];
      } else if (lowerName.includes('samsung') || lowerName.includes('galaxy')) {
        productInfo = productDatabase['Samsung Galaxy S24 Ultra'];
      } else if (lowerName.includes('oneplus')) {
        productInfo = productDatabase['OnePlus 12'];
      } else if (lowerName.includes('pixel') || lowerName.includes('google')) {
        productInfo = productDatabase['Google Pixel 8 Pro'];
      } else if (lowerName.includes('nokia')) {
        // For Nokia, choose based on budget/requirements
        if (priority === 'price' || originalInput.includes('budget') || originalInput.includes('cheap')) {
          productInfo = productDatabase['Nokia G42 5G'];
        } else {
          productInfo = productDatabase['Nokia X30 5G'];
        }
      } else if (lowerName.includes('motorola')) {
        productInfo = productDatabase['Motorola Edge 50 Pro'];
      } else if (lowerName.includes('nothing')) {
        productInfo = productDatabase['Nothing Phone 2'];
      } else if (lowerName.includes('xiaomi')) {
        productInfo = productDatabase['Xiaomi 14'];
      } else if (lowerName.includes('realme')) {
        productInfo = productDatabase['Realme GT 6'];
      } else if (lowerName.includes('vivo')) {
        productInfo = productDatabase['Vivo V30 Pro'];
      } else if (lowerName.includes('oppo')) {
        productInfo = productDatabase['Oppo Reno 12 Pro'];
      } else if (lowerName.includes('macbook')) {
        productInfo = productDatabase['MacBook Air M2'];
      } else if (lowerName.includes('hp') && deviceType === 'laptop') {
        productInfo = productDatabase['HP Pavilion 15'];
      }
    }
    
    // UNIVERSAL DEVICE SUPPORT - Create recommendation for ANY device
    if (!productInfo) {
      // Use the exact product name the user requested
      let universalName = productName || cleanProductName || `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}`;
      let universalSpecs = '';
      let universalPrice = '₹25,999';
      let universalDescription = '';
      
      console.log('🌟 CREATING UNIVERSAL RECOMMENDATION FOR:', universalName);
      
      // Detect device type from product name if not provided
      const lowerName = universalName.toLowerCase();
      let detectedType = deviceType;
      
      if (lowerName.includes('iphone') || lowerName.includes('phone') || lowerName.includes('mobile')) {
        detectedType = 'phone';
      } else if (lowerName.includes('laptop') || lowerName.includes('macbook') || lowerName.includes('notebook')) {
        detectedType = 'laptop';
      } else if (lowerName.includes('tablet') || lowerName.includes('ipad')) {
        detectedType = 'tablet';
      } else if (lowerName.includes('watch') || lowerName.includes('smartwatch')) {
        detectedType = 'smartwatch';
      } else if (lowerName.includes('headphone') || lowerName.includes('earbuds') || lowerName.includes('airpods')) {
        detectedType = 'headphones';
      } else if (lowerName.includes('desktop') || lowerName.includes('pc')) {
        detectedType = 'desktop';
      }
      
      // Generate specs and pricing based on detected type and brand
      if (detectedType === 'phone') {
        // Smart pricing based on brand recognition
        if (lowerName.includes('iphone') || lowerName.includes('apple')) {
          universalPrice = '₹79,999';
          universalSpecs = '📱 6.1" Super Retina XDR | 🧠 A-series chip | 📸 Advanced Camera System | 🔋 All-day Battery | 🤖 iOS with AI features';
          universalDescription = `Premium iPhone with excellent build quality, advanced cameras, and seamless iOS experience`;
        } else if (lowerName.includes('samsung') || lowerName.includes('galaxy')) {
          universalPrice = '₹65,999';
          universalSpecs = '📱 6.6" Dynamic AMOLED | 🧠 Exynos/Snapdragon | 📸 Multi-lens Camera System | 🔋 Fast Charging | 🤖 One UI with Galaxy AI';
          universalDescription = `Feature-rich Samsung Galaxy with vibrant display, versatile cameras, and smart AI capabilities`;
        } else if (lowerName.includes('pixel') || lowerName.includes('google')) {
          universalPrice = '₹55,999';
          universalSpecs = '📱 6.4" OLED Display | 🧠 Google Tensor | 📸 Computational Photography | 🔋 Adaptive Battery | 🤖 Pure Android with AI';
          universalDescription = `Google Pixel with exceptional AI photography, clean Android experience, and smart features`;
        } else if (lowerName.includes('oneplus')) {
          universalPrice = '₹45,999';
          universalSpecs = '📱 6.7" Fluid AMOLED | 🧠 Snapdragon | 📸 Hasselblad Cameras | 🔋 Warp Charge | 🤖 OxygenOS with AI optimization';
          universalDescription = `OnePlus flagship with smooth performance, fast charging, and premium camera experience`;
        } else {
          universalPrice = '₹35,999';
          universalSpecs = '📱 6.5" AMOLED Display | 🧠 Flagship Processor | 📸 AI Triple Camera | 🔋 Long-lasting Battery | 🤖 Smart AI Features';
          universalDescription = `Excellent smartphone with modern features, great cameras, and AI-powered performance`;
        }
      } else if (detectedType === 'laptop') {
        if (lowerName.includes('macbook') || lowerName.includes('apple')) {
          universalPrice = '₹1,14,900';
          universalSpecs = '💻 13.6" Liquid Retina | 🧠 Apple M-series chip | 💾 8GB RAM + 256GB SSD | 🔋 18-hour battery | 🤖 macOS with AI';
          universalDescription = `Premium MacBook with exceptional performance, all-day battery, and seamless Apple ecosystem integration`;
        } else if (lowerName.includes('dell') || lowerName.includes('xps')) {
          universalPrice = '₹85,999';
          universalSpecs = '💻 14" FHD+ Display | 🧠 Intel Core i7 | 💾 16GB RAM + 512GB SSD | 🔋 10-hour battery | 🤖 Windows 11 with AI';
          universalDescription = `Premium Dell laptop with excellent build quality, powerful performance, and professional features`;
        } else if (lowerName.includes('hp')) {
          universalPrice = '₹65,999';
          universalSpecs = '💻 15.6" FHD IPS | 🧠 Intel/AMD Processor | 💾 8GB RAM + 512GB SSD | 🔋 8-hour battery | 🤖 Windows with AI acceleration';
          universalDescription = `Reliable HP laptop perfect for work, study, and everyday computing with modern AI features`;
        } else {
          universalPrice = '₹55,999';
          universalSpecs = '💻 15.6" FHD Display | 🧠 Modern Processor | 💾 8GB RAM + 512GB SSD | 🔋 All-day Battery | 🤖 AI-enhanced Performance';
          universalDescription = `Versatile laptop with solid performance, ample storage, and AI-powered productivity features`;
        }
      } else if (detectedType === 'tablet') {
        if (lowerName.includes('ipad') || lowerName.includes('apple')) {
          universalPrice = '₹44,900';
          universalSpecs = '📱 10.9" Liquid Retina | 🧠 A-series chip | 📸 12MP Camera | 🔋 10-hour battery | 🤖 iPadOS with AI';
          universalDescription = `Versatile iPad perfect for creativity, productivity, and entertainment with Apple Pencil support`;
        } else {
          universalPrice = '₹25,999';
          universalSpecs = '📱 10.4" IPS Display | 🧠 Octa-core Processor | 📸 Dual Camera | 🔋 8-hour battery | 🤖 Android with AI features';
          universalDescription = `Feature-rich tablet ideal for media consumption, light productivity, and digital creativity`;
        }
      } else if (detectedType === 'smartwatch') {
        if (lowerName.includes('apple') || lowerName.includes('watch')) {
          universalPrice = '₹46,900';
          universalSpecs = '⌚ Retina Display | 🏃 Advanced fitness tracking | ❤️ Health monitoring | 🔋 18-hour battery | 🤖 Siri & AI features';
          universalDescription = `Advanced Apple Watch with comprehensive health tracking, fitness features, and seamless iPhone integration`;
        } else {
          universalPrice = '₹15,999';
          universalSpecs = '⌚ AMOLED Display | 🏃 Multi-sport tracking | ❤️ Heart rate monitor | 🔋 7-day battery | 🤖 Smart AI coaching';
          universalDescription = `Smart fitness watch with health monitoring, long battery life, and intelligent workout guidance`;
        }
      } else if (detectedType === 'headphones') {
        if (lowerName.includes('airpods') || lowerName.includes('apple')) {
          universalPrice = '₹24,900';
          universalSpecs = '🎧 In-ear design | 🔇 Active noise cancellation | 🔋 6-hour battery | 🎵 Spatial Audio | 🤖 Adaptive EQ';
          universalDescription = `Premium wireless earbuds with excellent sound quality, noise cancellation, and seamless Apple integration`;
        } else if (lowerName.includes('sony') || lowerName.includes('bose')) {
          universalPrice = '₹29,990';
          universalSpecs = '🎧 Over-ear design | 🔇 Industry-leading noise cancellation | 🔋 30-hour battery | 🎵 Hi-Res Audio | 🤖 AI sound optimization';
          universalDescription = `Premium noise-canceling headphones with exceptional audio quality and intelligent sound adaptation`;
        } else {
          universalPrice = '₹8,999';
          universalSpecs = '🎧 Comfortable design | 🔇 Noise isolation | 🔋 20-hour battery | 🎵 Rich sound | 🤖 Smart controls';
          universalDescription = `Quality headphones with great sound, comfortable fit, and smart features for everyday use`;
        }
      } else {
        // Generic fallback for any other device
        universalPrice = '₹35,999';
        universalSpecs = '🔧 Premium build quality | ⚡ High performance | 🔋 Long-lasting power | 🎯 Advanced features | 🤖 AI-enhanced experience';
        universalDescription = `High-quality device with modern features, reliable performance, and intelligent capabilities`;
      }
      
      productInfo = {
        name: universalName,
        description: universalDescription,
        specs: universalSpecs,
        price: universalPrice
      };
      
      console.log('✅ UNIVERSAL RECOMMENDATION CREATED:', productInfo);
    }
    
    // Adjust for priority
    if (priority === 'price' && productInfo.price) {
      const currentPrice = parseInt(productInfo.price.replace(/[₹,]/g, ''));
      const reducedPrice = Math.floor(currentPrice * 0.8);
      productInfo.price = `₹${reducedPrice.toLocaleString('en-IN')}`;
    }
    
    return productInfo;
  };

  const detectLanguage = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('hindi') || lowerInput.includes('हिंदी')) return 'hindi';
    if (lowerInput.includes('telugu') || lowerInput.includes('తెలుగు')) return 'telugu';
    if (lowerInput.includes('spanish') || lowerInput.includes('español')) return 'spanish';
    if (lowerInput.includes('german') || lowerInput.includes('deutsch')) return 'german';
    if (lowerInput.includes('french') || lowerInput.includes('français')) return 'french';
    if (lowerInput.includes('marathi') || lowerInput.includes('मराठी')) return 'marathi';
    return 'english';
  };

  // Smart price comparison across multiple retailers
  const findBestDeal = (productName, basePrice) => {
    // Get user's actual region from timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const region = detectUserRegion(timezone);
    
    console.log('User timezone:', timezone, 'Detected region:', region); // Debug info
    
    // Convert price to local currency based on region
    let localPrice = basePrice;
    if (region === 'US') {
      // Convert ₹ to $ for US users
      const rupeeAmount = parseInt(basePrice.replace(/[₹,]/g, ''));
      const dollarAmount = Math.floor(rupeeAmount / 83); // Rough conversion rate
      localPrice = `$${dollarAmount}`;
    } else if (region === 'EU') {
      // Convert ₹ to € for EU users
      const rupeeAmount = parseInt(basePrice.replace(/[₹,]/g, ''));
      const euroAmount = Math.floor(rupeeAmount / 90); // Rough conversion rate
      localPrice = `€${euroAmount}`;
    }
    
    console.log('Original price:', basePrice, 'Local price:', localPrice);
    
    // Simulate price comparison across multiple retailers
    const priceComparison = comparePricesAcrossRetailers(productName, localPrice, region);
    
    // Show comparison details
    console.log('Price comparison result:', priceComparison);
    
    return priceComparison.bestDeal;
  };

  // Compare prices across multiple retailers (simulated)
  const comparePricesAcrossRetailers = (productName, basePrice, region) => {
    const cleanName = productName.replace(/[^\w\s]/g, '');
    const searchTerm = encodeURIComponent(cleanName);
    const lowerProductName = productName.toLowerCase();
    
    // Price variations based on typical retailer patterns
    const basePriceNum = parseInt(basePrice.replace(/[₹,$€,]/g, ''));
    
    // Product category for retailer filtering
    const isElectronics = lowerProductName.includes('iphone') || lowerProductName.includes('samsung') || 
                         lowerProductName.includes('laptop') || lowerProductName.includes('macbook') ||
                         lowerProductName.includes('phone') || lowerProductName.includes('tablet') ||
                         lowerProductName.includes('headphone') || lowerProductName.includes('earbuds');
    
    // Region-specific retailers (only those actually available and accessible)
    const retailers = {
      'US': [
        { name: 'Amazon US', price: basePriceNum, discount: 0.94, url: `https://www.amazon.com/s?k=${searchTerm}&rh=n%3A2335752011` },
        { name: 'Best Buy', price: basePriceNum, discount: 0.96, url: `https://www.bestbuy.com/site/searchpage.jsp?st=${searchTerm}&_dyncharset=UTF-8&id=pcat17071&type=page&sc=Global&cp=1&nrp=&sp=&qp=&list=n&af=true&iht=y&usc=All+Categories&ks=960&keys=keys` },
        { name: 'Walmart', price: basePriceNum, discount: 0.95, url: `https://www.walmart.com/search?q=${searchTerm}&cat_id=1105910` },
        { name: 'Target', price: basePriceNum, discount: 0.97, url: `https://www.target.com/s?searchTerm=${searchTerm}&category=5xtg6` }
      ],
      'IN': [
        { name: 'Amazon India', price: basePriceNum, discount: 0.93, url: `https://www.amazon.in/s?k=${searchTerm}&rh=n%3A1389401031` },
        { name: 'Flipkart', price: basePriceNum, discount: 0.91, url: `https://www.flipkart.com/search?q=${searchTerm}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off` },
        { name: 'Croma', price: basePriceNum, discount: 0.95, url: `https://www.croma.com/search?q=${searchTerm}` },
        { name: 'Reliance Digital', price: basePriceNum, discount: 0.94, url: `https://www.reliancedigital.in/search?q=${searchTerm}` }
      ],
      'EU': [
        { name: 'Amazon Europe', price: basePriceNum, discount: 0.93, url: `https://www.amazon.de/s?k=${searchTerm}` },
        { name: 'MediaMarkt', price: basePriceNum, discount: 0.97, url: `https://www.mediamarkt.de/de/search.html?query=${searchTerm}` },
        { name: 'Saturn', price: basePriceNum, discount: 0.95, url: `https://www.saturn.de/de/search.html?query=${searchTerm}` },
        { name: 'Currys', price: basePriceNum, discount: 0.96, url: `https://www.currys.co.uk/search?q=${searchTerm}` }
      ],
      'UK': [
        { name: 'Amazon UK', price: basePriceNum, discount: 0.94, url: `https://www.amazon.co.uk/s?k=${searchTerm}` },
        { name: 'Currys', price: basePriceNum, discount: 0.96, url: `https://www.currys.co.uk/search?q=${searchTerm}` },
        { name: 'Argos', price: basePriceNum, discount: 0.93, url: `https://www.argos.co.uk/search/${searchTerm}` },
        { name: 'John Lewis', price: basePriceNum, discount: 0.98, url: `https://www.johnlewis.com/search?search-term=${searchTerm}` }
      ],
      'CA': [
        { name: 'Amazon Canada', price: basePriceNum, discount: 0.94, url: `https://www.amazon.ca/s?k=${searchTerm}` },
        { name: 'Best Buy Canada', price: basePriceNum, discount: 0.97, url: `https://www.bestbuy.ca/en-ca/search?search=${searchTerm}` },
        { name: 'Costco Canada', price: basePriceNum, discount: 0.89, url: `https://www.costco.ca/CatalogSearch?keyword=${searchTerm}` }
      ],
      'AU': [
        { name: 'Amazon Australia', price: basePriceNum, discount: 0.95, url: `https://www.amazon.com.au/s?k=${searchTerm}` },
        { name: 'JB Hi-Fi', price: basePriceNum, discount: 0.92, url: `https://www.jbhifi.com.au/search?query=${searchTerm}` },
        { name: 'Harvey Norman', price: basePriceNum, discount: 0.96, url: `https://www.harveynorman.com.au/search?q=${searchTerm}` },
        { name: 'Officeworks', price: basePriceNum, discount: 0.94, url: `https://www.officeworks.com.au/search?q=${searchTerm}` }
      ],
      'ASIA': [
        { name: 'Shopee', price: basePriceNum, discount: 0.90, url: `https://shopee.com/search?keyword=${searchTerm}` },
        { name: 'Lazada', price: basePriceNum, discount: 0.92, url: `https://www.lazada.com/catalog/?q=${searchTerm}` },
        { name: 'Qoo10', price: basePriceNum, discount: 0.94, url: `https://www.qoo10.com/s/${searchTerm}` }
        // Note: Shein available in most Asian countries except India
      ]
    };

    // Use the actual detected region (no currency override)
    let regionRetailers = retailers[region] || retailers['US']; // Default to US for global compatibility
    
    // For electronics, use all available retailers (don't filter too much)
    if (isElectronics) {
      // Keep all retailers for better comparison
      console.log('Electronics detected, using all retailers for comparison');
    }
    
    // Ensure we have at least one retailer
    if (regionRetailers.length === 0) {
      regionRetailers = retailers[region] || retailers['US']; // Default to US for global compatibility
    }
    
    // Calculate prices for all retailers and find the best deal
    const allDeals = regionRetailers.map(retailer => ({
      name: retailer.name,
      originalPrice: retailer.price,
      finalPrice: Math.floor(retailer.price * retailer.discount),
      discount: retailer.discount,
      url: retailer.url
    }));

    // Sort by price (cheapest first)
    allDeals.sort((a, b) => a.finalPrice - b.finalPrice);
    
    // Get the best deal (cheapest)
    const bestDeal = allDeals[0];
    const finalPrice = bestDeal.finalPrice;
    const savings = basePriceNum - finalPrice;

    console.log('All deals compared:', allDeals); // Debug
    console.log('Best deal selected:', bestDeal); // Debug

    // Format price according to region
    let formattedPrice, formattedSavings;
    if (region === 'US') {
      formattedPrice = `$${finalPrice.toLocaleString('en-US')}`;
      formattedSavings = savings > 0 ? `$${savings.toLocaleString('en-US')}` : null;
    } else if (region === 'EU') {
      formattedPrice = `€${finalPrice.toLocaleString('de-DE')}`;
      formattedSavings = savings > 0 ? `€${savings.toLocaleString('de-DE')}` : null;
    } else {
      formattedPrice = `₹${finalPrice.toLocaleString('en-IN')}`;
      formattedSavings = savings > 0 ? `₹${savings.toLocaleString('en-IN')}` : null;
    }

    return {
      bestDeal: {
        retailer: bestDeal.name,
        price: formattedPrice,
        originalPrice: basePrice,
        savings: formattedSavings,
        url: bestDeal.url
      },
      allDeals: allDeals,
      compared: regionRetailers.length
    };
  };

  // Get retailer name for display - UNUSED, keeping for future use
  // eslint-disable-next-line no-unused-vars
  const getRetailerName = (productName) => {
    const lowerProductName = productName.toLowerCase();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const region = detectUserRegion(timezone);
    
    const isElectronics = lowerProductName.includes('iphone') || lowerProductName.includes('samsung') || 
                         lowerProductName.includes('laptop') || lowerProductName.includes('macbook') ||
                         lowerProductName.includes('phone') || lowerProductName.includes('tablet');
    
    const isClothing = lowerProductName.includes('shirt') || lowerProductName.includes('dress') || 
                      lowerProductName.includes('shoes') || lowerProductName.includes('jacket');
    
    const isHome = lowerProductName.includes('furniture') || lowerProductName.includes('tools') || 
                  lowerProductName.includes('garden') || lowerProductName.includes('kitchen');

    const retailerNames = {
      'US': {
        electronics: 'Best Buy',
        clothing: 'Walmart',
        home: 'Home Depot',
        general: 'Amazon'
      },
      'IN': {
        electronics: 'Flipkart',
        clothing: 'Myntra',
        home: 'Amazon India',
        general: 'Amazon India'
      },
      'EU': {
        electronics: 'Amazon Europe',
        clothing: 'H&M',
        home: 'IKEA',
        general: 'Amazon Europe'
      },
      'ASIA': {
        electronics: 'Shopee',
        clothing: 'Shein',
        home: 'Shopee',
        general: 'Shopee'
      },
      'AU': {
        electronics: 'JB Hi-Fi',
        clothing: 'The Iconic',
        home: 'Bunnings',
        general: 'Amazon Australia'
      }
    };

    const regionNames = retailerNames[region] || retailerNames['US'];
    
    if (isElectronics) return regionNames.electronics;
    if (isClothing) return regionNames.clothing;
    if (isHome) return regionNames.home;
    
    return regionNames.general;
  };

  // Detect user region from timezone - More specific mapping
  const detectUserRegion = (timezone) => {
    console.log('Detecting region for timezone:', timezone); // Debug
    
    // North America
    if (timezone.includes('America/New_York') || timezone.includes('America/Chicago') || 
        timezone.includes('America/Denver') || timezone.includes('America/Los_Angeles') ||
        timezone.includes('America/Phoenix') || timezone.includes('America/Anchorage')) return 'US';
    if (timezone.includes('America/Toronto') || timezone.includes('America/Vancouver') ||
        timezone.includes('America/Montreal')) return 'CA';
    
    // Europe
    if (timezone.includes('Europe/London') || timezone.includes('Europe/Dublin')) return 'UK';
    if (timezone.includes('Europe/Berlin') || timezone.includes('Europe/Paris') || 
        timezone.includes('Europe/Rome') || timezone.includes('Europe/Madrid') ||
        timezone.includes('Europe/Amsterdam') || timezone.includes('Europe/Vienna')) return 'EU';
    
    // Asia-Pacific
    if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) return 'IN';
    if (timezone.includes('Australia/Sydney') || timezone.includes('Australia/Melbourne') ||
        timezone.includes('Australia/Brisbane') || timezone.includes('Australia/Perth')) return 'AU';
    if (timezone.includes('Asia/Singapore') || timezone.includes('Asia/Bangkok') || 
        timezone.includes('Asia/Manila') || timezone.includes('Asia/Jakarta') ||
        timezone.includes('Asia/Kuala_Lumpur') || timezone.includes('Asia/Ho_Chi_Minh')) return 'ASIA';
    
    // Fallbacks for broader regions
    if (timezone.includes('America')) return 'US';
    if (timezone.includes('Europe')) return 'EU';
    if (timezone.includes('Asia')) return 'ASIA';
    if (timezone.includes('Australia')) return 'AU';
    
    console.log('No specific match found, defaulting to US'); // Debug
    return 'US'; // Default to US
  };

  // Select best retailer based on region and product type - UNUSED, keeping for future use
  // eslint-disable-next-line no-unused-vars
  const selectBestRetailer = (region, searchTerm, isElectronics, isClothing, isHome) => {
    const retailers = {
      'US': {
        electronics: `https://www.bestbuy.com/site/searchpage.jsp?st=${searchTerm}`,
        clothing: `https://www.walmart.com/search?q=${searchTerm}`,
        home: `https://www.homedepot.com/s/${searchTerm}`,
        general: `https://www.amazon.com/s?k=${searchTerm}`,
        warehouse: `https://www.costco.com/CatalogSearch?keyword=${searchTerm}`
      },
      'IN': {
        electronics: `https://www.flipkart.com/search?q=${searchTerm}`,
        clothing: `https://www.myntra.com/${searchTerm}`,
        home: `https://www.amazon.in/s?k=${searchTerm}`,
        general: `https://www.amazon.in/s?k=${searchTerm}`,
        warehouse: `https://www.dmart.in/search?q=${searchTerm}`
      },
      'EU': {
        electronics: `https://www.amazon.de/s?k=${searchTerm}`,
        clothing: `https://www2.hm.com/en_gb/search-results.html?q=${searchTerm}`,
        home: `https://www.ikea.com/gb/en/search/products/?q=${searchTerm}`,
        general: `https://www.amazon.de/s?k=${searchTerm}`,
        warehouse: `https://www.amazon.de/s?k=${searchTerm}`
      },
      'ASIA': {
        electronics: `https://shopee.com/search?keyword=${searchTerm}`,
        clothing: `https://www.shein.com/search?q=${searchTerm}`,
        home: `https://shopee.com/search?keyword=${searchTerm}`,
        general: `https://shopee.com/search?keyword=${searchTerm}`,
        warehouse: `https://shopee.com/search?keyword=${searchTerm}`
      },
      'AU': {
        electronics: `https://www.jbhifi.com.au/search?query=${searchTerm}`,
        clothing: `https://www.theiconic.com.au/search/?q=${searchTerm}`,
        home: `https://www.bunnings.com.au/search/products?q=${searchTerm}`,
        general: `https://www.amazon.com.au/s?k=${searchTerm}`,
        warehouse: `https://www.costco.com.au/search?text=${searchTerm}`
      }
    };

    const regionRetailers = retailers[region] || retailers['US'];
    
    if (isElectronics) return regionRetailers.electronics;
    if (isClothing) return regionRetailers.clothing;
    if (isHome) return regionRetailers.home;
    
    return regionRetailers.general;
  };

  const generateRecommendation = (data) => {
    // Generate dynamic recommendation based on user's actual request
    if (data.requestedProduct) {
      return generateDynamicRecommendation(data.requestedProduct, data.gadgetType, data.usage, data.priority);
    }

    // Fallback to default recommendation if no specific product requested
    return generateDynamicRecommendation("smartphone", "phone", "general", "performance");
  };

  // Generate device suggestions based on usage
  const generateUsageBasedSuggestions = (usage) => {
    // Simplified function - just ask for device preference without unused suggestions
    return `Perfect! You'll be using it for **${usage}**.\n\n**What specific device do you have in mind?**\n\nJust tell me the exact model you're interested in and I'll find the best deal for you!`;
  };

  // Generate specific suggestions based on detailed usage
  const generateSpecificSuggestions = (specificUsage, gadgetType, generalUsage) => {
    const lowerSpecific = specificUsage.toLowerCase();
    let suggestions = [];

    if (gadgetType === 'phone') {
      // Work sub-categories
      if (lowerSpecific.includes('personal') || lowerSpecific.includes('office')) {
        suggestions = [
          "📱 **iPhone 15** - Perfect for office work with excellent battery and reliability",
          "📱 **Samsung Galaxy S24** - Great for productivity with multitasking features",
          "📱 **Google Pixel 8** - Excellent for calls and email with AI assistance"
        ];
      } else if (lowerSpecific.includes('creative')) {
        suggestions = [
          "📱 **iPhone 15 Pro** - Best camera system for creative work",
          "📱 **Samsung Galaxy S24 Ultra** - Amazing for design with S Pen",
          "📱 **Google Pixel 8 Pro** - Incredible photo editing capabilities"
        ];
      } else if (lowerSpecific.includes('field') || lowerSpecific.includes('outdoor')) {
        suggestions = [
          "📱 **iPhone 15 Pro** - Durable titanium build for tough conditions",
          "📱 **Samsung Galaxy S24 Ultra** - Rugged with great outdoor visibility",
          "📱 **Google Pixel 8 Pro** - Excellent GPS and weather resistance"
        ];
      }
      // Gaming sub-categories
      else if (lowerSpecific.includes('casual')) {
        suggestions = [
          "📱 **iPhone 15** - Perfect for casual gaming with great performance",
          "📱 **Samsung Galaxy S24** - Good gaming performance at reasonable price",
          "📱 **OnePlus 12** - Smooth gaming experience with fast charging"
        ];
      } else if (lowerSpecific.includes('competitive') || lowerSpecific.includes('esports')) {
        suggestions = [
          "📱 **iPhone 15 Pro Max** - Ultimate gaming performance with A17 Pro",
          "📱 **Samsung Galaxy S24 Ultra** - Pro gaming with 120Hz display",
          "📱 **OnePlus 12** - Gaming-focused with advanced cooling"
        ];
      }
      // Entertainment sub-categories
      else if (lowerSpecific.includes('video') || lowerSpecific.includes('streaming')) {
        suggestions = [
          "📱 **iPhone 15 Plus** - Large 6.7\" display perfect for videos",
          "📱 **Samsung Galaxy S24 Plus** - Vibrant AMOLED for streaming",
          "📱 **OnePlus 12** - Excellent display and speakers for media"
        ];
      } else if (lowerSpecific.includes('music') || lowerSpecific.includes('audio')) {
        suggestions = [
          "📱 **iPhone 15 Pro** - Superior audio quality and processing",
          "📱 **Samsung Galaxy S24 Ultra** - Great audio with advanced features",
          "📱 **OnePlus 12** - Excellent audio experience with fast performance"
        ];
      }
      // Study sub-categories
      else if (lowerSpecific.includes('high school')) {
        suggestions = [
          "📱 **iPhone 15** - Reliable and user-friendly for students",
          "📱 **Samsung Galaxy S24** - Great value with good features",
          "📱 **Google Pixel 8** - Perfect for research and learning"
        ];
      } else if (lowerSpecific.includes('college') || lowerSpecific.includes('graduate')) {
        suggestions = [
          "📱 **iPhone 15 Pro** - Professional features for serious students",
          "📱 **Samsung Galaxy S24 Ultra** - Note-taking with S Pen",
          "📱 **Google Pixel 8 Pro** - Research and AI assistance features"
        ];
      }
    }

    const suggestionText = suggestions.join('\n\n');
    return `Perfect! Based on your **${specificUsage}** needs, here are my tailored recommendations:\n\n${suggestionText}\n\n**Which one catches your interest, or do you have another preference?**`;
  };

  // UNIVERSAL Direct recommendation - works for ANY device
  const generateDirectRecommendation = (userData) => {
    const { gadgetType, usage, priority, brand, devicePreference } = userData; // Removed unused destructured variables
    
    console.log('=== UNIVERSAL RECOMMENDATION DEBUG ===');
    console.log('gadgetType:', gadgetType);
    console.log('brand:', brand);
    console.log('devicePreference:', devicePreference);
    console.log('priority:', priority);
    console.log('usage:', usage);
    
    let productName = null;
    
    // 1. UNIVERSAL APPROACH - Use whatever device the user specified
    console.log('🌟 UNIVERSAL: Checking devicePreference:', devicePreference);
    if (devicePreference) {
      // Use the universal extraction function to get the exact device
      // Use the universal extraction to get ANY device the user wants
      const extractedProduct = extractProductFromInput(devicePreference);
      productName = extractedProduct.productName;
      console.log('🎯 UNIVERSAL EXTRACTION RESULT:', devicePreference, '→', productName);
    }
    
    // 2. If no device preference, use universal extraction on brand or fallback to defaults
    if (!productName) {
      if (brand) {
        const extractedFromBrand = extractProductFromInput(brand);
        productName = extractedFromBrand.productName;
        console.log('🎯 EXTRACTED FROM BRAND:', brand, '→', productName);
      } else {
        // Fallback to sensible defaults based on gadget type
        if (gadgetType === 'phone') {
          productName = 'iPhone 15 Pro';
        } else if (gadgetType === 'laptop') {
          productName = 'MacBook Air M2';
        } else if (gadgetType === 'smartwatch') {
          productName = 'Apple Watch Series 10';
        } else if (gadgetType === 'headphones') {
          productName = 'Sony WH-1000XM5';
        } else {
          productName = 'iPhone 15 Pro';
        }
      }
    }
    
    console.log('🎯 FINAL PRODUCT SELECTED:', productName);
    
    return generateDynamicRecommendation(productName, gadgetType, usage, priority);
  };

  // Smart recommendation based on user preferences - UNUSED, keeping for future use
  // eslint-disable-next-line no-unused-vars
  const generateSmartRecommendation = (userData) => {
    const { gadgetType, usage, priority, budget, brand } = userData; // Added back needed variables
    
    console.log('Smart recommendation input:', userData); // Debug
    
    // Determine the best product based on user preferences
    let recommendedProduct = 'iPhone 15 Pro'; // Default fallback
    
    if (gadgetType === 'phone') {
      // Phone recommendations based on priorities
      if (priority && priority.toLowerCase().includes('camera')) {
        if (budget && (budget.toLowerCase().includes('regardless') || budget.toLowerCase().includes('high'))) {
          recommendedProduct = 'iPhone 15 Pro'; // Best camera, premium
        } else {
          recommendedProduct = 'Google Pixel 8 Pro'; // Best camera, good value
        }
      } else if (priority && priority.toLowerCase().includes('battery')) {
        recommendedProduct = 'iPhone 15 Plus'; // Great battery life
      } else if (priority && priority.toLowerCase().includes('performance')) {
        recommendedProduct = 'iPhone 15 Pro'; // Best performance
      } else if (priority && priority.toLowerCase().includes('price')) {
        recommendedProduct = 'Redmi Note 13 Pro'; // Best budget option
      } else if (brand && brand.toLowerCase().includes('apple')) {
        // Check for specific iPhone model in brand field
        if (brand.toLowerCase().includes('14 pro')) {
          recommendedProduct = 'iPhone 14 Pro';
        } else if (brand.toLowerCase().includes('14')) {
          recommendedProduct = 'iPhone 14';
        } else if (brand.toLowerCase().includes('15 pro')) {
          recommendedProduct = 'iPhone 15 Pro';
        } else if (brand.toLowerCase().includes('15')) {
          recommendedProduct = 'iPhone 15';
        } else {
          recommendedProduct = 'iPhone 15 Pro'; // Default Apple
        }
      } else if (brand && brand.toLowerCase().includes('samsung')) {
        recommendedProduct = 'Samsung Galaxy S24 Ultra';
      } else if (brand && brand.toLowerCase().includes('basic')) {
        recommendedProduct = 'Redmi Note 13 Pro'; // Good basic phone
      } else {
        // Default recommendation for work usage with battery + camera priority
        if (usage === 'work' && priority && priority.includes('battery') && priority.includes('camera')) {
          recommendedProduct = 'iPhone 15 Pro'; // Perfect for work with great battery and camera
        } else {
          recommendedProduct = 'iPhone 15 Pro'; // Safe default
        }
      }
    } else if (gadgetType === 'smartwatch' || gadgetType === 'watch') {
      // Smartwatch recommendations
      if (brand && (brand.toLowerCase().includes('apple') || brand.toLowerCase().includes('iwatch') || brand.toLowerCase().includes('watch'))) {
        if (brand.toLowerCase().includes('series 11') || brand.toLowerCase().includes('11')) {
          recommendedProduct = 'Apple Watch Series 10'; // Latest available (Series 11 doesn't exist yet)
        } else {
          recommendedProduct = 'Apple Watch Series 10'; // Latest Apple Watch
        }
      } else if (brand && brand.toLowerCase().includes('samsung')) {
        recommendedProduct = 'Samsung Galaxy Watch 6';
      } else if (priority && priority.toLowerCase().includes('fitness')) {
        recommendedProduct = 'Garmin Forerunner 965';
      } else {
        recommendedProduct = 'Apple Watch Series 10'; // Default best smartwatch
      }
    } else if (gadgetType === 'laptop') {
      recommendedProduct = 'MacBook Air M2';
    } else if (gadgetType === 'headphones') {
      recommendedProduct = 'Sony WH-1000XM5';
    }
    
    // Final safety check - ensure we always have a valid product
    if (!recommendedProduct) {
      recommendedProduct = 'iPhone 15 Pro';
    }
    
    // Get the product details from our database
    return generateDynamicRecommendation(recommendedProduct, gadgetType, usage, priority);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    addUserMessage(currentInput);
    processUserInput(currentInput);
    setCurrentInput('');
  };

  const processUserInput = (input) => {
    const currentLang = sessionData.language || 'english';
    const t = translations[currentLang] || translations.english;

    switch (sessionData.step) {
      case 'greeting':
        const detectedLang = detectLanguage(input);
        // const lowerGreetingInput = input.toLowerCase(); // Unused variable
        
        // Language selection - go to gadget selection
        setSessionData(prev => ({ ...prev, language: detectedLang, step: 'gadget' }));
        setTimeout(() => {
          addBotMessage(t.gadgetQuestion);
        }, 1000);
        break;

      case 'naturalChat':
        // More flexible conversation handling
        setSessionData(prev => ({ ...prev, step: 'conversation' }));
        const chatData = handleQuickRequest(input);
        const chatRecommendation = generateRecommendation(chatData);
        
        setTimeout(() => {
          const bestDeal = findBestDeal(chatRecommendation.name, chatRecommendation.price);
          let dealMessage = '';
          if (bestDeal.savings) {
            dealMessage = `\n\n💰 **BEST DEAL FOUND!**\n🏪 **${bestDeal.retailer}**: ${bestDeal.price} (Save ${bestDeal.savings}!)\n🛒 **Buy Now** 👉 ${bestDeal.url}`;
          } else {
            dealMessage = `\n\n🏪 **Best Price Found**: ${bestDeal.retailer} - ${bestDeal.price}\n🛒 **Buy Now** 👉 ${bestDeal.url}`;
          }
          
          addBotMessage(`Great choice! I'd recommend the **${chatRecommendation.name}**\n\n${chatRecommendation.description}\n\n**Key Specifications:**\n${chatRecommendation.specs || 'Premium features and specifications'}${dealMessage}`);
          
          setTimeout(() => {
            addBotMessage("What do you think? Need more details or want to see other options?");
          }, 1500);
        }, 1000);
        break;

      case 'gadget':
        setSessionData(prev => ({ ...prev, gadgetType: input, step: 'usage' }));
        setTimeout(() => {
          addBotMessage(t.usageQuestion);
        }, 1500);
        break;

      case 'usage':
        setSessionData(prev => ({ ...prev, usage: input, step: 'deviceSuggestion' }));
        setTimeout(() => {
          const suggestions = generateUsageBasedSuggestions(input);
          addBotMessage(suggestions);
        }, 1500);
        break;

      case 'deviceSuggestion':
        // Check if this is a sub-category response or device preference
        const lowerDeviceInput = input.toLowerCase();
        if (lowerDeviceInput.includes('personal') || lowerDeviceInput.includes('office') || lowerDeviceInput.includes('creative') || 
            lowerDeviceInput.includes('field') || lowerDeviceInput.includes('corporate') || lowerDeviceInput.includes('healthcare') ||
            lowerDeviceInput.includes('casual') || lowerDeviceInput.includes('competitive') || lowerDeviceInput.includes('streaming') ||
            lowerDeviceInput.includes('video') || lowerDeviceInput.includes('music') || lowerDeviceInput.includes('social') ||
            lowerDeviceInput.includes('high school') || lowerDeviceInput.includes('college') || lowerDeviceInput.includes('graduate')) {
          
          // This is a sub-category, generate specific suggestions
          setSessionData(prev => ({ ...prev, specificUsage: input, step: 'finalDeviceSuggestion' }));
          setTimeout(() => {
            const specificSuggestions = generateSpecificSuggestions(input, sessionData.gadgetType, sessionData.usage);
            addBotMessage(specificSuggestions);
          }, 1500);
        } else {
          // This is a device preference
          setSessionData(prev => ({ ...prev, devicePreference: input, step: 'priority' }));
          setTimeout(() => {
            addBotMessage(t.priorityQuestion);
          }, 1500);
        }
        break;

      case 'finalDeviceSuggestion':
        // User selected from specific suggestions
        setSessionData(prev => ({ ...prev, devicePreference: input, step: 'priority' }));
        setTimeout(() => {
          addBotMessage(t.priorityQuestion);
        }, 1500);
        break;

      case 'priority':
        setSessionData(prev => ({ ...prev, priority: input, step: 'experience' }));
        setTimeout(() => {
          addBotMessage(t.experienceQuestion);
        }, 1500);
        break;

      case 'experience':
        setSessionData(prev => ({ ...prev, experience: input, step: 'requirements' }));
        setTimeout(() => {
          addBotMessage(t.requirementsQuestion);
        }, 1500);
        break;

      case 'requirements':
        setSessionData(prev => ({ ...prev, requirements: input, step: 'budget' }));
        setTimeout(() => {
          addBotMessage(t.budgetQuestion);
        }, 1500);
        break;

      case 'budget':
        setSessionData(prev => ({ ...prev, budget: input, step: 'brand' }));
        setTimeout(() => {
          addBotMessage(t.lifestyleQuestion);
        }, 1500);
        break;

      case 'brand':
        setSessionData(prev => ({ ...prev, lifestyle: input, step: 'finalFeatures' }));
        setTimeout(() => {
          addBotMessage(t.finalQuestion);
        }, 1500);
        break;

      case 'finalFeatures':
        const finalData = { ...sessionData, finalFeatures: input };
        setSessionData(prev => ({ ...prev, finalFeatures: input, step: 'conversation' }));
        
        setTimeout(() => {
          addBotMessage(t.analyzing);
          
          setTimeout(() => {
            // Create smart recommendation based on user preferences
            console.log('Final user data:', finalData); // Debug what we're working with
            const recommendation = generateDirectRecommendation(finalData);
            
            // Find best deal across multiple retailers
            const bestDeal = findBestDeal(recommendation.name, recommendation.price);
            
            let dealMessage = '';
            if (bestDeal.savings) {
              dealMessage = `\n\n💰 **BEST DEAL FOUND!**\n🏪 **${bestDeal.retailer}**: ${bestDeal.price} (Save ${bestDeal.savings}!)\n🛒 **Buy Now** 👉 ${bestDeal.url}`;
            } else {
              dealMessage = `\n\n🏪 **Best Price Found**: ${bestDeal.retailer} - ${bestDeal.price}\n🛒 **Buy Now** 👉 ${bestDeal.url}`;
            }
            
            const finalMessage = `Based on all your preferences, I recommend the **${recommendation.name}**\n\n${recommendation.description}\n\n**Key Specifications:**\n${recommendation.specs || 'Premium features and specifications'}${dealMessage}`;
            addBotMessage(finalMessage);
            
            setTimeout(() => {
              addBotMessage(t.followUp);
            }, 1500);
          }, 2000);
        }, 1500);
        break;

      case 'conversation':
        // Handle direct product requests - provide immediate recommendations
        const lowerInput = input.toLowerCase();
        
        // Check if user is saying goodbye
        if (lowerInput.includes('thank') || lowerInput.includes('thanks') || 
            lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
          setSessionData(prev => ({ ...prev, step: 'ended' }));
          addBotMessage("Thank you for using SmartGuide! It was great helping you find the perfect gadget. Click 'Start New Chat' anytime for more recommendations! 😊");
          break;
        }

        // Generate quick recommendation based on user input
        const quickData = handleQuickRequest(input);
        const recommendation = generateRecommendation(quickData);
        // Find best deal across multiple retailers
        const bestDeal = findBestDeal(recommendation.name, recommendation.price);
        
        let dealMessage = '';
        if (bestDeal.savings) {
          dealMessage = `\n\n💰 **BEST DEAL FOUND!**\n🏪 **${bestDeal.retailer}**: ${bestDeal.price} (Save ${bestDeal.savings}!)\n🛒 **Buy Now** 👉 ${bestDeal.url}`;
        } else {
          dealMessage = `\n\n🏪 **Best Price Found**: ${bestDeal.retailer} - ${bestDeal.price}\n🛒 **Buy Now** 👉 ${bestDeal.url}`;
        }
        
        let responseMessage = `Perfect! Based on your request, I recommend the **${recommendation.name}**\n\n${recommendation.description}\n\n**Key Specifications:**\n${recommendation.specs || 'Premium features and specifications'}${dealMessage}`;
        
        addBotMessage(responseMessage);
        
        setTimeout(() => {
          addBotMessage("Need another recommendation or want to modify this one? Just tell me what you're looking for!");
        }, 1500);
        break;

      case 'ended':
        addBotMessage("Our previous chat has ended. Please click 'Start New Chat' to begin a new conversation!");
        break;

      default:
        addBotMessage("I'm here to help you find the perfect gadget! Click 'Start New Chat' to begin.");
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setSessionData({
      language: null,
      gadgetType: null,
      usage: null,
      priority: null,
      experience: null,
      requirements: null,
      budget: null,
      brand: null,
      finalFeatures: null,
      step: 'greeting'
    });
    
    // Show greeting immediately after reset
    setTimeout(() => {
      setMessages([{ type: 'bot', text: translations.english.greeting, timestamp: new Date() }]);
    }, 300);
  };

  return (
    <div className="chat-background">
      <div className="chat-container">
        <div className="chat-header">
          <h2>🤖 SmartGuide</h2>
          <button onClick={startNewChat} className="new-chat-btn">
            Start New Chat
          </button>
        </div>
        
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div className="message-content">
                {message.text.split('\n').map((line, i) => (
                  <div key={i}>
                    {line.includes('👉') ? (
                      <span>
                        {line.split('👉')[0]}
                        <a href={line.split('👉')[1].trim()} target="_blank" rel="noopener noreferrer" className="buy-link">
                          👉 {line.split('👉')[1].trim()}
                        </a>
                      </span>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-content typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={sessionData.step === 'ended' ? "Chat ended - Click 'Start New Chat'" : "Type your message or use voice..."}
            className="message-input"
            disabled={sessionData.step === 'ended'}
          />
          <button 
            type="button" 
            onClick={startVoiceInput} 
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            disabled={sessionData.step === 'ended' || !recognition}
            title="AI Smart Input - Click and speak"
          >
            {isListening ? '🤖' : '✨'}
          </button>
          <button type="submit" className="send-btn" disabled={sessionData.step === 'ended'}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default SmartGuide;