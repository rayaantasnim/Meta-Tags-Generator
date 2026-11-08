
        document.addEventListener('DOMContentLoaded', () => {
            const MAX_DAILY_QUOTA = 5;
            
            // Core Elements
            const form = document.getElementById('metaForm');
            const btnGenerate = document.getElementById('btnGenerate');
            const btnRefreshAll = document.getElementById('btnRefreshAll');
            const btnCopy = document.getElementById('btnCopy');
            const btnGenerateAgain = document.getElementById('btnGenerateAgain');
            const formSection = document.getElementById('formSection');
            const outputCard = document.getElementById('outputCard');
            const codeOutput = document.getElementById('codeOutput');
            const limitBanner = document.getElementById('limitBanner');
            
            // Part-4 Dynamic CSS Link Elements
            const cssInputWrapper = document.getElementById('cssInputWrapper');
            const btnAddCss = document.getElementById('btnAddCss');

            // Header Elements
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            const mobileDrawer = document.getElementById('mobileDrawer');
            const mainHeader = document.getElementById('mainHeader');
            const quotaBadgeTargets = document.querySelectorAll('.quota-display-target');
            const themeToggleTargets = document.querySelectorAll('.theme-toggle-target');

            // Loader Overlay Elements
            const loaderOverlay = document.getElementById('loaderOverlay');
            const circleFill = document.getElementById('circleFill');
            const circleTimerText = document.getElementById('circleTimerText');
            const linearProgressBar = document.getElementById('linearProgressBar');
            const loaderStatusText = document.getElementById('loaderStatusText');
            const btnAbort = document.getElementById('btnAbort');

            const inputs = {
                siteTitle: document.getElementById('siteTitle'),
                metaDesc: document.getElementById('metaDesc'),
                keywords: document.getElementById('keywords'),
                authorName: document.getElementById('authorName'),
                ogTitle: document.getElementById('ogTitle'),
                ogDesc: document.getElementById('ogDesc'),
                ogImage: document.getElementById('ogImage'),
                ogUrl: document.getElementById('ogUrl'),
                twTitle: document.getElementById('twTitle'),
                twDesc: document.getElementById('twDesc')
            };

            let isGenerating = false;
            let compilationInterval = null;
            let currentCompilationSecond = 0;
            const CIRCLE_CIRCUMFERENCE = 264; // 2 * pi * 42

            // 25-Asset Random Pre-Compensation Algorithm Matrix (5 Pools of 5 Technical Statements)
            const compilationPools = [
                // Pool 1 (Second 1)
                [
                    "Booting matrix core...",
                    "Initiating code compilation...",
                    "Opening HTML stream...",
                    "Loading deploy headers...",
                    "Connecting security handshakes..."
                ],
                // Pool 2 (Second 2)
                [
                    "Parsing SEO schema...",
                    "Extracting title tokens...",
                    "Scanning head configurations...",
                    "Reading repository data...",
                    "Mapping core variables..."
                ],
                // Pool 3 (Second 3)
                [
                    "Sanitizing line-breaks...",
                    "Merging multi-sentences...",
                    "Flattening string breaks...",
                    "Validating input values...",
                    "Fixing description breaks..."
                ],
                // Pool 4 (Second 4)
                [
                    "Injecting keyword arrays...",
                    "Checking path boundaries...",
                    "Verifying nested subfolders...",
                    "Compiling CSS extensions...",
                    "Filtering duplicate paths..."
                ],
                // Pool 5 (Second 5)
                [
                    "Building HTML nodes...",
                    "Injecting social tags...",
                    "Checking trailing full-stops...",
                    "Packaging production code...",
                    "Deploying code metrics..."
                ]
            ];

            function getRandomPoolItem(poolIndex) {
                const pool = compilationPools[poolIndex];
                const randomIndex = Math.floor(Math.random() * pool.length);
                return pool[randomIndex];
            }

            function updateLoaderProgress(sec) {
                const percent = (sec / 5) * 100;
                // Linear Progress Bar update
                linearProgressBar.style.width = `${percent}%`;
                
                // Circle Progress Bar update (filling from 264 down to 0)
                const strokeOffset = CIRCLE_CIRCUMFERENCE - (percent / 100) * CIRCLE_CIRCUMFERENCE;
                circleFill.style.strokeDashoffset = strokeOffset;

                // Timer countdown text
                const remaining = 5 - sec;
                circleTimerText.textContent = `${remaining}s`;

                // Update status text with random item from current second's index array block
                if (sec >= 1 && sec <= 5) {
                    loaderStatusText.textContent = getRandomPoolItem(sec - 1);
                }
            }

            // 0. MOBILE HAMBURGER DRAWER LOGIC
            const toggleDrawer = (forceState) => {
                const isOpen = forceState !== undefined ? forceState : !mobileDrawer.classList.contains('open');
                mobileDrawer.classList.toggle('open', isOpen);
                hamburgerBtn.classList.toggle('active', isOpen);
                hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                hamburgerBtn.textContent = isOpen ? '✕' : '☰';
            };

            hamburgerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleDrawer();
            });

            document.addEventListener('click', (e) => {
                if (!mainHeader.contains(e.target)) {
                    toggleDrawer(false);
                }
            });

            // 1. LIGHT / DARK THEME TOGGLE LOGIC
            const savedTheme = localStorage.getItem('df_theme') || 'dark';
            
            const applyTheme = (theme) => {
                const isLight = theme === 'light';
                document.body.classList.toggle('light-theme', isLight);
                themeToggleTargets.forEach(btn => {
                    btn.setAttribute('title', isLight ? 'Light Matrix Active' : 'Dark Cyberpunk Active');
                    btn.textContent = isLight ? '☀️' : '⚡';
                });
            };

            applyTheme(savedTheme);

            themeToggleTargets.forEach(btn => {
                btn.addEventListener('click', () => {
                    const currentIsLight = document.body.classList.contains('light-theme');
                    const nextTheme = currentIsLight ? 'dark' : 'light';
                    localStorage.setItem('df_theme', nextTheme);
                    applyTheme(nextTheme);
                });
            });

            // 2. STRICT UTC MIDNIGHT RESET BOUNDARY
            function getUTCKey() {
                const now = new Date();
                return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
            }

            function getRemainingQuota() {
                const currentUTCDate = getUTCKey();
                const storedUTCDate = localStorage.getItem('df_gen_utc_date');
                
                if (storedUTCDate !== currentUTCDate) {
                    localStorage.setItem('df_gen_utc_date', currentUTCDate);
                    localStorage.setItem('df_gen_count', '0');
                    return MAX_DAILY_QUOTA;
                }

                const count = parseInt(localStorage.getItem('df_gen_count') || '0', 10);
                return Math.max(0, MAX_DAILY_QUOTA - count);
            }

            function updateQuotaUI() {
                const remaining = getRemainingQuota();
                quotaBadgeTargets.forEach(badge => {
                    badge.textContent = `QUOTA: ${remaining}/${MAX_DAILY_QUOTA} LEFT`;
                });

                if (remaining <= 0) {
                    formSection.classList.add('blurred');
                    limitBanner.style.display = 'block';
                    btnGenerate.disabled = true;
                    return false;
                } else {
                    formSection.classList.remove('blurred');
                    limitBanner.style.display = 'none';
                    return true;
                }
            }

            function decrementQuota() {
                const currentUTCDate = getUTCKey();
                const count = parseInt(localStorage.getItem('df_gen_count') || '0', 10);
                localStorage.setItem('df_gen_utc_date', currentUTCDate);
                localStorage.setItem('df_gen_count', (count + 1).toString());
                updateQuotaUI();
            }

            // 3. SUBFOLDER-PERMITTING CSS PATH VALIDATION REGEX
            function isValidCssPathPattern(pathStr) {
                const val = pathStr.trim();
                if (val === '') return true; // Optional field rule
                const subfolderCssRegex = /^(https?:\/\/|\/|\.\/|\.\.\/)?([a-zA-Z0-9_\-]+\/)*[a-zA-Z0-9_\-]+\.css(\?.*)?$/i;
                return subfolderCssRegex.test(val);
            }

            // 4. URL VALIDATION HELPER
            function isValidURL(urlStr) {
                try {
                    const parsed = new URL(urlStr);
                    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
                } catch (_) {
                    return false;
                }
            }

            // 5. FORM FIELD VALIDATION LOGIC WITH REVISED BOUNDARIES
            function validateField(fieldId, value) {
                const val = value.trim();
                switch (fieldId) {
                    case 'siteTitle':
                        return val.length >= 10 && val.length <= 100;
                    case 'metaDesc':
                        return val.length >= 50 && val.length <= 300;
                    case 'keywords': {
                        if (!val) return false;
                        const arr = val.split(',').map(k => k.trim()).filter(k => k.length > 0);
                        return arr.length >= 5;
                    }
                    case 'authorName':
                        return val.length > 0 && !/^\d+$/.test(val);
                    case 'ogImage':
                    case 'ogUrl':
                        return isValidURL(val);
                    case 'ogTitle':
                    case 'ogDesc':
                    case 'twTitle':
                    case 'twDesc':
                        return val.length > 0;
                    default:
                        return false;
                }
            }

            // 6. GLOBAL FORM VALIDATION & DYNAMIC BUTTON HELPER TEXT STATE ENGINE
            function checkFormValidation() {
                if (getRemainingQuota() <= 0) {
                    btnGenerate.disabled = true;
                    btnGenerate.classList.remove('valid-ready');
                    btnGenerate.textContent = "DAILY QUOTA REACHED 🛑";
                    return false;
                }

                // Check CSS path inputs for validity or duplicates first
                const cssInputRows = cssInputWrapper.querySelectorAll('.css-input-row');
                const pathFrequencyMap = {};
                const inputMetaList = [];
                let cssErrorsFound = false;

                cssInputRows.forEach(row => {
                    const inputEl = row.querySelector('.css-path-input');
                    const errorEl = row.querySelector('.css-error');
                    const rawVal = inputEl.value.trim();
                    
                    if (rawVal !== '') {
                        pathFrequencyMap[rawVal] = (pathFrequencyMap[rawVal] || 0) + 1;
                    }
                    inputMetaList.push({ inputEl, errorEl, rawVal });
                });

                inputMetaList.forEach(item => {
                    const { inputEl, errorEl, rawVal } = item;
                    if (rawVal === '') {
                        inputEl.classList.remove('valid', 'invalid');
                        if (errorEl) errorEl.style.display = 'none';
                    } else {
                        const isPatternValid = isValidCssPathPattern(rawVal);
                        const isDuplicate = pathFrequencyMap[rawVal] > 1;

                        if (!isPatternValid || isDuplicate) {
                            cssErrorsFound = true;
                            inputEl.classList.remove('valid');
                            inputEl.classList.add('invalid');
                            if (errorEl) {
                                errorEl.textContent = isDuplicate ? 'Duplicate CSS paths are not allowed.' : 'Please enter a valid URL or path (e.g. css/style.css).';
                                errorEl.style.display = 'block';
                            }
                        } else {
                            inputEl.classList.remove('invalid');
                            inputEl.classList.add('valid');
                            if (errorEl) errorEl.style.display = 'none';
                        }
                    }
                });

                if (cssErrorsFound) {
                    btnGenerate.disabled = true;
                    btnGenerate.classList.remove('valid-ready');
                    btnGenerate.textContent = "RESOLVE DUPLICATE CSS PATHS ⚡";
                    return false;
                }

                // Step-by-step sequential inspection for dynamic missing requirement notices
                // 1. Check if all main fields are empty
                const allEmpty = Object.values(inputs).every(el => el.value.trim() === '');
                if (allEmpty) {
                    btnGenerate.disabled = true;
                    btnGenerate.classList.remove('valid-ready');
                    btnGenerate.textContent = "FILL REQUIRED FIELDS ⚡";
                    return false;
                }

                // 2. Check Title
                const titleVal = inputs.siteTitle.value.trim();
                if (titleVal.length < 10 || titleVal.length > 100) {
                    btnGenerate.disabled = true;
                    btnGenerate.classList.remove('valid-ready');
                    btnGenerate.textContent = "FIX TITLE LENGTH (10-100 CHARS) ⚡";
                    return false;
                }

                // 3. Check Meta Description
                const descVal = inputs.metaDesc.value.trim();
                if (descVal.length < 50 || descVal.length > 300) {
                    btnGenerate.disabled = true;
                    btnGenerate.classList.remove('valid-ready');
                    btnGenerate.textContent = "FILL META DESCRIPTION (50-300 CHARS) ⚡";
                    return false;
                }

                // 4. Check Keywords
                const kwVal = inputs.keywords.value.trim();
                const kwArr = kwVal.split(',').map(k => k.trim()).filter(k => k.length > 0);
                if (kwArr.length < 5) {
                    btnGenerate.disabled = true;
                    btnGenerate.classList.remove('valid-ready');
                    btnGenerate.textContent = "PROVIDE 5+ COMMAS-SEPARATED KEYWORDS ⚡";
                    return false;
                }

                // 5. Check Author Name
                const authorVal = inputs.authorName.value.trim();
                if (authorVal.length === 0 || /^\d+$/.test(authorVal)) {
                    btnGenerate.disabled = true;
                    btnGenerate.classList.remove('valid-ready');
                    btnGenerate.textContent = "FIX AUTHOR NAME (LETTERS REQUIRED) ⚡";
                    return false;
                }

                // 6. Check URLs (OG Image, OG URL)
                if (!isValidURL(inputs.ogImage.value.trim()) || !isValidURL(inputs.ogUrl.value.trim())) {
                    btnGenerate.disabled = true;
                    btnGenerate.classList.remove('valid-ready');
                    btnGenerate.textContent = "ENTER VALID HTTP/HTTPS URL ⚡";
                    return false;
                }

                // 7. Check remaining required fields
                let anyOtherInvalid = false;
                Object.keys(inputs).forEach(key => {
                    if (!validateField(key, inputs[key].value)) {
                        anyOtherInvalid = true;
                    }
                });

                if (anyOtherInvalid) {
                    btnGenerate.disabled = true;
                    btnGenerate.classList.remove('valid-ready');
                    btnGenerate.textContent = "COMPLETE ALL REQUIRED FIELDS ⚡";
                    return false;
                }

                // ALL CONSTRAINTS PERFECTLY SATISFIED
                btnGenerate.disabled = false;
                btnGenerate.classList.add('valid-ready');
                btnGenerate.textContent = "GENERATE CORE HEAD TAG ⚡";
                return true;
            }

            function attachCssInputEvents(rowEl) {
                const inputEl = rowEl.querySelector('.css-path-input');
                inputEl.addEventListener('input', checkFormValidation);
                inputEl.addEventListener('blur', checkFormValidation);
            }

            const initialCssRow = cssInputWrapper.querySelector('.css-input-row');
            attachCssInputEvents(initialCssRow);

            // 7. DYNAMIC INPUT & REMOVE MECHANISM (ADD & CROSS SYSTEM)
            btnAddCss.addEventListener('click', () => {
                const newRow = document.createElement('div');
                newRow.className = 'css-input-row';

                const newInput = document.createElement('input');
                newInput.type = 'text';
                newInput.className = 'css-path-input';
                newInput.placeholder = 'e.g., styles.css or assets/css/main.css';

                const newError = document.createElement('span');
                newError.className = 'error-msg css-error';
                newError.textContent = 'Please enter a valid URL or path.';

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'btn-remove-css';
                removeBtn.title = 'Remove CSS Link Field';
                removeBtn.textContent = '✕';

                removeBtn.addEventListener('click', () => {
                    newRow.remove();
                    checkFormValidation();
                });

                newRow.appendChild(newInput);
                newRow.appendChild(removeBtn);
                newRow.appendChild(newError);
                cssInputWrapper.appendChild(newRow);

                attachCssInputEvents(newRow);
                newInput.focus();
                checkFormValidation();
            });

            Object.keys(inputs).forEach(key => {
                const el = inputs[key];
                const errSpan = document.getElementById(`err-${key}`);

                const handleInput = () => {
                    const valid = validateField(key, el.value);
                    if (el.value.trim() !== '') {
                        if (valid) {
                            el.classList.remove('invalid');
                            el.classList.add('valid');
                            if (errSpan) errSpan.style.display = 'none';
                        } else {
                            el.classList.remove('valid');
                            el.classList.add('invalid');
                            if (errSpan) errSpan.style.display = 'block';
                        }
                    } else {
                        el.classList.remove('valid', 'invalid');
                        if (errSpan) errSpan.style.display = 'none';
                    }
                    checkFormValidation();
                };

                el.addEventListener('input', handleInput);
                el.addEventListener('blur', handleInput);
            });

            // 8. TEXTAREA DATA-CLEANING UTILITIES (LINE-BREAK ERASURE & PUNCTUATION INJECTION)
            function cleanDescriptionText(rawText) {
                if (!rawText) return '';
                let flattened = rawText.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
                if (flattened === '') return '';
                
                const lastChar = flattened.slice(-1);
                if (lastChar !== '.' && lastChar !== '!' && lastChar !== '?') {
                    flattened += '.';
                }
                return flattened;
            }

            // 9. GENERATE HEAD TAG CODE SUBMISSION & CONFIRMATION EVENT INTERCEPTOR
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                if (isGenerating || getRemainingQuota() <= 0 || !checkFormValidation()) return;

                // Native system validation prompt
                const confirmed = confirm("Initiate Compilation Protocol? Sure?");
                if (!confirmed) {
                    // Exit gracefully without modifying anything
                    return;
                }

                // If OK/Sure, instantly lock the interface, block input fields, execute loading overlay matrix
                isGenerating = true;
                btnGenerate.disabled = true;
                formSection.classList.add('blurred');

                // Initialize 5-second loader overlay state
                currentCompilationSecond = 0;
                updateLoaderProgress(0);
                circleTimerText.textContent = '5s';
                loaderStatusText.textContent = compilationPools[0][Math.floor(Math.random() * compilationPools[0].length)];
                loaderOverlay.classList.add('active');

                // Run 1-second interval over 5 loops
                compilationInterval = setInterval(() => {
                    currentCompilationSecond++;
                    updateLoaderProgress(currentCompilationSecond);

                    if (currentCompilationSecond >= 5) {
                        clearInterval(compilationInterval);
                        setTimeout(() => {
                            executeSuccessfulCompilation();
                        }, 400);
                    }
                }, 1000);
            });

            // 10. ABORT PROTOCOL & REFUND QUOTA SYSTEM RULE
            btnAbort.addEventListener('click', () => {
                if (!isGenerating) return;

                // Clear running interval stack
                if (compilationInterval) {
                    clearInterval(compilationInterval);
                    compilationInterval = null;
                }

                // Hide loader overlay wrapper
                loaderOverlay.classList.remove('active');

                // Unblock and restore form input states
                formSection.classList.remove('blurred');
                isGenerating = false;
                checkFormValidation();

                // Quota remains intact and refunded (no local storage decrement executed)
            });


            // 11. REAL-TIME REFRESH INTEGRATION & ALERT MESSAGE
            function resetCssInputWrapper() {
                cssInputWrapper.innerHTML = `
                    <div class="css-input-row">
                        <input type="text" class="css-path-input" placeholder="e.g., styles.css or assets/css/main.css">
                        <span class="error-msg css-error">Please enter a valid URL or path.</span>
                    </div>
                `;
                const resetRow = cssInputWrapper.querySelector('.css-input-row');
                attachCssInputEvents(resetRow);
            }

            btnRefreshAll.addEventListener('click', () => {
                const hasFormValue = Object.values(inputs).some(el => el.value.trim() !== '');
                const hasCssValue = Array.from(cssInputWrapper.querySelectorAll('.css-path-input')).some(el => el.value.trim() !== '');
                
                if (!hasFormValue && !hasCssValue && cssInputWrapper.children.length === 1) return;

                // Alert message prompt before refreshing/clearing form inputs
                const refreshConfirmed = confirm("Are you sure you want to reset and clear all fields?");
                if (!refreshConfirmed) return;

                Object.values(inputs).forEach(el => {
                    el.value = '';
                    el.classList.remove('valid', 'invalid');
                });
                document.querySelectorAll('.error-msg').forEach(msg => msg.style.display = 'none');

                resetCssInputWrapper();
                checkFormValidation();
                window.scrollTo({ top: 0, behavior: 'smooth' });

                const originalText = btnRefreshAll.innerHTML;
                btnRefreshAll.innerHTML = 'REFRESHED! 🔄';
                btnRefreshAll.style.boxShadow = '0 0 20px #A855F7';
                
                setTimeout(() => {
                    btnRefreshAll.innerHTML = originalText;
                    btnRefreshAll.style.boxShadow = '';
                }, 1500);
            });

            // 12. COPY TO CLIPBOARD UTILITY
            btnCopy.addEventListener('click', () => {
                const rawText = codeOutput.textContent;
                if (!rawText) return;

                navigator.clipboard.writeText(rawText).then(() => {
                    const originalText = btnCopy.innerHTML;
                    btnCopy.innerHTML = 'COPIED! ✨';
                    btnCopy.style.borderColor = 'var(--secondary-neon)';
                    btnCopy.style.color = 'var(--secondary-neon)';
                    btnCopy.style.boxShadow = 'var(--shadow-lime)';

                    setTimeout(() => {
                        btnCopy.innerHTML = originalText;
                        btnCopy.style.borderColor = '';
                        btnCopy.style.color = '';
                        btnCopy.style.boxShadow = '';
                    }, 1500);
                });
            });

            // 13. REGENERATE RESET CONTROL
            btnGenerateAgain.addEventListener('click', () => {
                outputCard.classList.remove('visible');
                setTimeout(() => {
                    outputCard.style.display = 'none';
                    codeOutput.textContent = '';
                    formSection.style.display = 'block';
                    resetCssInputWrapper();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 300);

                checkFormValidation();
            });

            // Initial UI Setup
            updateQuotaUI();
            checkFormValidation();
        });
