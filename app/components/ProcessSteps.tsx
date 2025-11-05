"use client";

import { FileText, Upload, CheckCircle, BarChart3 } from "lucide-react";

const ProcessSteps = () => {
  const steps = [
    {
      icon: FileText,
      title: "Create Report",
      description: "Start by creating a new report with our intuitive interface",
      step: 1,
    },
    {
      icon: Upload,
      title: "Upload Data",
      description: "Securely upload your data and supporting documents",
      step: 2,
    },
    {
      icon: CheckCircle,
      title: "Review & Validate",
      description: "Review your submission and validate all information",
      step: 3,
    },
    {
      icon: BarChart3,
      title: "Submit & Track",
      description: "Submit your report and track its progress in real-time",
      step: 4,
    },
  ];

  return (
    <section className="py-20 bg-muted/30 px-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process makes reporting simple and efficient
          </p>
        </div>

        <div className="relative">
          {/* Connection Line - Behind the items */}
          {/* <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 -translate-y-1/2 -z-10" /> */}

          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-medium hover:shadow-strong transition-all animate-fade-in-up hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-4">
                  {/* Circle with gradient background and white icon */}
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-soft animate-pulse-glow">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;