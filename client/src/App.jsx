import { useState } from "react";

import ArticleList from "./components/ArticleList";

const articleList = [
  {
    id: 1,
    title: "R",
    paragraph: "Paragraph R",
    color: "red",
  },
  {
    id: 2,
    title: "B",
    paragraph: "Paragraph B",
    color: "blue",
  },
  {
    id: 3,
    title: "G",
    paragraph: "Paragraph G",
    color: "green",
  },
  {
    id: 4,
    title: "B",
    paragraph: "Paragraph B",
    color: "black",
  },
];

function ArticleForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");

  return (
    <form
      method="POST"
      onSubmit={(e) => {
        e.preventDefault();

        onAdd((articles) => [...articles, { id: articles.length + 1, title, paragraph, color: "red" }]);
        setTitle("");
        setParagraph("");
      }}
    >
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        style={{ color: "black" }}
      />
      <label htmlFor="paragraph">Paragraph</label>
      <input
        type="text"
        id="paragraph"
        name="paragraph"
        value={paragraph}
        onChange={(e) => setParagraph(e.currentTarget.value)}
        style={{ color: "black" }}
      />

      <input type="submit" style={{ color: "black" }} value="Add Article" />
    </form>
  );
}

function App() {
  const [articles, setArticles] = useState(articleList);

  return (
    <main>
      <ArticleList articles={articles} onArticleDelete={setArticles} />
      <br />
      <ArticleForm onAdd={setArticles} />
    </main>
  );
}

export default App;
