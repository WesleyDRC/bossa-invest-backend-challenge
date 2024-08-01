### Mentoring Platform API

Backend para uma plataforma de mentorias. Onde o objetivo é atender a dois públicos distintos: pessoas que possuem habilidades e estão dispostas a oferecer mentoria, e pessoas que precisam de mentoria nessas habilidades. 

# Recursos da API

* **Authentication**

1. Autenticar usuário

	**Description**: Autentica um usuário e retorna um token JWT.

	```
	Endpoint: POST /auth

	Input:
	Body Type: JSON
	{
		"email": "string", 
		"password": "string"
	}

	Output:
	{
		"token": "string"
	}
	```

* **Users**
1. Criar usuário

	**Description**: Registra um usuário e retorna os dados do usuário criado.

	```
	Endpoint: POST /users

	Input:
	Body Type: JSON
	{
		"name": "string", 
		"email": "string", 
		"password":"string", 
		"confirmPassword": "string",
		"role": "string" // "mentor" ou "mentee"
	}

	Output:
	{
		"token": "string"
	}
	```
2. Adicionar skill ao mentor.

	**Description:** Registra uma skill para um mentor.

	**Observação:** Somente mentores podem possuir skills.

	```
	Endpoint: POST /users/skills

	Headers:
	Authorization: Bearer <token>

	Input:
	Body Type: JSON
	{
		"skillName": "string"
	}

	Output:
	{
		"user": {
			"id": "string"
			"name": "string"
			"email": "string",
			"role": "string",
			"skills": [
				{
					"id": "string",
					"name": "string"
				}
			],
			"created_at": "string",
			"updated_at": "string"
		}
	}
	```
3. Pegar skills de um mentor

	**Description:** Retorna as habilidades de um mentor.

	**Observação:** Apenas mentores podem consultar suas próprias habilidades.

	```
	Endpoint: GET /users/skills
	
	Headers:
	Authorization: Bearer <token>

	Output:
	{
		"skills": [
			{
				"id": "0cd27a81-7492-411a-8526-703b4c44dd19",
				"name": "javascript"
			}
		]
	}
	```

4. Procurar mentores pela habilidade

	**Description:** Retorna os mentores que possuem conhecimento sobre uma habilidade.

	```
	Endpoint: GET /users/skills/mentors?skill=NOME_DA_HABILIDADE
	
	Headers:
	Authorization: Bearer <token>

	Output:
	{
		"mentors": [
			{
				"id": "string",
				"name": "string",
				"email": "string",
				"role": "string",
				"created_at": "string",
				"updated_at": "string",
				"skills": [
					{
						"id": "string",
						"name": "string"
					}
				]
			}
		]
	}
	```

* Skills

1. Criar uma habilidade

	**Description:** Cria uma habilidade.

	```
	Endpoint: POST /skills/

	Input:
	Body Type: JSON
	{
		"name": "string"
	}

	Output:
	{
		"skill": {
			"id": "string",
			"name": "string"
		}
	}
	```
2. Pegar habilidades

	**Description:** Retorna todas habilidades criadas no banco de dados.

	```
	Endpoint: GET /skills/

	Output:
	{
		"skills": [
			{
				"id": "string",
				"name": "string"
			}
		]
	}
	```


* Mentoring

1. Criar disponibilidade do mentor

	**Description:** Criar horário que o mentor está disponível para dar mentoria.
	
	**Observação:** Somente mentores podem criar o horário que eles estão disponíveis para dar mentoria.

	```
	Endpoint: POST /mentoring/availability

	Headers:
	Authorization: Bearer <token>

	Input:
	Body Type: JSON
	{
			"hourStart": "string",
			"hourEnd": "string",
			"availableDay": "string"
	}

	Output:
	{
		"mentoringAvailable": {
			"id": "string",
			"mentorId": "string",
			"hourStart": "string",
			"hourEnd": "string",
			"availableDay": "string",
			"isAvailable": "boolean"
		}
	}
	```

2. Criar uma sessão de mentoria

	**Description:** Cria uma sessão de mentoria.

	**Observação:** Somente mentorados podem criar uma sessão de mentoria. 

	```
	Endpoint: POST /mentoring/

	Headers:
	Authorization: Bearer <token>

	Input:
	Body Type: JSON
	{
		"mentorId": "string",
		"hourStart": "string",
		"hourEnd": "string",
		"skills": [
			"string"
		],
		"scheduledAt": "string"
	}

	Output:
	{
		"mentoringSession": {
			"id": "string",
			"mentorId": "string",
			"menteeId": "string",
			"hourStart": "number",
			"hourEnd": "number",
			"skills": [
				{
					"id": "string",
					"name": "string"
				}
			],
			"status": "string",
			"scheduledAt": "string"
		}
	}
	```
3. Criar avaliação da mentoria

	**Description:** Criar avaliação de uma mentoria.

	**Observação:** Somente mentorados podem criar avaliações. 

	```
	Endpoint: POST /mentoring/assessment

	Headers:
	Authorization: Bearer <token>

	Input:
	Body Type: JSON
	{
		"grade": number,
		"comment": "string",
		"sessionId": "string"
	}

	Output:
	{
		"mentoringAssessment": {
			"id": "string",
			"grade": number,
			"comment": "string.",
			"menteeId": "string",
			"sessionId": "string"
		}
	}
	```
4. Pegar mentorias disponíveis pela habilidade

	**Description:** Retorna todas as mentorias disponíveis por habilidade.

	```
	Endpoint: GET /mentoring/available?skill=NOME_DA_HABILIDADE

	Headers:
	Authorization: Bearer <token>

	Output:
	{
		"mentoringAvailable": [
			{
				"id": "string",
				"mentorId": "string",
				"hourStart": "string",
				"hourEnd": "string",
				"availableDay": "string",
				"isAvailable": boolean
			}
		]
	}
	```

* Calendar
	1. Adicionar ao Google Calendar

		**Description:**  Adiciona uma sessão de mentoria à agenda do usuário no Google Calendar. O processo envolve duas etapas: autenticação e adição do evento.

		1°Etapa Autenticação

		```
		Endpoint: GET /calendar/add-to-google-calendar

		Query Parameters:
		- mentoringSessionId=<MENTORING_SESSION_ID>  // ID da sessão de mentoria a ser adicionada ao calendário.
		- userId=<USER_ID>  // ID do usuário que está adicionando a sessão ao calendário.

		Output:
		- Redireciona para uma URL do Google para autenticação e autorização.

		```

		2° Etapa - Adição do Evento
		```
		Endpoint: GET /calendar/add-to-google-calendar-callback

		Query Parameters:

		- code=<AUTHORIZATION_CODE>: Código de autorização retornado pelo Google após o usuário conceder permissões.

		- mentoringSessionId=<MENTORING_SESSION_ID>: ID da sessão de mentoria.

		Output:
		- Confirmação de que o evento foi adicionado ao Google Calendar.

		```
		