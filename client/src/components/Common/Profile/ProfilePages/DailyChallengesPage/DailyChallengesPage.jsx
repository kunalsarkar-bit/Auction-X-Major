import React, { useState, useEffect } from 'react';
import { Check, Star, Gift, Trophy, Clock, Sparkles, ChevronRight, Coins } from 'lucide-react';

const DailyChallengesPage = () => {
  const [challenges, setChallenges] = useState([
    { 
      id: 1, 
      title: 'Place your first bid', 
      description: 'Participate in any auction by placing at least one bid', 
      points: 50, 
      completed: false, 
      icon: <Star className="text-yellow-400" />,
      animation: 'animate-pulse'
    },
    { 
      id: 2, 
      title: 'Complete your profile', 
      description: 'Fill out all the information in your profile settings', 
      points: 30, 
      completed: true, 
      icon: <Check className="text-green-500" />,
      animation: 'animate-bounce'
    },
    { 
      id: 3, 
      title: 'Win an auction', 
      description: 'Successfully win at least one auction item', 
      points: 100, 
      completed: false, 
      icon: <Trophy className="text-amber-500" />,
      animation: 'animate-spin'
    },
    { 
      id: 4, 
      title: 'Daily login', 
      description: 'Log in to Auction X every day for a week', 
      points: 20, 
      completed: false, 
      icon: <Clock className="text-blue-500" />,
      animation: 'animate-ping'
    },
    { 
      id: 5, 
      title: 'Refer a friend', 
      description: 'Invite a friend to join Auction X', 
      points: 75, 
      completed: false, 
      icon: <Gift className="text-purple-500" />,
      animation: 'animate-bounce'
    }
  ]);

  const [points, setPoints] = useState(130);
  const [showCoinBurst, setShowCoinBurst] = useState(false);

  const toggleCompletion = (id) => {
    setChallenges(challenges.map(challenge => {
      if (challenge.id === id) {
        const newCompleted = !challenge.completed;
        
        // Add points when marking as complete
        if (newCompleted && !challenge.completed) {
          setPoints(prev => prev + challenge.points);
          setShowCoinBurst(true);
          setTimeout(() => setShowCoinBurst(false), 2000);
        }
        // Remove points when marking as incomplete
        else if (!newCompleted && challenge.completed) {
          setPoints(prev => prev - challenge.points);
        }
        
        return { ...challenge, completed: newCompleted };
      }
      return challenge;
    }));
  };



  const rewards = [
    { name: "Auction Fee Waiver", cost: 200, icon: <Coins className="text-yellow-500" /> },
    { name: "Premium Listing", cost: 350, icon: <Sparkles className="text-purple-500" /> },
    { name: "VIP Auction Access", cost: 500, icon: <Trophy className="text-amber-500" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#191919] p-6 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-6 shadow-lg text-white relative overflow-hidden">
          <div className={`absolute inset-0 flex items-center justify-center ${showCoinBurst ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            {showCoinBurst && Array(20).fill().map((_, i) => (
              <div 
                key={i} 
                className="absolute h-4 w-4 bg-yellow-400 rounded-full"
                style={{
                  animation: `coinBurst 1.5s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Daily Challenges</h1>
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
              <Star className="text-yellow-400 mr-2" />
              <span className="text-xl font-bold text-white">{points} Points</span>
            </div>
          </div>
          <p className="mt-2 max-w-xl">Complete challenges to earn points. Redeem your points for auction benefits and real money!</p>
        </div>
        
        {/* Challenges Section */}
        <div className="bg-white dark:bg-[#303030] rounded-xl shadow-md overflow-hidden mb-6">
          <h2 className="text-xl font-bold p-6 border-b text-gray-900 dark:text-white border-gray-200 dark:border-gray-600">
            Today's Challenges
          </h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {challenges.map(challenge => (
              <li key={challenge.id} className="p-6 hover:bg-gray-50 dark:hover:bg-[#404040]">
                <div className="flex items-center">
                  <div className={`mr-4 ${challenge.completed ? '' : challenge.animation}`}>
                    {challenge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {challenge.description}
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="text-amber-500 font-bold flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {challenge.points} points
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCompletion(challenge.id)}
                    className={`ml-4 px-4 py-2 rounded-lg font-medium ${
                      challenge.completed 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-blue-100 border border-blue-300 dark:border-blue-500'
                    }`}
                  >
                    {challenge.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Rewards Section */}
        <div className="bg-white dark:bg-[#303030] rounded-xl shadow-md overflow-hidden">
          <h2 className="text-xl font-bold p-6 border-b text-gray-900 dark:text-white border-gray-200 dark:border-gray-600">
            Redeem Points
          </h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {rewards.map((reward, index) => (
              <li key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-[#404040]">
                <div className="flex items-center">
                  <div className="mr-4 animate-pulse">
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {reward.name}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <span className="text-amber-500 font-bold flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {reward.cost} points
                      </span>
                    </div>
                  </div>
                  <button
                    className={`ml-4 px-4 py-2 rounded-lg font-medium flex items-center ${
                      points >= reward.cost 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}
                    disabled={points < reward.cost}
                  >
                    Redeem <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes coinBurst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-100px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default DailyChallengesPage;