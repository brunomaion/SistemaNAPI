# API de Usuários

## Criar Usuário

### Endpoint

```http
POST /usuarios
```

### Exemplo de Requisição

```json
{
  "username": "bruno",
  "nome": "Bruno Maion",
  "email": "bruno@example.com",
  "senha": "123456",
  "telefone": "(45) 99999-9999",
  "endereco": "Rua Paraná, 1000, Cascavel - PR"
}
```

### Exemplo de Resposta

```json
{
  "id": 1,
  "username": "bruno",
  "nome": "Bruno Maion",
  "email": "bruno@example.com",
  "senha": "123456",
  "telefone": "(45) 99999-9999",
  "endereco": "Rua Paraná, 1000, Cascavel - PR"
}
```

### Consulta SQL para Verificação

```sql
SELECT *
FROM usuarios
WHERE username = 'bruno';
```

---

## Listar Usuários

### Endpoint

```http
GET /usuarios
```

### Exemplo de Resposta

```json
[
  {
    "id": 1,
    "username": "bruno",
    "nome": "Bruno Maion",
    "email": "bruno@example.com",
    "senha": "123456",
    "telefone": "(45) 99999-9999",
    "endereco": "Rua Paraná, 1000, Cascavel - PR"
  },
  {
    "id": 2,
    "username": "maria",
    "nome": "Maria Silva",
    "email": "maria@example.com",
    "senha": "654321",
    "telefone": "(45) 98888-8888",
    "endereco": "Rua São Paulo, 200, Cascavel - PR"
  }
]
```

### Consulta SQL para Verificação

```sql
SELECT *
FROM usuarios;
```

---

## Estrutura da Tabela

```sql
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(255),
    endereco VARCHAR(255)
);
```

---

## Inserção Manual no Banco

```sql
INSERT INTO usuarios (
    username,
    nome,
    email,
    senha,
    telefone,
    endereco
) VALUES (
    'bruno',
    'Bruno Maion',
    'bruno@example.com',
    '123456',
    '(45) 99999-9999',
    'Rua Paraná, 1000, Cascavel - PR'
);
```

### Verificar Inserção

```sql
SELECT *
FROM usuarios;
```

---

## Teste no Insomnia

### URL

```http
http://localhost:8080/usuarios
```

### Método

```http
POST
```

### Headers

```http
Content-Type: application/json
```

### Body

```json
{
  "username": "bruno",
  "nome": "Bruno Maion",
  "email": "bruno@example.com",
  "senha": "123456",
  "telefone": "(45) 99999-9999",
  "endereco": "Rua Paraná, 1000, Cascavel - PR"
}
```

---

## Listagem de Usuários no Insomnia

### Requisição

```http
GET http://localhost:8080/usuarios
```

### Consulta SQL para Conferência

```sql
SELECT id, username, nome, email
FROM usuarios
ORDER BY id;
```