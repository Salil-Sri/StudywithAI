import { useState } from "react";
import {
  User,
  FileText,
  Brain,
  HelpCircle,
  Tag,
  Upload,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import React from "react";

// Mock Sidebar component
const Sidebar = ({ open, currentView, setCurrentView, setOpen }) => (
  <>
    {/* Overlay */}
    {open && (
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
    )}

    {/* Sidebar */}
    <div
      className={`fixed top-0 right-0 h-full bg-gray-900 border-l border-white/10 transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      } w-64 p-4 z-50`}
    >
      <div className="space-y-2 mt-16">
        <button
          onClick={() => {
            setCurrentView("profile");
            setOpen(false);
          }}
          className={`w-full text-left px-4 py-2 rounded ${
            currentView === "profile" ? "bg-indigo-600" : "hover:bg-white/5"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => {
            setCurrentView("notes");
            setOpen(false);
          }}
          className={`w-full text-left px-4 py-2 rounded ${
            currentView === "notes" ? "bg-indigo-600" : "hover:bg-white/5"
          }`}
        >
          My Notes
        </button>
      </div>
    </div>
  </>
);

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState("profile");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [notes, setNotes] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    flashcards: true,
    mcqs: true,
    keywords: true,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setFileName(selected.name);
  };

  const uploadPDF = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("pdf", file);

    setIsUploading(true);

    try {
      const res = await fetch(
        "https://studywithai-1.onrender.com/api/notes/generate",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setNotes(data.data);
        alert("Uploaded Successfully!");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  const parseContent = (content) => {
    const sections = {
      summary: [],
      flashcards: [],
      mcqs: [],
      keywords: [],
    };

    // Extract summary and split into paragraphs or bullet points
    const summaryMatch = content.match(
      /### 1\. Clean Summary\n\n([\s\S]*?)(?=\n---\n|$)/
    );
    if (summaryMatch) {
      const summaryText = summaryMatch[1].trim();

      // Check if summary contains bullet points (starts with * or -)
      if (summaryText.includes("\n* ") || summaryText.includes("\n- ")) {
        // Split by bullet points
        sections.summary = summaryText
          .split(/\n[\*\-]\s+/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      } else {
        // Split by paragraphs (double newlines or single newlines for shorter breaks)
        sections.summary = summaryText
          .split(/\n\n+/)
          .map((para) => para.replace(/\n/g, " ").trim())
          .filter((para) => para.length > 0);
      }
    }

    // Extract flashcards
    const flashcardsMatch = content.match(
      /### 2\. .*Flashcards[\s\S]*?\n\n([\s\S]*?)(?=\n---\n|$)/
    );
    if (flashcardsMatch) {
      const flashcardText = flashcardsMatch[1];
      const flashcardItems = flashcardText.split(/\d+\.\s+\*\*Q:\*\*/);
      flashcardItems.forEach((item) => {
        if (item.trim()) {
          const parts = item.split(/\*\*A:\*\*/);
          if (parts.length === 2) {
            sections.flashcards.push({
              question: parts[0].trim(),
              answer: parts[1].trim(),
            });
          }
        }
      });
    }

    // Extract MCQs
    const mcqsMatch = content.match(
      /### 3\. .*MCQs[\s\S]*?\n\n([\s\S]*?)(?=\n---\n|$)/
    );
    if (mcqsMatch) {
      const mcqText = mcqsMatch[1];
      const mcqItems = mcqText.split(/\d+\.\s+\*\*Question:\*\*/);
      mcqItems.forEach((item) => {
        if (item.trim()) {
          const answerMatch = item.match(/\*\*Answer:\*\*\s*([^\n]+)/);
          const optionsMatch = item.match(/\*\s+[A-D]\)[^\n]+/g);
          const questionMatch = item.match(/^([^\n*]+)/);

          if (questionMatch && answerMatch) {
            sections.mcqs.push({
              question: questionMatch[1].trim(),
              options: optionsMatch
                ? optionsMatch.map((opt) => opt.replace(/^\*\s*/, "").trim())
                : [],
              answer: answerMatch[1].trim(),
            });
          }
        }
      });
    }

    // Extract keywords
    const keywordsMatch = content.match(
      /### 4\. List of Important Keywords\n\n([\s\S]*?)$/
    );
    if (keywordsMatch) {
      const keywordText = keywordsMatch[1];
      sections.keywords = keywordText
        .split("\n")
        .map((line) => line.replace(/^\*\s*/, "").trim())
        .filter((k) => k.length > 0);
    }

    return sections;
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearNotes = () => {
    setNotes(null);
    setFile(null);
    setFileName("");
  };

  const parsedContent = notes ? parseContent(notes.content) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-5 py-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <h2 className="text-lg font-bold">Dashboard</h2>
        <User
          size={26}
          className="cursor-pointer hover:text-indigo-400 transition-colors"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        open={open}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setOpen={setOpen}
      />

      {/* Main Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {/* Loading State */}
        {isUploading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-600/30 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-xl font-semibold mt-6 text-indigo-400">
              Processing Your PDF...
            </p>
            <p className="text-gray-400 mt-2">This may take a few moments</p>
            <div className="flex gap-2 mt-4">
              <div
                className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}

        {currentView !== "notes" && !notes && !isUploading && (
          <div className="flex flex-col items-center mt-12">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Upload Your PDF
              </h1>
              <p className="text-gray-400">
                Transform your documents into smart study materials
              </p>
            </div>

            <label className="w-full max-w-md h-48 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-indigo-500 transition-all group">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Upload
                size={48}
                className="text-gray-600 group-hover:text-indigo-400 transition-colors mb-4"
              />
              <p className="text-gray-400 group-hover:text-white transition-colors">
                Click to Select PDF
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Maximum file size: 10MB
              </p>
            </label>

            {fileName && (
              <div className="mt-6 flex items-center gap-2 bg-green-900/20 border border-green-700/50 px-4 py-2 rounded-lg">
                <FileText size={20} className="text-green-400" />
                <p className="text-green-400">Selected: {fileName}</p>
              </div>
            )}

            <button
              onClick={uploadPDF}
              disabled={!file || isUploading}
              className="mt-6 bg-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload & Generate Notes
                </>
              )}
            </button>
          </div>
        )}

        {/* Display Parsed Notes */}
        {notes && parsedContent && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-6 rounded-xl border border-indigo-500/30">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{notes.title}</h2>
                  <p className="text-gray-400 text-sm">
                    Created: {new Date(notes.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                    <Download size={20} />
                  </button>
                  <button
                    onClick={clearNotes}
                    className="p-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => toggleSection("summary")}
                className="w-full flex justify-between items-center p-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Brain className="text-indigo-400" size={24} />
                  <h3 className="text-xl font-bold">Summary</h3>
                </div>
                {expandedSections.summary ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {expandedSections.summary && (
                <div className="p-5 pt-0 border-t border-white/5">
                  <div className="space-y-4">
                    {parsedContent.summary.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex-shrink-0 mt-2">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        </div>
                        <p className="text-gray-300 leading-relaxed flex-1">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Flashcards Section */}
            <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => toggleSection("flashcards")}
                className="w-full flex justify-between items-center p-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-green-400" size={24} />
                  <h3 className="text-xl font-bold">Flashcards</h3>
                  <span className="text-sm bg-green-900/30 text-green-400 px-2 py-1 rounded">
                    {parsedContent.flashcards.length}
                  </span>
                </div>
                {expandedSections.flashcards ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {expandedSections.flashcards && (
                <div className="p-5 pt-0 space-y-4 border-t border-white/5">
                  {parsedContent.flashcards.map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 p-4 rounded-lg border border-white/10"
                    >
                      <p className="text-green-400 font-semibold mb-2">
                        Q: {card.question}
                      </p>
                      <p className="text-gray-300 pl-4 border-l-2 border-green-400">
                        A: {card.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MCQs Section */}
            <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => toggleSection("mcqs")}
                className="w-full flex justify-between items-center p-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="text-yellow-400" size={24} />
                  <h3 className="text-xl font-bold">
                    Multiple Choice Questions
                  </h3>
                  <span className="text-sm bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded">
                    {parsedContent.mcqs.length}
                  </span>
                </div>
                {expandedSections.mcqs ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {expandedSections.mcqs && (
                <div className="p-5 pt-0 space-y-4 border-t border-white/5">
                  {parsedContent.mcqs.map((mcq, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 p-4 rounded-lg border border-white/10"
                    >
                      <p className="text-yellow-400 font-semibold mb-3">
                        Q{idx + 1}: {mcq.question}
                      </p>
                      <div className="space-y-2 mb-3">
                        {mcq.options.map((option, optIdx) => (
                          <div key={optIdx} className="text-gray-300 pl-4">
                            {option}
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-green-400 font-medium">
                          Answer: {mcq.answer}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Keywords Section */}
            <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => toggleSection("keywords")}
                className="w-full flex justify-between items-center p-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Tag className="text-purple-400" size={24} />
                  <h3 className="text-xl font-bold">Keywords</h3>
                  <span className="text-sm bg-purple-900/30 text-purple-400 px-2 py-1 rounded">
                    {parsedContent.keywords.length}
                  </span>
                </div>
                {expandedSections.keywords ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {expandedSections.keywords && (
                <div className="p-5 pt-0 border-t border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {parsedContent.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-900/30 text-purple-300 px-3 py-1.5 rounded-full text-sm border border-purple-700/50"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
