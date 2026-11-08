      document.addEventListener("DOMContentLoaded", () => {
        gsap.registerPlugin(ScrollTrigger);

        const TARGET_URL = "meta-tags-generator.html";

        const formInputs = {
          name: document.getElementById("user-name"),
          age: document.getElementById("user-age"),
          email: document.getElementById("user-email"),
          checkbox: document.getElementById("nda-checkbox"),
          submitBtn: document.getElementById("btn-submit-nda"),
        };

        const errors = {
          name: document.getElementById("name-error"),
          age: document.getElementById("age-error"),
          email: document.getElementById("email-error"),
        };

        const ndaCard = document.getElementById("nda-card");
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Initial Entrance Animation
        gsap.from(".form-element", {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        });

        // Parallax Effects via ScrollTrigger
        gsap.to("#glow-1", {
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
          x: 100,
          y: -50,
          scale: 1.2,
        });

        gsap.to("#glow-2", {
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
          },
          x: -120,
          y: 80,
          scale: 1.15,
        });

        // Form Reactive Validation Engine
        function validateForm() {
          const isNameValid = formInputs.name.value.trim().length > 0;
          const parsedAge = parseInt(formInputs.age.value, 10);
          const isAgeValid = !isNaN(parsedAge) && parsedAge > 0;
          const isEmailValid = emailRegex.test(formInputs.email.value.trim());
          const isNdaChecked = formInputs.checkbox.checked;

          toggleError(errors.name, !isNameValid && formInputs.name.value.length > 0);
          toggleError(errors.age, !isAgeValid && formInputs.age.value.length > 0);
          toggleError(errors.email, !isEmailValid && formInputs.email.value.length > 0);

          const isFormValid = isNameValid && isAgeValid && isEmailValid && isNdaChecked;

          if (isFormValid) {
            formInputs.submitBtn.removeAttribute("disabled");
            formInputs.submitBtn.className =
              "w-full py-3.5 px-6 rounded-lg font-bold text-sm tracking-wider uppercase transition-all duration-300 text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-pink-500 hover:brightness-125 shadow-neon-cyan cursor-pointer";
          } else {
            formInputs.submitBtn.setAttribute("disabled", "true");
            formInputs.submitBtn.className =
              "w-full py-3.5 px-6 rounded-lg font-bold text-sm tracking-wider uppercase transition-all duration-300 text-slate-400 bg-slate-800/60 border border-slate-700 cursor-not-allowed";
          }
        }

        function toggleError(element, show) {
          if (show) element.classList.remove("hidden");
          else element.classList.add("hidden");
        }

        ["input", "change"].forEach((eventType) => {
          formInputs.name.addEventListener(eventType, validateForm);
          formInputs.age.addEventListener(eventType, validateForm);
          formInputs.email.addEventListener(eventType, validateForm);
          formInputs.checkbox.addEventListener(eventType, validateForm);
        });

        // Form Submission & Immediate Redirect Logic
        formInputs.submitBtn.addEventListener("click", () => {
          if (formInputs.submitBtn.hasAttribute("disabled")) return;

          gsap.timeline()
            .to(ndaCard, {
              duration: 0.5,
              opacity: 0,
              y: -30,
              scale: 0.95,
              filter: "blur(10px)",
              ease: "power2.inOut",
            })
            .to("body", {
              opacity: 0,
              duration: 0.5,
              ease: "power3.inOut",
              onComplete: () => {
                window.location.href = TARGET_URL;
              },
            });
        });
      });
