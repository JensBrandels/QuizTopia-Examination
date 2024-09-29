QuizTopia

---- TO DO ----

- ENDPOINTS -

--För quiz--
GET - /quiz //returnerar alla quiz
POST - /quiz //Skapa upp nytt quiz
POST - /quiz/question //Lägg till en fråga i ett skapat quiz
GET - /quiz/{userId}/{quizId} //hämtar ett specifikt quiz från en specifik användare
DELETE - /quiz/{quizId} //Tar bort ett specifikt quiz från en specifik användare

--För user--
POST - /signup //skapa konto
POST - /login //logga in user

UserObject :

user:
{  
 "userId": uuid(),
"username": "string",
"password": "string"
}

Login:

{
"success": true,
"token": "string"
}
