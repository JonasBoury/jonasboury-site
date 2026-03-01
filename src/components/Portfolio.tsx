import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const currentProjects = [
  {
    title: "Citizen Pay",
    description: "Complete payment infrastructure accepting any currency seamlessly - traditional, stablecoins, or custom tokens. Hybrid Web2 + Web3 payment platform with instant transactions, full compliance, and 100% onchain capabilities.",
    tags: ["Payments", "Web3", "Fintech"],
    link: "https://citizenpay.xyz/",
    period: "Present"
  },
  {
    title: "Spark Collective",
    description: "Digital platform for the Spark Collective community, fostering collaboration and connection within the ecosystem.",
    tags: ["Community", "Platform", "Digital Tools"],
    link: "https://sparkcollective.be/",
    period: "Present"
  },
  {
    title: "Citizen Wallet",
    description: "Citizen Wallet is an open source web3 mobile wallet to support community currency projects. Instead of focusing on trading and investing it focuses on real world transactions and easy onboarding of new users into Web3.",
    tags: ["Web3", "Fintech", "Community Currencies"],
    link: "https://citizenwallet.xyz/",
    period: "Sept 2023 - Present"
  },
  {
    title: "BE.IMPACT",
    description: "Building the community platform for a non-profit network organization that supports sustainable and social impact companies. Responsible for the digital platform and tools to manage and grow the ecosystem.",
    tags: ["Product Management", "Platform Development", "Impact"],
    link: "https://beimpact.org/",
    period: "April 2023 - Present"
  }
];

const pastProjects = [
  {
    title: "Yuso",
    description: "Energy startup integrating renewable energy into current energy markets. Started as renewable energy trader and portfolio manager, later became responsible for developing all web applications and coordinating the IT team.",
    tags: ["Energy", "B2B", "Platform Development"],
    link: "https://yuso.com",
    period: "November 2015 - October 2021"
  },
  {
    title: "BloomUp",
    description: "Startup providing instant access to online mental health support. Contributed to the development of the MVP during the pandemic. BloomUp is growing into a successful social enterprise.",
    tags: ["HealthTech", "MVP", "Social Impact"],
    link: "https://www.bloomup.org/",
    period: "April 2020 - January 2021"
  }
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="min-h-screen px-6 md:px-12 py-20">
      <div className="mx-auto max-w-3xl w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-muted-foreground">#</span>
            Selected Work
          </h2>
          <p className="text-sm text-muted-foreground">
            A collection of projects I've worked on
          </p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="bg-transparent gap-2 mb-6 h-auto p-0">
            <TabsTrigger 
              value="current" 
              className="rounded-full bg-muted/80 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md px-4 py-2 text-sm font-medium transition-all duration-200"
            >
              Current
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="rounded-full bg-muted/80 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md px-4 py-2 text-sm font-medium transition-all duration-200"
            >
              Past
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
            {currentProjects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card 
                  className="group hover:shadow-sm transition-all duration-200 cursor-pointer border-border bg-card rounded-[20px]"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <CardTitle className="text-lg font-semibold group-hover:text-foreground/80 transition-colors">
                            {project.title}
                          </CardTitle>
                          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{project.period}</p>
                        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                          {project.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastProjects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card 
                  className="group hover:shadow-sm transition-all duration-200 cursor-pointer border-border bg-card rounded-[20px]"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <CardTitle className="text-lg font-semibold group-hover:text-foreground/80 transition-colors">
                            {project.title}
                          </CardTitle>
                          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{project.period}</p>
                        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                          {project.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Portfolio;
