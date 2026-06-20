'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { type MotionProps, motion } from 'framer-motion'

interface TimelineContentProps {
  as?: React.ElementType
  animationNum: number
  timelineRef: React.RefObject<HTMLDivElement | null>
  customVariants: {
    visible: (i: number) => MotionProps['variants']
    hidden: MotionProps['variants']
  }
  className?: string
  children?: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface TimelineContentRef {
  startAnimation: () => void
  reset: () => void
}

const TimelineContent = forwardRef<TimelineContentRef, TimelineContentProps>(
  (
    {
      as: Component = 'div',
      animationNum,
      timelineRef,
      customVariants,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isInView, setIsInView] = useState(false)
    const elementRef = useRef<HTMLElement>(null)

    const startAnimation = useCallback(() => {
      setIsInView(true)
    }, [])

    const reset = useCallback(() => {
      setIsInView(false)
    }, [])

    useImperativeHandle(ref, () => ({
      startAnimation,
      reset,
    }))

    useEffect(() => {
      if (!timelineRef?.current || !elementRef.current) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true)
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      )

      observer.observe(elementRef.current)

      return () => {
        observer.disconnect()
      }
    }, [timelineRef])

    const motionProps = {
      initial: 'hidden',
      animate: isInView ? 'visible' : 'hidden',
      variants: {
        hidden: customVariants.hidden,
        visible: customVariants.visible(animationNum),
      },
    }

    return (
      <motion.div {...motionProps}>
        <Component ref={elementRef} className={className} {...props}>
          {children}
        </Component>
      </motion.div>
    )
  }
)

TimelineContent.displayName = 'TimelineContent'

export { TimelineContent }
