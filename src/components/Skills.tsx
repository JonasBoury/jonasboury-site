import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const skills = {
  expertise: [
    { name: "Product Management", description: "I combine business, tech, and design to discover products that are valuable, feasible, and usable." },
    { name: "Product Strategy", description: "I help teams create and maintain a clear and defined product and go to market strategy." },
    { name: "UX Design", description: "Creating intuitive and user-centered digital experiences" },
    { name: "Project Management", description: "Leading cross-functional teams to deliver successful projects" },
    { name: "Team Management", description: "Building and guiding high-performing teams" },
    { name: "Time Management", description: "Optimizing workflows and prioritizing effectively" },
  ],
  domains: [
    { name: "Energy Sector", description: "7 years of experience in fast-moving and innovative energy projects" },
    { name: "Fintech", description: "Digital solutions for financial and monetary systems" },
    { name: "Community Building", description: "Creating and growing highly engaged online audiences" },
    { name: "Blockchain Technology", description: "Leveraging blockchain when relevant for projects" },
    { name: "Sustainable Economy", description: "Expertise in ecology and sustainable development" },
  ],
  technical: [
    { name: "Low Code", description: "Creating digital products without code in a fraction of the time and cost" },
    { name: "MVPs", description: "Building lean, highly effective MVP experiments to validate assumptions" },
    { name: "CRM Implementations", description: "Setting up and optimizing customer relationship management systems" },
    { name: "B2B Sales", description: "Strategic sales approaches for business-to-business products" },
    { name: "Critical Thinking", description: "Analytical problem-solving and decision-making" },
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
