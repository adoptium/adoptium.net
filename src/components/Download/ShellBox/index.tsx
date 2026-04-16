import React from "react"

import "./ShellBox.css"

interface Props {
  children: React.ReactNode
  textToCopy?: string
}

const ShellBox = ({ children, textToCopy }: Props): React.ReactNode => {
  const handleCopy = () => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
    }
  };

  return (
    <pre className="shell-box no-highlight">
      <div className="shell-box-top">
        {textToCopy && (
          <button onClick={handleCopy} aria-label="Copy to clipboard">
            <i className="fa fa-copy" />
          </button>
        )}
      </div>
      <code className="shell-box-code">{children}</code>
    </pre>
  )
}

export default ShellBox
