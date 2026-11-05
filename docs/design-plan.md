# Design plan — Pessoas e Envolvimentos

## Entendimento

O usuário principal é o membro de comitê, que recebe e investiga relatos. Hoje o sistema não registra quem está envolvido em cada relato.

O PRD tem dois épicos:

- **Pessoa:** cadastro central de pessoas, que pertencem ao sistema (não a uma empresa). O CPF é único.
- **Envolvimento:** vínculo entre uma pessoa e um relato, com um tipo (relatante, testemunha, vítima ou denunciado). Um relato sem relatante é anônimo.

O back-end já está pronto (ver `API.md`) e não pode ser alterado. Todo o trabalho fica em `client/`.

## O que vou construir

### Épico 1 — Pessoas

- Novo item **Pessoas** no menu lateral, com rota `/people`.
- Tabela com nome, CPF, e-mail, data de nascimento e ações (editar e excluir).
- Modal de cadastro e de edição com os quatro campos obrigatórios.
- Exclusão com confirmação.

Validações no formulário:

- Todos os campos obrigatórios.
- E-mail em formato válido.
- CPF com 11 dígitos. O campo aceita só números e remove pontuação ao colar; na tabela, o CPF aparece formatado (`000.000.000-00`).
- Data de nascimento não pode ser futura.

Quando a API retornar **409** (CPF duplicado), a mensagem aparece no próprio campo de CPF.

### Épico 2 — Envolvimentos

- Nova ação **Envolvidos** em cada linha da tabela de relatos, que abre um painel lateral (Drawer) com:
  - Indicador claro de **Anônimo** ou **Identificado**, vindo do `is_anonymous` da API.
  - Lista de envolvidos: nome, CPF e tipo (tag colorida por tipo).
  - Botão para remover um envolvido, com confirmação.
  - Formulário para vincular: seleção de pessoa (com busca) e tipo de envolvimento.
- Pessoas já vinculadas ao relato não aparecem na seleção, para evitar a duplicata antes de chegar ao back. O 409 continua tratado.
- Tipos exibidos em português: Relatante, Testemunha, Vítima e Denunciado.

### Extras

- Busca por nome ou CPF na tabela de pessoas, ignorando acentos, maiúsculas e a pontuação do CPF.
- Indicadores no Dashboard: total de empresas, relatos, relatos aguardando investigação e pessoas, além de um gráfico de relatos por status. Usam as listas que as rotas existentes já devolvem.
- Interface toda em português: configuração do idioma do Ant Design e do Day.js, que antes exibiam alguns textos em inglês.

## Decisões

1. **Seguir a arquitetura existente.** Criar `domain/person` e `domain/involvement` no mesmo formato de `company` e `record` (services em `api/`, tipos, context e componentes), reaproveitando `request.ts` e os componentes de `@shared`.
2. **O back-end é a fonte da verdade do anonimato.** O front não calcula `is_anonymous`. Depois de vincular ou remover alguém, a lista é buscada de novo, e o indicador se atualiza sozinho. Isso respeita a regra do PRD de que o anonimato é responsabilidade do envolvimento.
3. **Validação de CPF igual à do back.** O front valida 11 dígitos numéricos, sem dígito verificador, para não rejeitar dados que a API aceita (como os do seed).
4. **Envolvidos ficam dentro do relato, não na listagem.** A rota de relatos não retorna `is_anonymous`. Mostrar isso na tabela exigiria uma requisição por linha. Por isso o indicador aparece no Drawer de cada relato.
5. **Nenhuma biblioteca nova.** Ant Design e Dayjs, que já estão no projeto, cobrem o que é preciso, inclusive o gráfico do Dashboard.

## Riscos e pontos de atenção

- **Não existe edição de envolvimento** (a API não tem PUT). A ideia era trocar o tipo removendo e vinculando de novo, mas os testes mostraram que isso falha: o back faz soft delete, e o índice único (relato, pessoa) continua valendo para o envolvimento excluído. A API responde 500. Como o back-end não pode ser alterado, registrei como limitação conhecida.
- **O mesmo acontece com o CPF:** o CPF de uma pessoa excluída não pode ser reutilizado (500 pelo mesmo motivo). No front, os erros 5xx exibem uma mensagem amigável em vez do SQL.
- **Exclusão de pessoa já vinculada a relatos:** o envolvimento continua existindo, e a API passa a devolver `person: null`. O Drawer mostra a linha como "Pessoa excluída".
- **Formato dos erros:** confirmado durante a implementação. A API responde `{ statusCode, error: { type, description } }`. O 409 é exibido no campo correspondente; os demais erros, em notificação.
- **`/people` não tem filtro nem paginação:** a busca é feita no front. Para o volume deste cenário isso é suficiente.

## Melhorias futuras

- **Aviso ao remover o único relatante,** informando que o relato passará a ser anônimo.
- **Ver em quais relatos uma pessoa está envolvida.** Hoje exigiria uma requisição por relato; o ideal seria uma rota no back-end.
- **Indicador de anonimato na listagem de relatos,** pelo mesmo motivo: precisaria que a rota de relatos devolvesse o `is_anonymous`.
- **Code splitting por rota.** O build gera um pacote de cerca de 1,3 MB, principalmente pelo Ant Design. Carregar cada página sob demanda reduziria o carregamento inicial.

## Fora do escopo

Conforme o PRD: fluxo completo de investigação, autenticação, notificações externas e app móvel.

## Validação

- Os cenários testados manualmente, com passos, resultado esperado e resultado obtido, ficam em `docs/evidences.md`.
- As funções auxiliares (formatação, tratamento de erros e conversão entre formulário e API) têm testes unitários com Vitest, ao lado de cada arquivo, seguindo o padrão do projeto.
- Antes da entrega, o lint, a checagem de tipos, os testes e o build de produção do projeto rodam sem erros.