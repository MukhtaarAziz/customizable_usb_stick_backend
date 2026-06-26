import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons'
import './DesignStepper.css'

function DesignStepper({ activeStep, locale, langText }) {
  const [animatingStep, setAnimatingStep] = useState(null)
  const [prevStep, setPrevStep] = useState(activeStep)

  const steps = [
    { num: 1, label: langText?.step1 || (locale === 'ar' ? 'اختيار USB' : 'Choose USB') },
    { num: 2, label: langText?.step2 || (locale === 'ar' ? 'اختيار الألعاب' : 'Choose Games') },
    { num: 3, label: langText?.step3 || (locale === 'ar' ? 'المراجعة والدفع' : 'Review & Pay') },
  ]

  // Detect step changes for animation
  useEffect(() => {
    if (activeStep !== prevStep) {
      setAnimatingStep(activeStep)
      setPrevStep(activeStep)
      const timer = setTimeout(() => setAnimatingStep(null), 600)
      return () => clearTimeout(timer)
    }
  }, [activeStep, prevStep])

  const getStepState = (stepNum) => {
    if (activeStep === 4) return 'completed'
    if (activeStep > stepNum) return 'completed'
    if (activeStep === stepNum) return 'active'
    return 'pending'
  }

  const getProgressWidth = () => {
    if (activeStep === 4) return '100%'
    return `${((activeStep - 1) / (steps.length - 1)) * 100}%`
  }

  const getStatusText = () => {
    if (activeStep === 4) return locale === 'ar' ? 'تم إكمال الطلب بنجاح' : 'Order completed successfully'
    return steps.find(s => s.num === activeStep)?.label || ''
  }

  return (
    <div className="ds-container">
      <div className="ds-track">
        {/* Progress bar background */}
        <div className="ds-track__bg" />
        
        {/* Animated progress fill */}
        <div 
          className="ds-track__fill" 
          style={{ width: getProgressWidth() }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const state = getStepState(step.num)
          const isAnimating = animatingStep === step.num
          const isCompleted = state === 'completed'
          const isActive = state === 'active'

          return (
            <div
              key={step.num}
              className={`
                ds-node
                ds-node--${state}
                ${isAnimating ? 'ds-node--animate' : ''}
              `}
            >
              {/* Step circle */}
              <div className="ds-node__circle">
                {isCompleted ? (
                  <FontAwesomeIcon icon={faCheck} className="ds-node__check" />
                ) : (
                  <span className="ds-node__number">{step.num}</span>
                )}
                
                {/* Pulse ring for active step */}
                {isActive && (
                  <>
                    <div className="ds-node__ring ds-node__ring--1" />
                    <div className="ds-node__ring ds-node__ring--2" />
                  </>
                )}
              </div>

              {/* Label */}
              <div className="ds-node__label-wrap">
                <span className="ds-node__label">{step.label}</span>
              </div>

              {/* Connector line (after each step except last) */}
              {index < steps.length - 1 && (
                <div className={`
                  ds-connector
                  ${isCompleted ? 'ds-connector--active' : ''}
                  ${isActive ? 'ds-connector--partial' : ''}
                `} />
              )}
            </div>
          )
        })}
      </div>

      {/* Status indicator */}
      <div className="ds-status">
        <div className="ds-status__dot" />
        <span className="ds-status__text" key={activeStep}>{getStatusText()}</span>
      </div>
    </div>
  )
}

export default DesignStepper