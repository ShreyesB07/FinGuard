(() => {
    "use strict";

    // ==========================================================
    // DEMO CASES
    // ==========================================================

    const DEMOS = [
        {
            en: "Guaranteed-return scam",
            hi: "गारंटीड रिटर्न स्कैम",
            hg: "Guaranteed-return scam",

            text:
                "URGENT! XYZ stock is guaranteed to rise 50% in 7 days. Our insider source confirmed it. Only 10 spots left. Pay ₹5,000 today. https://t.me/xyzpremium"
        },

        {
            en: "Hinglish insider tip",
            hi: "हिंग्लिश इनसाइडर टिप",
            hg: "Hinglish insider tip",

            text:
                "Bhai ye share pakka 2x hone wala hai, insider news hai. Abhi lele warna chance miss ho jayega. SEBI registered team hai. Pay ₹2,999 UPI pe bhej de."
        },

        {
            en: "Fake authority claim",
            hi: "नकली अथॉरिटी दावा",
            hg: "Fake authority claim",

            text:
                "Government approved investment opportunity. SEBI certified experts are guaranteeing 25% profit this month. Register immediately by paying ₹10,000 activation fee."
        },

        {
            en: "Suspicious link",
            hi: "संदिग्ध लिंक",
            hg: "Suspicious link",

            text:
                "Your IPO allotment is ready. Click now to unlock your guaranteed listing profit: https://bit.ly/example-invest and pay ₹3,000 to activate the account."
        },

        {
            en: "Unverified financial claim",
            hi: "अपुष्ट वित्तीय दावा",
            hg: "Unverified financial claim",

            text:
                "ABC Technologies has received a ₹10,000 crore government contract and its stock will double next week. Everyone is buying before the market opens."
        },

        {
            en: "Normal SIP alert",
            hi: "सामान्य SIP अलर्ट",
            hg: "Normal SIP alert",

            text:
                "Reminder: your monthly SIP of ₹2,000 in the index fund will be processed on the 5th. Mutual fund investments are subject to market risks."
        }
    ];


    // ==========================================================
    // TEXT
    // ==========================================================

    const TEXT = {
        en: {
            title: "Judge demo cases",
            hint: "Ready-made cases for a consistent live demonstration."
        },

        hi: {
            title: "डेमो टेस्ट केस",
            hint: "लाइव डेमो के लिए तैयार टेस्ट केस।"
        },

        hg: {
            title: "Judge demo cases",
            hint: "Consistent live demo ke liye ready-made cases."
        }
    };


    // ==========================================================
    // HELPERS
    // ==========================================================

    function getLanguage() {

        if (typeof L !== "undefined") {
            return L;
        }

        return "en";
    }


    function escapeHTML(value) {

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
                "finguard-demo-styles"
            )
        ) {
            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "finguard-demo-styles";


        style.textContent = `

            .fgDemoPanel {
                margin-top: 12px;
                padding: 12px;

                background: #fbfcfe;

                border: 1px solid var(--line);

                border-radius: 10px;
            }

            .fgDemoTitle {
                font-size: 13px;
                font-weight: 800;
            }

            .fgDemoHint {
                margin-top: 2px;
                margin-bottom: 10px;

                color: var(--mut);

                font-size: 12px;
            }

            .fgDemoGrid {
                display: grid;

                grid-template-columns:
                    repeat(2, minmax(0, 1fr));

                gap: 7px;
            }

            .fgDemoButton {
                border: 1px solid var(--line);

                background: #ffffff;

                border-radius: 8px;

                padding: 8px 10px;

                text-align: left;

                font-size: 12px;

                font-weight: 700;

                color: var(--ink);

                transition:
                    border-color .15s ease,
                    background .15s ease,
                    transform .15s ease;
            }

            .fgDemoButton:hover {
                border-color: var(--acc);

                background: #f8fbff;

                transform: translateY(-1px);
            }

            @media (max-width: 650px) {

                .fgDemoGrid {
                    grid-template-columns: 1fr;
                }

            }

            @media (prefers-reduced-motion: reduce) {

                .fgDemoButton {
                    transition: none;
                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    // ==========================================================
    // CREATE DEMO PANEL
    // ==========================================================

    function createDemoPanel() {

        const chips =
            document.getElementById(
                "chips"
            );


        if (!chips) {
            return;
        }


        let panel =
            document.getElementById(
                "fgDemoPanel"
            );


        if (!panel) {

            panel =
                document.createElement(
                    "div"
                );


            panel.id =
                "fgDemoPanel";


            panel.className =
                "fgDemoPanel";


            chips.insertAdjacentElement(
                "afterend",
                panel
            );

        }


        const language =
            getLanguage();


        const labels =
            TEXT[language] ||
            TEXT.en;


        panel.innerHTML = `

            <div class="fgDemoTitle">
                ${escapeHTML(
                    labels.title
                )}
            </div>

            <div class="fgDemoHint">
                ${escapeHTML(
                    labels.hint
                )}
            </div>

            <div class="fgDemoGrid">

                ${DEMOS
                    .map(
                        (demo, index) => `
                            <button
                                type="button"
                                class="fgDemoButton"
                                data-fg-demo="${index}"
                            >
                                ${escapeHTML(
                                    demo[language] ||
                                    demo.en
                                )}
                            </button>
                        `
                    )
                    .join("")}

            </div>
        `;


        // ------------------------------------------------------
        // Click handling
        // ------------------------------------------------------

        panel.onclick =
            event => {

                const button =
                    event.target.closest(
                        "[data-fg-demo]"
                    );


                if (!button) {
                    return;
                }


                const index =
                    Number(
                        button.dataset
                            .fgDemo
                    );


                const demo =
                    DEMOS[index];


                if (!demo) {
                    return;
                }


                const input =
                    document.getElementById(
                        "inp"
                    );


                if (!input) {
                    return;
                }


                input.value =
                    demo.text;


                input.dispatchEvent(
                    new Event("input", {
                        bubbles: true
                    })
                );


                // Use the original frontend's run()
                // so the existing backend integration
                // remains untouched.

                if (
                    typeof run ===
                    "function"
                ) {

                    run();

                }

            };

    }


    // ==========================================================
    // WATCH LANGUAGE CHANGES
    // ==========================================================

    function setupLanguageWatcher() {

        const languageButtons =
            document.querySelectorAll(
                "#langs button"
            );


        languageButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        setTimeout(
                            createDemoPanel,
                            0
                        );

                    }
                );

            }
        );

    }


    // ==========================================================
    // BOOT
    // ==========================================================

    function boot() {

        addStyles();

        createDemoPanel();

        setupLanguageWatcher();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            boot,
            {
                once: true
            }
        );

    } else {

        boot();

    }

})();
