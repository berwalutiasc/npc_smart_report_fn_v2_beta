"use client";

import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle } from "lucide-react";

const ContactHelp = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "npcinnovationhub@gmail.com",
      action: "Send Email",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+250788640283",
      action: "Call Now",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available 24/7",
      action: "Start Chat",
    },
  ];

  return (
    <section className="py-20 bg-background px-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Need Help?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our support team is here to assist you every step of the way
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-8 shadow-medium hover:shadow-strong transition-all text-center animate-fade-in-up hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <method.icon className="w-8 h-8 text-white font-bold" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {method.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {method.description}
              </p>
              <Button variant="outline" className="w-full">
                {method.action}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactHelp;
