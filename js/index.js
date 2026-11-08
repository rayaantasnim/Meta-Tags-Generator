        document.addEventListener('DOMContentLoaded', () => {
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            const overlayPanel = document.getElementById('overlayPanel');
            const closeDrawerBtn = document.getElementById('closeDrawerBtn');
            const scrollLinks = document.querySelectorAll('.scroll-link');

            // Toggle Right Overlay Sidebar
            const toggleOverlay = (open) => {
                overlayPanel.classList.toggle('open', open);
            };

            hamburgerBtn.addEventListener('click', () => toggleOverlay(true));
            closeDrawerBtn.addEventListener('click', () => toggleOverlay(false));

            // Auto-close overlay upon clicking section links and smooth scroll
            scrollLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleOverlay(false);
                    const targetId = link.getAttribute('href');
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        });

        // Social Preview Selector Switcher
        function switchPreview(type) {
            const tabs = document.querySelectorAll('.preview-tab');
            tabs.forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');

            const titleEl = document.getElementById('previewTitle');
            const descEl = document.getElementById('previewDesc');

            if (type === 'google') {
                titleEl.textContent = "Deploy-Free: Master Landing Page";
                descEl.textContent = "High-performance static hosting via GitHub Pages with zero subscription fees and instant deployment workflows.";
            } else if (type === 'facebook') {
                titleEl.textContent = "DEPLOYS WITHOUT LIMITS // DEPLOY-FREE";
                descEl.textContent = "Discover the ultimate sovereign web publishing framework powered by open-source infrastructure.";
            } else if (type === 'twitter') {
                titleEl.textContent = "@DeployFree - Sovereign Creator Infrastructure";
                descEl.textContent = "Bypass corporate server rents completely with instant browser-based static deployment pipelines.";
            }
        }
