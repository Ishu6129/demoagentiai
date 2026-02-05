 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { CheckCircle2, Sparkles, FileText, Code2, Trophy } from 'lucide-react';
 import { RefinementOutput } from '@/types/agent';
 import { cn } from '@/lib/utils';
 
 interface FinalOutputCardProps {
   output: RefinementOutput;
   goalType: 'internship' | 'fibonacci';
 }
 
 export function FinalOutputCard({ output, goalType }: FinalOutputCardProps) {
   const isCodeOutput = goalType === 'fibonacci';
 
   return (
     <Card className="border-2 border-agent-complete/50 bg-gradient-to-br from-agent-complete/5 to-transparent shadow-xl shadow-agent-complete/10">
       <CardHeader className="pb-4">
         <div className="flex items-center justify-between">
           <CardTitle className="flex items-center gap-3">
             <div className="relative">
               <div className="absolute inset-0 bg-agent-complete/20 rounded-full blur-md animate-pulse" />
               <div className="relative p-2 bg-agent-complete/10 rounded-full">
                 <Trophy className="h-6 w-6 text-agent-complete" />
               </div>
             </div>
             <div>
               <h3 className="text-xl font-bold">Final Output</h3>
               <p className="text-sm text-muted-foreground font-normal">Autonomous agent completed</p>
             </div>
           </CardTitle>
           <Badge className="bg-agent-complete/20 text-agent-complete border-agent-complete/30 gap-1.5 px-3 py-1">
             <CheckCircle2 className="h-3.5 w-3.5" />
             Complete
           </Badge>
         </div>
       </CardHeader>
       
       <CardContent className="space-y-6">
         {/* Improvements Applied */}
         <div className="space-y-3">
           <h4 className="text-sm font-semibold flex items-center gap-2">
             <Sparkles className="h-4 w-4 text-agent-complete" />
             Improvements Applied ({output.improvements.length})
           </h4>
           <div className="grid gap-2">
             {output.improvements.map((improvement, index) => (
               <div 
                 key={index}
                 className="flex items-start gap-3 p-2.5 rounded-lg bg-agent-complete/5 border border-agent-complete/10"
               >
                 <CheckCircle2 className="h-4 w-4 text-agent-complete mt-0.5 shrink-0" />
                 <span className="text-sm">{improvement}</span>
               </div>
             ))}
           </div>
         </div>
 
         {/* Output Comparison */}
         <Tabs defaultValue="refined" className="w-full">
           <TabsList className="grid w-full grid-cols-2 bg-muted/50">
             <TabsTrigger value="original" className="gap-2 data-[state=active]:bg-background">
               <FileText className="h-4 w-4" />
               Original
             </TabsTrigger>
             <TabsTrigger value="refined" className="gap-2 data-[state=active]:bg-agent-complete/10 data-[state=active]:text-agent-complete">
               {isCodeOutput ? <Code2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
               Refined
             </TabsTrigger>
           </TabsList>
           
           <TabsContent value="original" className="mt-4">
             <ScrollArea className="h-[350px]">
               <div className={cn(
                 "rounded-lg p-4",
                 isCodeOutput 
                  ? "bg-secondary font-mono text-sm" 
                   : "bg-muted/50 text-sm"
               )}>
                 <pre className="whitespace-pre-wrap">{output.original}</pre>
               </div>
             </ScrollArea>
           </TabsContent>
           
           <TabsContent value="refined" className="mt-4">
             <ScrollArea className="h-[350px]">
               <div className={cn(
                 "rounded-lg p-4 border-2 border-agent-complete/20",
                 isCodeOutput 
                  ? "bg-secondary font-mono text-sm" 
                   : "bg-agent-complete/5 text-sm prose prose-sm max-w-none dark:prose-invert"
               )}>
                 <pre className="whitespace-pre-wrap">{output.refined}</pre>
               </div>
             </ScrollArea>
           </TabsContent>
         </Tabs>
       </CardContent>
     </Card>
   );
 }