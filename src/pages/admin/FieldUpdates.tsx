import { useEffect, useState } from 'react';
import { 
  getFieldUpdates, 
  type FieldUpdate,
  type FieldStage
} from '../../api/services/fieldupdateService';
import { getFields, type Field } from '../../api/services/fieldService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { 
  FileText, 
  Search,
  Filter,
  Calendar,
  User as UserIcon,
  Map as MapIcon,
  RefreshCw
} from 'lucide-react';

const StageBadge = ({ stage }: { stage: FieldStage }) => {
  const colors = {
    PLANTED: 'bg-blue-100 text-blue-800',
    GROWING: 'bg-emerald-100 text-emerald-800',
    READY: 'bg-amber-100 text-amber-800',
    HARVESTED: 'bg-stone-100 text-stone-800'
  };
  
  return (
    <Badge className={colors[stage]}>
      {stage}
    </Badge>
  );
};

export const FieldUpdates = () => {
  const [updates, setUpdates] = useState<FieldUpdate[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  const fetchUpdates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all fields first
      const fieldsData = await getFields();
      setFields(fieldsData);
      
      // Get updates for each field (admin can see all)
      const allUpdates: FieldUpdate[] = [];
      for (const field of fieldsData) {
        try {
          const fieldUpdates = await getFieldUpdates(field.id);
          allUpdates.push(...fieldUpdates);
        } catch (err) {
          console.error(`Failed to get updates for field ${field.id}:`, err);
        }
      }
      
      // Sort by date (newest first)
      allUpdates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUpdates(allUpdates);
    } catch (err) {
      setError('Failed to fetch field updates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  // Get unique agents from updates
  const uniqueAgents = Array.from(new Set(updates.map(update => update.agent?.name).filter(Boolean)));

  // Filter updates based on search and filters
  const filteredUpdates = updates.filter(update => {
    const matchesSearch = searchTerm === '' || 
      update.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.agent?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.field?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesField = selectedField === '' || update.fieldId.toString() === selectedField;
    const matchesStage = selectedStage === '' || update.stage === selectedStage;
    const matchesAgent = selectedAgent === '' || update.agent?.name === selectedAgent;
    
    return matchesSearch && matchesField && matchesStage && matchesAgent;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedField('');
    setSelectedStage('');
    setSelectedAgent('');
  };

  if (isLoading && updates.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-stone-900">Field Updates</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">Field Updates</h2>
          <p className="text-stone-500 mt-1">Monitor all field updates from your agents</p>
        </div>
        
        <Button onClick={fetchUpdates} variant="outline" className="flex items-center gap-2">
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} className="text-emerald-600" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-stone-400" />
                <Input
                  placeholder="Search notes, agent, field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Field</label>
              <Select value={selectedField} onValueChange={(value) => setSelectedField(value || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="All fields" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All fields</SelectItem>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id.toString()}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Stage</label>
              <Select value={selectedStage} onValueChange={(value) => setSelectedStage(value || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="All stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All stages</SelectItem>
                  <SelectItem value="PLANTED">Planted</SelectItem>
                  <SelectItem value="GROWING">Growing</SelectItem>
                  <SelectItem value="READY">Ready</SelectItem>
                  <SelectItem value="HARVESTED">Harvested</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Agent</label>
              <Select value={selectedAgent} onValueChange={(value) => setSelectedAgent(value || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="All agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All agents</SelectItem>
                  {uniqueAgents.map((agent) => (
                    <SelectItem key={agent} value={agent || ''}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchTerm || selectedField || selectedStage || selectedAgent) && (
            <div className="mt-4">
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear all filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Updates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} className="text-emerald-600" />
            All Updates ({filteredUpdates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {filteredUpdates.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-stone-300 mb-4" />
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                {updates.length === 0 ? 'No updates found' : 'No updates match your filters'}
              </h3>
              <p className="text-stone-500 mb-4">
                {updates.length === 0 
                  ? 'Field agents will start adding updates here' 
                  : 'Try adjusting your filters to see more results'
                }
              </p>
              {updates.length === 0 && (
                <Button onClick={fetchUpdates} variant="outline">
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUpdates.map((update) => (
                  <TableRow key={update.id} className="hover:bg-stone-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <MapIcon size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-stone-900">
                            {update.field?.name || `Field #${update.fieldId}`}
                          </div>
                          <div className="text-xs text-stone-500">ID: {update.fieldId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {update.agent ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                            <UserIcon size={12} className="text-stone-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-stone-900">{update.agent.name}</div>
                            <div className="text-xs text-stone-500">{update.agent.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-stone-400">Unknown</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StageBadge stage={update.stage} />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-stone-600 line-clamp-3">
                          {update.notes}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-stone-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <div>
                          <div className="text-sm">
                            {new Date(update.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs">
                            {new Date(update.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
