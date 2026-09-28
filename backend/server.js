const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 5000);
const GEMINI_MODEL =
    process.env.GEMINI_MODEL || "gemini-3.8-flash";


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(
    express.json({
        limit: "5mb"
    })
);


// ============================================================
// FINGUARD RISK RULES
// ============================================================

const RISK_RULES = [

    {
        id: "ret",

        name: "Guaranteed or unusually strong return claim",

        patterns: [
            "guaranteed return",
            "guaranteed",
            "guarantee",
            "fixed return",
            "100% profit",
            "double your money",
            "double money",
            "money will double",
            "sure shot",
            "risk free",
            "risk-free",
            "pakka 2x",
            "2x hone wala",
            "2x hone wala hai",
            "दोगुना",
            "गारंटी",
            "पक्का"
        ],

        weight: 3,

        explanation:
            "The message presents a financial outcome as certain or unusually safe. Such claims should be independently verified."
    },


    {
        id: "urg",

        name: "Urgency or FOMO",

        patterns: [
            "urgent",
            "act now",
            "join today",
            "today only",
            "right now",
            "last chance",
            "hurry",
            "immediately",
            "before market",
            "before the market",
            "abhi",
            "jaldi",
            "turant",
            "आज ही",
            "अभी",
            "तुरंत"
        ],

        weight: 2,

        explanation:
            "Pressure to act immediately can discourage independent verification and careful decision-making."
    },


    {
        id: "sca",

        name: "Scarcity or limited availability",

        patterns: [
            "limited slots",
            "limited seats",
            "only 10",
            "only 20",
            "only a few",
            "few spots",
            "spots left",
            "limited opportunity",
            "limited offer",
            "sirf 5",
            "sirf 10",
            "बस 5",
            "बस 10"
        ],

        weight: 1,

        explanation:
            "Scarcity language can create pressure to act before the information has been properly checked."
    },


    {
        id: "ins",

        name: "Unverified insider-information claim",

        patterns: [
            "insider information",
            "insider news",
            "inside information",
            "inside news",
            "insider",
            "secret source",
            "secret tip",
            "secret information",
            "confidential source",
            "leaked information",
            "अंदर की खबर"
        ],

        weight: 3,

        explanation:
            "The message claims access to privileged information that has not been independently verified."
    },


    {
        id: "pay",

        name: "Payment request",

        patterns: [
            "pay ₹",
            "send ₹",
            "pay rs",
            "send rs",
            "upi",
            "transfer money",
            "send money",
            "membership fee",
            "activation fee",
            "registration fee",
            "joining fee",
            "deposit",
            "bhej de",
            "paisa bhej",
            "जमा करें"
        ],

        weight: 3,

        explanation:
            "The message asks for or encourages a financial transfer. The recipient and purpose should be independently verified."
    },


    {
        id: "lnk",

        name: "External or shortened link",

        patterns: [
            "https://",
            "http://",
            "bit.ly/",
            "tinyurl.com/",
            "t.me/",
            "wa.me/"
        ],

        weight: 2,

        explanation:
            "Links in unsolicited financial messages can hide the real destination. Verify the official website independently."
    },


    {
        id: "imp",

        name: "Unverified authority or regulatory claim",

        patterns: [
            "sebi registered",
            "sebi-registered",
            "sebi certified",
            "sebi approved",
            "nse official",
            "rbi approved",
            "government approved",
            "government-approved",
            "official partner",
            "official team"
        ],

        weight: 2,

        explanation:
            "Authority claims should be checked against the relevant organization's official sources rather than trusted on wording alone."
    }

];

const RULE_BY_ID = Object.fromEntries(
    RISK_RULES.map(rule => [
        rule.id,
        rule
    ])
);


// ============================================================
// GEMINI CLIENT
// ============================================================

let geminiClient = null;


async function getGeminiClient() {

    if (!process.env.GEMINI_API_KEY) {

        return null;

    }


    if (!geminiClient) {

        const {
            GoogleGenAI
        } = await import("@google/genai");


        geminiClient =
            new GoogleGenAI({

                apiKey:
                    process.env.GEMINI_API_KEY

            });

    }


    return geminiClient;

}


