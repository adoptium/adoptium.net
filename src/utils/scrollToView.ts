export const scrollToSection = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  sectionId: string,
) => {
  event.preventDefault()
  const section = document.getElementById(sectionId)

  if (section) {
    const navbarHeight = 98 // Top navbar height
    window.scrollTo({
      top: section.offsetTop - navbarHeight,
      behavior: "instant",
    })
  }
}
