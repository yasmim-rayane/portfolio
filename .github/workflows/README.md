# Documentação dos Workflows CI/CD

## Visão Geral

Este diretório contém os arquivos de configuração do GitHub Actions responsáveis pela automação de testes, validação e deploy do projeto. O sistema implementa uma estratégia de integração e entrega contínuas (CI/CD) adaptada ao fluxo de desenvolvimento baseado em duas branches principais.

### Estrutura de Branches

- **beta**: Branch de desenvolvimento onde novas funcionalidades são implementadas e testadas
- **main**: Branch de produção que contém código validado e pronto para deploy

---

## Workflows Configurados

### 1. Beta CI (`beta-ci.yml`)

**Objetivo:** Validação automática de código na branch de desenvolvimento

**Gatilho:** Push ou Pull Request na branch `beta`

**Processos executados:**
- Compilação de arquivos SASS para CSS
- Validação de estrutura HTML
- Verificação de sintaxe JavaScript
- Confirmação de existência de assets críticos

**Resultado:** Feedback imediato sobre a integridade do código antes do merge para produção

---

### 2. Main Deploy (`main-deploy.yml`)

**Objetivo:** Deploy automatizado para ambiente de produção

**Gatilho:** Push na branch `main`

**Processos executados:**
1. Execução completa da suíte de testes
2. Compilação e minificação de assets
3. Criação automática de tag de versão (Semantic Versioning)
4. Deploy no GitHub Pages
5. Publicação de Release Notes

**Resultado:** Site atualizado automaticamente com nova versão documentada

---

### 3. PR Check (`pr-check.yml`)

**Objetivo:** Validação de Pull Requests antes do merge

**Gatilho:** Criação de Pull Request de `beta` para `main`

**Processos executados:**
- Bateria completa de testes de validação
- Comentário automático no PR com resultados
- Bloqueio de merge em caso de falhas

**Resultado:** Garantia de qualidade do código antes de entrar em produção

---

## Fluxo de Trabalho Recomendado

### Desenvolvimento (Branch Beta)

```bash
# Desenvolvimento em andamento
git checkout beta
git add .
git commit -m "feat: implementa nova funcionalidade"
git push origin beta

# GitHub Actions executa: Beta CI
# Status: Validação automática
```

### Publicação (Branch Main)

```bash
# Código validado e pronto para produção
git checkout main
git merge beta
git push origin main

# GitHub Actions executa: Main Deploy
# Resultado: Site atualizado automaticamente
```

---

## Versionamento Automático

O sistema utiliza Semantic Versioning (SemVer) para controle de versões:

**Formato:** `MAJOR.MINOR.PATCH` (ex: v1.2.3)

**Convenção de commits:**
- `fix:` → incrementa PATCH (v1.0.0 → v1.0.1)
- `feat:` → incrementa MINOR (v1.0.0 → v1.1.0)
- `feat!:` ou `BREAKING CHANGE:` → incrementa MAJOR (v1.0.0 → v2.0.0)

---

## Monitoramento

### Visualização de Execuções

Acesse o histórico de execuções em:
```
https://github.com/yasmim-rayane/portfolio-front-end-final/actions
```

### Releases Publicadas

Consulte as versões publicadas em:
```
https://github.com/yasmim-rayane/portfolio-front-end-final/releases
```

---

## Configuração Necessária

### Requisitos no Repositório

1. **GitHub Pages**
   - Navegue até: Settings → Pages
   - Configure Source como "GitHub Actions"

2. **Permissões do Workflow**
   - Navegue até: Settings → Actions → General
   - Defina Workflow permissions como "Read and write permissions"
   - Habilite "Allow GitHub Actions to create and approve pull requests"

### Branch Protection (Opcional)

Para forçar validação via Pull Requests:
- Settings → Branches → Add rule
- Branch name pattern: `main`
- Habilitar: "Require status checks to pass before merging"
- Selecionar: "PR Check" como check obrigatório

---

## Troubleshooting

### Erros Comuns

**"Resource not accessible by integration"**
- Causa: Permissões insuficientes
- Solução: Verificar configuração de permissões em Settings → Actions

**"SASS compilation failed"**
- Causa: Erro de sintaxe nos arquivos SCSS
- Solução: Compilar localmente para identificar o erro

**"Deploy failed"**
- Causa: GitHub Pages não configurado
- Solução: Ativar GitHub Pages em Settings → Pages

---

## Referências

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

Última atualização: Janeiro 2026
