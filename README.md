## Auditor Fiscal - Sistema de Correção de Tributação

### Páginas

#### "/corrigir-icms"
- Ferramenta que compara dois arquivos excel fornecidos pelo usuario e gera um terceiro a partir da comparação entre esses arquivos.

- O primeiro arquivo deve ser o Anexo 1 de substituição tributária da sefaz com as colunas `Código do item, CEST, NCM, Descrição, Acordos, MVA Ajustada e MVA Original` (nessa ordem). 

- O segundo arquivo é uma base de produtos com as colunas `Código, NCM e CSO` (nessa ordem).

- Ambos arquivos no formato excel (.xlsx)

- Ao final da comparação é possível gerar um arquivo em excel com o resultado e a tributação corrigida.

#### "/corrigir-ncm"

- Ferramenta que compara dois arquivos excel fornecidos pelo usuario e gera um terceiro a partir da comparação entre esses arquivos.

- O primeiro arquivo deve ser uma base de NCM com as colunas `Descrição e NCM` (nessa ordem). 

- O segundo arquivo é uma base de produtos com as colunas `Código, Descrição e NCM` (nessa ordem).

- Ambos arquivos no formato excel (.xlsx)

- Ao final da comparação é possível gerar um arquivo em excel com o resultado e os NCMs corrigidos.

#### "/importar-xml"

- Ferramenta para importação de arquivos XML para criar base de produtos.