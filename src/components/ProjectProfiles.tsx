
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Folder, 
  Plus, 
  Settings, 
  Star,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

interface ProjectProfile {
  id: string;
  name: string;
  description: string;
  enabledPlugins: string[];
  theme: string;
  aliases: Record<string, string>;
  envVars: Record<string, string>;
  isFavorite: boolean;
  lastUsed: Date;
}

interface ProjectProfilesProps {
  onSelectProfile: (profile: ProjectProfile) => void;
  currentProfile?: ProjectProfile;
  isVisible: boolean;
  onClose: () => void;
}

export const ProjectProfiles: React.FC<ProjectProfilesProps> = ({
  onSelectProfile,
  currentProfile,
  isVisible,
  onClose
}) => {
  const [profiles, setProfiles] = useState<ProjectProfile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProfile, setNewProfile] = useState<Partial<ProjectProfile>>({
    name: '',
    description: '',
    enabledPlugins: [],
    theme: 'default',
    aliases: {},
    envVars: {},
    isFavorite: false
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const saved = localStorage.getItem('terminal-profiles');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfiles(parsed.map((p: any) => ({
        ...p,
        lastUsed: new Date(p.lastUsed)
      })));
    } else {
      // Create default profiles
      const defaultProfiles: ProjectProfile[] = [
        {
          id: 'web-dev',
          name: 'Web Development',
          description: 'Frontend development with npm, git, and docker',
          enabledPlugins: ['npm', 'git', 'docker'],
          theme: 'default',
          aliases: {
            'dev': 'npm run dev',
            'build': 'npm run build',
            'test': 'npm test'
          },
          envVars: {},
          isFavorite: true,
          lastUsed: new Date()
        },
        {
          id: 'devops',
          name: 'DevOps',
          description: 'Kubernetes and Docker operations',
          enabledPlugins: ['kubectl', 'docker'],
          theme: 'dark',
          aliases: {
            'k': 'kubectl',
            'pods': 'kubectl get pods',
            'services': 'kubectl get services'
          },
          envVars: {},
          isFavorite: false,
          lastUsed: new Date()
        }
      ];
      setProfiles(defaultProfiles);
      saveProfiles(defaultProfiles);
    }
  };

  const saveProfiles = (updatedProfiles: ProjectProfile[]) => {
    localStorage.setItem('terminal-profiles', JSON.stringify(updatedProfiles));
  };

  const createProfile = () => {
    if (!newProfile.name) return;

    const profile: ProjectProfile = {
      id: Date.now().toString(),
      name: newProfile.name,
      description: newProfile.description || '',
      enabledPlugins: newProfile.enabledPlugins || [],
      theme: newProfile.theme || 'default',
      aliases: newProfile.aliases || {},
      envVars: newProfile.envVars || {},
      isFavorite: false,
      lastUsed: new Date()
    };

    const updated = [...profiles, profile];
    setProfiles(updated);
    saveProfiles(updated);
    setIsCreating(false);
    setNewProfile({
      name: '',
      description: '',
      enabledPlugins: [],
      theme: 'default',
      aliases: {},
      envVars: {},
      isFavorite: false
    });
  };

  const deleteProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    saveProfiles(updated);
  };

  const toggleFavorite = (id: string) => {
    const updated = profiles.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    setProfiles(updated);
    saveProfiles(updated);
  };

  const selectProfile = (profile: ProjectProfile) => {
    const updated = profiles.map(p => 
      p.id === profile.id ? { ...p, lastUsed: new Date() } : p
    );
    setProfiles(updated);
    saveProfiles(updated);
    onSelectProfile(profile);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-4xl mx-4 p-6 bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-zinc-200">Project Profiles</h2>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Profile
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>

          {isCreating && (
            <Card className="p-4 border-zinc-700">
              <div className="space-y-4">
                <h3 className="font-medium text-zinc-200">Create New Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      Profile Name
                    </label>
                    <Input
                      value={newProfile.name}
                      onChange={(e) => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Project"
                      className="bg-zinc-800 border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      Theme
                    </label>
                    <Select 
                      value={newProfile.theme} 
                      onValueChange={(value) => setNewProfile(prev => ({ ...prev, theme: value }))}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Description
                  </label>
                  <Input
                    value={newProfile.description}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Project description..."
                    className="bg-zinc-800 border-zinc-600"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createProfile} size="sm">
                    Create Profile
                  </Button>
                  <Button 
                    onClick={() => setIsCreating(false)} 
                    size="sm" 
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles
              .sort((a, b) => {
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return b.lastUsed.getTime() - a.lastUsed.getTime();
              })
              .map((profile) => (
                <Card 
                  key={profile.id} 
                  className={`p-4 border-zinc-700 cursor-pointer transition-colors hover:border-zinc-600 ${
                    currentProfile?.id === profile.id ? 'border-blue-500 bg-blue-500/5' : ''
                  }`}
                  onClick={() => selectProfile(profile)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-zinc-200">{profile.name}</h3>
                          {profile.isFavorite && (
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-zinc-400 mt-1">{profile.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(profile.id);
                          }}
                        >
                          <Star className={`w-4 h-4 ${profile.isFavorite ? 'text-yellow-400 fill-current' : 'text-zinc-400'}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProfile(profile.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Plugins:</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.enabledPlugins.map((plugin) => (
                            <Badge key={plugin} variant="outline" className="text-xs">
                              {plugin}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {Object.keys(profile.aliases).length > 0 && (
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Aliases:</p>
                          <div className="text-xs font-mono text-zinc-400">
                            {Object.entries(profile.aliases).slice(0, 2).map(([key, value]) => (
                              <div key={key}>{key} → {value}</div>
                            ))}
                            {Object.keys(profile.aliases).length > 2 && (
                              <div className="text-zinc-500">
                                +{Object.keys(profile.aliases).length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-zinc-500">
                      Last used: {profile.lastUsed.toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
