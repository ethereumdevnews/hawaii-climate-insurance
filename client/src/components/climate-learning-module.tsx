import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Star, BookOpen, Target, Zap, Gift, Award, CheckCircle2 } from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  points: number;
  category: 'volcano' | 'earthquake' | 'flood' | 'general';
  completed: boolean;
  unlocked: boolean;
}

interface Quiz {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
}

const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'volcano-basics',
    title: 'Hawaii Volcano Basics',
    description: 'Learn about Hawaiian volcanoes, lava zones, and volcanic hazards',
    difficulty: 'beginner',
    duration: 15,
    points: 100,
    category: 'volcano',
    completed: false,
    unlocked: true
  },
  {
    id: 'lava-zones',
    title: 'Understanding Lava Zones',
    description: 'Master the 9 lava zones and their insurance implications',
    difficulty: 'intermediate',
    duration: 20,
    points: 150,
    category: 'volcano',
    completed: false,
    unlocked: false
  },
  {
    id: 'earthquake-prep',
    title: 'Earthquake Preparedness',
    description: 'Seismic safety and ETHquake blockchain insurance',
    difficulty: 'beginner',
    duration: 18,
    points: 120,
    category: 'earthquake',
    completed: false,
    unlocked: true
  },
  {
    id: 'flood-zones',
    title: 'FEMA Flood Zones',
    description: 'Navigate flood insurance and NFIP requirements',
    difficulty: 'intermediate',
    duration: 25,
    points: 180,
    category: 'flood',
    completed: false,
    unlocked: false
  },
  {
    id: 'emergency-planning',
    title: 'Emergency Action Plans',
    description: 'Create family emergency plans for natural disasters',
    difficulty: 'advanced',
    duration: 30,
    points: 200,
    category: 'general',
    completed: false,
    unlocked: false
  },
  {
    id: 'insurance-types',
    title: 'Hawaii Insurance Types',
    description: 'Compare ETHquake, FEMA flood, and volcano insurance',
    difficulty: 'intermediate',
    duration: 22,
    points: 160,
    category: 'general',
    completed: false,
    unlocked: false
  }
];

const QUIZ_QUESTIONS: Quiz[] = [
  {
    id: 'volcano-q1',
    moduleId: 'volcano-basics',
    question: 'Which volcano in Hawaii is currently the most active?',
    options: ['Mauna Loa', 'Kilauea', 'Hualalai', 'Mauna Kea'],
    correctAnswer: 1,
    explanation: 'Kilauea is Hawaii\'s most active volcano and has been erupting almost continuously since 1983.'
  },
  {
    id: 'volcano-q2',
    moduleId: 'volcano-basics',
    question: 'What is the highest risk lava zone in Hawaii?',
    options: ['Zone 9', 'Zone 1', 'Zone 5', 'Zone 3'],
    correctAnswer: 1,
    explanation: 'Lava Zone 1 represents the highest risk areas with the greatest likelihood of lava coverage.'
  },
  {
    id: 'earthquake-q1',
    moduleId: 'earthquake-prep',
    question: 'What makes ETHquake insurance different from traditional earthquake insurance?',
    options: ['Lower cost', 'Blockchain-based parametric coverage', 'No deductibles', 'Instant approval'],
    correctAnswer: 1,
    explanation: 'ETHquake uses blockchain technology and parametric triggers for automatic claim payments based on seismic data.'
  }
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-module',
    title: 'Getting Started',
    description: 'Complete your first learning module',
    icon: '🎓',
    points: 50,
    unlocked: false
  },
  {
    id: 'volcano-expert',
    title: 'Volcano Expert',
    description: 'Complete all volcano-related modules',
    icon: '🌋',
    points: 300,
    unlocked: false
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Score 100% on 5 quizzes',
    icon: '🧠',
    points: 200,
    unlocked: false
  },
  {
    id: 'streak-warrior',
    title: 'Learning Streak',
    description: 'Complete modules 7 days in a row',
    icon: '🔥',
    points: 400,
    unlocked: false
  }
];

