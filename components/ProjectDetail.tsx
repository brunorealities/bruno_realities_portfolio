
import React, { useEffect } from 'react';

interface Project {
  title: string;
  desc: string;
  longDesc: string;
  image: string;
  tag?: string;
  date?: string;
  location?: string;
}

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#F2F0ED] overflow-y-auto px-10 py-20 text-black">
      <div className="max-w-7xl mx-auto mb-20">
        <button 
          onClick={onBack}
          className="font-display-bold text-[10px] uppercase tracking-widest border-b border-black/10 pb-2 hover:border-black transition-all"
        >
          ← Return_To_Archive
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-24 items-start">
          <div className="md:col-span-5 reveal active">
            <h2 className="metadata-label mb-12">
              {project.tag} // {project.date}
            </h2>
            <h1 className="font-display-bold text-7xl md:text-9xl uppercase tracking-tighter-massive leading-[0.8] mb-16">
              {project.title}
            </h1>
            <p className="font-display-serif italic text-3xl md:text-4xl text-black leading-tight mb-16">
              {project.desc}
            </p>
            <div className="h-[0.5px] w-full bg-black/10 mb-16" />
            <div className="font-sans text-[14px] leading-loose text-black/70 space-y-8 max-w-md">
              {project.longDesc.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 reveal active">
            <div className="aspect-[4/5] overflow-hidden bg-black/5 border border-black/5">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s] ease-out"
              />
            </div>
            {project.location && (
              <p className="mt-12 metadata-label text-right italic">
                Actuation_Terminal: {project.location}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-black/10 pt-16 mt-40 mb-20 flex justify-between items-center metadata-label">
        <div>Bruno Realities // Archive Protocol</div>
        <div className="italic">Metadata Secure V.2.5</div>
      </div>
    </div>
  );
};

export default ProjectDetail;