// ============================================================
// GEMINI ANALYSIS SCHEMA
// ============================================================

const ANALYSIS_SCHEMA = {

    type: "object",

    properties: {

        risk_level: {

            type: "string",

            enum: [
                "HIGH CONCERN",
                "NEEDS VERIFICATION",
                "LOW CONCERN"
            ]

        },


        summary: {

            type: "string"

        },


        indicators: {

            type: "array",

            items: {

                type: "object",

                properties: {

                    id: {

                        type: "string",

                        enum: [
                            "ret",
                            "urg",
                            "sca",
                            "ins",
                            "pay",
                            "lnk",
                            "imp"
                        ]

                    },

                    evidence: {

                        type: "string"

                    },

                    explanation: {

                        type: "string"

                    }

                },

                required: [
                    "id",
                    "evidence",
                    "explanation"
                ]

            }

        },


        claims: {

            type: "array",

            items: {

                type: "object",

                properties: {

                    text: {

                        type: "string"

                    },

                    type: {

                        type: "string"

                    },

                    status: {

                        type: "string",

                        enum: [
                            "UNVERIFIED",
                            "VERIFIED",
                            "CONTRADICTED"
                        ]

                    }

                },

                required: [
                    "text",
                    "type",
                    "status"
                ]

            }

        },


        safety_actions: {

            type: "array",

            items: {

                type: "string"

            }

        }

    },

    required: [
        "risk_level",
        "summary",
        "indicators",
        "claims",
        "safety_actions"
    ]

};


// ============================================================
// GEMINI SYSTEM PROMPT
// ============================================================

const GEMINI_SYSTEM_PROMPT = `

You are FinGuard, an explainable financial-safety assistant
for Indian first-time and retail investors.

Your job is to analyze financial messages for:

- possible fraud
- manipulation
- misleading financial claims
- impersonation
- suspicious payment requests
- suspicious links
- unsupported authority claims

You are NOT an investment advisor.

NEVER tell users:

- what to buy
- what to sell
- how much to invest
- which stock will rise
- which investment is personally best

Do not predict future prices.

Do not invent facts.

Do not call something a scam with certainty simply because
the wording looks suspicious.

Use:

HIGH CONCERN:
Multiple strong warning indicators are present.

NEEDS VERIFICATION:
One or more warning indicators or unsupported claims are present.

LOW CONCERN:
No major warning indicators were detected in the supplied text.
This does NOT mean that every claim is true.

EVIDENCE RULE:

Every indicator must use an exact short phrase copied from
the original message.

Never invent evidence.

Allowed indicator IDs:

ret = guaranteed/unusually strong return
urg = urgency/FOMO
sca = scarcity
ins = insider or secret-information claim
pay = payment request
lnk = external/shortened link
imp = authority/regulatory claim

CLAIM RULE:

Extract concrete financial claims from the message.

Examples:

- 40% return
- stock will double
- target price ₹500
- government approval
- SEBI registration
- insider information

Do not invent a claim.

Unless directly established by reliable evidence provided
to you, claim status should be UNVERIFIED.

Write simple explanations suitable for a first-time investor.

Understand English, Hindi and Hinglish.

Return only JSON.
`;


// ============================================================
// RULE ENGINE
// ============================================================

function normalize(text) {

    return String(text)
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

}


function unique(values) {

    return [
        ...new Set(values)
    ];

}


function detectRuleIndicators(text) {

    const normalized =
        normalize(text);

    const indicators = [];


    for (const rule of RISK_RULES) {

        const matches =
            rule.patterns.filter(
                pattern =>
                    normalized.includes(
                        pattern.toLowerCase()
                    )
            );


        if (matches.length > 0) {

            indicators.push({

                id:
                    rule.id,

                name:
                    rule.name,

                evidence:
                    unique(matches),

                explanation:
                    rule.explanation,

                weight:
                    rule.weight,

                source:
                    "rule"

            });

        }

    }


    return indicators;

}


// ============================================================
// BASIC CLAIM EXTRACTION
// ============================================================

