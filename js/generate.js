            function executeSuccessfulCompilation() {
                // Deduct exactly 1 quota value from daily limit counter
                decrementQuota();

                // Hide loader overlay
                loaderOverlay.classList.remove('active');

                const escapeHTML = str => str.replace(/[&<>'"]/g, 
                    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
                );

                const titleVal = escapeHTML(inputs.siteTitle.value.trim());
                
                // Apply strict text-cleaning helper to description textareas
                const descVal = escapeHTML(cleanDescriptionText(inputs.metaDesc.value));
                const ogDescVal = escapeHTML(cleanDescriptionText(inputs.ogDesc.value));
                const twDescVal = escapeHTML(cleanDescriptionText(inputs.twDesc.value));

                const keyVal = escapeHTML(inputs.keywords.value.trim());
                const authorVal = escapeHTML(inputs.authorName.value.trim());
                const ogTitleVal = escapeHTML(inputs.ogTitle.value.trim());
                const ogImgVal = escapeHTML(inputs.ogImage.value.trim());
                const ogUrlVal = escapeHTML(inputs.ogUrl.value.trim());
                const twTitleVal = escapeHTML(inputs.twTitle.value.trim());

                // Gather external CSS paths securely
                const cssPathNodes = cssInputWrapper.querySelectorAll('.css-path-input');
                const cssLinks = [];
                cssPathNodes.forEach(node => {
                    const val = node.value.trim();
                    if (val !== '' && isValidCssPathPattern(val)) {
                        cssLinks.push(escapeHTML(val));
                    }
                });

                let cssTagSection = '';
                if (cssLinks.length > 0) {
                    cssTagSection = `\n\n\n  <!-- 4. External CSS Links & Core Libraries -->\n` + 
                        cssLinks.map(href => `  <link rel="stylesheet" href="${href}">`).join('\n') + `\n`;
                }

                const compiledCode = 
`<head>
  <!-- --------------------YOUR CREDENTIALS ----------------------- -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleVal}</title>
  
  <!-- 1. Main Meta Tags -->
  <meta name="description" content="${descVal}">
  <meta name="keywords" content="${keyVal}">
  <meta name="author" content="${authorVal}">

  <!-- 2. Open Graph Tags -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${ogTitleVal}">
  <meta property="og:description" content="${ogDescVal}">
  <meta property="og:image" content="${ogImgVal}">
  <meta property="og:url" content="${ogUrlVal}">

  <!-- 3. Twitter / X Card Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${twTitleVal}">
  <meta name="twitter:description" content="${twDescVal}">
  <meta name="twitter:image" content="${ogImgVal}">` + cssTagSection + 


`  <!-- ----------------------------------------------------------- -->
</head>`;

                codeOutput.textContent = compiledCode;

                formSection.style.display = 'none';
                formSection.classList.remove('blurred');
                outputCard.style.display = 'block';
                setTimeout(() => {
                    outputCard.classList.add('visible');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 50);

                setTimeout(() => {
                    isGenerating = false;
                    checkFormValidation();
                }, 500);
            }
