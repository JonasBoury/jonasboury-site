import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const skills = {
  expertise: [
    { name: "AI & LLM Engineering", description: "Building AI agents, RAG systems, and LLM-powered tools that solve real business problems." },
    { name: "Product Management", description: "Combining business, tech, and design to discover products that are valuable, feasible, and usable." },
    { name: "Product Strategy", description: "Creating and executing clear product and go-to-market strategies." },
    { name: "UX Design", description: "Creating intuitive and user-centered digital experiences." },
    { name: "Team Management", description: "Building and guiding high-performing technical teams." },
  ],
  domains: [
    { name: "AI & Automation", description: "Custom AI software replacing SaaS subscriptions, agent architectures, workflow automation." },
    { name: "Fintech & Payments", description: "Payment infrastructure, community currencies, Web3 financial systems." },
    { name: "Energy Sector", description: "6 years of experience in renewable energy trading and platform development." },
    { name: "Community Building", description: "Creating and growing engaged communities around products and missions." },
    { name: "Blockchain & Web3", description: "Smart contracts, onchain payments, wallet infrastructure." },
  ],
  technical: [
    { name: "Full-Stack Development", description: "React, TypeScript, Next.js, Node.js, Flutter, Tailwind." },
    { name: "AI/ML Stack", description: "LLMs, RAG, vector databases, agent frameworks, prompt engineering." },
    { name: "Cloud & DevOps", description: "Supabase, Cloudflare, Vercel, GitHub Actions, Docker." },
    { name: "MVPs & Prototyping", description: "Building lean, effective experiments to validate assumptions fast." },
    { name: "Data & Analytics", description: "SQL, data pipelines, business intelligence, metrics-driven decisions." },
  ]
};

const Skills = () => {
  return (
    <section id="skills" className="min-h-screen px-6 md:px-12 py-20 pb-32 md:pb-20">
      <div className="mx-auto max-w-3xl w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-muted-foreground">#</span>
            Skills & Expertise
          </h2>
          <p className="text-sm text-muted-foreground">
            Key competencies and areas of specialization
          </p>
        </div>

        <Tabs defaultValue="expertise" className="w-full">
          <TabsList className="bg-transparent gap-2 mb-6 h-auto p-0">
            <TabsTrigger 
              value="expertise" 
              className="rounded-full bg-muted/80 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md px-4 py-2 text-sm font-medium transition-all duration-200"
            >
              Expertise
            </TabsTrigger>
            <TabsTrigger 
              value="domains" 
              className="rounded-full bg-muted/80 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md px-4 py-2 text-sm font-medium transition-all duration-200"
            >
              Domain Knowledge
            </TabsTrigger>
            <TabsTrigger 
              value="technical" 
              className="rounded-full bg-muted/80 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md px-4 py-2 text-sm font-medium transition-all duration-200"
            >
              Technical Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expertise" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.expertise.map((skill, index) => (
                <Card key={index} className="border-border bg-card hover:shadow-sm transition-all duration-200 rounded-[20px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">{skill.name}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {skill.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="domains" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.domains.map((skill, index) => (
                <Card key={index} className="border-border bg-card hover:shadow-sm transition-all duration-200 rounded-[20px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">{skill.name}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {skill.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technical" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.technical.map((skill, index) => (
                <Card key={index} className="border-border bg-card hover:shadow-sm transition-all duration-200 rounded-[20px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">{skill.name}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {skill.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Skills;
