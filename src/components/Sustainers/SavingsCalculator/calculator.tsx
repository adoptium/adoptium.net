"use client"

import { useEffect } from "react"

const Calculator = () => {
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://eclipse-foundation.involve.me/embed"
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    return (
        <div
            className="involveme_embed w-full md:w-1/2 mb-5 md:mb-10"
            data-project="temurin-calculator"
        ></div>
    )
}

export default Calculator
