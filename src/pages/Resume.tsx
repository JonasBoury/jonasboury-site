import { Mail, Phone, MapPin, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { resumeData } from "@/data/resume-data";
import profilePicture from "@/assets/profile-picture.png";
import { Link } from "react-router-dom";

const Resume = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-10">
        <Button variant="outline" size="sm" asChild>
          <Link to="/" className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
      
      <div className="mx-auto max-w-4xl px-6 md:px-12 py-12 md:py-20">
        {/* Header */}
        <header className="mb-12 flex items-start gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-border">
            <AvatarImage src={profilePicture} alt={resumeData.name} />
            <AvatarFallback>JB</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {resumeData.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a href={`tel:${resumeData.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              {resumeData.contact.phone}
            </a>
            <a href={`mailto:hello@jonasboury.com`} className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
              hello@jonasboury.com
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Brussels, Belgium
            </span>
            </div>
          </div>
        </header>

        {/* Intro */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Intro</h2>
          <p className="text-foreground leading-relaxed">
            {resumeData.intro}
          </p>
        </section>

        <Separator className="my-8" />

        {/* Work Experience */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Work Experience</h2>
          
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="current">Current Projects</TabsTrigger>
              <TabsTrigger value="past">Past Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-8">
              {resumeData.currentWork.map((job, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                    <span className="text-sm text-muted-foreground">{job.period}</span>
                  </div>
                  <p className="text-lg text-muted-foreground mb-2">{job.company}</p>
                  <p className="text-foreground leading-relaxed mb-3">
                    {job.description}
                  </p>
                  {job.skills && job.skills.length > 0 && (
                    <ul className="list-disc list-inside text-foreground space-y-1 ml-4">
                      {job.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-8">
              {resumeData.pastWork.map((job, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                    <span className="text-sm text-muted-foreground">{job.period}</span>
                  </div>
                  <p className="text-lg text-muted-foreground mb-2">{job.company}</p>
                  <p className="text-foreground leading-relaxed">
                    {job.description}
                  </p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </section>

        <Separator className="my-8" />

        {/* Education */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Education</h2>
          
          <div className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-foreground">{edu.degree}</h3>
                  <span className="text-sm text-muted-foreground">{edu.period}</span>
                </div>
                <p className="text-lg text-muted-foreground mb-1">{edu.institution}</p>
                <p className="text-foreground">{edu.grade}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Other Education */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Other Education and Certificates</h2>
          
          <div className="space-y-4">
            {resumeData.otherEducation.map((edu, index) => (
              <div key={index}>
                <p className="text-sm text-muted-foreground mb-1">{edu.period}</p>
                <p className="text-foreground font-semibold">{edu.title}</p>
                <p className="text-muted-foreground">{edu.institution}</p>
                <p className="text-foreground mt-2">{edu.description}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Skills Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Skills</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">🌎 General</h3>
              <ul className="space-y-2 text-foreground">
                {resumeData.skills.general.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">🔋 Energy Expertise</h3>
              <ul className="space-y-2 text-foreground">
                {resumeData.skills.energy.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">💻 General IT Skills</h3>
              <ul className="space-y-2 text-foreground">
                {resumeData.skills.it.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">🗣️ Languages</h3>
              <ul className="space-y-2 text-foreground">
                {resumeData.languages.map((lang, i) => (
                  <li key={i}>{lang.language} - {lang.level}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Projects */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Projects / Teamwork and Leadership Experience</h2>
          
          <div className="space-y-6">
            {resumeData.projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                  <span className="text-sm text-muted-foreground">{project.period}</span>
                </div>
                {project.role && (
                  <p className="text-muted-foreground mb-2">{project.role}</p>
                )}
                <p className="text-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Hobbies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Hobbies and Interests</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Hobbies</h3>
              <ul className="space-y-2 text-foreground">
                {resumeData.hobbies.map((hobby, i) => (
                  <li key={i}>{hobby}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Interests</h3>
              <ul className="space-y-2 text-foreground">
                {resumeData.interests.map((interest, i) => (
                  <li key={i}>{interest}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Training */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Training / Coaching</h2>
          <p className="text-foreground">{resumeData.coaching}</p>
        </section>
      </div>
    </div>
  );
};

export default Resume;
