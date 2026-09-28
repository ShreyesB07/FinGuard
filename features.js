(() => {
    "use strict";


    // ==========================================================
    // TRANSLATIONS
    // ==========================================================

    const TEXT = {

        en: {

            why:
                "Ask FinGuard Why?",

            whyTitle:
                "Why was this flagged?",

            verifyTitle:
                "What can I verify?",

            verifyHint:
                "Not every financial statement can be verified in the same way. These categories show what can usually be checked against reliable public information.",

            evidence:
                "Evidence",

            reason:
                "Why it matters",

            type:
                "Claim type",

            potential:
                "Potentially verifiable",

            prediction:
                "Future prediction — not directly verifiable",

            authority:
                "Check against official records",

            returnClaim:
                "Return claim — verify the underlying evidence",

            amount:
                "Financial amount — verify the underlying event",

            source:
                "Source / identity claim — verify independently",

            link:
                "Link / domain — verify independently",

            other:
                "Needs context-specific verification",

            disclaimer:
                "FinGuard identifies patterns and verification paths. It does not determine whether an investment is suitable for you.",

            close:
                "Hide explanation"

        },


        hi: {

            why:
                "FinGuard से पूछें क्यों",

            whyTitle:
                "इसे क्यों फ़्लैग किया गया?",

            verifyTitle:
                "मैं क्या जाँच सकता हूँ?",

            verifyHint:
                "हर वित्तीय दावे को एक ही तरीके से जाँचा नहीं जा सकता। यह सेक्शन बताता है कि किन दावों को आमतौर पर विश्वसनीय सार्वजनिक स्रोतों से जाँचा जा सकता है।",

            evidence:
                "सबूत",

            reason:
                "यह क्यों महत्वपूर्ण है",

            type:
                "दावे का प्रकार",

            potential:
                "जाँच की जा सकती है",

            prediction:
                "भविष्य की भविष्यवाणी — सीधे जाँची नहीं जा सकती",

            authority:
                "आधिकारिक रिकॉर्ड से जाँचें",

            returnClaim:
                "रिटर्न का दावा — मूल सबूत जाँचें",

            amount:
                "वित्तीय राशि — संबंधित घटना जाँचें",

            source:
                "स्रोत / पहचान का दावा — स्वतंत्र रूप से जाँचें",

            link:
                "लिंक / डोमेन — स्वतंत्र रूप से जाँचें",

            other:
                "संदर्भ के अनुसार जाँच ज़रूरी है",

            disclaimer:
                "FinGuard जोखिम पैटर्न और जाँच के रास्ते दिखाता है। यह यह तय नहीं करता कि कोई निवेश आपके लिए सही है।",

            close:
                "व्याख्या छिपाएँ"

        },


        hg: {

            why:
                "Ask FinGuard Why?",

            whyTitle:
                "Isse flag kyun kiya gaya?",

            verifyTitle:
                "Main kya verify kar sakta hoon?",

            verifyHint:
                "Har financial claim ko same way mein verify nahi kiya ja sakta. Yeh section batata hai ki kaunse claims reliable public sources se check kiye ja sakte hain.",

            evidence:
                "Evidence",

            reason:
                "Yeh kyun important hai",

            type:
                "Claim type",

            potential:
                "Potentially verifiable",

            prediction:
                "Future prediction — directly verify nahi ho sakti",

            authority:
                "Official records se check karein",

            returnClaim:
                "Return claim — underlying evidence verify karein",

            amount:
                "Financial amount — underlying event verify karein",

            source:
                "Source / identity claim — independently verify karein",

            link:
                "Link / domain — independently verify karein",

            other:
                "Context-specific verification zaroori hai",

            disclaimer:
                "FinGuard patterns aur verification paths dikhata hai. Yeh decide nahi karta ki koi investment aapke liye suitable hai.",

            close:
                "Explanation hide karein"

        }

    };


    // ==========================================================
    // HELPERS
    // ==========================================================

    function lang() {

        try {

            return (
                typeof L !== "undefined"
                    ? L
                    : "en"
            );

        } catch (_) {

            return "en";

        }

    }


    function t(key) {

        const current =
            TEXT[lang()] || TEXT.en;

        return (
            current[key] ||
            TEXT.en[key] ||
            key
        );

    }


    function esc(value) {

        return String(value ?? "")
            .replace(
                /[&<>"]/g,
                character => ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;"
                }[character])
            );

    }


    // ==========================================================
    // STYLES
    // ==========================================================

    function addStyles() {

        if (
            document.getElementById(
                "fg-feature-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "fg-feature-styles";


        style.textContent = `

            .fgFeatureButton {

                width:100%;

                margin-top:8px;

                border:1px solid var(--line);

                background:#fff;

                color:var(--ink);

                border-radius:9px;

                padding:9px 12px;

                font-size:13px;

                font-weight:750;

                text-align:left;

                cursor:pointer;

                transition:
                    border-color .15s ease,
                    background .15s ease;

            }


            .fgFeatureButton:hover {

                border-color:var(--acc);

                background:#f8fbff;

            }


            .fgWhyBox {

                display:none;

                margin-top:9px;

                padding:13px;

                border:1px solid var(--line);

                border-radius:9px;

                background:#fbfcfe;

                animation:
                    fgFeatureFade .2s ease;

            }


            .fgWhyBox.open {

                display:block;

            }


            .fgWhyTitle {

                font-size:13px;

                font-weight:800;

                margin-bottom:10px;

            }


            .fgWhyItem {

                border-top:1px solid var(--line);

                padding:9px 0;

            }


            .fgWhyItem:first-child {

                border-top:0;

                padding-top:0;

            }


            .fgWhyEvidence {

                font-family:
                    ui-monospace,
                    SFMono-Regular,
                    Menlo,
                    monospace;

                background:#f0f3f7;

                border-radius:5px;

                padding:4px 7px;

                display:inline-block;

                font-size:11px;

                margin-bottom:5px;

            }


            .fgWhyName {

                font-size:13px;

                font-weight:750;

            }


            .fgWhyText {

                font-size:12.5px;

                color:var(--mut);

                margin-top:3px;

            }


            .fgWhyDisclaimer {

                font-size:11px;

                color:var(--mut);

                padding-top:9px;

                border-top:1px solid var(--line);

                margin-top:5px;

            }


            .fgVerifyGuide {

                margin-top:18px;

                padding-top:2px;

            }


            .fgVerifyHint {

                color:var(--mut);

                font-size:12px;

                margin:-5px 0 10px;

            }


            .fgVerifyCard {

                border:1px solid var(--line);

                border-radius:9px;

                padding:11px 12px;

                margin-bottom:8px;

                background:#fff;

            }


            .fgVerifyClaim {

                font-size:13px;

                font-weight:750;

                line-height:1.4;

            }


            .fgVerifyType {

                color:var(--mut);

                font-size:11.5px;

                margin-top:2px;

            }


            .fgVerifyLabel {

                display:inline-block;

                margin-top:7px;

                padding:4px 7px;

                border-radius:5px;

                font-size:10.5px;

                font-weight:800;

                background:#e8f8f1;

                color:var(--lo);

            }


            .fgVerifyLabel.warn {

                background:var(--midb);

                color:var(--mid);

            }


            .fgVerifyLabel.neutral {

                background:#edf3ff;

                color:var(--acc);

            }


            @keyframes fgFeatureFade {

                from {

                    opacity:0;

                    transform:translateY(4px);

                }

                to {

                    opacity:1;

                    transform:translateY(0);

                }

            }


            @media(prefers-reduced-motion:reduce) {

                .fgWhyBox {

                    animation:none;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    // ==========================================================
    // CLASSIFY CLAIM
    // ==========================================================

    function classifyClaim(claim) {

        const text =
            String(
                claim.text || ""
            ).toLowerCase();


        const type =
            String(
                claim.type || ""
            ).toLowerCase();


        if (
            type.includes(
                "return"
            ) ||
            type.includes(
                "multiplier"
            )
        ) {

            return {
                label:
                    t("returnClaim"),

                className:
                    "warn"

            };

        }


        if (
            type.includes(
                "certainty"
            )
        ) {

            return {
                label:
                    t("returnClaim"),

                className:
                    "warn"

            };

        }


        if (
            type.includes(
                "authority"
            )
        ) {

            return {
                label:
                    t("authority"),

                className:
                    "neutral"

            };

        }


        if (
            type.includes(
                "amount"
            ) ||
            text.includes("₹")
        ) {

            return {
                label:
                    t("amount"),

                className:
                    "neutral"

            };

        }


        if (
            type.includes(
                "source"
            ) ||
            type.includes(
                "identity"
            )
        ) {

            return {
                label:
                    t("source"),

                className:
                    "neutral"

            };

        }


        if (
            text.includes(
                "price"
            ) ||
            text.includes(
                "reach"
            ) ||
            text.includes(
                "double"
            ) ||
            text.includes(
                "triple"
            ) ||
            text.includes(
                "next week"
            ) ||
            text.includes(
                "next month"
            )
        ) {

            return {
                label:
                    t("prediction"),

                className:
                    "warn"

            };

        }


        return {
            label:
                t("other"),

            className:
                "neutral"

        };

    }


    // ==========================================================
    // WHY SECTION
    // ==========================================================

    function createWhySection(a) {

        if (!a) {

            return;

        }


        const verdict =
            document.querySelector(
                "#out .verdict"
            );


        if (!verdict) {

            return;

        }


        if (
            document.getElementById(
                "fgWhyButton"
            )
        ) {

            return;

        }


        const button =
            document.createElement(
                "button"
            );


        button.id =
            "fgWhyButton";


        button.className =
            "fgFeatureButton";


        button.type =
            "button";


        button.textContent =
            t("why");


        const box =
            document.createElement(
                "div"
            );


        box.id =
            "fgWhyBox";


        box.className =
            "fgWhyBox";


        const title =
            document.createElement(
                "div"
            );


        title.className =
            "fgWhyTitle";


        title.textContent =
            t("whyTitle");


        box.appendChild(
            title
        );


        const indicators =
            a.indicators || [];


        if (
            indicators.length === 0
        ) {

            const empty =
                document.createElement(
                    "div"
                );


            empty.className =
                "fgWhyText";


            empty.textContent =
                lang() === "hi"
                    ? "इस संदेश में कोई बड़ा warning pattern नहीं मिला।"
                    : lang() === "hg"
                        ? "Is message mein koi major warning pattern nahi mila."
                        : "No major warning pattern was detected in the message.";


            box.appendChild(
                empty
            );

        }

        else {

            indicators.forEach(
                indicator => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "fgWhyItem";


                    const evidence =
                        indicator
                            .evidence?.[0] ||
                        "";


                    const name =
                        document.createElement(
                            "div"
                        );


                    name.className =
                        "fgWhyName";


                    name.textContent =
                        indicator.name ||
                        "Risk indicator";


                    const evidenceEl =
                        document.createElement(
                            "div"
                        );


                    evidenceEl.className =
                        "fgWhyEvidence";


                    evidenceEl.textContent =
                        evidence;


                    const explanation =
                        document.createElement(
                            "div"
                        );


                    explanation.className =
                        "fgWhyText";


                    explanation.textContent =
                        indicator.explanation ||
                        "This pattern should be independently verified.";


                    item.appendChild(
                        evidenceEl
                    );


                    item.appendChild(
                        name
                    );


                    item.appendChild(
                        explanation
                    );


                    box.appendChild(
                        item
                    );

                }
            );

        }


        const disclaimer =
            document.createElement(
                "div"
            );


        disclaimer.className =
            "fgWhyDisclaimer";


        disclaimer.textContent =
            t("disclaimer");


        box.appendChild(
            disclaimer
        );


        button.onclick =
            () => {

                const open =
                    box.classList.toggle(
                        "open"
                    );


                button.textContent =
                    open
                        ? t("close")
                        : t("why");

            };


        verdict.insertAdjacentElement(
            "afterend",
            button
        );


        button.insertAdjacentElement(
            "afterend",
            box
        );

    }


    // ==========================================================
    // WHAT CAN I VERIFY SECTION
    // ==========================================================

    function createVerifyGuide(a) {

        if (!a) {

            return;

        }


        const claimsSection =
            document.querySelector(
                "#out .sec"
            );


        const allSections =
            document.querySelectorAll(
                "#out .sec"
            );


        if (
            allSections.length === 0
        ) {

            return;

        }


        const claims =
            a.claims || [];


        if (
            claims.length === 0
        ) {

            return;

        }


        if (
            document.getElementById(
                "fgVerifyGuide"
            )
        ) {

            return;

        }


        /*
         * Find the "Claims found" heading.
         * It is the section immediately before
         * the first .claim element.
         */

        let claimHeading =
            null;


        const claimElements =
            document.querySelectorAll(
                "#out .claim"
            );


        if (
            claimElements.length > 0
        ) {

            let previous =
                claimElements[0]
                    .previousElementSibling;


            while (
                previous &&
                !previous.classList.contains(
                    "sec"
                )
            ) {

                previous =
                    previous.previousElementSibling;

            }


            claimHeading =
                previous;

        }


        if (!claimHeading) {

            claimHeading =
                claimsSection;

        }


        if (!claimHeading) {

            return;

        }


        const section =
            document.createElement(
                "div"
            );


        section.id =
            "fgVerifyGuide";


        section.className =
            "fgVerifyGuide";


        const title =
            document.createElement(
                "div"
            );


        title.className =
            "sec";


        title.textContent =
            t("verifyTitle");


        const hint =
            document.createElement(
                "div"
            );


        hint.className =
            "fgVerifyHint";


        hint.textContent =
            t("verifyHint");


        section.appendChild(
            title
        );


        section.appendChild(
            hint
        );


        claims.forEach(
            claim => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "fgVerifyCard";


                const claimText =
                    document.createElement(
                        "div"
                    );


                claimText.className =
                    "fgVerifyClaim";


                claimText.textContent =
                    claim.text;


                const claimType =
                    document.createElement(
                        "div"
                    );


                claimType.className =
                    "fgVerifyType";


                claimType.textContent =
                    claim.type ||
                    "Financial claim";


                const classification =
                    classifyClaim(
                        claim
                    );


                const label =
                    document.createElement(
                        "span"
                    );


                label.className =
                    `fgVerifyLabel ${classification.className}`;


                label.textContent =
                    classification.label;


                card.appendChild(
                    claimText
                );


                card.appendChild(
                    claimType
                );


                card.appendChild(
                    label
                );


                section.appendChild(
                    card
                );

            }
        );


        /*
         * Insert above the existing claims
         * section so the user understands
         * what is verifiable before clicking
         * the Verify buttons.
         */

        claimHeading.insertAdjacentElement(
            "beforebegin",
            section
        );

    }


    // ==========================================================
    // MAIN INJECTION
    // ==========================================================

    function inject() {

        try {

            if (
                typeof last ===
                "undefined" ||
                !last
            ) {

                return;

            }


            createWhySection(
                last
            );


            createVerifyGuide(
                last
            );

        } catch (error) {

            console.warn(
                "FinGuard feature injection:",
                error
            );

        }

    }


    // ==========================================================
    // OBSERVER
    // ==========================================================

    function observeResults() {

        const out =
            document.getElementById(
                "out"
            );


        if (!out) {

            return;

        }


        const observer =
            new MutationObserver(
                () => {

                    if (
                        !document.getElementById(
                            "fgWhyButton"
                        ) ||
                        !document.getElementById(
                            "fgVerifyGuide"
                        )
                    ) {

                        setTimeout(
                            inject,
                            20
                        );

                    }

                }
            );


        observer.observe(
            out,
            {
                childList:true,
                subtree:true
            }
        );

    }


    // ==========================================================
    // LANGUAGE CHANGES
    // ==========================================================

    function watchLanguage() {

        document
            .querySelectorAll(
                "#langs button"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            setTimeout(
                                () => {

                                    const oldWhy =
                                        document.getElementById(
                                            "fgWhyButton"
                                        );


                                    const oldGuide =
                                        document.getElementById(
                                            "fgVerifyGuide"
                                        );


                                    if (
                                        oldWhy ||
                                        oldGuide
                                    ) {

                                        inject();

                                    }

                                },
                                50
                            );

                        }
                    );

                }
            );

    }


    // ==========================================================
    // START
    // ==========================================================

    function boot() {

        addStyles();

        setTimeout(
            inject,
            300
        );

        observeResults();

        watchLanguage();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            boot,
            {
                once:true
            }
        );

    }

    else {

        boot();

    }

})();