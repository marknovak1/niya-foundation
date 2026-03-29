import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, CheckCircle, MessageSquare, BarChart3, 
  Users, ArrowRight, Star, Loader2 
} from "lucide-react";
import { submitFormWithRateLimit } from "@/hooks/useRateLimitedSubmit";
import { useToast } from "@/hooks/use-toast";
import { surveySchema, validateForm } from "@/lib/formValidation";

type SurveyType = "needs" | "satisfaction" | "impact" | "volunteer";

interface SurveyConfig {
  id: SurveyType;
  title: string;
  description: string;
  icon: typeof ClipboardList;
  questions: {
    id: string;
    question: string;
    type: "text" | "textarea" | "radio" | "checkbox" | "rating";
    options?: string[];
    required?: boolean;
  }[];
}

const surveys: SurveyConfig[] = [
  {
    id: "needs",
    title: "Community Needs Assessment",
    description: "Help us understand the needs of your community to better direct our resources.",
    icon: Users,
    questions: [
      { id: "community", question: "Which community or region do you represent?", type: "text", required: true },
      { id: "primaryNeed", question: "What is the most pressing need in your community?", type: "radio", options: ["Education", "Healthcare", "Economic Opportunities", "Clean Water/Sanitation", "Food Security", "Housing", "Other"], required: true },
      { id: "affectedPopulation", question: "Who is most affected by this need?", type: "checkbox", options: ["Children", "Youth", "Women", "Elderly", "Disabled", "Entire Community"] },
      { id: "currentSupport", question: "What support currently exists for this issue?", type: "textarea" },
      { id: "proposedSolution", question: "What solution do you think would be most effective?", type: "textarea", required: true },
      { id: "urgency", question: "How urgent is this need?", type: "rating", required: true },
    ],
  },
  {
    id: "satisfaction",
    title: "Program Satisfaction Survey",
    description: "Share your experience with our programs to help us improve.",
    icon: MessageSquare,
    questions: [
      { id: "program", question: "Which program did you participate in?", type: "radio", options: ["Education Initiative", "Health & Wellness", "Economic Empowerment", "Environmental Sustainability", "Community Development"], required: true },
      { id: "overallSatisfaction", question: "How satisfied are you with the program overall?", type: "rating", required: true },
      { id: "expectations", question: "Did the program meet your expectations?", type: "radio", options: ["Exceeded expectations", "Met expectations", "Partially met expectations", "Did not meet expectations"], required: true },
      { id: "mostValuable", question: "What was the most valuable aspect of the program?", type: "textarea" },
      { id: "improvements", question: "What improvements would you suggest?", type: "textarea" },
      { id: "recommend", question: "Would you recommend this program to others?", type: "radio", options: ["Definitely yes", "Probably yes", "Not sure", "Probably not", "Definitely not"], required: true },
    ],
  },
  {
    id: "impact",
    title: "Impact Measurement Survey",
    description: "Help us measure the lasting impact of our programs in your life.",
    icon: BarChart3,
    questions: [
      { id: "programParticipated", question: "Which program(s) have you benefited from?", type: "checkbox", options: ["Education Initiative", "Health & Wellness", "Economic Empowerment", "Environmental Sustainability", "Community Development"] },
      { id: "lifeChange", question: "How has the program changed your life?", type: "textarea", required: true },
      { id: "skillsGained", question: "What new skills or knowledge have you gained?", type: "textarea" },
      { id: "incomeChange", question: "If applicable, has your income situation improved?", type: "radio", options: ["Significantly improved", "Somewhat improved", "No change", "Not applicable"] },
      { id: "healthChange", question: "If applicable, has your health situation improved?", type: "radio", options: ["Significantly improved", "Somewhat improved", "No change", "Not applicable"] },
      { id: "overallImpact", question: "Rate the overall impact on your quality of life", type: "rating", required: true },
      { id: "testimonial", question: "Would you like to share a testimonial? (May be used with your permission)", type: "textarea" },
    ],
  },
  {
    id: "volunteer",
    title: "Volunteer Interest Form",
    description: "Tell us about your skills and availability to volunteer with us.",
    icon: ClipboardList,
    questions: [
      { id: "skills", question: "What skills can you offer?", type: "checkbox", options: ["Teaching/Tutoring", "Healthcare", "Business/Finance", "Technology", "Construction", "Agriculture", "Communications/Marketing", "Legal", "Other"] },
      { id: "availability", question: "What is your availability?", type: "radio", options: ["Full-time (40+ hrs/week)", "Part-time (20-40 hrs/week)", "Occasional (5-20 hrs/week)", "Weekends only", "Remote only"], required: true },
      { id: "location", question: "Are you willing to travel or relocate?", type: "radio", options: ["Yes, internationally", "Yes, domestically", "Local only", "Remote only"], required: true },
      { id: "experience", question: "Describe any relevant volunteer or professional experience", type: "textarea" },
      { id: "motivation", question: "What motivates you to volunteer with NIYA Foundation?", type: "textarea", required: true },
      { id: "commitment", question: "How long can you commit to volunteering?", type: "radio", options: ["1-3 months", "3-6 months", "6-12 months", "1+ years", "Flexible"], required: true },
    ],
  },
];

