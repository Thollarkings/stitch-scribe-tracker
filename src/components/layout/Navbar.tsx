
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleForm: () => void;
  formVisible: boolean;
}

const Navbar = ({ searchTerm, setSearchTerm, toggleForm, formVisible }: NavbarProps) => {
  return (
    <div className="sticky top-0 z-10 w-full">
      <div className="bg-gradient-to-r from-[#001f3f] via-navy-800 to-indigo-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/6cdf7129-7b9f-42d8-968f-c322feb1f3d8.png" 
                alt="Tailor's Log Book" 
                className="h-12 w-auto" 
              />
              <div>
                <h1 className="text-3xl font-bold font-serif">Tailor's Log Book</h1>
                <p className="text-xs md:text-base text-white/80">Record, track & deliver with precision</p>
              </div>
            </div>
            
            <div className="flex items-center w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search clients..."
                  className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/50 w-full focus-visible:ring-tailor-gold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={toggleForm}
                className="bg-tailor-gold text-tailor-navy hover:bg-tailor-gold/90 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span className="block">{formVisible ? 'Hide Form' : 'New Client'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
