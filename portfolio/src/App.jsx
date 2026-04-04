import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence, useScroll, useSpring } from "framer-motion";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  SWAP THESE BEFORE DEPLOYMENT
// ─────────────────────────────────────────────────────────────────────────────
const PHOTO_URL   = "/assets/photo.jpg";      // put your photo in /public/assets/
const RESUME_URL  = "/assets/resume.pdf";     // put your resume in /public/assets/

// ─── CERTIFICATIONS DATA ─────────────────────────────────────────────────────
const certifications = [
  { id:1, name:"Data Analyst",               issuer:"NoviTech", year:"2024", icon:"📊", color:"#d97706", link:"https://drive.google.com/your-link-1" },
  { id:2, name:"Artificial Intelligence",    issuer:"NoviTech", year:"2024", icon:"🤖", color:"#b45309", link:"https://drive.google.com/your-link-2" },
  { id:3, name:"Machine Learning",           issuer:"NoviTech", year:"2024", icon:"🧠", color:"#92400e", link:"https://drive.google.com/your-link-3" },
  { id:4, name:"Full Stack Developer",       issuer:"NoviTech", year:"2024", icon:"💻", color:"#78350f", link:"https://drive.google.com/your-link-4" },
  { id:5, name:"Data Structures",            issuer:"Coursera", year:"2023", icon:"🗂️", color:"#d97706", link:"https://drive.google.com/your-link-5" },
  { id:6, name:"Foundation of Java",         issuer:"Infosys",  year:"2023", icon:"☕", color:"#b45309", link:"https://drive.google.com/your-link-6" },
  { id:7, name:"Basics of Python",           issuer:"GUVI",     year:"2023", icon:"🐍", color:"#92400e", link:"https://drive.google.com/your-link-7" },
  { id:8, name:"HCI Design & Implementation",issuer:"NPTEL",    year:"2023", icon:"🎨", color:"#78350f", link:"https://drive.google.com/your-link-8" },
];

// ─── PROJECTS DATA ───────────────────────────────────────────────────────────
const projects = [
  {
    id:1, name:"AI Voice Agent Platform", tag:"AI Agents", year:"2025", featured:true,
    description:"End-to-end agentic AI voice system for real-world call automation — cold-calling, hospital appointment booking, and delivery coordination with full conversation context and SOP compliance.",
    details:"Pipecat handles the orchestration layer, LiveKit provides WebRTC media transport, and Deepgram powers real-time transcription under 300ms. Each agent is domain-specialized: the hospital booking agent integrates with calendar APIs while the cold-calling agent routes objections via LangChain chains. Clerk manages auth and session state across multi-agent flows.",
    stack:["Python","LangChain","Deepgram","Pipecat","LiveKit","FastAPI","Clerk"],
    metrics:["3 distinct call-type agents","<300ms STT/TTS latency","RAG-backed SOP guidance","Clerk session management"],
    challenges:"Hardest part was maintaining conversation state across hand-offs between agents without losing context. Solved with a shared Redis session store and LangChain memory buffers per call session.",
    demo:"",
    link:"https://github.com/smily-sadha",
  },
  {
    id:2, name:"RAG System for Hospital SOPs", tag:"LLM / RAG", year:"2025", featured:true,
    description:"Production-grade Retrieval-Augmented Generation system for hospital Standard Operating Procedures. Full document ingestion, semantic chunking, vector storage and multi-turn retrieval with source citation.",
    details:"Recursive character text splitting with 512-token chunks and 64-token overlap. Embeddings via OpenAI ada-002 stored in FAISS with cosine similarity retrieval. MongoDB handles multi-turn conversation history. FastAPI layer with Clerk authentication. Responses include source document references for compliance traceability.",
    stack:["Python","LangChain","FAISS","OpenAI Embeddings","MongoDB","FastAPI","Clerk"],
    metrics:["Full ingestion-to-retrieval pipeline","Semantic chunking with overlap","Source-cited responses","Multi-turn conversation memory"],
    challenges:"Chunking strategy was critical — too small lost context, too large killed retrieval precision. 512/64 overlap hit the sweet spot after testing. Also needed to handle PDF tables and formatted SOPs which break naive text splitters.",
    demo:"",
    link:"https://github.com/smily-sadha",
  },
  {
    id:3, name:"Online Voting with Face Recognition", tag:"Computer Vision", year:"2024", featured:false,
    description:"Biometric-secured online voting platform using real-time facial recognition for voter identity verification. Prevents duplicate voting and impersonation through CV at the authentication layer.",
    details:"Face detection via SSD with ResNet-10 backbone. Each verified face is encoded into a 128-d embedding using dlib's face_recognition. Embeddings are hashed and stored in MongoDB — any match within 0.6 Euclidean distance threshold is rejected as a duplicate. Full audit log captures timestamp, voter ID, and confidence score per authentication attempt.",
    stack:["Python","OpenCV","SSD","dlib","MongoDB","Flask"],
    metrics:["94%+ face detection accuracy","Duplicate vote prevention","Real-time webcam auth","Full audit log"],
    challenges:"Lighting variation across different webcams caused false rejections. Solved with CLAHE histogram equalization as a preprocessing step before embedding extraction — reduced false reject rate from 18% to under 4%.",
    demo:"",
    link:"https://github.com/smily-sadha",
  },
  {
    id:4, name:"Plant Leaf Disease Detection", tag:"Deep Learning", year:"2024", featured:false,
    description:"CNN-based agricultural image classification for early plant disease detection. Trained on multi-class leaf datasets with data augmentation, deployed as a Flask web app with confidence scoring.",
    details:"Custom CNN with 4 Conv-Pool blocks (32→64→128→256 filters) followed by two dense layers and softmax output. Trained with Adam optimizer, categorical cross-entropy, and early stopping on val loss. Data augmentation: rotation ±30°, horizontal/vertical flip, zoom 0.2, shear 0.2. Flask app accepts JPG/PNG, preprocesses to 224×224, returns top-3 class probabilities.",
    stack:["Python","TensorFlow","Keras","OpenCV","Flask","NumPy","Matplotlib"],
    metrics:["92% validation accuracy","15-class classification","Real-time Flask inference","Top-3 confidence output"],
    challenges:"Class imbalance in the dataset — some disease classes had 5× more samples. Used class_weight parameter in model.fit() and oversampled minority classes with augmentation to balance the training distribution.",
    demo:"",
    link:"https://github.com/smily-sadha",
  },
  {
    id:5, name:"Online Attendance System", tag:"Computer Vision", year:"2023", featured:false,
    description:"Automated classroom attendance via live webcam and CNN-based facial feature extraction. Identifies registered students in real-time and auto-marks attendance — eliminating manual roll calls.",
    details:"Pipeline: Haar cascade detection → CNN feature extraction → SVM (RBF kernel) classification. CLAHE equalization handles poor lighting. Student face datasets collected under 3 lighting conditions per person during enrollment. Attendance records written to SQLite with timestamp, student ID, and SVM confidence score. Threshold set at 0.75 confidence to reduce false acceptances.",
    stack:["Python","OpenCV","CNN","SVM","scikit-learn","SQLite"],
    metrics:["96% test accuracy","Live webcam pipeline","CLAHE lighting robustness","Auto-timestamped records"],
    challenges:"Real classroom lighting is unpredictable — overhead fluorescents, window glare, shadows. CLAHE alone wasn't enough. Added gamma correction and bilateral filtering to the preprocessing chain which brought accuracy up from 88% to 96% under varied conditions.",
    demo:"",
    link:"https://github.com/smily-sadha",
  },
  {
    id:6, name:"Online Job Application Portal", tag:"Full-Stack", year:"2023", featured:false,
    description:"Full-stack job portal with role-based access — candidates apply and track applications, employers post and review. RESTful API, JWT auth, and responsive React UI.",
    details:"Backend: Express.js REST API with 12+ endpoints, JWT middleware, bcrypt password hashing, Mongoose ODM for MongoDB. Frontend: React with component-level state, Axios for API calls, responsive Tailwind layout. Application status workflow: Applied → Under Review → Interview → Offer/Reject. Indexed MongoDB queries for job search by role, location, and salary range.",
    stack:["React","Node.js","Express","MongoDB","JWT","Tailwind CSS","Axios"],
    metrics:["Role-based auth (candidate + employer)","12+ REST endpoints","Full application status workflow","Mobile-responsive UI"],
    challenges:"Handling concurrent applications to the same job from multiple candidates without race conditions. Used MongoDB transactions and optimistic locking on the job document to ensure application counts stayed consistent under load.",
    demo:"",
    link:"https://github.com/smily-sadha",
  },
];

const skills = {
  "AI & Agents":["LangChain","RAG","Agentic Workflows","Prompt Engineering","Deepgram","Pipecat","LiveKit"],
  "Machine Learning":["scikit-learn","Feature Engineering","Model Validation","SVM","CNN","GAN"],
  "Deep Learning":["PyTorch","TensorFlow/Keras","OpenCV","Single Shot Detection"],
  "Data Analytics":["NumPy","Pandas","Matplotlib","Seaborn","Power BI","Tableau","Excel"],
  "Web Development":["React","Node.js","Express","HTML","CSS"],
  "Databases & Languages":["MongoDB Atlas","MySQL","Python","Java"],
};

const experience = [{
  company:"Spacemarvel.ai", role:"AI Engineer Intern", period:"July 2025 – Present", location:"Remote",
  bullets:[
    "Built agentic AI voice agents for real-world call workflows — cold-calling automation, hospital appointment booking, and delivery coordination.",
    "Developed a Retrieval-Augmented Generation (RAG) system for hospital SOP assistance using LangChain — full document ingestion, chunking, embedding, and retrieval.",
    "Integrated real-time speech processing pipeline using Deepgram, Pipecat, and LiveKit for low-latency voice interaction.",
    "Implemented authentication and session management using Clerk across multi-agent workflows.",
  ],
}];