export default function ClimateLearningModule() {
  const [modules, setModules] = useState(LEARNING_MODULES);
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Calculate level and progress based on total points
    const newLevel = Math.floor(totalPoints / 500) + 1;
    const progressInLevel = (totalPoints % 500) / 500 * 100;
    setLevel(newLevel);
    setProgress(progressInLevel);
  }, [totalPoints]);

  const startModule = (module: LearningModule) => {
    if (!module.unlocked) return;
    setCurrentModule(module);
    setCurrentQuiz(null);
    setShowExplanation(false);
  };

  const completeModule = () => {
    if (!currentModule) return;

    // Update module completion
    const updatedModules = modules.map(m => 
      m.id === currentModule.id ? { ...m, completed: true } : m
    );

    // Unlock next modules
    const moduleIndex = modules.findIndex(m => m.id === currentModule.id);
    if (moduleIndex < modules.length - 1) {
      updatedModules[moduleIndex + 1].unlocked = true;
    }

    setModules(updatedModules);
    setTotalPoints(prev => prev + currentModule.points);

    // Start quiz
    const quiz = QUIZ_QUESTIONS.find(q => q.moduleId === currentModule.id);
    if (quiz) {
      setCurrentQuiz(quiz);
    }

    // Check achievements
    checkAchievements(updatedModules);
  };

  const submitQuizAnswer = () => {
    if (!currentQuiz || selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    setShowExplanation(true);

    if (isCorrect) {
      setTotalPoints(prev => prev + 50); // Bonus points for correct answer
    }
  };

  const finishQuiz = () => {
    setCurrentModule(null);
    setCurrentQuiz(null);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const checkAchievements = (updatedModules: LearningModule[]) => {
    const completedModules = updatedModules.filter(m => m.completed);
    const volcanoModules = completedModules.filter(m => m.category === 'volcano');

    const newAchievements = achievements.map(achievement => {
      if (achievement.id === 'first-module' && completedModules.length >= 1 && !achievement.unlocked) {
        setTotalPoints(prev => prev + achievement.points);
        return { ...achievement, unlocked: true };
      }
      if (achievement.id === 'volcano-expert' && volcanoModules.length >= 2 && !achievement.unlocked) {
        setTotalPoints(prev => prev + achievement.points);
        return { ...achievement, unlocked: true };
      }
      return achievement;
    });

    setAchievements(newAchievements);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'volcano': return '🌋';
      case 'earthquake': return '🏔️';
      case 'flood': return '🌊';
      case 'general': return '📚';
      default: return '📖';
    }
  };

  // Learning content for current module
  const getModuleContent = () => {
    if (!currentModule) return null;

    const content = {
      'volcano-basics': {
        sections: [
          {
            title: 'Hawaiian Volcanoes Overview',
            content: 'Hawaii is home to 5 major volcanoes: Kilauea, Mauna Loa, Hualalai, Mauna Kea, and Kohala. Kilauea and Mauna Loa are the most active.'
          },
          {
            title: 'Volcanic Hazards',
            content: 'Main hazards include lava flows, volcanic gases (vog), ash fall, and volcanic projectiles. Lava flows are the primary concern for property damage.'
          },
          {
            title: 'Insurance Implications',
            content: 'Properties in lava zones 1-3 often require HPIA coverage as private insurers may not cover volcanic risks in high-risk areas.'
          }
        ]
      },
      'earthquake-prep': {
        sections: [
          {
            title: 'Seismic Activity in Hawaii',
            content: 'Hawaii experiences frequent earthquakes due to volcanic activity and the movement of the Pacific Plate over the Hawaiian hotspot.'
          },
          {
            title: 'ETHquake Insurance',
            content: 'Revolutionary blockchain-based parametric insurance that triggers automatic payments based on recorded seismic data from USGS monitoring stations.'
          },
          {
            title: 'Preparation Steps',
            content: 'Secure heavy objects, create emergency kits, identify safe spots in each room, and practice drop-cover-hold drills.'
          }
        ]
      }
    };

    return content[currentModule.id as keyof typeof content] || null;
  };

  if (currentModule && !currentQuiz) {
    const moduleContent = getModuleContent();
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6" />
            <span>{currentModule.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {moduleContent && (
            <div className="space-y-4">
              {moduleContent.sections.map((section, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">{section.title}</h3>
                  <p className="text-blue-800">{section.content}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setCurrentModule(null)}>
              Back to Modules
            </Button>
            <Button onClick={completeModule}>
              Complete Module (+{currentModule.points} points)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentQuiz) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-6 h-6" />
            <span>Knowledge Check</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-semibold mb-4">{currentQuiz.question}</h3>
            <div className="space-y-2">
              {currentQuiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    selectedAnswer === index
                      ? showExplanation
                        ? index === currentQuiz.correctAnswer
                          ? 'bg-green-100 border-green-500'
                          : 'bg-red-100 border-red-500'
                        : 'bg-blue-100 border-blue-500'
                      : 'bg-white border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {showExplanation && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                <strong>Explanation:</strong> {currentQuiz.explanation}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center">
            {!showExplanation ? (
              <Button 
                onClick={submitQuizAnswer}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={finishQuiz}>
                Continue (+50 points)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Climate Resilience Learning</h2>
              <p className="opacity-90">Level {level} • {totalPoints} points</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5" />
                <span>{streak} day streak</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < level ? 'fill-current' : 'opacity-30'}`} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to Level {level + 1}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6" />
            <span>Learning Modules</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(module => (
              <Card 
                key={module.id}
                className={`cursor-pointer transition-all ${
                  !module.unlocked 
                    ? 'opacity-50 cursor-not-allowed' 
                    : module.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => startModule(module)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{getCategoryIcon(module.category)}</span>
                    {module.completed && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  </div>
                  
                  <h3 className="font-semibold mb-2">{module.title}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{module.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                    <div className="text-sm text-neutral-500">
                      {module.duration} min • {module.points} pts
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-neutral-50 border-neutral-200 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-neutral-600">{achievement.description}</p>
                    <p className="text-sm font-medium text-yellow-600">{achievement.points} points</p>
                  </div>
                  {achievement.unlocked && (
                    <Award className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}