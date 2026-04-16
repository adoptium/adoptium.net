'use client'

import React from "react"
import styles from "./AnimatedPlaceholder.module.css"

interface Props {
  children?: React.ReactNode
}

const AnimatedPlaceholder: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.animatedPlaceholder}>
      {/* Prefer external skeleton structure or render default in case not passed */}
      {children}
      {!children && (
        <>
          <div className={styles.animatedPlaceholderImage} />
          <div className={styles.animatedPlaceholderText}>
            <div className={styles.animatedPlaceholderTextLine} />
            <div className={styles.animatedPlaceholderTextLine} />
            <div className={styles.animatedPlaceholderTextLine} />
            <div className={styles.animatedPlaceholderTextLine} />
          </div>
        </>
      )}
    </div>
  )
}

export default AnimatedPlaceholder
