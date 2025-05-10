
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";

import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Innovation from "@/pages/Innovation";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import ScheduleClass from "@/pages/ScheduleClass";
import LiveClass from "@/pages/LiveClass";
import AIAssistant from "@/pages/AIAssistant";
import QuizBattle from "@/pages/QuizBattle";
import Classes from "@/pages/Classes";
import CareerAdvisor from "@/pages/CareerAdvisor";
import ResumeBuilder from "@/pages/ResumeBuilder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="innovation" element={<Innovation />} />
              <Route path="login" element={<Login />} />
              <Route path="schedule-class" element={<ScheduleClass />} />
              <Route path="class/:classId" element={<LiveClass />} />
              <Route path="teach-class/:classId" element={<LiveClass />} />
              <Route path="assistant" element={<AIAssistant />} />
              <Route path="quiz" element={<QuizBattle />} />
              <Route path="classes" element={<Classes />} />
              <Route path="career-advisor" element={<CareerAdvisor />} />
              <Route path="resume-builder" element={<ResumeBuilder />} />
              <Route path="resume-builder/:resumeId" element={<ResumeBuilder />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
