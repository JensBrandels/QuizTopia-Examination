QuizTopia

---- DONE ----

KRAV

Det går att skapa konto och logga in.

- /signup -POST
- /login -POST

Det går att se alla quiz, vad quiz:et heter samt vem som skapat det.

- /quiz -GET ---this is a scan

Det går att välja ett specifikt quiz och få alla frågor.

/quiz/{quizId} - GET

/user --this one is not neccessary - GET

Krav med inloggning

- /quiz -POST
- /quiz/question - POST
- /quiz/{quizId} - DELETE

----- TODO ----

Leaderboard

/quiz/addpoints/{quizId}
/quiz/leaderboard/{quizId}
