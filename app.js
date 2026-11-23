let currentUnit = null;
let currentWordPool = [];
let currentMode = null;
let currentWordIndex = 0;
let currentWord = null;
let currentTrainingPool = [];

let trickyProgress =
    JSON.parse(
        localStorage.getItem(
            "trickyProgress"
        )
    ) || {};


let appRoot = document.body;

let mode = "recognize";

let direction =
    localStorage.getItem("direction")
    || "EN_DE";


let score =
    Number(
        localStorage.getItem("score")
    ) || 0;


let correctAnswers =
    Number(
        localStorage.getItem(
            "correctAnswers"
        )
    ) || 0;

let wrongAnswers =
    Number(
        localStorage.getItem(
            "wrongAnswers"
        )
    ) || 0;





function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}



function getQuestion(word) {

    return direction === "EN_DE"
        ? word.english
        : word.german;
}

function getAnswer(word) {

    return direction === "EN_DE"
        ? word.german
        : word.english;
}

function startRecognize(wordPool = vocabulary) {

    currentTrainingPool = wordPool;

    currentMode = "recognize";

    const word =
        wordPool[
        Math.floor(
            Math.random() * wordPool.length
        )
        ];

    currentWord = word;


    const uniqueAnswers =
        [...new Set(
            wordPool.map(
                w => getAnswer(w)
            )
        )];

    const answers =
        [getAnswer(word)];

    while (
        answers.length <
        uniqueAnswers.length
        &&
        answers.length < 4
    ) {

        const randomAnswer =
            uniqueAnswers[
            Math.floor(
                Math.random() *
                uniqueAnswers.length
            )
            ];

        if (
            !answers.includes(
                randomAnswer
            )
        ) {
            answers.push(
                randomAnswer
            );
        }
    }


    const mixedAnswers =
        shuffle(answers);

    let html = `

        <div class="learn-card">

            <button
                class="home-btn"
                onclick="renderHomePage()">

                🏠 Home

            </button>

            <div style="
                text-align:right;
                margin-bottom:20px;
            ">

                ${getAvatarEmoji()}
                ${getAvatar()}

            </div>

            <div class="learn-title">

                ${getQuestion(word)}

            </div>

            <div class="learn-subtitle">

                Was bedeutet dieses Wort?

            </div>

            <div class="answer-container">
    `;

    mixedAnswers.forEach(answer => {

        html += `

            <button
                class="answer-btn"

                onclick="
                    checkAnswer(
                        '${answer}',
                        '${getAnswer(word)}'
                    )
                ">

                ${answer}

            </button>

        `;
    });

    html += `

            </div>

            <button
                class="tricky-btn"

                onclick="
                    saveTrickyWord(
                        '${word.english}'
                    )
                ">

                ⭐ Tricky Word

            </button>

        </div>
    `;

    document.body.innerHTML = html;
}



function getWordsByUnit(unit) {

    return vocabulary.filter(
        word => word.unit === unit
    );
}



function selectUnit(unit) {

    currentUnit = unit;

    currentWordPool =
        getWordsByUnit(unit);

    document.body.innerHTML = `

        <div class="learn-card">

            <button
                class="home-btn"
                onclick="renderHomePage()">

                🏠 Home

            </button>

            <h2>${unit}</h2>

            <p>
                Lernmodus auswählen
            </p>

            <button
                class="large-btn"
                onclick="startRecognize(currentWordPool)">

                🔍 Recognize

            </button>

            <button
                class="large-btn"
                style="margin-top:10px;"
                onclick="startRecall()">

                🧠 Recall

            </button>

            <button
                class="large-btn"
                style="margin-top:10px;"
                onclick="startUseIt()">

                ✍️ Use It

            </button>

        </div>
    `;
}




