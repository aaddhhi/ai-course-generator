'use client';
import { useState } from 'react';
import { Sparkles, BookOpen, ChevronRight, Lightbulb, Target, CheckCircle2 } from 'lucide-react';

const SUGGESTIONS = ["Cybersecurity Basics", "Modern Art History", "Python for Finance", "Space Exploration"];

export default function Home() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateCourse = async (suggestedTopic?: string) => {
    const finalTopic = suggestedTopic || topic;
    if (!finalTopic) return;
    
    setLoading(true);
    setCourse(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: finalTopic, level }),
      });
      const data = await res.json();
      setCourse(data);
    } catch (error) {
      alert("Error generating course.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Simple Course Architect
          </h1>
          <p className="text-slate-400 text-lg">Adaptive learning paths with professional structure.</p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-2xl mb-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Lightbulb size={14} className="text-yellow-500" /> Topic
              </label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:border-blue-500 transition-all outline-none"
                placeholder="Enter any topic..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Target size={14} className="text-blue-500" /> Skill Level
              </label>
              <select 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 cursor-pointer outline-none"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Quick Selection:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button 
                  key={s}
                  onClick={() => { setTopic(s); generateCourse(s); }}
                  className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-sm hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => generateCourse()}
            disabled={loading || !topic}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            {loading ? 'Building Curriculum...' : 'Forge Course Architecture'}
          </button>
        </div>

        {/* Professional Sidebar/LMS Style Output */}
        {!course && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
            <BookOpen className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 italic">Course structure will be generated here.</p>
          </div>
        )}

        {course && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-blue-400 flex items-center gap-3">
                  <BookOpen size={22} /> {course.title}
                </h2>
                <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
                  {level}
                </span>
              </div>

              <div className="divide-y divide-slate-800/50">
                {course.modules?.map((module: any, i: number) => (
                  <div key={i} className="group">
                    {/* Module Header */}
                    <div className="p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors cursor-default">
                      <div className="flex items-center gap-4">
                        <ChevronRight size={18} className="text-slate-600 group-hover:text-blue-500 group-hover:rotate-90 transition-all" />
                        <span className="text-slate-600 font-mono text-lg">{i + 1}</span>
                        <h3 className="font-bold text-slate-200">{module.name}</h3>
                      </div>
                      <CheckCircle2 size={20} className="text-emerald-500 opacity-80" />
                    </div>

                    {/* Sub-Lessons */}
                    <div className="bg-slate-950/30 pb-4">
                      {module.lessons?.map((lesson: string, j: number) => (
                        <div key={j} className="ml-14 mr-6 my-1 p-3 rounded-xl flex items-center justify-between hover:bg-slate-800/50 border border-transparent hover:border-slate-800 transition-all cursor-pointer group/item">
                          <span className="text-sm text-slate-400 group-hover/item:text-slate-200 transition-colors">
                            {i+1}.{j+1} {lesson}
                          </span>
                          <CheckCircle2 size={14} className="text-slate-800 group-hover/item:text-emerald-500 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
