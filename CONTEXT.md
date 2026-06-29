# CRM Psi

Glossário de domínio para um CRM SaaS multi-tenant usado por psicólogos para gerenciar pacientes e consultas.

## Language

**Consultório**:
Organização (clínica ou prática) que possui pacientes e dados; unidade isolada de dados e configuração no sistema — não o psicólogo individual. Inicialmente um usuário, expandível para múltiplos profissionais.
_Avoid_: Tenant, Conta, Organização

**Usuário**:
O psicólogo que opera o consultório — cadastra pacientes, agenda consultas e acessa o sistema em nome da prática. Inicialmente há um único usuário por consultório.
_Avoid_: Psicólogo, Profissional, Admin

**Paciente**:
Pessoa cadastrada no consultório; objeto central do acompanhamento clínico e administrativo. Pode estar em estágio **Lead** (em potencial, ainda sem acompanhamento) ou **Paciente** (em acompanhamento ativo). Na interface, as listagens separam os dois estágios; no domínio é o mesmo registro.
_Avoid_: Cliente, Atendido

**Lead**:
Estágio inicial de um **Paciente** — pessoa em potencial, ainda não promovida a acompanhamento ativo. Compartilha a mesma estrutura de dados; a promoção para **Paciente** é uma transição de estágio irreversível, não um cadastro novo. Pode ter **Anotações**, **Etiquetas**, **Lembretes** e **Contatos**; **Sessões** só após a promoção. Listagem e detalhe em `/leads`; após promoção, o registro passa a `/patients`.
_Avoid_: Prospecto, Cliente potencial

**Endereço**:
Local de residência ou atendimento de um **Paciente**, armazenado como texto livre; a busca por mapa na interface é apenas auxílio ao preenchimento.
_Avoid_: Localização, Coordenada

**Sessão**:
Encontro terapêutico entre psicólogo e paciente — presencial ou online; inclui **Anotações** clínicas, links de drive, produtos indicados, etc. Irmão de **Contato** (registros separados, sem hierarquia); não gera automaticamente um **Contato**. Pertence a um **Paciente** dentro de um **Consultório**.

**Anotação**:
Registro cronológico de anotação clínica dentro de uma **Sessão**; possui conteúdo e data/hora de registro. Várias anotações por sessão, ordenadas no tempo.
_Avoid_: Nota, Journal entry

**Contato**:
Interação com o paciente fora de sessão terapêutica — WhatsApp, ligação para remarcar, follow-up operacional. Irmão de **Sessão** (registros separados, sem hierarquia). Pertence a um **Paciente** dentro de um **Consultório**.
_Avoid_: Atendimento

**Lembrete**:
Compromisso de retomar contato com um **Paciente** em uma data alvo — follow-up alternativo a agendar uma **Sessão** futura, dentro de um **Consultório**. Gera **Alerta** para o **Usuário** quando vencido ou próximo; ao agir, concretiza-se como **Contato** ou **Sessão** agendada.
_Avoid_: Tarefa, Follow-up

**Alerta**:
Notificação para o **Usuário** sobre **Lembretes** vencidos ou próximos e **Sessões** próximas ou atrasadas.
_Avoid_: Notificação, Aviso

**Produto**:
Item do catálogo de um **Consultório** — livro, curso, material — que o psicólogo pode indicar aos pacientes. Sem controle de estoque ou preço na v1.
_Avoid_: Item, SKU, Mercadoria

**Indicação**:
Registro de que um **Produto** foi recomendado a um **Paciente** em uma **Sessão**; pode ser marcada como vendida pelo consultório.
_Avoid_: Recomendação, Prescrição

**Etiqueta**:
Marcador do catálogo de um **Consultório** — nome e cor de exibição — reutilizável para classificar **Pacientes** e **Sessões**. Vive no repositório central de etiquetas da prática; não é o rótulo de um link de arquivo.
_Avoid_: Label, Tag, Rótulo (reservado a links de arquivo)

O glossário permanece em português. Identificadores de código usam inglês — ex.: **Consultório** → `Practice`, **Paciente** → `Patient`, **Indicação** → `Referral`.
