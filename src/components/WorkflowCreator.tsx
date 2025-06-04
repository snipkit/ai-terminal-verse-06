
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Plus, Minus, Wand2, Download } from 'lucide-react';

const argumentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  default_value: z.string().optional(),
  required: z.boolean().default(true),
});

const workflowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  command: z.string().min(1, 'Command is required'),
  description: z.string().optional(),
  tags: z.string().optional(),
  arguments: z.array(argumentSchema).optional(),
  author: z.string().optional(),
  source_url: z.string().url().optional().or(z.literal('')),
});

type WorkflowFormData = z.infer<typeof workflowSchema>;

interface WorkflowCreatorProps {
  onSave?: (workflow: WorkflowFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<WorkflowFormData>;
}

export const WorkflowCreator: React.FC<WorkflowCreatorProps> = ({
  onSave,
  onCancel,
  initialData
}) => {
  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: '',
      command: '',
      description: '',
      tags: '',
      arguments: [],
      author: '',
      source_url: '',
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'arguments',
  });

  const onSubmit = (data: WorkflowFormData) => {
    onSave?.(data);
  };

  const generateWithAI = async () => {
    const description = form.getValues('description');
    if (!description) {
      alert('Please enter a description first');
      return;
    }

    // Simulate AI generation - in real implementation, call OpenAI API
    try {
      // This would be replaced with actual AI API call
      const mockResponse = {
        name: 'AI Generated Workflow',
        command: `echo "Generated from: ${description}"`,
        tags: 'ai,generated',
      };

      form.setValue('name', mockResponse.name);
      form.setValue('command', mockResponse.command);
      form.setValue('tags', mockResponse.tags);
    } catch (error) {
      console.error('AI generation failed:', error);
    }
  };

  const exportYAML = () => {
    const data = form.getValues();
    const tagsArray = data.tags ? data.tags.split(',').map(t => t.trim()) : [];
    
    const yamlContent = `name: ${data.name}
command: "${data.command}"
${data.description ? `description: "${data.description}"` : ''}
${tagsArray.length > 0 ? `tags:\n${tagsArray.map(tag => `  - ${tag}`).join('\n')}` : ''}
${data.arguments && data.arguments.length > 0 ? `arguments:\n${data.arguments.map(arg => `  - name: ${arg.name}\n    description: "${arg.description || ''}"\n    required: ${arg.required}`).join('\n')}` : ''}
${data.author ? `author: ${data.author}` : ''}
${data.source_url ? `source_url: "${data.source_url}"` : ''}`;

    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.toLowerCase().replace(/\s+/g, '-')}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-200">Create Workflow</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportYAML} size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export YAML
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 bg-zinc-900 border-zinc-700">
              <div className="space-y-4">
                <h3 className="font-medium text-zinc-200">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., Deploy to Production"
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          placeholder="Describe what this workflow does..."
                          className="bg-zinc-800 border-zinc-700"
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={generateWithAI}
                          className="p-0 h-auto font-normal text-blue-400 hover:text-blue-300"
                        >
                          <Wand2 className="w-3 h-3 mr-1" />
                          Generate with AI
                        </Button>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="git, deployment, docker (comma-separated)"
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated tags for categorization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Card className="p-4 bg-zinc-900 border-zinc-700">
              <div className="space-y-4">
                <h3 className="font-medium text-zinc-200">Command</h3>
                
                <FormField
                  control={form.control}
                  name="command"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Command</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          placeholder="git push origin {{branch_name}}"
                          className="bg-zinc-800 border-zinc-700 font-mono"
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Use {'{{argument_name}}'} for placeholders
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="Your name"
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source URL (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="https://docs.example.com"
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </div>

          {/* Arguments */}
          <Card className="p-4 bg-zinc-900 border-zinc-700">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-zinc-200">Arguments</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: '', description: '', default_value: '', required: true })}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Argument
                </Button>
              </div>

              {fields.length === 0 ? (
                <p className="text-zinc-500 text-sm">No arguments defined</p>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-zinc-800 rounded border border-zinc-700">
                      <FormField
                        control={form.control}
                        name={`arguments.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="branch_name"
                                className="bg-zinc-900 border-zinc-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`arguments.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="The branch to push"
                                className="bg-zinc-900 border-zinc-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`arguments.${index}.default_value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Value</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="main"
                                className="bg-zinc-900 border-zinc-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end gap-2">
                        <FormField
                          control={form.control}
                          name={`arguments.${index}.required`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Required</FormLabel>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="rounded border-zinc-600"
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="submit">
              Save Workflow
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
