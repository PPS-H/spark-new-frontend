const data = [
  { value: "0", description: "Auditeurs uniques" },
  { value: "0", description: "Artistes inscrits" },
  { value: "0", description: "Projets financés" },
];

const StatisticsSection = () => {
  return (
    <section className="statistics-section">
      <div className="container">
        <div id="statisticsGrid" className="stats-grid">
          {data.map((statistic, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{statistic.value}</div>
              <div className="stat-description">{statistic.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