const achievements = [
  { title:"UiPath Hackathon", sub:"3rd Place", desc:"Secured 3rd place at Sona College of Technology's UiPath RPA Hackathon, competing among teams building automation workflows.", year:"2024" },
  { title:"NoviTech Certifications", sub:"Data Analyst · AI · ML · Full Stack", desc:"Completed four professional certification tracks: Data Analyst, Artificial Intelligence, Machine Learning, and Full Stack Developer.", year:"2024" },
  { title:"NPTEL", sub:"Design & Implementation of HCI", desc:"Completed NPTEL certified course on Human Computer Interface design and implementation.", year:"2023" },
  { title:"Intercollegiate Football", sub:"1st Place", desc:"Secured 1st place in Football at Sona College of Technology's intercollegiate sports event.", year:"2022" },
];

const CODE_SNIPPETS = [
  "model.fit(X_train,y_train)","rag.query(user_input)","agent.run(workflow)",
  "embeddings=embed(chunks)","response=llm.chat(prompt)","cv2.detectFaces(frame)",
  "torch.cuda.is_available()","chain=LLMChain(llm,prompt)","db.vectors.search(query)",
  "pipecat.stream(audio)","svm.predict(features)","deepgram.transcribe(audio)",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:{ opacity:0, y:28 },
  visible:(i=0)=>({ opacity:1, y:0, transition:{ duration:0.55, delay:i*0.08, ease:[0.22,1,0.36,1] } }),
};
const Tag = ({ children }) => (
  <span style={{ display:"inline-block", fontSize:"0.68rem", fontFamily:"monospace", letterSpacing:"0.15em", textTransform:"uppercase", padding:"2px 8px", border:"1px solid rgba(180,83,9,0.5)", color:"rgba(245,158,11,0.85)", borderRadius:"2px" }}>{children}</span>
);
const Pill = ({ children }) => (
  <span style={{ display:"inline-block", fontSize:"0.68rem", fontFamily:"monospace", padding:"2px 8px", background:"rgba(39,39,42,0.8)", color:"#d4d4d8", borderRadius:"3px" }}>{children}</span>
);
function useScrollReveal(threshold=0.1) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once:true, amount:threshold });
  return [ref, isInView];
}
function SplitHeading({ text, isInView }) {
  return (
    <span style={{ display:"inline-flex", overflow:"hidden" }}>
      {text.split("").map((ch,i)=>(
        <motion.span key={i} initial={{ y:"110%", opacity:0 }}
          animate={isInView?{ y:"0%", opacity:1 }:{ y:"110%", opacity:0 }}
          transition={{ duration:0.42, delay:i*0.032, ease:[0.22,1,0.36,1] }}
          style={{ display:"inline-block", color:"#71717a", fontSize:"0.68rem", fontFamily:"monospace", letterSpacing:"0.25em", textTransform:"uppercase" }}>
          {ch===" "?"\u00a0":ch}
        </motion.span>
      ))}
    </span>
  );
}
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness:100, damping:30, restDelta:0.001 });
  return <motion.div style={{ position:"fixed", top:0, left:0, right:0, height:"2px", zIndex:999, background:"linear-gradient(90deg,#92400e,#d97706,#fbbf24,#d97706)", transformOrigin:"0%", scaleX }} />;
}
function CursorGlow() {
  // Outer glow blob — large, very soft, lags behind
  const blobRef = useRef(null);
  // Inner filled dot — small, snappy, sits right on cursor
  const dotRef = useRef(null);

  const pos = useRef({ x:-300, y:-300 });
  const blob = useRef({ x:-300, y:-300 });

  useEffect(()=>{
    const onMove = e => { pos.current = { x:e.clientX, y:e.clientY }; };
    window.addEventListener("mousemove", onMove);

    // Hide default cursor on the whole page
    document.body.style.cursor = "none";

    let id;
    const tick = () => {
      // Blob follows with lag (lerp 0.08 = slow and smooth)
      blob.current.x += (pos.current.x - blob.current.x) * 0.08;
      blob.current.y += (pos.current.y - blob.current.y) * 0.08;

      if (blobRef.current) {
        blobRef.current.style.transform = `translate(${blob.current.x - 200}px, ${blob.current.y - 200}px)`;
      }
      // Dot snaps directly to cursor (no lag)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 10}px, ${pos.current.y - 10}px)`;
      }
      id = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "auto";
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <>
      {/* Large soft amber glow blob — lags behind cursor */}
      <div ref={blobRef} style={{
        position:"fixed", top:0, left:0, width:400, height:400,
        borderRadius:"50%",
        background:"radial-gradient(circle, rgba(217,119,6,0.13) 0%, rgba(180,83,9,0.06) 40%, transparent 70%)",
        pointerEvents:"none", zIndex:9997, willChange:"transform",
      }} />

      {/* Small filled amber circle — snaps to exact cursor position */}
      <div ref={dotRef} style={{
        position:"fixed", top:0, left:0, width:20, height:20,
        borderRadius:"50%",
        background:"rgba(217,119,6,0.85)",
        boxShadow:"0 0 12px rgba(217,119,6,0.6), 0 0 24px rgba(217,119,6,0.25)",
        pointerEvents:"none", zIndex:9999, willChange:"transform",
        mixBlendMode:"screen",
      }} />
    </>
  );
}
function TiltCard({ children, style, onMouseEnter, onMouseLeave: onMouseLeaveProp }) {
  const ref = useRef(null);
  const onMove = useCallback(e=>{ const el=ref.current; if(!el)return; const rect=el.getBoundingClientRect(); const x=(e.clientX-rect.left)/rect.width-0.5,y=(e.clientY-rect.top)/rect.height-0.5; el.style.transform=`perspective(900px) rotateY(${x*12}deg) rotateX(${-y*10}deg) scale(1.02)`; },[]);
  const onLeave = useCallback(e=>{ if(ref.current)ref.current.style.transform="perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)"; if(onMouseLeaveProp)onMouseLeaveProp(e); },[onMouseLeaveProp]);
  const onEnter = useCallback(e=>{ if(onMouseEnter)onMouseEnter(e); },[onMouseEnter]);
  return <div ref={ref} style={{ ...style, transition:"transform 0.18s ease, border-color 0.25s, background 0.25s, box-shadow 0.25s", willChange:"transform" }} onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}>{children}</div>;
}
function useCounter(targetStr, inView, duration=1800) {
  const [val,setVal]=useState(0);
  useEffect(()=>{
    if(!inView)return;
    const num=parseInt((targetStr+"").replace(/\D/g,""))||0;
    let start=null;
    const step=ts=>{ if(!start)start=ts; const p=Math.min((ts-start)/duration,1); setVal(Math.floor((1-Math.pow(1-p,3))*num)); if(p<1)requestAnimationFrame(step); else setVal(num); };
    requestAnimationFrame(step);
  },[inView]);
  return val;
}