function extractBasicClaims(text) {

    const claims = [];

    const lower =
        text.toLowerCase();


    const percentages =
        text.match(
            /\b\d+(?:\.\d+)?\s?%\b/g
        ) || [];


    for (
        const percentage
        of percentages
    ) {

        claims.push({

            text:
                percentage,

            type:
                "Financial return claim",

            status:
                "UNVERIFIED"

        });

    }


    const multipliers =
        text.match(
            /\b\d+(?:\.\d+)?x\b/gi
        ) || [];


    for (
        const multiplier
        of multipliers
    ) {

        claims.push({

            text:
                multiplier,

            type:
                "Return multiplier claim",

            status:
                "UNVERIFIED"

        });

    }


    const amounts =
        text.match(
            /₹\s?\d+(?:,\d+)*(?:\.\d+)?/g
        ) || [];


    for (
        const amount
        of amounts
    ) {

        claims.push({

            text:
                amount,

            type:
                "Financial amount",

            status:
                "DETECTED"

        });

    }


    if (
        lower.includes("guaranteed") ||
        lower.includes("guarantee") ||
        lower.includes("fixed return") ||
        lower.includes("pakka")
    ) {

        claims.push({

            text:
                "Certain or guaranteed financial outcome",

            type:
                "Certainty claim",

            status:
                "UNVERIFIED"

        });

    }


    if (
        lower.includes("insider") ||
        lower.includes("inside information") ||
        lower.includes("inside news")
    ) {

        claims.push({

            text:
                "Claim of insider information",

            type:
                "Authority claim",

            status:
                "UNVERIFIED"

        });

    }


    if (
        lower.includes("sebi approved") ||
        lower.includes("sebi registered") ||
        lower.includes("rbi approved") ||
        lower.includes("government approved")
    ) {

        claims.push({

            text:
                "Claim of regulatory or institutional approval",

            type:
                "Authority claim",

            status:
                "UNVERIFIED"

        });

    }


    return claims;

}


// ============================================================
// GEMINI TEXT ANALYSIS
// ============================================================

async function analyzeWithGemini(text) {

    const ai =
        await getGeminiClient();


    if (!ai) {

        return null;

    }


    const prompt = `

${GEMINI_SYSTEM_PROMPT}

Analyze this message:

"""
${text}
"""

Return only the JSON object matching the schema.
`;


    const response =
        await ai.models.generateContent({

            model:
                GEMINI_MODEL,

            contents:
                prompt,

            config: {

                responseFormat: {

                    text: {

                        mimeType:
                            "application/json",

                        schema:
                            ANALYSIS_SCHEMA

                    }

                },

                thinkingConfig: {

                    thinkingLevel:
                        "low"

                }

            }

        });


    if (!response.text) {

        throw new Error(
            "Gemini returned an empty analysis."
        );

    }


    return JSON.parse(
        response.text
    );

}


// ============================================================
// MERGE AI + RULE ENGINE
// ============================================================

