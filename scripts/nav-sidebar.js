
document.addEventListener("DOMContentLoaded", function() {
    const navContainer = document.querySelector('.class-nav');
    const navLinks = document.querySelectorAll('.class-nav a[href^="#"]');
    const sections = [...document.querySelectorAll("h2.patch-titre, article")];
    let lastActive = null;
    const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
                if (entry.isIntersecting) {
                  const id = entry.target.getAttribute("id");
                  const activeLink = [...navLinks].find(link => link.getAttribute("href") === `#${id}`);
 
         if (activeLink && activeLink !== lastActive) {
         navLinks.forEach(link => link.classList.remove("active"));
         activeLink.classList.add("active");
 
         // Scroll l'élément actif dans le menu si partiellement masqué
         const linkTop = activeLink.getBoundingClientRect().top;
         const navTop = navContainer.getBoundingClientRect().top;
         const linkBottom = linkTop + activeLink.offsetHeight;
         const navBottom = navTop + navContainer.offsetHeight;
 
         if (linkTop < navTop || linkBottom > navBottom) {
             activeLink.scrollIntoView({ behavior: "smooth", block: "center" });
         }
 
         lastActive = activeLink;
         }
     }
     });
 }, {
     rootMargin: "-30% 0px -60% 0px",
     threshold: 0.1
 });
 
 sections.forEach(section => observer.observe(section));
 });