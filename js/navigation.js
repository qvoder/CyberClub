
        document.addEventListener('DOMContentLoaded', () => {
            const navLinks = document.querySelectorAll('.main-nav__link[data-section]');
            const sections = {
                glavnaya: document.getElementById('glavnaya'),
                zony: document.getElementById('zony'),
                foto: document.getElementById('foto'),
                akcii: document.getElementById('akcii'),
                kontakty: document.getElementById('kontakty')
            };

            function setActiveLink() {
                const scrollY = window.scrollY + 250;
                let activeId = null;

                for (const [id, section] of Object.entries(sections)) {
                    if (section) {
                        const offsetTop = section.offsetTop;
                        const offsetBottom = offsetTop + section.offsetHeight;
                        if (scrollY >= offsetTop && scrollY < offsetBottom) {
                            activeId = id;
                            break;
                        }
                    }
                }

                navLinks.forEach(link => {
                    const sectionId = link.getAttribute('data-section');
                    if (sectionId === activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }

            window.addEventListener('scroll', setActiveLink);
            window.addEventListener('resize', setActiveLink);
            setActiveLink();
        });
