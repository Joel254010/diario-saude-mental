# Diário de Saúde Mental e Gratidão

Um aplicativo web completo para bem-estar mental, gratidão e autocuidado.

## ✨ Recursos Implementados

### 🔐 Autenticação
- Sistema completo de login e cadastro com Supabase
- Gerenciamento seguro de sessões
- Perfis de usuário personalizados

### 🏠 Painel Principal (Dashboard)
- Saudação personalizada baseada no horário
- Mensagem motivacional diária única (365 mensagens diferentes)
- Contador de hidratação com barra de progresso
- Calendário de humor visual
- Acesso rápido a todas as funcionalidades

### ✍️ Diário de Gratidão
- Registro diário de humor (escala 1-5 com emojis)
- Três campos para gratidões do dia
- Área de reflexão livre
- Salvamento automático no banco de dados

### 💧 Hidratação
- Meta personalizável de copos de água
- Contador interativo com progresso visual
- Integrado ao registro diário

### 📊 Progresso
- Gráfico de humor semanal
- Contador de dias consecutivos de registro (streak)
- Nuvem de palavras das reflexões mais frequentes
- Insights personalizados baseados nos dados

### 🎯 Desafios de Bem-Estar
Três desafios completos:
- **21 Dias de Gratidão** - Prática diária de gratidão
- **7 Dias para Mente Leve** - Foco em leveza mental
- **30 Dias de Autocuidado** - Um mês dedicado ao autocuidado

Cada desafio inclui:
- Tarefas diárias únicas
- Progresso visual
- Mensagem de conclusão especial

### 💌 Cartas para o Futuro
- Escrever mensagens para o eu futuro
- Escolher data de entrega
- Sistema de notificação quando a carta está pronta
- Visualização especial ao abrir cartas

### 💜 Botão SOS Emocional
- Acesso rápido em qualquer tela
- Exercício de respiração guiada (4-4-4)
- Animação visual para auxiliar a prática
- Mensagem acolhedora

### ⚙️ Configurações
- Editar nome e preferências
- Ajustar meta de hidratação
- Ativar/desativar notificações
- Alternar modo claro/escuro
- Opção de excluir conta

## 🎨 Design

### Cores
- Lavanda: #B49EDC
- Verde-claro: #BCEAD5
- Azul-água: #A8E0FF
- Branco: #FFFFFF

### Tipografia
- Fonte: Quicksand (importada via Google Fonts)
- Estilo arredondado e amigável

### Visual
- Gradientes suaves
- Animações delicadas
- Layout minimalista e intuitivo
- Totalmente responsivo (mobile-first)

## 🗄️ Banco de Dados

### Tabelas Criadas
1. **profiles** - Perfis de usuário
2. **daily_entries** - Entradas diárias do diário
3. **challenges** - Desafios ativos e concluídos
4. **future_letters** - Cartas para o futuro

### Segurança
- Row Level Security (RLS) ativado em todas as tabelas
- Políticas de acesso restritivas
- Usuários só acessam seus próprios dados
- Autenticação segura via Supabase Auth

## 📱 PWA Ready

- Metadata para Progressive Web App
- Ícone personalizado (💧)
- Tema color configurado
- Otimizado para instalação

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Build**: Vite
- **Ícones**: Lucide React

## 📝 Funcionalidades Futuras Sugeridas

- Notificações push reais (via PWA)
- Modo noturno automático às 20h
- Reflexões guiadas com áudio
- Resumo semanal automático
- Export de dados (PDF/JSON)
- Gráficos avançados de progresso
- Integração com calendário
- Compartilhamento de conquistas

## 💼 Créditos

**Desenvolvido por:** My GlobyX
**Slogan:** Inspirando Transformações Reais

---

*Este é um projeto completo e funcional pronto para uso em produção.*
