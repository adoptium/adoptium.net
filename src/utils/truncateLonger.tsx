export function truncateIfLonger(word: string): string {
    const referenceWordCount = 40 // Number of words to keep
    const descriptionWords = word.trim().split(/\s+/)

    if (descriptionWords.length > referenceWordCount) {
        return descriptionWords.slice(0, referenceWordCount).join(" ") + "..."
    }

    return word
}