// ══════════════════════════════════════════════════════
// ✦ PHOTO COMPONENT — Hero, Option A
// ══════════════════════════════════════════════════════
function HeroPhoto() {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, scale:0.85 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ duration:0.8, delay:0.2, ease:[0.22,1,0.36,1] }}
      style={{ position:"relative", flexShrink:0 }}>

      {/* Outer pulse rings */}
      <motion.div animate={{ scale:[1,1.06,1], opacity:[0.3,0.08,0.3] }} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
        style={{ position:"absolute", inset:-14, borderRadius:"50%", border:"1px solid rgba(217,119,6,0.35)", pointerEvents:"none" }} />
      <motion.div animate={{ scale:[1,1.10,1], opacity:[0.15,0.04,0.15] }} transition={{ duration:3, repeat:Infinity, ease:"easeInOut", delay:0.8 }}
        style={{ position:"absolute", inset:-26, borderRadius:"50%", border:"1px solid rgba(217,119,6,0.2)", pointerEvents:"none" }} />

      {/* Photo circle */}
      <div style={{
        width:160, height:160, borderRadius:"50%", overflow:"hidden",
        border:"2px solid rgba(217,119,6,0.5)",
        boxShadow:"0 0 40px rgba(217,119,6,0.12), 0 8px 32px rgba(0,0,0,0.6)",
        background:"#1c1008", position:"relative",
      }}>
        {/* Placeholder shown until image loads */}
        {!loaded && (
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(217,119,6,0.18)" }} />
            <div style={{ width:80, height:36, borderRadius:"50% 50% 0 0", background:"rgba(217,119,6,0.12)" }} />
          </div>
        )}
        {/* ⚠ Replace PHOTO_URL at top of file with your image path */}
        <img src={PHOTO_URL} alt="Sadhasivam Perichi"
          onLoad={()=>setLoaded(true)}
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", opacity:loaded?1:0, transition:"opacity 0.4s" }} />
      </div>

      {/* Stat chips below photo */}
      <div style={{ display:"flex", gap:"0.5rem", marginTop:"0.85rem", justifyContent:"center" }}>
        {[["CGPA","7.5"],["Resume","↓"],["GitHub","↗"]].map(([k,v],i)=>(
          k==="Resume" ? (
            <a key={k} href={RESUME_URL} download
              style={{ border:"1px solid rgba(217,119,6,0.5)", padding:"4px 10px", borderRadius:"2px", textAlign:"center", background:"rgba(9,9,11,0.7)", textDecoration:"none", cursor:"pointer", transition:"border-color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#fbbf24"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(217,119,6,0.5)"}>
              <div style={{ fontFamily:"monospace", fontSize:"0.52rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#b45309", marginBottom:"1px" }}>{k}</div>
              <div style={{ fontFamily:"monospace", fontSize:"0.68rem", color:"#fbbf24" }}>{v}</div>
            </a>
          ) : k==="GitHub" ? (
            <a key={k} href="https://github.com/smily-sadha" target="_blank" rel="noopener noreferrer"
              style={{ border:"1px solid rgba(39,39,42,0.8)", padding:"4px 10px", borderRadius:"2px", textAlign:"center", background:"rgba(9,9,11,0.7)", textDecoration:"none", cursor:"pointer", transition:"border-color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#d97706"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(39,39,42,0.8)"}>
              <div style={{ fontFamily:"monospace", fontSize:"0.52rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#52525b", marginBottom:"1px" }}>{k}</div>
              <div style={{ fontFamily:"monospace", fontSize:"0.68rem", color:"#a1a1aa" }}>{v}</div>
            </a>
          ) : (
            <div key={k} style={{ border:"1px solid rgba(39,39,42,0.8)", padding:"4px 10px", borderRadius:"2px", textAlign:"center", background:"rgba(9,9,11,0.7)" }}>
              <div style={{ fontFamily:"monospace", fontSize:"0.52rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#52525b", marginBottom:"1px" }}>{k}</div>
              <div style={{ fontFamily:"monospace", fontSize:"0.68rem", color:"#a1a1aa" }}>{v}</div>
            </div>
          )
        ))}
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════
// ✦ 3D CERT STACK
// ══════════════════════════════════════════════════════
function CertStack() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const total = certifications.length;

  const startAuto = useCallback(()=>{
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(()=>{ setActiveIdx(i=>(i+1)%total); }, 3000);
  },[total]);

  useEffect(()=>{ if(!paused) startAuto(); else clearInterval(intervalRef.current); return()=>clearInterval(intervalRef.current); },[paused]);

  const goTo = idx => { setActiveIdx(idx); clearInterval(intervalRef.current); intervalRef.current=setInterval(()=>setActiveIdx(i=>(i+1)%total),3000); };

  const getCardStyle = offset => {
    const abs=Math.abs(offset), sign=Math.sign(offset);
    return {
      position:"absolute",
      width:abs===0?280:abs===1?240:abs===2?210:185,
      height:abs===0?185:abs===1?158:abs===2?138:122,
      zIndex:20-abs,
      transform:[`translateX(${sign*abs*85}px)`,`translateY(${abs*18}px)`,`rotateY(${sign*abs*-22}deg)`,`rotateX(${abs*4}deg)`,`scale(${1-abs*0.07})`].join(" "),
      opacity:abs>3?0:1-abs*0.18,
      transition:"all 0.5s cubic-bezier(0.22,1,0.36,1)",
      borderRadius:"6px", overflow:"hidden",
      boxShadow:abs===0?"0 24px 60px rgba(0,0,0,0.7),0 0 30px rgba(217,119,6,0.15)":`0 ${8-abs*2}px ${20-abs*4}px rgba(0,0,0,0.5)`,
      cursor:abs===0?"pointer":"default",
      pointerEvents:abs===0?"auto":"none",
    };
  };

  const cert = certifications[activeIdx];
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2rem" }}>
      <div style={{ position:"relative", width:"100%", height:260, display:"flex", justifyContent:"center", alignItems:"center", perspective:"1000px" }}
        onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
        {certifications.map((c,i)=>{
          let offset=i-activeIdx;
          if(offset>total/2) offset-=total;
          if(offset<-total/2) offset+=total;
          if(Math.abs(offset)>3) return null;
          return (
            <div key={c.id} style={getCardStyle(offset)} onClick={()=>offset===0&&window.open(c.link,"_blank","noopener noreferrer")}>
              <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,rgba(28,16,4,0.97),rgba(9,9,11,0.99))", border:`1px solid ${c.color}55`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.6rem", padding:"1.25rem", position:"relative" }}>
                {offset===0&&(<motion.div animate={{ x:["-100%","200%"] }} transition={{ duration:2.5, repeat:Infinity, repeatDelay:2, ease:"easeInOut" }} style={{ position:"absolute", top:0, left:0, width:"40%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(217,119,6,0.06),transparent)", pointerEvents:"none", zIndex:1 }} />)}
                {[[{top:0,left:0},{borderTop:`1px solid ${c.color}`,borderLeft:`1px solid ${c.color}`}],[{top:0,right:0},{borderTop:`1px solid ${c.color}`,borderRight:`1px solid ${c.color}`}],[{bottom:0,left:0},{borderBottom:`1px solid ${c.color}`,borderLeft:`1px solid ${c.color}`}],[{bottom:0,right:0},{borderBottom:`1px solid ${c.color}`,borderRight:`1px solid ${c.color}`}]].map(([pos,brd],k)=>(<div key={k} style={{ position:"absolute", width:14, height:14, ...pos, ...brd }} />))}
                <div style={{ fontSize:offset===0?"2rem":"1.4rem", lineHeight:1, zIndex:2 }}>{c.icon}</div>
                <div style={{ textAlign:"center", zIndex:2 }}>
                  <p style={{ fontFamily:"monospace", fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:c.color, marginBottom:"0.3rem" }}>Certificate of Completion</p>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:offset===0?"0.95rem":"0.75rem", fontWeight:300, color:"#f4f4f5", marginBottom:"0.2rem", lineHeight:1.3 }}>{c.name}</p>
                  <p style={{ fontFamily:"monospace", fontSize:"0.6rem", color:"#71717a" }}>{c.issuer} · {c.year}</p>
                </div>
                {offset===0&&(<motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }} style={{ zIndex:2, display:"flex", alignItems:"center", gap:"0.35rem", marginTop:"0.25rem" }}><span style={{ fontFamily:"monospace", fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:c.color, opacity:0.7 }}>Click to view</span><span style={{ color:c.color, fontSize:"0.65rem", opacity:0.7 }}>↗</span></motion.div>)}
                <div style={{ position:"absolute", bottom:"0.5rem", right:"0.6rem", fontFamily:"monospace", fontSize:"0.48rem", color:c.color, opacity:0.4, letterSpacing:"0.12em" }}>VERIFIED ✓</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
        <button onClick={()=>goTo((activeIdx-1+total)%total)} style={{ background:"none", border:"1px solid #3f3f46", color:"#a1a1aa", width:36, height:36, borderRadius:"2px", cursor:"pointer", fontFamily:"monospace", fontSize:"1rem", transition:"border-color 0.2s,color 0.2s" }} onMouseEnter={e=>{e.target.style.borderColor="#d97706";e.target.style.color="#fbbf24";}} onMouseLeave={e=>{e.target.style.borderColor="#3f3f46";e.target.style.color="#a1a1aa";}}>←</button>
        <div style={{ display:"flex", gap:"0.4rem", alignItems:"center" }}>
          {certifications.map((_,i)=>(<button key={i} onClick={()=>goTo(i)} style={{ width:i===activeIdx?20:6, height:6, borderRadius:3, background:i===activeIdx?"#d97706":"#3f3f46", border:"none", cursor:"pointer", padding:0, transition:"all 0.3s ease" }} />))}
        </div>
        <button onClick={()=>goTo((activeIdx+1)%total)} style={{ background:"none", border:"1px solid #3f3f46", color:"#a1a1aa", width:36, height:36, borderRadius:"2px", cursor:"pointer", fontFamily:"monospace", fontSize:"1rem", transition:"border-color 0.2s,color 0.2s" }} onMouseEnter={e=>{e.target.style.borderColor="#d97706";e.target.style.color="#fbbf24";}} onMouseLeave={e=>{e.target.style.borderColor="#3f3f46";e.target.style.color="#a1a1aa";}}>→</button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeIdx} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }} transition={{ duration:0.3 }} style={{ textAlign:"center" }}>
          <p style={{ fontFamily:"Georgia,serif", fontSize:"1rem", fontWeight:300, color:"#e4e4e7", marginBottom:"0.2rem" }}>{cert.name}</p>
          <p style={{ fontFamily:"monospace", fontSize:"0.68rem", color:"#71717a" }}>{cert.issuer} · {cert.year}</p>
          <p style={{ fontFamily:"monospace", fontSize:"0.6rem", color:"#52525b", marginTop:"0.3rem", letterSpacing:"0.1em" }}>{activeIdx+1} of {total} · {paused?"⏸ paused":"▶ auto-rotating"}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// ✦ HEX BACKGROUND