function startRecall() {

    currentMode = "recall";

    if (
        !currentWordPool ||
        currentWordPool.length === 0
    ) {
        alert(
            "Keine Wörter für diese Unit gefunden."
        );
        return;
    }

    const word =
        currentWordPool[
        Math.floor(
            Math.random() * currentWordPool.length
        )
        ];

    currentWord = word;

    document.body.innerHTML = `

        <div class="learn-card">

            <div style="text-align:right;">
                ${getAvatar()}
            </div>

            <button
                class="home-btn"
                onclick="renderHomePage()">

               🏠 Home

            </button>

            <div style="
                text-align:right;
                font-size:1.2rem;
            ">

                ${getAvatarEmoji()}
                ${getAvatar()}

            </div>


            <div class="learn-title">
                ${word.english}
            </div>

            <div class="learn-subtitle">
                Gib die deutsche Übersetzung ein
            </div>

            <input
                id="answerInput"
                type="text"
                class="recall-input"
                placeholder="Antwort eingeben">

            <button
                class="answer-btn"
                onclick="checkRecall(
                    '${word.german}'
                )">

                Prüfen

            </button>

        </div>
    `;
}



function startUseIt() {

    currentMode = "useit";

    if (
        !currentWordPool ||
        currentWordPool.length === 0
    ) {
        alert(
            "Keine Wörter für diese Unit gefunden."
        );
        return;
    }

    const word =
        currentWordPool[
            Math.floor(
                Math.random() *
                currentWordPool.length
            )
        ];

    currentWord = word;

    const answers = [
        word.english
    ];

    while (
        answers.length <
        Math.min(
            4,
            currentWordPool.length
        )
    ) {

        const randomWord =
            currentWordPool[
                Math.floor(
                    Math.random() *
                    currentWordPool.length
                )
            ];

        if (
            !answers.includes(
                randomWord.english
            )
        ) {
            answers.push(
                randomWord.english
            );
        }
    }

    const mixedAnswers =
        shuffle(answers);

    let sentence =
        word.example;

    sentence = sentence.replace(
        new RegExp(
            word.english,
            "i"
        ),
        "_____"
    );

    let html = `

        <div class="learn-card">

            <button
                class="home-btn"
                onclick="renderHomePage()">

                🏠 Home

            </button>

            <div style="text-align:right;">

                ${getAvatarEmoji()}
                ${getAvatar()}

            </div>

            <div style="
                text-align:center;
                margin:20px;
                font-size:1.2rem;
            ">

                ${sentence}

            </div>

            <div class="answer-container">

    `;

    mixedAnswers.forEach(answer => {

        html += `

            <button
                class="answer-btn"
                onclick="
                    checkUseIt(
                        '${answer}',
                        '${word.english}'
                    )
                ">

                ${answer}

            </button>

        `;

    });

    html += `

            </div>

        </div>

    `;

    document.body.innerHTML =
        html;
}


    function checkUseIt(
        selected,
        correct
    ) {

        if (
            selected === correct
        ) {

            score++;

            correctAnswers++;

            localStorage.setItem(
                "correctAnswers",
                correctAnswers
            );

            localStorage.setItem(
                "score",
                score
            );

            alert(
                "✅ Richtig!"
            );

        } else {

            wrongAnswers++;

            localStorage.setItem(
                "wrongAnswers",
                wrongAnswers
            );

            alert(
                "❌ Falsch!\n\n" +
                "Richtige Lösung:\n" +
                correct
            );
        }

        saveLearningState();

        startUseIt(currentTrainingPool);
    }



    function checkRecall(correct) {

        const answer =
            document
                .getElementById("answerInput")
                .value
                .trim()
                .toLowerCase();

        if (answer === correct.toLowerCase()) {

            score++;

            correctAnswers++;

            localStorage.setItem(
                "correctAnswers",
                correctAnswers
            );

            localStorage.setItem(
                "score",
                score
            );

            alert(
                "✅ Richtig!"
            );
        }
        else {

            wrongAnswers++;

            localStorage.setItem(
                "wrongAnswers",
                wrongAnswers
            );

            alert(
                "❌ Falsch\n\n" +
                "Richtige Antwort:\n" +
                correct
            );
        }

        saveLearningState();

        startRecall(currentTrainingPool);
    }



    function checkAnswer(selected, correct) {

        if (selected === correct) {

            const trickyWords =
                JSON.parse(
                    localStorage.getItem(
                        "trickyWords"
                    )
                ) || [];


            score++;

            correctAnswers++;

            localStorage.setItem(
                "correctAnswers",
                correctAnswers
            );

            localStorage.setItem(
                "score",
                score
            );

            if (
                trickyWords.includes(
                    currentWord.english
                )
            ) {

                let trickyProgress =
                    JSON.parse(
                        localStorage.getItem(
                            "trickyProgress"
                        )
                    ) || {};

                trickyProgress[
                    currentWord.english
                ] =
                    (
                        trickyProgress[
                        currentWord.english
                        ] || 0
                    ) + 1;

                localStorage.setItem(
                    "trickyProgress",
                    JSON.stringify(
                        trickyProgress
                    )
                );

                if (
                    trickyProgress[
                    currentWord.english
                    ] >= 3
                ) {

                    removeTrickyWord(
                        currentWord.english
                    );

                    alert(
                        "🎉 Tricky Word gemeistert!\n\n" +
                        currentWord.english
                    );
                }

            }

            alert(
                "✅ Richtig!\n\nPunkte: "
                + score
            );

        } else {

            wrongAnswers++;

            localStorage.setItem(
                "wrongAnswers",
                wrongAnswers
            );

            alert(
                "❌ Falsch!\n\nRichtige Antwort:\n" +
                correct
            );
        }

        saveLearningState();

        startRecognize(
            currentTrainingPool
        );
    }




    function saveLearningState() {

        localStorage.setItem(
            "learningState",

            JSON.stringify({

                unit: currentUnit,
                mode: currentMode,
                word: currentWord?.english || null,
                timestamp: Date.now()

            })
        );
    }



    function continueLearning() {

        const state =
            JSON.parse(
                localStorage.getItem(
                    "learningState"
                )
            );

        if (!state) {

            alert(
                "Kein Lernstand vorhanden."
            );

            return;
        }

        currentUnit = state.unit;
        currentMode = state.mode;
        currentWordPool =
            getWordsByUnit(
                currentUnit
            );

        switch (currentMode) {

            case "recognize":
                startRecognize(
                    currentWordPool
                );
                break;

            case "recall":
                startRecall();
                break;

            case "useit":
                startUseIt();
                break;
        }
    }



    function saveTrickyWord(word) {

        let trickyWords =
            JSON.parse(
                localStorage.getItem("trickyWords")
            ) || [];

        if (!trickyWords.includes(word)) {

            trickyWords.push(word);

            localStorage.setItem(
                "trickyWords",
                JSON.stringify(trickyWords)
            );

            alert(
                "⭐ '" +
                word +
                "' gespeichert!"
            );
        }
        else {

            alert(
                "⭐ Bereits vorhanden."
            );
        }
    }



    function showTrickyWords() {

        const trickyWords =
            JSON.parse(
                localStorage.getItem(
                    "trickyWords"
                )
            ) || [];

        if (trickyWords.length === 0) {

            alert(
                "Keine Tricky Words gespeichert."
            );

            return;
        }

        let html = `

        <div class="learn-card">

            <button
                class="home-btn"
                onclick="renderHomePage()">

                🏠 Home

            </button>

            <h2>⭐ My Tricky Words</h2>

            <p>
                ${trickyWords.length}
                Wörter gespeichert
            </p>

            <button
                class="large-btn"
                onclick="startTrickyTraining()">

                🎯 Tricky Words üben

            </button>

            <hr style="margin:20px 0;">
    `;

        trickyWords.forEach(word => {

            html += `

            <div
                style="
                    padding:10px;
                    border-bottom:1px solid #ddd;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                <span>
                    ⭐ ${word}
                </span>

                <button
                    onclick="removeTrickyWord('${word}')">

                    🗑

                </button>

            </div>

        `;
        });

        html += `

        <button
            class="answer-btn"
            style="margin-top:20px;"
            onclick="clearTrickyWords()">

            🗑 Alle Tricky Words löschen

        </button>

        </div>

    `;

        document.body.innerHTML = html;
    }



    function startTrickyTraining() {

        const trickyWords =
            JSON.parse(
                localStorage.getItem(
                    "trickyWords"
                )
            ) || [];

        const trickyPool =
            vocabulary.filter(
                word =>
                    trickyWords.includes(
                        word.english
                    )
            );

        currentWordPool = trickyPool;

        currentTrainingPool = trickyPool;

        startRecognize(trickyPool);
    }



    function removeTrickyWord(word) {

        let trickyWords =
            JSON.parse(
                localStorage.getItem(
                    "trickyWords"
                )
            ) || [];

        trickyWords =
            trickyWords.filter(
                w => w !== word
            );

        localStorage.setItem(
            "trickyWords",
            JSON.stringify(
                trickyWords
            )
        );

        showTrickyWords();
    }



    function clearTrickyWords() {

        localStorage.removeItem(
            "trickyWords"
        );

        showTrickyWords();
    }



    function getAvatar() {

        if (score >= 100)
            return "🦁 Vocabulary Master";

        if (score >= 50)
            return "🐺 Word Hunter";

        if (score >= 25)
            return "🦉 Wise Owl";

        if (score >= 10)
            return "🦊 Word Fox";

        return "🌱 Rookie";
    }



    function getAvatarEmoji() {

        if (score >= 100)
            return "🦁";

        if (score >= 50)
            return "🐺";

        if (score >= 25)
            return "🦉";

        if (score >= 10)
            return "🦊";

        return "🌱";
    }



    function toggleDirection() {

        if (direction === "EN_DE") {

            direction = "DE_EN";

        } else {

            direction = "EN_DE";
        }

        localStorage.setItem(
            "direction",
            direction
        );

        renderHomePage();
    }




    function renderHomePage() {

        const learningState =
            JSON.parse(
                localStorage.getItem(
                    "learningState"
                )
            );


        let continueHtml = "";

        if (learningState) {

            continueHtml = `

        <div class="progress-card">

            <button
                class="large-btn"
                onclick="continueLearning()">

                ▶ Weiterlernen (continue studying)

            </button>

            <div style="
                margin-top:15px;
                text-align:center;
                color:#64748b;
            ">

                📗 ${learningState.unit}
                <br>

                ${learningState.mode === "recognize"
                    ? "🔍 Recognize"
                    : learningState.mode === "recall"
                        ? "🧠 Recall"
                        : "✍️ Use It"
                }
                <br>

                Last vocab:

                <br>

                <strong>
                    ${learningState.word}
                </strong>

            </div>

        </div>

    `;
        }


        document.body.innerHTML = `

        <div class="header">

            <div class="avatar">
                ${getAvatarEmoji()}
            </div>

            <div class="app-title">
                Vocabulary Hero
            </div>

            <div class="badge-name">
                ${getAvatar()}
            </div>

        </div>

        <div class="progress-card">

            <h3
                style="
                    text-align:center;
                    margin-bottom:10px;
                ">
                Punkte
            </h3>

            <div style="
                font-size:2rem;
                font-weight:bold;
                margin-top:10px;
                text-align:center;
                ">
                    ${score}
            </div>

        </div>

<div class="quick-stats">

    <div class="stat">

        <div>⭐</div>

        <div class="stat-number">
            ${JSON.parse(
            localStorage.getItem(
                "trickyWords"
            )
        )?.length || 0
            }
        </div>

        <div>Tricky</div>

    </div>

    <div class="stat">

        <div>🏅</div>

        <div class="stat-number">
            ${getBadgeCount()}
            <span style="
                font-size:0.8rem;
                color:#64748b;
            ">
                /5
            </span>
        </div>

        <div>Badges</div>

    </div>

</div>


        <div class="footer">

            <div style="
                text-align:center;
                margin-bottom:20px;
            ">

                <button
                    class="home-btn"
                    onclick="toggleDirection()">

                    🌍 ${direction === "EN_DE"
                ? "🇬🇧 ➜ 🇩🇪"
                : "🇩🇪 ➜ 🇬🇧"
            }

                </button>

            </div>


            ${continueHtml}


<button
    class="large-btn"
    onclick="selectUnit('Pick-Up A')"
    style="margin-top:10px;">

    📗 Pick-Up A

</button>


<button
    class="large-btn"
    onclick="selectUnit('Pick-Up B')"
    style="margin-top:10px;">

    📘 Pick-Up B

</button>


<button
    class="large-btn"
    onclick="selectUnit('Unit 1')"
    style="margin-top:10px;">

    🏠 Unit 1

</button>



<button
    class="large-btn"
    onclick="
        selectUnit(
            'Unit 2 - Check-in, Station 1'
        )
    "
    style="margin-top:10px;">

    📚 Unit 2 - Station 1

</button>

<button
    class="large-btn"
    onclick="
        selectUnit(
            'Unit 2 - Station 2, Skills'
        )
    "
    style="margin-top:10px;">

    ✏️ Unit 2 - Skills

</button>

<button
    class="large-btn"
    onclick="
        selectUnit(
            'Unit 2 - Story, Check-out'
        )
    "
    style="margin-top:10px;">

    📖 Unit 2 - Check-out

</button>



<button
    class="large-btn"
    onclick="showTrickyWords()"
    style="margin-top:10px;">

    ⭐ My Tricky Words

</button>


<button
    class="large-btn"
    onclick="showStatistics()"
    style="margin-top:10px;">

    📊 Statistics

</button>

        </div>

    `;
    }



    function saveLearningState() {

        localStorage.setItem(
            "learningState",

            JSON.stringify({

                unit: currentUnit,

                mode: currentMode,

                word: currentWord?.english || null,

                timestamp: Date.now()

            })
        );
    }



    function getBadgeCount() {

        let count = 1;

        if (score >= 10)
            count++;

        if (score >= 25)
            count++;

        if (score >= 50)
            count++;

        if (score >= 100)
            count++;

        return count;
    }




    function showStatistics() {

        const trickyWords =
            JSON.parse(
                localStorage.getItem(
                    "trickyWords"
                )
            ) || [];

        const learningState =
            JSON.parse(
                localStorage.getItem(
                    "learningState"
                )
            );

        const totalAnswers =
            correctAnswers +
            wrongAnswers;

        const successRate =
            totalAnswers > 0
                ? Math.round(
                    correctAnswers /
                    totalAnswers * 100
                )
                : 0;

        document.body.innerHTML = `

        <div class="learn-card">

            <button
                class="home-btn"
                onclick="renderHomePage()">

                🏠 Home

            </button>

            <h2>
                📊 Statistik
            </h2>

            <div class="progress-card">

                <h3>Punkte</h3>

                <div style="
                    font-size:2rem;
                    font-weight:bold;
                ">
                    ${score}
                </div>

            </div>

            <div style="
                margin-top:20px;
                text-align:left;
                line-height:1.8;
            ">

                ✅ Richtige Antworten:
                ${correctAnswers}

                <br>

                ❌ Falsche Antworten:
                ${wrongAnswers}

                <br>

                🎯 Trefferquote:
                ${successRate} %

                <br>

                ⭐ Tricky Words:
                ${trickyWords.length}

                <br>

                📚 Letzte Unit:
                ${learningState?.unit || "-"}

                <br>

                🎮 Letzter Modus:
                ${learningState?.mode || "-"}

                <br>

                📝 Letzte Vokabel:
                ${learningState?.word || "-"}

            </div>

            <button
                class="answer-btn"
                style="margin-top:20px"
                onclick="resetStatistics()">

                🔄 Statistik zurücksetzen

            </button>

        </div>

    `;
    }



    function resetStatistics() {

        if (
            !confirm(
                "Statistik wirklich löschen?"
            )
        ) {
            return;
        }

        localStorage.removeItem(
            "correctAnswers"
        );

        localStorage.removeItem(
            "wrongAnswers"
        );

        correctAnswers = 0;
        wrongAnswers = 0;

        showStatistics();
    }





    document.addEventListener(
        "DOMContentLoaded",
        async () => {

            try {

                const pickupA =
                    await fetch(
                        "vocabulary.json"
                    ).then(
                        r => r.json()
                    );

                const pickupB =
                    await fetch(
                        "pickUpB.json"
                    ).then(
                        r => r.json()
                    );

                const unit1 =
                    await fetch(
                        "unit1.json"
                    ).then(
                        r => r.json()
                    );

                const unit2station1 =
                    await fetch(
                        "unit2_station1.json"
                    ).then(
                        r => r.json()
                    );

                const unit2skills =
                    await fetch(
                        "unit2_skills.json"
                    ).then(
                        r => r.json()
                    );

                const unit2checkout =
                    await fetch(
                        "unit2_checkout.json"
                    ).then(
                        r => r.json()
                    );



                vocabulary = [

                    ...pickupA,

                    ...pickupB,

                    ...unit1,

                    ...unit2station1,

                    ...unit2skills,

                    ...unit2checkout

                ];

                renderHomePage();

} catch (error) {

    console.error(error);

    alert(
        error.name + "\n\n" +
        error.message
    );
}        }
    );