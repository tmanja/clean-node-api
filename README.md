# Clean Node API

<p align="center">
  <img src="https://github.com/rmanguinho/clean-ts-api/raw/master/public/img/logo-course.png" alt="Clean Node API" width="180" />
</p>

<p align="center">
  <strong>API desenvolvida com Node.js, TypeScript, TDD, Clean Architecture e princípios SOLID.</strong>
</p>

<p align="center">
  <a href="https://www.udemy.com/course/tdd-com-mango/?referralCode=B53CE5CA2B9AFA5A6FA1">Curso completo na Udemy</a>
  ·
  <a href="http://fordevs.herokuapp.com/api-docs">Documentação da API</a>
</p>

## Sobre o projeto

Este projeto faz parte do treinamento **Clean Node API**, ministrado pelo professor [Rodrigo Manguinho (Mango)](https://github.com/rmanguinho), disponível na Udemy.

O objetivo do treinamento é demonstrar como desenvolver uma API com arquitetura bem definida e desacoplada, utilizando **TDD (Test-Driven Development)** como metodologia de desenvolvimento e **Clean Architecture** para distribuir responsabilidades em diferentes camadas.

O desenvolvimento segue os princípios do **SOLID**, aplicando Design Patterns sempre que necessário para solucionar problemas comuns e promover um código mais organizado, testável e de fácil manutenção.

## APIs desenvolvidas

Durante o treinamento, são implementadas as seguintes funcionalidades:

1. [Cadastro de usuários](https://github.com/rmanguinho/clean-ts-api/blob/master/requirements/signup.md)
2. [Login](https://github.com/rmanguinho/clean-ts-api/blob/master/requirements/login.md)
3. [Criar enquete](https://github.com/rmanguinho/clean-ts-api/blob/master/requirements/add-survey.md)
4. [Listar enquetes](https://github.com/rmanguinho/clean-ts-api/blob/master/requirements/load-surveys.md)
5. [Responder enquete](https://github.com/rmanguinho/clean-ts-api/blob/master/requirements/save-survey-result.md)
6. [Consultar resultado da enquete](https://github.com/rmanguinho/clean-ts-api/blob/master/requirements/load-survey-result.md)

## Princípios

Princípios e boas práticas aplicados ao desenvolvimento:

- Single Responsibility Principle (SRP)
- Open/Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)
- Separation of Concerns (SoC)
- Don't Repeat Yourself (DRY)
- You Aren't Gonna Need It (YAGNI)
- Keep It Simple, Silly (KISS)
- Composition Over Inheritance
- Small Commits

## Design Patterns

Padrões de projeto utilizados para promover desacoplamento, flexibilidade e reutilização:

- Factory
- Adapter
- Composite
- Decorator
- Proxy
- Dependency Injection
- Abstract Server
- Composition Root
- Builder
- Singleton

## Metodologias e Design

- Test-Driven Development (TDD)
- Clean Architecture
- Domain-Driven Design (DDD)
- Conventional Commits
- GitFlow
- Modular Design
- Dependency Diagrams
- Use Cases
- Continuous Integration (CI)
- Continuous Delivery (CD)
- Continuous Deployment

## Bibliotecas e Ferramentas

| Categoria | Tecnologias |
|---|---|
| Linguagem | TypeScript |
| Runtime e Framework | Node.js, Express |
| Gerenciamento de pacotes | NPM |
| Containerização | Docker |
| Banco de dados | MongoDB |
| Testes | Jest, Supertest |
| Testes de banco de dados | In-Memory MongoDB Server |
| API Documentation | Swagger |
| Segurança | Bcrypt, JsonWebToken |
| Dados de teste | Faker |
| Validação | Validator |
| GraphQL | Apollo Server Express, GraphQL, GraphQL ISO Date, GraphQL Scalars, GraphQL Tools |
| CI/CD | Travis CI |
| Cobertura de testes | Coveralls |
| Qualidade de código | ESLint, Standard JavaScript Style |
| Automação | Husky, Lint Staged |
| Transpilação | Sucrase |
| Desenvolvimento | Nodemon, Module-Alias |
| Build e limpeza | Rimraf, Copyfiles |
| Verificação de dependências | NPM Check |
| Identificadores | BSON ObjectId |
| Testes GraphQL | Apollo Server Integration Testing |
| Testes de data | MockDate |

## Recursos do Node.js

- Documentação de API com Swagger
- Desenvolvimento de APIs REST com Express
- Implementação de GraphQL com Apollo Server
- Log de erros
- Segurança: Hashing, Encryption e Encoding
- Configuração de CORS
- Middlewares
- Controle de acesso às rotas (Admin, User e Anonymous)
- Deploy no Heroku
- Servir arquivos estáticos

## Recursos do GraphQL

- Types
- Queries
- Mutations
- Resolvers
- Type Definitions
- Directives
- Scalars
- Plugins
- Error Handling

## Recursos do Git

- Aliases
- Log personalizado
- Branches
- Reset
- Amend
- Tags
- Stash
- Rebase
- Merge

## Recursos do TypeScript

- Programação Orientada a Objetos (POO) avançada
- Interfaces
- Type Alias
- Namespaces
- Utility Types
- Modularização de Paths
- Configurações
- Build
- Deploy
- Uso de Breakpoints

## Estratégias de Testes

Práticas utilizadas para garantir a qualidade e confiabilidade da aplicação:

- Testes Unitários
- Testes de Integração (REST API e GraphQL)
- Cobertura de Testes
- Test Doubles
- Mocks
- Stubs
- Spies
- Fakes

## Recursos do MongoDB

Operações e recursos de banco de dados explorados no treinamento:

**Conexão e operações básicas**

- Connect e Reconnect
- Collections
- InsertOne e InsertMany
- Find, FindOne e FindOneAndUpdate
- DeleteMany
- UpdateOne

**Aggregation Pipeline**

- Match
- Group
- Unwind
- Lookup
- AddFields
- Project
- Sort

**Operações e operadores**

- ObjectId
- Upsert e ReturnOriginal
- Push
- Divide
- Multiply
- ArrayElemAt
- Cond
- Sum
- Filter
- Map
- Reduce
- MergeObjects
- ConcatArrays

## Objetivos de aprendizagem

Ao acompanhar o projeto, os principais objetivos são:

- Desenvolver APIs REST e GraphQL com Node.js e TypeScript.
- Aplicar Clean Architecture na organização das responsabilidades.
- Utilizar TDD para orientar o desenvolvimento.
- Aplicar os princípios SOLID e Design Patterns.
- Desenvolver aplicações desacopladas e testáveis.
- Implementar autenticação e autorização.
- Trabalhar com bancos de dados NoSQL utilizando MongoDB.
- Criar testes unitários e de integração.
- Implementar práticas de integração e entrega contínua.
- Compreender o desenvolvimento de software orientado a requisitos.

## Documentação da API

Acesse a documentação interativa para consultar os endpoints disponíveis:

[**Swagger – Clean Node API**](http://fordevs.herokuapp.com/api-docs)

## Curso completo

Treinamento ministrado pelo professor Rodrigo Manguinho (Mango).

[**Acessar Clean Node API na Udemy**](https://www.udemy.com/course/tdd-com-mango/?referralCode=B53CE5CA2B9AFA5A6FA1)

---

<p align="center">
  Desenvolvido como parte dos estudos de arquitetura de software, desenvolvimento backend, testes automatizados e boas práticas de programação.
</p>
