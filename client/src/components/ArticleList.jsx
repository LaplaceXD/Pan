import Article from "./Article";

function ArticleList({ articles, onArticleDelete }) {
  return (
    <div>
      {articles.map(({ id, title, paragraph, color }) => (
        <Article
          key={id}
          title={title}
          paragraph={paragraph}
          color={color}
          onDelete={(e) => {
            onArticleDelete((articles) => articles.filter((article) => article.id !== id));
          }}
        />
      ))}
    </div>
  );
}

export default ArticleList;
