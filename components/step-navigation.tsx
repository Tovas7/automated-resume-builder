"use client"

import { CheckCircle2, Circle, Lock } from "lucide-react"

interface Step {
  id: string
  title: string
  description: string
}

interface StepNavigationProps {
  steps: Step[]
  currentStep: number
  completedSteps: Set<number>
  onStepClick: (stepIndex: number) => void
}

export function StepNavigation({ steps, currentStep, completedSteps, onStepClick }: StepNavigationProps) {
  const isStepAccessible = (stepIndex: number) => {
    return completedSteps.has(stepIndex) || stepIndex === currentStep || stepIndex === currentStep + 1
  }

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) return "completed"
    if (stepIndex === currentStep) return "current"
    if (stepIndex < currentStep) return "completed"
    return "upcoming"
  }

  return (
    <div className="w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIndex) => {
              const status = getStepStatus(stepIndex)
              const isAccessible = isStepAccessible(stepIndex)

              return (
                <li key={step.id} className="relative flex-1">
                  {stepIndex !== steps.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-0.5 transition-colors duration-300 ${
                        completedSteps.has(stepIndex) ? "bg-green-500" : "bg-gray-300"
                      }`}
                      style={{ left: "calc(50% + 20px)", width: "calc(100% - 40px)" }}
                    />
                  )}

                  <button
                    onClick={() => isAccessible && onStepClick(stepIndex)}
                    disabled={!isAccessible}
                    className={`relative flex flex-col items-center group transition-all duration-200 ${
                      isAccessible ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                        status === "completed"
                          ? "bg-green-500 text-white"
                          : status === "current"
                            ? "bg-blue-600 text-white ring-4 ring-blue-200"
                            : isAccessible
                              ? "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                              : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isAccessible ? (
                        <Circle className="w-5 h-5" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </span>

                    <div className="mt-2 text-center">
                      <p
                        className={`text-sm font-medium transition-colors duration-200 ${
                          status === "current"
                            ? "text-blue-600"
                            : status === "completed"
                              ? "text-green-600"
                              : isAccessible
                                ? "text-gray-700 group-hover:text-gray-900"
                                : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p
                        className={`text-xs transition-colors duration-200 ${
                          status === "current"
                            ? "text-blue-500"
                            : status === "completed"
                              ? "text-green-500"
                              : isAccessible
                                ? "text-gray-500"
                                : "text-gray-300"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep].title}</h3>
            <span className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">{steps[currentStep].description}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