function mergeAnalyses(
    text,
    ruleIndicators,
    aiResult
) {

    const map =
        new Map();


    for (
        const indicator
        of ruleIndicators
    ) {

        map.set(
            indicator.id,
            {
                ...indicator
            }
        );

    }


    if (
        aiResult &&
        Array.isArray(
            aiResult.indicators
        )
    ) {

        for (
            const aiIndicator
            of aiResult.indicators
        ) {

            const rule =
                RULE_BY_ID[
                    aiIndicator.id
                ];


            if (!rule) {

                continue;

            }


            const evidence =
                String(
                    aiIndicator.evidence || ""
                ).trim();


            if (!evidence) {

                continue;

            }


            const index =
                text
                    .toLowerCase()
                    .indexOf(
                        evidence.toLowerCase()
                    );


            if (index === -1) {

                continue;

            }


            const existing =
                map.get(
                    aiIndicator.id
                );


            if (existing) {

                existing.evidence =
                    unique([
                        ...existing.evidence,
                        text.slice(
                            index,
                            index + evidence.length
                        )
                    ]);

                existing.explanation =
                    aiIndicator.explanation ||
                    existing.explanation;

                existing.source =
                    "rule+ai";

            }

            else {

                map.set(
                    aiIndicator.id,
                    {

                        id:
                            aiIndicator.id,

                        name:
                            rule.name,

                        evidence: [
                            text.slice(
                                index,
                                index + evidence.length
                            )
                        ],

                        explanation:
                            aiIndicator.explanation ||
                            rule.explanation,

                        weight:
                            rule.weight,

                        source:
                            "ai"

                    }
                );

            }

        }

    }


    const indicators =
        [...map.values()];


    // --------------------------------------------------------
    // Deterministic score.
    // --------------------------------------------------------

    let score =
        indicators.reduce(
            (
                total,
                indicator
            ) =>
                total +
                (
                    RULE_BY_ID[
                        indicator.id
                    ]?.weight || 1
                ),

            0
        );


    score =
        Math.min(
            score,
            95
        );


    let riskLevel;


    if (score >= 6) {

        riskLevel =
            "HIGH CONCERN";

    }

    else if (score >= 2) {

        riskLevel =
            "NEEDS VERIFICATION";

    }

    else {

        riskLevel =
            "LOW CONCERN";

    }


    // --------------------------------------------------------
    // Claims.
    // --------------------------------------------------------

    const claims = [];

    const claimKeys =
        new Set();


    function addClaim(claim) {

        if (
            !claim ||
            !claim.text
        ) {

            return;

        }


        const textValue =
            String(
                claim.text
            ).trim();


        const typeValue =
            String(
                claim.type ||
                "Financial claim"
            ).trim();


        const key =
            `${textValue.toLowerCase()}|${typeValue.toLowerCase()}`;


        if (
            claimKeys.has(key)
        ) {

            return;

        }


        claimKeys.add(key);


        claims.push({

            text:
                textValue,

            type:
                typeValue,

            status:
                claim.status ||
                "UNVERIFIED"

        });

    }


    extractBasicClaims(text)
        .forEach(addClaim);


    if (
        aiResult &&
        Array.isArray(
            aiResult.claims
        )
    ) {

        aiResult.claims
            .forEach(addClaim);

    }


    // --------------------------------------------------------
    // Safety actions.
    // --------------------------------------------------------

    const actions = [

        "Verify the sender independently before relying on the message.",

        "Check important financial claims against reliable sources.",

        "Do not share OTPs, passwords, PINs or banking credentials.",

        "Do not transfer money solely because a message creates urgency.",

        "Treat guaranteed-return claims with caution."

    ];


    if (
        indicators.some(
            indicator =>
                indicator.id === "pay"
        )
    ) {

        actions.unshift(
            "Verify the payment recipient and purpose through an independent channel before transferring money."
        );

    }


    if (
        indicators.some(
            indicator =>
                indicator.id === "ins"
        )
    ) {

        actions.unshift(
            "Treat insider-information claims as unverified unless supported by reliable public information."
        );

    }


    if (
        indicators.some(
            indicator =>
                indicator.id === "imp"
        )
    ) {

        actions.unshift(
            "Verify claimed regulatory or institutional approval through an official source."
        );

    }


    const aiActions =
        aiResult &&
        Array.isArray(
            aiResult.safety_actions
        )
            ? aiResult.safety_actions
            : [];


    const safetyActions =
        unique([
            ...aiActions,
            ...actions
        ]).slice(0, 7);


    let summary;


    if (
        riskLevel ===
        "HIGH CONCERN"
    ) {

        summary =
            aiResult?.summary ||
            "Several warning indicators are present. Verify the sender, claims and payment details before acting.";

    }

    else if (
        riskLevel ===
        "NEEDS VERIFICATION"
    ) {

        summary =
            aiResult?.summary ||
            "Some caution indicators are present. Verify the sender and claims before acting.";

    }

    else {

        summary =
            aiResult?.summary ||
            "No major warning patterns were detected. This does not establish that every claim is true.";

    }


    return {

        riskLevel,

        riskScore:
            score,

        summary,

        indicators,

        claims,

        safetyActions,

        aiUsed:
            Boolean(aiResult),

        model:
            aiResult
                ? GEMINI_MODEL
                : null

    };

}


