import { RESOURCES } from '@/lib/constants';
import { ClayCard } from '@/components/ui/ClayCard';
import { Bot, Sparkles, Layout, Code, Terminal, ExternalLink, Video, FileText, Briefcase, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesPage() {
  const iconMap: Record<string, any> = {
    Bot, Sparkles, Layout, Code, Terminal, Video, FileText, Briefcase, BookOpen
  };

  const categories = Array.from(new Set(RESOURCES.map(r => r.category)));

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Important Resources</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Curated tools, courses, and links to help you excel in Computer Science.</p>
      </div>

      <div className="mb-12">
        <Link href="https://www.saranathan.ac.in/cse_materials.html" target="_blank" rel="noopener noreferrer">
          <ClayCard className="flex flex-col md:flex-row items-center gap-6 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition-transform text-white border-0 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-white/20 flex flex-shrink-0 items-center justify-center backdrop-blur-sm">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                LearnVista <ExternalLink className="w-5 h-5 opacity-75" />
              </h2>
              <p className="text-white/80 text-lg">Official CSE Department Materials & Subject Resources</p>
            </div>
          </ClayCard>
        </Link>
      </div>

      <div className="space-y-16">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
              {category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RESOURCES.filter(r => r.category === category).map(resource => {
                const IconComponent = iconMap[resource.icon] || ExternalLink;
                
                return (
                  <Link href={resource.link} key={resource.id} target="_blank" rel="noopener noreferrer">
                    <ClayCard className="h-full flex flex-col hover:scale-[1.02] transition-transform group">
                      <div className="w-12 h-12 rounded-2xl bg-department/10 text-department flex items-center justify-center mb-4 group-hover:bg-department group-hover:text-white transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-between">
                        {resource.title}
                        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
                        {resource.description}
                      </p>
                    </ClayCard>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
