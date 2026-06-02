
### Doc NAPI-Rotas/Backend

# API NapiRotas

## Visão Geral

A API NapiRotas é um backend desenvolvido com Spring Boot, Java 21, Gradle e MySQL. Atualmente possui funcionalidades básicas para gerenciamento de usuários.

## Tecnologias Utilizadas

* Java 21
* Spring Boot
* Spring Data JPA
* MySQL
* Gradle
* Hibernate

## Modelo de Dados

### Usuário

| Campo    | Tipo   | Descrição           |
| -------- | ------ | ------------------- |
| id       | Long   | Identificador único |
| username | String | Nome de usuário     |
| nome     | String | Nome completo       |
| email    | String | E-mail do usuário   |
| senha    | String | Senha de acesso     |
| telefone | String | Telefone de contato |
| endereco | String | Endereço do usuário |

## Endpoints

### Listar usuários

**GET** `/usuarios`

Retorna todos os usuários cadastrados.

#### Exemplo de resposta

```json
[
  {
    "id": 1,
    "username": "bruno",
    "nome": "Bruno Maion",
    "email": "bruno@email.com",
    "telefone": "45999999999",
    "endereco": "Cascavel"
  }
]
```

---

### Cadastrar usuário

**POST** `/usuarios`

Cadastra um novo usuário.

#### Exemplo de requisição

```json
{
  "username": "bruno",
  "nome": "Bruno Maion",
  "email": "bruno@email.com",
  "senha": "123456",
  "telefone": "45999999999",
  "endereco": "Cascavel"
}
```

T
#### Exemplo de resposta

```json
{
  "id": 1,
  "username": "bruno",
  "nome": "Bruno Maion",
  "email": "bruno@email.com",
  "senha": "123456",
  "telefone": "45999999999",
  "endereco": "Cascavel"
}
```

## Configuração do Banco

A aplicação utiliza MySQL configurado através do arquivo `application.properties`.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/napi_banco
spring.datasource.username=napi
spring.datasource.password=********

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## Execução

Para iniciar a aplicação:

```bash
./gradlew bootRun
```

ou

```bash
java -jar build/libs/napirotas-0.0.1-SNAPSHOT.jar
```

A API ficará disponível em:

```text
http://localhost:8080
```

## Próximas Evoluções

* Validação de dados
* Criptografia de senhas com BCrypt
* Autenticação JWT
* Controle de permissões
* Documentação OpenAPI/Swagger
* CRUD completo de usuários
* Tratamento padronizado de erros