// ══════════════════════════════════════════════════════
function HexSectionBackground() {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext("2d"), parent=canvas.parentElement;
    let W,H, hexes=[];
    const HEX_R=38, HEX_H=HEX_R*Math.sqrt(3);
    const buildHexes=()=>{ hexes=[]; const cols=Math.ceil(W/(HEX_R*1.5))+3,rows=Math.ceil(H/HEX_H)+3; for(let col=-1;col<cols;col++)for(let row=-1;row<rows;row++) hexes.push({x:col*HEX_R*1.5,y:row*HEX_H+(col%2===0?0:HEX_H/2),phase:Math.random()*Math.PI*2,speed:0.006+Math.random()*0.01,highlight:Math.random()>0.91,brightPhase:Math.random()*Math.PI*2}); };
    const resize=()=>{ W=canvas.width=parent.offsetWidth; H=canvas.height=parent.offsetHeight; buildHexes(); };
    const drawHex=(cx,cy,r,strokeA,fillA)=>{ ctx.beginPath(); for(let i=0;i<6;i++){const a=(Math.PI/3)*i-Math.PI/6;i===0?ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));} ctx.closePath(); if(fillA>0.001){ctx.fillStyle=`rgba(28,16,4,${fillA})`;ctx.fill();} if(strokeA>0.001){ctx.strokeStyle=`rgba(217,119,6,${strokeA})`;ctx.lineWidth=0.75;ctx.stroke();} };
    const particles=Array.from({length:30},()=>({x:Math.random()*1200,y:Math.random()*2000,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:0.8+Math.random()*1.8,phase:Math.random()*Math.PI*2,speed:0.02+Math.random()*0.02}));
    let mx=600,my=400;
    const onMouse=e=>{ const rect=canvas.getBoundingClientRect(); mx=e.clientX-rect.left; my=e.clientY-rect.top; };
    window.addEventListener("mousemove",onMouse);
    const ro=new ResizeObserver(resize); ro.observe(parent); resize();
    let animId,frame=0;
    const draw=()=>{
      animId=requestAnimationFrame(draw); frame++;
      ctx.clearRect(0,0,W,H);
      const wp=(Date.now()/5000%1)*(W+H), wp2=(1-(Date.now()/9000%1))*(W+H);
      hexes.forEach(h=>{ h.phase+=h.speed; const pulse=0.4+0.6*Math.abs(Math.sin(h.phase)); let sA=h.highlight?0.1+0.12*pulse:0.035+0.025*pulse,fA=h.highlight?0.06*pulse:0; const d1=Math.abs((h.x+h.y)-wp);if(d1<160){const wf=1-d1/160;sA=Math.max(sA,wf*0.55);fA=Math.max(fA,wf*0.18);} const d2=Math.abs((h.x-h.y+H)-wp2);if(d2<100){const wf=1-d2/100;sA=Math.max(sA,wf*0.25);fA=Math.max(fA,wf*0.08);} const md=Math.sqrt((h.x-mx)**2+(h.y-my)**2);if(md<120){const mf=1-md/120;sA=Math.max(sA,mf*0.7);fA=Math.max(fA,mf*0.22);} drawHex(h.x,h.y,HEX_R-1,sA,fA); });
      hexes.forEach(h=>{ if(!h.highlight)return; h.brightPhase+=0.03; ctx.beginPath();ctx.arc(h.x,h.y,2,0,Math.PI*2);ctx.fillStyle=`rgba(251,191,36,${(0.3+0.7*Math.abs(Math.sin(h.brightPhase)))*0.5})`;ctx.fill(); });
      particles.forEach(p=>{ p.x+=p.vx;p.y+=p.vy;p.phase+=p.speed;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(251,191,36,${0.2+0.5*Math.abs(Math.sin(p.phase))})`;ctx.fill(); });
      const tf=ctx.createLinearGradient(0,0,0,180);tf.addColorStop(0,"rgba(9,9,11,1)");tf.addColorStop(1,"rgba(9,9,11,0)");ctx.fillStyle=tf;ctx.fillRect(0,0,W,180);
      const bf=ctx.createLinearGradient(0,H-180,0,H);bf.addColorStop(0,"rgba(9,9,11,0)");bf.addColorStop(1,"rgba(9,9,11,1)");ctx.fillStyle=bf;ctx.fillRect(0,H-180,W,180);
      const sv=ctx.createRadialGradient(W/2,H/2,H*0.1,W/2,H/2,H*0.85);sv.addColorStop(0,"rgba(9,9,11,0)");sv.addColorStop(1,"rgba(9,9,11,0.6)");ctx.fillStyle=sv;ctx.fillRect(0,0,W,H);
    };
    draw();
    return()=>{ cancelAnimationFrame(animId); window.removeEventListener("mousemove",onMouse); ro.disconnect(); };
  },[]);
  return <canvas ref={canvasRef} style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} />;
}

// ── 3D NEURAL NET ──
function NeuralNetCanvas() {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setSize(canvas.clientWidth,canvas.clientHeight);renderer.setClearColor(0x000000,0);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,canvas.clientWidth/canvas.clientHeight,0.1,100);camera.position.set(0,0,7);
    const LAYERS=[{count:4,x:-4.5},{count:7,x:-1.5},{count:7,x:1.5},{count:4,x:4.5}],nodePositions=[],nodeMeshes=[],pulses=[],nodeGeo=new THREE.SphereGeometry(0.13,16,16);
    LAYERS.forEach(layer=>{ const ln=[],spread=(layer.count-1)*0.65; for(let i=0;i<layer.count;i++){const pos=new THREE.Vector3(layer.x,-spread/2+i*(spread/(layer.count-1||1)),(Math.random()-0.5)*0.6);ln.push(pos);const mat=new THREE.MeshBasicMaterial({color:0xd97706,transparent:true,opacity:0.85});const mesh=new THREE.Mesh(nodeGeo,mat);mesh.position.copy(pos);scene.add(mesh);nodeMeshes.push({mat,baseOpacity:0.85,pulse:Math.random()*Math.PI*2});} nodePositions.push(ln); });
    for(let li=0;li<LAYERS.length-1;li++){nodePositions[li].forEach(fp=>{nodePositions[li+1].forEach(tp=>{ scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([fp,tp]),new THREE.LineBasicMaterial({color:0xd97706,transparent:true,opacity:0.1}))); const pMat=new THREE.MeshBasicMaterial({color:0xfbbf24,transparent:true,opacity:0});const pMesh=new THREE.Mesh(new THREE.SphereGeometry(0.055,8,8),pMat);scene.add(pMesh);pulses.push({fromPos:fp,toPos:tp,mesh:pMesh,mat:pMat,progress:Math.random(),speed:0.003+Math.random()*0.004,active:Math.random()>0.5,waitTimer:Math.random()*120}); });});}
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(3.5,32,32),new THREE.MeshBasicMaterial({color:0xd97706,transparent:true,opacity:0.03,side:THREE.BackSide})));
    let mx=0,my=0;const onMouse=e=>{mx=(e.clientX/window.innerWidth-0.5)*2;my=(e.clientY/window.innerHeight-0.5)*2;};window.addEventListener("mousemove",onMouse);
    const onResize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};window.addEventListener("resize",onResize);
    let frame=0,animId;
    const animate=()=>{ animId=requestAnimationFrame(animate);frame++;camera.position.x=mx*0.6;camera.position.y=-my*0.4;camera.lookAt(0,0,0);scene.rotation.y=Math.sin(frame*0.004)*0.18;scene.rotation.x=Math.sin(frame*0.003)*0.07;nodeMeshes.forEach(n=>{n.pulse+=0.03;n.mat.opacity=n.baseOpacity*(0.6+0.4*Math.sin(n.pulse));});pulses.forEach(p=>{if(!p.active){p.waitTimer--;if(p.waitTimer<=0){p.active=true;p.progress=0;p.waitTimer=60+Math.random()*180;}p.mat.opacity=0;return;}p.progress+=p.speed;if(p.progress>=1){p.active=false;p.waitTimer=80+Math.random()*200;p.mat.opacity=0;return;}p.mesh.position.lerpVectors(p.fromPos,p.toPos,p.progress);const t=p.progress;p.mat.opacity=0.9*(t<0.15?t/0.15:t>0.85?(1-t)/0.15:1);});renderer.render(scene,camera); };
    animate();
    return()=>{cancelAnimationFrame(animId);window.removeEventListener("mousemove",onMouse);window.removeEventListener("resize",onResize);renderer.dispose();};
  },[]);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.85,pointerEvents:"none"}} />;
}

// ── AI CHIP ──
function AIChipCanvas() {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setSize(canvas.clientWidth,canvas.clientHeight);renderer.setClearColor(0x000000,0);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(50,canvas.clientWidth/canvas.clientHeight,0.1,100);camera.position.set(0,0,5.5);
    const coreGeo=new THREE.DodecahedronGeometry(1.1,0);const wireCore=new THREE.Mesh(coreGeo,new THREE.MeshBasicMaterial({color:0xd97706,wireframe:true,transparent:true,opacity:0.35}));scene.add(wireCore);
    scene.add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.95,0),new THREE.MeshBasicMaterial({color:0x1c1008,transparent:true,opacity:0.9})));
    const positions=coreGeo.attributes.position,pinMeshes=[],seen=new Set();
    for(let i=0;i<positions.count;i++){const x=parseFloat(positions.getX(i).toFixed(3)),y=parseFloat(positions.getY(i).toFixed(3)),z=parseFloat(positions.getZ(i).toFixed(3));const key=`${x},${y},${z}`;if(seen.has(key))continue;seen.add(key);const mat=new THREE.MeshBasicMaterial({color:0xfbbf24,transparent:true,opacity:1});const pin=new THREE.Mesh(new THREE.SphereGeometry(0.045,8,8),mat);pin.position.set(x,y,z);scene.add(pin);pinMeshes.push({mat,phase:Math.random()*Math.PI*2});}
    const rings=[];[1.7,2.1,2.5].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,0.012,8,80),new THREE.MeshBasicMaterial({color:0xd97706,transparent:true,opacity:0.18-i*0.04}));ring.rotation.x=(Math.PI/3)*i+0.4;ring.rotation.y=(Math.PI/4)*i;scene.add(ring);rings.push({mesh:ring,speed:0.003+i*0.002});});
    const orbitPulses=[];[0,1,2].forEach(ri=>{const r=[1.7,2.1,2.5][ri];for(let p=0;p<2;p++){const pMat=new THREE.MeshBasicMaterial({color:0xfbbf24,transparent:true,opacity:0});const pMesh=new THREE.Mesh(new THREE.SphereGeometry(0.055,8,8),pMat);scene.add(pMesh);orbitPulses.push({mesh:pMesh,mat:pMat,radius:r,angle:Math.random()*Math.PI*2,speed:(0.012+Math.random()*0.01)*(Math.random()>0.5?1:-1),tiltX:(Math.PI/3)*ri+0.4,tiltY:(Math.PI/4)*ri,phase:Math.random()*Math.PI*2});}});
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(2.2,32,32),new THREE.MeshBasicMaterial({color:0xd97706,transparent:true,opacity:0.04,side:THREE.BackSide})));
    let mx=0,my=0;const onMouse=e=>{mx=(e.clientX/window.innerWidth-0.5)*2;my=(e.clientY/window.innerHeight-0.5)*2;};window.addEventListener("mousemove",onMouse);
    const onResize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};window.addEventListener("resize",onResize);
    let animId;const animate=()=>{animId=requestAnimationFrame(animate);wireCore.rotation.y+=0.004;wireCore.rotation.x+=0.0015;wireCore.rotation.z+=0.001;pinMeshes.forEach(p=>{p.phase+=0.04;p.mat.opacity=0.5+0.5*Math.abs(Math.sin(p.phase));});rings.forEach(r=>{r.mesh.rotation.x+=r.speed*0.7;r.mesh.rotation.y+=r.speed;r.mesh.rotation.z+=r.speed*0.4;});orbitPulses.forEach(p=>{p.angle+=p.speed;p.phase+=0.05;const pos=new THREE.Vector3(Math.cos(p.angle)*p.radius,Math.sin(p.angle)*p.radius,0);pos.applyEuler(new THREE.Euler(p.tiltX,p.tiltY,0));p.mesh.position.copy(pos);p.mat.opacity=0.7+0.3*Math.sin(p.phase);});camera.position.x+=(mx*0.8-camera.position.x)*0.05;camera.position.y+=(-my*0.5-camera.position.y)*0.05;camera.lookAt(0,0,0);renderer.render(scene,camera);};
    animate();
    return()=>{cancelAnimationFrame(animId);window.removeEventListener("mousemove",onMouse);window.removeEventListener("resize",onResize);renderer.dispose();};
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}} />;
}

function FloatingCode() {
  const items=useRef(Array.from({length:14},(_,i)=>({id:i,text:CODE_SNIPPETS[i%CODE_SNIPPETS.length],x:5+Math.random()*90,duration:20+Math.random()*20,delay:-(Math.random()*30),opacity:0.04+Math.random()*0.05,size:10+Math.random()*3}))).current;
  return(<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>{items.map(item=>(<motion.div key={item.id} initial={{y:"110vh",opacity:0}} animate={{y:"-20vh",opacity:[0,item.opacity,item.opacity,0]}} transition={{duration:item.duration,delay:item.delay,repeat:Infinity,ease:"linear"}} style={{position:"absolute",left:`${item.x}%`,fontFamily:"monospace",fontSize:`${item.size}px`,color:"#d97706",whiteSpace:"nowrap",transform:"rotate(-4deg)"}}>{item.text}</motion.div>))}</div>);
}

// ─── SECTION WRAPPERS ────────────────────────────────────────────────────────
function PlainSection({ id, label, children }) {
  const [ref,isInView]=useScrollReveal();
  return(<section id={id} ref={ref} style={{position:"relative",padding:"6rem 1.5rem",maxWidth:"64rem",margin:"0 auto",zIndex:1}}>{label&&(<motion.div initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} style={{marginBottom:"3rem"}}><div style={{marginBottom:"0.5rem",display:"flex",alignItems:"center",gap:"0.4rem"}}><span style={{color:"#52525b",fontFamily:"monospace",fontSize:"0.68rem"}}>—</span><SplitHeading text={label} isInView={isInView}/></div><div style={{height:"1px",background:"rgba(39,39,42,0.6)"}}/></motion.div>)}{children}</section>);
}
function HexSection({ id, label, children }) {
  const [ref,isInView]=useScrollReveal();
  return(<div style={{position:"relative",overflow:"hidden",background:"#09090b"}}><HexSectionBackground/><section id={id} ref={ref} style={{position:"relative",padding:"6rem 1.5rem",maxWidth:"64rem",margin:"0 auto",zIndex:1}}>{label&&(<motion.div initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} style={{marginBottom:"3rem"}}><div style={{marginBottom:"0.5rem",display:"flex",alignItems:"center",gap:"0.4rem"}}><span style={{color:"#52525b",fontFamily:"monospace",fontSize:"0.68rem"}}>—</span><SplitHeading text={label} isInView={isInView}/></div><div style={{height:"1px",background:"rgba(39,39,42,0.4)"}}/></motion.div>)}{children}</section></div>);
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled,setScrolled]=useState(false),[menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  const links=[["Work","#case-studies"],["Projects","#projects"],["Skills","#skills"],["Experience","#experience"],["Certs","#certifications"],["GitHub","#proof"],["Contact","#contact"]];
  return(<motion.nav initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.3}} style={{position:"fixed",top:0,left:0,right:0,zIndex:50,background:scrolled?"rgba(9,9,11,0.92)":"transparent",backdropFilter:scrolled?"blur(16px)":"none",borderBottom:scrolled?"1px solid rgba(39,39,42,0.7)":"1px solid transparent",transition:"background 0.3s"}}>
    <div style={{maxWidth:"64rem",margin:"0 auto",padding:"0 1.5rem",height:"3.5rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{fontFamily:"monospace",fontSize:"0.875rem",letterSpacing:"0.15em",color:"#d97706"}}>SP</span>
      <div className="hidden sm:flex items-center gap-5">
        {links.map(([label,href])=>(<a key={label} href={href} style={{fontSize:"0.68rem",fontFamily:"monospace",color:"#71717a",textDecoration:"none",letterSpacing:"0.12em",textTransform:"uppercase",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="#fbbf24"} onMouseLeave={e=>e.target.style.color="#71717a"}>{label}</a>))}
      </div>
      <button onClick={()=>setMenuOpen(o=>!o)} style={{background:"none",border:"none",color:"#a1a1aa",fontSize:"1.2rem",cursor:"pointer"}} className="sm:hidden">☰</button>
    </div>
    <AnimatePresence>{menuOpen&&(<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{background:"rgba(9,9,11,0.98)",borderBottom:"1px solid #27272a",padding:"0 1.5rem 1rem"}}>{links.map(([label,href])=>(<a key={label} href={href} onClick={()=>setMenuOpen(false)} style={{display:"block",padding:"0.6rem 0",fontSize:"0.85rem",fontFamily:"monospace",color:"#a1a1aa",textDecoration:"none"}}>{label}</a>))}</motion.div>)}</AnimatePresence>
  </motion.nav>);
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const roles=["AI Engineer","AI Agent Developer","Data Analyst","Full-Stack Developer"];
  const [roleIdx,setRoleIdx]=useState(0),[phase,setPhase]=useState("typing-first");
  const [firstName,setFirstName]=useState(""),[lastName,setLastName]=useState("");
  const [gFirst,setGFirst]=useState(""),[gLast,setGLast]=useState("");
  const FIRST="Sadhasivam",LAST="Perichi",GC="!@#$%^&*<>[]{}|~±";
  const scramble=s=>s.split("").map(c=>Math.random()>0.55?GC[Math.floor(Math.random()*GC.length)]:c).join("");
  useEffect(()=>{if(phase!=="typing-first")return;let i=0;const iv=setInterval(()=>{i++;setFirstName(FIRST.slice(0,i));if(i>=FIRST.length){clearInterval(iv);setPhase("typing-last");}},65);return()=>clearInterval(iv);},[phase]);
  useEffect(()=>{if(phase!=="typing-last")return;let i=0;const iv=setInterval(()=>{i++;setLastName(LAST.slice(0,i));if(i>=LAST.length){clearInterval(iv);setPhase("glitching");}},65);return()=>clearInterval(iv);},[phase]);
  useEffect(()=>{if(phase!=="glitching")return;setGFirst(scramble(FIRST));setGLast(scramble(LAST));let c=0;const iv=setInterval(()=>{setGFirst(scramble(FIRST));setGLast(scramble(LAST));c++;if(c>=9){clearInterval(iv);setPhase("done");}},70);return()=>clearInterval(iv);},[phase]);
  useEffect(()=>{const t=setInterval(()=>setRoleIdx(i=>(i+1)%roles.length),2400);return()=>clearInterval(t);},[]);
  const isG=phase==="glitching",isDone=phase==="done";
  const sf=isG?gFirst:firstName,sl=isG?gLast:lastName;
  const glow=isG?{textShadow:"2px 0 0 rgba(255,0,0,0.7),-2px 0 0 rgba(0,255,255,0.7),0 0 24px rgba(217,119,6,0.9)",transition:"none"}:{};
  return(
    <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 1.5rem",maxWidth:"64rem",margin:"0 auto",position:"relative",overflow:"hidden",background:"#09090b"}}>
      <NeuralNetCanvas/><FloatingCode/>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:1,background:"radial-gradient(ellipse 55% 65% at 45% 50%,transparent 15%,rgba(9,9,11,0.88) 100%)"}}/>
      <div style={{position:"absolute",top:"1.5rem",right:"1.5rem",display:"flex",alignItems:"center",gap:"0.5rem",opacity:0.45,zIndex:2}}>
        <span style={{width:6,height:6,borderRadius:"50%",background:"#d97706",display:"inline-block",animation:"blink 2s ease-in-out infinite"}}/><span style={{fontFamily:"monospace",fontSize:"0.62rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"#71717a"}}>Neural Net · Live</span>
      </div>

      {/* ── Hero layout: Photo LEFT + Text RIGHT ── */}
      <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",gap:"3rem",flexWrap:"wrap"}}>

        {/* PHOTO — Option A */}
        <HeroPhoto />

        {/* TEXT */}
        <div style={{flex:1,minWidth:280}}>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2,duration:0.8}} style={{fontSize:"0.7rem",fontFamily:"monospace",letterSpacing:"0.3em",textTransform:"uppercase",color:"#52525b",marginBottom:"1.5rem"}}>Open to internships &amp; full-time · 2025 – 2026</motion.p>
          <div style={{marginBottom:"2rem"}}>
            <h1 style={{fontFamily:"Georgia,'Times New Roman',serif",fontSize:"clamp(2.5rem,6vw,4.5rem)",fontWeight:300,color:isG?"#fbbf24":"#f4f4f5",lineHeight:1.05,margin:0,...glow}}>{sf}{phase==="typing-first"&&<span style={{borderRight:"3px solid #d97706",marginLeft:"3px",animation:"blink-caret 0.65s step-end infinite"}}> </span>}</h1>
            <h1 style={{fontFamily:"Georgia,'Times New Roman',serif",fontSize:"clamp(2.5rem,6vw,4.5rem)",fontWeight:300,color:isG?"#fbbf24":"#d97706",lineHeight:1.05,margin:0,...glow}}>{sl}{phase==="typing-last"&&<span style={{borderRight:"3px solid #d97706",marginLeft:"3px",animation:"blink-caret 0.65s step-end infinite"}}> </span>}</h1>
          </div>
          <AnimatePresence>{isDone&&(<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}} style={{height:"2.5rem",position:"relative",marginBottom:"1.75rem",maxWidth:"360px"}}><AnimatePresence mode="wait"><motion.span key={roleIdx} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}} transition={{duration:0.35,ease:"easeOut"}} style={{fontFamily:"monospace",fontSize:"1.1rem",color:"#fbbf24",position:"absolute",whiteSpace:"nowrap"}}>{roles[roleIdx]}</motion.span></AnimatePresence></motion.div>)}</AnimatePresence>
          <AnimatePresence>{isDone&&(<motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.15,duration:0.6}}>
            <p style={{maxWidth:"480px",color:"#a1a1aa",fontSize:"0.88rem",lineHeight:1.75,marginBottom:"2rem"}}>Final-year AI &amp; ML student at Sona College of Technology. Currently building agentic voice AI systems at Spacemarvel.ai — RAG pipelines, real-time speech, and multi-agent call automation.</p>
            {/* Buttons — Get in touch · Resume · GitHub */}
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.85rem",marginBottom:"2.5rem"}}>
              <a href="#contact" style={{padding:"0.6rem 1.25rem",background:"#d97706",color:"#09090b",fontFamily:"monospace",fontSize:"0.78rem",letterSpacing:"0.08em",textDecoration:"none",transition:"background 0.2s"}} onMouseEnter={e=>e.target.style.background="#fbbf24"} onMouseLeave={e=>e.target.style.background="#d97706"}>Get in touch</a>
              {/* ⚠ Resume download — update RESUME_URL at top of file */}
              <a href={RESUME_URL} download style={{padding:"0.6rem 1.25rem",border:"1px solid #d97706",color:"#fbbf24",fontFamily:"monospace",fontSize:"0.78rem",letterSpacing:"0.08em",textDecoration:"none",transition:"background 0.2s,color 0.2s"}} onMouseEnter={e=>{e.target.style.background="rgba(217,119,6,0.1)";}} onMouseLeave={e=>{e.target.style.background="transparent";}}>↓ Resume</a>
              <a href="https://github.com/smily-sadha" target="_blank" rel="noopener noreferrer" style={{padding:"0.6rem 1.25rem",border:"1px solid #27272a",color:"#71717a",fontFamily:"monospace",fontSize:"0.78rem",letterSpacing:"0.08em",textDecoration:"none",transition:"border-color 0.2s,color 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#52525b";e.currentTarget.style.color="#a1a1aa";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#27272a";e.currentTarget.style.color="#71717a";}}>GitHub ↗</a>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"2rem"}}>{["Sona College of Technology · AI & ML","CGPA 7.5","Spacemarvel.ai Intern"].map(t=>(<span key={t} style={{fontFamily:"monospace",fontSize:"0.65rem",color:"#3f3f46"}}>{t}</span>))}</div>
          </motion.div>)}</AnimatePresence>
        </div>
      </div>

      {isDone&&(<motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2,duration:1}} style={{position:"absolute",bottom:"2rem",left:"50%",transform:"translateX(-50%)",zIndex:2}}><motion.div animate={{y:[0,8,0]}} transition={{duration:1.8,repeat:Infinity,ease:"easeInOut"}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"5px",color:"#3f3f46",fontFamily:"monospace",fontSize:"0.6rem",letterSpacing:"0.2em"}}><span>SCROLL</span><span>↓</span></motion.div></motion.div>)}
      <style>{`@keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.25;transform:scale(1.7)}}@keyframes blink-caret{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </section>
  );
}

