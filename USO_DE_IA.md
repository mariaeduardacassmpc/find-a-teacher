# Uso de Inteligência Artificial

## Ferramentas utilizadas

Utilizei o Claude Code como ferramenta de apoio durante o desenvolvimento do projeto Encontre um professor.

## Como utilizei a IA

Utilizei a ferramenta para esclarecer dúvidas técnicas, revisar implementações e auxiliar na identificação de possíveis problemas durante o desenvolvimento.

Os principais usos foram:

- **Backend em C# e .NET 8:** apoio na revisão das regras de negócio para busca de professores, considerando idioma, disponibilidade, duração da aula e compatibilidade de horários.
- **Testes automatizados:** auxílio na elaboração e revisão de testes unitários com xUnit, incluindo cenários de sucesso, restrições de horário e ordenação dos resultados.
- **Frontend:** auxílio com CSS e ajustes de layout e responsividade.


## Caso em que a IA errou

Durante a publicação da aplicação, inicialmente considerei que, por o frontend e o backend estarem no mesmo repositório, seria possível publicá-los juntos sem configurações adicionais. A orientação inicial não deixou suficientemente clara a diferença entre compartilhar um repositório e compartilhar um ambiente de execução.

Ao investigar o problema, percebi que o frontend hospedado no Vercel e a API .NET precisavam estar acessíveis por URLs e ambientes de execução configurados corretamente. Também identifiquei a necessidade de configurar o CORS no backend para permitir as requisições originadas do frontend.

Esse caso mostrou a importância de verificar as orientações recebidas e compreender como os serviços de hospedagem funcionam, em vez de aplicar uma sugestão sem validar seus efeitos.

## Considerações finais

Utilizei a inteligência artificial como ferramenta de apoio ao aprendizado e à produtividade, não como substituta da compreensão técnica. Procurei avaliar as sugestões, entender o propósito de cada alteração e relacionar as decisões de implementação aos requisitos do desafio.
