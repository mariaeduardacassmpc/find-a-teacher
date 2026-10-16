# Encontre um Professor

Aplicação desenvolvida como solução para um desafio técnico, com o objetivo de encontrar professores de idiomas disponíveis para atender à agenda de um aluno.

O aluno informa o idioma desejado, os dias da semana, a faixa de horário e a duração da aula. A aplicação retorna os professores elegíveis, os horários disponíveis em comum e os professores não elegíveis, acompanhados dos respectivos motivos.

## Tecnologias utilizadas

**Backend**

- C#
- .NET 8
- ASP.NET Core Web API

**Frontend**

- React
- TypeScript
- Vite

## Estrutura do projeto

```
find-a-teacher-api/
├── backend/
├── frontend/
├── README.md
└── USO_DE_IA.md
```

O arquivo `professores.json` contém os dados utilizados pela aplicação para realizar a busca de professores.

## Como executar o projeto

### Pré-requisitos

- .NET 8 SDK
- Node.js e npm

### 1. Executar o backend

Entre na pasta `backend`:

```
cd backend
cd src
cd FindATeacher.Api
```

Restaure as dependências e execute a API:

```
dotnet restore
dotnet run
```

A API será iniciada no endereço exibido no terminal.

### 2. Executar o frontend

Em outro terminal, entre na pasta `frontend`:

```
cd frontend
```

Instale as dependências e inicie a aplicação:

```
npm install
npm run dev
```

Acesse no navegador o endereço informado pelo Vite no terminal.

## Endpoint

### Buscar professores disponíveis

`POST /api/professores/busca`

Exemplo de requisição:

```
{
  "idioma": "Espanhol",
  "dias": ["segunda"],
  "inicioFaixa": "18:00",
  "fimFaixa": "20:00",
  "duracaoMinutos": 60
}
```

A resposta contém duas listas: `professores`, com os professores elegíveis e seus horários disponíveis, e `naoElegiveis`, com os professores que não atendem aos critérios e os respectivos motivos.

## Validações da busca de professores

- Validação do idioma obrigatório.
- Validação da seleção de pelo menos um dia da semana.
- Validação dos dias da semana informados.
- Validação do formato dos horários (`HH:mm`).
- Validação de que o horário final seja posterior ao inicial.
- Validação das durações permitidas: 30, 60 ou 90 minutos.
- Validação para impedir dias da semana duplicados.
- Validação para permitir apenas horários com minutos 00 ou 30.

## Regras da busca

- O professor precisa ensinar o idioma pedido.
- Professores com agenda bloqueada não aparecem entre os elegíveis.
- **Horário fixo:** o mesmo horário de início precisa estar livre em todos os dias pedidos.
- A aula precisa caber inteiramente dentro de um bloco de disponibilidade do professor e da faixa de horário solicitada.
- A aula não pode se sobrepor a uma aula já marcada. **Encostar é permitido:** uma aula que termina às 19:00 permite outra começando às 19:00.
- A aula só pode começar em hora cheia ou meia hora (`:00` ou `:30`).
- **Ordenação dos professores:** primeiro quem tem menos aulas marcadas na semana; em caso de empate, ordem alfabética do nome.
- Os horários disponíveis de cada professor são apresentados em ordem crescente.

## Testes

O projeto contempla testes automatizados em C# para validar as regras de negócio sem precisar iniciar a API. Os testes devem cobrir os principais cenários da busca, incluindo disponibilidade, conflitos de horários, idioma, agenda bloqueada e ordenação dos resultados.

Para executar os testes, na pasta da solução que contém o projeto de testes, utilize:

```
dotnet test
```

| **Teste** | **Regra validada** |
| --- | --- |
| Buscar_IdiomaNaoEnsinado_DeveRetornarMotivoCorreto | Exclui quem não ensina o idioma solicitado. |
| Buscar_AgendaBloqueada_NaoDeveRetornarProfessorComoElegivel | Exclui professor com agenda bloqueada. |
| Buscar_DiasSemHorarioDeInicioComum_DeveExcluirProfessor | Exige um horário de início comum a todos os dias. |
| Buscar_DeveOrdenarProfessoresPorQuantidadeDeAulasENome | Ordena os professores pela quantidade de aulas e ordem alfabetica. |
| Buscar_HorarioDeveCaberInteiroNaFaixaSolicitada | A aula deve terminar dentro da faixa pedida. |
| Buscar_IdiomaVazio_DeveLancarExcecao | Valida os dados de entrada. |
| Buscar_AulaMarcada_DevePermitirHorarioQueApenasEncosta | Testa conflito e horário que encosta no início de uma aula marcada |

## O que ficou faltando

- **Melhorias na interface:** aprimorar a apresentação dos resultados da busca para facilitar a comparação entre professores e seus horários disponíveis.
- **Testes automatizados:** ampliar a cobertura de testes das validações da requisição e das regras de negócio da busca.

## Decisões técnicas e regras de negócio

- Frontend baseado no site oficial.
- Concentrar a lógica de busca no `ProfessorService`, em vez de deixá-la no controller.
- Separação em `Api`, `Application` e `Domain`  para separar responsabilidades e facilitar a manutenção.
- Separar o formulário e a apresentação dos resultados em componentes.
- Criar a interface `IProfessorRepository` para desacoplar o serviço da origem dos dados.
- Criar um `FakeProfessorRepository` para fornecer dados controlados aos testes.
- Utilizar xUnit.
- Dias repetidos na requisição: dias duplicados são considerados apenas uma vez na busca, evitando processar o mesmo dia repetidamente.
