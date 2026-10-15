import type { DataSaude } from "../../types";

/* Campanhas de saúde do calendário. Os temas são os divulgados pelo Ministério da Saúde e por entidades médicas.
   A peça de marca nunca pega carona na causa: informa, convida e cita a fonte. */

const CAMPANHAS = { nome: "Ministério da Saúde · Campanhas", url: "https://www.gov.br/saude/pt-br/campanhas-da-saude" };
const VACINACAO = { nome: "Ministério da Saúde · Vacinação", url: "https://www.gov.br/saude/pt-br/vacinacao" };

export const DATAS_SAUDE: DataSaude[] = [
  { id: "data-janeiro-branco", mes: 1, nome: "Janeiro Branco", tema: "Saúde mental", foco: ["Bem-estar", "Sono", "Serviços farmacêuticos"], fonte: { nome: "Ministério da Saúde · Saúde mental", url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental" } },
  { id: "data-fevereiro-roxo", mes: 2, nome: "Fevereiro Roxo e Laranja", tema: "Alzheimer, lúpus e fibromialgia (roxo) e leucemia (laranja)", foco: ["Serviços farmacêuticos", "Cuidadores"], fonte: CAMPANHAS },
  { id: "data-marco-azul-marinho", mes: 3, nome: "Março Azul-Marinho", tema: "Prevenção do câncer colorretal", foco: ["Serviços farmacêuticos", "Alimentação e fibras"], fonte: CAMPANHAS },
  { id: "data-vacinacao-gripe", mes: 4, nome: "Campanha de vacinação contra a gripe", tema: "Vacinação anual contra a influenza", foco: ["Vacinação na farmácia", "Antigripais", "Álcool em gel"], fonte: VACINACAO },
  { id: "data-maio-amarelo", mes: 5, nome: "Maio Amarelo", tema: "Segurança no trânsito", foco: ["Primeiros socorros", "Kit de emergência"], fonte: CAMPANHAS },
  { id: "data-junho-vermelho", mes: 6, nome: "Junho Vermelho", tema: "Doação de sangue", foco: ["Hidratação", "Ferro e alimentação"], fonte: CAMPANHAS },
  { id: "data-julho-amarelo", mes: 7, nome: "Julho Amarelo", tema: "Hepatites virais", foco: ["Testes rápidos", "Vacinação na farmácia"], fonte: { nome: "Ministério da Saúde · Hepatites virais", url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/h/hepatites-virais" } },
  { id: "data-agosto-dourado", mes: 8, nome: "Agosto Dourado", tema: "Aleitamento materno", foco: ["Maternidade", "Cuidados com os seios", "Higiene infantil"], fonte: CAMPANHAS },
  { id: "data-setembro-amarelo", mes: 9, nome: "Setembro Amarelo", tema: "Prevenção do suicídio e valorização da vida", foco: ["Bem-estar", "Serviços farmacêuticos"], fonte: CAMPANHAS },
  { id: "data-outubro-rosa", mes: 10, nome: "Outubro Rosa", tema: "Prevenção do câncer de mama", foco: ["Serviços farmacêuticos", "Cuidados com a pele"], fonte: { nome: "Ministério da Saúde · Câncer de mama", url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/c/cancer-de-mama" } },
  { id: "data-novembro-azul", mes: 11, nome: "Novembro Azul", tema: "Saúde do homem e prevenção do câncer de próstata", foco: ["Serviços farmacêuticos", "Cuidados masculinos"], fonte: CAMPANHAS },
  { id: "data-dezembro-laranja", mes: 12, nome: "Dezembro Laranja", tema: "Prevenção do câncer de pele", foco: ["Protetor solar", "Pós-sol"], fonte: { nome: "Ministério da Saúde · Câncer de pele", url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/c/cancer-de-pele" } },
  { id: "data-dezembro-vermelho", mes: 12, nome: "Dezembro Vermelho", tema: "Prevenção ao HIV e às infecções sexualmente transmissíveis", foco: ["Testes rápidos", "Preservativos"], fonte: CAMPANHAS },
];
