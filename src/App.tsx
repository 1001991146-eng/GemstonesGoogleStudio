/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BookOpen, 
  Camera, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Cloud, 
  Code, 
  Copy, 
  Database, 
  FileText, 
  GraduationCap, 
  GitBranch,
  Image as ImageIcon, 
  Info, 
  Layers, 
  List, 
  Music, 
  Play, 
  PlayCircle,
  Library,
  Search, 
  Settings, 
  Smartphone 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 0, title: "נתונים", icon: <Database className="w-5 h-5" /> },
    { id: 1, title: "אימון", icon: <Layers className="w-5 h-5" /> },
    { id: 2, title: "דרייב", icon: <Cloud className="w-5 h-5" /> },
    { id: 3, title: "קוד", icon: <Code className="w-5 h-5" /> },
    { id: 4, title: "הגנה", icon: <GraduationCap className="w-5 h-5" /> },
  ];

  const pythonCode = `import tensorflow as tf
import numpy as np
import cv2
import os
import sys
import time
from google.colab import drive, files
from google.colab.patches import cv2_imshow
from IPython.display import display, Javascript, Audio, clear_output
from google.colab.output import eval_js
from base64 import b64decode

# 1. Mount Google Drive
drive.mount('/content/drive')

# 2. Paths Configuration
PATH = '/content/drive/MyDrive/Gemstone_Project/'
MODEL_PATH = os.path.join(PATH, 'saved_model')
LABELS_PATH = os.path.join(PATH, 'labels.txt')

# 3. Load Model using TFSMLayer
if os.path.exists(MODEL_PATH):
    sm_layer = tf.keras.layers.TFSMLayer(MODEL_PATH, call_endpoint='serving_default')
    model = tf.keras.Sequential([sm_layer])
    
    with open(LABELS_PATH, "r", encoding="utf-8") as f:
        class_names = []
        for line in f.readlines():
            parts = line.strip().split(' ')
            class_names.append(parts[1] if len(parts) > 1 else parts[0])
    print(f"✅ System Ready! Loaded categories: {class_names}")
else:
    print("❌ Error: Path not found! Ensure folder 'Gemstone_Project/saved_model' exists.")

def play_gemstone_theme_music(prediction):
    """השמעת שיר או נעימה המותאמת לאופי האבן"""
    music_library = {
        "Amethyst": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "Rose-Quartz": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "Turquoise": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
    
    music_url = music_library.get(prediction, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3")
    print(f"🎵 משמיע נעימת רקע תואמת עבור {prediction}...")
    display(Audio(url=music_url, autoplay=True))

def open_gemstone_info(prediction):
    """פונקציה לפתיחת מידע נוסף על האבן שזוהתה"""
    print(f"\\n✨ מידע נוסף על {prediction}:")
    
    if prediction == "Amethyst":
        print("💜 זוהה אמטיסט (Amethyst)! אבן המזל של חודש פברואר. סמל לשלווה וחיבור רוחני.")
        display(Javascript(f'window.open("https://www.gia.edu/amethyst", "_blank");'))
        
    elif prediction == "Rose-Quartz":
        print("🩷 זוהה רוז קוורץ (Rose-Quartz)! אבן האהבה ללא תנאי. מקושרת לריפוי רגשי ופתיחת הלב.")
        display(Javascript(f'window.open("https://www.gia.edu/rose-quartz", "_blank");'))
    
    elif prediction == "Turquoise":
        print("🩵 זוהה טורקיז (Turquoise)! אבן המזל של דצמבר. סמל להגנה, מזל טוב וחוכמה עתיקה.")
        display(Javascript(f'window.open("https://www.gia.edu/turquoise", "_blank");'))
        
    else:
        print(f"🔍 מחפש מידע על המזלות והמשמעות של {prediction}...")
        search_url = f"https://www.google.com/search?q={prediction}+stone+meaning+zodiac"
        display(Javascript(f'window.open("{search_url}", "_blank");'))

def predict_single(image_path, silent=False):
    img = cv2.imread(image_path)
    if img is None: return None, 0
    
    img_resized = cv2.resize(img, (224, 224))
    img_array = np.asarray(img_resized, dtype=np.float32).reshape(1, 224, 224, 3)
    img_array = (img_array / 127.5) - 1
    
    predictions_dict = model.predict(img_array, verbose=0)
    
    if isinstance(predictions_dict, dict):
        output_key = list(predictions_dict.keys())[0]
        prediction_probs = predictions_dict[output_key]
    else:
        prediction_probs = predictions_dict

    index = np.argmax(prediction_probs)
    conf = float(prediction_probs[0][index])
    
    if not silent:
        print(f"\\n--- Model Result: {class_names[index]} ({conf*100:.1f}%) ---")
        cv2_imshow(cv2.resize(img, (300, 220)))
        open_gemstone_info(class_names[index])
        play_gemstone_theme_music(class_names[index])
        
    return class_names[index], conf

def take_photo(filename='photo.jpg'):
  js = Javascript('''
    async function takePhoto() {
      const div = document.createElement('div');
      const video = document.createElement('video');
      video.style.display = 'block';
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      document.body.appendChild(div);
      div.appendChild(video);
      video.srcObject = stream;
      await video.play();
      const btn = document.createElement('button');
      btn.textContent = 'Capture Gemstone';
      btn.style.cssText = 'padding:10px; background:purple; color:white; margin:10px; border-radius:5px;';
      div.appendChild(btn);
      await new Promise((resolve) => btn.onclick = resolve);
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      stream.getVideoTracks()[0].stop(); div.remove();
      return canvas.toDataURL('image/jpeg');
    }
  ''')
  display(js)
  data = eval_js('takePhoto()')
  binary = b64decode(data.split(',')[1])
  with open(filename, 'wb') as f: f.write(binary)
  return filename

# Main Menu
print("\\n" + "="*30)
print(" GEMSTONE CLASSIFICATION MENU")
print("="*30)
print("1 - Live Camera")
print("2 - Single Upload")
print("3 - Interactive Accuracy Test (20% set)")
sys.stdout.flush()
choice = input("Select Option: ")

if choice == '1':
    photo = take_photo()
    predict_single(photo)
elif choice == '2':
    uploaded = files.upload()
    if uploaded:
        predict_single(list(uploaded.keys())[0])
elif choice == '3':
    print("\\nPlease upload your test images (20% set)...")
    uploaded = files.upload()
    correct = 0
    total = len(uploaded)
    
    for i, filename in enumerate(uploaded.keys()):
        clear_output(wait=True)
        print(f"\\033[1;34mIMAGE {i+1} / {total}: {filename}\\033[0m")
        img = cv2.imread(filename)
        cv2_imshow(cv2.resize(img, (300, 220)))
        time.sleep(0.5)
        print("\\n\\033[1;33m--- CATEGORIES ---\\033[0m")
        for idx, name in enumerate(class_names):
            print(f"[{idx}] {name}")
        print("\\n" * 2) 
        sys.stdout.flush()
        prompt = f"\\033[1;35m>>> ENTER CORRECT CATEGORY (0-{len(class_names)-1}) or Name:\\033[0m "
        user_input = input(prompt).strip()
        actual = ""
        if user_input.isdigit() and int(user_input) < len(class_names):
            actual = class_names[int(user_input)]
        else:
            for name in class_names:
                if user_input.lower() == name.lower():
                    actual = name
                    break
            if not actual: actual = user_input
        pred_label, conf = predict_single(filename, silent=True)
        print(f"\\nResult: AI said \\033[1m{pred_label}\\033[0m (Real: \\033[1m{actual}\\033[0m)")
        if pred_label.lower() == actual.lower():
            correct += 1
            print("🟢 MATCH!")
        else:
            print("🔴 MISMATCH")
        sys.stdout.flush()
        input("\\nPress Enter for next image...")
    clear_output()
    acc = (correct / total) * 100
    print(f"\\n" + "🏁"*15)
    print(f" TEST COMPLETE | Accuracy: {acc:.2f}%")
    print("🏁"*15)
else:
    print("Invalid Selection.")`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonCode);
    alert("הקוד הועתק ללוח!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
              <ImageIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">זיהוי אבני חן ותכשיטים</h1>
              <p className="text-slate-500 text-sm font-medium">מדריך פרויקט מלא: מהנתונים ועד להגנה</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentStep === step.id
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {step.icon}
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-3xl font-black text-indigo-900 mb-8 flex items-center gap-3">
                  <span className="bg-indigo-100 p-2 rounded-xl text-indigo-600">📂</span>
                  שלב 1: הכנת הנתונים (Dataset)
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold">
                      <Camera className="w-5 h-5" />
                      <h3>אפשרות א': צילום עצמי</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex gap-2">📸 <span>צלמו כל אבן לפחות 100 פעמים.</span></li>
                      <li className="flex gap-2">💡 <span>השתמשו בתאורה משתנה.</span></li>
                      <li className="flex gap-2">✋ <span>אל תצלמו רק על היד.</span></li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold">
                      <Search className="w-5 h-5" />
                      <h3>אפשרות ב': חיפוש ברשת</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex gap-2">🔍 <span>חפשו "[Gem Name] stone" בגוגל.</span></li>
                      <li className="flex gap-2">🌐 <span>היעזרו במאגרים כמו Kaggle.</span></li>
                      <li className="flex gap-2">⚠️ <span>ודאו תמונות נקיות ללא סימני מים.</span></li>
                    </ul>
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                      <h3>אפשרות ג': תכשיטים (מומלץ!)</h3>
                    </div>
                    <p className="text-xs font-bold text-indigo-800">זיהוי אבנים בתוך תכשיטים מוגמרים:</p>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex gap-2">💍 <span><strong>מגוון:</strong> חפשו טבעות, עגילים ושרשראות.</span></li>
                      <li className="flex gap-2">🔎 <span><strong>Close-up:</strong> התמקדו באבן שבתוך התכשיט.</span></li>
                      <li className="flex gap-2">✨ <span><strong>רקעים:</strong> חפשו את האבן בזהב ובכסף.</span></li>
                    </ul>
                  </div>
                </div>

                <div className="mt-10 bg-indigo-900 text-white p-8 rounded-3xl shadow-xl shadow-indigo-200">
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Play className="w-6 h-6" />
                    חוק ה-80/20
                  </h3>
                  <p className="text-indigo-100 leading-relaxed mb-6">
                    בין אם מדובר באבנים גולמיות או בתכשיטים יוקרתיים, הפרידו את הנתונים:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                      <span className="block font-black text-indigo-300 mb-1">🔹 80% אימון</span>
                      <span className="text-sm">התמונות שנעלה ל-Teachable Machine.</span>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                      <span className="block font-black text-indigo-300 mb-1">🔹 20% בדיקה</span>
                      <span className="text-sm">תמונות שהמודל לא יראה לעולם, אותן נשמור לבדיקה הסופית בקוד.</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-3xl font-black text-indigo-900 mb-8 flex items-center gap-3">
                  <span className="bg-indigo-100 p-2 rounded-xl text-indigo-600">🧠</span>
                  שלב 2: אימון ב-Teachable Machine
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      num: "1",
                      text: "צרו Classes באנגלית עבור כל סוג אבן (Amethyst, Rose-Quartz, Turquoise).",
                    },
                    {
                      num: "2",
                      text: "העלו את תמונות האימון (ה-80%) ולחצו על Train Model.",
                    },
                    {
                      num: "3",
                      text: "ייצוא המודל (SavedModel):",
                      sub: [
                        "בלשונית TensorFlow בחרו SavedModel.",
                        "הורידו את ה-ZIP וחלצו אותו במחשב.",
                      ],
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-start">
                      <div className="bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-black shadow-lg shadow-indigo-100">
                        {item.num}
                      </div>
                      <div className="pt-1.5">
                        <p className="font-bold text-slate-800 text-lg">{item.text}</p>
                        {item.sub && (
                          <ul className="mt-3 space-y-2 list-disc list-inside text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            {item.sub.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-3xl font-black text-indigo-900 mb-8 flex items-center gap-3">
                  <span className="bg-indigo-100 p-2 rounded-xl text-indigo-600">☁️</span>
                  שלב 3: סידור ב-Google Drive
                </h2>
                <p className="text-slate-600 mb-6">העלו את התיקייה שחילצתם לדרייב במבנה הבא:</p>
                <div className="bg-slate-900 text-indigo-300 p-8 rounded-3xl font-mono text-sm shadow-2xl relative overflow-hidden" dir="ltr">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2"><span className="text-white">My Drive</span> /</p>
                    <p className="flex items-center gap-2 ml-4">└── <span className="text-white font-bold">Gemstone_Project</span> /</p>
                    <p className="flex items-center gap-2 ml-12">├── <span className="text-indigo-400">saved_model</span> /</p>
                    <p className="flex items-center gap-2 ml-12">└── <span className="text-indigo-400">labels.txt</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black text-indigo-900 flex items-center gap-3">
                    <span className="bg-indigo-100 p-2 rounded-xl text-indigo-600">💻</span>
                    שלב 4: הקוד המלא
                  </h2>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    <Copy className="w-4 h-4" />
                    העתק קוד
                  </button>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  הקוד עודכן עם התאמות לקטגוריות: <span className="font-bold">Amethyst, Rose-Quartz ו-Turquoise</span>. 
                  <br />
                  <span className="text-amber-600 font-bold">שים לב:</span> שלב הבדיקה הסטטיסטית אינו כולל השמעת מוזיקה או פתיחת אתרים כדי לשמור על רצף הבדיקה.
                </p>

                <div className="bg-slate-900 rounded-3xl p-6 text-indigo-200 text-xs font-mono shadow-2xl max-h-[500px] overflow-y-auto custom-scrollbar" dir="ltr">
                  <pre>{pythonCode}</pre>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-3xl font-black text-indigo-900 mb-10 flex items-center gap-3">
                  <span className="bg-indigo-100 p-2 rounded-xl text-indigo-600">🎓</span>
                  שלב 5: מתכוננים להגנה על הפרויקט
                </h2>

                {/* Collections Section */}
                <div className="space-y-8 mb-16">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Database className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-800">אוספים ומבני נתונים (Collections)</h3>
                  </div>
                  <p className="text-slate-600">במהלך כתיבת הקוד, השתמשנו בסוגים שונים של "קופסאות" לאחסון מידע:</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "📖 מילון (Dictionary)",
                        code: 'music_library = { "Amethyst": "url1", ... }',
                        what: "אוסף של זוגות \"מפתח\" ו\"ערך\".",
                        why: "השלמה מושלמת לשמירת נתונים שקשורים אחד לשני. מאפשר שליפה מהירה בשבריר שנייה.",
                      },
                      {
                        title: "📜 רשימה (List)",
                        code: 'class_names = ["Amethyst", "Turquoise", ...]',
                        what: "סדרה מסודרת של איברים שיש להם מיקום (אינדקס).",
                        why: "הפיכת המספר (אינדקס) שה-AI מחזיר חזרה למילה שאנחנו מבינים.",
                      },
                      {
                        title: "📍 משתנה פשוט (Variable)",
                        code: "correct = 0 | acc = 85.5",
                        what: "תא בזיכרון ששומר ערך אחד בכל פעם.",
                        why: "משמש כ\"מונים\" (Counters) שמתעדכנים או לשמירת נתיבים קבועים.",
                      },
                      {
                        title: "🖼️ מערך נומפי (NumPy Array)",
                        code: "img_array = np.asarray(img_resized)",
                        what: "מערך רב-מימדי המיועד לחישובים מתמטיים מהירים.",
                        why: "תמונה היא מטריצה של מספרים. NumPy מאפשר פעולות על כל הפיקסלים בבת אחת.",
                      },
                    ].map((col, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h4 className="font-black text-indigo-900">{col.title}</h4>
                        <div className="bg-slate-900 text-indigo-300 p-3 rounded-xl font-mono text-[10px]" dir="ltr">
                          {col.code}
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-bold text-slate-700">מה זה?</span> {col.what}</p>
                          <p><span className="font-bold text-slate-700">למה?</span> {col.why}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Libraries Section */}
                <div className="space-y-8 mb-16">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Library className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-800">ספריות מיובאות (Imported Libraries)</h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "tensorflow", desc: "הספרייה המרכזית לבנייה והרצה של מודלים של בינה מלאכותית." },
                      { name: "numpy", desc: "משמשת לביצוע חישובים מתמטיים מורכבים על 'מערכים' (רשימות של מספרים)." },
                      { name: "cv2 (OpenCV)", desc: "ספרייה חזקה לעיבוד תמונה - קריאה, שינוי גודל והצגת תמונות." },
                      { name: "google.colab", desc: "כלים מיוחדים שמאפשרים לקוד שלנו לתקשר עם הדפדפן והמצלמה." },
                      { name: "IPython.display", desc: "מאפשרת להציג בתוך המחברת אלמנטים כמו מוזיקה, וידאו וקוד אינטרנט." }
                    ].map((lib, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <code className="text-indigo-600 font-bold block mb-1">{lib.name}</code>
                        <p className="text-xs text-slate-600 leading-relaxed">{lib.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Functions Section */}
                <div className="space-y-8 mb-16">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Code className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-800">ניתוח פעולות הקוד (Functions)</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      {
                        title: "1. הפעולה open_gemstone_info",
                        code: `def open_gemstone_info(prediction): 
    print(f"\\n✨ מידע נוסף על {prediction}:") 
    if prediction == "Amethyst": 
        print("💜 זוהה אמטיסט (Amethyst)! אבן המזל של חודש פברואר. סמל לשלווה וחיבור רוחני.")       
        display(Javascript(f'window.open("https://www.gia.edu/amethyst", "_blank");')) 
    elif prediction == "Rose-Quartz": 
        print("🩷 זוהה רוז קוורץ (Rose-Quartz)! אבן האהבה ללא תנאי. מקושרת לריפוי רגשי ופתיחת הלב.") 
        display(Javascript(f'window.open("https://www.gia.edu/rose-quartz", "_blank");')) 
    elif prediction == "Turquoise": 
        print("🩵 זוהה טורקיז (Turquoise)! אבן המזל של דצמבר. סמל להגנה, מזל טוב וחוכמה עתיקה.") 
        display(Javascript(f'window.open("https://www.gia.edu/turquoise", "_blank");')) 
    else: 
        print(f"🔍 מחפש מידע על המזלות והמשמעות של {prediction}...")    
        search_url = f"https://www.google.com/search?q={prediction}+stone+meaning+zodiac" 
        display(Javascript(f'window.open("{search_url}", "_blank");'))`,
                        goal: "להרחיב את חווית המשתמש מעבר לסתם \"שם האבן\".",
                        how: "הפעולה מקבלת את שם האבן שהמחשב זיהה. היא משתמשת ב'משפטי תנאי' (if ו-elif) כדי לבדוק איזו אבן זו. לכל אבן היא מדפיסה הסבר קצר ומשתמשת בפקודת קוד מיוחדת (Javascript) שאומרת לדפדפן: 'פתח חלון חדש עם האתר של GIA'. אם היא לא מכירה את האבן, היא פשוט פותחת חיפוש בגוגל.",
                      },
                      {
                        title: "2. הפעולה play_gemstone_theme_music",
                        code: `def play_gemstone_theme_music(prediction): 
    music_library = { 
        "Amethyst": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
        "Rose-Quartz": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 
        "Turquoise": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" 
    } 
    music_url = music_library.get(prediction, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3") 
    print(f"🎵 משמיע נעימת רקע תואמת עבור {prediction}...") 
    display(Audio(url=music_url, autoplay=True))`,
                        goal: "הוספת חיווי קולי/מוזיקלי שמתאים לאופי של האבן.",
                        how: "הפעולה משתמשת ב'מילון' (music_library) שבו לכל שם של אבן יש כתובת של שיר. היא 'שולפת' את השיר המתאים לפי שם האבן שזוהתה. בסוף היא משתמשת בפקודה display(Audio) שמפעילה את הנגן של גוגל קולאב ומשמיעה לנו את המוזיקה באופן אוטומטי.",
                      },
                      {
                        title: "3. הפעולה predict_single",
                        code: `def predict_single(image_path, silent=False): 
    img = cv2.imread(image_path) 
    if img is None: return None, 0 
    img_resized = cv2.resize(img, (224, 224)) 
    img_array = np.asarray(img_resized, dtype=np.float32).reshape(1, 224, 224, 3) 
    img_array = (img_array / 127.5) - 1 
    predictions_dict = model.predict(img_array, verbose=0) 
    if isinstance(predictions_dict, dict): 
        output_key = list(predictions_dict.keys())[0] 
        prediction_probs = predictions_dict[output_key] 
    else: 
        prediction_probs = predictions_dict 
    index = np.argmax(prediction_probs) 
    conf = float(prediction_probs[0][index]) 
    if not silent: 
        print(f"\\n--- Model Result: {class_names[index]} ({conf*100:.1f}%) ---") 
        cv2_imshow(cv2.resize(img, (300, 220))) 
        open_gemstone_info(class_names[index]) 
        play_gemstone_theme_music(class_names[index]) 
    return class_names[index], conf`,
                        goal: "\"המוח\" שמקבל תמונה ומחזיר ניחוש.",
                        how: "זו הפעולה הכי חשובה! היא לוקחת את התמונה, משנה לה את הגודל לריבוע קטן (224x224) כי ככה המודל למד, והופכת את הצבעים למספרים שהמחשב מבין. אז היא שואלת את המודל (model.predict): 'מה אתה רואה?'. המודל מחזיר רשימת הסתברויות, והפעולה בוחרת את ההסתברות הכי גבוהה (argmax).",
                      },
                      {
                        title: "4. הפעולה take_photo",
                        code: `def take_photo(filename='photo.jpg'): 
    js = Javascript(''' 
        async function takePhoto() { 
            const div = document.createElement('div'); 
            const video = document.createElement('video'); 
            video.style.display = 'block'; 
            const stream = await navigator.mediaDevices.getUserMedia({video: true}); 
            document.body.appendChild(div); 
            div.appendChild(video); 
            video.srcObject = stream; 
            await video.play(); 
            const btn = document.createElement('button'); 
            btn.textContent = 'Capture Gemstone'; 
            btn.style.cssText = 'padding:10px; background:purple; color:white; margin:10px; border-radius:5px;'; 
            div.appendChild(btn); 
            await new Promise((resolve) => btn.onclick = resolve); 
            const canvas = document.createElement('canvas'); 
            canvas.width = video.videoWidth; canvas.height = video.videoHeight; 
            canvas.getContext('2d').drawImage(video, 0, 0); 
            stream.getVideoTracks()[0].stop(); div.remove(); 
            return canvas.toDataURL('image/jpeg'); 
        } 
    ''') 
    display(js) 
    data = eval_js('takePhoto()') 
    binary = b64decode(data.split(',')[1]) 
    with open(filename, 'wb') as f: f.write(binary) 
    return filename`,
                        goal: "גישה למצלמת הלפטופ בתוך סביבת ה-Colab.",
                        how: "מאחר והקוד רץ במחשבים של גוגל (בענן), הוא לא יכול לראות את המצלמה שלנו. לכן, הפעולה הזו משתמשת ב'שליח' (קוד Javascript) שרץ אצלנו בדפדפן. השליח מבקש רשות להשתמש במצלמה, מראה לנו וידאו, וכשאנחנו לוחצים על הכפתור הוא 'מצלם' פריים אחד, הופך אותו לקובץ ושולח אותו חזרה לקוד ה-Python שלנו.",
                      },
                    ].map((fn, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h4 className="font-black text-indigo-900">{fn.title}</h4>
                        <pre className="bg-slate-900 text-indigo-300 p-4 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre" dir="ltr">
                          {fn.code}
                        </pre>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-bold text-slate-700">המטרה:</span> {fn.goal}</p>
                          <p><span className="font-bold text-slate-700">איך?</span> {fn.how}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Program Section */}
                <div className="space-y-8 mb-16">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    <PlayCircle className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-800">התכנית הראשית (Main Logic)</h3>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <p className="text-sm text-slate-600">
                      זהו החלק שמחבר את כל ה"לבנים" שבנינו יחד. הוא מפעיל את המצלמה, שולח את התמונה לזיהוי ומציג את התוצאות.
                    </p>
                    <pre className="bg-slate-900 text-indigo-300 p-4 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre" dir="ltr">
{`# 1. טעינת המודל והשמות
model = load_model("keras_model.h5", compile=False)
class_names = [line.strip() for line in open("labels.txt", "r").readlines()]

# 2. צילום תמונה מהמצלמה
image_path = take_photo()

# 3. זיהוי האבן והפעלת כל ה"קסמים"
prediction, confidence = predict_single(image_path)`}
                    </pre>
                    <div className="bg-indigo-50 p-4 rounded-xl text-xs text-indigo-900 leading-relaxed">
                      <span className="font-bold block mb-1">מה קורה כאן?</span>
                      קודם כל אנחנו טוענים את ה"זיכרון" של המחשב (המודל). לאחר מכן אנחנו קוראים לפעולה שפתחנו שמצלמת אותנו. בסוף, אנחנו שולחים את הנתיב של התמונה לפעולת הזיהוי, שהיא כבר דואגת להראות לנו את התוצאה, להשמיע מוזיקה ולפתוח את האתר המתאים.
                    </div>
                  </div>
                </div>

                {/* Input Mode Logic Section */}
                <div className="space-y-8 mb-16">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    <GitBranch className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-800">ניתוח לוגיקת בחירת מצב (Mode Selection)</h3>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      כאן אנחנו משתמשים ב<b>תנאים</b> כדי להחליט מאיפה יגיעו הנתונים שלנו. הקוד בודק את ה<b>מחרוזת</b> שנמצאת במשתנה <code>mode</code> ופועל בהתאם.
                    </p>
                    <pre className="bg-slate-900 text-indigo-300 p-4 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre" dir="ltr">
{`# הגדרת מצב העבודה (מחרוזת - String)
mode = "camera" 

if mode == "camera":
    # מצב מצלמה: קריאה לפעולה (Function)
    path = take_photo()
    predict_single(path)

elif mode == "gallery":
    # מצב גלריה: מעבר על רשימה (List) בעזרת לולאה (Loop)
    images = ["ruby.jpg", "emerald.png", "diamond.webp"]
    for img_path in images:
        predict_single(img_path)

elif mode == "test":
    # מצב בדיקה: שימוש במילון (Dictionary) להשוואת תוצאות
    test_data = {"test1.jpg": "Amethyst", "test2.jpg": "Turquoise"}
    for path, expected in test_data.items():
        result, conf = predict_single(path, silent=True)
        if result == expected: # תנאי (Condition)
            print(f"✅ הצלחה! זוהה {result}")`}
                    </pre>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-indigo-50 p-4 rounded-xl text-xs text-indigo-900">
                        <span className="font-bold block mb-1 underline">מושגים שבהם השתמשנו:</span>
                        <ul className="list-disc list-inside space-y-1">
                          <li><b>מחרוזת (String):</b> המשתנה <code>mode</code> שומר טקסט שמגדיר את המצב.</li>
                          <li><b>תנאים (Conditions):</b> ה-<code>if</code> וה-<code>elif</code> מאפשרים למחשב "לבחור" מסלול.</li>
                          <li><b>פעולות (Functions):</b> קריאה ל-<code>take_photo()</code> לביצוע משימה מוגדרת.</li>
                        </ul>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-xl text-xs text-indigo-900">
                        <span className="font-bold block mb-1 underline">מבני נתונים ותהליכים:</span>
                        <ul className="list-disc list-inside space-y-1">
                          <li><b>רשימה (List):</b> אוסף של נתיבי תמונות בגלריה (כמו <b>תור</b> של משימות).</li>
                          <li><b>לולאות (Loops):</b> ה-<code>for</code> עובר על כל פריט ברשימה אחד אחרי השני.</li>
                          <li><b>מילון (Dictionary):</b> מבנה ששומר "מפתח" (תמונה) מול "ערך" (השם האמיתי שלה).</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logic Section */}
                <div className="space-y-8 mb-16">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Settings className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-800">הסבר הלוגיקה הכללית</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-3">
                      <h4 className="font-black text-indigo-900">איך המחשב "רואה"?</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        המחשב הופך את התמונה לטבלה ענקית של מספרים. בקוד אנחנו מבצעים <span className="font-bold">"נרמול"</span> - הופכים את המספרים לטווח שבין 1- ל-1 כדי שה-AI יוכל לעבד אותם במהירות.
                      </p>
                    </div>
                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-3">
                      <h4 className="font-black text-indigo-900">שינוי גודל (Resizing)</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        המודל יודע לעבוד רק עם תמונות קטנות (224x224 פיקסלים). לכן, הקוד קודם כל "מכווץ" כל תמונה לגודל הזה לפני שהוא מנסה לנחש מה בתמונה.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Menu Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    <List className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-800">הסבר התוכנית הראשית (Main Menu)</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { num: "1", title: "אופציה 1 - מצלמה חיה", text: "מפעילה את take_photo, שומרת תמונה זמנית ושולחת אותה מיד ל-predict_single." },
                      { num: "2", title: "אופציה 2 - העלאת קובץ", text: "משתמשת בספריית files.upload של גוגל ומנתחת את הקובץ שנבחר." },
                      { num: "3", title: "אופציה 3 - מבחן הדיוק", text: "הלוגיקה הכי מורכבת. עוברת על תמונות, משווה את ניחוש ה-AI לתשובה הנכונה, צוברת נקודות ומחשבת אחוז הצלחה סופי." },
                    ].map((opt, idx) => (
                      <div key={idx} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="bg-indigo-600 text-white w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm">
                          {opt.num}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{opt.title}</p>
                          <p className="text-sm text-slate-600">{opt.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 bg-indigo-900 text-white p-8 rounded-3xl shadow-xl">
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6" />
                    טיפ להצגה מוצלחת
                  </h3>
                  <p className="text-indigo-100 italic leading-relaxed">
                    "השתמשנו בפונקציות כדי שהקוד יהיה מודולרי - כלומר, כל חלק אחראי על משימה אחת (צילום, זיהוי, מידע), מה שהופך אותו לקל לקריאה ולתיקון שגיאות."
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              currentStep === 0
                ? "text-slate-300 cursor-not-allowed"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
            הקודם
          </button>
          
          <div className="flex gap-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentStep === step.id ? "bg-indigo-600 w-6" : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStep === steps.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              currentStep === steps.length - 1
                ? "text-slate-300 cursor-not-allowed"
                : "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
            }`}
          >
            הבא
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 px-6 mt-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-xl">
              <ImageIcon className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-slate-400 text-sm font-medium">פרויקט זיהוי אבני חן ותכשיטים 2026</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Play className="w-3 h-3" />
              <span>AI Powered</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Smartphone className="w-3 h-3" />
              <span>Mobile Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
