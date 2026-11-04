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
- Busca por nome ou CPF na própria tabela (extra).

Validações no formulário:

- Todos os campos obrigatórios.
- E-mail em formato válido.
- CPF com 11 dígitos, digitado com máscara (`000.000.000-00`) e enviado só com números.
- Data de nascimento não pode ser futura.

Quando a API retornar **409** (CPF duplicado), a mensagem aparece no próprio campo de CPF.

### Épico 2 — Envolvimentos

- Nova ação **Envolvidos** em cada linha da tabela de relatos, que abre um painel lateral (Drawer) com:
    - Indicador claro de **Anônimo** ou **Identificado**, vindo do `is_anonymous` da API.
    - Lista de envolvidos: nome, CPF e tipo (tag colorida por tipo).
    - Botão para remover um envolvido, com confirmação.
    - Formulário para vincular: seleção de pessoa (com busca) e tipo de envolvimento.

## Decisões

1. **Seguir a arquitetura existente.** Criar `domain/person` e `domain/involvement` no mesmo formato de `company` e `record` (services em `api/`, tipos, context e componentes), reaproveitando `request.ts` e os componentes de `@shared`.
2. **O back-end é a fonte da verdade do anonimato.** O front não calcula `is_anonymous`. Depois de vincular ou remover alguém, a lista é buscada de novo, e o indicador se atualiza sozinho. Isso respeita a regra do PRD de que o anonimato é responsabilidade do envolvimento.
3. **Validação de CPF igual à do back.** O front valida 11 dígitos numéricos, sem dígito verificador, para não rejeitar dados que a API aceita (como os do seed).
4. **Envolvidos ficam dentro do relato, não na listagem.** A rota de relatos não retorna `is_anonymous`. Mostrar isso na tabela exigiria uma requisição por linha. Por isso o indicador aparece no Drawer de cada relato.
5. **Nenhuma biblioteca nova.** Ant Design e Dayjs, que já estão no projeto, cobrem o que é preciso.

## Riscos e pontos de atenção

- **Não existe edição de envolvimento** (a API não tem PUT). Para trocar o tipo, o usuário remove e vincula de novo.
- **Exclusão de pessoa já vinculada a relatos:** o comportamento depende do back (soft delete). Vou validar manualmente e registrar nas evidências.
- **Formato dos erros 422/409:** preciso confirmar o formato que a API devolve para exibir as mensagens corretamente.
- **`/people` não tem filtro nem paginação:** a busca é feita no front. Para o volume deste cenário isso é suficiente.

## Fora do escopo

Conforme o PRD: fluxo completo de investigação, autenticação, notificações externas e app móvel.

## Validação

Os cenários testados manualmente, com passos, resultado esperado e resultado obtido, ficam em `docs/evidences.md`.