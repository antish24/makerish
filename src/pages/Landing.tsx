import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates } from '../templates/data';
import { TemplateCategory } from '../types/brochure';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Award, Users, ChevronRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');

    const categories: { id: TemplateCategory | 'all'; label: string; icon: any }[] = [
        { id: 'all', label: 'All Templates', icon: FileText },
        { id: 'certificate', label: 'Certificates', icon: Award },
        { id: 'cv', label: 'CV / Resume', icon: FileText },
        { id: 'brochure', label: 'Brochures', icon: Shield },
        { id: 'brothers', label: 'Brothers', icon: Users },
    ];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-12">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200 py-10 mb-6">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                        Professional <span className="text-blue-600">Design</span> Companion
                    </h1>
                    <p className="text-base text-slate-600 max-w-xl mx-auto mb-6">
                        Create stunning certificates, CVs, and brochures in minutes.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.id ? "default" : "outline"}
                                size="sm"
                                className={`rounded-full px-5 py-2 h-auto transition-all duration-200 ${selectedCategory === cat.id ? 'shadow-md shadow-blue-200' : 'hover:bg-blue-50 hover:text-blue-600'}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                <cat.icon className="mr-2 h-4 w-4" />
                                {cat.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredTemplates.map((template) => (
                        <Card key={template.id} className="group overflow-hidden border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex flex-col">
                            <div className="aspect-[3/2] bg-slate-100 flex items-center justify-center relative bg-gradient-to-br from-slate-200 to-slate-200 border-b overflow-hidden">
                                {/* Placeholder for template preview */}
                                <div className="text-slate-400 absolute inset-0 flex flex-col items-center justify-center scale-75 opacity-20">
                                    <FileText className="h-12 w-12 mb-1" />
                                </div>
                                <div
                                    className="w-[85%] h-[85%] bg-white shadow-md rounded transform group-hover:scale-105 transition-transform duration-500 flex flex-col p-3 border border-white"
                                    style={{ borderColor: template.themeColor + '30' }}
                                >
                                    <div className="w-6 h-6 rounded-full mb-2" style={{ backgroundColor: template.themeColor }}></div>
                                    <div className="h-2 w-2/3 bg-slate-100 rounded mb-1.5"></div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded mb-1"></div>
                                    <div className="h-1.5 w-5/6 bg-slate-50 rounded"></div>
                                    <div className="mt-auto flex justify-end">
                                        <div className="h-4 w-1/3 rounded" style={{ backgroundColor: template.themeColor + '08' }}></div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/[0.02] transition-colors duration-300"></div>
                            </div>
                            <CardHeader className="p-3 pb-0">
                                <Badge variant="outline" className="w-fit capitalize text-[9px] py-0 px-1.5 border-blue-100 text-blue-600 bg-blue-50/30 font-bold mb-1">
                                    {template.category}
                                </Badge>
                                <CardTitle className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {template.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-1.5 flex-1 flex flex-col">
                                <CardDescription className="text-[11px] mb-3 line-clamp-2 leading-tight">
                                    {template.category} template • {template.layout}
                                </CardDescription>
                                <Button
                                    size="sm"
                                    className="w-full mt-auto text-[11px] h-8 font-bold"
                                    onClick={() => navigate(`/editor?template=${template.id}`)}
                                >
                                    Customize
                                    <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="text-center py-20 grayscale opacity-50">
                        <FileText className="h-20 w-20 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-medium text-slate-600">No templates found in this category</h3>
                        <p className="text-slate-400">Try selecting another category or view all templates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Landing;