// ============================================================
// POST /api/analyze
// ============================================================

app.post(
    "/api/analyze",
    async (req, res) => {

        try {

            const text =
                req.body?.text;


            if (
                typeof text !== "string" ||
                text.trim().length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please provide a financial message to analyze."

                });

            }


            const cleanText =
                text.trim();


            const ruleIndicators =
                detectRuleIndicators(
                    cleanText
                );


            let aiResult = null;


            if (
                process.env.GEMINI_API_KEY
            ) {

                try {

                    aiResult =
                        await analyzeWithGemini(
                            cleanText
                        );

                }

                catch (error) {

                    console.error(
                        "Gemini analysis failed:",
                        error.message
                    );

                }

            }


            const analysis =
                mergeAnalyses(
                    cleanText,
                    ruleIndicators,
                    aiResult
                );


            return res.json({

                success: true,

                analysis: {

                    ...analysis,

                    disclaimer:
                        "FinGuard provides financial-safety information. It does not provide investment recommendations or tell you what to buy or sell."

                }

            });

        }

        catch (error) {

            console.error(
                "Analysis endpoint error:",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    "Unable to analyze the message."

            });

        }

    }
);


// ============================================================
// POST /api/verify
// ============================================================

app.post(
    "/api/verify",
    async (req, res) => {

        try {

            const claim =
                req.body?.claim;


            if (
                typeof claim !== "string" ||
                claim.trim().length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please provide a claim to verify."

                });

            }


            const ai =
                await getGeminiClient();


            if (!ai) {

                return res.json({

                    success: true,

                    verification: {

                        status:
                            "UNVERIFIED",

                        explanation:
                            "Web verification is unavailable because the Gemini API key is not configured.",

                        sources: [],

                        searchQueries: []

                    }

                });

            }


            const prompt = `

You are the factual verification engine for FinGuard.

Verify the following financial/business claim using
current public information.

CLAIM:
"${claim.trim()}"

Verification rules:

1. Use Google Search.
2. Prefer primary or authoritative sources whenever possible:
   - official company announcements
   - stock exchange disclosures
   - government websites
   - regulatory websites
   - official organization websites
3. VERIFIED:
   Reliable public evidence directly supports the claim.
4. CONTRADICTED:
   Reliable public evidence directly conflicts with the claim.
5. UNVERIFIED:
   Evidence is insufficient, ambiguous, or cannot establish the claim.
6. Do not guess.
7. Do not turn a future prediction into a verified fact.
8. Do not provide buy/sell advice.
9. Keep the explanation simple.
10. Return source URLs from the actual grounding results when available.

Return JSON:

{
  "status": "VERIFIED" | "CONTRADICTED" | "UNVERIFIED",
  "explanation": "short evidence-based explanation",
  "sources": [
    {
      "title": "source title",
      "url": "https://...",
      "reason": "why the source is relevant"
    }
  ],
  "searchQueries": [
    "query used"
  ]
}
`;


            const response =
                await ai.models.generateContent({

                    model:
                        GEMINI_MODEL,

                    contents:
                        prompt,

                    config: {

                        tools: [
                            {
                                googleSearch: {}
                            }
                        ],

                        responseFormat: {

                            text: {

                                mimeType:
                                    "application/json",

                                schema: {

                                    type:
                                        "object",

                                    properties: {

                                        status: {

                                            type:
                                                "string",

                                            enum: [
                                                "VERIFIED",
                                                "CONTRADICTED",
                                                "UNVERIFIED"
                                            ]

                                        },

                                        explanation: {

                                            type:
                                                "string"

                                        },

                                        sources: {

                                            type:
                                                "array",

                                            items: {

                                                type:
                                                    "object",

                                                properties: {

                                                    title: {
                                                        type:
                                                            "string"
                                                    },

                                                    url: {
                                                        type:
                                                            "string"
                                                    },

                                                    reason: {
                                                        type:
                                                            "string"
                                                    }

                                                },

                                                required: [
                                                    "title",
                                                    "url",
                                                    "reason"
                                                ]

                                            }

                                        },

                                        searchQueries: {

                                            type:
                                                "array",

                                            items: {
                                                type:
                                                    "string"
                                            }

                                        }

                                    },

                                    required: [
                                        "status",
                                        "explanation",
                                        "sources",
                                        "searchQueries"
                                    ]

                                }

                            }

                        },

                        thinkingConfig: {

                            thinkingLevel:
                                "low"

                        }

                    }

                });


            if (!response.text) {

                throw new Error(
                    "Verification returned no result."
                );

            }


            const verification =
                JSON.parse(
                    response.text
                );


            // ------------------------------------------------
            // Grounding metadata
            // ------------------------------------------------

            const grounding =
                response.candidates?.[0]
                    ?.groundingMetadata;


            const groundedSources =
                (
                    grounding?.groundingChunks ||
                    []
                )
                .map(chunk => {

                    const web =
                        chunk.web;


                    if (
                        !web ||
                        !web.uri
                    ) {

                        return null;

                    }


                    return {

                        title:
                            web.title ||
                            "Web source",

                        url:
                            web.uri,

                        reason:
                            "Source returned through Google Search grounding."

                    };

                })
                .filter(Boolean);


            const sources = [];

            const sourceUrls =
                new Set();


            for (
                const source
                of [
                    ...(verification.sources || []),
                    ...groundedSources
                ]
            ) {

                if (
                    !source ||
                    !source.url
                ) {

                    continue;

                }


                if (
                    sourceUrls.has(
                        source.url
                    )
                ) {

                    continue;

                }


                sourceUrls.add(
                    source.url
                );


                sources.push({

                    title:
                        source.title ||
                        "Web source",

                    url:
                        source.url,

                    reason:
                        source.reason ||
                        "Relevant public source."

                });

            }


            let status =
                [
                    "VERIFIED",
                    "CONTRADICTED",
                    "UNVERIFIED"
                ].includes(
                    verification.status
                )
                    ? verification.status
                    : "UNVERIFIED";


            return res.json({

                success: true,

                claim:
                    claim.trim(),

                verification: {

                    status,

                    explanation:
                        verification.explanation ||
                        "The available evidence was not sufficient to establish this claim.",

                    sources:
                        sources.slice(0, 6),

                    searchQueries:
                        verification.searchQueries ||
                        grounding?.webSearchQueries ||
                        []

                }

            });

        }

        catch (error) {

            console.error(
                "Verification endpoint error:",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    "Unable to verify this claim right now."

            });

        }

    }
);


// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            status:
                "ok",

            service:
                "FinGuard API",

            version:
                "3.0.0",

            aiConfigured:
                Boolean(
                    process.env.GEMINI_API_KEY
                ),

            model:
                process.env.GEMINI_API_KEY
                    ? GEMINI_MODEL
                    : null,

            verification:
                Boolean(
                    process.env.GEMINI_API_KEY
                )

        });

    }
);


// ============================================================
// ROOT
// ============================================================

app.get(
    "/",
    (req, res) => {

        res.json({

            name:
                "FinGuard Backend",

            status:
                "running",

            version:
                "3.0.0",

            endpoints: {

                health:
                    "GET /api/health",

                analyze:
                    "POST /api/analyze",

                verify:
                    "POST /api/verify"

            }

        });

    }
);


// ============================================================
// START SERVER
// ============================================================

app.listen(
    PORT,
    HOST,
    () => {

        console.log("");
        console.log("========================================");
        console.log("          FINGUARD BACKEND");
        console.log("========================================");
        console.log(
            `Server: http://${HOST}:${PORT}`
        );
        console.log(
            `Gemini: ${
                process.env.GEMINI_API_KEY
                    ? "CONFIGURED"
                    : "NOT CONFIGURED"
            }`
        );
        console.log(
            `Model: ${GEMINI_MODEL}`
        );
        console.log(
            "AI analysis: ENABLED"
        );
        console.log(
            "Claim verification: ENABLED"
        );
        console.log(
            "Status: RUNNING"
        );
        console.log("========================================");
        console.log("");

    }
);