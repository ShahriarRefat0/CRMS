"use client";

import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Lightbulb, UserCircle2 } from 'lucide-react';

const PublicVoice = () => {

  const [ideas, setIdeas] = useState([
    {
      id: 1,
      user: "আরিফ আহমেদ",
      location: "উত্তরা, ঢাকা",
      title: "রাস্তার পাশে সোলার স্ট্রিট লাইট বসানো দরকার",
      description: "আমাদের এলাকার ভেতরের রাস্তাগুলোতে রাতে অনেক অন্ধকার থাকে। সোলার লাইট বসালে বিদ্যুৎ খরচ ছাড়াই নিরাপত্তা বাড়বে।",
      votes: 124,
      comments: 18,
      tags: ["উন্নয়ন", "নিরাপত্তা"],
      liked: false
    },
    {
      id: 2,
      user: "সুমাইয়া আফরোজ",
      location: "জিইসি, চট্টগ্রাম",
      title: "প্লাস্টিক বর্জ্য রিসাইক্লিং বিন স্থাপন",
      description: "রাস্তার মোড়ে মোড়ে প্লাস্টিক ফেলার আলাদা বিন থাকলে ড্রেন জ্যাম হওয়ার সমস্যা অনেক কমে যাবে।",
      votes: 89,
      comments: 12,
      tags: ["পরিবেশ", "বর্জ্য ব্যবস্থাপনা"],
      liked: false
    }
  ]);

  const handleLike = (id) => {
    setIdeas(prevIdeas =>
      prevIdeas.map(idea =>
        idea.id === id
          ? {
              ...idea,
              votes: idea.liked ? idea.votes - 1 : idea.votes + 1,
              liked: !idea.liked
            }
          : idea
      )
    );
  };

  return (
    <section className="bg-white py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Section Header */}
        <div className="flex text-3xl underline items-center gap-2 text-blue-600 font-bold mb-8">
          <Lightbulb size={20} />
          <span>নাগরিক ফোরাম</span>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className=" bg-blue-50 border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"
            >

              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                <UserCircle2 className="text-gray-400" size={24} />
                <div>
                  <h4 className="text-gray-800 font-bold text-sm">{idea.user}</h4>
                  <span className="text-gray-500 text-xs">{idea.location}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                {idea.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">
                {idea.description}
              </p>

              {/* Tags */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {idea.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-gray-200">

                {/* Like Button */}
                <button
                  onClick={() => handleLike(idea.id)}
                  className={`flex items-center gap-2 text-sm font-medium transition-all ${
                    idea.liked
                      ? "text-rose-500"
                      : "text-gray-500 hover:text-rose-500"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={idea.liked ? "currentColor" : "none"}
                  />
                  {idea.votes} লাইক
                </button>

                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">
                  <MessageSquare size={18} />
                  {idea.comments} মন্তব্য
                </button>

                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">
                  <Share2 size={18} />
                  শেয়ার
                </button>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PublicVoice;