// ─── CASE STUDIES ────────────────────────────────────────────────────────────
function CaseStudies() {
  const featured=projects.filter(p=>p.featured);
  const [ref,isInView]=useScrollReveal();
  const [expanded,setExpanded]=useState({});
  return(
    <HexSection id="case-studies" label="Featured Work">
      <div ref={ref} className="grid md:grid-cols-2 gap-6">
        {featured.map((p,i)=>(
          <motion.div key={p.id} initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={i}>
            <TiltCard style={{height:"100%",border:"1px solid rgba(39,39,42,0.8)",borderRadius:"3px",background:"rgba(9,9,11,0.72)",backdropFilter:"blur(8px)",transition:"border-color 0.25s,background 0.25s,box-shadow 0.25s"}}
              onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(180,83,9,0.55)"; el.style.background="rgba(28,16,4,0.88)"; el.style.boxShadow="0 0 32px rgba(217,119,6,0.18),inset 0 0 20px rgba(217,119,6,0.04)"; }}
              onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(39,39,42,0.8)"; el.style.background="rgba(9,9,11,0.72)"; el.style.boxShadow="none"; }}>
              <div style={{padding:"2rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}><Tag>{p.tag}</Tag><span style={{fontSize:"0.68rem",fontFamily:"monospace",color:"#52525b"}}>{p.year}</span></div>
                <h3 style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",fontWeight:300,color:"#f4f4f5",marginBottom:"0.75rem"}}>{p.name}</h3>
                <p style={{color:"#a1a1aa",fontSize:"0.85rem",lineHeight:1.7,marginBottom:"0.75rem"}}>{p.description}</p>
                <AnimatePresence>{expanded[p.id]&&(<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:0.35}}>
                  <p style={{color:"#71717a",fontSize:"0.8rem",lineHeight:1.7,marginBottom:"0.75rem",borderLeft:"2px solid #d97706",paddingLeft:"0.75rem"}}>{p.details}</p>
                  <div style={{marginBottom:"0.75rem",padding:"0.75rem",background:"rgba(217,119,6,0.04)",border:"1px solid rgba(217,119,6,0.15)",borderRadius:"3px"}}>
                    <p style={{fontFamily:"monospace",fontSize:"0.6rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"#b45309",marginBottom:"0.4rem"}}>Challenge & Solution</p>
                    <p style={{fontFamily:"monospace",fontSize:"0.72rem",color:"#71717a",lineHeight:1.6}}>{p.challenges}</p>
                  </div>
                </motion.div>)}</AnimatePresence>
                <button onClick={()=>setExpanded(e=>({...e,[p.id]:!e[p.id]}))} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"monospace",fontSize:"0.68rem",color:"#d97706",padding:"0",marginBottom:"1.25rem",letterSpacing:"0.1em"}}>{expanded[p.id]?"↑ Show less":"↓ Technical deep-dive"}</button>
                <div style={{borderTop:"1px solid rgba(39,39,42,0.7)",paddingTop:"1.25rem",marginBottom:"1.25rem"}}>
                  <p style={{fontSize:"0.65rem",fontFamily:"monospace",color:"#52525b",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:"0.75rem"}}>Highlights</p>
                  {p.metrics.map(m=>(<p key={m} style={{fontSize:"0.8rem",fontFamily:"monospace",color:"#d4d4d8",display:"flex",gap:"0.5rem",marginBottom:"0.3rem"}}><span style={{color:"#92400e"}}>→</span>{m}</p>))}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1.25rem"}}>{p.stack.map(s=><Pill key={s}>{s}</Pill>)}</div>
                <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontFamily:"monospace",fontSize:"0.72rem",color:"#71717a",textDecoration:"none",border:"1px solid #3f3f46",padding:"0.4rem 0.9rem",borderRadius:"2px",transition:"border-color 0.2s,color 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#d97706";e.currentTarget.style.color="#fbbf24";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#3f3f46";e.currentTarget.style.color="#71717a";}}>GitHub ↗</a>
                  {p.demo&&(<a href={p.demo} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontFamily:"monospace",fontSize:"0.72rem",color:"#71717a",textDecoration:"none",border:"1px solid #3f3f46",padding:"0.4rem 0.9rem",borderRadius:"2px",transition:"border-color 0.2s,color 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#b45309";e.currentTarget.style.color="#d97706";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#3f3f46";e.currentTarget.style.color="#71717a";}}>Live Demo ↗</a>)}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </HexSection>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
function Projects() {
  const rest=projects.filter(p=>!p.featured);
  const [ref,isInView]=useScrollReveal();
  const [expanded,setExpanded]=useState({});
  return(
    <HexSection id="projects" label="Projects">
      <div ref={ref}>
        {rest.map((p,i)=>(
          <motion.div key={p.id} initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={i}
            style={{marginBottom:"0.75rem",border:"1px solid rgba(39,39,42,0.7)",padding:"1.5rem",transition:"border-color 0.2s,background 0.2s",borderRadius:"4px",background:"rgba(9,9,11,0.72)",backdropFilter:"blur(10px)"}}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(28,16,4,0.85)"; e.currentTarget.style.borderColor="rgba(180,83,9,0.4)"; }} onMouseLeave={e=>{ e.currentTarget.style.background="rgba(9,9,11,0.72)"; e.currentTarget.style.borderColor="rgba(39,39,42,0.7)"; }}>
            <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"0.75rem",marginBottom:"0.6rem"}}>
              <span style={{fontFamily:"monospace",fontSize:"0.68rem",color:"#52525b",minWidth:"3.5rem"}}>{p.year}</span>
              <span style={{fontFamily:"Georgia,serif",fontSize:"1rem",fontWeight:300,color:"#e4e4e7"}}>{p.name}</span>
              <Tag>{p.tag}</Tag>
              <div style={{marginLeft:"auto",display:"flex",gap:"0.5rem"}}>
                {p.demo&&(<a href={p.demo} target="_blank" rel="noopener noreferrer" style={{fontFamily:"monospace",fontSize:"0.65rem",color:"#b45309",textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="#d97706"} onMouseLeave={e=>e.target.style.color="#b45309"}>Demo ↗</a>)}
                <a href={p.link} target="_blank" rel="noopener noreferrer" style={{color:"#52525b",fontSize:"0.9rem",textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="#d97706"} onMouseLeave={e=>e.target.style.color="#52525b"}>↗</a>
              </div>
            </div>
            <p style={{fontSize:"0.82rem",color:"#71717a",lineHeight:1.65,margin:"0 0 0.6rem 4.25rem"}}>{p.description}</p>
            <AnimatePresence>{expanded[p.id]&&(<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:0.3}}>
              <p style={{fontSize:"0.78rem",color:"#52525b",lineHeight:1.7,margin:"0 0 0.6rem 4.25rem",borderLeft:"2px solid #92400e",paddingLeft:"0.75rem"}}>{p.details}</p>
              <div style={{margin:"0 0 0.5rem 4.25rem",padding:"0.6rem 0.75rem",background:"rgba(217,119,6,0.04)",border:"1px solid rgba(217,119,6,0.12)",borderRadius:"3px"}}>
                <p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"#b45309",marginBottom:"0.3rem"}}>Challenge & Solution</p>
                <p style={{fontFamily:"monospace",fontSize:"0.7rem",color:"#71717a",lineHeight:1.6}}>{p.challenges}</p>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem",margin:"0 0 0.5rem 4.25rem"}}>{p.metrics.map(m=>(<span key={m} style={{fontSize:"0.7rem",fontFamily:"monospace",color:"#a1a1aa",display:"flex",gap:"0.4rem",alignItems:"center"}}><span style={{color:"#92400e",fontSize:"0.6rem"}}>→</span>{m}</span>))}</div>
            </motion.div>)}</AnimatePresence>
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",margin:"0 0 0.5rem 4.25rem"}}>{p.stack.map(s=><Pill key={s}>{s}</Pill>)}</div>
            <button onClick={()=>setExpanded(e=>({...e,[p.id]:!e[p.id]}))} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"monospace",fontSize:"0.65rem",color:expanded[p.id]?"#71717a":"#d97706",padding:"0 0 0 4.25rem",letterSpacing:"0.1em"}}>{expanded[p.id]?"↑ Less detail":"↓ More detail"}</button>
          </motion.div>
        ))}
      </div>
    </HexSection>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────
function Skills() {
  const [ref,isInView]=useScrollReveal();
  return(<HexSection id="skills" label="Technical Stack"><div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{Object.entries(skills).map(([cat,items],i)=>(<motion.div key={cat} initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={i}><TiltCard style={{border:"1px solid rgba(39,39,42,0.8)",padding:"1.5rem",borderRadius:"3px",background:"rgba(9,9,11,0.72)",backdropFilter:"blur(8px)",height:"100%",transition:"border-color 0.25s,background 0.25s,box-shadow 0.25s",cursor:"default"}}
              onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(180,83,9,0.55)"; el.style.background="rgba(28,16,4,0.88)"; el.style.boxShadow="0 0 32px rgba(217,119,6,0.18),inset 0 0 20px rgba(217,119,6,0.04)"; }}
              onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(39,39,42,0.8)"; el.style.background="rgba(9,9,11,0.72)"; el.style.boxShadow="none"; }}><p style={{fontSize:"0.68rem",fontFamily:"monospace",letterSpacing:"0.18em",textTransform:"uppercase",color:"#b45309",marginBottom:"1rem"}}>{cat}</p><div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>{items.map(it=><Pill key={it}>{it}</Pill>)}</div></TiltCard></motion.div>))}</div></HexSection>);
}

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────
function Experience() {
  const [ref,isInView]=useScrollReveal();
  return(
    <HexSection id="experience" label="Experience">
      <div ref={ref} style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
        {experience.map((e,i)=>(
          <motion.div key={e.company} initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={i}
            style={{border:"1px solid rgba(39,39,42,0.8)",borderRadius:"4px",background:"rgba(9,9,11,0.75)",backdropFilter:"blur(12px)",padding:"2rem",transition:"border-color 0.25s,background 0.25s,box-shadow 0.25s"}}
            onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(180,83,9,0.55)"; el.style.background="rgba(28,16,4,0.88)"; el.style.boxShadow="0 0 32px rgba(217,119,6,0.18),inset 0 0 20px rgba(217,119,6,0.04)"; }}
            onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(39,39,42,0.8)"; el.style.background="rgba(9,9,11,0.75)"; el.style.boxShadow="none"; }}>
            <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:"3rem"}}>
              <div>
                <p style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",fontWeight:300,color:"#f4f4f5",marginBottom:"0.25rem"}}>{e.company}</p>
                <p style={{fontSize:"0.85rem",color:"#d97706",marginBottom:"0.25rem"}}>{e.role}</p>
                <p style={{fontSize:"0.72rem",fontFamily:"monospace",color:"#52525b"}}>{e.period}</p>
                <p style={{fontSize:"0.72rem",fontFamily:"monospace",color:"#52525b"}}>{e.location}</p>
              </div>
              <div style={{paddingTop:"0.25rem"}}>
                {e.bullets.map((b,j)=>(<p key={j} style={{fontSize:"0.85rem",color:"#a1a1aa",lineHeight:1.7,display:"flex",gap:"0.75rem",marginBottom:"0.6rem"}}><span style={{color:"#3f3f46",marginTop:"0.15rem",flexShrink:0}}>—</span><span>{b}</span></p>))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </HexSection>
  );
}

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────
function Achievements() {
  const [ref,isInView]=useScrollReveal();
  return(<HexSection id="achievements" label="Achievements"><div ref={ref} className="grid sm:grid-cols-2 gap-5">{achievements.map((a,i)=>(<motion.div key={a.title} initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={i}><TiltCard style={{border:"1px solid rgba(39,39,42,0.8)",padding:"1.5rem",borderRadius:"3px",background:"rgba(9,9,11,0.72)",backdropFilter:"blur(8px)",height:"100%",transition:"border-color 0.25s,background 0.25s,box-shadow 0.25s",cursor:"default"}}
              onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(180,83,9,0.55)"; el.style.background="rgba(28,16,4,0.88)"; el.style.boxShadow="0 0 32px rgba(217,119,6,0.18),inset 0 0 20px rgba(217,119,6,0.04)"; }}
              onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(39,39,42,0.8)"; el.style.background="rgba(9,9,11,0.72)"; el.style.boxShadow="none"; }}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",marginBottom:"0.75rem"}}><div><p style={{fontFamily:"Georgia,serif",fontWeight:300,color:"#e4e4e7",lineHeight:1.3}}>{a.title}</p><p style={{fontSize:"0.68rem",color:"#b45309",marginTop:"0.2rem"}}>{a.sub}</p></div><span style={{fontSize:"0.68rem",fontFamily:"monospace",color:"#52525b",flexShrink:0}}>{a.year}</span></div><p style={{fontSize:"0.82rem",color:"#71717a",lineHeight:1.65}}>{a.desc}</p></TiltCard></motion.div>))}</div></HexSection>);
}

// ─── CERTIFICATIONS ───────────────────────────────────────────────────────────
function Certifications() {
  const [ref,isInView]=useScrollReveal();
  return(
    <HexSection id="certifications" label="Certifications">
      <motion.div ref={ref} initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp}>
        <div style={{border:"1px solid rgba(39,39,42,0.8)",borderRadius:"4px",background:"rgba(9,9,11,0.75)",backdropFilter:"blur(12px)",padding:"2.5rem",transition:"border-color 0.25s,background 0.25s,box-shadow 0.25s"}}
          onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(180,83,9,0.55)"; el.style.background="rgba(28,16,4,0.88)"; el.style.boxShadow="0 0 40px rgba(217,119,6,0.18),inset 0 0 24px rgba(217,119,6,0.04)"; }}
          onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(39,39,42,0.8)"; el.style.background="rgba(9,9,11,0.75)"; el.style.boxShadow="none"; }}>
          <div style={{textAlign:"center",marginBottom:"2rem"}}>
            <p style={{fontFamily:"monospace",fontSize:"0.68rem",color:"#52525b",letterSpacing:"0.15em"}}>Auto-rotating every 3s · Hover to pause · Click front card to open certificate</p>
          </div>
          <CertStack/>
        </div>
      </motion.div>
    </HexSection>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About() {
  const [ref,isInView]=useScrollReveal();
  const chipRef=useRef(null);
  const chipInView=useInView(chipRef,{once:true,amount:0.25});
  return(
    <HexSection id="about" label="About">
      <div style={{border:"1px solid rgba(39,39,42,0.8)",borderRadius:"4px",background:"rgba(9,9,11,0.75)",backdropFilter:"blur(12px)",padding:"2.5rem",transition:"border-color 0.25s,background 0.25s,box-shadow 0.25s"}}
        onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(180,83,9,0.55)"; el.style.background="rgba(28,16,4,0.88)"; el.style.boxShadow="0 0 40px rgba(217,119,6,0.18),inset 0 0 24px rgba(217,119,6,0.04)"; }}
        onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(39,39,42,0.8)"; el.style.background="rgba(9,9,11,0.75)"; el.style.boxShadow="none"; }}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",alignItems:"center"}}>
          <motion.div ref={ref} initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp}>
            <p style={{color:"#d4d4d8",fontSize:"0.95rem",lineHeight:1.8,marginBottom:"1.25rem"}}>Final-year B.E. student in Artificial Intelligence & Machine Learning at Sona College of Technology, Salem. Currently interning at Spacemarvel.ai as an AI Engineer — building production-grade agentic voice systems and RAG pipelines.</p>
            <p style={{color:"#a1a1aa",fontSize:"0.85rem",lineHeight:1.75,marginBottom:"1.25rem"}}>Work spans computer vision, LLM-backed pipelines, full-stack development, and data analytics. Comfortable across the stack from model training to API deployment to front-end interfaces.</p>
            <p style={{color:"#71717a",fontSize:"0.82rem",lineHeight:1.7}}>Outside engineering: competitive football — 1st place intercollegiate. Based in Tamil Nadu, India.</p>
          </motion.div>
          <motion.div ref={chipRef} initial={{opacity:0,scale:0.85}} animate={chipInView?{opacity:1,scale:1}:{opacity:0,scale:0.85}} transition={{duration:0.85,ease:[0.22,1,0.36,1]}}>
            <div style={{textAlign:"center",marginBottom:"0.6rem"}}><span style={{fontFamily:"monospace",fontSize:"0.6rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"#3f3f46"}}>AI Systems Architecture</span></div>
            <div style={{height:"300px",border:"1px solid rgba(39,39,42,0.9)",background:"radial-gradient(ellipse at center,rgba(28,16,8,0.85) 0%,rgba(9,9,11,0.97) 70%)",overflow:"hidden",position:"relative",borderRadius:"4px"}}>
              <AIChipCanvas/>
              {[[{bottom:0,left:0},{borderBottom:"1px solid rgba(217,119,6,0.22)",borderLeft:"1px solid rgba(217,119,6,0.22)"}],[{bottom:0,right:0},{borderBottom:"1px solid rgba(217,119,6,0.22)",borderRight:"1px solid rgba(217,119,6,0.22)"}],[{top:0,left:0},{borderTop:"1px solid rgba(217,119,6,0.22)",borderLeft:"1px solid rgba(217,119,6,0.22)"}],[{top:0,right:0},{borderTop:"1px solid rgba(217,119,6,0.22)",borderRight:"1px solid rgba(217,119,6,0.22)"}]].map(([pos,brd],i)=>(<div key={i} style={{position:"absolute",width:22,height:22,...pos,...brd}}/>))}
              <div style={{position:"absolute",bottom:"0.6rem",left:0,right:0,textAlign:"center",fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"#3f3f46"}}>Dodecahedron · Circuit Trace · Live</div>
            </div>
            <div style={{display:"flex",gap:"0.6rem",marginTop:"0.9rem",justifyContent:"center",flexWrap:"wrap"}}>
              {[["Agents","Voice + RAG"],["Models","CNN · SVM · LLM"],["Stack","Full-Spectrum"]].map(([k,v])=>(<div key={k} style={{border:"1px solid rgba(39,39,42,0.7)",padding:"5px 12px",borderRadius:"2px",textAlign:"center",background:"rgba(9,9,11,0.6)"}}><div style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"#b45309",marginBottom:"2px"}}>{k}</div><div style={{fontFamily:"monospace",fontSize:"0.68rem",color:"#a1a1aa"}}>{v}</div></div>))}
            </div>
          </motion.div>
        </div>
      </div>
    </HexSection>
  );
}

// ─── PROOF ───────────────────────────────────────────────────────────────────
function Proof() {
  const [ref,isInView]=useScrollReveal();
  const stats=[{value:"12+",label:"GitHub Repos",sub:"public projects"},{value:"300+",label:"Commits (12mo)",sub:"active contributor"},{value:"8",label:"Certifications",sub:"across platforms"},{value:"6+",label:"Projects Built",sub:"AI · CV · Web · Data"}];
  const StatCard=({value,label,sub,index})=>{const suffix=(value+"").replace(/[0-9]/g,""),count=useCounter(value,isInView);return(<motion.div initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={index} style={{background:"rgba(9,9,11,0.78)",padding:"1.5rem",textAlign:"center",backdropFilter:"blur(8px)",transition:"border-color 0.25s,background 0.25s,box-shadow 0.25s",border:"1px solid rgba(39,39,42,0.6)",cursor:"default"}}
        onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(180,83,9,0.55)"; el.style.background="rgba(28,16,4,0.88)"; el.style.boxShadow="0 0 32px rgba(217,119,6,0.18),inset 0 0 20px rgba(217,119,6,0.04)"; }}
        onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(39,39,42,0.6)"; el.style.background="rgba(9,9,11,0.78)"; el.style.boxShadow="none"; }}><p style={{fontSize:"2rem",fontWeight:300,color:"#fbbf24",marginBottom:"0.25rem",fontVariantNumeric:"tabular-nums"}}>{count}{suffix}</p><p style={{fontSize:"0.68rem",fontFamily:"monospace",color:"#a1a1aa",marginBottom:"0.2rem"}}>{label}</p><p style={{fontSize:"0.65rem",color:"#52525b"}}>{sub}</p></motion.div>);};
  return(<HexSection id="proof" label="GitHub & Demos"><div ref={ref}><div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{background:"rgba(39,39,42,0.4)",border:"1px solid rgba(39,39,42,0.6)",marginBottom:"2.5rem"}}>{stats.map((s,i)=><StatCard key={s.label} {...s} index={i}/>)}</div><motion.div initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={4} style={{display:"flex",flexWrap:"wrap",gap:"1rem"}}>{[{label:"GitHub Profile",href:"https://github.com/smily-sadha"},{label:"LinkedIn",href:"https://linkedin.com/in/sadhasivam-perichi-160449255/"}].map(link=>(<a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{fontSize:"0.78rem",fontFamily:"monospace",color:"#71717a",border:"1px solid rgba(39,39,42,0.7)",padding:"0.5rem 1rem",textDecoration:"none",transition:"border-color 0.2s,color 0.2s",background:"rgba(9,9,11,0.5)"}} onMouseEnter={e=>{e.target.style.borderColor="#92400e";e.target.style.color="#e4e4e7";}} onMouseLeave={e=>{e.target.style.borderColor="rgba(39,39,42,0.7)";e.target.style.color="#71717a";}}>{link.label} ↗</a>))}</motion.div></div></HexSection>);
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [ref,isInView]=useScrollReveal();
  return(<PlainSection id="contact" label="Contact"><motion.div ref={ref} initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} style={{maxWidth:"480px"}}><h2 style={{fontFamily:"Georgia,serif",fontSize:"2rem",fontWeight:300,color:"#f4f4f5",marginBottom:"1rem"}}>Open to opportunities.</h2><p style={{color:"#71717a",fontSize:"0.85rem",lineHeight:1.7,marginBottom:"2rem"}}>Targeting AI Engineer, AI Agent Developer, Data Analyst, and Full-Stack roles. Available for internships now and full-time from 2026 graduation.</p><div style={{marginBottom:"2.5rem"}}>{[{label:"Email",value:"sadhasivamperichi@gmail.com",href:"mailto:sadhasivamperichi@gmail.com"},{label:"LinkedIn",value:"linkedin.com/in/sadhasivam-perichi",href:"https://linkedin.com/in/sadhasivam-perichi-160449255/"},{label:"GitHub",value:"github.com/smily-sadha",href:"https://github.com/smily-sadha"},{label:"Mobile",value:"+91 93612 15021",href:"tel:+919361215021"}].map(c=>(<div key={c.label} style={{display:"flex",alignItems:"center",gap:"1.5rem",marginBottom:"0.75rem"}}><span style={{width:"4.5rem",fontSize:"0.65rem",fontFamily:"monospace",color:"#52525b",textTransform:"uppercase",letterSpacing:"0.15em",flexShrink:0}}>{c.label}</span><a href={c.href} style={{fontSize:"0.82rem",fontFamily:"monospace",color:"#a1a1aa",textDecoration:"none",wordBreak:"break-all",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="#fbbf24"} onMouseLeave={e=>e.target.style.color="#a1a1aa"}>{c.value}</a></div>))}</div><a href="mailto:sadhasivamperichi@gmail.com" style={{display:"inline-block",padding:"0.75rem 1.5rem",background:"#d97706",color:"#09090b",fontFamily:"monospace",fontSize:"0.82rem",letterSpacing:"0.08em",textDecoration:"none",transition:"background 0.2s"}} onMouseEnter={e=>e.target.style.background="#fbbf24"} onMouseLeave={e=>e.target.style.background="#d97706"}>Send a message →</a></motion.div></PlainSection>);
}

function Footer() {
  return(<footer style={{borderTop:"1px solid rgba(39,39,42,0.4)",padding:"2rem 1.5rem",background:"#09090b",position:"relative",zIndex:1}}><div style={{maxWidth:"64rem",margin:"0 auto",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"0.5rem"}}><span style={{fontSize:"0.68rem",fontFamily:"monospace",color:"#3f3f46"}}>Sadhasivam Perichi · Sona College of Technology '26</span><span style={{fontSize:"0.68rem",fontFamily:"monospace",color:"#27272a"}}>React · Tailwind · Framer Motion · Three.js</span></div></footer>);
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return(
    <div style={{background:"#09090b",color:"#f4f4f5",minHeight:"100vh",fontFamily:"'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif"}}>
      <ScrollProgressBar/><CursorGlow/><Nav/>
      <main style={{paddingTop:"3.5rem"}}>
        <Hero/>
        <CaseStudies/>
        <Projects/>
        <Skills/>
        <Experience/>
        <Achievements/>
        <Certifications/>
        <About/>
        <Proof/>
        <Contact/>
      </main>
      <Footer/>
    </div>
  );
}