const Surveys = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyType | null>(null);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", email: "" });

  const currentSurvey = surveys.find(s => s.id === selectedSurvey);

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    const current = (responses[questionId] as string[]) || [];
    const updated = checked 
      ? [...current, option]
      : current.filter(o => o !== option);
    handleResponseChange(questionId, updated);
  };

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    // Validate form data
    const validation = validateForm(surveySchema, {
      name: contactInfo.name,
      email: contactInfo.email,
      surveyType: selectedSurvey,
      responses: responses,
    });
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast({
        title: "Validation Error",
        description: "Please fix the validation errors.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const identifier = contactInfo.email || `anonymous-${Date.now()}`;
    
    const result = await submitFormWithRateLimit('survey', {
      survey_type: selectedSurvey,
      respondent_name: contactInfo.name || null,
      respondent_email: contactInfo.email || null,
      responses: responses,
    }, identifier);

    if (result.success) {
      setIsSubmitted(true);
      toast({
        title: "Survey submitted!",
        description: "Thank you for your valuable feedback.",
      });
    } else if (result.isRateLimited) {
      toast({
        title: "Too many submissions",
        description: "Please wait before submitting another survey.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const renderQuestion = (question: SurveyConfig["questions"][0]) => {
    const value = responses[question.id];

    switch (question.type) {
      case "text":
        return (
          <Input
            value={(value as string) || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            required={question.required}
          />
        );

      case "textarea":
        return (
          <textarea
            value={(value as string) || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            required={question.required}
            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-foreground resize-y"
            placeholder="Your answer..."
          />
        );

      case "radio":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  required={question.required}
                  className="h-4 w-4"
                />
                <span className="text-foreground">{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={((value as string[]) || []).includes(option)}
                  onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-foreground">{option}</span>
              </label>
            ))}
          </div>
        );

      case "rating":
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleResponseChange(question.id, rating.toString())}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  value === rating.toString()
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border text-muted-foreground hover:border-secondary/50"
                }`}
              >
                <Star className={`h-5 w-5 ${value === rating.toString() ? "fill-secondary" : ""}`} />
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="section-padding bg-background min-h-[60vh] flex items-center">
          <div className="container-narrow text-center">
            <div className="mb-6 mx-auto inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 text-accent">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              Thank You for Your Feedback!
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Your response has been recorded. Your input is invaluable in helping us 
              improve our programs and better serve our communities.
            </p>
            <Button 
              variant="warm" 
              onClick={() => {
                setIsSubmitted(false);
                setSelectedSurvey(null);
                setResponses({});
              }}
            >
              Take Another Survey
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Share Your Voice
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              Surveys & Feedback
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Your feedback helps us improve our programs and better serve communities. 
              Take a few minutes to share your thoughts and experiences.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide">
          {!selectedSurvey ? (
            <>
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                  Select a Survey
                </h2>
                <p className="text-muted-foreground">
                  Choose the survey that best matches your situation or experience.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {surveys.map((survey) => (
                  <Card 
                    key={survey.id}
                    className="cursor-pointer transition-all duration-200 hover:border-secondary hover:shadow-md"
                    onClick={() => setSelectedSurvey(survey.id)}
                  >
                    <CardHeader>
                      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-secondary">
                        <survey.icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{survey.title}</CardTitle>
                      <CardDescription>{survey.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {survey.questions.length} questions
                        </span>
                        <ArrowRight className="h-5 w-5 text-secondary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setSelectedSurvey(null)}
                className="mb-6 text-sm text-secondary hover:underline flex items-center gap-1"
              >
                ← Back to survey selection
              </button>

              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-secondary">
                    {currentSurvey && <currentSurvey.icon className="h-6 w-6" />}
                  </div>
                  <CardTitle>{currentSurvey?.title}</CardTitle>
                  <CardDescription>{currentSurvey?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contact Info */}
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h3 className="text-sm font-semibold text-foreground mb-4">
                        Your Information (Optional)
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={contactInfo.name}
                            onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={contactInfo.email}
                            onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Questions */}
                    {currentSurvey?.questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <Label className="text-base">
                          {index + 1}. {question.question}
                          {question.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {renderQuestion(question)}
                      </div>
                    ))}

                    {/* Submit */}
                    <div className="pt-4">
                      <Button type="submit" variant="warm" size="lg" className="w-full">
                        Submit Survey
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Data Usage Notice */}
      <section className="py-12 bg-muted/50">
        <div className="container-narrow text-center">
          <p className="text-sm text-muted-foreground">
            Your responses are confidential and will be used to improve our programs. 
            Data may be aggregated for grant applications and annual reports. 
            Read our <a href="/privacy" className="text-secondary hover:underline">Privacy Policy</a> for more information.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Surveys;
